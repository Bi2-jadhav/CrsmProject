package com.AdminService.AdminService.Controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/admin/applications")
public class AdminApplicationController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping
    public Object getAllApplications(@RequestHeader("Authorization") String token) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Object> response = restTemplate.exchange(
                "http://localhost:8082/api/internal/applications",
                HttpMethod.GET,
                entity,
                Object.class);

        return response.getBody();
    }
}
