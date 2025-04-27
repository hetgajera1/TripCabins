import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCabins } from '../services/api';
import img1 from '../images/wood2.jpg';

const BestOffers = () => {
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCabins = async () => {
      try {
        setLoading(true);
        const data = await getCabins();
        setCabins(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching cabins:', err);
        setError('Failed to load cabins. Please try again later.');
        // Fallback to local data if API fails
        import('./cabinData').then(module => {
          setCabins(module.cabinData);
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCabins();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-semibold mb-8">Best offers</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error && cabins.length === 0) {
    return (
      <section className="bg-white py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-semibold mb-8">Best offers</h2>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16">
      <div className="container-custom">
        <h2 className="text-3xl font-semibold mb-8">Best offers</h2>
        <div className="overflow-x-auto">
          <div className="flex space-x-4">
            {cabins.map((cabin) => (
              <div key={cabin.id} className="min-w-[300px] bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={cabin.images && cabin.images.length > 0 ? cabin.images[0] : img1} 
                    alt={cabin.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 bg-white py-1 px-2 rounded-full text-sm font-semibold text-green-700">
                    {cabin.price}/night
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">{cabin.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{cabin.location}</p>
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="text-sm text-gray-600">{cabin.rating} ({cabin.reviews} reviews)</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{cabin.bedrooms} bedroom • {cabin.bathrooms} bathroom • Sleeps {cabin.sleeps}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{cabin.description}</p>
                  <div className="flex justify-between">
                    <Link to={`/cabin/${cabin.id}`} className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors">
                      More Info
                    </Link>
                    <Link to={`/cabin/${cabin.id}`} className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-8">
          <Link to="/cabins" className="bg-green-700 text-white px-6 py-3 rounded-md hover:bg-green-800 transition-colors">
            Check all cabins
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestOffers;
