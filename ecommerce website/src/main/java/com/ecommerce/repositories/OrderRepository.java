package com.ecommerce.repositories;

import com.ecommerce.models.Order;
import com.ecommerce.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Order> findByStatus(Order.OrderStatus status);
    
    List<Order> findByUserOrderByOrderDateDesc(User user);
} 