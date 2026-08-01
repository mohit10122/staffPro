package in.strikes.StaffProBackend.Service;

import in.strikes.StaffProBackend.dto.RequestDTO;
import in.strikes.StaffProBackend.dto.ResponseDTO;
import in.strikes.StaffProBackend.entity.Department_Table;
import in.strikes.StaffProBackend.entity.Login_detail;
import in.strikes.StaffProBackend.entity.Staff_Details;
import in.strikes.StaffProBackend.repository.LoginRepo;
import in.strikes.StaffProBackend.repository.StaffRepo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.List;

@Service
public class StaffService {

   private StaffRepo staffrepo;

    @PersistenceContext
    private EntityManager entityManager;


    @Autowired
    private LoginRepo loginRepo;

   public StaffService(StaffRepo staffrepo){
       this.staffrepo = staffrepo;
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

    public ResponseDTO loginService(RequestDTO req){
       Login_detail log =new Login_detail();
       log.setEmail(req.getEmail());
        log.setPassword(req.getPassword());

        ResponseDTO res = loginRepo.checkLoginViaSP(
                log.getEmail(),
                log.getPassword()
        );

        return res;
    }
    public String  passwdService(RequestDTO req){
        Staff_Details sd =new Staff_Details();
        sd.setStaffID(req.getStaffID());
        String flag= req.getFlag();
        String password =staffrepo.getPasswordSP( flag ,sd.getStaffID());

        return password;

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
