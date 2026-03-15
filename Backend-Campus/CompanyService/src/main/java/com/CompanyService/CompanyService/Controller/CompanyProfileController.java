package com.CompanyService.CompanyService.Controller;

import com.CompanyService.CompanyService.Entity.CompanyProfile;
import com.CompanyService.CompanyService.Repository.CompanyProfileRepository;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/company/profile")
public class CompanyProfileController {

    private final CompanyProfileRepository repo;

    public CompanyProfileController(CompanyProfileRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public CompanyProfile save(@RequestBody CompanyProfile profile,
                               Principal principal) {
        profile.setEmail(principal.getName());
        return repo.save(profile);
    }

    @GetMapping
    public CompanyProfile get(Principal principal) {
        return repo.findByEmail(principal.getName());
    }
}
