package in.strikes.StaffProBackend.repository;

import in.strikes.StaffProBackend.entity.Department_Table;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepo extends JpaRepository<Department_Table, Long> {
        @Query(value = "SELECT * from getdepartment(:flag)", nativeQuery = true)
        List<Department_Table> getDepartment(@Param("flag") String flag);

}
