package org.project.rizigo.service;

import org.project.rizigo.exception.UserAlreadyExistsException;
import org.project.rizigo.model.UserEntity;

public interface UserService {

    UserEntity registerNewUser(UserEntity user) throws UserAlreadyExistsException;
    UserEntity authenticateUser(String email, String password);
}
