package com.ecommerce.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import com.ecommerce.models.Role;
import com.ecommerce.models.User;
import com.ecommerce.repositories.RoleRepository;
import com.ecommerce.repositories.UserRepository;
import com.ecommerce.security.JwtUtils;
import com.ecommerce.security.UserDetailsImpl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This controller is for DEVELOPMENT TESTING ONLY
 * It should be removed or secured in production
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test-auth")
public class TestAuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(TestAuthController.class);

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Test Auth Controller is working");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
        try {
            logger.info("Attempting login for user: {}", username);
            
            // Check if user exists first
            if (!userRepository.existsByUsername(username)) {
                logger.error("Login failed: User {} does not exist", username);
                Map<String, String> response = new HashMap<>();
                response.put("error", "User does not exist");
                return ResponseEntity.badRequest().body(response);
            }
            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            logger.info("Login successful for user: {}", username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("id", userDetails.getId());
            response.put("username", userDetails.getUsername());
            response.put("email", userDetails.getEmail());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed for user: {} - Error: {}", username, e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Authentication failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdminUser() {
        try {
            // Check if admin already exists
            if (userRepository.existsByUsername("admin")) {
                logger.info("Admin user already exists");
                Map<String, String> response = new HashMap<>();
                response.put("message", "Admin user already exists");
                return ResponseEntity.ok(response);
            }
            
            // Check if roles exist, create them if they don't
            createRolesIfNotExist();
            
            // Create new admin user
            User user = new User();
            user.setUsername("admin");
            user.setEmail("admin@example.com");
            user.setPassword(encoder.encode("adminpassword"));
            user.setFirstName("Admin");
            user.setLastName("User");
            user.setAddress("123 Admin St");
            user.setPhone("1234567890");
            
            Set<Role> roles = new HashSet<>();
            Role adminRole = roleRepository.findByName(Role.ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Admin Role not found."));
            roles.add(adminRole);
            user.setRoles(roles);
            
            userRepository.save(user);
            
            logger.info("Admin user created successfully");
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Admin user created successfully!");
            response.put("username", "admin");
            response.put("password", "adminpassword");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error creating admin user: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error creating admin user: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/roles")
    public ResponseEntity<?> createRoles() {
        try {
            createRolesIfNotExist();
            
            logger.info("Roles created or verified successfully");
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Roles created successfully!");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error creating roles: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error creating roles: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    private void createRolesIfNotExist() {
        // Create roles if they don't exist
        try {
            roleRepository.findByName(Role.ERole.ROLE_USER)
                .orElseGet(() -> {
                    Role userRole = new Role();
                    userRole.setName(Role.ERole.ROLE_USER);
                    logger.info("Created USER role");
                    return roleRepository.save(userRole);
                });
            
            roleRepository.findByName(Role.ERole.ROLE_ADMIN)
                .orElseGet(() -> {
                    Role adminRole = new Role();
                    adminRole.setName(Role.ERole.ROLE_ADMIN);
                    logger.info("Created ADMIN role");
                    return roleRepository.save(adminRole);
                });
        } catch (Exception e) {
            logger.error("Error creating roles: {}", e.getMessage());
        }
    }
} 