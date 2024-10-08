# Car Rental API Documentation

## App Information

### Get App Info
- **Endpoint**: GET /
- **Description**: Retrieves general information about the application.
- **Authorization**: None required

## Car Management

### Create Car Listing
- **Endpoint**: POST /car/create/listing
- **Description**: Creates a new car listing.
- **Authorization**: Admin role required
- **Input**: createCarListingDto (body)

### Set Car Schedule
- **Endpoint**: POST /car/set/schedule/:id
- **Description**: Sets the schedule for a specific car.
- **Authorization**: Admin role required
- **Input**: 
  - id (path parameter)
  - updateCarScheduleDto (body)

### Delete Car Listing
- **Endpoint**: POST /car/delete/listing/:id
- **Description**: Deletes a car listing.
- **Authorization**: Admin role required
- **Input**: id (path parameter)

### Update Car Listing
- **Endpoint**: POST /car/update/listing/:id
- **Description**: Updates an existing car listing.
- **Authorization**: Admin role required
- **Input**: 
  - id (path parameter)
  - updateCarListingDto (body)

### Find Car Listings
- **Endpoint**: GET /car/find/listings
- **Description**: Searches for car listings based on criteria.
- **Authorization**: None required
- **Input**: findCarListingsDto (query parameters)

### Find Car Listing by ID
- **Endpoint**: GET /car/find/listing/:id
- **Description**: Retrieves a specific car listing by ID.
- **Authorization**: Admin role required
- **Input**: id (path parameter)

### Find Available Car Listing
- **Endpoint**: GET /car/find/avialablelisting/:id
- **Description**: Finds available car listings by ID.
- **Authorization**: JWT authentication required
- **Input**: id (path parameter)

### Find Car Listings by User ID
- **Endpoint**: GET /car/find/listings/user/:id
- **Description**: Retrieves car listings associated with a specific user.
- **Authorization**: Admin role required
- **Input**: id (path parameter)

### Get Car Schedule
- **Endpoint**: GET /car/get/schedule/:id
- **Description**: Retrieves the schedule for a specific car.
- **Authorization**: JWT authentication required
- **Input**: id (path parameter)

### Update Car Availability
- **Endpoint**: POST /car/update/availability/:id
- **Description**: Updates the availability status of a car.
- **Authorization**: Admin role required
- **Input**: 
  - id (path parameter)
  - available (boolean, body)

## Authentication

### Register User
- **Endpoint**: POST /auth/register
- **Description**: Registers a new user.
- **Authorization**: None required
- **Input**: CreateUserDto (body)

### Login
- **Endpoint**: POST /auth/login
- **Description**: Authenticates a user and returns a token.
- **Authorization**: None required
- **Input**: LoginDto (body)

### Refresh Token
- **Endpoint**: POST /auth/refresh
- **Description**: Refreshes the authentication token.
- **Authorization**: Refresh token required
- **Input**: None (uses token from request)

## File Upload

### Upload File
- **Endpoint**: POST /blob/upload
- **Description**: Uploads an image file.
- **Authorization**: Admin role required
- **Input**: image file (multipart/form-data)
- **Limitations**: 
  - Max file size: 10MB
  - Allowed formats: .jpg, .jpeg, .png, .gif

## User Management

### Get User by ID
- **Endpoint**: GET /user/:id
- **Description**: Retrieves user information by ID.
- **Authorization**: JWT authentication required
- **Input**: id (path parameter)

### Update User
- **Endpoint**: POST /user/update/:id
- **Description**: Updates user information.
- **Authorization**: JWT authentication required
- **Input**: 
  - id (path parameter)
  - UpdateUserDto (body)

## Payments

### Create Payment
- **Endpoint**: POST /payments/create
- **Description**: Creates a new payment.
- **Authorization**: None specified (consider adding authentication)
- **Input**: createPaymentDto (body)

## Reservations

### Get Confirmed Reservation
- **Endpoint**: GET /reservation/confirmed/:id
- **Description**: Retrieves a confirmed reservation by ID.
- **Authorization**: JWT authentication required
- **Input**: id (path parameter)

### Get All Reservations
- **Endpoint**: GET /reservation/all/:id
- **Description**: Retrieves all reservations for a user.
- **Authorization**: JWT authentication required
- **Input**: id (path parameter)

### Get User's Current Reservations
- **Endpoint**: GET /reservation/user/:id
- **Description**: Retrieves current reservations for a user.
- **Authorization**: JWT authentication required
- **Input**: id (path parameter)

### Get User's Reservation History
- **Endpoint**: GET /reservation/user/:id/history
- **Description**: Retrieves reservation history for a user.
- **Authorization**: JWT authentication required
- **Input**: id (path parameter)

### Cancel Reservation
- **Endpoint**: POST /reservation/cancel/:id
- **Description**: Cancels a specific reservation.
- **Authorization**: JWT authentication required
- **Input**: id (path parameter)

### Create Reservation
- **Endpoint**: POST /reservation/create
- **Description**: Creates a new reservation.
- **Authorization**: JWT authentication required
- **Input**: createReservationDto (body)