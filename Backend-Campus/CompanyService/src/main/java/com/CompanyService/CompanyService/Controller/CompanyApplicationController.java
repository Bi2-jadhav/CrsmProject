package com.CompanyService.CompanyService.Controller;



import com.CompanyService.CompanyService.Dto.JobApplicationDTO;
import com.CompanyService.CompanyService.Service.CompanyApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company/applications")
public class CompanyApplicationController {

    private final CompanyApplicationService service;

    public CompanyApplicationController(CompanyApplicationService service) {
        this.service = service;
    }

    @GetMapping("/{jobId}")
    public List<JobApplicationDTO> applicants(@PathVariable Long jobId) {
        System.out.println("DEBUG: CompanyService received request for applicants of Job ID: " + jobId);
        return service.getApplicants(jobId);
    }


    @PutMapping("/{applicationId}")
    public String updateStatus(@PathVariable Long applicationId,
                               @RequestParam String status) {
        service.updateStatus(applicationId, status);
        return "Status updated successfully";
    }
}
