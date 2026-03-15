package com.StudentService.StudentService.Controller;

import com.StudentService.StudentService.Entity.JobApplication;
import com.StudentService.StudentService.Entity.StudentProfile;
import com.StudentService.StudentService.Service.StudentProfileService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/student/profile")
public class StudentProfileController {

    private final StudentProfileService service;

    public StudentProfileController(StudentProfileService service) {
        this.service = service;
    }

    @PostMapping
    public StudentProfile createOrUpdate(@RequestBody StudentProfile profile,
                                         Principal principal) {
        if (principal == null) {
            throw new RuntimeException("Principal is null – JWT not processed");
        }

        profile.setEmail(principal.getName());
        return service.save(profile);
    }

    @GetMapping
    public StudentProfile getProfile(Principal principal) {
        return service.getByEmail(principal.getName());
    }
}