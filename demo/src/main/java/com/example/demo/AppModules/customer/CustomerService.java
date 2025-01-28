package com.example.demo.AppModules.customer;

import com.example.demo.AppModules.user.User;
import com.example.demo.Error.AppException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CustomerService {
    Customer addCustomer(Customer customer)  throws AppException;
    void updateCustomer(Customer customer, int customerId) throws AppException;
    void deleteCustomer(int customerId) throws AppException;
    Customer getSingleCustomer(int customerID) throws AppException;
    List<Customer> getAllCustomer();

    boolean isCustomerExist(User user) throws AppException;
    boolean isCustomerEmailExist(String email) throws AppException;
    boolean isCustomerPasswordExist(String password) throws AppException;
}
