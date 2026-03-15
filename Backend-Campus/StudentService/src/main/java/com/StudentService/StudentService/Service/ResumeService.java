package com.StudentService.StudentService.Service;



import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class ResumeService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String upload(MultipartFile file, String email) throws IOException {

        Path dirPath = Paths.get(uploadDir);
        Files.createDirectories(dirPath);

        Path filePath = dirPath.resolve(email + ".pdf");
        file.transferTo(filePath.toFile());

        return "resumes/" + email + ".pdf";
    }
}

