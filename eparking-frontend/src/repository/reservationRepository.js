import axiosInstance from "../api/axios";

// Create a reservation
export const createReservation = async (dto) => {
    const response = await axiosInstance.post("/reservations", dto);
    return response.data;
};

// Get my active reservation
export const getMyReservation = async () => {
    const response = await axiosInstance.get("/reservations/me");
    return response.data;
};

// Cancel my reservation
export const cancelMyReservation = async () => {
    await axiosInstance.delete("/reservations/me");
};

