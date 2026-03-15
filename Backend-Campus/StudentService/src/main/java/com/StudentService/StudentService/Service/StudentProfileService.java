package com.StudentService.StudentService.Service;

import com.StudentService.StudentService.Entity.StudentProfile;
import com.StudentService.StudentService.Repository.StudentProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentProfileService {

    private final StudentProfileRepository repository;

    public StudentProfileService(StudentProfileRepository repository) {
        this.repository = repository;
    }

    // =====================
    // STUDENT METHODS
    // =====================

    public StudentProfile getByEmail(String email) {
        return repository.findAll()
                .stream()
                .filter(s -> s.getEmail().equals(email))
                .findFirst()
                .orElse(null);
    }

    public StudentProfile save(StudentProfile profile) {
        return repository.save(profile);
    }

    // =====================
    // ADMIN METHODS
    // =====================

    // ✅ Admin: view all students
    public List<StudentProfile> getAll() {
        return repository.findAll();
    }

    // ✅ Admin: block student
    public void block(Long id) {
        StudentProfile student = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setBlocked(true);
        repository.save(student);
    }

    // ✅ Admin: count all students
    public long getCount() {
        return repository.count();
    }

    // ✅ Admin: delete student
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
