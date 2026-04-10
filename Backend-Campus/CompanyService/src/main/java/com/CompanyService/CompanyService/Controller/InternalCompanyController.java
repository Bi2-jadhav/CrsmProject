package com.CompanyService.CompanyService.Controller;

import com.CompanyService.CompanyService.Dto.CompanyDTO;
import com.CompanyService.CompanyService.Service.CompanyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internal/companies")
public class InternalCompanyController {

    private final CompanyService service;

    public InternalCompanyController(CompanyService service) {
        this.service = service;
    }

    // ✅ ALL COMPANIES (FIXED)
    @GetMapping
    public List<CompanyDTO> getAll() {
        return service.getAllCompanies();
    }

    // ✅ COUNT (FIXED)
    @GetMapping("/count")
    public long getCount() {
        return service.getCompanyCount();
    }

    @PutMapping("/block/{id}")
    public void block(@PathVariable Long id) {
        service.block(id);
    }

    @PutMapping("/unblock/{id}")
    public void unblock(@PathVariable Long id) {
        service.unblock(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}