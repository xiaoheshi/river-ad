package com.riverad.controller;

import com.riverad.dto.AuthRequest;
import com.riverad.dto.AuthResponse;
import com.riverad.dto.RegisterRequest;
import com.riverad.model.User;
import com.riverad.service.UserService;
import com.riverad.utils.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.createUser(
                request.getEmail(),
                request.getPassword(),
                request.getFirstName(),
                request.getLastName()
            );
            
            if (request.getPreferredLanguage() != null) {
                user.setPreferredLanguage(request.getPreferredLanguage());
            }

            String token = jwtUtil.generateToken(user.getEmail(), user.getId());
            AuthResponse response = new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName());
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        Optional<User> userOpt = userService.findActiveUserByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("用户不存在或已被禁用");
        }
        
        User user = userOpt.get();
        if (!userService.verifyPassword(user, request.getPassword())) {
            return ResponseEntity.badRequest().body("密码错误");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        AuthResponse response = new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        if (jwtUtil.validateToken(token) && !jwtUtil.isTokenExpired(token)) {
            String email = jwtUtil.getEmailFromToken(token);
            Long userId = jwtUtil.getUserIdFromToken(token);
            
            return ResponseEntity.ok().body("Token有效，用户: " + email + ", ID: " + userId);
        } else {
            return ResponseEntity.badRequest().body("Token无效或已过期");
        }
    }
}