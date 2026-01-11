import React from 'react';
import { Menu } from 'lucide-react';
import { useStorageApp } from '../../../core/resource/store/storageApp';
import { useLocation } from 'react-router-dom';


const Header = () => {


  const {onMenuClick, activeView, onViewChange} = useStorageApp();

  const location = useLocation();
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">SecureAuto</h1>

              <ul className='flex justify-between ml-4'>
                <li className='mr-4'>Accueil</li>
                <li>Parametre</li>
              </ul>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default Header;