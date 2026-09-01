package in.strikes.StaffProBackend.Service;

import in.strikes.StaffProBackend.dto.RequestDTO;
import in.strikes.StaffProBackend.dto.ResponseDTO;
import in.strikes.StaffProBackend.entity.Department_Table;
import in.strikes.StaffProBackend.entity.Login_detail;
import in.strikes.StaffProBackend.entity.Staff_Details;
import in.strikes.StaffProBackend.repository.DepartmentRepo;
import in.strikes.StaffProBackend.repository.LoginRepo;
import in.strikes.StaffProBackend.repository.StaffRepo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.*;

@Service
public class StaffService {

   private StaffRepo staffrepo;

    @PersistenceContext
    private EntityManager entityManager;


    @Autowired
    private LoginRepo loginRepo;
    @Autowired
    private DepartmentRepo departmentRepo;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
   public StaffService(StaffRepo staffrepo, AuthenticationManager authenticationManager, JwtService jwtService){
       this.staffrepo = staffrepo;
       this.authenticationManager=authenticationManager;
       this.jwtService=jwtService;
   }

    public Map<String, Object> loginUser(String email, String password) {
        Map<String, Object> responseMap = new HashMap<>();


        Optional<Login_detail> userOpt = loginRepo.findByEmail(email);
        if (userOpt.isEmpty()) {
            responseMap.put("StaffID", 0);
            responseMap.put("Message", "User does not exist");
            return responseMap;
        }

        Login_detail user = userOpt.get();

        if (!user.getPassword().equals(password)) {
            responseMap.put("StaffID", 0);
            responseMap.put("Message", "Invalid password");
            return responseMap;
        }

        Staff_Details staffInfo = staffrepo.findById(user.getStaffID()).orElse(null);

        if (staffInfo != null && staffInfo.getActive() != null && (staffInfo.getActive() == 'n' || staffInfo.getActive() == 'N')) {
            responseMap.put("StaffID", 0);
            responseMap.put("Message", "Your account has been deleted");
            return responseMap;
        }


        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );


        String departmentName = "User";

        if (staffInfo != null && staffInfo.getDepartment() != null) {

            if (staffInfo.getDepartment().equalsIgnoreCase("Admin")) {
                departmentName = "Admin";
            }
        }

        String role = "ROLE_" + departmentName;

        String token = jwtService.generateToken(user.getEmail(), role);


        responseMap.put("StaffID", user.getStaffID());

        responseMap.put("StaffName", user.getStaffName());
        responseMap.put("Department", departmentName);
        responseMap.put("Message", "success");
        responseMap.put("token", token);

        return responseMap;
    }
    public List<ResponseDTO> StaffServ(RequestDTO req){
        Staff_Details sd =new Staff_Details();
        sd.setStaffID(req.getStaffID());
        String flag= req.getFlag();
         List<Staff_Details> stf=staffrepo.getStaffByStoredProcedure( flag ,sd.getStaffID());
         List<ResponseDTO> resDTO= new ArrayList<>();

      for (Staff_Details staff : stf) {
            ResponseDTO res = new ResponseDTO();

            res.setStaffID(staff.getStaffID());
            res.setDepartment(staff.getDepartment());
            res.setStaffName(staff.getStaffName());

            res.setEmail(staff.getEmail());
            res.setJoining_Date(staff.getJoining_Date());
            res.setPhoneno(staff.getPhoneno());
            res.setSalary(staff.getSalary());
          res.setLeaving_Date(staff.getLeaving_date());
          res.setActive(staff.getActive());
            res.setPermanent_address(staff.getPermanent_address());

            resDTO.add(res);
        }
         return resDTO;

    }
    @Transactional
    public ResponseDTO DeleteService(RequestDTO req){
       Staff_Details std=new Staff_Details();
       std.setLeaving_date(req.getLeaving_date());
       std.setActive(req.getActive());
       std.setStaffID(req.getStaffID());
        staffrepo.updateActiveAndLeavingDate(std.getStaffID(),std.getActive() , std.getLeaving_date());
        entityManager.flush();
        entityManager.clear();
        List<Staff_Details> stf = staffrepo.getStaffByStoredProcedure(req.getFlag(), req.getStaffID());

        ResponseDTO res = new ResponseDTO();

        if (stf != null && !stf.isEmpty()) {
            Staff_Details staff = stf.get(0);

            res.setStaffID(staff.getStaffID());
            res.setDepartment(staff.getDepartment());
            res.setStaffName(staff.getStaffName());

        }
    return res;
    }

    public String saveService(RequestDTO req) {
        Staff_Details stp = new Staff_Details();
        stp.setActive(req.getActive());
        stp.setStaffID(req.getStaffID());
        stp.setDepartment(req.getDepartment());
        stp.setStaffName(req.getStaffName());
        stp.setEmail(req.getEmail());
        stp.setJoining_Date(req.getJoining_Date());
        stp.setPhoneno(req.getPhoneno());
        stp.setSalary(req.getSalary());
        stp.setPermanent_address(req.getPermanent_address());

        ResponseDTO res = new ResponseDTO();

        String message = staffrepo.saveStaffAndLoginViaSP(
                req.getFlag(),
                stp.getActive(),
                stp.getDepartment(),
                stp.getStaffName(),
                stp.getEmail(),
                stp.getJoining_Date(),
                stp.getPhoneno(),
                stp.getSalary(),
                req.getPassword(),
                req.getPermanent_address()
        );

        res.setMessage(message);
        return res.getMessage();
    }

    public List<Department_Table>  GetDepartmantService(RequestDTO req){

        String flag= req.getFlag();
        List<Department_Table>departments=departmentRepo.getDepartment( flag );

        return departments;

    }
    public String UpdateService(RequestDTO req){

        Staff_Details stp = new Staff_Details();
        stp.setActive(req.getActive());
        stp.setStaffID(req.getStaffID());
        stp.setDepartment(req.getDepartment());
        stp.setStaffName(req.getStaffName());

        stp.setEmail(req.getEmail());
        stp.setJoining_Date(req.getJoining_Date());
        stp.setPhoneno(req.getPhoneno());
        stp.setSalary(req.getSalary());
        stp.setPermanent_address(req.getPermanent_address());
        ResponseDTO res= new ResponseDTO();
        String message = staffrepo.updateStaffSP(
                req.getFlag(),
                stp.getStaffID(),
                stp.getActive(),
                stp.getDepartment(),
                stp.getStaffName(),
                stp.getEmail(),
                stp.getJoining_Date(),
                stp.getPhoneno(),
                stp.getSalary(),
                req.getPassword(),
                req.getPermanent_address()
        );
        res.setMessage(message);
        return res.getMessage();
    }

}
