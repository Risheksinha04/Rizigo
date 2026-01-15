package org.project.rizigo.service;

import com.amadeus.exceptions.ResponseException;
import org.project.rizigo.dto.HotelSearchRequest;
import org.project.rizigo.model.HotelEntity;
import org.project.rizigo.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class HotelServiceExe implements HotelService {

    private final HotelRepository hotelRepository;
    private final AmadeusService amadeusService;

    @Autowired
    public HotelServiceExe(HotelRepository hotelRepository, AmadeusService amadeusService) {
        this.hotelRepository = hotelRepository;
        this.amadeusService = amadeusService;
    }

    @Override
    public HotelEntity saveHotel(HotelEntity hotel) {
        return hotelRepository.save(hotel);
    }

    @Override
    public List<HotelEntity> getAllHotels() {
        return hotelRepository.findAll();
    }

    @Override
    public List<HotelEntity> searchHotels(HotelSearchRequest request) {
        // Fetch local hotels from the database
        List<HotelEntity> localHotels = hotelRepository.findByLocation(request.getLocation());

        // Use the Amadeus service to get the city code from the location name
        String cityCode = amadeusService.getCityCode(request.getLocation());

        // Fetch hotels from the Amadeus API if a city code was found
        List<HotelEntity> amadeusHotels = new ArrayList<>();
        if (cityCode != null) {
            try {
                // Create a temporary request object for the Amadeus service that includes the cityCode
                HotelSearchRequest amadeusRequest = new HotelSearchRequest();
                amadeusRequest.setLocation(cityCode);
                amadeusRequest.setCheckIn(request.getCheckIn());
                amadeusRequest.setCheckOut(request.getCheckOut());
                amadeusRequest.setNumGuests(request.getNumGuests());

                amadeusHotels = amadeusService.fetchHotels(amadeusRequest);
            } catch (Exception e) {
                // If the Amadeus API call fails, we just log the error and continue with local hotels.
                System.err.println("Failed to fetch hotels from Amadeus: " + e.getMessage());
            }
        }

        // Merge both lists into a single, comprehensive list
        List<HotelEntity> allHotels = new ArrayList<>();
        allHotels.addAll(localHotels);
        allHotels.addAll(amadeusHotels);

        // Sort the combined list based on your specified criteria:
        // 1. Highest rating first (descending order)
        // 2. Lowest price for hotels with the same rating (ascending order)

            allHotels.sort(
                    Comparator.comparingDouble(HotelEntity::getPrice)
                            .thenComparing(Comparator.comparingDouble(HotelEntity::getRating).reversed())
            );

            return allHotels;




    }

    @Override
    public HotelEntity selectHotel(Long hotelId, List<HotelEntity> allHotelEntities) {
        HotelEntity selected = allHotelEntities.stream()
                .filter(h -> h.getId() != null && h.getId().equals(hotelId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Hotel not found: " + hotelId));

        double maxOtherPrice = allHotelEntities.stream()
                .filter(h -> h.getId() != null && !h.getId().equals(hotelId)
                        && (h.getSource() != null &&
                        (h.getSource().equals("OYO") || h.getSource().equals("Trivago"))))
                .mapToDouble(HotelEntity::getPrice)
                .max()
                .orElse(selected.getPrice());

        double savings = maxOtherPrice - selected.getPrice();
        selected.setComparisonMessage(savings > 0 ?
                "You saved ₹" + (int) savings + " vs. OYO/Trivago!" :
                "No savings available.");
        return selected;
    }
}
