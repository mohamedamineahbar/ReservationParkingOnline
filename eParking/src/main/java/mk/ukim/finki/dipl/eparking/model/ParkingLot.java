package mk.ukim.finki.dipl.eparking.model;


import jakarta.persistence.*;
import lombok.*;


@Entity
@Data
public class ParkingLot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String address;

    private Double latitude;

    private Double longitude;

    private Integer totalSpots;

    private Integer availableSpots;

    private Integer pricePerHour;

    public ParkingLot(){};

    public ParkingLot(String name, String address, Double latitude, Double longitude, Integer totalSpots, Integer availableSpots, Integer pricePerHour) {
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.totalSpots = totalSpots;
        this.availableSpots = availableSpots;
        this.pricePerHour = pricePerHour;
    }

    public Integer getPricePerHour() {
        return pricePerHour;
    }

    public Integer getAvailableSpots() {
        return availableSpots;
    }

    public Integer getTotalSpots() {
        return totalSpots;
    }

    public Double getLongitude() {
        return longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public String getAddress() {
        return address;
    }

    public String getName() {
        return name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public void setTotalSpots(Integer totalSpots) {
        this.totalSpots = totalSpots;
    }

    public void setAvailableSpots(Integer availableSpots) {
        this.availableSpots = availableSpots;
    }

    public void setPricePerHour(Integer pricePerHour) {
        this.pricePerHour = pricePerHour;
    }
}

