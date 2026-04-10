package com.StudentService.StudentService.Service;

import com.StudentService.StudentService.Client.ApplicationClient;
import com.StudentService.StudentService.Dto.JobApplicationDTO;
import com.StudentService.StudentService.Entity.JobApplication;
import com.StudentService.StudentService.Entity.StudentProfile;
import com.StudentService.StudentService.Repository.JobApplicationRepository;
import com.StudentService.StudentService.Repository.StudentProfileRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ApplicationService {

    private final JobApplicationRepository repo;
    private final ApplicationClient applicationClient;
    private final StudentProfileRepository profileRepo;

    public ApplicationService(JobApplicationRepository repo,
                              StudentProfileRepository profileRepo,
                              ApplicationClient applicationClient) {
        this.repo = repo;
        this.profileRepo = profileRepo;
        this.applicationClient = applicationClient;
    }

    // ---------------- STUDENT ----------------

    public JobApplication apply(JobApplication application) {

        StudentProfile profile = profileRepo.findByEmail(application.getStudentEmail())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        application.setStudentId(profile.getId()); // ✅ Set the ID for the application-service
        application.setResumePath(profile.getResumePath()); // ✅ Pass the resume for the company to review

        return applicationClient.apply(application);
    }

    public List<JobApplication> getApplications(String email) {
        return applicationClient.getByEmail(email);
    }


    // ✅ Filter by status (Note: simplified as we move to a distributed model)
    public List<JobApplication> getApplicationsByStatus(String email, String status) {
        // For now, return all and filter in memory, or we can add a status endpoint to application-service if needed
        return getApplications(email).stream()
                .filter(a -> status.equals("ALL") || a.getStatus().equalsIgnoreCase(status))
                .toList();
    }


    // ---------------- COMPANY ----------------

    public List<JobApplicationDTO> getApplicantsByCompany(Long companyId) {

        List<JobApplication> apps = repo.findByCompanyId(companyId);

        return apps.stream().map(app -> {

            JobApplicationDTO dto = new JobApplicationDTO();

            dto.setId(app.getId());
            dto.setStudentEmail(app.getStudentEmail());
            dto.setStatus(app.getStatus());

            StudentProfile profile = profileRepo
                    .findByEmail(app.getStudentEmail())
                    .orElse(null);

            if (profile != null) {
                dto.setStudentName(profile.getName());
                dto.setBranch(profile.getBranch());
                dto.setCgpa(profile.getCgpa());
                dto.setSkills(profile.getSkills());
                dto.setResumePath(profile.getResumePath());
            }

            return dto;

        }).toList();
    }

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