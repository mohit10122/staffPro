import os
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from pypdf import PdfReader
from pydantic import BaseModel
from supabase import create_client, Client
import json
import uvicorn


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def extract_text_from_pdf(fileobj):
    pdf_reader = PdfReader(fileobj)
    text = ""
    for page in pdf_reader.pages:
        extracted_text = page.extract_text()
        if extracted_text:
            text += extracted_text
    return text

@app.post("/analyze-resume")
async def analyze_resume(position: str = Form(...), file: UploadFile = File(...)):
    try:
        resume_text = extract_text_from_pdf(file.file)
        prompt = f"""
        Analyze the following resume for the position of "{position}".
        Resume Text: {resume_text}
        
        Return ONLY a JSON object with this exact structure (no markdown tags, just pure JSON):
        {{
            "match_percentage": 85,
            "strong_points": ["skill 1", "experience 1"],
            "weak_points": ["missing skill 1", "gap 1"]
        }}
        """
        
        response = model.generate_content(prompt)
        raw_text = response.text.strip().replace('```json', '').replace('```', '')
        return json.loads(raw_text)
        
    except Exception as e:
        return {"error": str(e)}

class DBQueryRequest(BaseModel):
    question: str

BLOCKED_WORDS = ["password", "salary", "drop", "delete", "truncate", "update", "insert", "admin hash"]

@app.post("/ask-db")
@app.post("/ask-db")
async def ask_database(data: DBQueryRequest):

    user_query_lower = data.question.lower()
    for word in BLOCKED_WORDS:
        if word in user_query_lower:
            return {"error": f"Access denied: Query contains restricted term '{word}'."}
            
    try:
        schema_context = """
        You are a PostgreSQL expert. The database has the following tables:
        1. department_table (stores department info)
        2. staff_details (stores employee and staff information)
        staff_details table has a column named "active" which takes a char value 'y' and 'n'. 'y' indicates the user is currently working in the company
        """
        
        prompt = f"""
        {schema_context}
        User Question: "{data.question}"
        
        CRITICAL INSTRUCTIONS:
        1. Map synonyms automatically (e.g., if user asks for "employees", use the "staff_details" table).
        2. Write a precise PostgreSQL query to answer the question.
        3. OUTPUT EXACTLY AND ONLY THE RAW SQL QUERY. 
        4. Do NOT add any introductory words, markdown tags, backticks, or explanations. Start immediately with SELECT.
        """
        
        ai_response = model.generate_content(prompt)
        
    
        sql_query = ai_response.text.strip().replace('```sql', '').replace('```', '').strip().rstrip(';')
        sql_query = " ".join(sql_query.split()) 
        
     
        sql_lower = sql_query.lower()
        if not sql_lower.startswith("select"):
            print("DEBUG - AI Output was:", sql_query)
            return {"error": "Please rephrase your question. (Error: AI did not generate a valid SELECT query)"}
            
        dangerous_keywords = ["drop ", "delete ", "update ", "insert ", "alter ", "truncate "]
        if any(bad in sql_lower for bad in dangerous_keywords):
            return {"error": "This request cannot be processed. Only read-only operations are permitted."}
      
        db_response = supabase.rpc('execute_sql', {'query': sql_query}).execute()
        
       
        format_prompt = f"""
        You are a highly efficient AI data assistant. 
        
        User Question: "{data.question}"
        Raw Database Result: {db_response.data}
        
        CRITICAL RULES FOR YOUR RESPONSE:
        1. Context & Synonyms: Treat 'staff' as 'employee', and treat 'department', 'position', and 'job' as related/interchangeable terms based on the user's question.
        2. Format: Write ONLY ONE short, conversational, and direct sentence answering the question.
        3. Strict Ban: DO NOT output any JSON, SQL, or code. 
        4. No Markdown: DO NOT use asterisks (**), bolding, bullet points, or backticks. Return pure, raw text.
        5. No Filler: DO NOT use introductory phrases like "Based on the database," or "The result shows". Just give the direct answer.
        6. Empty Data: If the database result is empty (e.g., [], None, or 0), simply reply: "I couldn't find any data for that."
        
        Example 1:
        Result: [{{"count": 39}}] -> Output: There are 39 active employees.
        
        Example 2:
        Result: [{{"departmentname": "HR"}}] -> Output: The HR department handles this job.
        
        Now, provide the final plain text response for the current user question.
        """
        
        nl_answer = model.generate_content(format_prompt).text.strip()
        
   
        return {
            "answer": nl_answer
        }
        
    except Exception as e:
        return {"error": str(e)}