package com.AdminService.AdminService.Controller;


import com.AdminService.AdminService.Dto.CompanyDTO;
import com.AdminService.AdminService.Service.AdminCompanyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/companies")
public class AdminCompanyController {

    private final AdminCompanyService service;

    public AdminCompanyController(AdminCompanyService service) {
        this.service = service;
    }

    @GetMapping
    public List<CompanyDTO> all() {
        return service.getAll();
    }

    @PutMapping("/approve/{id}")
    public String approve(@PathVariable Long id) {
        service.approve(id);
        return "Company approved";
    }

    @PutMapping("/block/{id}")
    public String block(@PathVariable Long id) {
        service.block(id);
        return "Company blocked";
    }
}
