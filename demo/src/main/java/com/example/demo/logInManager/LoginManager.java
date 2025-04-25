package com.example.demo.logInManager;

import com.example.demo.AppModules.user.User;
import com.example.demo.AppModules.user.UserServiceImp;
import com.example.demo.AppModules.user.UserType;
import com.example.demo.Error.AppException;
import com.example.demo.Facade.AdminFacade;
import com.example.demo.Facade.ClientFacade;
import com.example.demo.Facade.CompanyFacade;
import com.example.demo.Facade.CustomerFacade;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.demo.AppModules.user.UserError;

@Component
public class LoginManager {
    private final UserServiceImp userServiceImp;
    private final AdminFacade adminFacade;
    private final CompanyFacade companyFacade;
    private final CustomerFacade customerFacade;

    //init threw constructor to avoid using New
    @Autowired
    public LoginManager(UserServiceImp userServiceImp, AdminFacade adminFacade, CompanyFacade companyFacade, CustomerFacade customerFacade) {
        this.userServiceImp = userServiceImp;
        this.adminFacade = adminFacade;
        this.companyFacade = companyFacade;
        this.customerFacade = customerFacade;
    }


    public ClientFacade login(String email, String password, UserType userType) throws AppException {
        User user = userServiceImp.getUserByEmailAndPassword(email, password);
        if(user.getUserType() != userType){
            throw new AppException(UserError.USER_TYPE_INCURRECT);
        }
        if(user != null){
            switch(user.getUserType()){
                case ADMIN:
                    adminFacade.setUserLogin(user);
                    return adminFacade;
                case COMPANY:
                    companyFacade.setUserLogin(user);
                    return companyFacade;
                case CUSTOMER:
                    customerFacade.setUserLogin(user);
                    return customerFacade;
                }
            } return null;
        }
    
}
