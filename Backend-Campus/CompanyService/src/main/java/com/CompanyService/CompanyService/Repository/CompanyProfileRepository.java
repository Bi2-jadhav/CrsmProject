package com.CompanyService.CompanyService.Repository;

import com.CompanyService.CompanyService.Entity.CompanyProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, Long> {

    CompanyProfile findByEmail(String email);
}