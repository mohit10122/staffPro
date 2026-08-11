package in.strikes.StaffProBackend.entity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "staff_details")
public class Staff_Details {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "staffid")
    private Integer StaffID ;
    @Column(name = "staff_name")
    private String StaffName ;
    @Column(name = "phoneno")
    private String Phoneno ;
    @Column(name = "email")
    private String Email ;
    @Column(name = "department")
    private String Department;
    @Column(name = "active")
    private Character Active ;
    @Column(name = "leaving_date")
    private LocalDate Leaving_date ;
    @Column(name="salary",precision = 13, scale = 2)
    private BigDecimal Salary ;
    @Column(name = "joining_date")
    private LocalDate Joining_Date ;
    public String getPermanent_address() {
        return Permanent_address;
    }

    public void setPermanent_address(String permanent_address) {
        Permanent_address = permanent_address;
    }
    @Column(name = "permanent_address")
    private String Permanent_address;

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

    public String getPhoneno() {
        return Phoneno;
    }

    public void setPhoneno(String phoneno) {
        Phoneno = phoneno;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
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

    public Character getActive() {
        return Active;
    }

    public void setActive(Character active) {
        Active = active;
    }




    public LocalDate getLeaving_date() {
        return Leaving_date;
    }

    public void setLeaving_date(LocalDate leaving_date) {
        Leaving_date = leaving_date;
    }
}
