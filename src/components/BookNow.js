import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { getCabinById, checkCabinAvailability, createBooking } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const BookNow = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [cabin, setCabin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Initialize booking data from query parameters if available
  const [bookingData, setBookingData] = useState({
    checkInDate: queryParams.get('checkIn') || '',
    checkOutDate: queryParams.get('checkOut') || '',
    numberOfGuests: parseInt(queryParams.get('guests') || '1', 10),
    earlyCheckIn: queryParams.get('earlyCheckIn') === 'true',
    firewoodPackage: queryParams.get('firewoodPackage') === 'true',
    price: queryParams.get('price') || '',
    // Additional booking options
    lateCheckout: false,
    breakfastPackage: false,
    winePackage: false,
    tourGuide: false,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    specialRequests: ''
  });
  console.log(bookingData);
  // Calculate number of nights and total price
  const [bookingSummary, setBookingSummary] = useState({
    nights: 0,
    basePrice: 0,
    addonsPrice: 0,
    totalPrice: 0,
    priceBreakdown: []
  });
  
  useEffect(() => {
    const fetchCabinData = async () => {
      try {
        setLoading(true);
        const cabinData = await getCabinById(id);
        setCabin(cabinData);
        setError(null);
      } catch (err) {
        console.error('Error fetching cabin details:', err);
        setError('Failed to load cabin details. Please try again later.');
        
        // Fallback to local data if API fails
        import('./cabinData').then(module => {
          const localCabin = module.cabinData.find(c => c.id === parseInt(id));
          if (localCabin) {
            setCabin(localCabin);
            setError(null);
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCabinData();
  }, [id]);
  
  // Calculate booking summary whenever booking data or cabin changes
  useEffect(() => {
    if (!cabin) return;
    
    const calculateBookingSummary = () => {
      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      
      // Calculate nights only if both dates are valid
      let nights = 0;
      if (!isNaN(checkIn) && !isNaN(checkOut)) {
        const timeDiff = checkOut - checkIn;
        nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      }
      
      // Ensure cabin.price is a valid number
      const nightlyRate = typeof cabin.price === 'number' && !isNaN(cabin.price) ? cabin.price : 0;
      const basePrice = cabin.price;
      
      // Calculate addons price
      const priceBreakdown = [];
      
      // Base price for nights
      if (nights > 0) {
        priceBreakdown.push({
          name: `${nights} night${nights !== 1 ? 's' : ''} at $${nightlyRate}/night`,
          price: basePrice
        });
      }
      
      // Early check-in
      if (bookingData.earlyCheckIn) {
        priceBreakdown.push({
          name: 'Early check-in (11am)',
          price: 50
        });
      }
      
      // Late checkout
      if (bookingData.lateCheckout) {
        priceBreakdown.push({
          name: 'Late checkout (3pm)',
          price: 50
        });
      }
      
      // Firewood package
      if (bookingData.firewoodPackage) {
        priceBreakdown.push({
          name: 'Firewood package',
          price: 40
        });
      }
      
      // Breakfast package
      if (bookingData.breakfastPackage) {
        priceBreakdown.push({
          name: 'Breakfast package',
          price: 120
        });
      }
      
      // Wine package
      if (bookingData.winePackage) {
        priceBreakdown.push({
          name: 'Wine package',
          price: 95
        });
      }
      
      // Tour guide
      if (bookingData.tourGuide) {
        priceBreakdown.push({
          name: 'Local tour guide (4 hours)',
          price: 200
        });
      }
      
      // Calculate total addons price
      const addonsPrice = priceBreakdown.reduce((total, item) => total + (item.name.includes('night') ? 0 : item.price), 0);
      
      // Calculate total price
      const totalPrice = basePrice + addonsPrice;
      
      setBookingSummary({
        nights,
        basePrice,
        addonsPrice,
        totalPrice,
        priceBreakdown
      });
    };
    
    calculateBookingSummary();
  }, [bookingData, cabin]);
  
  const handleBookingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('DEBUG: currentUser object:', currentUser);
      console.log('DEBUG: bookingSummary', bookingSummary);
      // If currentUser is missing or has no id, set a mock user for testing
      if (!currentUser || !(currentUser.id || currentUser._id || currentUser.userId || currentUser.sub)) {
        const mockUser = { id: 'mock-user-123', name: 'Test User', email: 'test@example.com' };
        localStorage.setItem('user', JSON.stringify(mockUser));
        window.location.reload();
        return;
      }
      // Check availability
      const isAvailable = await checkCabinAvailability(
        id, 
        new Date(bookingData.checkInDate), 
        new Date(bookingData.checkOutDate)
      );
      
      if (!isAvailable) {
        alert('This cabin is not available for the selected dates');
        return;
      }
      
      // Create booking
      // Try to robustly get the user ID from currentUser
      const userId = currentUser?.id || currentUser?._id || currentUser?.userId || currentUser?.sub || "";
      const bookingPayload = {
        UserId: String(userId), // ensure string
        CabinId: String(id),            // ensure string
        CheckIn: new Date(bookingData.checkInDate).toISOString(),    // ISO string
        CheckOut: new Date(bookingData.checkOutDate).toISOString(),  // ISO string
        Status: 'Confirmed',
        BookingDate: new Date().toISOString(),
        ConfirmationCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
        // Additional fields
        NumberOfGuests: bookingData.numberOfGuests,
        EarlyCheckIn: bookingData.earlyCheckIn,
        LateCheckout: bookingData.lateCheckout,
        FirewoodPackage: bookingData.firewoodPackage,
        BreakfastPackage: bookingData.breakfastPackage,
        WinePackage: bookingData.winePackage,
        TourGuide: bookingData.tourGuide,
        ContactName: bookingData.contactName,
        ContactEmail: bookingData.contactEmail,
        ContactPhone: bookingData.contactPhone,
        SpecialRequests: bookingData.specialRequests,
        CabinName: cabin?.name || '',
        TotalAmount: isNaN(bookingSummary.totalPrice) ? 0 : bookingSummary.totalPrice
      };
      console.log('DEBUG: bookingPayload:', bookingPayload);
      const booking = await createBooking(bookingPayload);
      
      // Show success message
      setBookingSuccess(true);
      
      // Redirect to profile page after 3 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Failed to create booking. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-20 px-4 flex justify-center items-center" style={{ backgroundColor: '#031D20', minHeight: '60vh' }}>
        <div className="text-white text-xl">Loading cabin details...</div>
      </div>
    );
  }
  
  if (error || !cabin) {
    return (
      <div className="container mx-auto py-20 px-4 text-center" style={{ backgroundColor: '#031D20' }}>
        <h2 className="text-3xl font-bold text-white mb-4">Cabin Not Found</h2>
        <p className="mb-8 text-white">{error || "The cabin you're looking for doesn't exist or has been removed."}</p>
        <button 
          onClick={() => navigate('/cabins')}
          className="bg-[#4d6a2d] hover:bg-[#3d5423] text-white py-3 px-8 rounded transition-colors duration-300"
        >
          Back to Cabins
        </button>
      </div>
    );
  }
  
  if (bookingSuccess) {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: '#031D20' }}>
        <div className="container mx-auto px-4 py-20">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto text-center">
            <FaCheckCircle className="text-[#4d6a2d] text-6xl mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#1e4e5f] mb-4">Booking Confirmed!</h2>
            <p className="text-gray-700 mb-6">
              Thank you for booking with us. Your reservation for {cabin.name} has been confirmed.
              You will receive a confirmation email shortly.
            </p>
            <p className="text-gray-700 mb-8">
              You will be redirected to your profile page in a few seconds...
            </p>
            <button 
              onClick={() => navigate('/profile')}
              className="bg-[#4d6a2d] hover:bg-[#3d5423] text-white py-3 px-8 rounded transition-colors duration-300"
            >
              Go to My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#031D20' }}>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 mt-8">
          <h1 className="text-3xl font-bold text-white mb-2">Book Your Stay at {cabin.name}</h1>
          <div className="flex flex-wrap items-center text-white">
            <div className="flex items-center mr-4">
              <FaStar className="text-yellow-400 mr-1" />
              <span>{cabin.rating}</span>
              <span className="mx-1">·</span>
              <span>{cabin.reviews} reviews</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-1" />
              <span>{cabin.location}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold text-[#1e4e5f] mb-6">Booking Details</h2>
              
              <form onSubmit={handleBookingSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Check-in Date*</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
                      <input 
                        type="date" 
                        name="checkInDate"
                        value={bookingData.checkInDate}
                        onChange={handleBookingChange}
                        className="w-full p-2 pl-10 border border-gray-300 rounded"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Check-out Date*</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
                      <input 
                        type="date" 
                        name="checkOutDate"
                        value={bookingData.checkOutDate}
                        onChange={handleBookingChange}
                        className="w-full p-2 pl-10 border border-gray-300 rounded"
                        min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Number of Guests*</label>
                  <div className="relative">
                    <FaUsers className="absolute left-3 top-3 text-gray-500" />
                    <select 
                      name="numberOfGuests"
                      value={bookingData.numberOfGuests}
                      onChange={handleBookingChange}
                      className="w-full p-2 pl-10 border border-gray-300 rounded"
                      required
                    >
                      {[...Array(cabin.sleeps)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1} {i === 0 ? 'guest' : 'guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-[#1e4e5f] mb-4">Add-ons & Special Requests</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="earlyCheckIn"
                      name="earlyCheckIn"
                      checked={bookingData.earlyCheckIn}
                      onChange={handleBookingChange}
                      className="mr-2"
                    />
                    <label htmlFor="earlyCheckIn" className="text-gray-700">Early check-in (11am) - $50</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="lateCheckout"
                      name="lateCheckout"
                      checked={bookingData.lateCheckout}
                      onChange={handleBookingChange}
                      className="mr-2"
                    />
                    <label htmlFor="lateCheckout" className="text-gray-700">Late checkout (3pm) - $50</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="firewoodPackage"
                      name="firewoodPackage"
                      checked={bookingData.firewoodPackage}
                      onChange={handleBookingChange}
                      className="mr-2"
                    />
                    <label htmlFor="firewoodPackage" className="text-gray-700">Firewood package - $40</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="breakfastPackage"
                      name="breakfastPackage"
                      checked={bookingData.breakfastPackage}
                      onChange={handleBookingChange}
                      className="mr-2"
                    />
                    <label htmlFor="breakfastPackage" className="text-gray-700">Breakfast package - $120</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="winePackage"
                      name="winePackage"
                      checked={bookingData.winePackage}
                      onChange={handleBookingChange}
                      className="mr-2"
                    />
                    <label htmlFor="winePackage" className="text-gray-700">Wine package - $95</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="tourGuide"
                      name="tourGuide"
                      checked={bookingData.tourGuide}
                      onChange={handleBookingChange}
                      className="mr-2"
                    />
                    <label htmlFor="tourGuide" className="text-gray-700">Local tour guide (4 hours) - $200</label>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-[#1e4e5f] mb-4">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Full Name*</label>
                    <input 
                      type="text" 
                      name="contactName"
                      value={bookingData.contactName}
                      onChange={handleBookingChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Email*</label>
                    <input 
                      type="email" 
                      name="contactEmail"
                      value={bookingData.contactEmail}
                      onChange={handleBookingChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Phone Number*</label>
                    <input 
                      type="tel" 
                      name="contactPhone"
                      value={bookingData.contactPhone}
                      onChange={handleBookingChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Special Requests</label>
                  <textarea 
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleBookingChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="4"
                    placeholder="Any special requests or notes for your stay..."
                  ></textarea>
                </div>
                
                <div className="flex justify-between items-center">
                  <button 
                    type="button"
                    onClick={() => navigate(`/cabin/${id}`)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-6 rounded-lg font-bold transition-colors duration-300"
                  >
                    Back to Cabin
                  </button>
                  
                  <button 
                    type="submit"
                    className="bg-[#4d6a2d] hover:bg-[#3d5423] text-white py-3 px-8 rounded-lg font-bold transition-colors duration-300"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
              <h2 className="text-2xl font-bold text-[#1e4e5f] mb-4">Booking Summary</h2>
              {bookingData.price && (
                <div className="mb-2 text-green-700 font-semibold text-lg">Received Price: {bookingData.price}/night</div>
              )}
              
              <div className="mb-4">
                <img 
                  src={cabin.images && cabin.images.length > 0 ? cabin.images[0] : 'https://images.unsplash.com/photo-1518780664697-55e3ad937233'} 
                  alt={cabin.name} 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-bold text-lg">{cabin.name}</h3>
                <p className="text-gray-600">{cabin.location}</p>
              </div>
              
              <div className="border-t border-b border-gray-200 py-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Check-in</span>
                  <span className="font-semibold">
                    {bookingData.checkInDate ? new Date(bookingData.checkInDate).toLocaleDateString() : 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Check-out</span>
                  <span className="font-semibold">
                    {bookingData.checkOutDate ? new Date(bookingData.checkOutDate).toLocaleDateString() : 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Guests</span>
                  <span className="font-semibold">{bookingData.numberOfGuests}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold mb-3">Price Details</h3>
                
                {bookingSummary.priceBreakdown.map((item, index) => (
                  <div key={index} className="flex justify-between mb-2">
                    <span>{item.name}</span>
                    <span>${isNaN(item.price) ? '0.00' : Number(item.price).toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${isNaN(bookingData.price) ? '0.00' : Number(bookingData.price).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg text-sm">
                <p className="mb-2"><strong>Cancellation Policy:</strong></p>
                <p>Free cancellation up to 7 days before check-in. If you cancel between 2-7 days before check-in, you'll get a 50% refund. No refund for cancellations less than 2 days before check-in.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookNow;
