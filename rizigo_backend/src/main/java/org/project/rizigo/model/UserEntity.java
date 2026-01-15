package org.project.rizigo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Username required")
    private String name;

    @NotBlank(message = "valid email field required to move ahead")
    @Email
    private String email;

    @NotBlank(message = "Password required to move ahead")
    @Column(nullable = false)
    private String password;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[1-9]\\d{1,15}$")
    private String phone;

    @Min(value = 18, message = "You must be atleast 18 years of age to be eligible")
    private Integer age;


   
}