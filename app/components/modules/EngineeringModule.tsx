'use client';

import { useState } from 'react';

export default function EngineeringModule() {
  const [selectedTool, setSelectedTool] = useState('equipment');

  const tools = [
    { id: 'equipment', name: 'Equipment', description: 'Add and manage equipment' },
    { id: 'piping', name: 'Piping', description: 'Design piping systems' },
    { id: 'instruments', name: 'Instruments', description: 'Control instruments' },
    { id: 'valves', name: 'Valves', description: 'Valve management' },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Tool Selection */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Design Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`p-4 rounded-lg transition-all duration-200 focus-ring ${
                selectedTool === tool.id
                  ? 'glass bg-glass-200 text-primary'
                  : 'glass-weak hover:bg-glass-200 text-secondary hover:text-primary'
              }`}
            >
              <div className="text-center">
                <div className="font-medium">{tool.name}</div>
                <div className="text-xs text-tertiary mt-1">{tool.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Design Canvas */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Design Canvas</h2>
        <div className="h-96 flex items-center justify-center bg-glass-weak rounded-lg">
          <div className="text-center">
            <p className="text-primary font-medium">Design Canvas</p>
            <p className="text-secondary text-sm">Select a tool to start designing</p>
            <button className="mt-4 px-6 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring">
              Start New Design
            </button>
          </div>
        </div>
      </div>

      {/* Equipment Management */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Equipment Management</h2>
          <button className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring">
            + Add Equipment
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-secondary">No equipment added yet</p>
          <p className="text-tertiary text-sm">Start by adding your first piece of equipment</p>
        </div>
      </div>
    </div>
  );
}

