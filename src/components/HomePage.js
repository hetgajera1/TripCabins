import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import CabinCard from './CabinCard';
import ExperienceCard from './ExperienceCard';
import WhyYouNeedThis from './WhyYouNeedThis';
import hero1 from '../images/hero1.avif'
import hero2 from '../images/hero2.avif'
import hero3 from '../images/hero3.avif'
import hero4 from '../images/hero4.avif'
import hero5 from '../images/hero5.avif'
import main from '../images/main.jpg'
import Cabins from './Cabins';
import HeroSection from './HeroSection';
import ImageGallery from './ImageGallery';
import BestOffers from './BestOffers';
import Testimonials from './Testimonials';

const HomePage = () => {
  // Sample cabin data
  const cabins = [
    {
      id: 1,
      name: 'Rustic country retreat',
      location: 'HAMPSHIRE, ENGLAND',
      price: '$210',
      image: '/images/main.jpg',
      description: 'Step outside and take in the stunning views. Our cabin sits on a quiet and secluded property providing the perfect setting for a peaceful retreat.',
      rating: 4.7,
      reviews: 52
    },
    {
      id: 2,
      name: 'Cozy getaway cabin',
      location: 'NORFOLK, ENGLAND',
      price: '$312',
      image: '/images/cabin2.jpg',
      description: 'Step outside and take in the stunning views. Our cabin sits on a quiet and secluded property providing the perfect setting for a peaceful retreat.',
      rating: 4.8,
      reviews: 42
    },
    {
      id: 3,
      name: 'Rustic country retreat',
      location: 'HAMPSHIRE, ENGLAND',
      price: '$210',
      image: '/images/cabin3.jpg',
      description: 'Step outside and take in the stunning views. Our cabin sits on a quiet and secluded property providing the perfect setting for a personal retreat.',
      rating: 4.9,
      reviews: 52
    }
  ];

  // Sample experience data
  const experiences = [
    {
      id: 1,
      title: 'To Explore nature',
      category: 'FOR THOSE WHO LOVE',
      image: '/images/experience1.jpg',
      description: 'Discover your own personal beautiful itinerary – from the wonders of Snowdonia to the famous beauty of the Scottish Highlands.'
    },
    {
      id: 2,
      title: 'To Relax, rest & re-set',
      category: 'FOR THOSE WHO WANT',
      image: '/images/experience2.jpg',
      description: 'Experience a deep and holistic restoration through breathing exercises and relaxation with our Yoga inspired get away for you and the family.'
    },
    {
      id: 3,
      title: 'Four-legged friends',
      category: 'FOR THOSE WHO HAVE',
      image: '/images/experience3.jpg',
      description: 'Allow your dog to frolic outdoors, to put their dog in a kennel. So, lets keep the family together with our pet friendly cabins.'
    }
  ];

  return (
    <div className="relative">

      {/* Hero Section */}
      <HeroSection />

      <BestOffers />
      <Testimonials />

      {/* Image Gallery on Right Side */}
      {/* <ImageGallery /> */}

      {/* Spacing for search bar */}
      <div className="h-20"></div>
      <WhyYouNeedThis />
    </div>
  );
};

export default HomePage;
