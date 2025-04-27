import React from 'react';
import { Link } from 'react-router-dom';

const CabinCard = ({ cabin }) => {
  const { id, name, location, price, description, rating, reviews } = cabin;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <div 
          className="w-full h-64 bg-gray-700"
          style={{
            background: `linear-gradient(${id * 60}deg, #2d3748, #4a5568)`
          }}
        ></div>
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <div className="uppercase text-xs font-medium text-gray-500 mb-1">{location}</div>
        <h3 className="text-lg font-medium mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex items-center mb-4">
          <div className="flex mr-1">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">{reviews} reviews</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold">{price}</span>
            <span className="text-gray-500 text-sm ml-1">per night</span>
          </div>
          <Link 
            to={`/cabin/${id}`} 
            className="text-green-800 hover:text-green-900 font-medium text-sm"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CabinCard;





