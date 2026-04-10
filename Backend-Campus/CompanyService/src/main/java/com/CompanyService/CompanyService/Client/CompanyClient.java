package com.CompanyService.CompanyService.Client;

import com.CompanyService.CompanyService.Dto.CompanyDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "COMPANY-SERVICE" , url = "http://localhost:8083")
public interface CompanyClient {

    @GetMapping("/api/company/all")
    List<CompanyDTO> getAllCompanies();
}