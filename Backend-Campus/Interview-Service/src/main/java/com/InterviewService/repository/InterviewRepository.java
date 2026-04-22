package com.interviewService.repository;



import com.interviewService.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findByCandidateId(Long candidateId);

    // 🔥 Primary lookup: by email (reliable across all scenarios)
    List<Interview> findByCandidateEmail(String candidateEmail);

    List<Interview> findByCompanyId(Long companyId);

    List<Interview> findByInterviewDateTimeBetween(
            LocalDateTime start, LocalDateTime end);
}