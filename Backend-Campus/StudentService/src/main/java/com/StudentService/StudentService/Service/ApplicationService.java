package com.StudentService.StudentService.Service;

import com.StudentService.StudentService.Entity.JobApplication;
import com.StudentService.StudentService.Repository.JobApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ApplicationService {

    private final JobApplicationRepository repo;

    public ApplicationService(JobApplicationRepository repo) {
        this.repo = repo;
    }

    // ---------------- STUDENT ----------------

    // Student applies for job
    public JobApplication apply(JobApplication application) {
        // Check if student already applied to this company
        if (repo.existsByStudentEmailAndCompanyId(application.getStudentEmail(), application.getCompanyId())) {
            throw new RuntimeException("You have already applied to this company");
        }

        application.setStatus("APPLIED");
        application.setAppliedDate(LocalDate.now());
        return repo.save(application);
    }

    // Student views own applications
    public List<JobApplication> getApplications(String email) {
        return repo.findByStudentEmail(email);
    }

    // ---------------- COMPANY ----------------

    // Company views applicants for a job
    public List<JobApplication> getApplicantsByCompany(Long companyId) {
        return repo.findByCompanyId(companyId);
    }

    // Company updates application status
    public void updateStatus(Long applicationId, String status) {
        JobApplication application = repo.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status);
        repo.save(application);
    }

    // ---------------- ADMIN ----------------

    public List<JobApplication> getAllApplications() {
        return repo.findAll();
    }

    public long getTotalCount() {
        return repo.count();
    }

    public long getCountByStatus(String status) {
        return repo.countByStatus(status);
    }
}
