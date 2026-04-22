package com.StudentService.StudentService.Controller;

import com.StudentService.StudentService.Entity.StudentProfile;
import com.StudentService.StudentService.Service.StudentProfileService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/internal/student")
public class StudentInternalController {

    private final StudentProfileService service;

    public StudentInternalController(StudentProfileService service) {
        this.service = service;
    }

    // ✅ Called by AuthService on signup - No JWT required (permitted by SecurityConfig)
    @PostMapping("/create-profile")
    public void createProfile(@RequestParam String email, @RequestParam String name) {
        if (service.getByEmail(email) == null) {
            StudentProfile profile = new StudentProfile();
            profile.setEmail(email);
            profile.setName(name);
            service.save(profile);
            System.out.println("✅ Internal: Created proactive student profile for " + email);
        } else {
            System.out.println("ℹ️ Student profile already exists for " + email);
        }
    }

    // 🔥 Look up student profile by email (called by ApplicationService)
    @GetMapping("/email/{email}")
    public StudentProfile getByEmail(@PathVariable String email) {
        return service.getByEmail(email);
    }
}
