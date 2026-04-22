
        package com.CompanyService.CompanyService.Service;

import com.CompanyService.CompanyService.Dto.CompanyDTO;
import com.CompanyService.CompanyService.Entity.CompanyProfile;
import com.CompanyService.CompanyService.Entity.UserEntity;
import com.CompanyService.CompanyService.Repository.CompanyProfileRepository;
import com.CompanyService.CompanyService.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {

    private final CompanyProfileRepository companyProfileRepository;
    private final UserRepository userRepository;

    public CompanyService(CompanyProfileRepository companyProfileRepository,
                          UserRepository userRepository) {
        this.companyProfileRepository = companyProfileRepository;
        this.userRepository = userRepository;
    }

    public long getCompanyCount() {
        return userRepository.findByRole("COMPANY").size();
    }

    // ✅ FIXED: Always ensure profile exists
    public List<CompanyDTO> getAllCompanies() {

        List<UserEntity> companies = userRepository.findByRole("COMPANY");

        return companies.stream().map(user -> {

            CompanyProfile profile =
                    companyProfileRepository.findByEmail(user.getEmail());

            // 🔥 AUTO-CREATE PROFILE IF NOT EXISTS
            if (profile == null) {
                profile = new CompanyProfile();
                profile.setEmail(user.getEmail());
                profile.setCompanyName(user.getName());
                profile.setLocation("N/A");
                profile = companyProfileRepository.save(profile);
            }

            CompanyDTO dto = new CompanyDTO();
            dto.setId(user.getId()); // keep user id
            dto.setEmail(user.getEmail());
            dto.setCompanyName(profile.getCompanyName());
            dto.setLocation(profile.getLocation());
            dto.setBlocked(profile.isBlocked());

            return dto;

        }).toList();
    }

    // 🔥 FIXED: use EMAIL instead of ID
    public void block(Long userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow();

        CompanyProfile profile =
                companyProfileRepository.findByEmail(user.getEmail());

        if (profile != null) {
            profile.setBlocked(true);
            companyProfileRepository.save(profile);
        }
    }

    public void unblock(Long userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow();

        CompanyProfile profile =
                companyProfileRepository.findByEmail(user.getEmail());

        if (profile != null) {
            profile.setBlocked(false);
            companyProfileRepository.save(profile);
        }
    }

    public void delete(Long userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow();

        CompanyProfile profile =
                companyProfileRepository.findByEmail(user.getEmail());

        if (profile != null) {
            companyProfileRepository.delete(profile);
        }
    }
}
