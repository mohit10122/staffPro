package in.strikes.StaffProBackend.entity;

import in.strikes.StaffProBackend.Role;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "login_detail")
public class Login_detail implements UserDetails {

    @Id
    @Column(name = "staffid")
    private Integer StaffID;
    @Column(name = "staff_name")
    private String StaffName;
    @Column(name = "email",unique = true, nullable = false)
    private String Email;
    @Column(name = "password")
    private String Password;

    public void setStaffID(Integer staffID) {
        StaffID = staffID;
    }

    public Integer getStaffID() {
        return StaffID;
    }

    public String getStaffName() {
        return StaffName;
    }

    public void setStaffName(String staffName) {
        StaffName = staffName;
    }
    @Override
    public String getPassword() {
        return Password;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public void setPassword(String password) {
        Password = password;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return List.of(new SimpleGrantedAuthority("ROLE_User"));
    }

    @Override
    public String getUsername() {
        return Email;
    }


    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }

}
