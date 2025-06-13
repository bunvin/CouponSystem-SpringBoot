package com.example.demo.AppModules.customer;

import com.example.demo.AppModules.user.User;
import com.example.demo.AppModules.user.UserServiceImp;
import com.example.demo.Error.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class CustomerServiceImp implements CustomerService{
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    @Lazy
    private UserServiceImp userService;

    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;


    @Override
    public Customer addCustomer(Customer customer) throws AppException {
        if (customer.getUser() != null && customer.getUser().getId() == 0){
            User userSaved = userService.addUser(customer.getUser());
            customer.setUser(userSaved);
        }

        if(this.customerRepository.existsById(customer.getId())){
            throw new AppException(CustomerError.CUSTOMER_ALREADY_EXIST);
        }
        if(this.customerRepository.existsByUserEmail(customer.getUser().getEmail())){
            throw new AppException(CustomerError.CUSTOMER_EMAIL_IN_USE);
        }
        return this.customerRepository.save(customer);
    }

    @Override
    public Customer getSingleCustomer(int customerID) throws AppException {
        return this.customerRepository.findById(customerID)
                .orElseThrow(() -> new AppException(CustomerError.CUSTOMER_NOT_FOUND));
    }

    @Override
    public void updateCustomer(Customer customer, int customerId) throws AppException {
        Customer dbCustomer = this.getSingleCustomer(customerId);

        // Preserve existing relationships and IDs
        customer.setUser(dbCustomer.getUser());
        customer.setId(dbCustomer.getId());
        customer.setPurchases(dbCustomer.getPurchases()); // Now this will work!

        // Handle password update logic
        if (customer.getUser().getPassword() == null || customer.getUser().getPassword().isEmpty()) {
            customer.getUser().setPassword(dbCustomer.getUser().getPassword());
        } else {
            // Encode the new password
            customer.getUser().setPassword(passwordEncoder.encode(customer.getUser().getPassword()));
        }

        this.customerRepository.save(customer);
    }

    @Override
    public void deleteCustomer(int customerId) throws AppException {
        Customer toDelete = this.getSingleCustomer(customerId);
        this.customerRepository.deleteById(toDelete.getId());
    }

    @Override
    public List<Customer> getAllCustomer() {
        return this.customerRepository.findAll();
    }

    @Override
    public Customer getCustomerByUserId(int userId) throws AppException {
        Customer customer = this.customerRepository.findByUserId(userId);
        if(customer == null){
            throw new AppException(CustomerError.CUSTOMER_NOT_FOUND);
        }
        return this.customerRepository.findByUserId(userId);
    }

    @Override
    public boolean isCustomerExist(User user) {
        return this.customerRepository.existsById(user.getId());
    }

    public boolean isCustomerExist(int userId) {
        return this.customerRepository.existsById(userId);
    }
    @Override
    public boolean isCustomerEmailExist(String email) {
        return this.customerRepository.existsByUserEmail(email);
    }

    @Override
    public boolean isCustomerPasswordExist(String password) {
        return this.customerRepository.existsByUserPassword(password);
    }
}
