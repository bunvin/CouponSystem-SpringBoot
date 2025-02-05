// Purpose: Contains the implementation of the CompanyService interface.

package com.example.demo.AppModules.company;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Error.AppException;

@Service
public class CompanyServiceImp implements CompanyService {
    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public Company addCompany(Company company) throws AppException {
        //company name and email should be unique
        if(this.companyRepository.existsByName(company.getName())){
            throw new AppException(CompanyError.COMPANY_NAME_ALREADY_EXISTS);
        }
        if(this.companyRepository.existsByUserEmail(company.getCompanyUser().getEmail())){
            throw new AppException(CompanyError.COMPANY_EMAIL_ALREADY_EXISTS);
        }
        Company newCompany = this.companyRepository.save(company);
        return newCompany;
    }

    @Override
    public void updateCompany(Company company, int companyId) throws AppException {
        Company dbCompany = getSingleCompany(companyId);
        //company name and email should be unique
        if(!company.getName().equals(dbCompany.getName())){
            throw new AppException(CompanyError.COMPANY_NAME_IS_UNUPDATABLE);
        }
        if(!company.getCompanyUser().getEmail()
                .equals(dbCompany.getCompanyUser().getEmail())){
            throw new AppException(CompanyError.COMPANY_EMAIL_IS_UNUPDATABLE);
        }
        company.setCompanyUser(dbCompany.getCompanyUser()); 
        company.setId(dbCompany.getId());

        this.companyRepository.save(company);
}

    @Override
    public void deleteCompany(int companyId) throws AppException {
        Company company = getSingleCompany(companyId);
        this.companyRepository.deleteById(companyId);
    }

    @Override
    public Company getSingleCompany(int companyId) throws AppException {
        return this.companyRepository.findById(companyId)
                        .orElseThrow(() -> new AppException(CompanyError.COMPANY_NOT_FOUND));
    }

    @Override
    public Company getSingleCompanyByName(String companyName) throws AppException {
        Company company = this.companyRepository.findByName(companyName);
        if(company == null){
            throw new AppException(CompanyError.COMPANY_NOT_FOUND);
        }
        return company;
    }

    @Override
    public List<Company> getAllCompanies() {
        return this.companyRepository.findAll();
    }

    @Override
    public boolean isCompanyNameOrEmailExists(String companyName, String email) {
        boolean nameOrEmailExist = this.companyRepository.existsByName(companyName) || this.companyRepository.existsByUserEmail(email);
        return nameOrEmailExist;
    }

    @Override
    public Company getCompanyByUserId(int userId) throws AppException {
        Company company = this.companyRepository.findByUserId(userId);
        if(company == null){
            throw new AppException(CompanyError.COMPANY_NOT_FOUND);
        }
        return company;
    }
}
