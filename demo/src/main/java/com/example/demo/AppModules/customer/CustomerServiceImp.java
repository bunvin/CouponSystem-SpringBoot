package com.example.demo.AppModules.customer;

import com.example.demo.AppModules.user.User;
import com.example.demo.Error.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImp implements CustomerService{
    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public Customer addCustomer(Customer customer) throws AppException {
        if(this.customerRepository.existsById(customer.getId())){
            throw new AppException(CustomerError.CUSTOMER_ALREADY_EXIST);
        }
        if(this.customerRepository.existsByEmail(customer.getUserEmail())){
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
        Customer fromDB = this.getSingleCustomer(customerId);
        customer.setId(fromDB.getId());
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
    public boolean isCustomerExist(User user) {
        return this.customerRepository.existsById(user.getId());
    }

    public boolean isCustomerExist(int userId) {
        return this.customerRepository.existsById(userId);
    }
    @Override
    public boolean isCustomerEmailExist(String email) {
        return this.customerRepository.existsByEmail(email);
    }

    @Override
    public boolean isCustomerPasswordExist(String password) {
        return this.customerRepository.existsByPassword(password);
    }
}
