package com.StudentService.StudentService.Repository;

import com.StudentService.StudentService.Entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByStudentEmail(String email);

    List<JobApplication> findByCompanyId(Long companyId);

    // ✅ NEW: filter by status
    List<JobApplication> findByStudentEmailAndStatus(String email, String status);

    // ✅ Prevent duplicate apply per job
    boolean existsByStudentEmailAndCompanyIdAndJobId(
            String studentEmail,
            Long companyId,
            Long jobId
    );

    long countByStatus(String status);
}