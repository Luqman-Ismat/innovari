'use client';

export default function EPCModule() {
  return (
    <div className="space-y-6 p-6">
      {/* Quick Actions */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 glass-weak rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-center">
            <span className="font-medium">+ New Project</span>
          </button>
          <button className="p-4 glass-weak rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-center">
            <span className="font-medium">+ New Phase</span>
          </button>
          <button className="p-4 glass-weak rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-center">
            <span className="font-medium">+ New Risk</span>
          </button>
          <button className="p-4 glass-weak rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-center">
            <span className="font-medium">Reports</span>
          </button>
        </div>
      </div>

      {/* Project Status */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Project Status</h2>
          <button className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring">
            + New Project
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-secondary">No projects created yet</p>
          <p className="text-tertiary text-sm">Start by creating your first EPC project</p>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Key Performance Indicators</h2>
        <div className="text-center py-8">
          <p className="text-secondary">No KPIs available yet</p>
          <p className="text-tertiary text-sm">KPIs will appear once projects are created</p>
        </div>
      </div>

      {/* Risk Management */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Risk Management</h2>
          <button className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring">
            + New Risk
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-secondary">No risks identified yet</p>
          <p className="text-tertiary text-sm">Start by identifying project risks</p>
        </div>
      </div>

      {/* Change Orders */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Change Orders</h2>
          <button className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring">
            + New Change Order
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-secondary">No change orders yet</p>
          <p className="text-tertiary text-sm">Change orders will appear as projects progress</p>
        </div>
      </div>
    </div>
  );
}
