package com.CompanyService.CompanyService.Client;

import com.CompanyService.CompanyService.Dto.JobApplicationDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(
        name = "APPLICATION-SERVICE",
        configuration = com.CompanyService.CompanyService.Security.FeignConfig.class // ✅ also fix package
)
public interface ApplicationClient {

    // ✅ FIXED URL
    @GetMapping("/api/applications/job/{jobId}")
    List<JobApplicationDTO> getApplicants(@PathVariable Long jobId);

    // ✅ FIXED URL
    @PutMapping("/api/applications/{applicationId}")
    void updateStatus(
            @PathVariable Long applicationId,
            @RequestParam String status
    );
}