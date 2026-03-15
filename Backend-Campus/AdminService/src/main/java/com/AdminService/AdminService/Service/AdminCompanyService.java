package com.AdminService.AdminService.Service;

import com.AdminService.AdminService.Client.CompanyClient;
import com.AdminService.AdminService.Dto.CompanyDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminCompanyService {

    private final CompanyClient companyClient;

    public AdminCompanyService(CompanyClient companyClient) {
        this.companyClient = companyClient;
    }

    public List<CompanyDTO> getAll() {
        return companyClient.getAllCompanies();
    }

    public void block(Long id) {
        companyClient.block(id);
    }

    public void unblock(Long id) {
        companyClient.unblock(id);
    }

    public void delete(Long id) {
        companyClient.delete(id);
    }
}
