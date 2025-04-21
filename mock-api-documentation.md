# Tech Event Hub Mock API Documentation

This document provides details about the mock API endpoints used in the Tech Event Hub UI application.

## Base URL

All endpoints are relative to the base URL of the API server.

## Authentication

### Login

```
POST /auth/login
```

Authenticates a user and returns a token along with user details.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Mock Credentials:**

1. Regular User:
   - Email: `user@example.com`
   - Password: `password`
   - Response:
     ```json
     {
       "token": "mock-jwt-token",
       "user": {
         "id": "1",
         "username": "techguru",
         "email": "user@example.com",
         "role": "user"
       }
     }
     ```

2. Admin User:
   - Email: `admin@example.com`
   - Password: `admin`
   - Response:
     ```json
     {
       "token": "mock-admin-jwt-token",
       "user": {
         "id": "2",
         "username": "admin",
         "email": "admin@example.com",
         "role": "admin"
       }
     }
     ```

### Register

```
POST /auth/register
```

Registers a new user.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Registration successful"
}
```

## Events

### Get All Events

```
GET /events
```

Returns a list of all events.

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "type": "string",
    "date": "string (YYYY-MM-DD)",
    "time": "string (HH:MM)",
    "location": "string",
    "imageUrl": "string",
    "organizer": {
      "id": "string",
      "username": "string"
    },
    "registrations": [
      {
        "userId": "string"
      }
    ]
  }
]
```

**Mock Data:**
```json
[
  {
    "id": "1",
    "title": "React Advanced Workshop",
    "description": "Deep dive into advanced React concepts including hooks, context API, and performance optimization techniques. This workshop is designed for developers who already have experience with React and want to take their skills to the next level.",
    "type": "Workshop",
    "date": "2025-05-15",
    "time": "10:00",
    "location": "Tech Hub, Bangalore",
    "imageUrl": "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "organizer": { "id": "2", "username": "admin" },
    "registrations": [{ "userId": "1" }, { "userId": "3" }]
  },
  {
    "id": "2",
    "title": "Annual Developer Hackathon",
    "description": "Join us for a 48-hour hackathon where you can showcase your coding skills, collaborate with other developers, and compete for exciting prizes. Open to developers of all skill levels.",
    "type": "Hackathon",
    "date": "2025-06-20",
    "time": "09:00",
    "location": "Innovation Center, Delhi",
    "imageUrl": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "organizer": { "id": "2", "username": "admin" },
    "registrations": []
  },
  {
    "id": "3",
    "title": "Cloud Computing Conference",
    "description": "Explore the latest trends and technologies in cloud computing. Learn from industry experts about serverless architecture, containerization, and cloud security best practices.",
    "type": "Conference",
    "date": "2025-07-10",
    "time": "09:30",
    "location": "Convention Center, Mumbai",
    "imageUrl": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "organizer": { "id": "2", "username": "admin" },
    "registrations": [{ "userId": "1" }]
  },
  {
    "id": "4",
    "title": "JavaScript Meetup",
    "description": "Monthly meetup for JavaScript enthusiasts. This month we will be discussing the latest features in ES2022 and best practices for modern JavaScript development.",
    "type": "Meetup",
    "date": "2025-04-25",
    "time": "18:00",
    "location": "Coworking Space, Hyderabad",
    "imageUrl": "https://images.unsplash.com/photo-1543013309-0d1f4edeb868?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "organizer": { "id": "2", "username": "admin" },
    "registrations": [{ "userId": "1" }, { "userId": "3" }]
  },
  {
    "id": "5",
    "title": "Introduction to Machine Learning",
    "description": "A beginner-friendly webinar on machine learning fundamentals. Learn about different algorithms, data preprocessing, and how to build your first ML model.",
    "type": "Webinar",
    "date": "2025-05-05",
    "time": "17:00",
    "location": "Online",
    "imageUrl": "https://images.unsplash.com/photo-1527474305487-b87b222841cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "organizer": { "id": "2", "username": "admin" },
    "registrations": [{ "userId": "1" }, { "userId": "3" }]
  }
]
```

### Get Event by ID

```
GET /events/{eventId}
```

Returns details of a specific event.

**Path Parameters:**
- `eventId` (string, required): The ID of the event to retrieve

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "type": "string",
  "date": "string (YYYY-MM-DD)",
  "time": "string (HH:MM)",
  "location": "string",
  "imageUrl": "string",
  "organizer": {
    "id": "string",
    "username": "string"
  },
  "registrations": [
    {
      "userId": "string"
    }
  ]
}
```

### Create Event

```
POST /events
```

Creates a new event. Only accessible to admin users.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "type": "string",
  "date": "string (YYYY-MM-DD)",
  "time": "string (HH:MM)",
  "location": "string",
  "imageUrl": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "type": "string",
  "date": "string (YYYY-MM-DD)",
  "time": "string (HH:MM)",
  "location": "string",
  "imageUrl": "string",
  "organizer": {
    "id": "2",
    "username": "admin"
  },
  "registrations": []
}
```

### Update Event

```
PUT /events/{eventId}
```

Updates an existing event. Only accessible to admin users.

**Path Parameters:**
- `eventId` (string, required): The ID of the event to update

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "type": "string",
  "date": "string (YYYY-MM-DD)",
  "time": "string (HH:MM)",
  "location": "string",
  "imageUrl": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "type": "string",
  "date": "string (YYYY-MM-DD)",
  "time": "string (HH:MM)",
  "location": "string",
  "imageUrl": "string",
  "organizer": {
    "id": "string",
    "username": "string"
  },
  "registrations": [
    {
      "userId": "string"
    }
  ]
}
```

### Delete Event

```
DELETE /events/{eventId}
```

Deletes an event. Only accessible to admin users.

**Path Parameters:**
- `eventId` (string, required): The ID of the event to delete

**Response:**
```json
{
  "message": "Event deleted successfully"
}
```

## User Events

### Get User Events

```
GET /user/events
```

Returns events that the current user has registered for. This endpoint is used for the "My Registrations" page.

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "type": "string",
    "date": "string (YYYY-MM-DD)",
    "time": "string (HH:MM)",
    "location": "string",
    "imageUrl": "string",
    "organizer": {
      "id": "string",
      "username": "string"
    },
    "registrations": [
      {
        "userId": "string"
      }
    ]
  }
]
```

**Mock Data for Regular User (userId: "1"):**
```json
[
  {
    "id": "1",
    "title": "React Advanced Workshop",
    "description": "Deep dive into advanced React concepts including hooks, context API, and performance optimization techniques.",
    "type": "Workshop",
    "date": "2025-05-15",
    "time": "10:00",
    "location": "Tech Hub, Bangalore",
    "imageUrl": "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "organizer": { "id": "2", "username": "admin" },
    "registrations": [{ "userId": "1" }, { "userId": "3" }]
  },
  {
    "id": "3",
    "title": "Cloud Computing Conference",
    "description": "Explore the latest trends and technologies in cloud computing.",
    "type": "Conference",
    "date": "2025-07-10",
    "time": "09:30",
    "location": "Convention Center, Mumbai",
    "imageUrl": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "organizer": { "id": "2", "username": "admin" },
    "registrations": [{ "userId": "1" }]
  },
  {
    "id": "5",
    "title": "Introduction to Machine Learning",
    "description": "A beginner-friendly webinar on machine learning fundamentals.",
    "type": "Webinar",
    "date": "2025-05-05",
    "time": "17:00",
    "location": "Online",
    "imageUrl": "https://images.unsplash.com/photo-1527474305487-b87b222841cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "organizer": { "id": "2", "username": "admin" },
    "registrations": [{ "userId": "1" }, { "userId": "3" }]
  }
]
```

### Register for Event

```
POST /events/{eventId}/register
```

Registers the current user for an event.

**Path Parameters:**
- `eventId` (string, required): The ID of the event to register for

**Response:**
```json
{
  "message": "Successfully registered for event"
}
```

### Cancel Event Registration

```
DELETE /events/{eventId}/register
```

Cancels the current user's registration for an event.

**Path Parameters:**
- `eventId` (string, required): The ID of the event to cancel registration for

**Response:**
```json
{
  "message": "Successfully canceled event registration"
}
```

## Notes

1. All endpoints are mocked in the frontend application and do not make actual API calls.
2. The mock data is defined in the `api.service.js` file.
3. To revert the mock implementation and use real API calls, uncomment the actual API calls and comment out the mock data sections in the `api.service.js` file.
