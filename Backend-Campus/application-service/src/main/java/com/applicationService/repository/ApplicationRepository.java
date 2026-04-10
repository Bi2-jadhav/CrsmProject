package com.applicationService.repository;


import com.applicationService.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByJobId(Long jobId);

    List<Application> findByCompanyId(Long companyId);

    List<Application> findByStudentId(Long studentId);

    List<Application> findByStudentEmail(String studentEmail);
}
