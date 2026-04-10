package com.interviewService.dto;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class InterviewDTO {

    private Long candidateId;
    private Long companyId;
    private String jobRole;
    private String interviewType;
    private String mode;
    private LocalDateTime interviewDateTime;
    private String meetingLink;
    private String interviewerName;

    public Long getCandidateId() {
        return candidateId;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public String getJobRole() {
        return jobRole;
    }

    public String getInterviewType() {
        return interviewType;
    }

    public String getMode() {
        return mode;
    }

    public LocalDateTime getInterviewDateTime() {
        return interviewDateTime;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public String getInterviewerName() {
        return interviewerName;
    }
}