package com.example.demo.AppModules.user;

import java.util.List;

import com.example.demo.AppModules.company.Company;
import com.example.demo.AppModules.company.CompanyServiceImp;
import com.example.demo.AppModules.customer.Customer;
import com.example.demo.AppModules.customer.CustomerServiceImp;
import com.example.demo.Error.AppException;

import org.hibernate.validator.internal.util.stereotypes.Lazy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImp implements UserService{
    @Autowired
    private UserRepository userRepository;
    @Lazy
    @Autowired
    private CompanyServiceImp companyService;
    @Lazy
    @Autowired
    private CustomerServiceImp customerService;
    

    @Value("${adminEmail}")
    private String adminEmail;
    @Value("${adminPassword}")
    private String adminPassword;
    
    @Override
    public User addUser(User user) throws AppException {
        if(this.userRepository.existsById(user.getId())){
            throw new AppException(UserError.USER_ALREADY_EXISTS);
        }
        //check if admin
        if(user.getUserType().equals(UserType.ADMIN)){
            if(user.getEmail().equals(adminEmail) && user.getPassword().equals(adminPassword)){
                return this.userRepository.save(user);
            }else{
                throw new AppException(UserError.USER_NOT_ADMIN);
            }
        }
         return this.userRepository.save(user);
    }

    @Override
    public User getSingleUser(int userId) throws AppException {
        return this.userRepository.findById(userId)
                .orElseThrow(() -> new AppException(UserError.USER_NOT_FOUND));
    }

    @Override
    public void updateUser(User user, int userId) throws AppException {
        User userFromDb = this.getSingleUser(userId);
        if(user.getEmail().equals(userFromDb.getEmail())){
            throw new AppException(UserError.USER_EMAIL_NOT_UPDATABLE);
        }
        user.setId(userFromDb.getId());
        this.userRepository.save(user);
    }
    
    @Override
    public void deleteUser(int userId) throws AppException {
        if(this.userRepository.existsById(userId)){
            this.userRepository.deleteById(userId);
        }else{
            throw new AppException(UserError.USER_NOT_FOUND);
        }
    }
    @Override
    public List<User> getAllUsersByUserType(UserType userType) {
        return this.userRepository.findAllByUserType(userType);
    }

    @Override
    public User getUserByEmailAndPassword(String email, String password) throws AppException{
        User loginUser = this.userRepository.findByEmailAndPassword(email, password);
        if(loginUser == null){
            throw new AppException(UserError.USER_INVALID);
        }
        return loginUser;
    }

    @Override
    public User getUserByEmail(String email) throws AppException{
        User loginUser = this.userRepository.findByEmail(email);
        if(loginUser == null){
            throw new AppException(UserError.USER_INVALID);
        }
        return loginUser;
    }

    @Override
    public List<User> getAllUsers() {
        return this.userRepository.findAll();
    }

    @Override
    public Company getCompanyByUserId(int userId) throws AppException {
        return this.companyService.getCompanyByUserId(userId);
    }

    @Override
    public Customer getCustomerByUserId(int userId) throws AppException {
        return this.customerService.getCustomerByUserId(userId);
    }

}