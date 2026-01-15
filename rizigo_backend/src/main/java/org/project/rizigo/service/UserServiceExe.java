package org.project.rizigo.service;

import org.project.rizigo.exception.UserAlreadyExistsException;
import org.project.rizigo.model.UserEntity;
import org.project.rizigo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceExe implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceExe(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserEntity registerNewUser(UserEntity user) throws UserAlreadyExistsException {
        // Check if a user with the given email already exists
        Optional<UserEntity> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("A user with this email already exists.");
        }

        // Hash the password for secure storage
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save the new user to the database
        return userRepository.save(user);
    }

    @Override
    public UserEntity authenticateUser(String email, String password) {
        // Find the user by email
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Compare the provided password with the stored hashed password
        if (passwordEncoder.matches(password, user.getPassword())) {
            return user; // Authentication successful
        } else {
            throw new RuntimeException("Invalid password.");
        }
    }
}
