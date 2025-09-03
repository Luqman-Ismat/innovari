'use client';

import { useState } from 'react';

export default function ConstructionModule() {
  const [selectedPhase, setSelectedPhase] = useState('planning');

  const phases = [
    { id: 'planning', name: 'Planning', description: 'Construction planning and scheduling' },
    { id: 'site-prep', name: 'Site Preparation', description: 'Site clearing and foundation work' },
    { id: 'erection', name: 'Erection', description: 'Equipment and structure erection' },
    { id: 'testing', name: 'Testing', description: 'Commissioning and testing' },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Phase Selection */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Construction Phases</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setSelectedPhase(phase.id)}
              className={`p-4 rounded-lg transition-all duration-200 focus-ring ${
                selectedPhase === phase.id
                  ? 'glass bg-glass-200 text-primary'
                  : 'glass-weak hover:bg-glass-200 text-secondary hover:text-primary'
              }`}
            >
              <div className="text-center">
                <div className="font-medium">{phase.name}</div>
                <div className="text-xs text-tertiary mt-1">{phase.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Construction Dashboard */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Construction Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-weak rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">85%</div>
            <div className="text-secondary text-sm">Overall Progress</div>
          </div>
          <div className="glass-weak rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-secondary text-sm">Active Work Areas</div>
          </div>
          <div className="glass-weak rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">45</div>
            <div className="text-secondary text-sm">Workers on Site</div>
          </div>
        </div>
      </div>

      {/* Schedule Management */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Schedule Management</h2>
          <button className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring">
            + Add Task
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-secondary">No tasks scheduled yet</p>
          <p className="text-tertiary text-sm">Start by adding construction tasks to your schedule</p>
        </div>
      </div>
    </div>
  );
}
