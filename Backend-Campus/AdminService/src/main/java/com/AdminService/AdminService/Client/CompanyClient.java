package com.AdminService.AdminService.Client;

import com.AdminService.AdminService.Dto.CompanyDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "COMPANY-SERVICE")
public interface CompanyClient {

    @GetMapping("/api/internal/companies")
    List<CompanyDTO> getAllCompanies();

    @PutMapping("/api/internal/companies/approve/{id}")
    void approve(@PathVariable Long id);

    @PutMapping("/api/internal/companies/block/{id}")
    void block(@PathVariable Long id);

    @DeleteMapping("/api/internal/companies/{id}")
    void delete(@PathVariable Long id);
}
