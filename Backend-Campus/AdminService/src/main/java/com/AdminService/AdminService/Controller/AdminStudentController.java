package com.AdminService.AdminService.Controller;


import com.AdminService.AdminService.Dto.StudentDTO;
import com.AdminService.AdminService.Service.AdminStudentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/students")
public class AdminStudentController {

    private final AdminStudentService service;

    public AdminStudentController(AdminStudentService service) {
        this.service = service;
    }

    @GetMapping
    public List<StudentDTO> allStudents(
            @RequestHeader("Authorization") String token
    ) {
        return service.getAll(token);
    }

    @PutMapping("/block/{id}")
    public String block(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {
        service.block(id, token);
        return "Student blocked";
    }

    @DeleteMapping("/{id}")
    public String delete(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token
    ) {
        service.delete(id, token);
        return "Student deleted";
    }
}
