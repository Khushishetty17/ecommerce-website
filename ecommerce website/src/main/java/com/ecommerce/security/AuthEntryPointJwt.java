package com.ecommerce.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        
        logger.error("Unauthorized error: {}", authException.getMessage());
        
        // For development purposes, include detailed error information
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        
        // Get the request details for debugging
        String path = request.getRequestURI();
        String method = request.getMethod();
        String queryString = request.getQueryString();
        String fullURL = path + (queryString != null ? "?" + queryString : "");
        
        // Create a detailed error response
        Map<String, Object> body = new HashMap<>();
        body.put("status", HttpServletResponse.SC_UNAUTHORIZED);
        body.put("error", "Unauthorized");
        body.put("message", authException.getMessage());
        body.put("path", path);
        body.put("method", method);
        body.put("fullURL", fullURL);
        body.put("timestamp", System.currentTimeMillis());
        
        // Log detailed information for debugging
        logger.debug("Unauthorized request details: METHOD={}, URL={}, ERROR={}", 
                method, fullURL, authException.getMessage());
        
        objectMapper.writeValue(response.getOutputStream(), body);
    }
} 