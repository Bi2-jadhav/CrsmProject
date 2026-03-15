package com.AdminService.AdminService.Controller;


import com.AdminService.AdminService.Dto.DashboardStatsDTO;
import com.AdminService.AdminService.Service.AdminDashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService service;

    public AdminDashboardController(AdminDashboardService service) {
        this.service = service;
    }

    @GetMapping
    public DashboardStatsDTO stats() {
        return service.stats();
    }
}
