package com.authService.authService.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "COMPANY-SERVICE")
public interface CompanyClient {

    // ✅ Matches CompanyInternalController @PostMapping("/api/internal/company/create-profile")
    @PostMapping("/api/internal/company/create-profile")
    void createProfile(@RequestParam("email") String email, @RequestParam("name") String name);
}
