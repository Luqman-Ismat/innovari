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
import { Logo } from './LoadingLogo';
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
  { id: 'estimating', name: 'Estimating', icon: Calculator },
  { id: 'projects', name: 'Project Controls', icon: FileText },
  { id: 'engineering', name: 'Engineering', icon: Wrench },
  { id: 'epc', name: 'Document Controls', icon: Settings },
  { id: 'procurement', name: 'Procurement', icon: ShoppingCart },
  { id: 'construction', name: 'Construction', icon: Wrench },
  { id: 'client', name: 'Client', icon: User },
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
      className="fixed top-0 left-0 right-0 z-50 glass-strong transition-all duration-300"
      role="banner"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <Logo 
            isDarkMode={theme === 'dark'}
            isEditing={false}
            isItemSelected={false}
          />
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-1" role="navigation" aria-label="Main navigation">
          {modules.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentModule(id)}
              className={cn(
                "p-3 rounded-lg transition-all duration-200 focus-ring font-medium flex items-center justify-center",
                currentModule === id
                  ? 'glass bg-glass-200 text-primary'
                  : 'glass-weak hover:bg-glass-200 text-secondary hover:text-primary'
              )}
              aria-current={currentModule === id ? 'page' : undefined}
              title={name}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSave}
            className="p-3 rounded-lg glass hover:bg-glass-200 transition-all duration-200 focus-ring flex items-center justify-center"
            title="Save to Database"
            aria-label="Save all data to database"
          >
            <Save className="w-5 h-5" />
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-3 rounded-lg glass hover:bg-glass-200 transition-all duration-200 focus-ring"
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
            className="p-3 rounded-lg glass hover:bg-glass-200 transition-all duration-200 focus-ring"
            aria-label="View notifications"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-primary" />
          </button>
          
          <button 
            className="p-3 rounded-lg glass hover:bg-glass-200 transition-all duration-200 focus-ring flex items-center justify-center"
            aria-label="Sign in to your account"
            title="Sign In"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;

