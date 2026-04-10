package com.StudentService.StudentService.Service;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String upload(MultipartFile file, String email) throws IOException {

        // ✅ Create directory if not exists
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // ✅ Make filename safe
        String safeEmail = email.replace("@", "_").replace(".", "_");

        // ✅ Full file path (CORRECT)
        String filePath = uploadDir + File.separator + safeEmail + ".pdf";

        // ✅ Save file
        file.transferTo(new File(filePath));

        // ✅ Return URL (used by frontend)
        return "/uploads/resumes/" + safeEmail + ".pdf";
    }
}