package com.example.demo.AppModules.user;

import java.util.List;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService{
    private final UserRepository userRepository;
    
    @Override
    public User addUser(User user) throws Exception {
        if(this.userRepository.existsById(user.getId()) == true){
            throw new Exception("FAILED: user already exist");
        }
         User newUser = this.userRepository.save(user);
         return newUser;
    }
    
    @Override
    public void updateUser(User user, int userId) throws Exception {
        User userFromDb = this.getSingleUser(userId);
        if (userFromDb == null){
            throw new Exception("FAILED: user ID not found");
        }
        user.setId(userFromDb.getId());
        this.userRepository.save(user);
    }
    
    @Override
    public void deleteUser(int userId) throws Exception {
        if(this.userRepository.existsById(userId)){
            this.userRepository.deleteById(userId);
        }else{
            throw new Exception("FAILED: user ID not found");
        }
    }
    @Override
    public User getSingleUser(int userId) throws Exception {
        return this.userRepository.findById(userId).orElseThrow(() -> new Exception("Failed: User not found"));
    }
    @Override
    public List<User> getUserList(int userType) {
        return this.userRepository.findAllByUserType(userType);
    }
    @Override
    public List<User> getUserList() {
        return this.userRepository.findAll();
    }
}