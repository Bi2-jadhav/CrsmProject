package com.CompanyService.CompanyService.Client;

import com.CompanyService.CompanyService.Dto.JobApplicationDTO;
import com.CompanyService.CompanyService.Dto.UpdateStatusRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class ApplicationClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String STUDENT_SERVICE_URL = "http://localhost:8082";

    public List<JobApplicationDTO> getApplicants(Long companyId) {
        String url = "http://localhost:8082/api/internal/applications/company/" + companyId;
        return restTemplate.getForObject(url, List.class);
    }


    public void updateStatus(Long applicationId, String status) {
        String url = STUDENT_SERVICE_URL + "/api/internal/applications/" + applicationId;

        UpdateStatusRequest request = new UpdateStatusRequest();
        request.setStatus(status);

        HttpEntity<UpdateStatusRequest> entity = new HttpEntity<>(request);

        restTemplate.exchange(
                url,
                HttpMethod.PUT,
                entity,
                Void.class
        );
    }
}
