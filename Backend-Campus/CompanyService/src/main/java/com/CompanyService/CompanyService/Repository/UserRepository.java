package com.CompanyService.CompanyService.Repository;

import com.CompanyService.CompanyService.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    List<UserEntity> findByRole(String role);
}