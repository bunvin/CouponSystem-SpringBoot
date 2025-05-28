package com.example.demo.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.AppModules.user.User;
import com.example.demo.AppModules.user.UserError;
import com.example.demo.AppModules.user.UserService;
import com.example.demo.Error.AppException;
import com.example.demo.Facade.AdminFacade;
import com.example.demo.Facade.CompanyFacade;
import com.example.demo.Facade.CustomerFacade;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    // Add these facade dependencies
    @Autowired
    private AdminFacade adminFacade;

    @Autowired
    private CompanyFacade companyFacade;

    @Autowired
    private CustomerFacade customerFacade;

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequest authRequest) throws AppException {
        try {
            // Use your custom method
            User user = userService.getUserByEmailAndPassword(authRequest.getEmail(), authRequest.getPassword());

            // Verify user type
            if(user.getUserType().name() == null ? authRequest.getUserType() != null : !user.getUserType().name().equals(authRequest.getUserType())){
                throw new AppException(UserError.USER_INVALID);
            }

            // Create UserDetails
            UserDetails userDetails = new UserDetailsImpl(user);

            // Generate token - no need to use SecurityContextHolder
            final String jwt = jwtUtil.generateToken(userDetails);

            // Set up facades directly based on the User
            switch (user.getUserType()) {
                case ADMIN:
                    adminFacade.setUserLogin(user);
                    break;
                case COMPANY:
                    companyFacade.setUserLoginAndCompany(user);
                    break;
                case CUSTOMER:
                    customerFacade.setUserLoginAndCustomer(user);
                    break;
            }

            return ResponseEntity.ok(new TokenResponse(jwt));
        } catch (AppException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
    
    // @PostMapping("/register")
    // public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
    //     // Implement user registration logic
    //     // Return success or error message
    // }
}

