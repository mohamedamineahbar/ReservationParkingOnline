import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAllParkingLots, reserveNowPayLater } from '../repository/parkingLotRepository.js';
import ParkingLotCard from '../components/ParkingLotCard';
import ReservationModal from '../components/ReservationModal';
import DurationModal from "../components/DurationModal.jsx";
import StripeCheckoutForm from "../components/StripeCheckoutForm.jsx";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { isAdmin } from '../utils/jwtUtils.js'
import ParkingLotFormModal from "../components/ParkingLotFormModal.jsx";

// Custom icon for user location (different from parking lot markers)
const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

// Fly map to selected parking lot
const FlyToParkingLot = ({ lot }) => {
    const map = useMap();
    
    // Store map instance globally for hover access
    React.useEffect(() => {
        window.leafletMap = map;
        return () => {
            delete window.leafletMap;
        };
    }, [map]);
    
    useEffect(() => {
        if (lot) {
            map.flyTo([lot.latitude, lot.longitude], 16, {
                duration: 1.5
            });
        }
    }, [lot, map]);
    return null;
};

// Fly map to user location
const FlyToUserLocation = ({ userLocation }) => {
    const map = useMap();
    useEffect(() => {
        if (userLocation) map.flyTo(userLocation, 14);
    }, [userLocation]);
    return null;
};

const ParkingLotsPage = () => {
    const [parkingLots, setParkingLots] = useState([]);
    const [filteredLots, setFilteredLots] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLotId, setSelectedLotId] = useState(null);
    const [reservationInfo, setReservationInfo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [nearestLot, setNearestLot] = useState(null);
    const [distanceToNearest, setDistanceToNearest] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editLotData, setEditLotData] = useState(null);
    const [showMapView, setShowMapView] = useState(true); // Mobile view toggle


    const stripe = useStripe();
    const elements = useElements();

    const [clientSecret, setClientSecret] = useState(null);
    const [paymentError, setPaymentError] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const [showDurationModal, setShowDurationModal] = useState(false);
    const [selectedLotForPayment, setSelectedLotForPayment] = useState(null);

    // Fetch parking lots on mount
    useEffect(() => {
        getAllParkingLots().then(data => {
            setParkingLots(data);
            setFilteredLots(data);
        });
    }, []);

    // Filter lots by search term
    useEffect(() => {
        setFilteredLots(
            parkingLots.filter(lot => lot.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, parkingLots]);

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = [position.coords.latitude, position.coords.longitude];
                    setUserLocation(location);
                },
                () => console.warn("Geolocation failed")
            );
        }
    }, []);

    // Haversine formula to calculate distance (km)
    const haversineDistance = (coords1, coords2) => {
        const toRad = x => (x * Math.PI) / 180;
        const [lat1, lon1] = coords1;
        const [lat2, lon2] = coords2;
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Find nearest parking lot and highlight it
    const findNearestLot = () => {
        if (!userLocation || parkingLots.length === 0) return;
        let minDist = Infinity;
        let nearest = null;

        parkingLots.forEach(lot => {
            const dist = haversineDistance(userLocation, [lot.latitude, lot.longitude]);
            if (dist < minDist) {
                minDist = dist;
                nearest = lot;
            }
        });

        setNearestLot(nearest);
        setSelectedLotId(nearest.id);
        setDistanceToNearest(minDist.toFixed(2));
    };

    const handleShowMyLocation = () => {
        if (!userLocation) {
            alert('Unable to get your current location yet. Please allow geolocation access.');
            return;
        }

        if (window.leafletMap) {
            window.leafletMap.flyTo(userLocation, 14, { duration: 1.2 });
        }
    };

    const selectedLot = parkingLots.find(lot => lot.id === selectedLotId);

    // Reserve Now (Pay Later) handler
    const handleReserveNow = async (lot) => {
        try {
            const reservation = await reserveNowPayLater(lot.id);
            setReservationInfo(reservation);
            setShowModal(true);
            const lots = await getAllParkingLots();
            setParkingLots(lots);
            setFilteredLots(lots);
        } catch (e) {
            alert('Reservation failed. You might already have one.');
        }
    };

    // Reserve and Pay handler
    const handleReserveAndPay = (lot) => {
        setSelectedLotForPayment(lot);
        setShowDurationModal(true);
    };

    // Confirm payment handler
    const handleConfirmPayment = async (duration) => {
        setShowDurationModal(false);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch('http://localhost:8080/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    parkingLotId: selectedLotForPayment.id,
                    type: "PAY_NOW",
                    durationInMinutes: duration,
                }),
            });
            if (!response.ok) throw new Error("Reservation creation failed");
            const data = await response.json();
            setReservationInfo(data);
            setClientSecret(data.clientSecret);
            setShowModal(true);
        } catch (e) {
            alert(e.message);
        }
    };

    // Fetch reservation info
    const fetchReservation = async (id) => {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/reservations/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await response.json();
    };

    // Stripe payment submission
    const handleSubmitPayment = async (event) => {
        event.preventDefault();
        setPaymentLoading(true);
        setPaymentError(null);
        if (!stripe || !elements) {
            setPaymentError("Stripe.js has not loaded yet.");
            setPaymentLoading(false);
            return;
        }
        const cardElement = elements.getElement(CardElement);
        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement }
            });
            if (error) throw new Error(error.message);
            if (paymentIntent.status === "succeeded") {
                const success = await confirmPaymentOnBackend(reservationInfo.id);
                if (success) {
                    setPaymentSuccess(true);
                    setClientSecret(null);
                    const updatedReservation = await fetchReservation(reservationInfo.id);
                    setReservationInfo(updatedReservation);
                    const lots = await getAllParkingLots();
                    setParkingLots(lots);
                    setFilteredLots(lots);
                }
            }
        } catch (e) {
            setPaymentError("Payment processing error: " + e.message);
        } finally {
            setPaymentLoading(false);
        }
    };

    // Confirm payment on backend
    const confirmPaymentOnBackend = async (reservationId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/api/reservations/${reservationId}/confirm-payment`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.ok;
        } catch (e) {
            console.error("Payment confirmation error:", e);
            return false;
        }
    };
    const handleAddOrEditParkingLot = async (data) => {
        const token = localStorage.getItem("token");

        const method = data.id ? 'PUT' : 'POST';
        const url = data.id
            ? `http://localhost:8080/api/parkinglots/edit/${data.id}`
            : 'http://localhost:8080/api/parkinglots/add';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Failed to save parking lot');

            const updatedLots = await getAllParkingLots();
            setParkingLots(updatedLots);
            setFilteredLots(updatedLots);
        } catch (e) {
            alert(e.message);
        }
    };


    // If payment is ongoing, show payment form
    if (clientSecret) {
        return (
            <div className="payment-form p-6 max-w-md mx-auto mt-10 bg-white rounded shadow">
                <h2 className="text-2xl font-semibold mb-4">Complete Payment</h2>
                <StripeCheckoutForm
                    onPaymentSuccess={() => {
                        setPaymentSuccess(true);
                        setClientSecret(null);
                    }}
                    reservationInfo={reservationInfo}
                />
                {paymentError && <p className="text-red-600 mt-2">{paymentError}</p>}
                {paymentSuccess && <p className="text-green-600 mt-2">Payment succeeded! Thank you.</p>}
                <button
                    onClick={() => setClientSecret(null)}
                    className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Mobile View Toggle */}
            <div className="md:hidden flex border-b border-gray-200">
                <button
                    onClick={() => setShowMapView(true)}
                    className={`flex-1 py-3 px-4 text-center font-semibold transition ${
                        showMapView 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    🗺️ Map
                </button>
                <button
                    onClick={() => setShowMapView(false)}
                    className={`flex-1 py-3 px-4 text-center font-semibold transition ${
                        !showMapView 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    📋 List
                </button>
            </div>

            {/* Map Section */}
            <div className={`${
                showMapView ? 'flex' : 'hidden'
            } md:flex md:w-2/3 h-full relative order-1 md:order-none`}>
                <div className="w-full h-full relative">
                    <MapContainer center={[41.0328, 21.3347]} zoom={14} className="h-full w-full z-0">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {userLocation && (
                            <Marker position={userLocation} icon={userIcon}>
                                <Popup>You are here</Popup>
                            </Marker>
                        )}
                        {filteredLots.map(lot => (
                            <Marker
                                key={lot.id}
                                position={[lot.latitude, lot.longitude]}
                                eventHandlers={{ click: () => setSelectedLotId(lot.id) }}
                                opacity={nearestLot?.id === lot.id ? 1 : 0.7}
                            >
                                <Popup>{lot.name}</Popup>
                            </Marker>
                        ))}
                        {selectedLot && <FlyToParkingLot lot={selectedLot} />}
                        {userLocation && <FlyToUserLocation userLocation={userLocation} />}
                    </MapContainer>
                    <button
                        onClick={findNearestLot}
                        className="absolute bottom-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-5 md:py-3 rounded-xl shadow-lg transition text-sm md:text-base"
                    >
                         Find Nearest
                    </button>
                    <button
                        onClick={handleShowMyLocation}
                        className="absolute bottom-4 left-44 bg-green-600 hover:bg-green-700 text-white px-4 py-2 md:px-5 md:py-3 rounded-xl shadow-lg transition text-sm md:text-base"
                    >
                        📍 My Location
                    </button>
                    {nearestLot && distanceToNearest && (
                        <div className="absolute bottom-16 md:bottom-20 left-4 right-4 md:right-auto bg-white px-3 py-2 md:px-4 md:py-2 rounded shadow-lg text-gray-700 font-semibold text-xs md:text-sm max-w-xs">
                            <div className="truncate">
                                Nearest: <span className="text-blue-700">{nearestLot.name}</span>
                            </div>
                            <div>
                                Distance: <span className="text-green-700">{distanceToNearest} km</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* List Section */}
            <div className={`${
                !showMapView ? 'flex' : 'hidden'
            } md:flex md:w-1/3 h-full flex-col bg-gradient-to-b from-blue-50 to-white order-2 md:order-none`}>
                {/* Header - Sticky */}
                <div className="sticky top-0 z-10 bg-gradient-to-b from-blue-50 to-blue-50/95 backdrop-blur-sm p-3 md:p-4 pb-2 md:pb-3">
                    <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-blue-800">🅿️ Available Parking</h2>
                    
                    {/* Search Input */}
                    <div className="relative mb-2 md:mb-3">
                        <input
                            type="text"
                            placeholder="🔍 Search parking lots..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2.5 md:px-4 md:py-2.5 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base bg-white shadow-sm transition"
                        />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 mb-2 md:mb-3">
                        <button
                            onClick={findNearestLot}
                            className="flex-1 px-3 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 text-xs md:text-sm shadow-md hover:shadow-lg transition"
                        >
                            📍 Nearest
                        </button>
                        {isAdmin() && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-3 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 active:bg-green-800 text-xs md:text-sm shadow-md hover:shadow-lg transition"
                            >
                                ➕ Add
                            </button>
                        )}
                    </div>
                    
                    {/* Nearest Lot Info */}
                    {nearestLot && distanceToNearest && (
                        <div className="bg-blue-100 border-l-4 border-blue-600 px-3 py-2 rounded-lg mb-2">
                            <p className="text-xs md:text-sm text-blue-800 font-medium">
                                📍 <strong>{nearestLot.name}</strong>
                            </p>
                            <p className="text-xs text-blue-600">
                                {distanceToNearest} km away
                            </p>
                        </div>
                    )}
                    
                    {/* Results Count */}
                    <p className="text-xs text-gray-600 mb-1">
                        {filteredLots.length} parking lot{filteredLots.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                
                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto px-3 md:px-4 pb-3 md:pb-4">
                    <div className="space-y-2 md:space-y-3">
                        {filteredLots.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-sm">No parking lots found</p>
                            </div>
                        ) : (
                            filteredLots.map(lot => (
                                <div
                                    key={lot.id}
                                    onMouseEnter={() => {
                                        setSelectedLotId(lot.id);
                                        // Trigger map fly-to on hover
                                        const mapElement = document.querySelector('.leaflet-container');
                                        if (mapElement && window.leafletMap) {
                                            window.leafletMap.flyTo([lot.latitude, lot.longitude], 16, {
                                                duration: 0.8
                                            });
                                        }
                                    }}
                                    onMouseLeave={() => setSelectedLotId(null)}
                                    onTouchStart={() => {
                                        setSelectedLotId(lot.id);
                                        // Trigger map fly-to on touch
                                        const mapElement = document.querySelector('.leaflet-container');
                                        if (mapElement && window.leafletMap) {
                                            window.leafletMap.flyTo([lot.latitude, lot.longitude], 16, {
                                                duration: 0.8
                                            });
                                        }
                                    }}
                                    className={`transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                                        ${selectedLotId === lot.id 
                                            ? 'bg-blue-100 border-2 border-blue-500 shadow-lg' 
                                            : 'bg-white border-2 border-gray-100 shadow-md hover:shadow-lg'}
                                        ${nearestLot?.id === lot.id ? 'ring-2 ring-green-400' : ''}
                                        rounded-xl overflow-hidden`}
                                >
                                    <ParkingLotCard
                                        lot={lot}
                                        onReserveNow={() => handleReserveNow(lot)}
                                        onReserveAndPay={() => handleReserveAndPay(lot)}
                                        onEdit={() => {
                                            setEditLotData(lot);
                                            setShowAddModal(true);
                                        }}
                                        onDelete={async () => {
                                            if (window.confirm(`Delete parking lot "${lot.name}"?`)) {
                                                try {
                                                    const token = localStorage.getItem("token");
                                                    const response = await fetch(`http://localhost:8080/api/parkinglots/delete/${lot.id}`, {
                                                        method: "DELETE",
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    });
                                                    if (!response.ok) throw new Error("Delete failed");
                                                    const updatedLots = await getAllParkingLots();
                                                    setParkingLots(updatedLots);
                                                    setFilteredLots(updatedLots);
                                                    alert("Deleted successfully");
                                                } catch (e) {
                                                    alert(e.message);
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <DurationModal
                open={showDurationModal}
                onClose={() => setShowDurationModal(false)}
                parkingLot={selectedLotForPayment}
                onConfirm={handleConfirmPayment}
            />
            <ReservationModal
                open={showModal}
                onClose={() => setShowModal(false)}
                reservationInfo={reservationInfo}
                clientSecret={clientSecret}
                paymentSuccess={paymentSuccess}
            />
            <ParkingLotFormModal
                open={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setEditLotData(null);
                }}
                onSubmit={handleAddOrEditParkingLot}
                initialData={editLotData}
            />


        </div>
    );

};

export default ParkingLotsPage;
