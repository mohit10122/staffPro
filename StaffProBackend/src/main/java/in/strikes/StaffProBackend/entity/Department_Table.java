package in.strikes.StaffProBackend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "department_table")
public class Department_Table {

    @Column(name = "department")
    private String Department;

    public String getDepartment() {
        return Department;
    }

    public void setDepartment(String department) {
        Department = department;
    }

    public Integer getDepartmentID() {
        return DepartmentID;
    }

    public void setDepartmentID(Integer departmentID) {
        DepartmentID = departmentID;
    }

    @Id
    @Column(name = "departmentid")
    private Integer DepartmentID;
}
