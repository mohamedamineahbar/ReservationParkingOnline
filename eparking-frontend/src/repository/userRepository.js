import axiosInstance from "../api/axios";

// Find user by username
export const getUserByUsername = async (username) => {
    const response = await axiosInstance.get(`/user/${username}`);
    return response.data;
};

// Get currently logged-in user
export const getCurrentUser = async () => {
    const response = await axiosInstance.get("/user/me");
    return response.data;
};

// Register new user
export const registerUser = async (dto) => {
    const response = await axiosInstance.post("/user/register", dto);
    return response.data;
};

// Login user
export const loginUser = async (dto) => {
    const response = await axiosInstance.post("/user/login", dto);
    return response.data;
};

// Logout user
export const logoutUser = async () => {
    await axiosInstance.get("/user/logout");
};
