
import './App.css'
import {BrowserRouter, Route, Router, Routes} from "react-router-dom";
import Header from "./components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import Footer from "./components/Footer.jsx";
import ParkingLotsPage from "./pages/ParkingLotsPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CheckInPage from "./pages/CheckInPage.jsx";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import { ReservationProvider } from './context/ReservationContext';
import { AuthProvider } from './context/AuthProvider';


import { ThemeProvider, createTheme } from '@mui/material/styles';
import MyProfilePage from "./pages/MyProfilePage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import TestPage from "./pages/TestPage.jsx";

const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
});

const stripePromise = loadStripe("pk_test_51RdC2j2ctYJPxxeKBXNtebRqzBYhHjxBFYfYVyQZ75xEy3mEx4c6oywjBYZVZPyeWWZ4KeZGvkjJJUAtLNWF0Ps3001PvKnpwx");

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Elements stripe={stripePromise}>
                <AuthProvider>           
                    <ReservationProvider>
                        <BrowserRouter>
                            <Header />
                            <Routes>
                                <Route index element={<HomePage />} />
                                <Route path="/test" element={<TestPage />} />
                                <Route path="/parking-lots" element={<ParkingLotsPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/checkin" element={<CheckInPage />} />
                                <Route path="/my-profile" element={<MyProfilePage />} />
                                <Route path="/admin" element={<AdminPage />} />

                            </Routes>
                            <Footer />
                        </BrowserRouter>
                    </ReservationProvider>
                </AuthProvider>
            </Elements>
        </ThemeProvider>
    );
}
export default App;

