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

    @PutMapping("/block/{id}")
    public String block(@PathVariable Long id) {
        service.block(id);
        return "Company blocked";
    }

    @PutMapping("/unblock/{id}")
    public String unblock(@PathVariable Long id) {
        service.unblock(id);
        return "Company unblocked";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "Company deleted";
    }
}
