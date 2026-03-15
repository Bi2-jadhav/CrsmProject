package com.AdminService.AdminService.Controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/admin/jobs")
public class AdminJobController {

    private final RestTemplate restTemplate = new RestTemplate();

    // View all job postings
    @GetMapping
    public Object getAllJobs(@RequestHeader("Authorization") String token) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Object> response = restTemplate.exchange(
                "http://localhost:8083/api/internal/jobs",
                HttpMethod.GET,
                entity,
                Object.class);

        return response.getBody();
    }

    // Toggle job status OPEN/CLOSED
    @PutMapping("/{jobId}/status")
    public String updateJobStatus(@PathVariable Long jobId, @RequestParam String status) {
        restTemplate.put(
                "http://localhost:8083/api/internal/jobs/" + jobId + "/status?status=" + status,
                null);
        return "Job status updated to " + status;
    }

    // Delete a job posting
    @DeleteMapping("/{jobId}")
    public String deleteJob(@PathVariable Long jobId) {
        restTemplate.delete(
                "http://localhost:8083/api/internal/jobs/" + jobId);
        return "Job deleted successfully";
    }
}
