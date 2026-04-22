
        package com.CompanyService.CompanyService.Controller;

import com.CompanyService.CompanyService.Entity.CompanyProfile;
import com.CompanyService.CompanyService.Repository.CompanyProfileRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company/profile")
public class CompanyProfileController {

    private final CompanyProfileRepository repo;

    public CompanyProfileController(CompanyProfileRepository repo) {
        this.repo = repo;
    }

    // ✅ SAVE / UPDATE PROFILE
    @PostMapping
    public CompanyProfile save(@RequestBody CompanyProfile profile) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // 🔥 CRITICAL CHECK
        if (auth == null || auth.getName() == null || auth.getName().equals("anonymousUser")) {
            throw new RuntimeException("User not authenticated ❌");
        }

        String email = auth.getName();

        // 🔍 DEBUG (check in console)
        System.out.println("🔥 Logged in COMPANY: " + email);

        CompanyProfile existing = repo.findByEmail(email);

        // ✅ UPDATE if exists
        if (existing != null) {
            existing.setCompanyName(profile.getCompanyName());
            existing.setDescription(profile.getDescription());
            existing.setLocation(profile.getLocation());
            existing.setWebsite(profile.getWebsite());
            existing.setBlocked(existing.isBlocked()); // preserve flag

            System.out.println("✅ Updating existing company profile");

            return repo.save(existing);
        }

        // ✅ INSERT if new
        profile.setEmail(email);
        profile.setBlocked(false);

        System.out.println("✅ Creating new company profile");

        return repo.save(profile);
    }

    // ✅ GET PROFILE
    @GetMapping
    public CompanyProfile get() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getName() == null || auth.getName().equals("anonymousUser")) {
            throw new RuntimeException("User not authenticated ❌");
        }

        String email = auth.getName();
        System.out.println("📦 Fetching profile for: " + email);

        CompanyProfile profile = repo.findByEmail(email);

        // 🔥 AUTO-CREATE if missing
        if (profile == null) {
            System.out.println("🆕 No profile found. Creating default for: " + email);
            profile = new CompanyProfile();
            profile.setEmail(email);
            profile.setCompanyName(email.split("@")[0]); // Default name from email
            profile.setDescription("Product based company");
            profile.setBlocked(false);
            profile = repo.save(profile);
        }

        return profile;
    }
}

