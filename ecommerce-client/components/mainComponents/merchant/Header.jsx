import React from 'react';
import { LogOut } from 'lucide-react';

const Header = ({ merchantProfile, handleLogout }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-2xl font-bold text-gray-900">Merchant Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{merchantProfile?.name}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <LogOut size={18} className="mr-1" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;