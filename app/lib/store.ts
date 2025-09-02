import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  Project, 
  Task, 
  UIState, 
  Notification, 
  ModalState,
  DashboardWidget,
  DashboardLayout 
} from '../types';

interface AppState {
  // UI State
  ui: UIState;
  
  // Data State
  projects: Project[];
  tasks: Task[];
  
  // Dashboard State
  dashboardLayout: DashboardLayout;
  
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentModule: (module: string) => void;
  
  // Project Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Notification Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Modal Actions
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
  
  // Dashboard Actions
  updateDashboardLayout: (layout: Partial<DashboardLayout>) => void;
  updateWidget: (id: string, updates: Partial<DashboardWidget>) => void;
  addWidget: (widget: Omit<DashboardWidget, 'id'>) => void;
  removeWidget: (id: string) => void;
  
  // Utility Actions
  saveToDatabase: () => Promise<void>;
  loadFromDatabase: () => Promise<void>;
}

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

const getTimestamp = () => new Date().toISOString();

const getCurrentUser = () => 'current-user'; // TODO: Replace with actual user system

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        ui: {
          theme: 'dark',
          sidebarOpen: false,
          currentModule: 'dashboard',
          notifications: [],
          modals: {
            isOpen: false,
            type: '',
            data: undefined,
          },
        },
        
        projects: [],
        tasks: [],
        
        dashboardLayout: {
          widgets: [
            { 
              id: '1', 
              type: 'stats', 
              title: 'Key Metrics', 
              position: { x: 20, y: 20 }, 
              size: { width: 400, height: 200 }, 
              visible: true 
            },
            { 
              id: '2', 
              type: 'quickActions', 
              title: 'Quick Actions', 
              position: { x: 440, y: 20 }, 
              size: { width: 300, height: 200 }, 
              visible: true 
            },
            { 
              id: '3', 
              type: 'gettingStarted', 
              title: 'Getting Started', 
              position: { x: 20, y: 240 }, 
              size: { width: 400, height: 300 }, 
              visible: true 
            },
            { 
              id: '4', 
              type: 'recentProjects', 
              title: 'Recent Projects', 
              position: { x: 440, y: 240 }, 
              size: { width: 300, height: 300 }, 
              visible: true 
            },
          ],
          gridSize: 20,
          columns: 12,
          rows: 8,
        },
        
        // UI Actions
        setTheme: (theme) => {
          set((state) => ({
            ui: { ...state.ui, theme }
          }));
          // Apply theme to document
          const root = document.documentElement;
          if (theme === 'dark') {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
          } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
          }
          localStorage.setItem('theme', theme);
        },
        
        toggleTheme: () => {
          const { ui, setTheme } = get();
          setTheme(ui.theme === 'light' ? 'dark' : 'light');
        },
        
        setSidebarOpen: (open) => {
          set((state) => ({
            ui: { ...state.ui, sidebarOpen: open }
          }));
        },
        
        setCurrentModule: (module) => {
          set((state) => ({
            ui: { ...state.ui, currentModule: module }
          }));
        },
        
        // Project Actions
        addProject: (projectData) => {
          const newProject: Project = {
            ...projectData,
            id: generateId(),
            createdAt: getTimestamp(),
            updatedAt: getTimestamp(),
            createdBy: getCurrentUser(),
            updatedBy: getCurrentUser(),
          };
          
          set((state) => ({
            projects: [...state.projects, newProject]
          }));
          
          // Add notification
          get().addNotification({
            type: 'success',
            title: 'Project Created',
            message: `Project "${projectData.name}" has been created successfully.`,
          });
        },
        
        updateProject: (id, updates) => {
          set((state) => ({
            projects: state.projects.map(project =>
              project.id === id
                ? { ...project, ...updates, updatedAt: getTimestamp(), updatedBy: getCurrentUser() }
                : project
            )
          }));
        },
        
        deleteProject: (id) => {
          set((state) => ({
            projects: state.projects.filter(project => project.id !== id)
          }));
        },
        
        // Task Actions
        addTask: (taskData) => {
          const newTask: Task = {
            ...taskData,
            id: generateId(),
            createdAt: getTimestamp(),
            updatedAt: getTimestamp(),
            createdBy: getCurrentUser(),
            updatedBy: getCurrentUser(),
          };
          
          set((state) => ({
            tasks: [...state.tasks, newTask]
          }));
        },
        
        updateTask: (id, updates) => {
          set((state) => ({
            tasks: state.tasks.map(task =>
              task.id === id
                ? { ...task, ...updates, updatedAt: getTimestamp(), updatedBy: getCurrentUser() }
                : task
            )
          }));
        },
        
        deleteTask: (id) => {
          set((state) => ({
            tasks: state.tasks.filter(task => task.id !== id)
          }));
        },
        
        // Notification Actions
        addNotification: (notificationData) => {
          const newNotification: Notification = {
            ...notificationData,
            id: generateId(),
            timestamp: getTimestamp(),
            read: false,
          };
          
          set((state) => ({
            ui: {
              ...state.ui,
              notifications: [newNotification, ...state.ui.notifications]
            }
          }));
        },
        
        markNotificationAsRead: (id) => {
          set((state) => ({
            ui: {
              ...state.ui,
              notifications: state.ui.notifications.map(notification =>
                notification.id === id
                  ? { ...notification, read: true }
                  : notification
              )
            }
          }));
        },
        
        removeNotification: (id) => {
          set((state) => ({
            ui: {
              ...state.ui,
              notifications: state.ui.notifications.filter(notification => notification.id !== id)
            }
          }));
        },
        
        clearAllNotifications: () => {
          set((state) => ({
            ui: { ...state.ui, notifications: [] }
          }));
        },
        
        // Modal Actions
        openModal: (type, data) => {
          set((state) => ({
            ui: {
              ...state.ui,
              modals: { isOpen: true, type, data }
            }
          }));
        },
        
        closeModal: () => {
          set((state) => ({
            ui: {
              ...state.ui,
              modals: { isOpen: false, type: '', data: undefined }
            }
          }));
        },
        
        // Dashboard Actions
        updateDashboardLayout: (layout) => {
          set((state) => ({
            dashboardLayout: { ...state.dashboardLayout, ...layout }
          }));
        },
        
        updateWidget: (id, updates) => {
          set((state) => ({
            dashboardLayout: {
              ...state.dashboardLayout,
              widgets: state.dashboardLayout.widgets.map(widget =>
                widget.id === id ? { ...widget, ...updates } : widget
              )
            }
          }));
        },
        
        addWidget: (widgetData) => {
          const newWidget: DashboardWidget = {
            ...widgetData,
            id: generateId(),
          };
          
          set((state) => ({
            dashboardLayout: {
              ...state.dashboardLayout,
              widgets: [...state.dashboardLayout.widgets, newWidget]
            }
          }));
        },
        
        removeWidget: (id) => {
          set((state) => ({
            dashboardLayout: {
              ...state.dashboardLayout,
              widgets: state.dashboardLayout.widgets.filter(widget => widget.id !== id)
            }
          }));
        },
        
        // Utility Actions
        saveToDatabase: async () => {
          const state = get();
          try {
            // TODO: Implement actual database save
            console.log('Saving to database...', { 
              projects: state.projects, 
              tasks: state.tasks,
              dashboardLayout: state.dashboardLayout 
            });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            get().addNotification({
              type: 'success',
              title: 'Data Saved',
              message: 'All data has been saved successfully.',
            });
          } catch (error) {
            get().addNotification({
              type: 'error',
              title: 'Save Failed',
              message: 'Failed to save data. Please try again.',
            });
            throw error;
          }
        },
        
        loadFromDatabase: async () => {
          try {
            // TODO: Implement actual database load
            console.log('Loading from database...');
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            get().addNotification({
              type: 'success',
              title: 'Data Loaded',
              message: 'Data has been loaded successfully.',
            });
          } catch (error) {
            get().addNotification({
              type: 'error',
              title: 'Load Failed',
              message: 'Failed to load data. Please try again.',
            });
            throw error;
          }
        },
      }),
      {
        name: 'innovari-store',
        partialize: (state) => ({
          ui: { theme: state.ui.theme },
          dashboardLayout: state.dashboardLayout,
        }),
      }
    ),
    {
      name: 'innovari-store',
    }
  )
);

// Selector hooks for better performance
export const useTheme = () => useAppStore((state) => state.ui.theme);
export const useSidebarOpen = () => useAppStore((state) => state.ui.sidebarOpen);
export const useCurrentModule = () => useAppStore((state) => state.ui.currentModule);
export const useProjects = () => useAppStore((state) => state.projects);
export const useTasks = () => useAppStore((state) => state.tasks);
export const useNotifications = () => useAppStore((state) => state.ui.notifications);
export const useModal = () => useAppStore((state) => state.ui.modals);
export const useDashboardLayout = () => useAppStore((state) => state.dashboardLayout);

// Action function exports
export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  setCurrentModule,
  addProject,
  updateProject,
  deleteProject,
  addTask,
  updateTask,
  deleteTask,
  addNotification,
  markNotificationAsRead,
  removeNotification,
  clearAllNotifications,
  openModal,
  closeModal,
  updateDashboardLayout,
  updateWidget,
  addWidget,
  removeWidget,
  saveToDatabase,
  loadFromDatabase,
} = useAppStore.getState();
