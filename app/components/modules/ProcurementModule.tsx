'use client';

export default function ProcurementModule() {
  return (
    <div className="space-y-6 p-6">
      {/* Quick Actions */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 glass-weak rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-center">
            <span className="font-medium">+ New Order</span>
          </button>
          <button className="p-4 glass-weak rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-center">
            <span className="font-medium">+ New Vendor</span>
          </button>
          <button className="p-4 glass-weak rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-center">
            <span className="font-medium">+ New RFQ</span>
          </button>
          <button className="p-4 glass-weak rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring text-center">
            <span className="font-medium">Reports</span>
          </button>
        </div>
      </div>

      {/* Purchase Orders */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Purchase Orders</h2>
          <button className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring">
            + New Order
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-secondary">No purchase orders yet</p>
          <p className="text-tertiary text-sm">Start by creating your first purchase order</p>
        </div>
      </div>

      {/* Vendor Management */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Vendor Management</h2>
          <button className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring">
            + New Vendor
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-secondary">No vendors added yet</p>
          <p className="text-tertiary text-sm">Start by adding your first vendor</p>
        </div>
      </div>

      {/* RFQ Management */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary">Request for Quotations</h2>
          <button className="px-4 py-2 glass rounded-lg text-primary hover:bg-glass-200 transition-all duration-200 focus-ring">
            + New RFQ
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-secondary">No RFQs created yet</p>
          <p className="text-tertiary text-sm">Start by creating your first RFQ</p>
        </div>
      </div>
    </div>
  );
}
