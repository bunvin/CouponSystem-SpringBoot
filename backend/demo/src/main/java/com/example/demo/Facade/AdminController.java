package com.example.demo.Facade;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.AppModules.company.Company;
import com.example.demo.AppModules.coupon.Coupon;
import com.example.demo.AppModules.customer.Customer;
import com.example.demo.Error.AppException;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    @Autowired
    private AdminFacade adminFacade;

    //in facade not in api: getUserLogin, setUserLogin

    @GetMapping("/companies")
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = adminFacade.getAllCompanies();
        return ResponseEntity.status(HttpStatus.OK).body(companies);
    }

    @PostMapping("/companies")
    public ResponseEntity<Company> addCompany(@RequestBody Company company) throws AppException {
        Company newCompany = adminFacade.addCompany(company);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCompany);
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable int id) throws AppException {
        Company company = adminFacade.getCompanyById(id);
        return ResponseEntity.status(HttpStatus.OK).body(company);
    }

    @PostMapping("/companies/{id}")
    public ResponseEntity<Void> updateCompany(@RequestBody Company company, @PathVariable int companyId) throws AppException {
        adminFacade.updateCompany(company, companyId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable int id) throws AppException {
        adminFacade.deleteCompany(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/customers")
    public List<Customer> getAllCustomers() {
        List<Customer> customers = adminFacade.getAllCustomers();
        return customers;
    }

    @PostMapping("/customers")
    public Customer addCustomer(@RequestBody Customer customer) throws AppException {
        Customer newCustomer = adminFacade.addCustomer(customer);
        return newCustomer;
    }

    @GetMapping("/customers/{id}")
    public Customer getCustomerById(@PathVariable int id) throws AppException {
        Customer customer = adminFacade.getCustomerById(id);
        return customer;
    }

    @PostMapping("/customers/{id}")
    public void updateCustomer(@RequestBody Customer customer, @PathVariable int id) throws AppException {
        adminFacade.updateCustomer(customer, id);
    }

    @DeleteMapping("/customers/{id}")
    public void deleteCustomer(@PathVariable int customerId) throws AppException {
        adminFacade.deleteCompany(customerId);
    }

    @GetMapping("/coupons")
    public List<Coupon> getAllCoupons() {
        return adminFacade.getAllCoupons();
    }

}
