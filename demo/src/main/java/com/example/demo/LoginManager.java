package com.example.demo;

import com.example.demo.AppModules.user.User;
import com.example.demo.AppModules.user.UserServiceImp;
import com.example.demo.Error.AppException;
import com.example.demo.Facade.AdminFacade;
import com.example.demo.Facade.ClientFacade;
import com.example.demo.Facade.CompanyFacade;
import com.example.demo.Facade.CustomerFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class LoginManager {
    private final UserServiceImp userServiceImp;

    @Autowired
    public LoginManager(UserServiceImp userServiceImp) {
        this.userServiceImp = userServiceImp;
    }

    public ClientFacade login(String email, String password) throws AppException {
        User user = userServiceImp.getUserByEmailAndPassword(email, password);
        if(user != null){
            switch(user.getUserType()){
                case ADMIN:
                    AdminFacade adminFacade = new AdminFacade(user);
                    return adminFacade;
                case COMPANY:
                    CompanyFacade companyFacade = new CompanyFacade(user);
                    return companyFacade;
                case CUSTOMER:
                    CustomerFacade customerFacade = new CustomerFacade(user);
                    return customerFacade;
                }
            } return null;
        }
    
}
