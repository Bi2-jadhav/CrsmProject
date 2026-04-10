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

    // ✅ MAIN FIX
    public List<CompanyDTO> getAllCompanies() {

        List<UserEntity> companies = userRepository.findByRole("COMPANY");

        return companies.stream().map(user -> {

            CompanyProfile profile =
                    companyProfileRepository.findByEmail(user.getEmail());

            CompanyDTO dto = new CompanyDTO();
            dto.setId(user.getId());
            dto.setEmail(user.getEmail());

            dto.setCompanyName(
                    profile != null ? profile.getCompanyName() : user.getName()
            );

            dto.setLocation(
                    profile != null ? profile.getLocation() : "N/A"
            );

            dto.setBlocked(
                    profile != null && profile.isBlocked()
            );

            return dto;

        }).toList();
    }

    // ✅ BLOCK
    public void block(Long id) {
        CompanyProfile c = companyProfileRepository.findById(id).orElseThrow();
        c.setBlocked(true);
        companyProfileRepository.save(c);
    }

    // ✅ UNBLOCK
    public void unblock(Long id) {
        CompanyProfile c = companyProfileRepository.findById(id).orElseThrow();
        c.setBlocked(false);
        companyProfileRepository.save(c);
    }

    // ✅ DELETE
    public void delete(Long id) {
        companyProfileRepository.deleteById(id);
    }
}