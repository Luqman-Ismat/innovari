'use client';

import { useCurrentModule, setCurrentModule } from '../lib/store';
import { cn } from '../lib/utils';

const Sidebar = () => {
  const currentModule = useCurrentModule();

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'engineering', name: 'Engineering', icon: '⚙️' },
    { id: 'projects', name: 'Projects', icon: '📋' },
    { id: 'procurement', name: 'Procurement', icon: '🛒' },
    { id: 'epc', name: 'EPC', icon: '🏗️' },
    { id: 'estimating', name: 'Estimating', icon: '💰' },
  ];

  return (
    <aside className="w-64 bg-glass-strong h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-primary mb-4">Navigation</h2>
        <nav className="space-y-2">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setCurrentModule(module.id)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 focus-ring",
                currentModule === module.id
                  ? 'glass bg-glass-200 text-primary'
                  : 'glass-weak text-secondary hover:text-primary hover:bg-glass-200'
              )}
            >
              <span className="mr-3">{module.icon}</span>
              {module.name}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
