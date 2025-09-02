'use client';

import { useAppContext } from './AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { currentModule, setCurrentModule } = useAppContext();

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', description: 'Main overview' },
    { id: 'engineering', name: 'Engineering', icon: '⚙️', description: 'P&ID Design & Piping' },
    { id: 'projects', name: 'Project Management', icon: '📋', description: 'Project planning & tracking' },
    { id: 'procurement', name: 'Procurement', icon: '🛒', description: 'Strategic sourcing' },
    { id: 'epc', name: 'EPC Management', icon: '🏗️', description: 'EPC project controls' },
    { id: 'estimating', name: 'Estimating', icon: '💰', description: 'Cost estimation' },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-full z-50 glass-strong border-r border-glass-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:top-0 w-64`}
      >
        <div className="p-6">
          {/* User Profile */}
          <div className="mb-8 p-4 glass rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                <span className="text-white font-semibold">U</span>
              </div>
              <div>
                <p className="text-white font-medium">User</p>
                <p className="text-glass-400 text-sm">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => {
                  setCurrentModule(module.id);
                  onClose();
                }}
                className={`w-full p-3 rounded-lg text-left transition-all duration-200 focus-ring ${
                  currentModule === module.id
                    ? 'glass bg-glass-200 text-white'
                    : 'glass-weak hover:bg-glass-200 text-white hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{module.icon}</span>
                  <div>
                    <p className="font-medium">{module.name}</p>
                    <p className="text-xs text-glass-400">{module.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-glass-200">
            <h3 className="text-white font-medium mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full p-2 glass rounded-lg text-white hover:bg-glass-200 transition-all duration-200 focus-ring text-sm">
                + New Project
              </button>
              <button className="w-full p-2 glass rounded-lg text-white hover:bg-glass-200 transition-all duration-200 focus-ring text-sm">
                + New Equipment
              </button>
              <button className="w-full p-2 glass rounded-lg text-white hover:bg-glass-200 transition-all duration-200 focus-ring text-sm">
                Import Data
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
