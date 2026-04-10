package com.applicationService.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RequestInheritanceFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        ServletRequestAttributes attributes = new ServletRequestAttributes(request);
        
        // 🔥 This makes the request attributes available to child threads (like Feign threads)
        RequestContextHolder.setRequestAttributes(attributes, true);

        try {
            filterChain.doFilter(request, response);
        } finally {
            RequestContextHolder.resetRequestAttributes();
        }
    }
}
