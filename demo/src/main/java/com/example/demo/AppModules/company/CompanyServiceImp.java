// Purpose: Contains the implementation of the CompanyService interface.

package com.example.demo.AppModules.company;

import java.util.List;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyServiceImp implements CompanyService {
    private final CompanyRepository companyRepository;

    @Override
    public Company addCompany(Company company) {
        return company;
    }

    @Override
    public void updateCompany(Company company, int companyId) {

}

    @Override
    public void deleteCompany(int companyId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteCompany'");
    }

    @Override
    public boolean companyExists(int companyId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'companyExists'");
    }

    @Override
    public Company getSingleCompany(int companyId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getSingleCompany'");
    }

    @Override
    public Company getSingleCompany(String companyName) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getSingleCompany'");
    }

    @Override
    public List<Company> getCompanyList() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getCompanyList'");
    }

    @Override
    public boolean isCompanyNameOrEmailExists(String companyName, String email) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isCompanyNameOrEmailExists'");
    }
}
