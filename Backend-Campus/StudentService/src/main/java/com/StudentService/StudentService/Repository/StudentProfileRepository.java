package com.StudentService.StudentService.Repository;

import com.StudentService.StudentService.Entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByEmail(String email);
}