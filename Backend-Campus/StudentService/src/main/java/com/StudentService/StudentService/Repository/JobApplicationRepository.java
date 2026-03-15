package com.StudentService.StudentService.Repository;

import com.StudentService.StudentService.Entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByStudentEmail(String email);

    List<JobApplication> findByCompanyId(Long companyId);

    // Check if student already applied to this company
    boolean existsByStudentEmailAndCompanyId(String studentEmail, Long companyId);

    // Count by status for dashboard stats
    long countByStatus(String status);
}
