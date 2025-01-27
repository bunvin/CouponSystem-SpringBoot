

package com.example.demo.AppModules.company;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Error.AppException;

@Service
public interface CompanyService {
    Company addCompany(Company company) throws AppException;
    void updateCompany(Company company, int companyId) throws AppException;
    void deleteCompany(int companyId) throws AppException;
    Company getSingleCompany(int companyId) throws AppException;
    Company getSingleCompanyByName(String companyName) throws AppException;
    List<Company> getCompanyList();
    boolean isCompanyNameOrEmailExists(String companyName, String email);

}
