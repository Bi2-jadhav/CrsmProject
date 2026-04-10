package com.interviewService.controller;
import com.interviewService.dto.InterviewDTO;
import com.interviewService.entity.Interview;
import com.interviewService.service.InterviewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
// @CrossOrigin removed to avoid header duplication
public class InterviewController {

    private final InterviewService service;

    public InterviewController(InterviewService service) {
        this.service = service;
    }

    // Schedule Interview
    @PostMapping("/schedule")
    public Interview schedule(@RequestBody InterviewDTO dto) {
        return service.scheduleInterview(dto);
    }

    // Update Status
    @PutMapping("/{id}/status")
    public Interview updateStatus(@PathVariable Long id,
                                  @RequestParam String status) {
        return service.updateStatus(id, status);
    }

    // Add Feedback
    @PutMapping("/{id}/feedback")
    public Interview addFeedback(@PathVariable Long id,
                                 @RequestParam String feedback,
                                 @RequestParam Integer rating) {
        return service.addFeedback(id, feedback, rating);
    }

    // Get All
    @GetMapping
    public List<Interview> getAll() {
        return service.getAll();
    }

    // Get by Candidate
    @GetMapping("/candidate/{candidateId}")
    public List<Interview> getByCandidate(@PathVariable Long candidateId) {
        return service.getByCandidate(candidateId);
    }
}