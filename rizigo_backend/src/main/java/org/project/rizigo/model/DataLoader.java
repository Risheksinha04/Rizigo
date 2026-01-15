//Utility class
package org.project.rizigo.model;

import org.project.rizigo.repository.HotelRepository;  //Get the access of database
import org.springframework.boot.CommandLineRunner;  // import makes the code run after starting up the app
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final HotelRepository hotelRepository;

    // Constructor injection
    public DataLoader(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Populate hotels table only if empty
        if (hotelRepository.count() == 0) {
            HotelEntity oyo = new HotelEntity();
            oyo.setName("OYO Deluxe");
            oyo.setLocation("Delhi");
            oyo.setPrice(2500.00);
            oyo.setRating(4.0);
            oyo.setSource("OYO");
            oyo.setRoomsAvailable(10);
            oyo.setType("hotel");
            hotelRepository.save(oyo);

            HotelEntity trivago = new HotelEntity();
            trivago.setName("Trivago Suite");
            trivago.setLocation("Bangalore");
            trivago.setPrice(2800.00);
            trivago.setRating(3.8);
            trivago.setSource("Trivago");
            trivago.setRoomsAvailable(5);
            trivago.setType("hotel");
            hotelRepository.save(trivago);

            HotelEntity riziGoBest = new HotelEntity();
            riziGoBest.setName("RiziGo Best Deal");
            riziGoBest.setLocation("Delhi");
            riziGoBest.setPrice(2000.00);
            riziGoBest.setRating(4.5);
            riziGoBest.setSource("RiziGo Mock");
            riziGoBest.setRoomsAvailable(8);
            riziGoBest.setType("hotel");
            hotelRepository.save(riziGoBest);

            HotelEntity zolo = new HotelEntity();
            zolo.setName(" Zolo Suite");
            zolo.setLocation("Pune");
            zolo.setPrice(3200.00);
            zolo.setRating(4.6);
            zolo.setSource("Zolo");
            zolo.setRoomsAvailable(6);
            zolo.setType("hotel");
            hotelRepository.save(zolo);

            System.out.println("Mock hotel data loaded into the hotels table.");
        } else {
            System.out.println("Hotel data already exists, skipping preload.");
        }
    }
}