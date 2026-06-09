import axiosInstance from "../api/axios";
import axios from "axios";

// Get all parking lots
export const getAllParkingLots = async () => {
    const response = await axiosInstance.get("/parkinglots");
    return response.data;
};

// Get parking lot by ID
export const getParkingLotById = async (id) => {
    const response = await axiosInstance.get(`/parkinglots/${id}`);
    return response.data;
};

// Add a new parking lot
export const addParkingLot = async (dto) => {
    const response = await axiosInstance.post("/parkinglots/add", dto);
    return response.data;
};

// Update a parking lot
export const updateParkingLot = async (id, dto) => {
    const response = await axiosInstance.put(`/parkinglots/edit/${id}`, dto);
    return response.data;
};

// Delete a parking lot
export const deleteParkingLot = async (id) => {
    await axiosInstance.delete(`/parkinglots/delete/${id}`);
};
export const reserveNowPayLater = async (parkingLotId) => {
    const dto = {
        parkingLotId,
        type: "NOW_PAY_LATER",
        durationInMinutes: 30,
    };
    const res = await axios.post('/api/reservations', dto, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return res.data;
};

export const checkInReservation = async (entryCode) => {
    const response = await axiosInstance.post(`/reservations/checkin?entryCode=${encodeURIComponent(entryCode)}`);
    return response.data;
};

export const checkOutReservation = async (exitCode) => {
    const response = await axiosInstance.post(`/reservations/checkout?exitCode=${encodeURIComponent(exitCode)}`);
    return response.data;
};
