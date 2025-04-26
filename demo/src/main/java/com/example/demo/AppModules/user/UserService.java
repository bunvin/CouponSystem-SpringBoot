package com.example.demo.AppModules.user;

import java.util.List;

import com.example.demo.AppModules.company.Company;
import com.example.demo.AppModules.customer.Customer;
import com.example.demo.Error.AppException;
import org.springframework.stereotype.Service;


@Service
public interface UserService {
    User addUser(User user) throws Exception;
    void updateUser(User user, int userId) throws Exception;
    void deleteUser(int userId) throws Exception;
    List<User> getAllUsers();
    User getSingleUser(int userId) throws Exception;
    User getUserByEmail(String email) throws AppException;

    List<User> getAllUsersByUserType(UserType userType);
    User getUserByEmailAndPassword(String email, String password) throws AppException;


    Company getCompanyByUserId(int userId) throws AppException;
    Customer getCustomerByUserId(int userId) throws AppException;

}
