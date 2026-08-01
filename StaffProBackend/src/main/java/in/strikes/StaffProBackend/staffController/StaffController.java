package in.strikes.StaffProBackend.staffController;

import in.strikes.StaffProBackend.Service.StaffService;
import in.strikes.StaffProBackend.dto.RequestDTO;
import in.strikes.StaffProBackend.dto.ResponseDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

//        System.out.println("hello"+req.getStaffID());

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
    public ResponseDTO loginController(@RequestBody RequestDTO req){

        ResponseDTO res = service.loginService(req);
        return res;
    }
    @PostMapping("bindPassword")
    public String passwdController(@RequestBody RequestDTO req){

        String password = service.passwdService(req);
        return password;
    }
    @PutMapping("update")
    public String UpdateController(@RequestBody RequestDTO req){

        String message= service.UpdateService(req);
        return message;
    }
}
