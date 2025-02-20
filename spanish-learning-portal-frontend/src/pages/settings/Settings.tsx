import React from 'react';
import { Moon, Sun } from 'lucide-react';
import Card from '../../components/shared/Card';
import { useTheme } from '../../hooks/useTheme';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Theme</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  Switch between light and dark mode
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current theme: {theme === 'dark' ? 'Dark' : 'Light'}
                </p>
              </div>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium mb-4">Study Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600 dark:text-indigo-400"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Show pronunciation hints
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600 dark:text-indigo-400"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Enable sound effects
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings; 