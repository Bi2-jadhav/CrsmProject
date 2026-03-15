package com.CompanyService.CompanyService.Service;

import com.CompanyService.CompanyService.Client.ApplicationClient;
import com.CompanyService.CompanyService.Dto.JobApplicationDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyApplicationService {

    private final ApplicationClient client;

    public CompanyApplicationService(ApplicationClient client) {
        this.client = client;
    }

    public List<JobApplicationDTO> getApplicants(Long jobId) {
        return client.getApplicants(jobId);
    }

    public void updateStatus(Long applicationId, String status) {
        client.updateStatus(applicationId, status);
    }
}
