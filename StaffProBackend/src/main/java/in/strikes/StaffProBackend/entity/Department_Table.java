package in.strikes.StaffProBackend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Department_Table {

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
    private Integer DepartmentID;
}
