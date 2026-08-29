import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Check, 
  Copy, 
  MapPin, 
  Calendar, 
  Clock, 
  Truck, 
  Store, 
  ArrowLeft, 
  ArrowRight, 
  Printer, 
  Mail, 
  ShoppingBag, 
  Search,
  Sparkles,
  Info,
  ChevronRight
} from 'lucide-react';
import { Order } from '../../types';

export const OrderConfirmationView: React.FC = () => {
  const { 
    lastCompletedOrder, 
    orders, 
    branches, 
    setActiveView, 
    navigateToMenuWithSearch,
    addToast 
  } = useBakery();

  const [copied, setCopied] = useState(false);

  // Fallback to most recent order if lastCompletedOrder is not directly in state
  const activeOrder: Order | null = lastCompletedOrder || (orders.length > 0 ? orders[0] : null);

  const handleCopyReference = (ref: string) => {
    if (!ref) return;
    try {
      navigator.clipboard.writeText(ref);
      setCopied(true);
      addToast(`Order reference ${ref} copied to clipboard`, 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      addToast(`Reference: ${ref}`, 'info');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to format delivery date into natural European style e.g., "Friday, 29 August"
  const formatOrderDate = (dateStr: string) => {
    if (!dateStr) return 'Tomorrow morning';
    try {
      // Check if it is standard YYYY-MM-DD
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Empty / Direct Access State
  if (!activeOrder) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-16 bg-[#FDFBF7]">
        <div className="max-w-md w-full text-center bg-[#FAF7F2] rounded-3xl p-8 sm:p-10 border border-[#E8DFD5] shadow-xs space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#EFE8DD] text-[#C49258] flex items-center justify-center mx-auto border border-[#E8DFD5]">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#A87438]">
              Maison Éloise Bakery
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1F1A16]">
              No Recent Order Found
            </h1>
            <p className="text-xs sm:text-sm text-[#7A6E65] font-light leading-relaxed">
              If you have just placed an order, please check your confirmation email or track your bakes using your order reference code.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              type="button"
              id="empty-order-browse-menu"
              onClick={() => navigateToMenuWithSearch('')}
              className="w-full bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Explore Our Bakes</span>
              <ArrowRight className="w-4 h-4 text-[#C49258]" />
            </button>
            <button
              type="button"
              id="empty-order-track"
              onClick={() => setActiveView('track-order')}
              className="w-full bg-[#EFE8DD] hover:bg-[#E5DACD] text-[#1F1A16] py-3 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider border border-[#DCD1C4] transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track an Existing Order</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Extract Customer details dynamically
  const customerFullName = activeOrder.customer?.fullName || 'Valued Customer';
  // Use first name for natural warm greeting if possible, or full name
  const customerFirstName = customerFullName.trim().split(' ')[0] || customerFullName;
  const customerEmail = activeOrder.customer?.email || 'customer@example.com';
  const isPickup = activeOrder.type === 'pickup';

  // Branch details for pickup
  const branch = branches.find(b => b.id === activeOrder.pickupBranchId) || branches[0] || {
    name: 'Maison Éloise Lyon',
    address: '12 Rue des Fleurs',
    city: 'Lyon',
    postalCode: '69002'
  };

  const formattedDate = formatOrderDate(activeOrder.deliveryDate);
  const totalItemCount = activeOrder.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
        
        {/* ================================================================= */}
        {/* TOP BACK NAVIGATION */}
        {/* ================================================================= */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            id="top-continue-shopping-btn"
            onClick={() => navigateToMenuWithSearch('')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#7A6E65] hover:text-[#1F1A16] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#C49258]" />
            <span>← Continue shopping</span>
          </button>

          <button
            type="button"
            id="print-order-receipt-btn"
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-[#7A6E65] hover:text-[#1F1A16] px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] hover:bg-[#EFE8DD] transition-all"
            title="Print or save order receipt"
          >
            <Printer className="w-3.5 h-3.5 text-[#C49258]" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* ORDER SUCCESS HEADER */}
        {/* ================================================================= */}
        <div className="text-center space-y-4 sm:space-y-5 relative">
          
          {/* Subtle Success Badge & Animation */}
          <div className="relative inline-block">
            {/* Soft wheat/flour floating particle accents */}
            <div className="absolute -top-3 -left-4 text-[#C49258]/30 animate-pulse pointer-events-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.5 7.5L19 9L13.5 10.5L12 16L10.5 10.5L5 9L10.5 7.5L12 2Z" />
              </svg>
            </div>
            <div className="absolute -bottom-2 -right-4 text-[#C49258]/30 animate-pulse delay-300 pointer-events-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4L13 8L17 9L13 10L12 14L11 10L7 9L11 8L12 4Z" />
              </svg>
            </div>

            {/* Circular Checkmark Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-[#FAF7F2] to-[#EFE8DD] border-2 border-[#C49258]/40 shadow-md flex items-center justify-center mx-auto text-[#C49258] transition-transform">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1F1A16] flex items-center justify-center text-[#FAF7F2]">
                <Check className="w-6 h-6 sm:w-7 sm:h-7 text-[#E6C594] stroke-[2.5]" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE8DD] border border-[#DCD1C4] text-[#A87438] text-[11px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C49258]" />
              ORDER CONFIRMED
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#1F1A16] tracking-tight">
              Thank you, {customerFirstName}!
            </h1>

            <p className="text-sm sm:text-base text-[#7A6E65] max-w-lg mx-auto font-light leading-relaxed">
              Your order is all set. We've got it from here.
            </p>
          </div>

          {/* Bakery Atelier Stamp */}
          <div className="pt-1 flex items-center justify-center gap-3 text-[11px] text-[#A89F95] font-serif italic">
            <span>Maison Éloise Boulangerie</span>
            <span>•</span>
            <span>Est. 2018</span>
            <span>•</span>
            <span>Slow Fermentation &amp; Hearth Baking</span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* MAIN TWO-COLUMN CONTENT GRID (Desktop: 2 cols, Mobile: 1 col) */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =============================================================== */}
          {/* LEFT COLUMN: ORDER SUMMARY & ITEMS + EMAIL NOTIFICATION */}
          {/* =============================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* ORDER SUMMARY CARD */}
            <div 
              id="order-summary-card"
              className="bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-4">
                <div>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-[#1F1A16]">
                    YOUR ORDER
                  </h2>
                  <span className="text-xs text-[#7A6E65] font-light">
                    {totalItemCount} {totalItemCount === 1 ? 'fresh bake' : 'fresh bakes'} reserved
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#A87438] bg-[#EFE8DD] px-2.5 py-1 rounded-md">
                    {isPickup ? 'Click & Collect' : 'Refrigerated Courier'}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4 divide-y divide-[#E8DFD5]/60">
                {activeOrder.items.map((item, idx) => (
                  <div 
                    key={item.id || idx} 
                    className={`flex items-center justify-between gap-4 ${idx > 0 ? 'pt-4' : ''}`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-[#DCD1C4]"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-[#EFE8DD] flex items-center justify-center text-[#7A6E65] shrink-0 border border-[#DCD1C4]">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                      
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-[#1F1A16] truncate">
                          {item.quantity} × {item.product?.name || 'Artisan Bake'}
                        </h3>
                        {item.product?.frenchName && (
                          <p className="text-xs text-[#7A6E65] font-serif italic truncate">
                            {item.product.frenchName}
                          </p>
                        )}
                        {item.selectedVariant && (
                          <span className="inline-block mt-0.5 text-[11px] text-[#A87438] font-medium bg-[#EFE8DD]/70 px-2 py-0.5 rounded">
                            {item.selectedVariant.name}
                          </span>
                        )}
                        {item.customNote && (
                          <p className="text-[11px] text-[#7A6E65] italic mt-0.5">
                            "{item.customNote}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-display text-sm sm:text-base font-bold text-[#1F1A16]">
                        €{(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="block text-[11px] text-[#7A6E65]">
                          €{item.unitPrice.toFixed(2)} each
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="border-t border-[#E8DFD5] pt-4 space-y-2.5 text-xs sm:text-sm text-[#4A3F35]">
                <div className="flex justify-between items-center">
                  <span className="text-[#7A6E65]">Subtotal</span>
                  <span className="font-semibold text-[#1F1A16]">
                    €{activeOrder.subtotal.toFixed(2)}
                  </span>
                </div>

                {activeOrder.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-[#1E5631]">
                    <span>Discount {activeOrder.couponCode ? `(${activeOrder.couponCode})` : ''}</span>
                    <span className="font-semibold">-€{activeOrder.discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-[#7A6E65]">
                    {isPickup ? 'Store Pickup' : 'Delivery / Courier'}
                  </span>
                  <span className="font-semibold text-[#1F1A16]">
                    {activeOrder.deliveryFee === 0 ? (
                      <span className="text-[#1E5631] font-bold">Free</span>
                    ) : (
                      `€${activeOrder.deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="border-t border-[#E8DFD5] pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="font-display text-base sm:text-lg font-bold text-[#1F1A16] block">
                      Total
                    </span>
                    <span className="text-[11px] text-[#A89F95] font-light">
                      Includes 7% bakery VAT (€{activeOrder.taxAmount ? activeOrder.taxAmount.toFixed(2) : (activeOrder.total * 0.07).toFixed(2)})
                    </span>
                  </div>
                  <span className="font-display text-2xl sm:text-3xl font-bold text-[#1F1A16]">
                    €{activeOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* EMAIL CONFIRMATION NOTICE */}
            <div 
              id="email-confirmation-card"
              className="bg-[#FFFFFF] rounded-2xl border border-[#E8DFD5] p-5 sm:p-6 flex items-start gap-4 shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] flex items-center justify-center text-[#C49258] shrink-0 mt-0.5">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs sm:text-sm min-w-0 flex-1">
                <p className="text-[#7A6E65]">
                  Confirmation sent to{' '}
                  <strong className="font-bold text-[#1F1A16] break-all">{customerEmail}</strong>
                </p>
                <p className="text-xs text-[#A89F95] font-light">
                  Didn't receive it? Check your spam folder or{' '}
                  <button 
                    type="button" 
                    onClick={() => setActiveView('contact')}
                    className="text-[#C49258] hover:underline font-medium"
                  >
                    contact us
                  </button>.
                </p>
              </div>
            </div>

          </div>

          {/* =============================================================== */}
          {/* RIGHT COLUMN: ORDER REFERENCE, FULFILLMENT & WHAT'S NEXT */}
          {/* =============================================================== */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* PROMINENT ORDER REFERENCE CARD */}
            <div 
              id="order-reference-card"
              className="bg-[#FAF7F2] rounded-3xl border-2 border-[#DCD1C4] p-6 sm:p-7 shadow-xs space-y-4 relative overflow-hidden"
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#A87438] block">
                  Official Bakery Ticket
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[#1F1A16]">
                  ORDER #{activeOrder.orderNumber}
                </div>
                <p className="text-xs text-[#7A6E65] font-light">
                  {isPickup 
                    ? 'Keep this reference handy when you collect your order.'
                    : 'Keep this reference handy to track your delivery.'}
                </p>
              </div>

              {/* COPY REFERENCE BUTTON */}
              <button
                type="button"
                id="copy-order-reference-btn"
                onClick={() => handleCopyReference(activeOrder.orderNumber)}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${
                  copied 
                    ? 'bg-[#1E5631] text-[#FAF7F2] border-[#1E5631]'
                    : 'bg-[#FFFFFF] hover:bg-[#EFE8DD] text-[#1F1A16] border-[#DCD1C4] shadow-2xs'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#FAF7F2]" />
                    <span>COPIED TO CLIPBOARD</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#C49258]" />
                    <span>COPY REFERENCE</span>
                  </>
                )}
              </button>
            </div>

            {/* FULFILLMENT CARD (PICKUP OR DELIVERY) */}
            <div 
              id="fulfillment-card"
              className="bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] p-6 sm:p-7 shadow-xs space-y-5"
            >
              {isPickup ? (
                /* PICKUP DETAILS */
                <>
                  <div className="flex items-center gap-2.5 text-[#1F1A16]">
                    <div className="w-8 h-8 rounded-lg bg-[#EFE8DD] text-[#C49258] flex items-center justify-center shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#A87438] block">
                        Collection Method
                      </span>
                      <h3 className="font-display text-base font-bold text-[#1F1A16]">
                        READY FOR PICKUP
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-[#4A3F35] bg-[#FFFFFF] rounded-2xl p-4 border border-[#E8DFD5]">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#C49258] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold text-[#1F1A16]">
                          Maison Éloise {branch.city || 'Lyon'}
                        </strong>
                        <span className="text-[#7A6E65] block font-light">
                          {branch.address || '12 Rue des Fleurs'}
                        </span>
                        <span className="text-[#7A6E65] block font-light">
                          {branch.postalCode || '69002'} {branch.city || 'Lyon'}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-[#E8DFD5]/60 pt-2.5 flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-[#C49258] shrink-0" />
                      <div>
                        <span className="text-[#7A6E65] text-xs">Date: </span>
                        <strong className="text-[#1F1A16] font-semibold">{formattedDate}</strong>
                      </div>
                    </div>

                    <div className="border-t border-[#E8DFD5]/60 pt-2.5 flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#C49258] shrink-0" />
                      <div>
                        <span className="text-[#7A6E65] text-xs">Window: </span>
                        <strong className="text-[#1F1A16] font-semibold">{activeOrder.deliveryTimeSlot}</strong>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#7A6E65] font-light italic">
                    "Your order will be waiting for you during this window."
                  </p>
                </>
              ) : (
                /* DELIVERY DETAILS */
                <>
                  <div className="flex items-center gap-2.5 text-[#1F1A16]">
                    <div className="w-8 h-8 rounded-lg bg-[#EFE8DD] text-[#C49258] flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#A87438] block">
                        Fulfillment Window
                      </span>
                      <h3 className="font-display text-base font-bold text-[#1F1A16]">
                        DELIVERY
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-[#4A3F35] bg-[#FFFFFF] rounded-2xl p-4 border border-[#E8DFD5]">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#C49258] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold text-[#1F1A16]">Delivery Address</strong>
                        <span className="text-[#7A6E65] block font-light">
                          {activeOrder.customer.address?.street || 'Customer Address'}
                          {activeOrder.customer.address?.apartment ? `, ${activeOrder.customer.address.apartment}` : ''}
                        </span>
                        <span className="text-[#7A6E65] block font-light">
                          {activeOrder.customer.address?.postalCode} {activeOrder.customer.address?.city}, {activeOrder.customer.address?.country}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-[#E8DFD5]/60 pt-2.5 flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-[#C49258] shrink-0" />
                      <div>
                        <span className="text-[#7A6E65] text-xs">Scheduled: </span>
                        <strong className="text-[#1F1A16] font-semibold">{formattedDate}</strong>
                      </div>
                    </div>

                    <div className="border-t border-[#E8DFD5]/60 pt-2.5 flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#C49258] shrink-0" />
                      <div>
                        <span className="text-[#7A6E65] text-xs">Window: </span>
                        <strong className="text-[#1F1A16] font-semibold">{activeOrder.deliveryTimeSlot}</strong>
                      </div>
                    </div>

                    <div className="border-t border-[#E8DFD5]/60 pt-2.5">
                      <span className="text-[11px] text-[#1E5631] font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#1E5631]" />
                        Status: Temperature controlled dispatch scheduled
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#7A6E65] font-light italic">
                    "Our refrigerated courier will deliver your bakes fresh during this window."
                  </p>
                </>
              )}
            </div>

            {/* WHAT HAPPENS NEXT */}
            <div 
              id="whats-next-card"
              className="bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] p-6 sm:p-7 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C49258]" />
                <h3 className="font-display text-base font-bold text-[#1F1A16]">
                  What's next?
                </h3>
              </div>

              <div className="space-y-3">
                {/* Step 01 */}
                <div className="flex items-start gap-3.5 bg-[#FFFFFF] rounded-2xl p-3.5 border border-[#E8DFD5]">
                  <span className="font-mono text-xs font-bold text-[#C49258] bg-[#FAF7F2] px-2 py-1 rounded-md border border-[#E8DFD5]">
                    01
                  </span>
                  <div className="space-y-0.5 text-xs">
                    <strong className="font-bold text-[#1F1A16] block uppercase tracking-wider text-[11px]">
                      WE PREPARE
                    </strong>
                    <p className="text-[#7A6E65] font-light leading-relaxed">
                      We'll get your order ready fresh for your selected time.
                    </p>
                  </div>
                </div>

                {/* Step 02 */}
                <div className="flex items-start gap-3.5 bg-[#FFFFFF] rounded-2xl p-3.5 border border-[#E8DFD5]">
                  <span className="font-mono text-xs font-bold text-[#C49258] bg-[#FAF7F2] px-2 py-1 rounded-md border border-[#E8DFD5]">
                    02
                  </span>
                  <div className="space-y-0.5 text-xs">
                    <strong className="font-bold text-[#1F1A16] block uppercase tracking-wider text-[11px]">
                      WE LET YOU KNOW
                    </strong>
                    <p className="text-[#7A6E65] font-light leading-relaxed">
                      We'll send you an update when it's ready.
                    </p>
                  </div>
                </div>

                {/* Step 03 */}
                <div className="flex items-start gap-3.5 bg-[#FFFFFF] rounded-2xl p-3.5 border border-[#E8DFD5]">
                  <span className="font-mono text-xs font-bold text-[#C49258] bg-[#FAF7F2] px-2 py-1 rounded-md border border-[#E8DFD5]">
                    03
                  </span>
                  <div className="space-y-0.5 text-xs">
                    <strong className="font-bold text-[#1F1A16] block uppercase tracking-wider text-[11px]">
                      YOU ENJOY
                    </strong>
                    <p className="text-[#7A6E65] font-light leading-relaxed">
                      {isPickup 
                        ? 'Come by, pick it up and enjoy it while it\'s fresh.'
                        : 'Our courier delivers it straight to your door to enjoy while it\'s fresh.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* IMPORTANT CUSTOMER INFORMATION / REMINDER */}
            <div 
              id="reminder-card"
              className="bg-[#EFE8DD]/70 rounded-2xl border border-[#DCD1C4] p-4 sm:p-5 flex items-start gap-3"
            >
              <Info className="w-4 h-4 text-[#A87438] shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs text-[#4A3F35]">
                <strong className="font-bold text-[#1F1A16] block">
                  A little reminder
                </strong>
                <p className="font-light">
                  {isPickup 
                    ? 'Please bring your order reference when you arrive.'
                    : 'Keep an eye on your phone around your selected delivery window.'}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* ================================================================= */}
        {/* CLEAR NAVIGATION & ACTION BUTTONS (The user MUST NOT get stuck) */}
        {/* ================================================================= */}
        <div 
          id="confirmation-navigation-section"
          className="pt-6 sm:pt-8 border-t border-[#E8DFD5] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Primary: CONTINUE SHOPPING → */}
            <button
              type="button"
              id="primary-continue-shopping-btn"
              onClick={() => navigateToMenuWithSearch('')}
              className="bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-8 py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-md group shrink-0 min-h-[48px]"
            >
              <span>CONTINUE SHOPPING</span>
              <ArrowRight className="w-4 h-4 text-[#C49258] transition-transform group-hover:translate-x-1" />
            </button>

            {/* Secondary: BACK TO HOME */}
            <button
              type="button"
              id="secondary-back-home-btn"
              onClick={() => {
                setActiveView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#FAF7F2] hover:bg-[#EFE8DD] text-[#1F1A16] px-6 py-4 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider border border-[#DCD1C4] transition-all flex items-center justify-center gap-2 shrink-0 min-h-[48px]"
            >
              <span>BACK TO HOME</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* VIEW MY ORDERS / TRACK THIS ORDER */}
            <button
              type="button"
              id="view-orders-btn"
              onClick={() => {
                setActiveView('track-order');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#FFFFFF] hover:bg-[#EFE8DD] text-[#7A6E65] hover:text-[#1F1A16] border border-[#E8DFD5] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-3.5 h-3.5 text-[#C49258]" />
              <span>VIEW MY ORDERS</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#A89F95]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
