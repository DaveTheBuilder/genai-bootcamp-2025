import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Trophy, Clock, Home, Group, Settings } from 'lucide-react';

const navItems = [
  { icon: Home, name: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, name: 'Study Activities', path: '/study-activities' },
  { icon: Trophy, name: 'Words', path: '/words' },
  { icon: Group, name: 'Word Groups', path: '/groups' },
  { icon: Clock, name: 'Sessions', path: '/sessions' },
  { icon: Settings, name: 'Settings', path: '/settings' },
];

const NavigationMenu: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                  location.pathname === item.path
                    ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'
                }`}
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu; 