import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Eye, 
  Trash2, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  MessageCircle,
  Truck,
  Store,
  CreditCard,
  ChefHat
} from 'lucide-react';
import { Order } from '../../types';

export const AdminOrders: React.FC = () => {
  const { orders, setOrders, addToast } = useBakery();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>('all');

  // Modal inspection
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // Update Status
  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        addToast(`Order updated to "${newStatus}"`, 'success');
      }
    } catch {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      addToast(`Order updated locally to "${newStatus}"`, 'info');
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        addToast('Order record removed', 'info');
      }
    } catch {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      addToast('Order record removed locally', 'info');
    }
    setDeleteConfirmId(null);
    if (selectedOrder?.id === orderId) setSelectedOrder(null);
  };

  // Print slip handler
  const handlePrintSlip = () => {
    window.print();
  };

  // Filtered Orders
  const filteredOrders = orders.filter(order => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = q === '' ||
      (order.orderNumber && order.orderNumber.toLowerCase().includes(q)) ||
      order.id.toLowerCase().includes(q) ||
      (order.customer?.name && order.customer.name.toLowerCase().includes(q)) ||
      (order.customer?.email && order.customer.email.toLowerCase().includes(q)) ||
      (order.customer?.phone && order.customer.phone.includes(q));

    const matchStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchFulfillment = fulfillmentFilter === 'all' || order.fulfillmentType === fulfillmentFilter;

    return matchSearch && matchStatus && matchFulfillment;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFF8EE] text-[#B7791F] border border-[#FBD38D]">Pending</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EBF8FF] text-[#2B6CB0] border border-[#BEE3F8]">Confirmed</span>;
      case 'preparing':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAF5FF] text-[#6B46C1] border border-[#E9D8FD]">In Oven / Prep</span>;
      case 'ready':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F0FFF4] text-[#22543D] border border-[#C6F6D5]">Ready / Dispatched</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFF5F5] text-[#C53030] border border-[#FED7D7]">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2C2420]">Order Management</h2>
          <p className="text-xs text-[#8C827A]">
            Real-time fulfillment, kitchen tickets, customer communications &amp; order history
          </p>
        </div>

        <div className="text-xs font-semibold text-[#8C827A] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span>Live Sync Active ({orders.length} total recorded)</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EBE3D7] shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A39990]" />
          <input
            type="text"
            placeholder="Search by order #, customer name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] focus:bg-white rounded-xl pl-10 pr-4 py-2 text-xs text-[#2C2420] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A39990] hover:text-[#2C2420]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E0D8CE] rounded-xl px-3 py-2 text-xs text-[#2C2420] font-medium outline-none cursor-pointer"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="pending">Pending ({orders.filter(o => o.status === 'pending').length})</option>
            <option value="confirmed">Confirmed ({orders.filter(o => o.status === 'confirmed').length})</option>
            <option value="preparing">In Oven ({orders.filter(o => o.status === 'preparing').length})</option>
            <option value="ready">Ready / Dispatched ({orders.filter(o => o.status === 'ready').length})</option>
            <option value="completed">Completed ({orders.filter(o => o.status === 'completed').length})</option>
            <option value="cancelled">Cancelled ({orders.filter(o => o.status === 'cancelled').length})</option>
          </select>

          {/* Fulfillment Filter */}
          <select
            value={fulfillmentFilter}
            onChange={(e) => setFulfillmentFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E0D8CE] rounded-xl px-3 py-2 text-xs text-[#2C2420] font-medium outline-none cursor-pointer"
          >
            <option value="all">All Channels</option>
            <option value="pickup">Counter Pickup</option>
            <option value="delivery">Courier Delivery</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#EBE3D7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EBE3D7] bg-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider text-[#7A6E65]">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Date / Slot</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4 text-center">Fulfillment</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EDE4] text-xs text-[#2C2420]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#8C827A]">
                    No orders match the current search or filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                    {/* Order Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#2C2420]">
                      #{order.orderNumber || order.id.slice(-6).toUpperCase()}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2C2420]">{order.customer?.name || 'Guest Customer'}</div>
                      <div className="text-[11px] text-[#8C827A]">{order.customer?.phone || order.customer?.email}</div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="text-[11px] font-medium text-[#2C2420]">
                        {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-[#8C827A]">
                        {order.deliveryTimeSlot || new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Items preview */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold">{order.items?.length || 0} item(s)</span>
                      <div className="text-[10px] text-[#8C827A] line-clamp-1 max-w-[180px]">
                        {order.items?.map(i => `${i.quantity}x ${i.product?.name || 'Item'}`).join(', ')}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#2C2420]">
                      €{(order.total || 0).toFixed(2)}
                    </td>

                    {/* Fulfillment */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-lg bg-[#FAF6EE] text-[#5A5047]">
                        {order.fulfillmentType === 'delivery' ? <Truck className="w-3 h-3 text-[#C49258]" /> : <Store className="w-3 h-3 text-[#C49258]" />}
                        <span>{order.fulfillmentType === 'delivery' ? 'Delivery' : 'Pickup'}</span>
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(order.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg bg-[#F5F2EB] hover:bg-[#EBE3D7] text-[#2C2420] transition-colors cursor-pointer"
                          title="Inspect Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(order.id)}
                          className="p-2 rounded-lg bg-[#FFF5F5] hover:bg-[#FED7D7] text-[#C53030] transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL ORDER INSPECTION MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#EBE3D7] shadow-2xl max-w-3xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-[#EBE3D7] flex items-center justify-between bg-[#FAF8F5]">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-bold text-[#2C2420]">
                    Order #{selectedOrder.orderNumber || selectedOrder.id.slice(-6).toUpperCase()}
                  </span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <p className="text-xs text-[#8C827A]">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintSlip}
                  className="px-3 py-1.5 rounded-xl border border-[#E0D8CE] bg-white hover:bg-[#FAF8F5] text-xs font-bold text-[#2C2420] flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5 text-[#C49258]" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-xl text-[#8C827A] hover:text-[#2C2420] hover:bg-[#EBE3D7]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Status Stepper / Quick Actions */}
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EDE4D8] space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A5047] flex items-center gap-1.5">
                  <ChefHat className="w-4 h-4 text-[#C49258]" />
                  <span>Kitchen Status Progression</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'pending', label: 'Pending' },
                    { id: 'confirmed', label: 'Confirmed' },
                    { id: 'preparing', label: 'In Oven / Baking' },
                    { id: 'ready', label: 'Ready / Dispatched' },
                    { id: 'completed', label: 'Completed' },
                    { id: 'cancelled', label: 'Cancelled' },
                  ].map(st => (
                    <button
                      key={st.id}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st.id as any)}
                      className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer ${
                        selectedOrder.status === st.id
                          ? 'bg-[#2C2420] text-[#FAF7F2] shadow-sm'
                          : 'bg-white border border-[#E0D8CE] text-[#5A5047] hover:border-[#C49258]'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer & Fulfillment Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Details */}
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EDE4D8] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C827A]">Customer Details</span>
                  <div className="font-bold text-sm text-[#2C2420]">{selectedOrder.customer?.name}</div>
                  
                  <div className="space-y-1 text-xs text-[#5A5047]">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#C49258]" />
                      <a href={`mailto:${selectedOrder.customer?.email}`} className="hover:underline">
                        {selectedOrder.customer?.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#C49258]" />
                      <a href={`tel:${selectedOrder.customer?.phone}`} className="hover:underline">
                        {selectedOrder.customer?.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Fulfillment / Delivery Details */}
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EDE4D8] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C827A]">Fulfillment Information</span>
                  <div className="font-bold text-sm text-[#2C2420] flex items-center gap-1.5">
                    {selectedOrder.fulfillmentType === 'delivery' ? <Truck className="w-4 h-4 text-[#C49258]" /> : <Store className="w-4 h-4 text-[#C49258]" />}
                    <span>{selectedOrder.fulfillmentType === 'delivery' ? 'Home / Courier Delivery' : 'Boutique Pickup'}</span>
                  </div>

                  <div className="space-y-1 text-xs text-[#5A5047]">
                    {selectedOrder.fulfillmentType === 'delivery' ? (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#C49258] mt-0.5 flex-shrink-0" />
                        <div>
                          <div>{selectedOrder.deliveryAddress?.street}</div>
                          <div className="text-[11px] text-[#8C827A]">
                            {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.postalCode}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Store className="w-3.5 h-3.5 text-[#C49258]" />
                        <span>Branch: {selectedOrder.pickupBranchId || 'Lyon Presqu’île'}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[11px] text-[#8C827A]">
                      <Calendar className="w-3.5 h-3.5 text-[#C49258]" />
                      <span>Slot: {selectedOrder.deliveryTimeSlot || 'Morning 08:00–10:00'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itemized Order Table */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C827A]">Order Items</span>
                <div className="border border-[#EBE3D7] rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#FAF8F5] text-[10px] font-bold uppercase text-[#7A6E65] border-b border-[#EBE3D7]">
                      <tr>
                        <th className="p-3">Product</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Unit Price</th>
                        <th className="p-3 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EDE4]">
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3">
                            <div className="font-bold text-[#2C2420]">{item.product?.name || 'Item'}</div>
                            {item.selectedVariant && (
                              <div className="text-[11px] text-[#8C827A]">Size/Option: {item.selectedVariant.name}</div>
                            )}
                            {item.customNote && (
                              <div className="text-[11px] text-[#C49258] italic">Note: "{item.customNote}"</div>
                            )}
                          </td>
                          <td className="p-3 text-center font-bold">{item.quantity}</td>
                          <td className="p-3 text-right font-serif">€{item.unitPrice.toFixed(2)}</td>
                          <td className="p-3 text-right font-serif font-bold">
                            €{(item.unitPrice * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EDE4D8] space-y-1.5 text-right">
                <div className="flex justify-between text-xs text-[#8C827A]">
                  <span>Subtotal:</span>
                  <span className="font-serif">€{(selectedOrder.subtotal || selectedOrder.total || 0).toFixed(2)}</span>
                </div>
                {selectedOrder.discountAmount ? (
                  <div className="flex justify-between text-xs text-[#3F5E46] font-medium">
                    <span>Discount Applied:</span>
                    <span className="font-serif">-€{selectedOrder.discountAmount.toFixed(2)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-xs text-[#8C827A]">
                  <span>Delivery Fee:</span>
                  <span className="font-serif">€{(selectedOrder.deliveryFee || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#2C2420] pt-2 border-t border-[#E0D8CE]">
                  <span>Grand Total:</span>
                  <span className="font-serif text-base text-[#2C2420]">€{(selectedOrder.total || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Customer Notes */}
              {selectedOrder.customerNotes && (
                <div className="p-3 rounded-xl bg-[#FFF8EE] border border-[#FBD38D] text-xs text-[#744210]">
                  <strong>Customer Instructions:</strong> {selectedOrder.customerNotes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EBE3D7] shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5F5] text-[#C53030] flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-serif text-lg font-bold text-[#2C2420]">Delete Order Record?</h4>
              <p className="text-xs text-[#8C827A]">
                This will permanently delete the order from the operations dashboard.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#E0D8CE] text-xs font-bold uppercase text-[#5A5047] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOrder(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-[#C53030] hover:bg-[#9B2C2C] text-white text-xs font-bold uppercase"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
