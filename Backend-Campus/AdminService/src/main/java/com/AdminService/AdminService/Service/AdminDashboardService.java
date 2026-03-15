package com.AdminService.AdminService.Service;

import com.AdminService.AdminService.Dto.DashboardStatsDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AdminDashboardService {

        private final RestTemplate restTemplate = new RestTemplate();

        public DashboardStatsDTO stats() {

                DashboardStatsDTO dto = new DashboardStatsDTO();

                dto.totalStudents = getValue("http://localhost:8082/api/internal/students/count");

                dto.totalCompanies = getValue("http://localhost:8083/api/internal/companies/count");

                dto.totalJobs = getValue("http://localhost:8083/api/internal/jobs/count");

                dto.totalApplications = getValue("http://localhost:8082/api/internal/applications/count");

                dto.acceptedCount = getValue("http://localhost:8082/api/internal/applications/selected/count");

                dto.rejectedCount = getValue("http://localhost:8082/api/internal/applications/rejected/count");

                dto.pendingCount = getValue("http://localhost:8082/api/internal/applications/pending/count");

                dto.selectedStudents = dto.acceptedCount; // backward-compat alias

                return dto;
        }

        private long getValue(String url) {
                try {
                        Long val = restTemplate.getForObject(url, Long.class);
                        return val != null ? val : 0L;
                } catch (Exception e) {
                        return 0L;
                }
        }
}
