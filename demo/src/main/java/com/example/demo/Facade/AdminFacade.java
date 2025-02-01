package com.example.demo.Facade;

import com.example.demo.AppModules.company.Company;
import com.example.demo.AppModules.customer.Customer;
import com.example.demo.AppModules.user.User;
import com.example.demo.Error.AppException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminFacade extends ClientFacade{

    private User userLogin;

    @Autowired
    public AdminFacade() throws AppException {
        super();
    }

    public Company addCompany(Company company) throws AppException {
        return getCompanyServiceImp().addCompany(company);
    }

    public void updateCompany(Company company, int companyId) throws AppException {
        getCompanyServiceImp().updateCompany(company,companyId);
    }

    public void deleteCompany(int companyId) throws AppException {
        getCompanyServiceImp().deleteCompany(companyId);
    }

    public List<Company> getAllCompanies(){
        return getCompanyServiceImp().getAllCompanies();
    }

    public Company getCompanyById(int companyId) throws AppException {
        return getCompanyServiceImp().getSingleCompany(companyId);
    }

    public Customer addCustomer(Customer customer) throws AppException {
        return getCustomerServiceImp().addCustomer(customer);
    }

    public void updateCustomer(Customer customer, int customerId) throws AppException {
        getCustomerServiceImp().updateCustomer(customer,customerId);
    }

    public void deleteCustomer(int customerId) throws AppException {
        getCustomerServiceImp().deleteCustomer(customerId);
    }

    public List<Customer> getAllCustomers(){
        return getCustomerServiceImp().getAllCustomer();
    }

    public Customer getCustomerById(int customerId) throws AppException {
        return getCustomerServiceImp().getSingleCustomer(customerId);
    }

    public User getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(User userLogin) {
        this.userLogin = userLogin;
    }
}
