// Purpose: Contains the implementation of the CompanyService interface.

package com.example.demo.AppModules.company;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.AppModules.user.User;
import com.example.demo.Error.AppException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyServiceImp implements CompanyService {
    private final CompanyRepository companyRepository;

    @Override
    public Company addCompany(Company company) throws AppException {
        //company name and email should be unique
        if(this.companyRepository.existsByName(company.getName()) == true){
            throw new AppException(CompanyError.COMPANY_NAME_ALREADY_EXISTS);
        }
        if(this.companyRepository.existsByUserEmail(company.getUserEmail()) == true){
            throw new AppException(CompanyError.COMPANY_EMAIL_ALREADY_EXISTS);
        }
        Company newCompany = this.companyRepository.save(company);
        return newCompany;
    }

    @Override
    public void updateCompany(Company company, int companyId) throws AppException {
        //company name and email should be unique
        if(this.companyRepository.existsById(companyId) == false){
            throw new AppException(CompanyError.COMPANY_NOT_FOUND);
        }
        if(this.companyRepository.existsByName(company.getName()) == true){
            throw new AppException(CompanyError.COMPANY_NAME_ALREADY_EXISTS);
        }
        if(this.companyRepository.existsByUserEmail(company.getUserEmail()) == true){
            throw new AppException(CompanyError.COMPANY_EMAIL_ALREADY_EXISTS);
        }
        User user = company.getUser();
        company.setUser(user); //needed?
        company.setId(companyId);

        this.companyRepository.save(company);

}

    @Override
    public void deleteCompany(int companyId) throws AppException {
        // only if Company exist
        Company company = this.companyRepository.findById(companyId).orElse(null);
        if(company == null){
            throw new AppException(CompanyError.COMPANY_NOT_FOUND);
        }
        // get all coupons
        // delete all purchases 
        //selete all coupons
        // delete company
        this.companyRepository.deleteById(companyId);
    }

    @Override
    public boolean companyExists(int companyId) {
        return this.companyRepository.existsById(companyId);
    }

    @Override
    public Company getSingleCompany(int companyId) throws AppException {
        Company company = this.companyRepository.findById(companyId).orElse(null);
        if(company == null){
            throw new AppException(CompanyError.COMPANY_NOT_FOUND);
        }
        return company;
    }

    @Override
    public Company getSingleCompany(String companyName) throws AppException {
        Company company = this.companyRepository.findByName(companyName);
        if(company == null){
            throw new AppException(CompanyError.COMPANY_NOT_FOUND);
        }
        return company;    
    }
    

    @Override
    public List<Company> getCompanyList() {
        return this.companyRepository.findAll();
    }

    @Override
    public boolean isCompanyNameOrEmailExists(String companyName, String email) {
        boolean nameOrEmailExist = this.companyRepository.existsByName(companyName) || this.companyRepository.existsByUserEmail(email);
        return nameOrEmailExist;
    }
}
