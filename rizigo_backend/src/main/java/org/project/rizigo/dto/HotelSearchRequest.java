package org.project.rizigo.dto;
import lombok.Data;
import jakarta.validation.constraints.*;  //annotations for input validations like @notblank, @email, etc
import java.time.LocalDate; //for check in check out dates

@Data
public class HotelSearchRequest {
    @NotBlank(message = "Location is required")
    private String location;
    @NotBlank
    private String name;
    @Min(1)
    private int numGuests;
    @Pattern(regexp = "^\\+?[0-9]\\d{11}$")
    private String phone;
    @Email
    private String email;
    @FutureOrPresent
    private LocalDate checkIn;
    @Future
    private LocalDate checkOut;
    @Min(18)
    private int age;
    @NotBlank
    private String typeAccommodation;
    @Min(1)
    private int numRooms;
}