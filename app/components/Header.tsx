'use client';

import { memo } from 'react';
import { 
  useCurrentModule, 
  useTheme, 
  setCurrentModule, 
  toggleTheme, 
  saveToDatabase 
} from '../lib/store';
import { cn } from '../lib/utils';
import { 
  Sun, 
  Moon, 
  Save, 
  User, 
  Bell, 
  Menu,
  BarChart3,
  Settings,
  FileText,
  ShoppingCart,
  Wrench,
  Calculator
} from 'lucide-react';

const modules = [
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
  { id: 'engineering', name: 'Engineering', icon: Wrench },
  { id: 'projects', name: 'Project Management', icon: FileText },
  { id: 'procurement', name: 'Procurement', icon: ShoppingCart },
  { id: 'epc', name: 'EPC Management', icon: Settings },
  { id: 'estimating', name: 'Estimating', icon: Calculator },
];

const Header = memo(() => {
  const currentModule = useCurrentModule();
  const theme = useTheme();

  const handleSave = async () => {
    try {
      await saveToDatabase();
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-glass-300 transition-all duration-300"
      role="banner"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-lg glass flex items-center justify-center">
            <span className="text-primary font-bold text-lg">I</span>
          </div>
          <h1 className="text-xl font-semibold text-primary">Innovari</h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-1" role="navigation" aria-label="Main navigation">
          {modules.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentModule(id)}
              className={cn(
                "px-4 py-2 rounded-lg transition-all duration-200 focus-ring font-medium flex items-center space-x-2",
                currentModule === id
                  ? 'glass bg-glass-200 text-primary'
                  : 'glass-weak hover:bg-glass-200 text-secondary hover:text-primary'
              )}
              aria-current={currentModule === id ? 'page' : undefined}
              title={`Navigate to ${name}`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{name}</span>
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg glass hover:bg-glass-200 transition-all duration-200 focus-ring flex items-center space-x-2"
            title="Save to Database"
            aria-label="Save all data to database"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Save</span>
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg glass hover:bg-glass-200 transition-all duration-200 focus-ring"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-primary" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
          </button>

          <button
            className="p-2 rounded-lg glass hover:bg-glass-200 transition-all duration-200 focus-ring"
            aria-label="View notifications"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-primary" />
          </button>
          
          <button 
            className="px-4 py-2 rounded-lg glass hover:bg-glass-200 transition-all duration-200 focus-ring flex items-center space-x-2"
            aria-label="Sign in to your account"
            title="Sign In"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Sign In</span>
          </button>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;

