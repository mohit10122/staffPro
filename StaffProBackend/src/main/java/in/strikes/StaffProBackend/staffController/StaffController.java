package in.strikes.StaffProBackend.staffController;

import in.strikes.StaffProBackend.Service.StaffService;
import in.strikes.StaffProBackend.dto.RequestDTO;
import in.strikes.StaffProBackend.dto.ResponseDTO;
import in.strikes.StaffProBackend.entity.Department_Table;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("Api/Staff")
public class StaffController {
    public StaffService service;

    public StaffController(StaffService service){
        this.service=service;
    }

    @PostMapping("getDetail")
    public List<ResponseDTO> getStaff(@RequestBody RequestDTO req){
        List<ResponseDTO> res= res=service.StaffServ(req);

//        System.out.println("hello"+req.getStaffid());

        return res;
    }
    @DeleteMapping("deleteStaff")
    public ResponseDTO DeleteController(@RequestBody RequestDTO req){
        ResponseDTO  res=service.DeleteService(req);
        return res;
    }

    @PostMapping("save")
    public String SaveController(@RequestBody RequestDTO req){

       String message= service.saveService(req);
return message;
    }
    @PostMapping("login")
    public ResponseEntity<Map<String, Object>> loginController(@RequestBody RequestDTO req){
        String email = req.getEmail();
        String password = req.getPassword();
        Map<String, Object> response = service.loginUser(email, password);
        return ResponseEntity.ok(response);
    }
    @PostMapping("getDepartment")
    public List<Department_Table> departmentController(@RequestBody RequestDTO req){

         List<Department_Table>departments = service.GetDepartmantService(req);
        return departments;
    }
    @PutMapping("update")
    public String UpdateController(@RequestBody RequestDTO req){

        String message= service.UpdateService(req);
        return message;
    }
}
