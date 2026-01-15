package org.project.rizigo.configuration;
import com.amadeus.Amadeus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AmadeusConfig {
    @Value("${amadeus.api.key}")
    private String API_KEY;

    @Value("${amadeus.api.secret}")
    private String API_SECRET;

    @Bean
    public Amadeus amadeus() {
        return Amadeus.builder(API_KEY, API_SECRET).build();
    }
}
