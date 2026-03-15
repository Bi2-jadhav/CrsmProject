package com.CompanyService.CompanyService.Controller;

import com.CompanyService.CompanyService.Entity.JobPost;
import com.CompanyService.CompanyService.Repository.JobPostRepository;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/company/jobs")
public class JobPostController {

    private final JobPostRepository repo;

    public JobPostController(JobPostRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public JobPost postJob(@RequestBody JobPost job,
                           Principal principal) {
        job.setCompanyEmail(principal.getName());
        return repo.save(job);
    }

    @GetMapping
    public List<JobPost> myJobs(Principal principal) {
        return repo.findByCompanyEmail(principal.getName());
    }
}
