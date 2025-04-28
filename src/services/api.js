import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL:'http://localhost:5079/api',
  headers: {
    'Content-Type': 'application/json'
  }
});



// Cabin API calls
export const getCabins = async () => {
  try {

    const response = await api.get('/cabins');
    return response.data;
  } catch (error) {
    console.error('Error fetching cabins:', error);
    throw error;
  }
};

export const getCabinById = async (id) => {
  try {
    const response = await api.get(`/cabins/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching cabin with id ${id}:`, error);
    throw error;
  }
};

// Review API calls
export const getReviewsByCabinId = async (cabinId) => {
  try {
    const response = await api.get(`/reviews/cabin/${cabinId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for cabin ${cabinId}:`, error);
    throw error;
  }
};

export const createReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

// Booking API calls
export const deleteBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getUserBookings = async (userId) => {
  try {
    const response = await api.get(`/bookings/user`, { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

// LOGIN API
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Invalid email or password');
    }
    throw error;
  }
};

// REGISTER API
export const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', {
      Name: name,
      Email: email,
      Password: password
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data || 'Registration failed');
    }
    throw error;
  }
};

// New function to update an existing booking
export const updateBooking = async (bookingId, updatedData) => {
  try {
    // Mock implementation for development
    console.log('Updating booking with mock service:', bookingId, updatedData);
    
    // Get all bookings from localStorage
    const allBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
    
    // Find the booking to update
    const bookingIndex = allBookings.findIndex(booking => booking.id === bookingId);
    
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }
    
    // Update the booking with new data while preserving other properties
    const updatedBooking = {
      ...allBookings[bookingIndex],
      ...updatedData,
      // Add a lastUpdated timestamp
      lastUpdated: new Date().toISOString()
    };
    
    // Replace the old booking with the updated one
    allBookings[bookingIndex] = updatedBooking;
    
    // Save back to localStorage
    localStorage.setItem('mockBookings', JSON.stringify(allBookings));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return updatedBooking;
    
    // When backend is ready, uncomment this
    // const response = await api.put(`/bookings/${bookingId}`, updatedData);
    // return response.data;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

export const checkCabinAvailability = async (cabinId, checkIn, checkOut) => {
  try {
    // Mock implementation for development
    console.log('Checking cabin availability with mock service:', { cabinId, checkIn, checkOut });
    
    // Always return available for now
    return true;
    
    // When backend is ready, uncomment this
    // const response = await api.get(`/cabins/availability/${cabinId}`, {
    //   params: { checkIn, checkOut }
    // });
    // return response.data;
  } catch (error) {
    console.error('Error checking cabin availability:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// New API function to get user profile details
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// New API function to update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await api.put(`/users/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export default api;
