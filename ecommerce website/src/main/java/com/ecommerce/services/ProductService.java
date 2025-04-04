package com.ecommerce.services;

import com.ecommerce.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    Page<Product> getAllProducts(Pageable pageable);
    
    Page<Product> getProductsByName(String name, Pageable pageable);
    
    Optional<Product> getProductById(Long id);
    
    List<Product> getProductsByCategoryId(Long categoryId);
    
    List<Product> getFeaturedProducts();
    
    Product saveProduct(Product product);
    
    void deleteProduct(Long id);
} 