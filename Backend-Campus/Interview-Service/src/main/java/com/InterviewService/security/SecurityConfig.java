package com.interviewService.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // ✅ internal microservice calls
                        .requestMatchers("/api/internal/**").permitAll()

                        // ✅ Students can view their own interviews
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/interviews/candidate/**")
                            .hasAnyRole("STUDENT", "COMPANY", "ADMIN")

                        // ✅ Company/Admin can schedule and manage interviews
                        .requestMatchers("/api/interviews/**").hasAnyRole("COMPANY", "ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}