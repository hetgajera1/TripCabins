import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaHotel, FaSignOutAlt, FaEdit, FaCheck, FaTimes, FaBirthdayCake, FaPhone, FaMapMarkerAlt, FaBell, FaNewspaper, FaTimesCircle, FaPencilAlt } from 'react-icons/fa';
import { getUserProfile, updateUserProfile, getUserBookings, updateBooking, deleteBooking } from '../services/api';
import ChangePasswordSection from './ChangePasswordSection';

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [fullProfile, setFullProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellationFeedback, setCancellationFeedback] = useState(null);
  const [showEditBookingModal, setShowEditBookingModal] = useState(false);
  const [editBookingData, setEditBookingData] = useState(null);
  const [bookingUpdateLoading, setBookingUpdateLoading] = useState(false);
  const [bookingUpdateSuccess, setBookingUpdateSuccess] = useState(false);
  const [bookingUpdateError, setBookingUpdateError] = useState(null);

  // --- Fetch helpers: must be defined before useEffect and any usage ---
  const fetchUserProfileLocal = async (uid) => {
    try {
      setProfileLoading(true);
      if (!uid) throw new Error('User ID not found');
      const profileData = await getUserProfile(uid);
      setFullProfile(profileData);
      setEditFormData(profileData); // Initialize edit form with current data
      setProfileError(null);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setProfileError('Failed to load your profile data. Please try again later.');
    } finally {
      setProfileLoading(false);
    }
  };

  const normalizeBooking = (raw) => {
    return {
      id: raw.id || raw.Id,
      cabinId: raw.cabinId || raw.CabinId,
      cabinName: raw.cabinName || raw.CabinName,
      checkIn: raw.checkIn || raw.checkInDate || raw.CheckIn,
      checkOut: raw.checkOut || raw.checkOutDate || raw.CheckOut,
      numberOfGuests: raw.numberOfGuests || raw.NumberOfGuests,
      totalAmount: raw.totalAmount !== undefined ? raw.totalAmount : (raw.totalPrice !== undefined ? raw.totalPrice : undefined),
      status: raw.status || raw.Status,
      bookingDate: raw.bookingDate || raw.BookingDate,
      confirmationCode: raw.confirmationCode || raw.ConfirmationCode,
      // ...add other fields as needed
    };
  };

  const fetchBookingsLocal = async (uid) => {
    try {
      setLoading(true);
      const bookingsFromApi = await getUserBookings(uid);
      console.log('Bookings from API:', bookingsFromApi);
      setBookings(Array.isArray(bookingsFromApi) ? bookingsFromApi.map(normalizeBooking) : []);
      setError(null);
    } catch (apiErr) {
      setError('Failed to fetch bookings from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const storedUserString = localStorage.getItem('user');
    if (!storedUserString) {
      navigate('/login');
      return;
    }
    const storedUser = JSON.parse(storedUserString);
    setUser(storedUser);
    // Always get userId directly from localStorage
    const uid = storedUser?.id;
    setUserId(uid);
    console.log('User ID:', uid);
    fetchUserProfileLocal(uid);
    fetchBookingsLocal(uid);
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('preferences.')) {
      const preferenceKey = name.split('.')[1];
      setEditFormData(prevState => ({
        ...prevState,
        preferences: {
          ...prevState.preferences,
          [preferenceKey]: checked
        }
      }));
    } else {
      setEditFormData(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data when canceling edit
      setEditFormData(fullProfile);
    }
    setIsEditing(!isEditing);
    setUpdateSuccess(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setUpdateSuccess(false);

    try {
      // Get userId from localStorage user object
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser?.id;
      console.log(userId)
      if (!userId) throw new Error('User ID not found');
      const updatedProfile = await updateUserProfile(userId, editFormData);
      setFullProfile(updatedProfile);
      setIsEditing(false);
      setUpdateSuccess(true);

      // Update basic user info if name changed
      if (updatedProfile.name !== user.name) {
        setUser(prevUser => ({
          ...prevUser,
          name: updatedProfile.name
        }));
      }

      // Fetch latest profile and bookings to reflect changes
      await fetchUserProfileLocal(userId);
      await fetchBookingsLocal(userId);

    } catch (err) {
      console.error('Error updating profile:', err);
      setProfileError('Failed to update your profile. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCancellationRequest = (booking) => {
    setSelectedBooking(booking);
    setShowCancellationModal(true);
  };

  const calculateRefundAmount = (booking) => {
    // Use checkIn or checkInDate
    const checkInDate = new Date(booking.checkIn || booking.checkInDate);
    const today = new Date();
    const daysUntilCheckIn = Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));

    let refundPercentage = 0;
    if (daysUntilCheckIn > 7) {
      refundPercentage = 100; // Full refund
    } else if (daysUntilCheckIn >= 2 && daysUntilCheckIn <= 7) {
      refundPercentage = 50; // 50% refund
    } else {
      refundPercentage = 0; // No refund
    }

    // Use totalAmount (number) or totalPrice (string)
    let total = 0;
    if (typeof booking.totalAmount === 'number') {
      total = booking.totalAmount;
    } else if (typeof booking.totalPrice === 'string') {
      total = parseFloat(booking.totalPrice.replace('$', ''));
    } else if (typeof booking.totalAmount === 'string') {
      total = parseFloat(booking.totalAmount.replace('$', ''));
    }

    return {
      percentage: refundPercentage,
      amount: (total * refundPercentage / 100).toFixed(2),
      daysUntilCheckIn
    };
  };

  // --- Helper: Actually cancel the booking via API and update state ---
  const cancelBookingById = async (bookingId) => {
    await deleteBooking(bookingId);
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  // --- Helper: Generate a user-friendly refund message ---
  const getRefundMessage = (booking) => {
    const refundInfo = calculateRefundAmount(booking);
    if (refundInfo.percentage > 0) {
      return `Booking cancelled successfully. You will receive a refund of $${refundInfo.amount} (${refundInfo.percentage}%).`;
    }
    return 'Booking cancelled successfully. No refund is applicable as per our cancellation policy.';
  };

  const handleCancelBooking = async () => {
    try {
      await cancelBookingById(selectedBooking.id);
      setCancellationFeedback({
        type: 'success',
        message: getRefundMessage(selectedBooking)
      });
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setCancellationFeedback({
        type: 'error',
        message: 'Failed to cancel booking. Please try again later.'
      });
    } finally {
      setShowCancellationModal(false);
    }
  };


  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setEditBookingData({
      checkInDate: booking.checkIn || booking.checkInDate,
      checkOutDate: booking.checkOut || booking.checkOutDate,
      numberOfGuests: booking.numberOfGuests || booking.NumberOfGuests
    });
    setShowEditBookingModal(true);
    setBookingUpdateSuccess(false);
    setBookingUpdateError(null);
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setEditBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    setBookingUpdateLoading(true);
    setBookingUpdateError(null);
    
    try {
      // Validate dates
      const checkIn = new Date(editBookingData.checkInDate);
      const checkOut = new Date(editBookingData.checkOutDate);
      const today = new Date();
      
      // Set time to midnight for accurate comparison
      today.setHours(0, 0, 0, 0);
      
      if (checkIn < today) {
        throw new Error("Check-in date cannot be in the past");
      }
      
      if (checkOut <= checkIn) {
        throw new Error("Check-out date must be after check-in date");
      }
      
      // Calculate nights and price
      const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const pricePerNight = parseFloat(selectedBooking.totalPrice.replace('$', '')) / 
        Math.round((new Date(selectedBooking.checkOutDate) - new Date(selectedBooking.checkInDate)) / (1000 * 60 * 60 * 24));
      
      const updatedTotalPrice = `$${(nights * pricePerNight).toFixed(2)}`;
      
      // Update booking
      const updatedBooking = await updateBooking(selectedBooking.id, {
        ...editBookingData,
        totalPrice: updatedTotalPrice
      });
      
      // Update bookings state
      setBookings(prevBookings =>
  Array.isArray(prevBookings) ? prevBookings.map(booking =>
    booking.id === selectedBooking.id ? updatedBooking : booking
  ) : []
);
      
      setBookingUpdateSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowEditBookingModal(false);
        setBookingUpdateSuccess(false);
      }, 2000);
      
    } catch (err) {
      console.error('Error updating booking:', err);
      setBookingUpdateError(err.message || 'Failed to update booking. Please try again.');
    } finally {
      setBookingUpdateLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#031D20' }}>
        <div className="text-white text-xl">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#031D20' }}>
      <div className="container mx-auto py-20 px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-[#1e4e5f] text-white p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center">
                {fullProfile && fullProfile.profileImage ? (
                  <img 
                    src={fullProfile.profileImage} 
                    alt={user.name} 
                    className="w-16 h-16 rounded-full mr-4 border-2 border-white object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full mr-4 bg-gray-300 flex items-center justify-center">
                    <FaUser className="text-gray-500 text-2xl" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold mb-1">Welcome, {user.name}</h1>
                  <p className="text-gray-200">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="mt-4 md:mt-0 flex items-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors duration-300"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
            <div className="flex space-x-6">
              <button 
                className={`py-2 px-1 font-medium flex items-center border-b-2 ${activeTab === 'profile' ? 'border-[#4d6a2d] text-[#4d6a2d]' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('profile')}
              >
                <FaUser className="mr-2" />
                Profile
              </button>
              <button 
                className={`py-2 px-1 font-medium flex items-center border-b-2 ${activeTab === 'bookings' ? 'border-[#4d6a2d] text-[#4d6a2d]' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('bookings')}
              >
                <FaCalendarAlt className="mr-2" />
                My Bookings
              </button>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#1e4e5f]">Your Profile</h2>
                  {!isEditing && (
                    <button 
                      onClick={handleEditToggle}
                      className="flex items-center text-[#4d6a2d] hover:text-[#3d5423] font-medium"
                    >
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </button>
                  )}
                </div>
                
                {profileLoading && !fullProfile ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4d6a2d]"></div>
                    <p className="mt-2 text-gray-600">Loading your profile...</p>
                  </div>
                ) : profileError ? (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                    <p>{profileError}</p>
                  </div>
                ) : (
                  <>
                    {updateSuccess && (
                      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
                        <p>Your profile has been updated successfully!</p>
                      </div>
                    )}
                    
                    {isEditing ? (
                      // Edit Profile Form
                      <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                          <h3 className="text-lg font-semibold text-[#1e4e5f] mb-4">Personal Information</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                              <input
                                type="text"
                                id="name"
                                name="name"
                                value={editFormData.name || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4d6a2d]"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={editFormData.email || ''}
                                className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                                disabled
                              />
                              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                            </div>
                            
                            <div>
                              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                              <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={editFormData.phone || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4d6a2d]"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                              <input
                                type="date"
                                id="birthday"
                                name="birthday"
                                value={editFormData.birthday || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4d6a2d]"
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                              <textarea
                                id="address"
                                name="address"
                                value={editFormData.address || ''}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4d6a2d]"
                              ></textarea>
                            </div>
                            
                            <div className="md:col-span-2">
                              <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                              <input
                                type="url"
                                id="profileImage"
                                name="profileImage"
                                value={editFormData.profileImage || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4d6a2d]"
                                placeholder="https://example.com/image.jpg"
                              />
                              <p className="text-xs text-gray-500 mt-1">Enter a URL to an image (in a real app, you would upload files)</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                          <h3 className="text-lg font-semibold text-[#1e4e5f] mb-4">Preferences</h3>
                          
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="notifications"
                                name="preferences.notifications"
                                checked={editFormData.preferences?.notifications || false}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-[#4d6a2d] focus:ring-[#4d6a2d] border-gray-300 rounded"
                              />
                              <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                                Receive booking notifications
                              </label>
                            </div>
                            
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="newsletter"
                                name="preferences.newsletter"
                                checked={editFormData.preferences?.newsletter || false}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-[#4d6a2d] focus:ring-[#4d6a2d] border-gray-300 rounded"
                              />
                              <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                                Subscribe to newsletter
                              </label>
                            </div>
                            
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="dealAlerts"
                                name="preferences.dealAlerts"
                                checked={editFormData.preferences?.dealAlerts || false}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-[#4d6a2d] focus:ring-[#4d6a2d] border-gray-300 rounded"
                              />
                              <label htmlFor="dealAlerts" className="ml-2 block text-sm text-gray-700">
                                Receive special deal alerts
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-4">
                          <button
                            type="button"
                            onClick={handleEditToggle}
                            className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors duration-300"
                          >
                            <FaTimes className="mr-2" />
                            Cancel
                          </button>
                          
                          <button
                            type="submit"
                            className="flex items-center bg-[#4d6a2d] hover:bg-[#3d5423] text-white py-2 px-4 rounded transition-colors duration-300"
                            disabled={profileLoading}
                          >
                            {profileLoading ? (
                              <>
                                <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                                Updating...
                              </>
                            ) : (
                              <>
                                <FaCheck className="mr-2" />
                                Save Changes
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    ) : (
                      // Profile View
                      <>
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                            <div className="flex items-start">
                              <FaUser className="text-gray-500 mt-1 mr-3" />
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                                <p className="text-gray-900">{fullProfile?.name}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <svg className="w-5 h-5 text-gray-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                              </svg>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                                <p className="text-gray-900">{fullProfile?.email}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <FaPhone className="text-gray-500 mt-1 mr-3" />
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                                <p className="text-gray-900">{fullProfile?.phone || 'Not provided'}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <FaBirthdayCake className="text-gray-500 mt-1 mr-3" />
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Birthday</h3>
                                <p className="text-gray-900">
                                  {fullProfile?.birthday ? new Date(fullProfile.birthday).toLocaleDateString() : 'Not provided'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start md:col-span-2">
                              <FaMapMarkerAlt className="text-gray-500 mt-1 mr-3" />
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
                                <p className="text-gray-900">{fullProfile?.address || 'Not provided'}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <svg className="w-5 h-5 text-gray-500 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Member Since</h3>
                                <p className="text-gray-900">
                                  {fullProfile?.memberSince ? new Date(fullProfile.memberSince).toLocaleDateString() : new Date().toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                          <h3 className="text-lg font-semibold text-[#1e4e5f] mb-4">Communication Preferences</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-3 p-3 bg-white rounded border border-gray-200">
                              <div className={`w-6 h-6 flex items-center justify-center rounded-full ${fullProfile?.preferences?.notifications ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {fullProfile?.preferences?.notifications ? <FaCheck size={12} /> : <FaTimes size={12} />}
                              </div>
                              <div className="flex items-center">
                                <FaBell className="text-gray-400 mr-2" />
                                <span>Notifications</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-3 bg-white rounded border border-gray-200">
                              <div className={`w-6 h-6 flex items-center justify-center rounded-full ${fullProfile?.preferences?.newsletter ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {fullProfile?.preferences?.newsletter ? <FaCheck size={12} /> : <FaTimes size={12} />}
                              </div>
                              <div className="flex items-center">
                                <FaNewspaper className="text-gray-400 mr-2" />
                                <span>Newsletter</span>
                              </div>
                            </div>
                            <ChangePasswordSection user={fullProfile} />
                            <div className="flex items-center space-x-3 p-3 bg-white rounded border border-gray-200">
                              <div className={`w-6 h-6 flex items-center justify-center rounded-full ${fullProfile?.preferences?.dealAlerts ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {fullProfile?.preferences?.dealAlerts ? <FaCheck size={12} /> : <FaTimes size={12} />}
                              </div>
                              <div className="flex items-center">
                                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                </svg>
                                <span>Deal Alerts</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
            
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-bold text-[#1e4e5f] mb-6">Your Bookings</h2>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4d6a2d]"></div>
                    <p className="mt-2 text-gray-600">Loading your bookings...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                    <p>{error}</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <FaHotel className="mx-auto text-gray-400 text-5xl mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-4">You haven't made any cabin bookings yet.</p>
                    <Link 
                      to="/cabins" 
                      className="inline-block bg-[#4d6a2d] hover:bg-[#3d5423] text-white py-2 px-4 rounded transition-colors duration-300"
                    >
                      Browse Cabins
                    </Link>
                  </div>
                ) : (
                  <div>
                    {cancellationFeedback && (
                      <div className={`mb-6 p-4 border-l-4 ${
                        cancellationFeedback.type === 'success' 
                          ? 'bg-green-100 border-green-500 text-green-700' 
                          : 'bg-red-100 border-red-500 text-red-700'
                      }`}>
                        <p>{cancellationFeedback.message}</p>
                      </div>
                    )}
                    
                    {bookingUpdateSuccess && (
                      <div className="mb-6 p-4 border-l-4 bg-green-100 border-green-500 text-green-700">
                        <p>Your booking has been updated successfully!</p>
                      </div>
                    )}
                    
                    <div className="space-y-6">
                      {Array.isArray(bookings) && bookings.map((booking) => (
                        <div key={booking.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                          <div className="flex flex-col md:flex-row justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-medium text-[#1e4e5f]">{booking.cabinName}</h3>
                              <p className="text-gray-600">{booking.cabinLocation}</p>
                            </div>
                            <div className="mt-2 md:mt-0 flex items-center space-x-2">
                              <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
                                booking.status === 'cancelled' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {booking.status === 'cancelled' ? 'Cancelled' : 'Confirmed'}
                              </span>
                              
                              {/* Edit button - only show for confirmed bookings */}
                              {booking.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleEditBooking(booking)}
                                  className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors duration-300"
                                  title="Edit booking"
                                >
                                  <FaPencilAlt />
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Check-in</h4>
                              <p className="text-gray-900">{new Date(booking.checkIn).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Check-out</h4>
                              <p className="text-gray-900">{new Date(booking.checkOut).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Guests</h4>
                              <p className="text-gray-900">{booking.numberOfGuests}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Total Amount</h4>
                              <p className="text-gray-900">{booking.totalAmount || booking.totalPrice || '-'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Booking Date</h4>
                              <p className="text-gray-900">{booking.bookingDate ? new Date(booking.bookingDate).toLocaleString() : '-'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Confirmation Code</h4>
                              <p className="text-gray-900">{booking.confirmationCode || '-'}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                              <p className="text-xs text-gray-500">Status: <span className={booking.status === 'cancelled' ? 'text-red-600' : 'text-green-600'}>{booking.status}</span></p>
                              <p className="text-xs text-gray-500">Confirmation: {booking.confirmationCode}</p>
                              <p className="text-xs text-gray-500">Booking Date: {booking.bookingDate ? new Date(booking.bookingDate).toLocaleString() : '-'}</p>
                              <p className="text-xs text-gray-500">Total Amount: {booking.totalAmount || booking.totalPrice || '-'}</p>
                            </div>
                            {booking.status !== 'cancelled' && (
                              <button
                                onClick={() => handleCancellationRequest(booking)}
                                className="mt-3 md:mt-0 text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Cancel Booking
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Booking Summary */}
                    <div className="mt-8 bg-[#1e4e5f] text-white p-6 rounded-lg shadow-lg">
                      <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-gray-300">Total Bookings</p>
                          <p className="text-2xl font-bold">{bookings.length}</p>
                        </div>
                        <div>
                          <p className="text-gray-300">Upcoming Stays</p>
                          <p className="text-2xl font-bold">
                            {bookings.filter(booking => booking.status !== 'cancelled' && new Date(booking.checkInDate) > new Date()).length}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-300">Total Nights</p>
                          <p className="text-2xl font-bold">
                            {bookings.reduce((total, booking) => {
                              if (booking.status === 'cancelled') return total;
                              const checkIn = new Date(booking.checkInDate);
                              const checkOut = new Date(booking.checkOutDate);
                              const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
                              return total + (nights || 0);
                            }, 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancellation Policy Modal */}
      {showCancellationModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1e4e5f]">Cancellation Policy</h2>
                <button 
                  onClick={() => setShowCancellationModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  <strong>Booking Details:</strong> {selectedBooking.cabinName} from {new Date(selectedBooking.checkInDate).toLocaleDateString()} to {new Date(selectedBooking.checkOutDate).toLocaleDateString()}
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <h3 className="font-semibold text-[#1e4e5f] mb-2">Our Cancellation Policy:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Free cancellation up to 7 days before check-in.</li>
                    <li>If you cancel between 2-7 days before check-in, you'll get a 50% refund.</li>
                    <li>No refund for cancellations less than 2 days before check-in.</li>
                  </ul>
                </div>
                
                {(() => {
                  const refundInfo = calculateRefundAmount(selectedBooking);
                  return (
                    <div className={`p-4 rounded-lg mb-4 ${
                      refundInfo.percentage === 100 
                        ? 'bg-green-100 text-green-800' 
                        : refundInfo.percentage === 50 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      <p className="font-medium">
                        {refundInfo.daysUntilCheckIn > 7 
                          ? `You will receive a full refund of $${refundInfo.amount}.` 
                          : refundInfo.daysUntilCheckIn >= 2 
                            ? `You will receive a partial refund of $${refundInfo.amount} (50%).` 
                            : 'You will not receive a refund based on our cancellation policy.'}
                      </p>
                    </div>
                  );
                })()}
                
                <p className="text-gray-600 text-sm italic mb-4">
                  Please note that once a booking is cancelled, it cannot be reinstated.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCancellationModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors duration-300"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors duration-300"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Booking Modal */}
      {showEditBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1e4e5f]">Edit Booking</h2>
                <button 
                  onClick={() => setShowEditBookingModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  <strong>Cabin:</strong> {selectedBooking.cabinName}
                </p>
                
                {bookingUpdateError && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    <p>{bookingUpdateError}</p>
                  </div>
                )}
                
                {bookingUpdateSuccess && (
                  <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
                    <p>Your booking has been updated successfully!</p>
                  </div>
                )}
                
                <form onSubmit={handleUpdateBooking}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        id="checkInDate"
                        name="checkInDate"
                        value={editBookingData?.checkInDate || ''}
                        onChange={handleBookingInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        id="checkOutDate"
                        name="checkOutDate"
                        value={editBookingData?.checkOutDate || ''}
                        onChange={handleBookingInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Guests
                      </label>
                      <input
                        type="number"
                        id="numberOfGuests"
                        name="numberOfGuests"
                        value={editBookingData?.numberOfGuests || 1}
                        onChange={handleBookingInputChange}
                        min="1"
                        max="20"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                      <h3 className="font-semibold text-[#1e4e5f] mb-2">Important Notes:</h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                        <li>Changing dates may affect the total price of your booking.</li>
                        <li>You can only modify upcoming bookings.</li>
                        <li>Changes are subject to availability.</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowEditBookingModal(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors duration-300 flex items-center"
                      disabled={bookingUpdateLoading}
                    >
                      {bookingUpdateLoading ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                          Updating...
                        </>
                      ) : (
                        <>Save Changes</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
