'use client';

export default function EstimatingModule() {
  return (
    <div className="space-y-6 p-6">
      {/* Quick Actions */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 glass-weak rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-center">
            <span className="font-medium">+ New Estimate</span>
          </button>
          <button className="p-4 glass-weak rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-center">
            <span className="font-medium">+ Cost Database</span>
          </button>
          <button className="p-4 glass-weak rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-center">
            <span className="font-medium">+ Templates</span>
          </button>
          <button className="p-4 glass-weak rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-center">
            <span className="font-medium">Reports</span>
          </button>
        </div>
      </div>

      {/* Active Estimates */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Active Estimates</h2>
          <button className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring">
            + New Estimate
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-secondary">No estimates created yet</p>
          <p className="text-tertiary text-sm">Start by creating your first cost estimate</p>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Cost Breakdown</h2>
        <div className="text-center py-8">
          <p className="text-secondary">No cost breakdowns available yet</p>
          <p className="text-tertiary text-sm">Cost breakdowns will appear once estimates are created</p>
        </div>
      </div>

      {/* Estimating Tools */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Estimating Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 glass-weak rounded-lg text-center hover:bg-glass-200 transition-all duration-200">
            <h3 className="text-primary font-medium mb-2">Cost Database</h3>
            <p className="text-secondary text-sm">Historical cost data and benchmarks</p>
          </div>
          
          <div className="p-4 glass-weak rounded-lg text-center hover:bg-glass-200 transition-all duration-200">
            <h3 className="text-primary font-medium mb-2">Parametric Models</h3>
            <p className="text-secondary text-sm">Statistical cost estimation models</p>
          </div>
          
          <div className="p-4 glass-weak rounded-lg text-center hover:bg-glass-200 transition-all duration-200">
            <h3 className="text-primary font-medium mb-2">Risk Analysis</h3>
            <p className="text-secondary text-sm">Monte Carlo simulation tools</p>
          </div>
        </div>
      </div>

      {/* Recent Changes */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Recent Changes</h2>
        <div className="text-center py-8">
          <p className="text-secondary">No recent changes</p>
          <p className="text-tertiary text-sm">Changes will appear as estimates are modified</p>
        </div>
      </div>

      {/* Industry Benchmarking */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Industry Benchmarking</h2>
        <div className="text-center py-8">
          <p className="text-secondary">No benchmarking data available yet</p>
          <p className="text-tertiary text-sm">Benchmarking data will appear once estimates are created</p>
        </div>
      </div>
    </div>
  );
}

