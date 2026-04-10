package com.applicationService.controller;

import com.applicationService.dto.JobApplicationDTO;
import com.applicationService.entity.Application;
import com.applicationService.service.ApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
// @CrossOrigin removed to avoid header duplication
public class ApplicationController {

    private final ApplicationService service;

    public ApplicationController(ApplicationService service) {
        this.service = service;
    }

    // 🔥 GET BY JOB ID
    @GetMapping("/job/{jobId}")
    public List<JobApplicationDTO> getApplicants(@PathVariable Long jobId) {
        return service.getApplicantsByJob(jobId);
    }

    // 🔥 APPLY
    @PostMapping
    public Application apply(@RequestBody Application application) {
        return service.apply(application);
    }

    // 🔥 GET BY STUDENT ID (FOR DASHBOARD)
    @GetMapping("/student/{studentId}")
    public List<Application> getByStudent(@PathVariable Long studentId) {
        return service.getApplicantsByStudent(studentId);
    }

    @GetMapping("/student/email/{email}")
    public List<Application> getByEmail(@PathVariable String email) {
        return service.getApplicantsByStudentEmail(email);
    }


    // 🔥 UPDATE STATUS
    @PutMapping("/{id}")
    public void updateStatus(@PathVariable Long id,
                             @RequestParam String status) {
        service.updateStatus(id, status);
    }
}