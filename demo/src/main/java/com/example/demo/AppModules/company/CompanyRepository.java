

package com.example.demo.AppModules.company;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Integer> {

    boolean existsByName(String name);
    boolean existsByUserEmail(String userEmail);
    Company findByName(String name);

}
