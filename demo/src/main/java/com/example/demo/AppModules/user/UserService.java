package com.example.demo.AppModules.user;

import java.util.List;
import org.springframework.stereotype.Service;


@Service
public interface UserService {
    User addUser(User user) throws Exception;
    void updateUser(User user, int userId) throws Exception;
    void deleteUser(int userId) throws Exception;
    List<User> getUserList(int userType);
    List<User> getUserList();
    User getSingleUser(int userId) throws Exception;
}
