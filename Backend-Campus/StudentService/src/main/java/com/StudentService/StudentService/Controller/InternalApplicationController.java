package com.StudentService.StudentService.Controller;

import com.StudentService.StudentService.Dto.UpdateStatusRequest;
import com.StudentService.StudentService.Entity.JobApplication;
import com.StudentService.StudentService.Service.ApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internal/applications")
public class InternalApplicationController {

    private final ApplicationService service;

    public InternalApplicationController(ApplicationService service) {
        this.service = service;
    }

    // Company views applicants for a job
    @GetMapping("/company/{companyId}")
    public List<JobApplication> getApplicants(@PathVariable Long companyId) {
        return service.getApplicantsByCompany(companyId);
    }

    // Company updates status
    @PutMapping("/{applicationId}")
    public void updateStatus(@PathVariable Long applicationId,
            @RequestBody UpdateStatusRequest request) {
        service.updateStatus(applicationId, request.getStatus());
    }

    // Admin: get all applications
    @GetMapping
    public List<JobApplication> getAllApplications() {
        return service.getAllApplications();
    }

    // Admin: total applications count
    @GetMapping("/count")
    public long getTotalCount() {
        return service.getTotalCount();
    }

    // Admin: accepted count
    @GetMapping("/selected/count")
    public long getSelectedCount() {
        return service.getCountByStatus("ACCEPTED");
    }

    // Admin: rejected count
    @GetMapping("/rejected/count")
    public long getRejectedCount() {
        return service.getCountByStatus("REJECTED");
    }

    // Admin: pending/applied count
    @GetMapping("/pending/count")
    public long getPendingCount() {
        return service.getCountByStatus("APPLIED");
    }
}
