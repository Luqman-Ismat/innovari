'use client';

import { useState } from 'react';

export default function ClientModule() {
  const [selectedClient, setSelectedClient] = useState('client1');

  const clients = [
    { id: 'client1', name: 'Client A', status: 'Active', projects: 3 },
    { id: 'client2', name: 'Client B', status: 'Active', projects: 2 },
    { id: 'client3', name: 'Client C', status: 'Inactive', projects: 0 },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Client Overview */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Client Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-weak rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">3</div>
            <div className="text-secondary text-sm">Total Clients</div>
          </div>
          <div className="glass-weak rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">5</div>
            <div className="text-secondary text-sm">Active Projects</div>
          </div>
          <div className="glass-weak rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">$2.4M</div>
            <div className="text-secondary text-sm">Total Value</div>
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Client Management</h2>
          <button className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring">
            + Add Client
          </button>
        </div>
        <div className="space-y-3">
          {clients.map((client) => (
            <div
              key={client.id}
              className={`p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                selectedClient === client.id
                  ? 'glass bg-glass-200'
                  : 'glass-weak hover:bg-glass-200'
              }`}
              onClick={() => setSelectedClient(client.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-primary">{client.name}</div>
                  <div className="text-sm text-secondary">
                    {client.projects} project{client.projects !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  client.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {client.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Communication Hub */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Communication Hub</h2>
        <div className="text-center py-8">
          <p className="text-secondary">No recent communications</p>
          <p className="text-tertiary text-sm">Start a conversation with your selected client</p>
          <button className="mt-4 px-6 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring">
            New Message
          </button>
        </div>
      </div>
    </div>
  );
}
