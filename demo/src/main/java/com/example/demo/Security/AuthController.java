package com.example.demo.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.AppModules.user.User;
import com.example.demo.AppModules.user.UserError;
import com.example.demo.AppModules.user.UserService;
import com.example.demo.Error.AppException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    
    @Autowired
    private UserService userService; 
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequest authRequest) throws AppException {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    authRequest.getEmail(), 
                    authRequest.getPassword()
                )
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
        
        final User user = userService.getUserByEmail(authRequest.getEmail());

        //User not null, types not equal => invalid request       
        if(user.getUserType().name() == null ? authRequest.getUserType() != null : !user.getUserType().name().equals(authRequest.getUserType())){
            throw new AppException(UserError.USER_INVALID);
        }

        final String jwt = jwtUtil.generateToken(user);
        
        return ResponseEntity.ok(new TokenResponse(jwt));
    }
    
    // @PostMapping("/register")
    // public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
    //     // Implement user registration logic
    //     // Return success or error message
    // }
}

