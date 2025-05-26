package com.example.demo.logInManager;

import com.example.demo.AppModules.user.User;
import com.example.demo.AppModules.user.UserServiceImp;
import com.example.demo.AppModules.user.UserType;
import com.example.demo.Error.AppException;
import com.example.demo.Facade.AdminFacade;
import com.example.demo.Facade.ClientFacade;
import com.example.demo.Facade.CompanyFacade;
import com.example.demo.Facade.CustomerFacade;

import com.example.demo.Security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.example.demo.AppModules.user.UserError;
import org.springframework.stereotype.Service;

@Service
public class LoginManager {
    private final AdminFacade adminFacade;
    private final CompanyFacade companyFacade;
    private final CustomerFacade customerFacade;

    @Autowired
    public LoginManager(AdminFacade adminFacade, CompanyFacade companyFacade, CustomerFacade customerFacade) {
        this.adminFacade = adminFacade;
        this.companyFacade = companyFacade;
        this.customerFacade = customerFacade;
    }

    // Called after Spring Security has authenticated the user
    public void setUserContext(Authentication authentication) throws AppException {
        if (authentication != null && authentication.isAuthenticated()) {
            // Get the authenticated User from Spring Security
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = userDetails.getUser();

            // This part is similar to your LoginManager's switch statement
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
        }
    }

    // Optional: Get the appropriate facade based on user type
    public ClientFacade getFacadeForUserType(UserType userType) {
        switch (userType) {
            case ADMIN:
                return adminFacade;
            case COMPANY:
                return companyFacade;
            case CUSTOMER:
                return customerFacade;
            default:
                return null;
        }
    }
}