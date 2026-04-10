package com.interviewService.service;

import com.interviewService.dto.InterviewDTO;

import com.interviewService.entity.Interview;
import com.interviewService.repository.InterviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterviewService {

    private final InterviewRepository repo;

    public InterviewService(InterviewRepository repo) {
        this.repo = repo;
    }

    // 🔥 Schedule Interview
    public Interview scheduleInterview(InterviewDTO dto) {

        // ✅ Conflict Detection (optional but important)
        List<Interview> existing = repo.findByInterviewDateTimeBetween(
                dto.getInterviewDateTime().minusMinutes(30),
                dto.getInterviewDateTime().plusMinutes(30)
        );

        if (!existing.isEmpty()) {
            throw new RuntimeException("Time slot already booked!");
        }

        Interview interview = new Interview();

        interview.setCandidateId(dto.getCandidateId());
        interview.setCompanyId(dto.getCompanyId());
        interview.setJobRole(dto.getJobRole());
        interview.setInterviewType(dto.getInterviewType());
        interview.setMode(dto.getMode());
        interview.setInterviewDateTime(dto.getInterviewDateTime());
        interview.setMeetingLink(dto.getMeetingLink());
        interview.setInterviewerName(dto.getInterviewerName());

        interview.setStatus("Scheduled");

        return repo.save(interview);
    }

    // 🔥 Update Status
    public Interview updateStatus(Long id, String status) {
        Interview interview = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        interview.setStatus(status);
        return repo.save(interview);
    }

    // 🔥 Add Feedback
    public Interview addFeedback(Long id, String feedback, Integer rating) {
        Interview interview = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        interview.setFeedback(feedback);
        interview.setRating(rating);

        return repo.save(interview);
    }

    // 🔥 Get All
    public List<Interview> getAll() {
        return repo.findAll();
    }

    // 🔥 Get by Candidate
    public List<Interview> getByCandidate(Long candidateId) {
        return repo.findByCandidateId(candidateId);
    }
}