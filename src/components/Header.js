import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation trigger on mount
    setTimeout(() => setIsVisible(true), 100);
    
    // Get user bookings from localStorage
    const fetchBookings = () => {
      try {
        const allBookings = JSON.parse(localStorage.getItem('mockBookings') || '[]');
        
        if (allBookings.length > 0 && currentUser?.id) {
          const userBookings = allBookings.filter(booking => booking.userId === currentUser.id);
          setUserBookings(userBookings);
        }
      } catch (err) {
        console.error('Error fetching bookings in header:', err);
      }
    };
    
    if (currentUser) {
      fetchBookings();
    }
    
    // Set up interval to check for new bookings every 5 seconds
    const interval = setInterval(fetchBookings, 5000);
    
    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentUser]);

  useEffect(() => {
    // Add click event listener to handle clicks outside the drawer
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target) && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [drawerOpen]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateUser(null);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Get the most recent booking
  const latestBooking = userBookings.length > 0 
    ? userBookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))[0] 
    : null;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#031D20] shadow-lg py-2 backdrop-blur-md bg-opacity-90' 
          : 'bg-gradient-to-b from-black/90 to-transparent py-4'
      } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
    >
      <div className="container-custom flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-white flex items-center transition-all duration-500 hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mr-2 animate-float" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
            <span className="animate-slide-in-right">Cabin Finder</span>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="text-white focus:outline-none transition-transform duration-300 hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                className="transition-all duration-300"
              />
            </svg>
          </button>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {['Home', 'Cabins', 'About', 'FAQ', 'Contacts'].map((item, index) => (
            <Link 
              key={item} 
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
              className="text-white relative group overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="transition-colors duration-300 group-hover:text-green-300">
                {item}
              </span>
            </Link>
          ))}
          <div className="relative ml-4">
            <button
              className="flex items-center px-3 py-2 rounded-full bg-green-700 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
              onClick={toggleDrawer}
              aria-label="Account"
            >
              <FaUser className="mr-2" />
              <span className="hidden md:inline">Account</span>
            </button>
          </div>
        </nav>

        {/* Drawer Sidebar */}
        {drawerOpen && (
          <div className="fixed inset-0 z-500 flex">
            <div className="flex-1 bg-black bg-opacity-40" />
            <div ref={drawerRef} className="w-72 bg-black h-full shadow-lg p-6 animate-slide-in-right relative flex flex-col text-white" style={{backgroundColor: '#000', opacity: 1, zIndex: 9999}}>
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-green-700 text-2xl font-bold"
                aria-label="Close sidebar"
              >
                &times;
              </button>
              {currentUser ? (
                <>
                  <p className="text-lg font-semibold mb-4 mt-8 text-white">Welcome, {currentUser.name}</p>
                  <Link to="/profile" className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Your Profile</Link>
                  <Link to="/profile" className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Your Bookings</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-white hover:bg-gray-900 rounded">Logout</button>
                </>
              ) : (
                <Link to="/login" className="block px-4 py-2 text-white hover:bg-gray-900 rounded">Login</Link>
              )}
            </div>
          </div>
        )}
        
        {/* Auth and Book buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {latestBooking ? (
            <Link 
              to="/profile?tab=bookings" 
              className="bg-gradient-to-r from-white to-green-50 text-green-800 px-4 py-2 rounded-md font-medium transition-all duration-500 hover:shadow-green-glow hover:scale-105 flex items-center animate-fade-in"
            >
              <FaCalendarAlt className="mr-2 animate-pulse-slow" />
              <span>Your Booking</span>
            </Link>
          ) : (
            <Link 
              to="/cabins" 
              className="relative overflow-hidden bg-gradient-to-r from-white to-green-50 text-green-800 px-4 py-2 rounded-md font-medium transition-all duration-500 hover:shadow-green-glow hover:scale-105 animate-fade-in"
            >
              <span className="relative z-10">Book Now</span>
              <span className="absolute bottom-0 left-0 w-0 h-full bg-gradient-to-r from-green-50 to-green-100 transition-all duration-500 group-hover:w-full"></span>
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`md:hidden bg-[#031D20] border-t border-gray-700 overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-custom py-4 space-y-3">
          {['Home', 'Cabins', 'About', 'FAQ', 'Contacts'].map((item, index) => (
            <Link 
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
              className="block text-white py-2 transform transition-transform duration-300 hover:translate-x-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {item}
            </Link>
          ))}
          
          <div className="pt-3 border-t border-gray-700">
            {currentUser ? (
              <div className="space-y-3 animate-fade-in">
                <p className="text-white">Welcome, {currentUser.name}</p>
                <Link to="/profile" className="block text-white py-2 transform transition-transform duration-300 hover:translate-x-2">Your Profile</Link>
                <Link to="/profile" className="block text-white py-2 transform transition-transform duration-300 hover:translate-x-2">Your Bookings</Link>
                <button 
                  onClick={handleLogout}
                  className="block text-white py-2 transform transition-transform duration-300 hover:translate-x-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="block text-white py-2 transform transition-transform duration-300 hover:translate-x-2">Login</Link>
            )}
            
            {latestBooking ? (
              <Link 
                to="/profile?tab=bookings" 
                className="mt-3 bg-gradient-to-r from-white to-green-50 text-green-800 px-4 py-2 rounded-md font-medium text-center flex items-center justify-center transition-all duration-300 hover:shadow-lg"
              >
                <FaCalendarAlt className="mr-2 animate-pulse-slow" />
                <span>Your Booking</span>
              </Link>
            ) : (
              <Link 
                to="/cabins" 
                className="mt-3 bg-gradient-to-r from-white to-green-50 text-green-800 px-4 py-2 rounded-md font-medium text-center transition-all duration-300 hover:shadow-lg"
              >
                Book Now
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes slide-in-right {
          0% { transform: translateX(100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse-slow {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .shadow-green-glow {
          box-shadow: 0 0 15px rgba(52, 211, 153, 0.5);
        }
      `}</style>
    </header>
  );
};

export default Header;
