package com.example.demo.AppModules.user;

import java.util.List;

import com.example.demo.Error.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImp implements UserService{
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public User addUser(User user) throws AppException {
        if(this.userRepository.existsById(user.getId()) == true){
            throw new AppException(UserError.USER_ALREADY_EXISTS);
        }
         User newUser = this.userRepository.save(user);
         return newUser;
    }
    
    @Override
    public void updateUser(User user, int userId) throws Exception {
        User userFromDb = this.getSingleUser(userId);
        if (userFromDb == null){
            throw new AppException(UserError.USER_NOT_FOUND);
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
    public User getSingleUser(int userId) throws Exception {
        return this.userRepository.findById(userId).orElseThrow(() -> new AppException(UserError.USER_NOT_FOUND));
    }
    @Override
    public List<User> getUserList(int userType) 
    {
        return null;
        // return this.userRepository.findAllByUserType(userType);
    }
    @Override
    public List<User> getUserList() {
        return this.userRepository.findAll();
    }
}