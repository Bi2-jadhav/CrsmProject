package com.StudentService.StudentService.Service;

import com.StudentService.StudentService.Entity.StudentProfile;
import com.StudentService.StudentService.Repository.StudentProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentProfileService {

    private final StudentProfileRepository repository;

    // ✅ Correct constructor
    public StudentProfileService(StudentProfileRepository repository) {
        this.repository = repository;
    }

    // =====================
    // STUDENT METHODS
    // =====================

    public StudentProfile getByEmail(String email) {
        return repository.findByEmail(email).orElse(null);
    }

    public StudentProfile getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public StudentProfile save(StudentProfile profile) {
        return repository.save(profile);
    }

    // =====================
    // ADMIN METHODS
    // =====================

    public List<StudentProfile> getAll() {
        return repository.findAll();
    }

    public void block(Long id) {
        StudentProfile student = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setBlocked(true);
        repository.save(student);
    }

    public long getCount() {
        return repository.count();
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}