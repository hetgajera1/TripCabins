import React from 'react';
import hero1 from '../images/hero1.avif';
import hero2 from '../images/hero2.avif';
import hero3 from '../images/hero3.avif';
import hero4 from '../images/hero4.avif';
import hero5 from '../images/hero5.avif';

const ImageGallery = () => {
  return (
    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/4 h-3/4 flex flex-col space-y-2 pr-8">
      {[hero1, hero2, hero3, hero4, hero5].map((image, index) => (
        <div key={index} className="h-1/5 overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <div className="relative w-3/4 h-full">
            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg shadow-inner"></div>
            <img 
              src={image} 
              alt={`Gallery view ${index + 1}`} 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
