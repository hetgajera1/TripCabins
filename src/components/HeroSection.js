import React, { useState, useEffect } from 'react';
import hero1 from '../images/hero1.avif';
import hero2 from '../images/hero2.avif';
import hero3 from '../images/hero3.avif';
import hero4 from '../images/hero4.avif';
import hero5 from '../images/hero5.avif';
import main from '../images/main.jpg';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mount
    setTimeout(() => setIsLoaded(true), 300);
    setTimeout(() => setTextVisible(true), 800);
    
    // Set up the interval for image gallery animation
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % 5);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const heroImages = [hero1, hero2, hero3, hero4, hero5];
  
  return (
    <section className="relative h-screen bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('/images/hero-cabin.jpg')" }}>
      {/* Overlay with animated gradient */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="absolute inset-0 opacity-20">
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-900 to-transparent transition-opacity duration-1000 ${isLoaded ? 'opacity-30' : 'opacity-0'}`}></div>
      </div>
      
      {/* Main hero image with animation */}
      <div className={`absolute inset-0 transition-transform duration-2000 ease-out ${isLoaded ? 'scale-100' : 'scale-110'}`}>
        <img 
          src={main} 
          alt="Hero" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Side gallery with hover and active animations */}
      <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-1/4 h-3/4 flex flex-col space-y-2 pr-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-24'}`}>
        {heroImages.map((image, index) => (
          <div 
            key={index} 
            className={`h-1/5 overflow-hidden transition-all duration-500 ease-out ${activeIndex === index ? 'scale-105' : ''}`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className={`relative w-3/4 h-full transform transition-all duration-500 hover:scale-105 ${activeIndex === index ? 'shadow-xl ring-2 ring-green-300' : ''}`}>
              <div className={`absolute inset-0 bg-black transition-opacity duration-300 rounded-lg shadow-inner ${activeIndex === index ? 'bg-opacity-10' : 'bg-opacity-30'}`}></div>
              <img 
                src={image} 
                alt={`Gallery view ${index + 1}`} 
                className="w-full h-full object-cover rounded-lg transition-transform duration-700 hover:scale-110"
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Text content with animations */}
      <div className="container-custom relative z-10 h-full flex flex-col justify-center pt-24">
        <div className={`max-w-2xl text-white transition-all duration-1000 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl font-bold mb-4 relative">
            <span className="relative inline-block">
              Find 
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-green-300 to-transparent transform scale-x-0 origin-left transition-transform duration-1000 delay-300" style={{ animationDelay: '0.3s', transform: textVisible ? 'scaleX(1)' : 'scaleX(0)' }}></span>
            </span>
            {' '}
            <span className="relative inline-block">
              yourself
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-green-300 to-transparent transform scale-x-0 origin-left transition-transform duration-1000 delay-500" style={{ animationDelay: '0.5s', transform: textVisible ? 'scaleX(1)' : 'scaleX(0)' }}></span>
            </span>
            <br />
            <span className="relative inline-block">
              a cozy 
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-green-300 to-transparent transform scale-x-0 origin-left transition-transform duration-1000 delay-700" style={{ animationDelay: '0.7s', transform: textVisible ? 'scaleX(1)' : 'scaleX(0)' }}></span>
            </span>
            {' '}
            <span className="relative inline-block">
              cabin
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-green-300 to-transparent transform scale-x-0 origin-left transition-transform duration-1000 delay-900" style={{ animationDelay: '0.9s', transform: textVisible ? 'scaleX(1)' : 'scaleX(0)' }}></span>
            </span>
          </h1>
          <p className={`text-xl mb-6 transition-all duration-1000 delay-700 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            Remote locations for unforgettable getaways.<br />
            <span className="typewriter">Distant, cozy, calm.</span>
          </p>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        .rounded-lg {
          border-radius: 0.5rem;
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
        }
        
        .transition-transform {
          transition-property: transform;
        }
        
        .duration-2000 {
          transition-duration: 2000ms;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        
        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: float linear infinite, pulse 3s ease-in-out infinite;
        }
        
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
        
        .typewriter {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          animation: typewriter 3s steps(20, end) 1.2s forwards;
          width: 0;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
