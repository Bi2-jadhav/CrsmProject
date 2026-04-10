package com.StudentService.StudentService.Client;

import com.StudentService.StudentService.Entity.JobApplication;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(
        name = "application-service",
        configuration = com.StudentService.StudentService.Security.FeignConfig.class
)
public interface ApplicationClient {

    @PostMapping("/api/applications")
    JobApplication apply(@RequestBody JobApplication application);

    @GetMapping("/api/applications/student/{studentId}")
    List<JobApplication> getByStudent(@PathVariable("studentId") Long studentId);

    @GetMapping("/api/applications/student/email/{email}")
    List<JobApplication> getByEmail(@PathVariable("email") String email);
}

