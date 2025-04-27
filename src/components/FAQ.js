import React, { useState } from 'react';

const FAQ = () => {
  // State to track which FAQ is open
  const [openFAQ, setOpenFAQ] = useState(3); // Default to the 4th item (index 3) being open

  // FAQ data
  const faqs = [
    {
      question: "How will I be sure the property is as advertised?",
      answer: "All our cabin listings include verified photos, detailed descriptions, and authentic reviews from previous guests. We also have a satisfaction guarantee - if the property doesn't match our description, you can contact us within 24 hours of check-in for assistance."
    },
    {
      question: "What is your cancellation policy? Can I get a refund?",
      answer: "Our standard cancellation policy allows full refunds for cancellations made 30 days or more before check-in. Cancellations 14-29 days before check-in receive a 50% refund. Cancellations less than 14 days before check-in are not eligible for refunds. Some properties may have special policies, so please check the specific listing details."
    },
    {
      question: "Can I have early check-in and late check-out?",
      answer: "Early check-in and late check-out may be available upon request, depending on the property's schedule. Please contact us at least 48 hours in advance to inquire about availability. Additional fees may apply for extended stays beyond standard check-out times."
    },
    {
      question: "When is normal check-in and normal check-out?",
      answer: "On most homes, Normal Check-In is 4:00 PM and Normal Check-Out is 10:00 AM. However, you should look at your reservation, as some homes have a different Check-Out time, especially during the ski season when there are often same day turnovers. Any unauthorized late check-out is subject to a late check-out fee."
    },
    {
      question: "How can I order extras after I checked-in?",
      answer: "You can order additional services or amenities after check-in by contacting our customer support team directly. We offer various extras such as mid-stay cleaning, additional supplies, equipment rentals, and more. Simply call our support line or use the in-cabin information packet to request these services."
    },
    {
      question: "Are pets allowed in all cabins?",
      answer: "Pet policies vary by property. Some cabins are pet-friendly while others do not allow pets. Pet-friendly cabins are clearly marked in the listing details. If you're bringing a pet, please inform us at the time of booking. Additional pet fees and deposits may apply, and there may be restrictions on the number, size, and type of pets allowed."
    },
    {
      question: "Can I bring more people than is intended in cabin?",
      answer: "Each cabin has a maximum occupancy limit for safety and comfort reasons. Exceeding this limit violates our terms of service and may result in additional fees or even eviction without refund. If you need accommodation for a larger group, please contact us to find a more suitable property for your needs."
    },
    {
      question: "Do I need to cleanup barbecue or fire pit before leaving?",
      answer: "Yes, we ask that guests perform basic cleanup of outdoor amenities like barbecues and fire pits before departure. This includes removing food residue from grills, ensuring fires are completely extinguished, and disposing of ashes in designated containers. Detailed instructions are provided in the cabin's welcome guide."
    }
  ];

  // Toggle FAQ open/closed
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="w-full py-24 px-4" style={{ backgroundColor: '#031D20' }}>
      <div className="container mx-auto mt-16">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - FAQs */}
          <div className="w-full lg:w-2/3 p-6">
            <h1 className="text-4xl font-bold mb-8 text-white">Frequently asked questions</h1>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`border rounded-lg overflow-hidden transition-all duration-300 ${openFAQ === index ? 'border-[#1e4e5f]' : 'border-gray-200'}`}
                >
                  <button
                    className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="font-medium text-white">{faq.question}</span>
                    <svg 
                      className={`w-5 h-5 transform transition-transform ${openFAQ === index ? 'rotate-180 text-white' : 'text-gray-400'}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={openFAQ === index ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
                    </svg>
                  </button>
                  
                  <div 
                    className={`px-4 pb-4 transition-all duration-300 ${openFAQ === index ? 'block' : 'hidden'}`}
                  >
                    <p className="text-white">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right side - Contact Info */}
          <div className="w-full lg:w-1/3 p-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-black">Need help?</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <h3 className="font-medium text-black">Call us</h3>
                  </div>
                  <p className="text-gray-600">Our phone numbers are:</p>
                  <p className="text-gray-600">+1 (406) 555-0120</p>
                  <p className="text-gray-600">+1 (603) 555-0123</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 className="font-medium text-white">Contact via email</h3>
                  </div>
                  <p className="text-gray-600">Send us your question at</p>
                  <a href="mailto:support@cabinfinder.com" className="text-green-700 hover:underline">support@cabinfinder.com</a>
                </div>
                
                <div className="pt-4">
                  <a 
                    href="/contacts" 
                    className="block w-full bg-[#4d6a2d] hover:bg-[#3d5423] text-white text-center py-3 px-4 rounded transition-colors duration-300"
                  >
                    Go to contacts
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
