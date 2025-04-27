import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCabins } from '../services/api';
import { FaSearch, FaMapMarkerAlt, FaDollarSign, FaUsers, FaFilter, FaTimes } from 'react-icons/fa';

const Cabins = () => {
  const [cabins, setCabins] = useState([]);
  const [filteredCabins, setFilteredCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    guests: ''
  });
  
  // Unique locations for the filter dropdown
  const [locations, setLocations] = useState([]);
  
  useEffect(() => {
    const fetchCabins = async () => {
      try {
        setLoading(true);
        const data = await getCabins();
        setCabins(data);
        setFilteredCabins(data);
        
        // Extract unique locations for the filter dropdown
        const uniqueLocations = [...new Set(cabins.map(cabin => cabin.location.split(',')[0]))];
        setLocations(uniqueLocations);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching cabins:', err);
        setError('Failed to load cabins. Please try again later.');
        // Fallback to local data if API fails
        import('./cabinData').then(module => {
          const localData = module.cabinData;
          // console.log(localData)
          setCabins(localData);
          setFilteredCabins(localData);
          
          // Extract unique locations for the filter dropdown
          const uniqueLocations = [...new Set(localData.map(cabin => cabin.location.split(',')[0]))];
          setLocations(uniqueLocations);
        }); 
      } finally {
        setLoading(false);
      }
    };

    fetchCabins();
  }, []);
  
  // Apply filters when filter state changes
  useEffect(() => {
    applyFilters();
  }, [filters, cabins]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const applyFilters = () => {
    let filtered = [...cabins];
    
    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(cabin => 
        cabin.location.split(',')[0].toLowerCase() === filters.location.toLowerCase()
      );
    }
    
    // Filter by price range
    if (filters.minPrice) {
      filtered = filtered.filter(cabin => {
        // Extract numeric price value (remove currency symbol and commas)
        const price = parseFloat(cabin.price.replace(/[^\d.]/g, ''));
        return price >= parseFloat(filters.minPrice);
      });
    }
    
    if (filters.maxPrice) {
      filtered = filtered.filter(cabin => {
        // Extract numeric price value (remove currency symbol and commas)
        const price = parseFloat(cabin.price.replace(/[^\d.]/g, ''));
        return price <= parseFloat(filters.maxPrice);
      });
    }
    
    // Filter by number of guests
    if (filters.guests) {
      filtered = filtered.filter(cabin => cabin.sleeps >= parseInt(filters.guests, 10));
    }
    
    setFilteredCabins(filtered);
  };
  
  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      guests: ''
    });
    setFilteredCabins(cabins);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (loading) {
    return (
      <div className="w-full py-16 px-4 flex justify-center items-center" style={{ backgroundColor: '#031D20', minHeight: '60vh' }}>
        <div className="text-white text-xl">Loading cabins...</div>
      </div>
    );
  }

  if (error && cabins.length === 0) {
    return (
      <div className="w-full py-16 px-4" style={{ backgroundColor: '#031D20' }}>
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 text-white">Oops!</h1>
          <p className="text-white text-lg mb-8">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-16 px-4" style={{ backgroundColor: '#031D20' }}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Discover Our Cabins</h1>
          <button 
            onClick={toggleFilters}
            className="flex items-center bg-[#4d6a2d] hover:bg-[#3d5423] text-white py-2 px-4 rounded-lg transition-colors duration-300"
          >
            <FaFilter className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#1e4e5f]">Filter Cabins</h2>
              <button 
                onClick={clearFilters}
                className="text-[#4d6a2d] hover:text-[#3d5423] flex items-center"
              >
                <FaTimes className="mr-1" />
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location Filter */}
              <div>
                <label className="flex items-center text-gray-700 mb-2">
                  <FaMapMarkerAlt className="mr-2 text-[#4d6a2d]" />
                  Location
                </label>
                <select
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4d6a2d]"
                >
                  <option value="">All Locations</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Min Price Filter */}
              <div>
                <label className="flex items-center text-gray-700 mb-2">
                  <FaDollarSign className="mr-2 text-[#4d6a2d]" />
                  Min Price
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min Price"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4d6a2d]"
                />
              </div>
              
              {/* Max Price Filter */}
              <div>
                <label className="flex items-center text-gray-700 mb-2">
                  <FaDollarSign className="mr-2 text-[#4d6a2d]" />
                  Max Price
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max Price"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4d6a2d]"
                />
              </div>
              
              {/* Guests Filter */}
              <div>
                <label className="flex items-center text-gray-700 mb-2">
                  <FaUsers className="mr-2 text-[#4d6a2d]" />
                  Guests
                </label>
                <select
                  name="guests"
                  value={filters.guests}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4d6a2d]"
                >
                  <option value="">Any</option>
                  <option value="1">1+ guests</option>
                  <option value="2">2+ guests</option>
                  <option value="4">4+ guests</option>
                  <option value="6">6+ guests</option>
                  <option value="8">8+ guests</option>
                  <option value="10">10+ guests</option>
                </select>
              </div>
            </div>
            
            {/* Filter Results Summary */}
            <div className="mt-4 text-gray-700">
              <p>
                Showing {filteredCabins.length} of {cabins.length} cabins
                {(filters.location || filters.minPrice || filters.maxPrice || filters.guests) && (
                  <span> with applied filters</span>
                )}
              </p>
            </div>
          </div>
        )}
        
        {/* No Results Message */}
        {filteredCabins.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-center">
            <h2 className="text-xl font-bold text-[#1e4e5f] mb-2">No cabins match your filters</h2>
            <p className="text-gray-700 mb-4">Try adjusting your filter criteria to see more options.</p>
            <button
              onClick={clearFilters}
              className="bg-[#4d6a2d] hover:bg-[#3d5423] text-white py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Clear All Filters
            </button>
          </div>
        )}
        
        {/* Cabins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCabins.map((cabin) => (
            <Link to={`/cabin/${cabin.id}`} key={cabin.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64">
                <img 
                  src={cabin.images && cabin.images.length > 0 ? cabin.images[0] : 'https://images.unsplash.com/photo-1518780664697-55e3ad937233'} 
                  alt={cabin.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-[#4d6a2d] text-white rounded-lg px-2 py-1 text-sm font-bold">
                  {cabin.price}/night
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#1e4e5f] mb-2">{cabin.name}</h2>
                <p className="text-gray-600 mb-4">{cabin.location}</p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center bg-[#4d6a2d] text-white rounded-lg px-2 py-1 mr-2">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    {cabin.rating}
                  </div>
                  <span className="text-gray-600">{cabin.reviews} reviews</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <div>{cabin.bedrooms} Bedrooms</div>
                  <div>{cabin.bathrooms} Bathrooms</div>
                  <div>Sleeps {cabin.sleeps}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cabins;
