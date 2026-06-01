# eParking Backend - Design Document

## 📋 Executive Summary

**eParking** is a comprehensive parking reservation and management system built with **Spring Boot 3.5.3** and **Java 21**. It provides users with the ability to reserve parking spots, manage reservations, and process payments through Stripe, while administrators can manage parking lots and user accounts.

---

## 🏗️ Architecture Overview

### Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Spring Boot | 3.5.3 |
| Java Version | Java | 21 |
| Database | PostgreSQL | Latest |
| Authentication | JWT (JSON Web Tokens) | 0.11.5 |
| Payment Gateway | Stripe API | Latest |
| API Documentation | SpringDoc OpenAPI | 2.3.0 |
| Build Tool | Maven | Bundled with Spring Boot |
| ORM | Spring Data JPA | Hibernate |

### Project Structure

```
eParking/
├── src/main/java/mk/ukim/finki/dipl/eparking/
│   ├── config/              # Configuration classes
│   │   ├── security/        # JWT & Security configuration
│   │   └── openapi/         # OpenAPI/Swagger configuration
│   ├── constants/           # Application constants
│   ├── dto/                 # Data Transfer Objects
│   ├── helpers/             # Utility classes (JWT, etc.)
│   ├── init/                # Data initialization
│   ├── model/               # Entity models
│   │   ├── enums/           # Enumeration types
│   │   └── exceptions/      # Custom exceptions
│   ├── repository/          # Data access layer
│   ├── service/             # Business logic layer
│   │   ├── application/     # Application services (orchestration)
│   │   └── domain/          # Domain services (business logic)
│   └── web/                 # REST Controllers & Filters
└── resources/
    └── application.properties  # Configuration properties
```

---

## 📊 Data Model

### Core Entities

#### 1. **User Entity**
```java
- username (String) [PK]
- password (String, BCrypt encoded)
- name (String)
- surname (String)
- email (String)
- role (Enum: ROLE_USER, ROLE_ADMIN)
```

**Implements:** `UserDetails` (Spring Security)
**Purpose:** Manages user authentication and authorization

---

#### 2. **ParkingLot Entity**
```java
- id (Long) [PK, Auto-generated]
- name (String)
- address (String)
- latitude (Double)
- longitude (Double)
- totalSpots (Integer)
- availableSpots (Integer)
- pricePerHour (Integer)
```

**Purpose:** Represents a parking facility with location and pricing information

---

#### 3. **Reservation Entity**
```java
- id (Long) [PK, Auto-generated]
- user (User) [FK] - Many-to-One relationship
- parkingLot (ParkingLot) [FK] - Many-to-One relationship
- type (Enum: NOW_PAY_LATER, PAY_NOW)
- entryCode (String) - Unique entry code for check-in
- exitCode (String) - Unique exit code for check-out
- checkedIn (Boolean)
- checkedOut (Boolean)
- checkedInAt (LocalDateTime)
- checkedOutAt (LocalDateTime)
- createdAt (LocalDateTime)
- validUntil (LocalDateTime)
- active (Boolean)
- isPaid (Boolean)
- durationInMinutes (Integer)
- stripePaymentIntentId (String)
- pendingExtensionMinutes (Integer)
- extensionPaymentIntentId (String)
```

**Purpose:** Manages user parking reservations and check-in/check-out tracking

---

### Enumerations

#### **Role** (User Authorization)
- `ROLE_USER` - Regular user with basic permissions
- `ROLE_ADMIN` - Administrator with elevated permissions

#### **ReservationType** (Reservation Payment Model)
- `NOW_PAY_LATER` - 30-minute hold without payment
- `PAY_NOW` - Immediate spot guarantee with upfront payment via Stripe

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080/api
```

---

### 🔐 **1. Authentication Endpoints** (`/api/user`)

#### Register User
```
POST /api/user/register
Request Body:
{
    "username": "string",
    "password": "string",
    "name": "string",
    "surname": "string",
    "email": "string@example.com"
}
Response: RegisterUserResponseDto (includes JWT token)
```

#### Login User
```
POST /api/user/login
Request Body:
{
    "username": "string",
    "password": "string"
}
Response: LoginUserResponseDto (JWT token)
```

#### Get Current User Info
```
GET /api/user/me
Headers: Authorization: Bearer <JWT_TOKEN>
Response: RegisterUserResponseDto
```

#### Get User by Username
```
GET /api/user/{username}
Response: RegisterUserResponseDto
```

#### Logout
```
GET /api/user/logout
Response: 200 OK
```

---

### 🅿️ **2. Parking Lot Endpoints** (`/api/parkinglots`)

#### Get All Parking Lots
```
GET /api/parkinglots
Response: List<DisplayParkingLotDto>
```

#### Get Parking Lot by ID
```
GET /api/parkinglots/{id}
Response: DisplayParkingLotDto
```

#### Create Parking Lot (Admin Only)
```
POST /api/parkinglots/add
Headers: Authorization: Bearer <ADMIN_JWT_TOKEN>
Request Body:
{
    "name": "string",
    "address": "string",
    "latitude": double,
    "longitude": double,
    "totalSpots": integer,
    "availableSpots": integer,
    "pricePerHour": integer
}
Response: DisplayParkingLotDto
```

#### Update Parking Lot (Admin Only)
```
PUT /api/parkinglots/edit/{id}
Headers: Authorization: Bearer <ADMIN_JWT_TOKEN>
Request Body: Same as Create
Response: DisplayParkingLotDto
```

#### Delete Parking Lot (Admin Only)
```
DELETE /api/parkinglots/delete/{id}
Headers: Authorization: Bearer <ADMIN_JWT_TOKEN>
Response: 204 No Content
```

---

### 🎫 **3. Reservation Endpoints** (`/api/reservations`)

#### Create Reservation
```
POST /api/reservations
Headers: Authorization: Bearer <JWT_TOKEN>
Request Body:
{
    "parkingLotId": long,
    "type": "NOW_PAY_LATER" | "PAY_NOW",
    "durationInMinutes": integer
}
Response: DisplayReservationDto
```

#### Get Active Reservation
```
GET /api/reservations/me
Headers: Authorization: Bearer <JWT_TOKEN>
Response: DisplayReservationDto | 204 No Content
```

#### Cancel My Reservation
```
DELETE /api/reservations/me
Headers: Authorization: Bearer <JWT_TOKEN>
Response: 204 No Content
```

#### Check-In Reservation
```
POST /api/reservations/checkin?entryCode=CODE-123456
Headers: Authorization: Bearer <JWT_TOKEN>
Response: DisplayReservationDto
```

#### Check-Out Reservation
```
POST /api/reservations/checkout?exitCode=EXIT-123456
Headers: Authorization: Bearer <JWT_TOKEN>
Response: DisplayReservationDto
```

#### Get Reservation History
```
GET /api/reservations/history
Headers: Authorization: Bearer <JWT_TOKEN>
Response: List<DisplayReservationDto>
```

#### Calculate Extra Payment
```
POST /api/reservations/calculate-extra-payment
Headers: Authorization: Bearer <JWT_TOKEN>
Response: DisplayReservationDto (with calculated extension cost)
```

#### Confirm Extra Payment
```
POST /api/reservations/confirm-extra-payment/{paymentIntentId}
Headers: Authorization: Bearer <JWT_TOKEN>
Response: 200 OK
```

#### Confirm Payment
```
POST /api/reservations/payments/confirm/{paymentIntentId}
Headers: Authorization: Bearer <JWT_TOKEN>
Response: 200 OK
```

---

### 👨‍💼 **4. Admin Endpoints** (`/api/admin`)

#### Get All Users
```
GET /api/admin/users
Headers: Authorization: Bearer <ADMIN_JWT_TOKEN>
Response: List<User>
```

#### Delete User
```
DELETE /api/admin/users/{username}
Headers: Authorization: Bearer <ADMIN_JWT_TOKEN>
Response: 204 No Content
```

#### Get All Reservations
```
GET /api/admin/reservations
Headers: Authorization: Bearer <ADMIN_JWT_TOKEN>
Response: List<Reservation>
```

---

## 🔐 Security Architecture

### Authentication Flow

1. **User Registration/Login** → JWT Token Generation
2. **Token Storage** → Sent in response body
3. **Token Usage** → Included in `Authorization: Bearer <TOKEN>` header
4. **Token Validation** → JwtFilter intercepts requests
5. **Authorization** → Role-based access control via `@PreAuthorize`

### Security Configuration

- **Authentication Method:** JWT (JSON Web Tokens)
- **Token Algorithm:** HS256 (HMAC SHA-256)
- **Password Encoding:** BCrypt (with strength 10)
- **Session Management:** Stateless (SessionCreationPolicy.STATELESS)
- **CORS Configuration:**
  - Allowed Origins: `http://localhost:5173`, `http://localhost:8080`
  - Allowed Methods: GET, POST, PUT, DELETE
  - Allowed Headers: All

### JWT Implementation

- **Token Components:**
  - Subject: Username
  - Claims: User roles
  - Issued At: Current timestamp
  - Expiration: Configurable (typically 24 hours)
  - Signature: HS256 with secret key

---

## 💳 Payment Integration (Stripe)

### Payment Features

1. **PAY_NOW Reservations:** Immediate payment via Stripe
2. **Extension Payments:** Additional charges for exceeding reservation duration
3. **Payment Intent Confirmation:** Webhook-based payment confirmation

### Configuration

```properties
stripe.api.key=sk_test_placeholder_replace_with_real_key
stripe.webhook.secret=whsec_placeholder_replace_with_real_secret
```

### Payment Flow

1. User selects "PAY_NOW" reservation type
2. System creates Stripe Payment Intent
3. Frontend handles payment processing
4. Backend receives confirmation via webhook
5. Reservation marked as paid

---

## 📋 DTOs (Data Transfer Objects)

| DTO Name | Purpose | Direction |
|----------|---------|-----------|
| `RegisterUserRequestDto` | User registration input | Request |
| `RegisterUserResponseDto` | User info with token | Response |
| `LoginUserRequestDto` | Login credentials | Request |
| `LoginUserResponseDto` | Auth token | Response |
| `CreateParkingLotDto` | New parking lot creation | Request |
| `DisplayParkingLotDto` | Parking lot display data | Response |
| `CreateReservationDto` | New reservation creation | Request |
| `DisplayReservationDto` | Reservation display data | Response |
| `UserDto` | User information | Response |
| `JwtExceptionResponseDto` | JWT error response | Error Response |

---

## 🏢 Service Layer Architecture

### Application Services (Orchestration Layer)
- **Purpose:** Coordinate between controllers and domain services
- **Classes:**
  - `UserApplicationService` - User registration & authentication
  - `ParkingLotApplicationService` - Parking lot management
  - `ReservationApplicationService` - Reservation operations

### Domain Services (Business Logic Layer)
- **Purpose:** Core business logic implementation
- **Classes:**
  - `UserService` - User operations
  - `ParkingLotService` - Parking lot operations
  - `ReservationService` - Reservation business logic

### Repository Layer (Data Access)
- Spring Data JPA repositories for CRUD operations
- Automatic query generation from method names

---

## 🔄 Key Business Workflows

### 1. Reservation Workflow

```
User Selection
    ↓
Create Reservation (NOW_PAY_LATER or PAY_NOW)
    ↓
[If PAY_NOW] → Stripe Payment
    ↓
Generate Entry & Exit Codes
    ↓
Reservation Active (30min hold for NOW_PAY_LATER)
    ↓
User Check-In (via entry code)
    ↓
Parking Duration
    ↓
Calculate Charges (if exceeding duration)
    ↓
User Check-Out (via exit code)
    ↓
[If overage] → Extension Payment via Stripe
    ↓
Mark as Completed
```

### 2. Access Control Workflow

```
Request with JWT Token
    ↓
JwtFilter validates token signature & expiration
    ↓
Extract username & roles from token
    ↓
Load User from database
    ↓
Set Spring Security Context
    ↓
@PreAuthorize checks role requirements
    ↓
Grant/Deny Access
```

---

## 🗄️ Database Schema

### Connection Details
- **Driver:** PostgreSQL JDBC Driver (42.7.3)
- **Database:** `parking`
- **DDL Strategy:** Hibernate Auto-Update (`spring.jpa.hibernate.ddl-auto=update`)

### Tables

| Table | Purpose | Records |
|-------|---------|---------|
| `app_users` | User authentication & profiles | N/A |
| `parking_lot` | Parking facility information | N/A |
| `reservation` | Parking reservations | N/A |

---

## 📦 Dependencies

### Core Dependencies
- **spring-boot-starter-data-jpa** - ORM & database access
- **spring-boot-starter-web** - REST API framework
- **spring-boot-starter-security** - Authentication & authorization
- **spring-security-test** - Security testing
- **postgresql** (v42.7.3) - Database driver
- **jjwt** (v0.11.5) - JWT generation & validation
- **lombok** - Boilerplate code reduction
- **springdoc-openapi-starter-webmvc-ui** (v2.3.0) - Swagger UI

### Testing Dependencies
- **spring-boot-starter-test** - JUnit, Mockito, etc.

---

## 🚀 Development Setup

### Prerequisites
- Java 21 JDK
- PostgreSQL server running locally
- Maven (bundled with Spring Boot)

### Environment Configuration

Create/update `application.properties`:

```properties
spring.application.name=eParking

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/parking
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# Stripe Configuration
stripe.api.key=your_stripe_key
stripe.webhook.secret=your_webhook_secret
```

### Running the Application

```bash
# Build
mvn clean package

# Run
mvn spring-boot:run

# Or run the JAR file
java -jar target/eParking-0.0.1-SNAPSHOT.jar
```

### API Documentation

Access Swagger UI after running:
```
http://localhost:8080/swagger-ui.html
```

---

## 🔍 Key Features Summary

| Feature | Implementation | Status |
|---------|-----------------|--------|
| User Registration | JWT-based authentication | ✅ |
| User Login | Credentials verification with BCrypt | ✅ |
| Role-Based Access Control | Admin vs User roles | ✅ |
| Parking Lot Management | CRUD operations (Admin only) | ✅ |
| Reservation System | Two-type reservation model | ✅ |
| Check-In/Check-Out | Code-based entry/exit | ✅ |
| Stripe Payment Integration | Payment Intent processing | ✅ |
| Extension Payment | Overtime charge calculation | ✅ |
| Reservation History | User-specific history tracking | ✅ |
| Admin Dashboard | User & reservation management | ✅ |
| API Documentation | OpenAPI/Swagger integration | ✅ |
| CORS Configuration | Frontend origin allowlisting | ✅ |
| Stateless Authentication | JWT-based session management | ✅ |

---

## 🔧 Extensibility & Future Enhancements

### Potential Improvements

1. **Audit Logging** - Track user actions and system events
2. **Notification System** - Email/SMS notifications for reservations
3. **Rating & Reviews** - User feedback on parking lots
4. **Dynamic Pricing** - Time-based or demand-based pricing
5. **Mobile App** - Native mobile client
6. **Analytics Dashboard** - Advanced reporting & insights
7. **Multi-Language Support** - i18n implementation
8. **Real-Time Updates** - WebSocket integration for live spot availability
9. **Vehicle Management** - Track registered vehicles per user
10. **Refund Processing** - Handle cancellation refunds

---

## 📝 Development Notes

- **JWT Secret Key:** Stored in JwtConstants class
- **Password Encoding:** BCrypt with strength 10 (suitable for production)
- **Entity Relationships:** One-to-Many (User ↔ Reservations, ParkingLot ↔ Reservations)
- **Exception Handling:** Custom exceptions in model/exceptions package
- **Filtering:** JWT filter in web/filters package for token validation
- **OpenAPI Configuration:** Custom OpenAPI config in config/openapi package

---

## 📞 Support & Contacts

For issues or questions regarding the backend architecture, refer to:
- Spring Boot Documentation: https://spring.io/projects/spring-boot
- JWT Implementation: https://github.com/jwtk/jjwt
- Stripe API: https://stripe.com/docs
- PostgreSQL: https://www.postgresql.org/docs/

---

**Document Version:** 1.0  
**Last Updated:** May 4, 2026  
**Backend Version:** 0.0.1-SNAPSHOT  
**Spring Boot Version:** 3.5.3
