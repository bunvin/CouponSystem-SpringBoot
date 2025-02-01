package com.example.demo.Facade;

import com.example.demo.AppModules.user.UserServiceImp;
import com.example.demo.AppModules.user.User;
import com.example.demo.Error.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public abstract class ClientFacade {
    @Autowired
    private static UserServiceImp userServiceImp;

    public User login(String email, String password) throws AppException{
        return userServiceImp.getUserByEmailAndPassword(email,password);
    }
}
