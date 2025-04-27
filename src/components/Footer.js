import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaTiktok, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart } from 'react-icons/fa';
import { IoIosSend } from 'react-icons/io';
import { MdCabin } from 'react-icons/md';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // In a real application, you'd send this to your backend
      console.log('Subscribed email:', email);
      setIsSubscribed(true);
      setShowMessage(true);
      setEmail('');
      
      // Hide the message after 5 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-[#031D20] via-[#1e4e5f] to-[#0a2e35] text-white">
      {/* Top Section with Newsletter */}
      <div className="border-b border-gray-700/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold flex items-center">
                <MdCabin className="text-3xl mr-2 text-green-400" />
                <span>Subscribe to Our Newsletter</span>
              </h3>
              <p className="text-gray-300 mt-2">Get exclusive offers and cabin recommendations</p>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3">
              <form className="relative" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button 
                  type="submit" 
                  className="absolute right-1 top-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                  aria-label="Subscribe"
                >
                  <IoIosSend className="text-xl" />
                </button>
              </form>
              {showMessage && (
                <div className="mt-3 bg-green-500/80 text-white p-3 rounded-md transition-all animate-pulse">
                  <p className="font-medium">🎉 Thanks for subscribing!</p>
                  <p className="text-sm">You'll receive our exclusive cabin deals soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content - Simplified to 3 columns */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <h4 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-gradient-to-r from-green-400 to-green-600 h-6 w-1 mr-2 rounded-full"></span>
              About Us
            </h4>
            <p className="text-gray-300 mb-4">
              Discover the perfect cabin getaway with our curated selection of remote, cozy retreats. 
              We're passionate about connecting you with nature's finest hideaways.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="bg-white/5 hover:bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/20">
                <FaFacebookF className="text-white" />
              </a>
              <a href="#" className="bg-white/5 hover:bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/20">
                <FaTwitter className="text-white" />
              </a>
              <a href="#" className="bg-white/5 hover:bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/20">
                <FaInstagram className="text-white" />
              </a>
              <a href="#" className="bg-white/5 hover:bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/20">
                <FaTiktok className="text-white" />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links - Simplified, no Privacy Policy */}
          <div>
            <h4 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-gradient-to-r from-green-400 to-green-600 h-6 w-1 mr-2 rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
                  <span className="bg-green-500/20 p-1 rounded-full mr-2">→</span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cabins" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
                  <span className="bg-green-500/20 p-1 rounded-full mr-2">→</span>
                  Cabins
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
                  <span className="bg-green-500/20 p-1 rounded-full mr-2">→</span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
                  <span className="bg-green-500/20 p-1 rounded-full mr-2">→</span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center">
                  <span className="bg-green-500/20 p-1 rounded-full mr-2">→</span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-gradient-to-r from-green-400 to-green-600 h-6 w-1 mr-2 rounded-full"></span>
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-white/5 p-2 rounded-full mr-3 mt-1">
                  <FaMapMarkerAlt className="text-green-400" />
                </div>
                <span className="text-gray-300">123 Forest Avenue, Woodland Heights, WH 54321, India</span>
              </li>
              <li className="flex items-center">
                <div className="bg-white/5 p-2 rounded-full mr-3">
                  <FaPhone className="text-green-400" />
                </div>
                <span className="text-gray-300">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <div className="bg-white/5 p-2 rounded-full mr-3">
                  <FaEnvelope className="text-green-400" />
                </div>
                <span className="text-gray-300">info@cabinbooking.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="bg-[#031D20]/80 py-4">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p> 2023 Cabin Booking. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center">
            Made with <FaHeart className="text-green-500 mx-1" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
