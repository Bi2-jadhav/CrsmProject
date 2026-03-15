package com.CompanyService.CompanyService.Controller;

import com.CompanyService.CompanyService.Entity.JobPost;
import com.CompanyService.CompanyService.Repository.JobPostRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internal/jobs")
public class InternalJobController {

    private final JobPostRepository repository;

    public InternalJobController(JobPostRepository repository) {
        this.repository = repository;
    }

    // Admin: view all jobs
    @GetMapping
    public List<JobPost> getAllJobs() {
        return repository.findAll();
    }

    // Admin: count all jobs
    @GetMapping("/count")
    public long getCount() {
        return repository.count();
    }

    // Admin: toggle job status OPEN/CLOSED
    @PutMapping("/{id}/status")
    public void updateJobStatus(@PathVariable Long id, @RequestParam String status) {
        JobPost job = repository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
        job.setJobStatus(status);
        repository.save(job);
    }

    // Admin: delete a job
    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
