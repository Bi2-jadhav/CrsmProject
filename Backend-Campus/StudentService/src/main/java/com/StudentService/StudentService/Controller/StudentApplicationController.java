package com.StudentService.StudentService.Controller;

import com.StudentService.StudentService.Entity.JobApplication;
import com.StudentService.StudentService.Service.ApplicationService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/student/applications")
public class StudentApplicationController {
    private final ApplicationService service;

    public StudentApplicationController(ApplicationService service) {
        this.service = service;
    }

    @PostMapping
    public JobApplication apply(@RequestBody JobApplication app,
                                Principal principal) {
        app.setStudentEmail(principal.getName());
        return service.apply(app);
    }

    @GetMapping
    public List<JobApplication> history(Principal principal) {
        return service.getApplications(principal.getName());
    }
}
