'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useProjects, useTasks, updateWidget, updateDashboardLayout } from '../lib/store';
import { cn, formatDate } from '../lib/utils';
import { DashboardWidget } from '../types';
import { Menu, X, Grid3X3, Maximize2, Minimize2 } from 'lucide-react';

const DashboardView = () => {
  const projects = useProjects();
  const tasks = useTasks();
  const [components, setComponents] = useState<DashboardWidget[]>([
    { id: '1', type: 'stats', title: 'Project Overview', position: { x: 30, y: 80 }, size: { width: 300, height: 150 }, visible: true },
    { id: '2', type: 'quickActions', title: 'Quick Actions', position: { x: 400, y: 80 }, size: { width: 300, height: 150 }, visible: true },
    { id: '3', type: 'engineering', title: 'Engineering Metrics', position: { x: 30, y: 250 }, size: { width: 300, height: 200 }, visible: true },
    { id: '4', type: 'procurement', title: 'Procurement Status', position: { x: 400, y: 250 }, size: { width: 300, height: 200 }, visible: true },
    { id: '5', type: 'estimating', title: 'Cost Estimates', position: { x: 30, y: 470 }, size: { width: 300, height: 180 }, visible: true },
    { id: '6', type: 'construction', title: 'Construction Progress', position: { x: 400, y: 470 }, size: { width: 300, height: 180 }, visible: true },
  ]);

  // State management
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [resizingComponent, setResizingComponent] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeOffset, setResizeOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDraggingMenu, setIsDraggingMenu] = useState(false);
  const [menuDragOffset, setMenuDragOffset] = useState({ x: 0, y: 0 });
  const [menuDirection, setMenuDirection] = useState<'up' | 'down' | 'left' | 'right'>('up');
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [bouncingComponent, setBouncingComponent] = useState<string | null>(null);
  const [dashboardSize, setDashboardSize] = useState({ width: 0, height: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs
  const dashboardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Menu position state
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  // Optimized collision detection using spatial partitioning
  const collisionGrid = useMemo(() => {
    const grid: Map<string, string[]> = new Map();
    const cellSize = 50; // 50px grid cells for collision detection
    
    components.forEach(component => {
      if (!component.visible) return;
      
      const startX = Math.floor(component.position.x / cellSize);
      const endX = Math.floor((component.position.x + component.size.width) / cellSize);
      const startY = Math.floor(component.position.y / cellSize);
      const endY = Math.floor((component.position.y + component.size.height) / cellSize);
      
      for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
          const key = `${x},${y}`;
          if (!grid.has(key)) grid.set(key, []);
          grid.get(key)!.push(component.id);
        }
      }
    });
    
    return grid;
  }, [components]);

  // Enhanced collision detection
  const isColliding = useCallback((rect1: { x: number; y: number; width: number; height: number }, 
                                  rect2: { x: number; y: number; width: number; height: number }) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }, []);

  // Check collision with all components using spatial partitioning
  const wouldCollide = useCallback((componentId: string, newPosition: { x: number; y: number }, size: { width: number; height: number }) => {
    const newRect = { x: newPosition.x, y: newPosition.y, width: size.width, height: size.height };
    
    return components.some(comp => 
      comp.id !== componentId && 
      comp.visible && 
      isColliding(newRect, { x: comp.position.x, y: comp.position.y, width: comp.size.width, height: comp.size.height })
    );
  }, [components, isColliding]);

  // Advanced safe position finder with multiple strategies
  const findSafePosition = useCallback((componentId: string, desiredPosition: { x: number; y: number }, size: { width: number; height: number }) => {
    if (!wouldCollide(componentId, desiredPosition, size)) {
      return desiredPosition;
    }

    // Strategy 1: Try positions around the desired position in expanding circles
    const positions: Array<{ x: number; y: number }> = [];
    const maxRadius = Math.max(dashboardSize.width, dashboardSize.height);
    
    for (let radius = 50; radius <= maxRadius; radius += 50) {
      for (let angle = 0; angle < 360; angle += 45) {
        const rad = (angle * Math.PI) / 180;
        const x = desiredPosition.x + Math.cos(rad) * radius;
        const y = desiredPosition.y + Math.sin(rad) * radius;
        
        positions.push({ x, y });
      }
    }

    // Strategy 2: Try grid-aligned positions
    for (let x = 0; x < dashboardSize.width - size.width; x += gridSize) {
      for (let y = 0; y < dashboardSize.height - size.height; y += gridSize) {
        positions.push({ x, y });
      }
    }

    // Strategy 3: Try corners and edges
    const corners = [
      { x: 20, y: 80 }, // Top-left
      { x: dashboardSize.width - size.width - 20, y: 80 }, // Top-right
      { x: 20, y: dashboardSize.height - size.height - 20 }, // Bottom-left
      { x: dashboardSize.width - size.width - 20, y: dashboardSize.height - size.height - 20 }, // Bottom-right
    ];
    positions.push(...corners);

    // Find the first safe position
    for (const pos of positions) {
      const boundedPos = {
        x: Math.max(20, Math.min(pos.x, dashboardSize.width - size.width - 20)),
        y: Math.max(80, Math.min(pos.y, dashboardSize.height - size.height - 20))
      };
      
      if (!wouldCollide(componentId, boundedPos, size)) {
        return boundedPos;
      }
    }

    // Fallback: return original position bounded
    return {
      x: Math.max(20, Math.min(desiredPosition.x, dashboardSize.width - size.width - 20)),
      y: Math.max(80, Math.min(desiredPosition.y, dashboardSize.height - size.height - 20))
    };
  }, [wouldCollide, dashboardSize, gridSize]);

  // Snap position to grid
  const snapPositionToGrid = useCallback((position: { x: number; y: number }) => {
    if (!snapToGrid) return position;
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize
    };
  }, [snapToGrid, gridSize]);

  // Snap size to grid
  const snapSizeToGrid = useCallback((size: { width: number; height: number }) => {
    if (!snapToGrid) return size;
    return {
      width: Math.max(200, Math.round(size.width / gridSize) * gridSize),
      height: Math.max(150, Math.round(size.height / gridSize) * gridSize)
    };
  }, [snapToGrid, gridSize]);

  // Calculate optimal menu direction
  const calculateMenuDirection = useCallback((menuX: number, menuY: number) => {
    if (!dashboardRef.current) return 'up';
    
    const spaceAbove = menuY;
    const spaceBelow = dashboardSize.height - menuY;
    const spaceLeft = menuX;
    const spaceRight = dashboardSize.width - menuX;
    
    // Force direction based on position
    if (menuY > dashboardSize.height * 0.8) return 'up';
    if (menuY < dashboardSize.height * 0.2) return 'down';
    if (menuX < dashboardSize.width * 0.2) return 'right';
    if (menuX > dashboardSize.width * 0.8) return 'left';
    
    // Choose direction with most space
    const directions = [
      { dir: 'up', space: spaceAbove },
      { dir: 'down', space: spaceBelow },
      { dir: 'left', space: spaceLeft },
      { dir: 'right', space: spaceRight }
    ];
    
    directions.sort((a, b) => b.space - a.space);
    return directions[0].dir as 'up' | 'down' | 'left' | 'right';
  }, [dashboardSize]);

  // Responsive component distribution
  const distributeComponents = useCallback(() => {
    const margin = 20;
    const minComponentWidth = 280;
    const minComponentHeight = 180;
    
    // Calculate optimal grid based on dashboard size
    const availableWidth = dashboardSize.width - 40;
    const availableHeight = dashboardSize.height - 100;
    
    // Determine grid columns based on available width
    let columns = Math.max(1, Math.floor(availableWidth / (minComponentWidth + margin)));
    let rows = Math.ceil(components.length / columns);
    
    // Adjust if we need more rows
    if (rows * (minComponentHeight + margin) > availableHeight) {
      rows = Math.max(1, Math.floor(availableHeight / (minComponentHeight + margin)));
      columns = Math.ceil(components.length / rows);
    }
    
    // Calculate component dimensions
    const componentWidth = Math.max(minComponentWidth, (availableWidth - (columns - 1) * margin) / columns);
    const componentHeight = Math.max(minComponentHeight, (availableHeight - (rows - 1) * margin) / rows);
    
    const newPositions: Array<{ x: number; y: number }> = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        if (index < components.length) {
          newPositions.push({
            x: 20 + col * (componentWidth + margin),
            y: 80 + row * (componentHeight + margin)
          });
        }
      }
    }
    
    setComponents(prev => prev.map((comp, index) => ({
      ...comp,
      position: newPositions[index] || comp.position,
      size: { width: componentWidth, height: componentHeight }
    })));
  }, [components.length, dashboardSize]);

  // Initialize dashboard size and position
  useEffect(() => {
    const updateDashboardSize = () => {
      if (dashboardRef.current) {
        const rect = dashboardRef.current.getBoundingClientRect();
        setDashboardSize({ width: rect.width, height: rect.height });
        
        // Update menu position
        const newPosition = {
          x: rect.width - 80,
          y: rect.height - 80
        };
        setMenuPosition(newPosition);
        setMenuDirection(calculateMenuDirection(newPosition.x, newPosition.y));
      }
    };

    // Set up ResizeObserver for better performance
    if (dashboardRef.current) {
      resizeObserverRef.current = new ResizeObserver(updateDashboardSize);
      resizeObserverRef.current.observe(dashboardRef.current);
    }

    // Initial size update
    updateDashboardSize();
    
    // Distribute components after size is set
    setTimeout(distributeComponents, 100);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [distributeComponents, calculateMenuDirection]);

  // Mouse event handlers
  const handleMenuMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const dragTimer = setTimeout(() => {
      setIsDraggingMenu(true);
      setMenuDragOffset({
        x: e.clientX - menuPosition.x,
        y: e.clientY - menuPosition.y
      });
    }, 150);
    
    const handleMouseUp = () => {
      clearTimeout(dragTimer);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mouseup', handleMouseUp);
  }, [menuPosition]);

  const handleMenuClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isDraggingMenu) {
      setIsMenuOpen(!isMenuOpen);
    }
  }, [isDraggingMenu, isMenuOpen]);

  const handleMouseDown = useCallback((e: React.MouseEvent, componentId: string, action: 'drag' | 'resize' = 'drag') => {
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
  }, [components]);

  // Mouse move handler with collision detection
  const handleMouseMove = useCallback((e: MouseEvent) => {
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
          x: Math.max(0, Math.min(desiredPosition.x, dashboardSize.width - component.size.width)),
          y: Math.max(0, Math.min(desiredPosition.y, dashboardSize.height - component.size.height))
        };

        const snappedPosition = snapPositionToGrid(constrainedPosition);
        
        setComponents(prev => prev.map(comp => 
          comp.id === draggedComponent 
            ? { ...comp, position: snappedPosition }
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
        
        const newSize = snapSizeToGrid({ width: newWidth, height: newHeight });
        
        // Check collision and find safe position if needed
        if (!wouldCollide(resizingComponent, component.position, newSize)) {
          setComponents(prev => prev.map(comp => 
            comp.id === resizingComponent 
              ? { ...comp, size: newSize }
              : comp
          ));
        } else {
          const safePosition = findSafePosition(resizingComponent, component.position, newSize);
          if (safePosition.x !== component.position.x || safePosition.y !== component.position.y) {
            setBouncingComponent(resizingComponent);
            setComponents(prev => prev.map(comp => 
              comp.id === resizingComponent 
                ? { ...comp, size: newSize, position: safePosition }
                : comp
            ));
            setTimeout(() => setBouncingComponent(null), 300);
          }
        }
      }
    }

    if (isDraggingMenu) {
      const newX = e.clientX - menuDragOffset.x;
      const newY = e.clientY - menuDragOffset.y;
      
      const constrainedX = Math.max(20, Math.min(dashboardSize.width - 80, newX));
      const constrainedY = Math.max(20, Math.min(dashboardSize.height - 80, newY));
      
      const newPosition = { x: constrainedX, y: constrainedY };
      setMenuPosition(newPosition);
      setMenuDirection(calculateMenuDirection(constrainedX, constrainedY));
    }
  }, [draggedComponent, isDragging, isResizing, isDraggingMenu, components, dragOffset, resizeOffset, menuDragOffset, dashboardSize, snapPositionToGrid, snapSizeToGrid, wouldCollide, findSafePosition, calculateMenuDirection]);

  // Mouse up handler with collision resolution
  const handleMouseUp = useCallback(() => {
    if (isDragging && draggedComponent) {
      const component = components.find(c => c.id === draggedComponent);
      if (component) {
        const currentPosition = component.position;
        const safePosition = findSafePosition(draggedComponent, currentPosition, component.size);
        
        if (currentPosition.x !== safePosition.x || currentPosition.y !== safePosition.y) {
          setBouncingComponent(draggedComponent);
          setComponents(prev => prev.map(comp => 
            comp.id === draggedComponent 
              ? { ...comp, position: safePosition }
              : comp
          ));
          
          setTimeout(() => setBouncingComponent(null), 300);
        }
      }
      
      setDraggedComponent(null);
      setIsDragging(false);
    }
    
    if (isResizing) {
      setResizingComponent(null);
      setIsResizing(false);
    }
    
    if (isDraggingMenu) {
      setIsDraggingMenu(false);
    }
  }, [isDragging, isResizing, isDraggingMenu, draggedComponent, components, findSafePosition]);

  // Event listeners
  useEffect(() => {
    if (isDragging || isResizing || isDraggingMenu) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, isDraggingMenu, handleMouseMove, handleMouseUp]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  // Toggle component visibility
  const toggleComponent = useCallback((componentId: string) => {
    setComponents(prev => prev.map(comp => 
      comp.id === componentId 
        ? { ...comp, visible: !comp.visible }
        : comp
    ));
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Grid size controls
  const changeGridSize = useCallback((newSize: number) => {
    setGridSize(newSize);
  }, []);

  // Component render functions (keeping existing ones for brevity)
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
      <button className="p-3 glass-weak rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-center">
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

  const renderEngineeringMetrics = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 glass-weak rounded-lg text-center">
          <div className="text-primary font-medium text-sm">Equipment</div>
          <div className="text-2xl font-bold text-primary">0</div>
          <div className="text-secondary text-xs">Items</div>
        </div>
        <div className="p-3 glass-weak rounded-lg text-center">
          <div className="text-primary font-medium text-sm">Piping</div>
          <div className="text-2xl font-bold text-primary">0</div>
          <div className="text-secondary text-xs">Systems</div>
        </div>
      </div>
      <div className="p-3 glass-weak rounded-lg text-center">
        <div className="text-primary font-medium text-sm">Design Status</div>
        <div className="text-lg font-bold text-warning">Not Started</div>
        <div className="text-secondary text-xs">P&ID Design</div>
      </div>
    </div>
  );

  const renderProcurementStatus = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 glass-weak rounded-lg text-center">
          <div className="text-primary font-medium text-sm">Orders</div>
          <div className="text-2xl font-bold text-primary">0</div>
          <div className="text-secondary text-xs">Active</div>
        </div>
        <div className="p-3 glass-weak rounded-lg text-center">
          <div className="text-primary font-medium text-sm">Vendors</div>
          <div className="text-2xl font-bold text-primary">0</div>
          <div className="text-secondary text-xs">Registered</div>
        </div>
      </div>
      <div className="p-3 glass-weak rounded-lg text-center">
        <div className="text-primary font-medium text-sm">Status</div>
        <div className="text-lg font-bold text-warning">No Orders</div>
        <div className="text-secondary text-xs">Procurement</div>
      </div>
    </div>
  );

  const renderCostEstimates = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 glass-weak rounded-lg text-center">
          <div className="text-primary font-medium text-sm">Estimates</div>
          <div className="text-2xl font-bold text-primary">0</div>
          <div className="text-secondary text-xs">Created</div>
        </div>
        <div className="p-3 glass-weak rounded-lg text-center">
          <div className="text-primary font-medium text-sm">Total Value</div>
          <div className="text-2xl font-bold text-primary">$0</div>
          <div className="text-secondary text-xs">Estimated</div>
        </div>
      </div>
      <div className="p-3 glass-weak rounded-lg text-center">
        <div className="text-primary font-medium text-sm">Status</div>
        <div className="text-lg font-bold text-warning">No Estimates</div>
        <div className="text-secondary text-xs">Cost Planning</div>
      </div>
    </div>
  );

  const renderConstructionProgress = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 glass-weak rounded-lg text-center">
          <div className="text-primary font-medium text-sm">Progress</div>
          <div className="text-2xl font-bold text-primary">0%</div>
          <div className="text-secondary text-xs">Overall</div>
        </div>
        <div className="p-3 glass-weak rounded-lg text-center">
          <div className="text-primary font-medium text-sm">Tasks</div>
          <div className="text-2xl font-bold text-primary">0</div>
          <div className="text-secondary text-xs">Active</div>
        </div>
      </div>
      <div className="p-3 glass-weak rounded-lg text-center">
        <div className="text-primary font-medium text-sm">Status</div>
        <div className="text-lg font-bold text-warning">Not Started</div>
        <div className="text-secondary text-xs">Construction</div>
      </div>
    </div>
  );

  // Component renderer
  const renderComponent = useCallback((component: DashboardWidget) => {
    if (!component.visible) return null;

    let content;
    switch (component.type) {
      case 'stats': content = renderStats(); break;
      case 'quickActions': content = renderQuickActions(); break;
      case 'engineering': content = renderEngineeringMetrics(); break;
      case 'procurement': content = renderProcurementStatus(); break;
      case 'estimating': content = renderCostEstimates(); break;
      case 'construction': content = renderConstructionProgress(); break;
      default: content = <div>Unknown component type: {component.type}</div>;
    }

    return (
      <div
        key={component.id}
        className={cn(
          "absolute glass rounded-xl p-4 transition-all duration-300 ease-out shadow-lg",
          isDragging && draggedComponent === component.id ? 'cursor-grabbing z-50' : 'cursor-grab z-10',
          bouncingComponent === component.id ? 'animate-bounce' : '',
          isFullscreen ? 'border-2 border-primary/20' : ''
        )}
        style={{
          left: component.position.x,
          top: component.position.y,
          width: component.size.width,
          height: component.size.height,
          userSelect: 'none'
        }}
        onMouseDown={(e) => handleMouseDown(e, component.id, 'drag')}
      >
        {/* Header with controls */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-primary font-medium text-sm truncate">{component.title}</h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleComponent(component.id);
              }}
              className="text-tertiary hover:text-primary text-xs px-1.5 py-0.5 rounded hover:bg-glass-200 transition-colors"
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
  }, [isDragging, draggedComponent, bouncingComponent, isFullscreen, handleMouseDown, toggleComponent, renderStats, renderQuickActions, renderEngineeringMetrics, renderProcurementStatus, renderCostEstimates, renderConstructionProgress]);

  return (
    <div className={cn("h-full w-full relative transition-all duration-300", isFullscreen ? "fixed inset-0 z-50 bg-glass-weak" : "")}>
      {/* Dashboard Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
        <button
          onClick={toggleFullscreen}
          className="glass rounded-lg p-2 hover:bg-glass-200 transition-all duration-200"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-primary" /> : <Maximize2 className="w-4 h-4 text-primary" />}
        </button>
        <button
          onClick={() => setSnapToGrid(!snapToGrid)}
          className={cn(
            "glass rounded-lg p-2 transition-all duration-200",
            snapToGrid ? "bg-glass-200 text-primary" : "text-tertiary hover:text-primary hover:bg-glass-200"
          )}
          title={`Grid Snap: ${snapToGrid ? 'ON' : 'OFF'}`}
        >
          <Grid3X3 className="w-4 h-4" />
        </button>
      </div>

      {/* Draggable Components */}
      <div 
        ref={dashboardRef}
        className="relative w-full h-full bg-glass-weak overflow-hidden"
      >
        {/* Grid Lines */}
        {snapToGrid && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Vertical grid lines */}
            {Array.from({ length: Math.floor(dashboardSize.width / gridSize) + 1 }, (_, i) => (
              <div
                key={`v-${i}`}
                className="absolute w-px h-full bg-glass-300 opacity-20"
                style={{ left: i * gridSize }}
              />
            ))}
            {/* Horizontal grid lines */}
            {Array.from({ length: Math.floor(dashboardSize.height / gridSize) + 1 }, (_, i) => (
              <div
                key={`h-${i}`}
                className="absolute h-px w-full bg-glass-300 opacity-20"
                style={{ top: i * gridSize }}
              />
            ))}
          </div>
        )}
        
        {/* Dashboard Components */}
        {components.map(component => renderComponent(component))}
        
        {/* Empty State */}
        {components.filter(c => c.visible).length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-secondary text-lg">No components visible</p>
              <p className="text-tertiary text-sm">Use the hamburger menu to show components</p>
            </div>
          </div>
        )}

        {/* Movable Hamburger Menu */}
        <div
          ref={menuRef}
          className="absolute z-50"
          style={{
            left: menuPosition.x,
            top: menuPosition.y,
            cursor: isDraggingMenu ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMenuMouseDown}
          onClick={handleMenuClick}
        >
          {/* Hamburger Button */}
          <div className="glass rounded-full p-2 shadow-lg hover:bg-glass-200 transition-all duration-200">
            <Menu className="w-5 h-5 text-primary" />
          </div>

          {/* Menu Panel */}
          {isMenuOpen && (
            <div 
              className={cn(
                "absolute glass rounded-xl p-4 shadow-lg min-w-[300px] max-h-[500px] overflow-y-auto",
                menuDirection === 'up' && "bottom-full right-0 mb-2",
                menuDirection === 'down' && "top-full right-0 mt-2",
                menuDirection === 'left' && "right-full top-0 mr-2",
                menuDirection === 'right' && "left-full top-0 ml-2"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-primary">Dashboard Components</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                  }}
                  className="text-tertiary hover:text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                {components.map(component => (
                  <button
                    key={component.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComponent(component.id);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-ring",
                      component.visible
                        ? 'glass bg-glass-200 text-primary'
                        : 'glass-weak text-secondary hover:text-primary hover:bg-glass-200'
                    )}
                  >
                    {component.title}
                  </button>
                ))}
              </div>

              {/* Grid Controls */}
              <div className="mt-4 pt-3 border-t border-glass-300">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-primary">Grid Size</h4>
                  <div className="flex items-center space-x-1">
                    {[10, 20, 30, 40].map(size => (
                      <button
                        key={size}
                        onClick={(e) => {
                          e.stopPropagation();
                          changeGridSize(size);
                        }}
                        className={cn(
                          "px-2 py-1 rounded text-xs transition-all duration-200",
                          gridSize === size 
                            ? "glass bg-glass-200 text-primary" 
                            : "glass-weak text-secondary hover:text-primary"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Layout Controls */}
              <div className="mt-3 pt-3 border-t border-glass-300">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-primary">Layout</h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      distributeComponents();
                    }}
                    className="px-2 py-1 rounded text-xs glass-weak text-secondary hover:text-primary transition-all duration-200"
                  >
                    Auto Arrange
                  </button>
                </div>
              </div>

              {/* Dashboard Info */}
              <div className="mt-3 pt-3 border-t border-glass-300">
                <div className="text-xs text-secondary space-y-1">
                  <p><strong>Size:</strong> {Math.round(dashboardSize.width)} × {Math.round(dashboardSize.height)}px</p>
                  <p><strong>Grid:</strong> {gridSize}px</p>
                  <p><strong>Components:</strong> {components.filter(c => c.visible).length}/{components.length}</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-3 pt-3 border-t border-glass-300">
                <h4 className="text-sm font-medium text-primary mb-2">Dashboard Tips</h4>
                <ul className="text-xs text-secondary space-y-1">
                  <li>• <strong>Click menu</strong> to open/close</li>
                  <li>• <strong>Click and hold</strong> to drag menu around</li>
                  <li>• <strong>Drag components</strong> by clicking and holding</li>
                  <li>• <strong>Resize components</strong> using the bottom-right handle</li>
                  <li>• <strong>Grid snap</strong> helps align components perfectly</li>
                  <li>• <strong>Fullscreen mode</strong> for immersive editing</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
