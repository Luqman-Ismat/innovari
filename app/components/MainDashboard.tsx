'use client';

import { Suspense, lazy, useState, useEffect, useCallback } from 'react';
import { useCurrentModule } from '../lib/store';
import { cn } from '../lib/utils';

// Lazy load modules for better performance
const DashboardView = lazy(() => import('./DashboardView'));
const EngineeringModule = lazy(() => import('./modules/EngineeringModule'));
const ProcurementModule = lazy(() => import('./modules/ProcurementModule'));
const EPCModule = lazy(() => import('./modules/EPCModule'));
const EstimatingModule = lazy(() => import('./modules/EstimatingModule'));
const ProjectManagementModule = lazy(() => import('./modules/ProjectManagementModule'));
const ConstructionModule = lazy(() => import('./modules/ConstructionModule'));
const ClientModule = lazy(() => import('./modules/ClientModule'));

// Enhanced loading component with better UX
const ModuleLoader = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    // Progressive loading text for better user experience
    const loadingSteps = [
      { text: 'Initializing...', delay: 0 },
      { text: 'Loading modules...', delay: 500 },
      { text: 'Preparing dashboard...', delay: 1000 },
      { text: 'Almost ready...', delay: 1500 }
    ];

    loadingSteps.forEach(({ text, delay }) => {
      setTimeout(() => setLoadingText(text), delay);
    });

    // Show loader for at least 2 seconds to prevent flickering
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showLoader) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="relative text-8xl font-bold leading-none text-primary mb-4">
            <span className="relative">
              i
              <span className="absolute text-8xl text-primary" style={{ top: '-0.8rem', left: '50%', transform: 'translateX(-50%)' }}>
                .
              </span>
            </span>
          </div>
          <div className="text-secondary text-lg mb-2">{loadingText}</div>
          <div className="w-32 h-1 bg-glass-200 rounded-full mx-auto">
            <div className="h-1 bg-primary rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 bg-primary mx-auto mb-4"></div>
        <p className="text-secondary text-lg mb-2">Preparing module...</p>
        <div className="w-32 h-1 bg-glass-200 rounded-full mx-auto">
          <div className="h-1 bg-primary rounded-full animate-pulse" style={{ width: '80%' }}></div>
        </div>
      </div>
    </div>
  );
};

// Module mapping with error boundaries
const moduleComponents = {
  dashboard: DashboardView,
  estimating: EstimatingModule,
  projects: ProjectManagementModule,
  engineering: EngineeringModule,
  epc: EPCModule,
  procurement: ProcurementModule,
  construction: ConstructionModule,
  client: ClientModule,
};

// Error boundary component for modules
const ModuleErrorBoundary = ({ children, moduleName }: { children: React.ReactNode; moduleName: string }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Module error:', error);
      setError(error.error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md mx-auto p-6 glass rounded-xl">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-primary mb-2">Module Error</h3>
          <p className="text-secondary text-sm mb-4">
            There was an error loading the {moduleName} module. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200"
          >
            Refresh Page
          </button>
          {error && (
            <details className="mt-4 text-left">
              <summary className="text-xs text-tertiary cursor-pointer">Error Details</summary>
              <pre className="text-xs text-red-400 mt-2 p-2 bg-red-900/20 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const MainDashboard = () => {
  const currentModule = useCurrentModule();
  const [isLoading, setIsLoading] = useState(true);
  
  const CurrentModuleComponent = moduleComponents[currentModule as keyof typeof moduleComponents] || DashboardView;

  // Handle module loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [currentModule]);

  // Memoize the component to prevent unnecessary re-renders
  const memoizedComponent = useCallback(() => {
    return (
      <ModuleErrorBoundary moduleName={currentModule}>
        <CurrentModuleComponent />
      </ModuleErrorBoundary>
    );
  }, [currentModule, CurrentModuleComponent]);

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden relative">
      <Suspense fallback={<ModuleLoader />}>
        <div className={cn(
          "animate-fade-in h-full transition-all duration-300",
          isLoading ? "opacity-50" : "opacity-100"
        )}>
          {memoizedComponent()}
        </div>
      </Suspense>
      
      {/* Performance indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-2 left-2 text-xs text-tertiary bg-glass-weak px-2 py-1 rounded opacity-60">
          {currentModule} module
        </div>
      )}
    </div>
  );
};

export default MainDashboard;
