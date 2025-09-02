'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppContext } from './AppContext';

interface DashboardComponent {
  id: string;
  type: 'stats' | 'quickActions' | 'gettingStarted' | 'recentProjects' | 'upcomingTasks' | 'teamOverview';
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
}

export default function DashboardView() {
  const { projects, tasks } = useAppContext();
  const [components, setComponents] = useState<DashboardComponent[]>([
    { id: '1', type: 'stats', title: 'Key Metrics', position: { x: 20, y: 20 }, size: { width: 400, height: 200 }, visible: true },
    { id: '2', type: 'quickActions', title: 'Quick Actions', position: { x: 440, y: 20 }, size: { width: 300, height: 200 }, visible: true },
    { id: '3', type: 'gettingStarted', title: 'Getting Started', position: { x: 20, y: 240 }, size: { width: 400, height: 300 }, visible: true },
    { id: '4', type: 'recentProjects', title: 'Recent Projects', position: { x: 440, y: 240 }, size: { width: 300, height: 300 }, visible: true },
  ]);

  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [resizingComponent, setResizingComponent] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeOffset, setResizeOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Simple collision detection - check if two rectangles overlap
  const isColliding = (rect1: { x: number; y: number; width: number; height: number }, 
                       rect2: { x: number; y: number; width: number; height: number }) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  // Check if a position would cause collision with any other visible component
  const wouldCollide = (componentId: string, newPosition: { x: number; y: number }, size: { width: number; height: number }) => {
    const newRect = { x: newPosition.x, y: newPosition.y, width: size.width, height: size.height };
    
    return components.some(comp => 
      comp.id !== componentId && 
      comp.visible && 
      isColliding(newRect, { x: comp.position.x, y: comp.position.y, width: comp.size.width, height: comp.size.height })
    );
  };

  // Find a safe position that doesn't collide with other components
  const findSafePosition = (componentId: string, desiredPosition: { x: number; y: number }, size: { width: number; height: number }) => {
    // First try the desired position
    if (!wouldCollide(componentId, desiredPosition, size)) {
      return desiredPosition;
    }

    // If collision, try to find a safe position by moving in a grid pattern
    const gridSize = 20;
    const maxAttempts = 50;
    let attempts = 0;

    // Try positions in a spiral pattern around the desired position
    for (let radius = 1; radius <= 10 && attempts < maxAttempts; radius++) {
      for (let angle = 0; angle < 8; angle++) {
        attempts++;
        const x = desiredPosition.x + Math.cos(angle * Math.PI / 4) * radius * gridSize;
        const y = desiredPosition.y + Math.sin(angle * Math.PI / 4) * radius * gridSize;
        
        const testPosition = { x, y };
        
        // Ensure position is within bounds
        const boundedPosition = {
          x: Math.max(0, Math.min(x, 1200 - size.width)),
          y: Math.max(0, Math.min(y, 800 - size.height))
        };
        
        if (!wouldCollide(componentId, boundedPosition, size)) {
          return boundedPosition;
        }
      }
    }

    // If no safe position found, return the original position but constrained to bounds
    return {
      x: Math.max(0, Math.min(desiredPosition.x, 1200 - size.width)),
      y: Math.max(0, Math.min(desiredPosition.y, 800 - size.height))
    };
  };

  const handleMouseDown = (e: React.MouseEvent, componentId: string, action: 'drag' | 'resize' = 'drag') => {
    e.preventDefault();
    e.stopPropagation();
    
    const component = components.find(c => c.id === componentId);
    if (!component) return;

    if (action === 'drag') {
      setDraggedComponent(componentId);
      setIsDragging(true);
      
      const dashboardRect = dashboardRef.current?.getBoundingClientRect();
      if (dashboardRect) {
        setDragOffset({
          x: e.clientX - dashboardRect.left - component.position.x,
          y: e.clientY - dashboardRect.top - component.position.y
        });
      }
    } else if (action === 'resize') {
      setResizingComponent(componentId);
      setIsResizing(true);
      
      const dashboardRect = dashboardRef.current?.getBoundingClientRect();
      if (dashboardRect) {
        setResizeOffset({
          x: e.clientX - dashboardRect.left - component.position.x - component.size.width,
          y: e.clientY - dashboardRect.top - component.position.y - component.size.height
        });
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggedComponent && isDragging && dashboardRef.current) {
      const dashboardRect = dashboardRef.current.getBoundingClientRect();
      const component = components.find(c => c.id === draggedComponent);
      
      if (component) {
        const desiredPosition = {
          x: e.clientX - dashboardRect.left - dragOffset.x,
          y: e.clientY - dashboardRect.top - dragOffset.y
        };

        // Constrain to dashboard bounds
        const constrainedPosition = {
          x: Math.max(0, Math.min(desiredPosition.x, 1200 - component.size.width)),
          y: Math.max(0, Math.min(desiredPosition.y, 800 - component.size.height))
        };

        // Find a safe position that doesn't collide
        const safePosition = findSafePosition(draggedComponent, constrainedPosition, component.size);
        
        setComponents(prev => prev.map(comp => 
          comp.id === draggedComponent 
            ? { ...comp, position: safePosition }
            : comp
        ));
      }
    }

    if (resizingComponent && isResizing && dashboardRef.current) {
      const dashboardRect = dashboardRef.current.getBoundingClientRect();
      const component = components.find(c => c.id === resizingComponent);
      
      if (component) {
        const newWidth = Math.max(200, Math.min(600, e.clientX - dashboardRect.left - component.position.x - resizeOffset.x));
        const newHeight = Math.max(150, Math.min(500, e.clientY - dashboardRect.top - component.position.y - resizeOffset.y));
        
        const newSize = { width: newWidth, height: newHeight };
        
        // Check if new size would cause collision
        if (!wouldCollide(resizingComponent, component.position, newSize)) {
          setComponents(prev => prev.map(comp => 
            comp.id === resizingComponent 
              ? { ...comp, size: newSize }
              : comp
          ));
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setDraggedComponent(null);
      setIsDragging(false);
    }
    if (isResizing) {
      setResizingComponent(null);
      setIsResizing(false);
    }
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, draggedComponent, resizingComponent, dragOffset, resizeOffset]);

  const toggleComponent = (componentId: string) => {
    setComponents(prev => prev.map(comp => 
      comp.id === componentId 
        ? { ...comp, visible: !comp.visible }
        : comp
    ));
  };

  // Function to navigate to Project Management and open wizard
  const openProjectWizard = () => {
    // Find and click the Project Management button in the header
    const projectManagementButton = Array.from(document.querySelectorAll('button')).find(btn => 
      btn.textContent?.includes('Project Management')
    );
    
    if (projectManagementButton) {
      projectManagementButton.click();
      
      // Wait a moment for navigation, then open wizard
      setTimeout(() => {
        const wizardButton = Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent?.includes('🚀 Project Wizard')
        );
        
        if (wizardButton) {
          wizardButton.click();
        }
      }, 200);
    }
  };

  const renderStats = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 glass-weak rounded-lg text-center">
        <div className="text-primary font-medium">Active Projects</div>
        <div className="text-2xl font-bold text-primary">{projects.length}</div>
        <div className="text-secondary text-sm">
          {projects.length === 0 ? 'Create your first project' : `${projects.length} project${projects.length !== 1 ? 's' : ''} active`}
        </div>
      </div>
      <div className="p-4 glass-weak rounded-lg text-center">
        <div className="text-primary font-medium">Total Tasks</div>
        <div className="text-2xl font-bold text-primary">{tasks?.length || 0}</div>
        <div className="text-secondary text-sm">
          {!tasks || tasks.length === 0 ? 'Add tasks to projects' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} total`}
        </div>
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="grid grid-cols-2 gap-3">
      <button 
        onClick={openProjectWizard}
        className="p-3 glass-weak rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-center"
      >
        <span className="font-medium text-sm">Create Project</span>
      </button>
      <button className="p-3 glass-weak rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-center">
        <span className="font-medium text-sm">Add Equipment</span>
      </button>
      <button className="p-3 glass-weak rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-center">
        <span className="font-medium text-sm">New Order</span>
      </button>
      <button className="p-3 glass-weak rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-center">
        <span className="font-medium text-sm">Generate Report</span>
      </button>
    </div>
  );

  const renderGettingStarted = () => (
    <div className="space-y-4">
      <div className="p-3 glass-weak rounded-lg">
        <h3 className="text-primary font-medium mb-2">1. Create Your First Project</h3>
        <p className="text-secondary text-sm mb-3">Use the Project Wizard to create a complete project with templates</p>
        <button 
          onClick={openProjectWizard}
          className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-sm font-medium w-full"
        >
          🚀 Launch Project Wizard
        </button>
      </div>
      <div className="p-3 glass-weak rounded-lg">
        <h3 className="text-primary font-medium mb-2">2. Set Up Equipment</h3>
        <p className="text-secondary text-sm">Add equipment and assets in the Engineering module</p>
      </div>
      <div className="p-3 glass-weak rounded-lg">
        <h3 className="text-primary font-medium mb-2">3. Configure Procurement</h3>
        <p className="text-secondary text-sm">Set up vendors and procurement processes</p>
      </div>
    </div>
  );

  const renderRecentProjects = () => {
    if (projects.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-secondary">No projects yet</p>
          <p className="text-tertiary text-sm">Create your first project to see it here</p>
          <button 
            onClick={openProjectWizard}
            className="mt-4 px-6 py-3 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring"
          >
            🚀 Start Project Wizard
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {projects.slice(0, 3).map((project) => (
          <div key={project.id} className="p-3 glass-weak rounded-lg">
            <h4 className="text-primary font-medium text-sm mb-1">{project.name}</h4>
            <p className="text-secondary text-xs mb-2">{project.manager}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-tertiary">{project.status}</span>
              <span className="text-primary font-medium">{project.progress}%</span>
            </div>
            <div className="w-full bg-glass-200 rounded-full h-2 mt-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-200" 
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
        {projects.length > 3 && (
          <div className="text-center pt-2">
            <p className="text-tertiary text-xs">+{projects.length - 3} more projects</p>
          </div>
        )}
      </div>
    );
  };

  const renderUpcomingTasks = () => (
    <div className="text-center py-8">
      <p className="text-secondary">No tasks yet</p>
      <p className="text-tertiary text-sm">Add tasks to projects to see them here</p>
    </div>
  );

  const renderTeamOverview = () => (
    <div className="text-center py-8">
      <p className="text-secondary">No team members yet</p>
      <p className="text-tertiary text-sm">Add team members to projects to see them here</p>
    </div>
  );

  const renderComponent = (component: DashboardComponent) => {
    if (!component.visible) return null;

    let content;
    switch (component.type) {
      case 'stats':
        content = renderStats();
        break;
      case 'quickActions':
        content = renderQuickActions();
        break;
      case 'gettingStarted':
        content = renderGettingStarted();
        break;
      case 'recentProjects':
        content = renderRecentProjects();
        break;
      case 'upcomingTasks':
        content = renderUpcomingTasks();
        break;
      case 'teamOverview':
        content = renderTeamOverview();
        break;
      default:
        content = <div>Unknown component type</div>;
    }

    return (
      <div
        key={component.id}
        className={`absolute glass rounded-xl p-4 ${isDragging && draggedComponent === component.id ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          left: component.position.x,
          top: component.position.y,
          width: component.size.width,
          height: component.size.height,
          zIndex: (draggedComponent === component.id || resizingComponent === component.id) ? 1000 : 1,
          userSelect: 'none'
        }}
        onMouseDown={(e) => handleMouseDown(e, component.id, 'drag')}
      >
        {/* Header with controls */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-primary font-medium">{component.title}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleComponent(component.id);
              }}
              className="text-tertiary hover:text-primary text-sm px-2 py-1 rounded hover:bg-glass-200"
            >
              Hide
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-auto" style={{ height: component.size.height - 60 }}>
          {content}
        </div>

        {/* Resize handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100 transition-opacity"
          onMouseDown={(e) => handleMouseDown(e, component.id, 'resize')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-tertiary">
            <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM18 18H16V16H18V18ZM14 22H12V20H14V22ZM22 14H20V12H22V14Z"/>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="glass rounded-xl p-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Welcome to Innovari</h1>
        <p className="text-secondary">Engineering & Project Management Platform</p>
      </div>

      {/* Component Toggle Panel */}
      <div className="glass rounded-xl p-4">
        <h2 className="text-lg font-semibold text-primary mb-3">Dashboard Components</h2>
        <div className="flex flex-wrap gap-2">
          {components.map(component => (
            <button
              key={component.id}
              onClick={() => toggleComponent(component.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-ring ${
                component.visible
                  ? 'glass bg-glass-200 text-primary'
                  : 'glass-weak text-secondary hover:text-primary'
              }`}
            >
              {component.title}
            </button>
          ))}
        </div>
      </div>

      {/* Draggable Components */}
      <div 
        ref={dashboardRef}
        className="relative w-full h-[800px] border-2 border-dashed border-glass-300 rounded-lg"
        style={{ minHeight: '800px' }}
      >
        {components.map(component => renderComponent(component))}
        
        {components.filter(c => c.visible).length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-secondary text-lg">No components visible</p>
              <p className="text-tertiary text-sm">Use the toggle buttons above to show components</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="glass rounded-xl p-4">
        <h3 className="text-primary font-medium mb-2">Dashboard Tips</h3>
        <ul className="text-sm text-secondary space-y-1">
          <li>• <strong>Drag components</strong> by clicking and holding on any part of the component</li>
          <li>• <strong>Resize components</strong> by dragging the resize handle (bottom-right corner)</li>
          <li>• <strong>No overlap</strong> - components automatically avoid overlapping each other</li>
          <li>• <strong>Toggle visibility</strong> using the buttons above to show/hide components</li>
          <li>• <strong>Components remember</strong> their positions and sizes when you move them</li>
          <li>• <strong>Create projects</strong> in the Project Management module to populate the dashboard</li>
        </ul>
      </div>
    </div>
  );
}
