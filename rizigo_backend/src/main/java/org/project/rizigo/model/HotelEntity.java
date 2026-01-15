package org.project.rizigo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "hotels")
public class HotelEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String name;
    private String location;


    private double price;
    private double rating;


    private String source;          // "LocalDB", "Amadeus", "OYO", etc.
    private int roomsAvailable;     // Number of available rooms
    private String type;            // Room type (e.g., "Deluxe", "Suite")


    @Transient  //comparison result
    private String comparisonMessage;
}
