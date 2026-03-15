package com.StudentService.StudentService.Controller;


import com.StudentService.StudentService.Entity.JobApplication;
import com.StudentService.StudentService.Service.ApplicationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/student/dashboard")
public class StudentDashboardController {
    private final ApplicationService service;

    public StudentDashboardController(ApplicationService service) {
        this.service = service;
    }

    @GetMapping
    public String dashboard(Principal principal) {
        List<JobApplication> apps = service.getApplications(principal.getName());
        return "Applied Companies: " + apps.size();
    }
}
