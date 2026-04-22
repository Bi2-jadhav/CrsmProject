package com.CompanyService.CompanyService.Controller;

import com.CompanyService.CompanyService.Entity.CompanyProfile;
import com.CompanyService.CompanyService.Repository.CompanyProfileRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/internal/company")
public class CompanyInternalController {

    private final CompanyProfileRepository repo;

    public CompanyInternalController(CompanyProfileRepository repo) {
        this.repo = repo;
    }

    // ✅ Called by AuthService on signup - No JWT required (permitted by SecurityConfig)
    @PostMapping("/create-profile")
    public void createProfile(@RequestParam String email, @RequestParam String name) {
        if (repo.findByEmail(email) == null) {
            CompanyProfile profile = new CompanyProfile();
            profile.setEmail(email);
            profile.setCompanyName(name);
            profile.setDescription("Product based company");
            profile.setBlocked(false);
            repo.save(profile);
            System.out.println("✅ Internal: Created proactive company profile for " + email);
        } else {
            System.out.println("ℹ️ Profile already exists for " + email);
        }
    }
}
