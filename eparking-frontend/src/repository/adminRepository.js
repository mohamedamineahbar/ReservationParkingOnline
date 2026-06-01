import axiosInstance from "../api/axios";

// Get all users (admin only)
export const getAllUsers = async () => {
    const response = await axiosInstance.get("/admin/users");
    return response.data;
};

// Delete user by username (admin only)
export const deleteUser = async (username) => {
    const response = await axiosInstance.delete(`/admin/users/${username}`);
    return response.data;
};

// Get all reservations (admin only)
export const getAllReservations = async () => {
    const response = await axiosInstance.get("/admin/reservations");
    return response.data;
};