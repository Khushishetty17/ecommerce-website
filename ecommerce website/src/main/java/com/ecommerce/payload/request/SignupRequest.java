package com.ecommerce.payload.request;

import java.util.Set;

import jakarta.validation.constraints.*;

import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    private Set<String> roles;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
    
    private String firstName;
    
    private String lastName;
    
    private String address;
    
    private String phone;
} 