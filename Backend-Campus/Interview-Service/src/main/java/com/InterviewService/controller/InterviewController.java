
        package com.interviewService.controller;

import com.interviewService.dto.InterviewDTO;
import com.interviewService.entity.Interview;
import com.interviewService.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService service;

    public InterviewController(InterviewService service) {
        this.service = service;
    }

    // ✅ Schedule Interview
    @PostMapping("/schedule")
    public ResponseEntity<?> schedule(@RequestBody InterviewDTO dto) {
        try {
            Interview interview = service.scheduleInterview(dto);
            return ResponseEntity.ok(interview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Update Status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestParam String status) {
        try {
            return ResponseEntity.ok(service.updateStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Add Feedback
    @PutMapping("/{id}/feedback")
    public ResponseEntity<?> addFeedback(@PathVariable Long id,
                                         @RequestParam String feedback,
                                         @RequestParam Integer rating) {
        try {
            return ResponseEntity.ok(service.addFeedback(id, feedback, rating));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Get All
    @GetMapping
    public ResponseEntity<List<Interview>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // 🔥 FIXED: Get by Candidate (SAFE)
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<?> getByCandidate(@PathVariable String candidateId) {

        System.out.println("👉 Received candidateId: " + candidateId);

        try {
            Long id = Long.parseLong(candidateId); // ✅ SAFE CONVERSION

            List<Interview> interviews = service.getByCandidate(id);

            return ResponseEntity.ok(interviews);

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid candidate ID ❌");
        }
    }
}

