

package com.example.demo.AppModules.company;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface CompanyService {
    Company addCompany(Company company);
    void updateCompany(Company company, int companyId);
    void deleteCompany(int companyId);
    boolean companyExists(int companyId);
    Company getSingleCompany(int companyId);
    Company getSingleCompany(String companyName);
    List<Company> getCompanyList();
    boolean isCompanyNameOrEmailExists(String companyName, String email);

}
