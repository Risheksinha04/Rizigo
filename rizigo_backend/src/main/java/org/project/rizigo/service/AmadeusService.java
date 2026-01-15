package org.project.rizigo.service;

import com.amadeus.Amadeus;
import com.amadeus.Params;
import com.amadeus.exceptions.ResponseException;
import com.amadeus.resources.HotelOfferSearch;
import com.amadeus.resources.Location;
import org.project.rizigo.dto.HotelSearchRequest;
import org.project.rizigo.model.HotelEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * A service class that handles all API interactions with the Amadeus Hotel Booking API.
 * This class is responsible for fetching hotel offers and converting the API response
 * into the application's internal data model (HotelEntity).
 */
@Service
public class AmadeusService {

    private final Amadeus amadeus;


    @Autowired
    public AmadeusService(Amadeus amadeus) {
        this.amadeus = amadeus;
    }


    public String getCityCode(String keyword) {
        try {
            Location[] locations = amadeus.referenceData.locations.get(Params.with("keyword", keyword)
                    .and("subType", "CITY"));
            if (locations != null && locations.length > 0) {
                return locations[0].getIataCode();
            }
        } catch (ResponseException e) {
            System.err.println("Error finding city code: " + e.getMessage());
        }
        return null;
    }

    /**
     * Fetches hotel offers from the Amadeus API based on the search request.
     *
     * @param request The search criteria including location, check-in/out dates, and number of guests.
     * @return A list of HotelEntity objects. Returns an empty list if an error occurs.
     */
    public List<HotelEntity> fetchHotels(HotelSearchRequest request) {
        try {
            // Updated API endpoint to the new hotelOffersSearch
            HotelOfferSearch[] offers = amadeus.shopping.hotelOffersSearch.get(
                    Params.with("cityCode", request.getLocation())
                            .and("checkInDate", request.getCheckIn().toString())
                            .and("checkOutDate", request.getCheckOut().toString())
                            .and("adults", request.getNumGuests())
            );
            return convertToHotelEntities(offers);
        } catch (ResponseException e) {
            System.err.println("Error fetching hotels from Amadeus: " + e.getMessage());
            // It's good practice to return an empty list on API error to prevent cascading failures.
            return new ArrayList<>();
        }
    }

    /**
     * Helper method to convert the raw Amadeus API response into a list of HotelEntity objects.
     *
     * @param hotelOffers An array of HotelOfferSearch objects from the Amadeus API.
     * @return A list of HotelEntity objects.
     */
    private List<HotelEntity> convertToHotelEntities(HotelOfferSearch[] hotelOffers) {
        if (hotelOffers == null) {
            return new ArrayList<>();
        }

        return Arrays.stream(hotelOffers)
                .map(hotelOffer -> {
                    // Changed the variable type to the correct nested class
                    com.amadeus.resources.HotelOfferSearch.Hotel hotelData = hotelOffer.getHotel();
                    String hotelName = hotelData.getName();
                    // Accessing the city code directly from the public field
                    String location = (hotelData.getCityCode() != null) ? hotelData.getCityCode() : "";
                    double price = Double.parseDouble(hotelOffer.getOffers()[0].getPrice().getTotal());
                    // The Amadeus API's Hotel Offers endpoint does not provide a rating.
                    // A random rating is used here for demonstration purposes.
                    double rating = (Math.random() * 5) + 1;

                    HotelEntity hotelEntity = new HotelEntity();
                    hotelEntity.setName(hotelName);
                    hotelEntity.setLocation(location);
                    hotelEntity.setPrice(price);
                    hotelEntity.setRating(rating);
                    hotelEntity.setSource("Amadeus");
                    hotelEntity.setRoomsAvailable(5); // This value is not in the API and is mocked.
                    hotelEntity.setType("hotel");
                    return hotelEntity;
                })
                .collect(Collectors.toList());
    }
}
