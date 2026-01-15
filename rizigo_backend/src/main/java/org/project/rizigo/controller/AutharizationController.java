package org.project.rizigo.controller;

import jakarta.validation.Valid;
import org.project.rizigo.dto.LoginRequest;
import org.project.rizigo.dto.RegisterRequest;
import org.project.rizigo.exception.UserAlreadyExistsException;
import org.project.rizigo.model.UserEntity;
import org.project.rizigo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin()   //For cors
@RestController
@RequestMapping("/auth")
public class AutharizationController {

    private final UserService userService;

    @Autowired //Constructors are self made
    public AutharizationController(UserService userService) {
        this.userService = userService;
    }

    // For User Authorization
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // Map the DTO to the UserEntity for the service layer
            UserEntity user = new UserEntity();
            user.setName(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(registerRequest.getPassword());
            user.setPhone(registerRequest.getPhone());
            user.setAge(registerRequest.getAge());

            UserEntity registeredUser = userService.registerNewUser(user);
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        } catch (UserAlreadyExistsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }

    }


    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            UserEntity user = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
            return new ResponseEntity<>("Login successful", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

}
