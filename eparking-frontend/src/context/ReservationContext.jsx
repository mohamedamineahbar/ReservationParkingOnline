// src/context/ReservationContext.js
import React, { createContext, useState, useContext } from 'react';

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
    const [reservationInfo, setReservationInfo] = useState(null);

    return (
        <ReservationContext.Provider value={{ reservationInfo, setReservationInfo }}>
            {children}
        </ReservationContext.Provider>
    );
};

export const useReservation = () => useContext(ReservationContext);
