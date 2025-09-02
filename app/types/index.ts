// Core Types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// Task Management
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Task extends BaseEntity {
  name: string;
  phase: string;
  assignee: string;
  status: TaskStatus;
  duration: number;
  priority: TaskPriority;
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
  attachments: Attachment[];
  comments: Comment[];
  riskLevel: RiskLevel;
  cost: string;
  budget: string;
  milestone: boolean;
  criticalPath: boolean;
  slack: number;
  predecessors: string[];
  successors: string[];
}

export interface Comment extends BaseEntity {
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  attachments: Attachment[];
}

export interface Attachment extends BaseEntity {
  name: string;
  url: string;
  size: number;
  type: string;
}

// Project Management
export type ProjectStatus = 'Planning' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
export type ProjectPhase = 'Initiation' | 'Planning' | 'Execution' | 'Monitoring' | 'Closure';

export interface Project extends BaseEntity {
  name: string;
  status: ProjectStatus;
  progress: number;
  team: TeamMember[];
  budget: Budget;
  manager: string;
  priority: TaskPriority;
  phase: ProjectPhase;
  description: string;
  objectives: string[];
  startDate: string;
  endDate: string;
  budgetBreakdown: BudgetBreakdown;
  risks: Risk[];
  stakeholders: Stakeholder[];
}

export interface Budget {
  total: string;
  currency: string;
  breakdown: BudgetBreakdown;
}

export interface BudgetBreakdown {
  labor: string;
  materials: string;
  equipment: string;
  indirect: string;
  contingency: string;
}

export interface TeamMember extends BaseEntity {
  name: string;
  role: string;
  email: string;
  phone?: string;
  avatar?: string;
  skills: string[];
  availability: number; // percentage
}

export interface Risk extends BaseEntity {
  description: string;
  probability: number;
  impact: RiskLevel;
  mitigation: string;
  owner: string;
}

export interface Stakeholder extends BaseEntity {
  name: string;
  role: string;
  influence: 'High' | 'Medium' | 'Low';
  interest: 'High' | 'Medium' | 'Low';
  contact: string;
}

// Engineering Module
export interface Equipment extends BaseEntity {
  name: string;
  type: EquipmentType;
  specifications: Record<string, any>;
  location: string;
  status: EquipmentStatus;
  maintenanceSchedule: MaintenanceSchedule;
  cost: string;
  supplier: string;
  warranty: string;
}

export type EquipmentType = 'Pump' | 'Valve' | 'Tank' | 'Compressor' | 'Heat Exchanger' | 'Other';
export type EquipmentStatus = 'Operational' | 'Maintenance' | 'Out of Service' | 'Retired';

export interface MaintenanceSchedule {
  lastMaintenance: string;
  nextMaintenance: string;
  frequency: string;
  type: string;
}

// Procurement Module
export interface PurchaseOrder extends BaseEntity {
  poNumber: string;
  supplier: Supplier;
  items: PurchaseItem[];
  totalAmount: string;
  status: PurchaseOrderStatus;
  expectedDelivery: string;
  actualDelivery?: string;
  notes: string;
}

export type PurchaseOrderStatus = 'Draft' | 'Submitted' | 'Approved' | 'Ordered' | 'Received' | 'Closed';

export interface Supplier extends BaseEntity {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  categories: string[];
}

export interface PurchaseItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  specifications?: Record<string, any>;
}

// EPC Module
export interface EPCMilestone extends BaseEntity {
  name: string;
  description: string;
  targetDate: string;
  actualDate?: string;
  status: MilestoneStatus;
  deliverables: string[];
  dependencies: string[];
}

export type MilestoneStatus = 'Pending' | 'In Progress' | 'Completed' | 'Delayed';

// Estimating Module
export interface Estimate extends BaseEntity {
  projectName: string;
  version: string;
  totalCost: string;
  breakdown: EstimateBreakdown;
  assumptions: string[];
  contingencies: string[];
  validUntil: string;
}

export interface EstimateBreakdown {
  materials: EstimateItem[];
  labor: EstimateItem[];
  equipment: EstimateItem[];
  overhead: EstimateItem[];
  profit: EstimateItem;
}

export interface EstimateItem {
  description: string;
  quantity: number;
  unit: string;
  unitCost: string;
  totalCost: string;
  notes?: string;
}

// UI State
export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  currentModule: string;
  notifications: Notification[];
  modals: ModalState;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ModalState {
  isOpen: boolean;
  type: string;
  data?: any;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'checkbox';
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// Dashboard Types
export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
  config?: Record<string, any>;
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
  gridSize: number;
  columns: number;
  rows: number;
}

