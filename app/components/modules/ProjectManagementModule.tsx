'use client';

import { useState, useMemo } from 'react';
import { useProjects, useTasks, addProject, addTask } from '../../lib/store';
import { cn, formatDate, generateId } from '../../lib/utils';
import { Project, Task, ProjectStatus, ProjectPhase, TaskStatus, TaskPriority } from '../../types';
import { 
  Plus, 
  Calendar, 
  Users, 
  DollarSign, 
  Target, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Pause
} from 'lucide-react';

const ProjectManagementModule = () => {
  const projects = useProjects();
  const tasks = useTasks();
  const [activeTab, setActiveTab] = useState<'projects' | 'tasks' | 'overview'>('overview');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Computed values
  const projectStats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'Active').length;
    const completed = projects.filter(p => p.status === 'Completed').length;
    const onHold = projects.filter(p => p.status === 'On Hold').length;
    
    return { total, active, completed, onHold };
  }, [projects]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const notStarted = tasks.filter(t => t.status === 'Not Started').length;
    
    return { total, completed, inProgress, notStarted };
  }, [tasks]);

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    addProject(projectData);
    setShowProjectForm(false);
  };

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    addTask(taskData);
    setShowTaskForm(false);
  };

  const getStatusIcon = (status: ProjectStatus | TaskStatus) => {
    switch (status) {
      case 'Active':
      case 'In Progress':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'On Hold':
        return <Pause className="w-4 h-4 text-warning" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return <AlertCircle className="w-4 h-4 text-secondary" />;
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return 'text-error';
      case 'Medium':
        return 'text-warning';
      case 'Low':
        return 'text-success';
      default:
        return 'text-secondary';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="glass rounded-xl p-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Project Management</h1>
        <p className="text-secondary">Manage projects, tasks, and team collaboration</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">{projectStats.total}</div>
          <div className="text-secondary">Total Projects</div>
        </div>
        <div className="glass rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-success mb-2">{projectStats.active}</div>
          <div className="text-secondary">Active Projects</div>
        </div>
        <div className="glass rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">{taskStats.total}</div>
          <div className="text-secondary">Total Tasks</div>
        </div>
        <div className="glass rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-success mb-2">{taskStats.completed}</div>
          <div className="text-secondary">Completed Tasks</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="glass rounded-xl p-4">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'projects', label: 'Projects', icon: Users },
            { id: 'tasks', label: 'Tasks', icon: CheckCircle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 focus-ring",
                activeTab === id
                  ? 'glass bg-glass-200 text-primary'
                  : 'glass-weak text-secondary hover:text-primary hover:bg-glass-200'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recent Projects */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-primary">Recent Projects</h2>
              <button
                onClick={() => setShowProjectForm(true)}
                className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            </div>
            
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-secondary">No projects yet</p>
                <p className="text-tertiary text-sm">Create your first project to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="glass-weak rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-primary font-medium">{project.name}</h3>
                        <p className="text-secondary text-sm">{project.description}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(project.status)}
                          <span className="text-sm text-secondary">{project.status}</span>
                        </div>
                        <div className="text-sm text-secondary">
                          {project.progress}% complete
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Tasks */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-primary">Recent Tasks</h2>
              <button
                onClick={() => setShowTaskForm(true)}
                className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>
            </div>
            
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-secondary">No tasks yet</p>
                <p className="text-tertiary text-sm">Create tasks to track project progress</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="glass-weak rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-primary font-medium">{task.name}</h3>
                        <p className="text-secondary text-sm">{task.description}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className={cn("text-sm font-medium", getPriorityColor(task.priority))}>
                          {task.priority}
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(task.status)}
                          <span className="text-sm text-secondary">{task.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-primary">All Projects</h2>
            <button
              onClick={() => setShowProjectForm(true)}
              className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-secondary">No projects yet</p>
              <p className="text-tertiary text-sm">Create your first project to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="glass-weak rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-primary font-medium text-lg mb-2">{project.name}</h3>
                      <p className="text-secondary mb-2">{project.description}</p>
                      <div className="flex items-center space-x-2 text-sm text-tertiary">
                        <Users className="w-4 h-4" />
                        <span>{project.team.length} team members</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary">Status:</span>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(project.status)}
                          <span className="text-sm">{project.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary">Phase:</span>
                        <span className="text-sm">{project.phase}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary">Progress:</span>
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary">Budget:</span>
                        <span className="text-sm font-medium">{project.budget.total}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary">Start:</span>
                        <span className="text-sm">{formatDate(project.startDate)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary">End:</span>
                        <span className="text-sm">{formatDate(project.endDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-primary">All Tasks</h2>
            <button
              onClick={() => setShowTaskForm(true)}
              className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
          
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-secondary">No tasks yet</p>
              <p className="text-tertiary text-sm">Create tasks to track project progress</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="glass-weak rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h3 className="text-primary font-medium text-lg mb-2">{task.name}</h3>
                      <p className="text-secondary text-sm">{task.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary text-sm">Status:</span>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(task.status)}
                          <span className="text-sm">{task.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary text-sm">Priority:</span>
                        <span className={cn("text-sm font-medium", getPriorityColor(task.priority))}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary text-sm">Progress:</span>
                        <span className="text-sm font-medium">{task.progress}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary text-sm">Duration:</span>
                        <span className="text-sm">{task.duration} days</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary text-sm">Start:</span>
                        <span className="text-sm">{formatDate(task.startDate)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary text-sm">End:</span>
                        <span className="text-sm">{formatDate(task.endDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Project Creation Form Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass rounded-xl p-6 w-full max-w-2xl mx-4">
            <h2 className="text-xl font-semibold text-primary mb-4">Create New Project</h2>
            <ProjectForm onSubmit={handleCreateProject} onCancel={() => setShowProjectForm(false)} />
          </div>
        </div>
      )}

      {/* Task Creation Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass rounded-xl p-6 w-full max-w-2xl mx-4">
            <h2 className="text-xl font-semibold text-primary mb-4">Create New Task</h2>
            <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowTaskForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

// Simple form components (can be enhanced with react-hook-form)
const ProjectForm = ({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Planning' as ProjectStatus,
    phase: 'Initiation' as ProjectPhase,
    priority: 'Medium' as TaskPriority,
    startDate: '',
    endDate: '',
    budget: { total: '0', currency: 'USD' },
    objectives: [''],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Project Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-3 py-2 glass rounded-lg focus-ring w-full"
          required
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
          className="px-3 py-2 glass rounded-lg focus-ring w-full"
        >
          <option value="Planning">Planning</option>
          <option value="Active">Active</option>
          <option value="On Hold">On Hold</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      
      <textarea
        placeholder="Project Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="px-3 py-2 glass rounded-lg focus-ring w-full h-24"
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="px-3 py-2 glass rounded-lg focus-ring w-full"
          required
        />
        <input
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          className="px-3 py-2 glass rounded-lg focus-ring w-full"
          required
        />
        <input
          type="number"
          placeholder="Budget"
          value={formData.budget.total}
          onChange={(e) => setFormData({ ...formData, budget: { ...formData.budget, total: e.target.value } })}
          className="px-3 py-2 glass rounded-lg focus-ring w-full"
        />
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 glass-weak rounded-lg text-secondary hover:bg-glass-200 transition-all duration-200 focus-ring"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring"
        >
          Create Project
        </button>
      </div>
    </form>
  );
};

const TaskForm = ({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Not Started' as TaskStatus,
    priority: 'Medium' as TaskPriority,
    startDate: '',
    endDate: '',
    duration: 1,
    estimatedHours: 8,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Task Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-3 py-2 glass rounded-lg focus-ring w-full"
          required
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
          className="px-3 py-2 glass rounded-lg focus-ring w-full"
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      
      <textarea
        placeholder="Task Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="px-3 py-2 glass rounded-lg focus-ring w-full h-24"
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="px-3 py-2 glass rounded-lg focus-ring w-full"
          required
        />
        <input
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          className="px-3 py-2 glass rounded-lg focus-ring w-full"
          required
        />
        <input
          type="number"
          placeholder="Duration (days)"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
          className="px-3 py-2 glass rounded-lg focus-ring w-full"
          min="1"
        />
        <input
          type="number"
          placeholder="Hours"
          value={formData.estimatedHours}
          onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) })}
          className="px-3 py-2 glass rounded-lg focus-ring w-full"
          min="1"
        />
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 glass-weak rounded-lg text-secondary hover:bg-glass-200 transition-all duration-200 focus-ring"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring"
        >
          Create Task
        </button>
      </div>
    </form>
  );
};

export default ProjectManagementModule;
