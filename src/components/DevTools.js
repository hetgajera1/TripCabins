import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

const DevTools = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#031D20' }}>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-[#1e4e5f] mb-6">Development Tools</h2>
        
        {message && (
          <div className={`${message.includes('Error') ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'} px-4 py-3 rounded mb-4 border`}>
            {message}
          </div>
        )}
        
        <div className="space-y-6">
          <div className="border p-4 rounded-lg opacity-50 cursor-not-allowed">
            <h3 className="text-xl font-medium mb-2">Mock User Management (Disabled)</h3>
            <p className="text-gray-600 mb-4">
              Mock user management is no longer available. The app now uses real backend authentication and registration. If you encounter registration issues, please check your backend database or contact an admin.
            </p>
            <button 
              disabled
              className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
            >
              Clear Mock Users (Disabled)
            </button>
          </div>
          
          <div className="border p-4 rounded-lg">
            <h3 className="text-xl font-medium mb-2">Navigation</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => navigate('/')}
                className="bg-[#1e4e5f] text-white px-4 py-2 rounded hover:bg-[#0f3d4f] transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-[#4d6a2d] text-white px-4 py-2 rounded hover:bg-[#3d5324] transition-colors"
              >
                Register
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="bg-[#1e4e5f] text-white px-4 py-2 rounded hover:bg-[#0f3d4f] transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevTools;
