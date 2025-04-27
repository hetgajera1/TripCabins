import React from 'react';
import { Link } from 'react-router-dom';

const ExperienceCard = ({ experience }) => {
  const { id, title, category, description } = experience;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <div 
          className="w-full h-64 bg-gray-700"
          style={{
            background: `linear-gradient(${id * 45}deg, #3b5449, #1a2a3a)`
          }}
        ></div>
      </div>
      <div className="p-4">
        <div className="uppercase text-xs font-medium text-gray-500 mb-1">{category}</div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <Link 
          to={`/experiences/${id}`} 
          className="text-green-800 hover:text-green-900 font-medium text-sm"
        >
          Learn more
        </Link>
      </div>
    </div>
  );
};

export default ExperienceCard;
