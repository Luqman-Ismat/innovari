'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Task {
  id: string;
  name: string;
  phase: string;
  assignee: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  duration: number;
  priority: 'High' | 'Medium' | 'Low';
  progress: number;
  description: string;
  startDate: string;
  endDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  estimatedHours: number;
  actualHours: number;
  dependencies: string[];
  subtasks: Task[];
  parentTaskId?: string;
  tags: string[];
  attachments: string[];
  comments: Comment[];
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  cost: string;
  budget: string;
  milestone: boolean;
  criticalPath: boolean;
  slack: number;
  predecessors: string[];
  successors: string[];
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  attachments: string[];
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  team: number;
  budget: string;
  manager: string;
  priority: string;
  phase: string;
  description: string;
  objectives: string[];
  startDate: string;
  endDate: string;
  budgetBreakdown: {
    labor: string;
    materials: string;
    equipment: string;
    indirect: string;
    contingency: string;
  };
}

interface AppContextType {
  currentModule: string;
  setCurrentModule: (module: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  saveToDatabase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Apply theme to document body
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const saveToDatabase = () => {
    // Placeholder for database save functionality
    console.log('Saving to database...', { projects, tasks });
    // TODO: Implement actual database save
    alert('Save functionality will be implemented later. Data is currently stored in memory.');
  };

  const value: AppContextType = {
    currentModule,
    setCurrentModule,
    theme,
    toggleTheme,
    sidebarOpen,
    setSidebarOpen,
    projects,
    setProjects,
    tasks,
    setTasks,
    saveToDatabase,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
