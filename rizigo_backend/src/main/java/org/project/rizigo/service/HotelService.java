package org.project.rizigo.service;

import org.project.rizigo.dto.HotelSearchRequest;
import org.project.rizigo.model.HotelEntity;

import java.util.List;

public interface HotelService {

    HotelEntity saveHotel(HotelEntity hotel);

    List<HotelEntity> getAllHotels();

    List<HotelEntity> searchHotels(HotelSearchRequest request);

    HotelEntity selectHotel(Long hotelId, List<HotelEntity> allHotelEntities);
}
