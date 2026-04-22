package com.applicationService.client;

import com.applicationService.dto.StudentDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "STUDENT-SERVICE", url = "http://localhost:8082")
public interface StudentClient {

    @GetMapping("/api/internal/students/{id}")
    StudentDTO getStudent(@PathVariable Long id);

    // ✅ FIXED URL (singular "student")
    @GetMapping("/api/internal/student/email/{email}")
    StudentDTO getStudentByEmail(@PathVariable String email);
}