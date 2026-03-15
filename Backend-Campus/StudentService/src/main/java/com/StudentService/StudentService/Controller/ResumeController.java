package com.StudentService.StudentService.Controller;


import com.StudentService.StudentService.Service.ResumeService;
import com.StudentService.StudentService.Service.StudentProfileService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequestMapping("/api/student/resume")
public class ResumeController {

    private final ResumeService resumeService;
    private final StudentProfileService profileService;

    public ResumeController(ResumeService resumeService,
                            StudentProfileService profileService) {
        this.resumeService = resumeService;
        this.profileService = profileService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public String upload(@RequestParam("file") MultipartFile file,
                         Principal principal) throws Exception {

        System.out.println("Received file: " + file.getOriginalFilename());

        String path = resumeService.upload(file, principal.getName());

        var profile = profileService.getByEmail(principal.getName());
        profile.setResumePath(path);
        profileService.save(profile);

        return "Resume uploaded successfully";
    }
}
