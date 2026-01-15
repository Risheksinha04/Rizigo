package org.project.rizigo.controller;

import org.project.rizigo.dto.HotelSearchRequest;
import org.project.rizigo.dto.HotelResponse;
import org.project.rizigo.model.HotelEntity;
import org.project.rizigo.service.HotelService;
import org.project.rizigo.service.AmadeusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/hotels")
public class HotelController {

    private final HotelService hotelService;
    private final AmadeusService amadeusService;

    @Autowired
    public HotelController(HotelService hotelService, AmadeusService amadeusService) {
        this.hotelService = hotelService;
        this.amadeusService = amadeusService;
    }

    @PostMapping("/search")
    public ResponseEntity<HotelResponse> searchHotels(@Valid @RequestBody HotelSearchRequest request) {    //validating the DTO and desirealizing the JSON
        String cityCode = amadeusService.getCityCode(request.getLocation());   //both

        List<HotelEntity> hotels;
        String message;

        if (cityCode == null) {
            // No city code: try local DB with requested city (case-insensitive)
            hotels = hotelService.getAllHotels().stream()
                    .filter(hotel -> hotel.getLocation().equalsIgnoreCase(request.getLocation()))
                    .collect(Collectors.toList());

            // If still no results then generate local data/mock
            if (hotels.isEmpty()) {
                hotels.add(generateMockHotel(request.getLocation()));
                message = "No hotels found for '" + request.getLocation() + " '. Showing local data.";
            } else {
                message = "Showing hotels for '" + request.getLocation() + "'";
            }
        } else {
            // Use city code for Amadeus search
            HotelSearchRequest searchReq = new HotelSearchRequest();
            searchReq.setLocation(cityCode);
            searchReq.setNumGuests(request.getNumGuests());
            searchReq.setNumRooms(request.getNumRooms());
            searchReq.setCheckIn(request.getCheckIn());
            searchReq.setCheckOut(request.getCheckOut());
            searchReq.setTypeAccommodation(request.getTypeAccommodation());

            hotels = hotelService.searchHotels(searchReq);

            if (hotels.isEmpty()) {
                // Try local DB for the original city
                hotels = hotelService.getAllHotels().stream()
                        .filter(hotel -> hotel.getLocation().equalsIgnoreCase(request.getLocation()))
                        .collect(Collectors.toList());

                if (hotels.isEmpty()) {
                    hotels.add(generateMockHotel(request.getLocation()));
                    message = "No hotels found for city code: " + cityCode + ". Showing mock data.";
                } else {
                    message = "No Amadeus hotels found. Showing local DB hotels for '" + request.getLocation() + "'";
                }
            } else {
                message = "Hotels found successfully";
            }
        }
        HotelResponse response = new HotelResponse(message, hotels);
        return ResponseEntity.ok(response);
    }

    private HotelEntity generateMockHotel(String location) {
        HotelEntity mock = new HotelEntity();
        mock.setName("Mock Hotel, " + capitalize(location));
        mock.setLocation(location);
        mock.setPrice(3000);
        mock.setRating(4.2);
        mock.setSource("Generic Mock");
        mock.setRoomsAvailable(7);
        mock.setType("hotel");
        return mock;
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return "";
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
}
