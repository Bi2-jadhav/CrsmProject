package com.authService.authService.Controller;

import com.authService.authService.Dto.AuthResponse;
import com.authService.authService.Dto.LoginRequest;
import com.authService.authService.Entity.User;
import com.authService.authService.Service.JwtService;
import com.authService.authService.Service.UserService;
import com.authService.authService.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder encoder;

    public AuthController(UserService userService,
                          JwtService jwtService,
                          PasswordEncoder encoder) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.encoder = encoder;
    }

    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        User user = userService.getByEmail(request.getEmail());

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return new AuthResponse(token);
    }

}
