// src/pages/AdminPage.jsx
import axiosInstance from "../api/axios";

import React, { useEffect, useState } from "react";
import {
    getAllUsers,
    deleteUser,
    getAllReservations,
} from "../repository/adminRepository";
import { toast } from "react-toastify";

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        loadUsers();
        loadReservations();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            toast.error("Failed to load users.");
        }
    };

    const loadReservations = async () => {
        try {
            const data = await getAllReservations();
            setReservations(data);
        } catch (error) {
            toast.error("Failed to load reservations.");
        }
    };

    const handleDeleteUser = async (username) => {
        try {
            await axiosInstance.delete(`/admin/users/${username}`);
            const updatedUsers = users.filter((user) => user.username !== username);
            setUsers(updatedUsers);

            await loadReservations();
        } catch (error) {
            console.error("Error deleting user or refreshing reservations:", error);
            toast.error("Failed to delete user.");
        }
    };


    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-blue-800">Admin Dashboard</h2>

            {/* Users Section */}
            <section className="mb-10">
                <h3 className="text-2xl font-semibold mb-4 text-blue-700">Users</h3>
                {users.length === 0 ? (
                    <p className="text-gray-600">No users found.</p>
                ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {users.map((user) => (
                            <div
                                key={user.username}
                                className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition cursor-default"
                            >
                                <div>
                                    <span className="font-medium text-gray-900">{user.username}</span>{" "}
                                    – <span className="text-gray-700">{user.email}</span> –{" "}
                                    <span className="text-indigo-600 font-semibold">{user.role}</span>
                                </div>
                                <button
                                    onClick={() => handleDeleteUser(user.username)}
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-4 rounded transition"
                                    aria-label={`Delete user ${user.username}`}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Reservations Section */}
            <section>
                <h3 className="text-2xl font-semibold mb-4 text-blue-700">Reservations</h3>
                {reservations.length === 0 ? (
                    <p className="text-gray-600">No reservations found.</p>
                ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {reservations.map((r) => (
                            <div
                                key={r.id}
                                className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition cursor-default"
                            >
                                <p>
                                    <strong>User:</strong> {r.user?.username || "N/A"}
                                </p>
                                <p>
                                    <strong>Parking Lot:</strong> {r.parkingLot?.name || "N/A"}
                                </p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    {r.checkedInAt ? "Checked In" : "Pending"} –{" "}
                                    {r.checkedOutAt ? "Checked Out" : "Active"}
                                </p>
                                <p>
                                    <strong>Duration:</strong> {r.durationInMinutes} minutes
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
