package com.example.demo.Facade;

import com.example.demo.AppModules.company.CompanyServiceImp;
import com.example.demo.AppModules.coupon.CouponServiceImp;
import com.example.demo.AppModules.customer.CustomerServiceImp;
import com.example.demo.AppModules.user.UserServiceImp;
import com.example.demo.AppModules.user.User;
import com.example.demo.Error.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public abstract class ClientFacade {
    @Autowired
    private UserServiceImp userServiceImp;
    @Autowired
    private CompanyServiceImp companyServiceImp;
    @Autowired
    private CustomerServiceImp customerServiceImp;
    @Autowired
    private CouponServiceImp couponServiceImp;

    public User login(String email, String password) throws AppException{
        return userServiceImp.getUserByEmailAndPassword(email,password);
    }

    public UserServiceImp getUserServiceImp() {
        return userServiceImp;
    }

    public CompanyServiceImp getCompanyServiceImp() {
        return companyServiceImp;
    }

    public CustomerServiceImp getCustomerServiceImp() {
        return customerServiceImp;
    }

    public CouponServiceImp getCouponServiceImp() {
        return couponServiceImp;
    }
}
