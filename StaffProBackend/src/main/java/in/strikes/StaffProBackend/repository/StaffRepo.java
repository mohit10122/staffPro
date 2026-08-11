package in.strikes.StaffProBackend.repository;

import in.strikes.StaffProBackend.entity.Staff_Details;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface StaffRepo extends JpaRepository<Staff_Details, Integer> {

    @Query(value = "SELECT * FROM staffdetail(:flag, :staffid)", nativeQuery = true)
    List<Staff_Details> getStaffByStoredProcedure(@Param("flag") String flag, @Param("staffid") int staffid);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Staff_Details s SET s.Active = :active, s.Leaving_date = :leavingDate WHERE s.StaffID = :staffid")
    int updateActiveAndLeavingDate(
            @Param("staffid") Integer staffid,
            @Param("active") Character active,
            @Param("leavingDate") LocalDate leavingDate
    );

    @Transactional
    @Query(value = "SELECT * FROM savestaffdetail(:active, :flag, NULL, :department, :staffName, :email, :joiningDate, :phoneno, :salary, :password, :permanentAddress)", nativeQuery = true)
    String saveStaffAndLoginViaSP(
            @Param("flag") String flag,
            @Param("active") Character active,
            @Param("department") String department,
            @Param("staffName") String staffName,
            @Param("email") String email,
            @Param("joiningDate") LocalDate joiningDate,
            @Param("phoneno") String phoneno,
            @Param("salary") BigDecimal salary,
            @Param("password") String password,
            @Param("permanentAddress") String permanentAddress
    );

    @Transactional
    @Query(value = "SELECT * FROM savestaffdetail(:active, :flag, :staffid, :department, :staffName, :email, :joiningDate, :phoneno, :salary, :password, :permanentAddress)", nativeQuery = true)
    String updateStaffSP(
            @Param("flag") String flag,
            @Param("staffid") Integer staffid,
            @Param("active") Character active,
            @Param("department") String department,
            @Param("staffName") String staffName,
            @Param("email") String email,
            @Param("joiningDate") LocalDate joiningDate,
            @Param("phoneno") String phoneno,
            @Param("salary") BigDecimal salary,
            @Param("password") String password,
            @Param("permanentAddress") String permanentAddress
    );
}