// components/Header.jsx
import React from 'react';

const Header = ({ currentPage, setCurrentPage, onLogout }) => {
  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'about', label: 'About' },
    { key: 'contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">SMTECH</span>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setCurrentPage(item.key)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === item.key
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex space-x-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              className={`flex-1 px-3 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                currentPage === item.key
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;