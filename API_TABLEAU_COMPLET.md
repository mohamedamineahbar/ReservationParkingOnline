# 📋 eParking APIs - Tableau Complet avec URL et JSON

## 🔐 AUTHENTIFICATION

| # | Nom | Méthode | URL | JSON de Test | Authentification |
|---|-----|--------|-----|--------------|-----------------|
| 1 | Register User | POST | `http://localhost:8080/api/user/register` | `{"username":"testuser","password":"password123","name":"Ahmed","surname":"Medamine","email":"ahmed@example.com"}` | ❌ Non requis |
| 2 | Login User | POST | `http://localhost:8080/api/user/login` | `{"username":"testuser","password":"password123"}` | ❌ Non requis |
| 3 | Get Current User (Me) | GET | `http://localhost:8080/api/user/me` | N/A | ✅ Token JWT |
| 4 | Get User by Username | GET | `http://localhost:8080/api/user/{username}` | N/A | ❌ Non requis |
| 5 | Logout | GET | `http://localhost:8080/api/user/logout` | N/A | ✅ Token JWT |

---

## 🅿️ GESTION DES PARKING LOTS

| # | Nom | Méthode | URL | JSON de Test | Authentification |
|---|-----|--------|-----|--------------|-----------------|
| 1 | Get All Parking Lots | GET | `http://localhost:8080/api/parkinglots` | N/A | ❌ Non requis |
| 2 | Get Parking Lot by ID | GET | `http://localhost:8080/api/parkinglots/1` | N/A | ❌ Non requis |
| 3 | Create Parking Lot | POST | `http://localhost:8080/api/parkinglots/add` | `{"name":"Downtown Parking","address":"123 Main Street, Downtown","latitude":41.9028,"longitude":12.4964,"totalSpots":100,"availableSpots":75,"pricePerHour":500}` | ✅ Admin Token |
| 4 | Update Parking Lot | PUT | `http://localhost:8080/api/parkinglots/edit/1` | `{"name":"Downtown Parking Updated","address":"123 Main Street, Downtown","latitude":41.9028,"longitude":12.4964,"totalSpots":150,"availableSpots":100,"pricePerHour":600}` | ✅ Admin Token |
| 5 | Delete Parking Lot | DELETE | `http://localhost:8080/api/parkinglots/delete/1` | N/A | ✅ Admin Token |

---

## 🎫 RESERVATIONS

| # | Nom | Méthode | URL | JSON de Test | Authentification |
|---|-----|--------|-----|--------------|-----------------|
| 1 | Create Reservation (NOW_PAY_LATER) | POST | `http://localhost:8080/api/reservations` | `{"parkingLotId":1,"type":"NOW_PAY_LATER","durationInMinutes":60}` | ✅ User Token |
| 2 | Create Reservation (PAY_NOW) | POST | `http://localhost:8080/api/reservations` | `{"parkingLotId":1,"type":"PAY_NOW","durationInMinutes":120}` | ✅ User Token |
| 3 | Get Active Reservation | GET | `http://localhost:8080/api/reservations/me` | N/A | ✅ User Token |
| 4 | Cancel Reservation | DELETE | `http://localhost:8080/api/reservations/me` | N/A | ✅ User Token |
| 5 | Check-In | POST | `http://localhost:8080/api/reservations/checkin?entryCode=CODE-ABC123` | N/A | ✅ User Token |
| 6 | Check-Out | POST | `http://localhost:8080/api/reservations/checkout?exitCode=EXIT-XYZ789` | N/A | ✅ User Token |
| 7 | Get Reservation History | GET | `http://localhost:8080/api/reservations/history` | N/A | ✅ User Token |
| 8 | Calculate Extra Payment | POST | `http://localhost:8080/api/reservations/calculate-extra-payment` | N/A | ✅ User Token |
| 9 | Confirm Extra Payment | POST | `http://localhost:8080/api/reservations/confirm-extra-payment/pi_ext_987654321` | N/A | ✅ User Token |
| 10 | Confirm Payment | POST | `http://localhost:8080/api/reservations/payments/confirm/pi_1234567890` | N/A | ✅ User Token |

---

## 👨‍💼 ADMIN OPERATIONS

| # | Nom | Méthode | URL | JSON de Test | Authentification |
|---|-----|--------|-----|--------------|-----------------|
| 1 | Get All Users | GET | `http://localhost:8080/api/admin/users` | N/A | ✅ Admin Token |
| 2 | Delete User | DELETE | `http://localhost:8080/api/admin/users/testuser` | N/A | ✅ Admin Token |
| 3 | Get All Reservations | GET | `http://localhost:8080/api/admin/reservations` | N/A | ✅ Admin Token |

---

## 📊 TABLEAU RÉCAPITULATIF COMPLET

### AUTHENTIFICATION - 5 APIs
```
┌─────┬──────────────────────┬─────────┬────────────────────────────────────────┐
│ #   │ Endpoint             │ Méthode │ URL                                    │
├─────┼──────────────────────┼─────────┼────────────────────────────────────────┤
│ 1   │ Register             │ POST    │ /api/user/register                     │
│ 2   │ Login                │ POST    │ /api/user/login                        │
│ 3   │ Get Me               │ GET     │ /api/user/me                           │
│ 4   │ Get by Username      │ GET     │ /api/user/{username}                   │
│ 5   │ Logout               │ GET     │ /api/user/logout                       │
└─────┴──────────────────────┴─────────┴────────────────────────────────────────┘
```

### PARKING LOTS - 5 APIs
```
┌─────┬──────────────────────┬─────────┬────────────────────────────────────────┐
│ #   │ Endpoint             │ Méthode │ URL                                    │
├─────┼──────────────────────┼─────────┼────────────────────────────────────────┤
│ 1   │ Get All              │ GET     │ /api/parkinglots                       │
│ 2   │ Get by ID            │ GET     │ /api/parkinglots/{id}                  │
│ 3   │ Create               │ POST    │ /api/parkinglots/add                   │
│ 4   │ Update               │ PUT     │ /api/parkinglots/edit/{id}             │
│ 5   │ Delete               │ DELETE  │ /api/parkinglots/delete/{id}           │
└─────┴──────────────────────┴─────────┴────────────────────────────────────────┘
```

### RESERVATIONS - 10 APIs
```
┌─────┬──────────────────────────────┬─────────┬────────────────────────────────────────┐
│ #   │ Endpoint                     │ Méthode │ URL                                    │
├─────┼──────────────────────────────┼─────────┼────────────────────────────────────────┤
│ 1   │ Create (NOW_PAY_LATER)       │ POST    │ /api/reservations                      │
│ 2   │ Create (PAY_NOW)             │ POST    │ /api/reservations                      │
│ 3   │ Get Active                   │ GET     │ /api/reservations/me                   │
│ 4   │ Cancel                       │ DELETE  │ /api/reservations/me                   │
│ 5   │ Check-In                     │ POST    │ /api/reservations/checkin              │
│ 6   │ Check-Out                    │ POST    │ /api/reservations/checkout             │
│ 7   │ Get History                  │ GET     │ /api/reservations/history              │
│ 8   │ Calculate Extra Payment      │ POST    │ /api/reservations/calculate-extra      │
│ 9   │ Confirm Extra Payment        │ POST    │ /api/reservations/confirm-extra/{id}   │
│ 10  │ Confirm Payment              │ POST    │ /api/reservations/payments/confirm/{id}│
└─────┴──────────────────────────────┴─────────┴────────────────────────────────────────┘
```

### ADMIN - 3 APIs
```
┌─────┬──────────────────────┬─────────┬────────────────────────────────────────┐
│ #   │ Endpoint             │ Méthode │ URL                                    │
├─────┼──────────────────────┼─────────┼────────────────────────────────────────┤
│ 1   │ Get All Users        │ GET     │ /api/admin/users                       │
│ 2   │ Delete User          │ DELETE  │ /api/admin/users/{username}            │
│ 3   │ Get All Reservations │ GET     │ /api/admin/reservations                │
└─────┴──────────────────────┴─────────┴────────────────────────────────────────┘
```

---

## 🧪 JSON DE TEST DÉTAILLÉS

### 1️⃣ REGISTER USER
```json
{
  "username": "testuser",
  "password": "password123",
  "name": "Ahmed",
  "surname": "Medamine",
  "email": "ahmed@example.com"
}
```

### 2️⃣ LOGIN USER
```json
{
  "username": "testuser",
  "password": "password123"
}
```

### 3️⃣ CREATE PARKING LOT
```json
{
  "name": "Downtown Parking",
  "address": "123 Main Street, Downtown",
  "latitude": 41.9028,
  "longitude": 12.4964,
  "totalSpots": 100,
  "availableSpots": 75,
  "pricePerHour": 500
}
```

### 4️⃣ UPDATE PARKING LOT
```json
{
  "name": "Downtown Parking Updated",
  "address": "123 Main Street, Downtown",
  "latitude": 41.9028,
  "longitude": 12.4964,
  "totalSpots": 150,
  "availableSpots": 100,
  "pricePerHour": 600
}
```

### 5️⃣ CREATE RESERVATION (NOW_PAY_LATER)
```json
{
  "parkingLotId": 1,
  "type": "NOW_PAY_LATER",
  "durationInMinutes": 60
}
```

### 6️⃣ CREATE RESERVATION (PAY_NOW)
```json
{
  "parkingLotId": 1,
  "type": "PAY_NOW",
  "durationInMinutes": 120
}
```

---

## 🔗 EXEMPLES COMPLETS AVEC cURL

### REGISTER
```bash
curl -X POST http://localhost:8080/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "name": "Ahmed",
    "surname": "Medamine",
    "email": "ahmed@example.com"
  }'
```

### LOGIN
```bash
curl -X POST http://localhost:8080/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### GET ALL PARKING LOTS
```bash
curl -X GET http://localhost:8080/api/parkinglots
```

### GET PARKING LOT BY ID
```bash
curl -X GET http://localhost:8080/api/parkinglots/1
```

### CREATE PARKING LOT (ADMIN)
```bash
curl -X POST http://localhost:8080/api/parkinglots/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Downtown Parking",
    "address": "123 Main Street, Downtown",
    "latitude": 41.9028,
    "longitude": 12.4964,
    "totalSpots": 100,
    "availableSpots": 75,
    "pricePerHour": 500
  }'
```

### UPDATE PARKING LOT (ADMIN)
```bash
curl -X PUT http://localhost:8080/api/parkinglots/edit/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Downtown Parking Updated",
    "address": "123 Main Street, Downtown",
    "latitude": 41.9028,
    "longitude": 12.4964,
    "totalSpots": 150,
    "availableSpots": 100,
    "pricePerHour": 600
  }'
```

### DELETE PARKING LOT (ADMIN)
```bash
curl -X DELETE http://localhost:8080/api/parkinglots/delete/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### CREATE RESERVATION (NOW_PAY_LATER)
```bash
curl -X POST http://localhost:8080/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "parkingLotId": 1,
    "type": "NOW_PAY_LATER",
    "durationInMinutes": 60
  }'
```

### CREATE RESERVATION (PAY_NOW)
```bash
curl -X POST http://localhost:8080/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "parkingLotId": 1,
    "type": "PAY_NOW",
    "durationInMinutes": 120
  }'
```

### GET ACTIVE RESERVATION
```bash
curl -X GET http://localhost:8080/api/reservations/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### CANCEL RESERVATION
```bash
curl -X DELETE http://localhost:8080/api/reservations/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### CHECK-IN
```bash
curl -X POST "http://localhost:8080/api/reservations/checkin?entryCode=CODE-ABC123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### CHECK-OUT
```bash
curl -X POST "http://localhost:8080/api/reservations/checkout?exitCode=EXIT-XYZ789" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### GET RESERVATION HISTORY
```bash
curl -X GET http://localhost:8080/api/reservations/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### CALCULATE EXTRA PAYMENT
```bash
curl -X POST http://localhost:8080/api/reservations/calculate-extra-payment \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### CONFIRM EXTRA PAYMENT
```bash
curl -X POST http://localhost:8080/api/reservations/confirm-extra-payment/pi_ext_987654321 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### CONFIRM PAYMENT
```bash
curl -X POST http://localhost:8080/api/reservations/payments/confirm/pi_1234567890 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### GET ALL USERS (ADMIN)
```bash
curl -X GET http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### DELETE USER (ADMIN)
```bash
curl -X DELETE http://localhost:8080/api/admin/users/testuser \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### GET ALL RESERVATIONS (ADMIN)
```bash
curl -X GET http://localhost:8080/api/admin/reservations \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 📌 NOTES IMPORTANTES

- **Base URL:** `http://localhost:8080`
- **Total APIs:** 23 endpoints
- **Token JWT:** À remplacer par le token obtenu lors du login
- **Admin Token:** Token d'un utilisateur avec rôle `ROLE_ADMIN`
- **Content-Type:** `application/json` pour les POST/PUT
- **Authorization Header:** `Authorization: Bearer {TOKEN}`

---

**Version:** 1.0  
**Date:** 4 mai 2026
