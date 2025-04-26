package com.example.demo.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.AppModules.user.UserServiceImp;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private SecurityConfig securityConfig;
    @Autowired
    private UserServiceImp userService;
    @Autowired
    private PasswordEncoder passwordEncoder;


    // private final AuthenticationManager authenticationManager;
    // private final TokenConfig tokenConfig;
    // private final UserServiceImpl userService;
    // private final PasswordEncoder passwordEncoder;

    public boolean isLoginValid(LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
            ));
        } catch (BadCredentialsException e) {
            System.out.println("Invalid username or password");
            return false;
        }
        
        return true;
    }

}
