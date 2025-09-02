'use client';

import { Suspense, lazy } from 'react';
import { useCurrentModule } from '../lib/store';
import { cn } from '../lib/utils';

// Lazy load modules for better performance
const DashboardView = lazy(() => import('./DashboardView'));
const EngineeringModule = lazy(() => import('./modules/EngineeringModule'));
const ProcurementModule = lazy(() => import('./modules/ProcurementModule'));
const EPCModule = lazy(() => import('./modules/EPCModule'));
const EstimatingModule = lazy(() => import('./modules/EstimatingModule'));

// Loading component
const ModuleLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-secondary">Loading module...</p>
    </div>
  </div>
);

// Module mapping
const moduleComponents = {
  dashboard: DashboardView,
  engineering: EngineeringModule,
  projects: () => <div className="p-6 text-center"><p>Project Management module coming soon...</p></div>,
  procurement: ProcurementModule,
  epc: EPCModule,
  estimating: EstimatingModule,
};

const MainDashboard = () => {
  const currentModule = useCurrentModule();
  
  const CurrentModuleComponent = moduleComponents[currentModule as keyof typeof moduleComponents] || DashboardView;

  return (
    <div className="h-full overflow-auto p-6">
      <Suspense fallback={<ModuleLoader />}>
        <div className="animate-fade-in">
          <CurrentModuleComponent />
        </div>
      </Suspense>
    </div>
  );
};

export default MainDashboard;
