package com.CompanyService.CompanyService.Repository;


import com.CompanyService.CompanyService.Entity.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobPostRepository
        extends JpaRepository<JobPost, Long> {

    List<JobPost> findByCompanyEmail(String email);
}
