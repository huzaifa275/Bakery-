import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Search, PackageCheck, Clock, MapPin, Truck, CheckCircle2, AlertCircle, Printer, ArrowRight } from 'lucide-react';
import { Order } from '../../types';

export const OrderTrackingView: React.FC = () => {
  const { currentOrder, orders, branches, addToast, setActiveView } = useBakery();
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(currentOrder || (orders.length > 0 ? orders[0] : null));
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOrderNumber.trim()) return;

    setHasSearched(true);
    const q = searchOrderNumber.trim().toUpperCase();
    const found = orders.find(o => o.orderNumber.toUpperCase() === q || o.id.toUpperCase() === q);

    if (found) {
      setSearchedOrder(found);
      addToast(`Order ${found.orderNumber} located`, 'info');
    } else {
      setSearchedOrder(null);
      addToast(`No order found matching ${searchOrderNumber}`, 'error');
    }
  };

  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 1;
      case 'confirmed':
        return 2;
      case 'preparing':
        return 3;
      case 'ready':
      case 'out_for_delivery':
        return 4;
      case 'completed':
        return 5;
      case 'cancelled':
        return 0;
      default:
        return 2;
    }
  };

  const currentStep = searchedOrder ? getStatusStep(searchedOrder.status) : 0;
  const branch = searchedOrder && searchedOrder.pickupBranchId 
    ? branches.find(b => b.id === searchedOrder.pickupBranchId) || branches[0]
    : branches[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C49258]/15 border border-[#C49258]/30 text-[#A87438] text-xs uppercase tracking-widest font-semibold">
          <Truck className="w-3.5 h-3.5 text-[#C49258]" />
          Suivi de Commande en Direct
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1A16]">
          Track Your Bakery Order
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6E65] font-light">
          Enter your order reference code (e.g. <code>MSH-2026-9041</code>) to monitor stone hearth oven scheduling and collection windows.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7A6E65] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchOrderNumber}
            onChange={(e) => setSearchOrderNumber(e.target.value)}
            placeholder="e.g. MSH-2026-9041"
            className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl pl-10 pr-4 py-3 text-xs text-[#1F1A16] uppercase font-mono placeholder-[#A89F95] focus:outline-none focus:border-[#C49258]"
          />
        </div>
        <button
          type="submit"
          className="bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Track
        </button>
      </form>

      {/* Tracked Order Details */}
      {searchedOrder ? (
        <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] p-6 sm:p-10 space-y-8 shadow-xs">
          
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8DFD5] pb-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C49258]">
                Order Reference
              </span>
              <h2 className="font-mono text-2xl font-bold text-[#1F1A16]">
                {searchedOrder.orderNumber}
              </h2>
              <span className="text-xs text-[#7A6E65]">
                Placed on {new Date(searchedOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A6E65] block">
                Total Amount
              </span>
              <span className="font-display text-2xl font-bold text-[#1F1A16]">
                €{(searchedOrder.total || (searchedOrder as any).totalAmount || 0).toFixed(2)}
              </span>
              <span className="text-[10px] text-[#3F5E46] bg-[#3F5E46]/10 px-2 py-0.5 rounded-full font-bold uppercase block mt-0.5">
                Paid via {searchedOrder.paymentMethod.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-[#1F1A16]">
              Atelier Preparation Progress
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              {[
                { step: 1, label: 'Order Confirmed', desc: 'Recipe staged' },
                { step: 2, label: 'Wild Fermentation', desc: '48h-72h resting' },
                { step: 3, label: 'Stone Hearth Bake', desc: 'Oven fired at 05:00' },
                { step: 4, label: (searchedOrder.type || (searchedOrder as any).fulfillmentType) === 'pickup' ? 'Ready at Counter' : 'Van En Route', desc: 'Cooled & packaged' },
                { step: 5, label: 'Collected / Delivered', desc: 'Enjoy your morning' },
              ].map(st => {
                const isPassed = currentStep >= st.step;
                const isCurrent = currentStep === st.step;

                return (
                  <div
                    key={st.step}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-[#EFE8DD] border-[#C49258] ring-2 ring-[#C49258]/30 font-semibold'
                        : isPassed
                        ? 'bg-[#FFFFFF] border-[#3F5E46]/30 text-[#3F5E46]'
                        : 'bg-[#FAF7F2] border-[#E8DFD5] text-[#A89F95]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase">Step 0{st.step}</span>
                      {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-[#3F5E46]" />}
                    </div>
                    <strong className="block text-xs text-[#1F1A16]">{st.label}</strong>
                    <span className="text-[10px] text-[#7A6E65]">{st.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Logistics & Pickup Box */}
          <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E8DFD5] grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#4A3F35]">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C49258] block">
                Fulfillment Logistics
              </span>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C49258]" />
                <span><strong>Target Window:</strong> {searchedOrder.deliveryDate || (searchedOrder as any).fulfillmentDate} at {searchedOrder.deliveryTimeSlot || (searchedOrder as any).fulfillmentTime}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C49258]" />
                {(searchedOrder.type || (searchedOrder as any).fulfillmentType) === 'pickup' ? (
                  <span><strong>Collection Atelier:</strong> {branch.name} ({branch.address}, {branch.city})</span>
                ) : (
                  <span><strong>Refrigerated Courier:</strong> {searchedOrder.customer.address ? `${searchedOrder.customer.address.street}, ${searchedOrder.customer.address.city}` : (searchedOrder as any).deliveryAddress}</span>
                )}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C49258] block">
                Guest Details
              </span>
              <p><strong>Name:</strong> {searchedOrder.customer.fullName || (searchedOrder.customer as any).name}</p>
              <p><strong>Email:</strong> {searchedOrder.customer.email}</p>
              <p><strong>Phone:</strong> {searchedOrder.customer.phone}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <h4 className="font-display text-base font-bold text-[#1F1A16]">
              Order Basket ({searchedOrder.items.length} items)
            </h4>

            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8DFD5] divide-y divide-[#F4EFEA] overflow-hidden">
              {searchedOrder.items.map((item, i) => (
                <div key={i} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                      <strong className="text-[#1F1A16] block">{item.product.name}</strong>
                      <span className="text-[11px] text-[#7A6E65]">
                        Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant.name}` : ''}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-[#1F1A16]">
                    €{((item.selectedVariant?.price || item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="bg-[#EFE8DD] hover:bg-[#E5DACD] text-[#1F1A16] px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border border-[#DCD1C4]"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Receipt</span>
            </button>
          </div>

        </div>
      ) : hasSearched ? (
        <div className="bg-[#FAF7F2] p-12 rounded-3xl border border-[#E8DFD5] text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-[#C49258] mx-auto" />
          <h3 className="font-display text-xl font-bold text-[#1F1A16]">
            No order found matching "{searchOrderNumber}"
          </h3>
          <p className="text-xs text-[#7A6E65]">
            Please verify the order code on your confirmation email or SMS.
          </p>
        </div>
      ) : null}

    </div>
  );
};
