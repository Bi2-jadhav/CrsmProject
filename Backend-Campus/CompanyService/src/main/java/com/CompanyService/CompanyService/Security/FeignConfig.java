package com.CompanyService.CompanyService.Security;

import feign.RequestInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {

            ServletRequestAttributes attributes =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();

                String authHeader = request.getHeader("Authorization");

                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    System.out.println("🚀 COMPANY-SERVICE: Propagating token to downstream service");
                    requestTemplate.header("Authorization", authHeader);
                } else {
                    System.err.println("⚠️ COMPANY-SERVICE: No Authorization header found in context!");
                }
            } else {
                System.err.println("❌ COMPANY-SERVICE: RequestAttributes is NULL in Feign thread!");
            }

        };
    }
}