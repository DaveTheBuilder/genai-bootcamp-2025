import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  LineChart, 
  ArrowLeftRight, 
  Clock, 
  Briefcase, 
  Settings as SettingsIcon,
  Home,
  Activity,
  Bot,
  Key
} from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/market', label: 'Market Data', icon: <LineChart className="w-5 h-5" /> },
    { path: '/orders', label: 'Order Execution', icon: <ArrowLeftRight className="w-5 h-5" /> },
    { path: '/trades', label: 'Trade History', icon: <Clock className="w-5 h-5" /> },
    { path: '/portfolio', label: 'Portfolio', icon: <Briefcase className="w-5 h-5" /> },
    { path: '/analysis', label: 'Analysis', icon: <Activity className="w-5 h-5" /> },
    { path: '/automation', label: 'Automation', icon: <Bot className="w-5 h-5" /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  // Development tools section
  const devTools = [
    { path: '/token-generator', label: 'Token Generator', icon: <Key className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-card h-screen w-64 fixed left-0 top-0 shadow-md">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">FTrader</h1>
      </div>
      <ul className="p-2">
        {navItems.map((item) => (
          <li key={item.path} className="mb-1">
            <Link
              to={item.path}
              className={`flex items-center p-3 rounded-md transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          </li>
        ))}
        
        {/* Development Tools Section */}
        {devTools.length > 0 && (
          <>
            <li className="mt-6 mb-2 px-3">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Development Tools
              </div>
            </li>
            {devTools.map((item) => (
              <li key={item.path} className="mb-1">
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
