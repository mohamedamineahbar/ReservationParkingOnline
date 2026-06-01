import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { getCurrentUser } from "../repository/userRepository";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Error fetching user:', error);
                setUser(null);
                localStorage.removeItem('token');
                setToken(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [token]);

    const login = async (userData, token) => {
        localStorage.setItem("token", token);
        setToken(token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, token, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
