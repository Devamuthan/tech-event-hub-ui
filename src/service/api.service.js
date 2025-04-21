import axiosInstance from '../config/axiosConfig';
import config from '../config/config';

// Authentication APIs
export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });
    
    // Check for successful response with responseData
    if (response.data.responseData) {
      const { token, user } = response.data.responseData;
      
      // Validate token and user details
      if (!token || !user) {
        throw new Error('Invalid login response');
      }
      
      return {
        token: token,
        user: {
          id: user.email, // Using email as unique identifier since no userId is provided
          username: user.name,
          email: user.email,
          role: user.role.toLowerCase() // Convert role to lowercase
        }
      };
    }
    
    // If response doesn't match expected structure
    throw new Error('Login failed');
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await axiosInstance.post('/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

// Event APIs
export const getEvents = async () => {
  try {
    const response = await axiosInstance.get('/event');
    // If response has responseData, return it
    if (response.data.responseData) {
      return response.data.responseData;
    }
    // Otherwise, return the response data directly
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEventById = async (eventId) => {
  try {
    const response = await axiosInstance.get(`/event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await axiosInstance.post('/event', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await axiosInstance.put(`/event/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await axiosInstance.delete(`/event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// User Events APIs
export const getUserEvents = async () => {
  try {
    // Get the current logged in user from localStorage
    const userData = JSON.parse(localStorage.getItem(config.userKey)) || {};
    const currentUserId = userData.id;
    
    if (!currentUserId) {
      throw new Error('User not logged in');
    }
    
    const response = await axiosInstance.get(`/user/event/${currentUserId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user events:', error);
    throw error;
  }
};

export const registerForEvent = async (eventId) => {
  try {
    const response = await axiosInstance.post('/registration', { eventId });
    return response.data;
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

export const cancelEventRegistration = async (registrationId) => {
  try {
    const response = await axiosInstance.delete(`/registration/${registrationId}`);
    return response.data;
  } catch (error) {
    console.error('Error canceling event registration:', error);
    throw error;
  }
};
