package com.CompanyService.CompanyService.Controller;

import com.CompanyService.CompanyService.Entity.CompanyProfile;
import com.CompanyService.CompanyService.Repository.CompanyProfileRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internal/companies")
public class InternalCompanyController {

    private final CompanyProfileRepository repo;

    public InternalCompanyController(CompanyProfileRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<CompanyProfile> getAll() {
        return repo.findAll()
                .stream()
                .filter(c -> !c.isBlocked())
                .toList();
    }

    @PutMapping("/block/{id}")
    public void block(@PathVariable Long id) {
        CompanyProfile c = repo.findById(id).orElseThrow();
        c.setBlocked(true);
        repo.save(c);
    }

    @PutMapping("/unblock/{id}")
    public void unblock(@PathVariable Long id) {
        CompanyProfile c = repo.findById(id).orElseThrow();
        c.setBlocked(false);
        repo.save(c);
    }

    @GetMapping("/count")
    public long getCount() {
        return repo.count();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
