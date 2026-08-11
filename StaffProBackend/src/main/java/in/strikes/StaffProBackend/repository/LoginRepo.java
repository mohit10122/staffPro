package in.strikes.StaffProBackend.repository;

import in.strikes.StaffProBackend.dto.ResponseDTO;
import in.strikes.StaffProBackend.entity.Login_detail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface LoginRepo extends JpaRepository<Login_detail, Integer> {


@Query(value = "SELECT * FROM login_detail WHERE email = :email", nativeQuery = true)
Optional<Login_detail> findByEmail(@Param("email") String email);



}
