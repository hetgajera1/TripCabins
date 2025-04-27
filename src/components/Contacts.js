import React, { useState } from 'react';
import contact from '../images/contact.jpg';
import api from '../services/api';

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Please fill in all required fields.'
      });
      setLoading(false);
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Please enter a valid email address.'
      });
      setLoading(false);
      return;
    }
    try {
      const res = await api.post('/contact', formData);
      setFormStatus({
        submitted: true,
        success: true,
        message: res.data || 'Thank you for your message! We will get back to you soon.'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (err) {
      setFormStatus({
        submitted: true,
        success: false,
        message: err.response?.data || 'Failed to send message. Please try again later.'
      });
    }
    setLoading(false);
    // Clear success message after 5 seconds
    setTimeout(() => {
      setFormStatus({
        submitted: false,
        success: false,
        message: ''
      });
    }, 5000);
  };

  return (
    <>
      <div className="w-full py-24 px-4" style={{ backgroundColor: '#031D20' }}>
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row mt-16">
            {/* Left side - Contact Form and Information */}
            <div className="w-full lg:w-1/2 p-6">
              <h1 className="text-4xl font-bold mb-8 text-white">Contacts</h1>
              
              <form className="space-y-6 mb-8" onSubmit={handleSubmit}>
                {formStatus.submitted && (
                  <div className={`p-4 rounded-lg ${formStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {formStatus.message}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Name <span className="text-red-400">*</span></label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name here..." 
                    className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#1e4e5f] bg-transparent text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Email <span className="text-red-400">*</span></label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address here..." 
                    className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#1e4e5f] bg-transparent text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your contact number here..." 
                    className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#1e4e5f] bg-transparent text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Message <span className="text-red-400">*</span></label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here..." 
                    rows="4"
                    className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#1e4e5f] bg-transparent text-white"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-[#4d6a2d] hover:bg-[#3d5423] text-white py-3 px-8 rounded transition-colors duration-300 flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                      Sending...
                    </>
                  ) : 'Send email'}
                </button>
              </form>
              
              {/* Contact Information */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-6 text-[#1e4e5f]">How to find us</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="mr-4 text-[#1e4e5f]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-[#1e4e5f]">Main office</h3>
                      <p className="text-gray-600 mt-1">2464 Royal Ln, Mesa, New Jersey 45463</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 text-[#1e4e5f]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-[#1e4e5f]">Contact numbers</h3>
                      <p className="text-gray-600 mt-1">+1 (406) 555-0120</p>
                      <p className="text-gray-600 mt-1">+1 (603) 555-0123 (customer support)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 text-[#1e4e5f]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-[#1e4e5f]">Email addresses</h3>
                      <p className="text-gray-600 mt-1">hello@cabinfinder.com (business inquiries)</p>
                      <p className="text-gray-600 mt-1">support@cabinfinder.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Image */}
            <div className="w-full lg:w-1/2 p-6 hidden lg:block">
              <div className="h-full">
                <img 
                  src={contact} 
                  alt="Mountain River" 
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacts;
