package com.example.demo;

import com.example.demo.AppModules.user.User;
import com.example.demo.AppModules.user.UserServiceImp;
import com.example.demo.Error.AppException;
import com.example.demo.Facade.AdminFacade;
import com.example.demo.Facade.ClientFacade;
import com.example.demo.Facade.CompanyFacade;
import com.example.demo.Facade.CustomerFacade;
import org.springframework.stereotype.Component;

import static com.example.demo.AppModules.user.UserType.*;

@Component
public class LoginManager {
    UserServiceImp userServiceImp = new UserServiceImp();

    public ClientFacade login(String email, String password) throws AppException {
        User user = userServiceImp.getUserByEmailAndPassword(email, password);
        if(user != null){
            switch(user.getUserType()){
                case ADMIN:
                    return new AdminFacade();
                case COMPANY:
                    return new CompanyFacade();
                case CUSTOMER:
                    return new CustomerFacade();
                }
            } return null;
        }
    
}
