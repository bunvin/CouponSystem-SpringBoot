

package com.example.demo.AppModules.company;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer> {
    boolean existsByName(String name);
    boolean existsByUserEmail(String email);
    Company findByName(String name);
    Company findByUserId(int userId);

}
