package com.authService.authService.Service;

import com.authService.authService.Client.CompanyClient;
import com.authService.authService.Client.StudentClient;
import com.authService.authService.Entity.User;
import com.authService.authService.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final CompanyClient companyClient;
    private final StudentClient studentClient;

    public UserService(UserRepository repo, PasswordEncoder encoder, CompanyClient companyClient, StudentClient studentClient) {
        this.repo = repo;
        this.encoder = encoder;
        this.companyClient = companyClient;
        this.studentClient = studentClient;
    }

    public User register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        User savedUser = repo.save(user);

        // 🔥 PROACTIVE PROFILE CREATION
        try {
            if ("COMPANY".equals(savedUser.getRole())) {
                companyClient.createProfile(savedUser.getEmail(), savedUser.getName() != null ? savedUser.getName() : savedUser.getEmail().split("@")[0]);
                System.out.println("🚀 Proactively created company profile for " + savedUser.getEmail());
            } else if ("STUDENT".equals(savedUser.getRole())) {
                studentClient.createProfile(savedUser.getEmail(), savedUser.getName() != null ? savedUser.getName() : "Student");
                System.out.println("🚀 Proactively created student profile for " + savedUser.getEmail());
            }
        } catch (Exception e) {
            System.err.println("⚠️ Proactive profile creation failed: " + e.getMessage());
            // We don't fail registration if profile creation fails (lazy-fallback exists)
        }

        return savedUser;
    }

    public User getByEmail(String email) {
        return repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}