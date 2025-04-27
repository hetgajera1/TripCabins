import React from 'react';
import { Link } from 'react-router-dom';
import img1 from '../images/wood1.jpg';
import img2 from '../images/int.jpg';

const WhyYouNeedThis = () => {
  return (
    <section className="bg-white py-16">
      <div className="container-custom">
        <h2 className="text-3xl font-semibold text-center mb-12">Why you need this</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <h3 className="text-xl font-medium mb-4">Retreat</h3>
            <p className="text-gray-600">You don't have to travel far to get lost in nature. Enjoy stunning natural beauty paired with top-notch minimalist design of our cabins.</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-medium mb-4">Unplug</h3>
            <p className="text-gray-600">Get away from the hustle and bustle and come sleep under the stars...in a luxurious bed with soft linens...not nomad style, but still a getaway.</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-medium mb-4">Recharge</h3>
            <p className="text-gray-600">Take a quiet stroll to the waters edge under the canopy of majestic trees or slip into a kayak for a sunset paddle into the sunset.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-medium mb-4">Where cozy meets luxury</h3>
            <p className="text-gray-600 mb-4">Our cabins were created to be a place of respite, restoration, and relaxation, free of unnecessary clutter.</p>
            <p className="text-gray-600 mb-4">Experience the joys of recharging in nature without compromising any comfort. Waters Edge Commons features a wood pergola with a grill for outdoor dining, swings, kayaks, fishing dock and a beautiful stone patio for that perfect campfire.</p>
            <Link to="/cabins" className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors inline-block w-max">Book Now</Link>
          </div>
          <div className="h-[400px]">
            <img src={img1} alt="Luxury Cabin" className="rounded-lg shadow-md w-full h-full object-cover" />
          </div>
          <div className="h-[400px]">
            <img src={img2} alt="Minimalist Cabin" className="rounded-lg shadow-md w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-medium mb-4">Minimalist, intentional space</h3>
            <p className="text-gray-600 mb-4">Thoughtfully designed as the perfect getaway, most of cabins are inspired by timeless and elegant design. While fully embracing both Nordic and Japanese simplicity, our cabins make no compromise with the luxuries you'd expect from any premier accommodation: professional grade kitchens, floor to ceiling glass bringing the outside in, luxury Tuft & Needle mattress, electric vehicle chargers, comfy hammocks and tastefully chosen top-end furnishings throughout, all provide the perfect place to relax.</p>
            <Link to="/cabins" className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors inline-block w-max">Book Now</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyYouNeedThis;
