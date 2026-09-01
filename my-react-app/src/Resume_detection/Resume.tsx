import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Resume.css'; 

interface AnalysisResult {
    match_percentage: number;
    strong_points: string[];
    weak_points: string[];
}

interface ChatMessage {
    sender: 'user' | 'ai';
    question?: string;
    answer?: string;
    error?: string;
}

function Resume() {
    const navigate = useNavigate();
    
    const [position, setPosition] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const [question, setQuestion] = useState<string>('');
    const [chatLoading, setChatLoading] = useState<boolean>(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, chatLoading]);

    const handleApplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!file || !position) {
            toast.warning("Bhai, position aur resume dono select karna zaroori hai!", { autoClose: 3000 });
            return;
        }

        setIsAnalyzing(true);
        setResult(null); 
        
        const formData = new FormData();
        formData.append("position", position);
        formData.append("file", file);

        try {
            toast.info("AI is analyzing your resume...", { autoClose: 2000 });
            
            const response = await fetch("http://localhost:8000/analyze-resume", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Backend response not ok");

            const data: AnalysisResult = await response.json();
            setResult(data);
            toast.success("AI Analysis Complete!", { autoClose: 3000 });
        } catch (error) {
            console.error("Error agaya:", error);
            toast.error("FastAPI Backend se connect nahi ho paya. Server check karo.", { autoClose: 4000 });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            
            if (selectedFile.type !== "application/pdf") {
                toast.error("Only PDF files are allowed. Please upload a valid PDF document.", { autoClose: 3000 });
                e.target.value = ""; 
                setFile(null);       
                return;             
            }

            setFile(selectedFile);
        }
    };

    const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!question.trim()) return;

        const currentQuestion = question;
        setQuestion('');
        setChatLoading(true);

        setChatHistory(prev => [...prev, { sender: 'user', question: currentQuestion }]);

        try {
            const response = await fetch("http://localhost:8000/ask-db", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: currentQuestion }),
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                setChatHistory(prev => [...prev, { 
                    sender: 'ai', 
                    error: data.error || "Something went wrong with the database query." 
                }]);
                toast.error(data.error || "Query blocked or failed!");
            } else {
                setChatHistory(prev => [...prev, { 
                    sender: 'ai', 
                    answer: data.answer 
                }]);
            }
        } catch (error) {
            console.error("Connection error:", error);
            setChatHistory(prev => [...prev, { 
                sender: 'ai', 
                error: "Failed to connect to FastAPI backend server." 
            }]);
            toast.error("Backend connection failed.");
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '30px', padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif', alignItems: 'flex-start' }}>
            
            <div style={{ flex: 1, backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Apply for a Position</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
                    Upload your resume and let our AI evaluate your profile.
                </p>
                
                <form onSubmit={handleApplySubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Select Position</label>
                        <select 
                            value={position} 
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPosition(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        >
                            <option value="">-- Choose Position --</option>
                            <option value="Java SpringBoot Developer">Backend Developer</option>
                            <option value="React Frontend Developer">Frontend Developer</option>
                            <option value="Fullstack Developer">Fullstack Developer</option>
                            <option value="AI/ML Engineer">AI/ML Engineer</option>
                            <option value="HR">HR</option>
                            <option value="Python (AI/ML) Intern">Python (AI/ML) Intern</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Upload Resume (PDF only)</label>
                        <input 
                            type="file" 
                            accept=".pdf" 
                            onChange={handleFileChange} 
                            style={{ width: '100%', padding: '5px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button 
                            type="submit" 
                            disabled={isAnalyzing} 
                            style={{ 
                                flex: 1, padding: '12px', backgroundColor: '#007bff', 
                                color: 'white', border: 'none', borderRadius: '5px', 
                                cursor: isAnalyzing ? 'not-allowed' : 'pointer', fontWeight: 'bold' 
                            }}
                        >
                            {isAnalyzing ? "Analyzing AI Data..." : "Submit Application"}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => navigate('/login')} 
                            style={{ 
                                flex: 1, padding: '12px', backgroundColor: '#dc3545', 
                                color: 'white', border: 'none', borderRadius: '5px', 
                                cursor: 'pointer', fontWeight: 'bold' 
                            }}
                        >
                            Back to Login
                        </button>
                    </div>
                </form>

                {result && (
                    <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#166534', textAlign: 'center' }}>AI Analysis Result</h3>
                        
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Match Score: </span>
                            <span style={{ 
                                fontSize: '24px', 
                                fontWeight: 'bold', 
                                color: result.match_percentage > 60 ? 'green' : 'red' 
                            }}>
                                {result.match_percentage}%
                            </span>
                        </div>
                        
                        <div>
                            <p style={{ fontWeight: 'bold', color: '#15803d', borderBottom: '1px solid #15803d', paddingBottom: '5px' }}>
                                ✅ Strong Points:
                            </p>
                            <ul style={{ paddingLeft: '20px', fontSize: '15px', color: '#333' }}>
                                {result.strong_points?.map((point: string, index: number) => <li key={index} style={{ marginBottom: '5px' }}>{point}</li>)}
                            </ul>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <p style={{ fontWeight: 'bold', color: '#b91c1c', borderBottom: '1px solid #b91c1c', paddingBottom: '5px' }}>
                                ⚠️ Weak Points / Missing Skills:
                            </p>
                            <ul style={{ paddingLeft: '20px', fontSize: '15px', color: '#333' }}>
                                {result.weak_points?.map((point: string, index: number) => <li key={index} style={{ marginBottom: '5px' }}>{point}</li>)}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ flex: 1, backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>AI Database Chat Assistant</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
                    Ask anything about the company database in natural language.
                </p>

                <div style={{ 
                    height: '420px', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    padding: '15px', 
                    overflowY: 'auto', 
                    backgroundColor: '#f8f9fa', 
                    marginBottom: '20px' 
                }}>
                    {chatHistory.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#888', marginTop: '150px' }}>
                            <p>No chat messages yet. Try asking: <br/><i>"Show me all active staff members"</i></p>
                        </div>
                    ) : (
                        chatHistory.map((msg, index) => (
                            <div key={index} style={{ marginBottom: '15px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                                <div style={{ 
                                    display: 'inline-block', 
                                    maxWidth: '85%', 
                                    padding: '12px 16px', 
                                    borderRadius: '10px', 
                                    backgroundColor: msg.sender === 'user' ? '#007bff' : '#fff',
                                    color: msg.sender === 'user' ? '#fff' : '#333',
                                    boxShadow: msg.sender === 'ai' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                                    border: msg.sender === 'ai' ? '1px solid #e0e0e0' : 'none',
                                    textAlign: 'left',
                                    fontSize: '15px'
                                }}>
                                    {msg.sender === 'user' ? (
                                        <p style={{ margin: 0, fontWeight: 'bold' }}>{msg.question}</p>
                                    ) : (
                                        <div>
                                            {msg.error ? (
                                                <p style={{ margin: 0, color: '#dc3545', fontWeight: 'bold' }}>❌ {msg.error}</p>
                                            ) : (
                                                <p style={{ margin: 0, fontWeight: '500', color: '#155724' }}>
                                                    🦐 {msg.answer}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    {chatLoading && (
                        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                            <div style={{ display: 'inline-block', padding: '10px 15px', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #ddd', color: '#666' }}>
                                <i>AI is thinking...</i>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="text" 
                        value={question} 
                        onChange={(e) => setQuestion(e.target.value)} 
                        placeholder="Ask something about database..." 
                        style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '15px' }}
                        disabled={chatLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={chatLoading}
                        style={{ padding: '12px 25px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: chatLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                    >
                        {chatLoading ? 'Asking...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Resume;