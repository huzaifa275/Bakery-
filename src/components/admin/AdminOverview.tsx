import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  Package, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight,
  DollarSign,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Order } from '../../types';

interface AdminOverviewProps {
  onNavigateTab: (tab: 'products' | 'categories' | 'orders' | 'cakes' | 'coupons' | 'cms' | 'quick-stock') => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const { products, orders, categories, setOrders, addToast } = useBakery();

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'ready');
  const outOfStockProducts = products.filter(p => !p.isAvailable);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysOrders = orders.filter(o => o.createdAt?.startsWith(todayStr) || o.deliveryDate === todayStr);
  const todaysRevenue = todaysOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        addToast(`Order updated to ${newStatus}`, 'success');
      }
    } catch {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      addToast(`Order updated locally to ${newStatus}`, 'info');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-[#2C2420] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-[#443831]">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3D332D] text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Live Atelier Dashboard
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight">
            Today's Bakery Operations
          </h2>
          <p className="text-sm text-[#C9BFB5] font-light leading-relaxed">
            Monitor morning oven batches, live online click &amp; collect orders, courier dispatches, and inventory status in real time.
          </p>
        </div>

        {/* Action Pills */}
        <div className="mt-6 flex flex-wrap gap-3 relative z-10">
          <button
            onClick={() => onNavigateTab('orders')}
            className="bg-[#D4AF37] hover:bg-[#C29E2F] text-[#2C2420] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            View Active Orders ({pendingOrders.length + preparingOrders.length})
          </button>
          <button
            onClick={() => onNavigateTab('quick-stock')}
            className="bg-[#3D332D] hover:bg-[#4E413A] text-[#FAF7F2] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            Morning Stock Manager
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBE3D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8C827A]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF6EE] text-[#D4AF37] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#2C2420]">
            €{totalRevenue.toFixed(2)}
          </div>
          <div className="text-xs text-[#3F5E46] flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>€{todaysRevenue.toFixed(2)} recorded today</span>
          </div>
        </div>

        {/* Pending / Active Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBE3D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8C827A]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Orders</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF8EE] text-[#C49258] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#2C2420]">
            {pendingOrders.length + preparingOrders.length}
          </div>
          <div className="text-xs text-[#8C827A]">
            <span className="text-[#C49258] font-bold">{pendingOrders.length} new</span> • {preparingOrders.length} in oven/prep
          </div>
        </div>

        {/* Total Catalog Items */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBE3D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8C827A]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Menu Catalog</span>
            <div className="w-8 h-8 rounded-lg bg-[#F5F2EB] text-[#2C2420] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#2C2420]">
            {products.length}
          </div>
          <div className="text-xs text-[#8C827A]">
            Across <span className="font-semibold text-[#2C2420]">{categories.length} categories</span>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBE3D7] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#8C827A]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Stock Availability</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              outOfStockProducts.length > 0 ? 'bg-[#FFF5F5] text-[#C53030]' : 'bg-[#F0FDF4] text-[#16A34A]'
            }`}>
              {outOfStockProducts.length > 0 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#2C2420]">
            {products.length - outOfStockProducts.length} <span className="text-sm font-sans font-normal text-[#8C827A]">/ {products.length}</span>
          </div>
          <div className="text-xs">
            {outOfStockProducts.length > 0 ? (
              <span className="text-[#C53030] font-medium">{outOfStockProducts.length} item(s) sold out today</span>
            ) : (
              <span className="text-[#16A34A] font-medium">All bakes fully available</span>
            )}
          </div>
        </div>
      </div>

      {/* Out of stock alert box if any */}
      {outOfStockProducts.length > 0 && (
        <div className="bg-[#FFF9F2] border border-[#F6E05E] p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FEFCBF] text-[#B7791F] flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#744210] uppercase tracking-wider">
                Morning Stock Notice ({outOfStockProducts.length} Sold Out)
              </h4>
              <p className="text-xs text-[#975A16]">
                {outOfStockProducts.map(p => p.name).slice(0, 3).join(', ')}
                {outOfStockProducts.length > 3 && ` +${outOfStockProducts.length - 3} more`}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('quick-stock')}
            className="bg-[#2C2420] text-white hover:bg-[#3D332D] text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
          >
            Manage Stock
          </button>
        </div>
      )}

      {/* Two Columns: Recent Orders & Quick Category Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EBE3D7] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2C2420]">Recent Orders</h3>
              <p className="text-xs text-[#8C827A]">Latest customer inquiries &amp; counter pickups</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-[#C49258] hover:text-[#2C2420] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All ({orders.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#8C827A]">
              No orders received yet today.
            </div>
          ) : (
            <div className="divide-y divide-[#F2EDE4]">
              {orders.slice(0, 5).map(order => {
                const statusColors = {
                  pending: 'bg-[#FFF8EE] text-[#B7791F] border-[#FBD38D]',
                  confirmed: 'bg-[#EBF8FF] text-[#2B6CB0] border-[#BEE3F8]',
                  preparing: 'bg-[#FAF5FF] text-[#6B46C1] border-[#E9D8FD]',
                  ready: 'bg-[#F0FFF4] text-[#22543D] border-[#C6F6D5]',
                  completed: 'bg-[#F0FFF4] text-[#22543D] border-[#C6F6D5]',
                  cancelled: 'bg-[#FFF5F5] text-[#C53030] border-[#FED7D7]',
                };

                return (
                  <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#2C2420]">
                          #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColors[order.status] || 'bg-gray-100'}`}>
                          {order.status}
                        </span>
                        <span className="text-[11px] text-[#8C827A]">
                          {order.fulfillmentType === 'delivery' ? '🚗 Delivery' : '🥐 Counter Pickup'}
                        </span>
                      </div>
                      <div className="text-xs text-[#5A5047]">
                        <span className="font-medium">{order.customer?.name || 'Customer'}</span>
                        <span className="text-[#8C827A]"> • {order.items?.length || 0} item(s)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-right">
                        <div className="font-serif font-bold text-sm text-[#2C2420]">
                          €{(order.total || 0).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-[#8C827A]">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {/* Quick Status advance button */}
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="bg-[#2C2420] hover:bg-[#3D332D] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Confirm
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="bg-[#6B46C1] hover:bg-[#553C9A] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Bake
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="bg-[#22543D] hover:bg-[#1C4532] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Ready
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Nav / Shortcuts Column */}
        <div className="bg-white rounded-3xl border border-[#EBE3D7] p-6 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#2C2420]">Operations Shortcuts</h3>
          <p className="text-xs text-[#8C827A]">Manage core bakery assets &amp; online presence</p>

          <div className="space-y-2.5">
            <button
              onClick={() => onNavigateTab('products')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE1] transition-colors text-left text-xs font-semibold text-[#2C2420] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-[#C49258]" />
                <span>Add / Edit Bakery Products</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C827A]" />
            </button>

            <button
              onClick={() => onNavigateTab('categories')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE1] transition-colors text-left text-xs font-semibold text-[#2C2420] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-[#C49258]" />
                <span>Organize Menu Categories</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C827A]" />
            </button>

            <button
              onClick={() => onNavigateTab('cms')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE1] transition-colors text-left text-xs font-semibold text-[#2C2420] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#C49258]" />
                <span>Storefront CMS &amp; Banners</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C827A]" />
            </button>

            <button
              onClick={() => onNavigateTab('coupons')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE1] transition-colors text-left text-xs font-semibold text-[#2C2420] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4 text-[#C49258]" />
                <span>Promotional Codes &amp; Offers</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C827A]" />
            </button>

            <button
              onClick={() => onNavigateTab('cakes')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE1] transition-colors text-left text-xs font-semibold text-[#2C2420] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#C49258]" />
                <span>Custom Cake Requests</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#8C827A]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
