package in.strikes.StaffProBackend.dto;

import jakarta.persistence.Transient;

import java.math.BigDecimal;
import java.time.LocalDate;

public class RequestDTO {
    private Integer StaffID;
    private String StaffName;
    private String Email;
    private String Password;
    private String Phoneno ;

    public String getPermanent_address() {
        return Permanent_address;
    }

    public void setPermanent_address(String permanent_address) {
        Permanent_address = permanent_address;
    }

    private String Permanent_address;
    public void setSalary(BigDecimal  salary) {
        Salary = salary;
    }

    private Character Active ;

    public void setStaffID(Integer staffID) {
        StaffID = staffID;
    }

    public Character getActive() {
        return Active;
    }

    public void setActive(Character active) {
        Active = active;
    }

    private String Department;

    private BigDecimal Salary ;
    private String Flag;

    private LocalDate Leaving_date ;

    public LocalDate getLeaving_date() {
        return Leaving_date;
    }

    public void setLeaving_date(LocalDate leaving_date) {
        Leaving_date = leaving_date;
    }

    public String getFlag() {
        return Flag;
    }

    public void setFlag(String flag) {
        Flag = flag;
    }

    public Integer getStaffID() {
        return StaffID;
    }



    public String getStaffName() {
        return StaffName;
    }

    public void setStaffName(String staffName) {
        StaffName = staffName;
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


    public LocalDate getJoining_Date() {
        return Joining_Date;
    }

    public void setJoining_Date(LocalDate joining_Date) {
        Joining_Date = joining_Date;
    }

    private LocalDate Joining_Date ;
}
