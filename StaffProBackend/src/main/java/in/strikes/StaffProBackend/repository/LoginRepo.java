package in.strikes.StaffProBackend.repository;

import in.strikes.StaffProBackend.dto.ResponseDTO;
import in.strikes.StaffProBackend.entity.Login_detail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface LoginRepo extends JpaRepository<Login_detail, Integer> {

    @Query(value = "SELECT * FROM checklogin(:email, :password)", nativeQuery = true)
    ResponseDTO checkLoginViaSP(
            @Param("email") String email,
            @Param("password") String password
    );


}
