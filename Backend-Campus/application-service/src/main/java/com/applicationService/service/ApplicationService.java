package com.applicationService.service;

import com.applicationService.client.StudentClient;
import com.applicationService.dto.JobApplicationDTO;
import com.applicationService.dto.StudentDTO;
import com.applicationService.entity.Application;
import com.applicationService.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository repo;
    private final StudentClient studentClient;

    public ApplicationService(ApplicationRepository repo,
                              StudentClient studentClient) {
        this.repo = repo;
        this.studentClient = studentClient;
    }

    // 🔥 GET APPLICANTS BY JOB
    public List<JobApplicationDTO> getApplicantsByJob(Long jobId) {

        List<Application> apps = repo.findByJobId(jobId);

        return apps.stream().map(app -> {

            JobApplicationDTO dto = new JobApplicationDTO();

            dto.setId(app.getId());
            dto.setStatus(app.getStatus());

            // 🔥 CALL STUDENT SERVICE (only if studentId exists)
            if (app.getStudentId() != null) {
                try {
                    StudentDTO student = studentClient.getStudent(app.getStudentId());

                    if (student != null) {
                        dto.setStudentName(student.getName());
                        dto.setStudentEmail(student.getEmail());
                        dto.setBranch(student.getBranch());
                        dto.setCgpa(student.getCgpa());
                        dto.setSkills(student.getSkills());
                        dto.setResumePath(student.getResumePath());
                    }
                } catch (Exception e) {
                    System.err.println("⚠️ Failed to fetch student details for ID: " + app.getStudentId() + " - " + e.getMessage());
                    // Fallback: use data from application record
                    dto.setStudentEmail(app.getStudentEmail());
                }
            } else {
                // Fallback: use email from application record
                dto.setStudentEmail(app.getStudentEmail());
            }

            return dto;

        }).toList();
    }

    // 🔥 UPDATE STATUS
    public void updateStatus(Long id, String status) {
        Application app = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        app.setStatus(status);
        repo.save(app);
    }

    // 🔥 GET APPLICATIONS BY STUDENT ID
    public List<Application> getApplicantsByStudent(Long studentId) {
        return repo.findByStudentId(studentId);
    }

    public List<Application> getApplicantsByStudentEmail(String studentEmail) {
        return repo.findByStudentEmail(studentEmail);
    }


    // 🔥 APPLY JOB
    public Application apply(Application application) {
        application.setStatus("APPLIED");
        return repo.save(application);
    }
}