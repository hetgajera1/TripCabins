import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaWifi, FaSnowflake, FaFireAlt, FaHotTub, FaParking, FaUtensils, FaMountain, FaTree, FaSwimmingPool, FaMapMarkerAlt } from 'react-icons/fa';
import { getCabinById, getReviewsByCabinId, createReview, checkCabinAvailability, createBooking, getUserProfile } from '../services/api';

const CabinDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [cabin, setCabin] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [openFAQ, setOpenFAQ] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    earlyCheckIn: false,
    firewoodPackage: false
  });
  
  useEffect(() => {
    const fetchCabinData = async () => {
      try {
        setLoading(true);
        // Fetch cabin details
        const cabinData = await getCabinById(id);
        setCabin(cabinData);
        
        // Fetch reviews
        const reviewsData = await getReviewsByCabinId(id);
        setReviews(reviewsData);
        
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
  
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };
  
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        ...newReview,
        cabinId: parseInt(id),
        rating: parseFloat(newReview.rating)
      };
      
      await createReview(reviewData);
      
      // Update reviews list
      const updatedReviews = await getReviewsByCabinId(id);
      setReviews(updatedReviews);
      
      // Reset form
      setNewReview({ name: '', rating: 5, comment: '' });
      setReviewSubmitted(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setReviewSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    }
  };
  
  const handleBookingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      checkIn: bookingData.checkInDate,
      checkOut: bookingData.checkOutDate,
      guests: bookingData.numberOfGuests,
      earlyCheckIn: bookingData.earlyCheckIn,
      firewoodPackage: bookingData.firewoodPackage,
      price: cabin.price
    }).toString();
    navigate(`/book/${id}?${queryParams}`);
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
        <Link to="/cabins" className="bg-[#4d6a2d] hover:bg-[#3d5423] text-white py-3 px-8 rounded transition-colors duration-300">
          Back to Cabins
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#031D20' }}>
      <div className="container mx-auto px-4 py-10">
        {/* Cabin Header */}
        <div className="mb-8 mt-8">
          <h1 className="text-3xl font-bold text-white mb-2">{cabin.name}</h1>
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
        
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="md:col-span-2">
            <img 
              src={cabin.images && cabin.images.length > 0 ? cabin.images[selectedImage] : 'https://images.unsplash.com/photo-1518780664697-55e3ad937233'} 
              alt={cabin.name} 
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {cabin.images && cabin.images.slice(0, 4).map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${cabin.name} - ${index + 1}`}
                className={`w-full h-40 object-cover rounded-lg cursor-pointer ${selectedImage === index ? 'border-4 border-[#4d6a2d]' : ''}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>
        
        {/* Cabin Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold text-[#1e4e5f] mb-4">About this cabin</h2>
              <div className="flex flex-wrap mb-6">
                <div className="w-1/2 md:w-1/3 mb-4">
                  <span className="font-semibold">Bedrooms:</span> {cabin.bedrooms}
                </div>
                <div className="w-1/2 md:w-1/3 mb-4">
                  <span className="font-semibold">Bathrooms:</span> {cabin.bathrooms}
                </div>
                <div className="w-1/2 md:w-1/3 mb-4">
                  <span className="font-semibold">Sleeps:</span> {cabin.sleeps}
                </div>
              </div>
              <p className="text-gray-700 mb-6">{cabin.description}</p>
              <p className="text-gray-700">{cabin.longDescription}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-2xl font-bold text-[#1e4e5f] mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cabin.amenities && cabin.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    {amenity.includes('Wifi') && <FaWifi className="mr-2 text-[#4d6a2d]" />}
                    {amenity.includes('AC') && <FaSnowflake className="mr-2 text-[#4d6a2d]" />}
                    {amenity.includes('Fireplace') && <FaFireAlt className="mr-2 text-[#4d6a2d]" />}
                    {amenity.includes('Hot tub') && <FaHotTub className="mr-2 text-[#4d6a2d]" />}
                    {amenity.includes('Parking') && <FaParking className="mr-2 text-[#4d6a2d]" />}
                    {amenity.includes('Kitchen') && <FaUtensils className="mr-2 text-[#4d6a2d]" />}
                    {amenity.includes('Mountain') && <FaMountain className="mr-2 text-[#4d6a2d]" />}
                    {amenity.includes('Forest') && <FaTree className="mr-2 text-[#4d6a2d]" />}
                    {amenity.includes('Pool') && <FaSwimmingPool className="mr-2 text-[#4d6a2d]" />}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Reviews Section */}
            <div className="container mx-auto mb-12">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#1e4e5f]">Reviews</h2>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-bold">{cabin.rating}</span>
                    <span className="mx-1">·</span>
                    <span>{reviews.length} reviews</span>
                  </div>
                </div>
                
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-start mb-2">
                          <img src={review.avatar || `https://randomuser.me/api/portraits/men/${index}.jpg`} alt={review.name} className="w-12 h-12 rounded-full mr-4" />
                          <div>
                            <h3 className="font-bold">{review.name}</h3>
                            <div className="text-gray-500 text-sm">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                    
                    {reviews.length > 3 && (
                      <button 
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        className="text-[#1e4e5f] font-medium hover:underline"
                      >
                        {showAllReviews ? 'Show less reviews' : `Show all ${reviews.length} reviews`}
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-700">No reviews yet. Be the first to review this cabin!</p>
                )}
                
                {/* Add Review Form */}
                <div className="container mx-auto mb-12">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-[#1e4e5f] mb-4">Add a Review</h3>
                    {reviewSubmitted ? (
                      <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
                        Thank you for your review! It has been submitted successfully.
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit}>
                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2">Your Name</label>
                          <input 
                            type="text" 
                            name="name"
                            value={newReview.name}
                            onChange={handleReviewChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2">Rating</label>
                          <select 
                            name="rating"
                            value={newReview.rating}
                            onChange={handleReviewChange}
                            className="w-full p-2 border border-gray-300 rounded"
                          >
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Very Good</option>
                            <option value="3">3 - Good</option>
                            <option value="2">2 - Fair</option>
                            <option value="1">1 - Poor</option>
                          </select>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2">Your Review</label>
                          <textarea 
                            name="comment"
                            value={newReview.comment}
                            onChange={handleReviewChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            rows="4"
                            required
                          ></textarea>
                        </div>
                        
                        <button 
                          type="submit"
                          className="bg-[#4d6a2d] hover:bg-[#3d5423] text-white py-2 px-4 rounded transition-colors duration-300"
                        >
                          Submit Review
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Card */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
              <span className="text-3xl font-bold text-[#1e4e5f] mb-1">{typeof cabin.price === 'string' ? (cabin.price.replace(/^\$+/, '$')) : ('$' + cabin.price)}/night</span>
              
              <form onSubmit={handleBookingSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Check-in</label>
                    <input 
                      type="date" 
                      name="checkInDate"
                      value={bookingData.checkInDate}
                      onChange={handleBookingChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Check-out</label>
                    <input 
                      type="date" 
                      name="checkOutDate"
                      value={bookingData.checkOutDate}
                      onChange={handleBookingChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Guests</label>
                  <select 
                    name="numberOfGuests"
                    value={bookingData.numberOfGuests}
                    onChange={handleBookingChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    {[...Array(cabin.sleeps)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1} {i === 0 ? 'guest' : 'guests'}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
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
                      id="firewoodPackage"
                      name="firewoodPackage"
                      checked={bookingData.firewoodPackage}
                      onChange={handleBookingChange}
                      className="mr-2"
                    />
                    <label htmlFor="firewoodPackage" className="text-gray-700">Firewood package - $40</label>
                  </div>
                </div>
                
                {/* Price Calculation */}
                {bookingData.checkInDate && bookingData.checkOutDate && (
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">
                        {cabin.price} x {Math.max(1, Math.floor((new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24)))} nights
                      </span>
                      <span className="text-gray-700">
                        ${Math.floor(parseFloat(cabin.price.replace(/[^\d.]/g, '')) * Math.max(1, Math.floor((new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24))))}
                      </span>
                    </div>
                    
                    {bookingData.earlyCheckIn && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Early check-in</span>
                        <span className="text-gray-700">$50</span>
                      </div>
                    )}
                    
                    {bookingData.firewoodPackage && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Firewood package</span>
                        <span className="text-gray-700">$40</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span>
                        ${Math.floor(parseFloat(cabin.price.replace(/[^\d.]/g, '')) * Math.max(1, Math.floor((new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24)))) + 
                          (bookingData.earlyCheckIn ? 50 : 0) + 
                          (bookingData.firewoodPackage ? 40 : 0)}
                      </span>
                    </div>
                  </div>
                )}
                
                <button 
                  type="submit"
                  className="w-full bg-[#4d6a2d] hover:bg-[#3d5423] text-white py-3 px-4 rounded-lg font-bold transition-colors duration-300"
                >
                  Book Now
                </button>
              </form>
              
              <div className="text-center mt-4 text-gray-500 text-sm">
                You won't be charged yet
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQs Section */}
        <div className="container mx-auto mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-[#1e4e5f] mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <button 
                  className="flex justify-between items-center w-full text-left font-semibold"
                  onClick={() => toggleFAQ(0)}
                >
                  <span>What is the check-in/check-out time?</span>
                  <span>{openFAQ === 0 ? '−' : '+'}</span>
                </button>
                {openFAQ === 0 && (
                  <div className="mt-2 text-gray-700">
                    Check-in is at 3:00 PM and check-out is at 11:00 AM. Early check-in is available for an additional fee of $50, subject to availability.
                  </div>
                )}
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <button 
                  className="flex justify-between items-center w-full text-left font-semibold"
                  onClick={() => toggleFAQ(1)}
                >
                  <span>Is there a security deposit?</span>
                  <span>{openFAQ === 1 ? '−' : '+'}</span>
                </button>
                {openFAQ === 1 && (
                  <div className="mt-2 text-gray-700">
                    Yes, a security deposit of $200 is required upon check-in. It will be fully refunded within 7 days after check-out, provided there is no damage to the property.
                  </div>
                )}
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <button 
                  className="flex justify-between items-center w-full text-left font-semibold"
                  onClick={() => toggleFAQ(2)}
                >
                  <span>Are pets allowed?</span>
                  <span>{openFAQ === 2 ? '−' : '+'}</span>
                </button>
                {openFAQ === 2 && (
                  <div className="mt-2 text-gray-700">
                    Pets are welcome with a $75 pet fee per stay. Please inform us in advance if you're bringing a pet.
                  </div>
                )}
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <button 
                  className="flex justify-between items-center w-full text-left font-semibold"
                  onClick={() => toggleFAQ(3)}
                >
                  <span>What is the cancellation policy?</span>
                  <span>{openFAQ === 3 ? '−' : '+'}</span>
                </button>
                {openFAQ === 3 && (
                  <div className="mt-2 text-gray-700">
                    Free cancellation up to 7 days before check-in. If you cancel within 7 days of check-in, you'll receive a 50% refund, minus the service fee.
                  </div>
                )}
              </div>
              
              <div className="pb-4">
                <button 
                  className="flex justify-between items-center w-full text-left font-semibold"
                  onClick={() => toggleFAQ(4)}
                >
                  <span>Is there Wi-Fi available?</span>
                  <span>{openFAQ === 4 ? '−' : '+'}</span>
                </button>
                {openFAQ === 4 && (
                  <div className="mt-2 text-gray-700">
                    Yes, complimentary high-speed Wi-Fi is available throughout the property.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabinDetails;
