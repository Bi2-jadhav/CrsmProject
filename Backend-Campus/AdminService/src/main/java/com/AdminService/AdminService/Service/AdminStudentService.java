package com.AdminService.AdminService.Service;


import com.AdminService.AdminService.Client.StudentClient;
import com.AdminService.AdminService.Dto.StudentDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminStudentService {

    private final StudentClient client;

    public AdminStudentService(StudentClient client) {
        this.client = client;
    }

    public List<StudentDTO> getAll(String token) {
        return client.getAllStudents(token);
    }

    public void block(Long id, String token) {
        client.blockStudent(id, token);
    }

    public void delete(Long id, String token) {
        client.deleteStudent(id, token);
    }
}

