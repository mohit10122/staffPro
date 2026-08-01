package in.strikes.StaffProBackend.repository;

import in.strikes.StaffProBackend.dto.ResponseDTO;
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
    @Query(value = "EXEC dbo.sp_StaffDetail @Flag = :flag, @StaffID = :staffId", nativeQuery = true)
    List<Staff_Details> getStaffByStoredProcedure(@Param("flag") String flag, @Param("staffId") int staffId);
    @Query(value = "EXEC dbo.sp_StaffDetail @Flag = :flag, @StaffID = :staffId", nativeQuery = true)
    String getPasswordSP(@Param("flag") String flag, @Param("staffId") int staffId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Staff_Details s SET s.Active = :active, s.Leaving_date = :leavingDate WHERE s.StaffID = :staffId")
    int updateActiveAndLeavingDate(
            @Param("staffId") Integer staffId,
            @Param("active") Character active,
            @Param("leavingDate") LocalDate leavingDate
    );
    @Transactional
    @Query(value = "DECLARE @OutID INT, @OutMsg VARCHAR(100); " +
            "EXEC dbo.sp_SAveStaffDetail " +
            "@Active = :active, " +
            "@Flag = :flag, " +
            "@StaffID = @OutID OUTPUT, " +
            "@Department = :department, " +
            "@StaffName = :staffName, " +
            "@Email = :email, " +
            "@Joining_Date = :joiningDate, " +
            "@Phoneno = :phoneno, " +
            "@Salary = :salary, " +
            "@Password = :password, " +
            "@Permanent_address = :permanentAddress, " +
            "@Repeat = @OutMsg OUTPUT; " +
            "SELECT @OutMsg;",
            nativeQuery = true)
    String saveStaffAndLoginViaSP(
            @Param("flag") String flag,
            @Param("active") Character active,
            @Param("department") String department,
            @Param("staffName") String staffName,
            @Param("email") String email,
            @Param("joiningDate") LocalDate joiningDate,
            @Param("phoneno") String phoneno,
            @Param("salary")BigDecimal  salary,
            @Param("password") String password,
            @Param("permanentAddress") String permanentAddress
    );
    @Transactional
    @Query(value = "DECLARE @OutID INT, @OutMsg VARCHAR(100); " +
            "SET @OutID = :staffId; " +
            "EXEC dbo.sp_SAveStaffDetail " +
            "@Active = :active, " +
            "@Flag = :flag, " +
            "@StaffID = @OutID OUTPUT, " +
            "@Department = :department, " +
            "@StaffName = :staffName, " +
            "@Email = :email, " +
            "@Joining_Date = :joiningDate, " +
            "@Phoneno = :phoneno, " +
            "@Salary = :salary, " +
            "@Password = :password, " +
            "@Permanent_address = :permanentAddress, " +
            "@Repeat = @OutMsg OUTPUT; " +
            "SELECT @OutMsg;",
            nativeQuery = true)
    String updateStaffSP(
            @Param("flag") String flag,
            @Param("staffId") Integer staffId,
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
