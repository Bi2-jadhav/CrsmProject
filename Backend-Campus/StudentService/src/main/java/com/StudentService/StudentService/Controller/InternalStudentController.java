package com.StudentService.StudentService.Controller;

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
    public Object getById(@PathVariable Long id) {
        return service.getById(id);
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
