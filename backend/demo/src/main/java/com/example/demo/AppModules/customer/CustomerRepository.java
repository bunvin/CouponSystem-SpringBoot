package com.example.demo.AppModules.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Integer> {
    boolean existsByUserEmail(String userEmail);
    boolean existsByUserPassword(String userPassword);
    Customer findByUserId(int userId);
}
