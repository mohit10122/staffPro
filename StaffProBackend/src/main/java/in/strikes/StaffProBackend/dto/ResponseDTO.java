package in.strikes.StaffProBackend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ResponseDTO {
    private Integer StaffID;
    private String StaffName;
    private String Email;
    private String Password;
    private String Phoneno;
    private String Department;

    public Character getActive() {
        return Active;
    }

    public void setActive(Character active) {
        Active = active;
    }

    private BigDecimal Salary;
    private Character Active;
    public LocalDate getLeaving_Date() {
        return Leaving_Date;
    }

    public void setLeaving_Date(LocalDate leaving_Date) {
        Leaving_Date = leaving_Date;
    }

    private String Message;
    private LocalDate Joining_Date;
    private LocalDate Leaving_Date;
    public String getPermanent_address() {
        return Permanent_address;
    }

    public void setPermanent_address(String permanent_address) {
        Permanent_address = permanent_address;
    }

    private String Permanent_address;

    public ResponseDTO() {
    }

    public ResponseDTO(Integer staffID, String staffName, String message, String department) {
        StaffID = staffID;
        StaffName = staffName;
        Message = message;
        Department =department;
    }


    public Integer getStaffID() {
        return StaffID;
    }

    public void setStaffID(Integer staffID) {
        StaffID = staffID;
    }

    public String getStaffName() {
        return StaffName;
    }

    public void setStaffName(String staffName) {
        StaffName = staffName;
    }

    public String getMessage() {
        return Message;
    }

    public void setMessage(String message) {
        Message = message;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        Password = password;
    }

    public String getPhoneno() {
        return Phoneno;
    }

    public void setPhoneno(String phoneno) {
        Phoneno = phoneno;
    }

    public String getDepartment() {
        return Department;
    }

    public void setDepartment(String department) {
        Department = department;
    }

    public BigDecimal  getSalary() {
        return Salary;
    }

    public void setSalary(BigDecimal  salary) {
        Salary = salary;
    }

    public LocalDate getJoining_Date() {
        return Joining_Date;
    }

    public void setJoining_Date(LocalDate joining_Date) {
        Joining_Date = joining_Date;
    }
}