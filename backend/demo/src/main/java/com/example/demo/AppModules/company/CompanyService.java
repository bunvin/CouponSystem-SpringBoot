

package com.example.demo.AppModules.company;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Error.AppException;

@Service
public interface CompanyService {
    Company addCompany(Company company) throws AppException;
    void updateCompany(Company company, int companyId) throws AppException;
    void deleteCompany(int companyId) throws AppException;
    void deleteCompanyByUserId(int userId) throws AppException;

    Company getSingleCompany(int companyId) throws AppException;
    Company getCompanyByName(String companyName) throws AppException;
    List<Company> getAllCompanies();
    Company getCompanyByUserId(int userId) throws AppException;
    
    boolean isCompanyNameOrEmailExists(String companyName, String email);
    

}
