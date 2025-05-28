package com.example.demo.AppModules.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
     List<User> findAllByUserType(UserType userType);

     User findByEmail(String email);

}