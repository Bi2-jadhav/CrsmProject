package com.authService.authService.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "STUDENT-SERVICE")
public interface StudentClient {

    // ✅ Matches StudentInternalController @PostMapping("/api/internal/student/create-profile")
    @PostMapping("/api/internal/student/create-profile")
    void createProfile(@RequestParam("email") String email, @RequestParam("name") String name);
}
