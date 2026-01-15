//POJO class
package org.project.rizigo.dto;

import lombok.AllArgsConstructor;  //generates constructor
import lombok.Data;  // For generating getters setters and also other methods like toString(), equals(), and hashCode()

import java.util.List;

@Data
@AllArgsConstructor
public class HotelResponse {
    private String message;   //declaration for showing the status
    private List<?> data;
}
