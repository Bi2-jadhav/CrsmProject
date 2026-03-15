package com.AdminService.AdminService.Client;


import com.AdminService.AdminService.Dto.StudentDTO;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class StudentClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public List<StudentDTO> getAllStudents(String token) {

        String url = "http://localhost:8082/api/internal/students";

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION, token);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<List> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                List.class
        );

        return response.getBody();
    }

    public void blockStudent(Long id, String token) {
        String url = "http://localhost:8082/api/internal/students/block/" + id;

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION, token);

        restTemplate.exchange(
                url,
                HttpMethod.PUT,
                new HttpEntity<>(headers),
                Void.class
        );
    }

    public void deleteStudent(Long id, String token) {
        String url = "http://localhost:8082/api/internal/students/" + id;

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION, token);

        restTemplate.exchange(
                url,
                HttpMethod.DELETE,
                new HttpEntity<>(headers),
                Void.class
        );
    }
}
