package com.StudentService.StudentService.Controller;

import com.StudentService.StudentService.Dto.StudentDTO;
import com.StudentService.StudentService.Entity.StudentProfile;
import com.StudentService.StudentService.Service.StudentProfileService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internal/students")
public class InternalStudentController {

    private final StudentProfileService service;

    public InternalStudentController(StudentProfileService service) {
        this.service = service;
    }

    @GetMapping
    public List<?> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public StudentDTO getById(@PathVariable Long id) {

        StudentProfile student = service.getById(id);

        if (student == null) return null;

        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setBranch(student.getBranch());
        dto.setCgpa(student.getCgpa());
        dto.setSkills(student.getSkills());
        dto.setResumePath(student.getResumePath());

        return dto;
    }
    @GetMapping("/count")
    public long getCount() {
        return service.getCount();
    }

    @PutMapping("/block/{id}")
    public void block(@PathVariable Long id) {
        service.block(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
