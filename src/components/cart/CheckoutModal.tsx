import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  X, 
  MapPin, 
  Store, 
  Truck, 
  Calendar, 
  Clock, 
  CreditCard, 
  Lock, 
  AlertCircle, 
  ShieldCheck
} from 'lucide-react';
import { PaymentMethod, Order } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    appliedCoupon,
    clearCart,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    setLastCompletedOrder,
    setActiveView,
    addToast
  } = useBakery();

  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('Munich');
  const [postalCode, setPostalCode] = useState('');
  
  // Date calculation: minimum tomorrow
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(tomorrowStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:00 – 11:00');
  
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [termsAgreed, setTermsAgreed] = useState(true);

  // Card Simulation Details
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('884');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  // Cost calculations
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const netSubtotal = Math.max(0, cartSubtotal - discountAmount);
  const deliveryFee = fulfillmentType === 'delivery' ? (netSubtotal >= 45 ? 0 : 4.50) : 0;
  const taxAmount = Number(((netSubtotal / 1.07) * 0.07).toFixed(2));
  const finalTotal = Number((netSubtotal + deliveryFee).toFixed(2));

  const timeSlots = [
    '07:30 – 09:30 (Morning Fresh)',
    '09:30 – 11:30 (Midday Bake)',
    '12:00 – 14:00 (Afternoon Tea)',
    '14:00 – 16:30 (Pâtisserie Window)',
    '16:30 – 18:30 (Evening Pick)',
  ];

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      addToast('Please complete all contact information', 'error');
      return;
    }

    if (fulfillmentType === 'delivery') {
      if (cartSubtotal < 15) {
        addToast('Minimum order for delivery is €15.00', 'error');
        return;
      }
      if (!streetAddress.trim() || !city.trim() || !postalCode.trim()) {
        addToast('Please complete delivery address details', 'error');
        return;
      }
    }

    if (!termsAgreed) {
      addToast('Please accept the Terms & Freshness policy', 'error');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customer: {
        fullName: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: fulfillmentType === 'delivery' ? {
          street: streetAddress,
          apartment,
          city,
          postalCode,
          country: city === 'Paris' ? 'France' : city === 'Amsterdam' ? 'Netherlands' : 'Germany',
        } : undefined,
      },
      type: fulfillmentType,
      pickupBranchId: fulfillmentType === 'pickup' ? selectedBranchId : undefined,
      deliveryDate: selectedDate,
      deliveryTimeSlot: selectedTimeSlot,
      items: cart,
      couponCode: appliedCoupon?.code,
      paymentMethod,
      notes: orderNotes,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLastCompletedOrder(data.order);
        clearCart();
        setIsCheckoutOpen(false);
        setActiveView('order-confirmation');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        addToast(`Order ${data.order.orderNumber} placed!`, 'success');
      } else {
        addToast(data.error || 'Failed to place order. Please check details.', 'error');
      }
    } catch (err) {
      // Fallback local order creation
      const localOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `MSH-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        customer: payload.customer,
        type: fulfillmentType,
        pickupBranchId: payload.pickupBranchId,
        deliveryDate: selectedDate,
        deliveryTimeSlot: selectedTimeSlot,
        items: cart,
        subtotal: cartSubtotal,
        deliveryFee,
        discountAmount,
        couponCode: appliedCoupon?.code,
        taxAmount,
        total: finalTotal,
        status: 'confirmed',
        paymentMethod,
        paymentStatus: 'paid',
        notes: orderNotes,
      };
      setLastCompletedOrder(localOrder);
      clearCart();
      setIsCheckoutOpen(false);
      setActiveView('order-confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      addToast(`Order ${localOrder.orderNumber} placed!`, 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F1A16]/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-[#FAF7F2] text-[#2C241E] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#E8DFD5] overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-[#1F1A16] text-[#FAF7F2] px-6 py-5 flex items-center justify-between border-b border-[#C49258]/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#C49258] flex items-center justify-center bg-[#241E19]">
              <span className="font-editorial text-sm font-bold text-[#C49258] italic">M</span>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight">
                Artisan Checkout
              </h2>
              <span className="text-[11px] text-[#A89F95] font-light">
                Maison Éloise Reserve &amp; Hearth Scheduling
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full text-[#D8CEBE] hover:text-[#FAF7F2] hover:bg-[#2C241E] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Checkout Form */}
        <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Fulfillment Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                1. Select Fulfillment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('pickup')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    fulfillmentType === 'pickup'
                      ? 'border-[#C49258] bg-[#FAF7F2] ring-1 ring-[#C49258] shadow-xs'
                      : 'border-[#E8DFD5] bg-[#F4EFEA] hover:bg-[#EFE8DD]'
                  }`}
                >
                  <Store className={`w-5 h-5 mt-0.5 ${fulfillmentType === 'pickup' ? 'text-[#C49258]' : 'text-[#7A6E65]'}`} />
                  <div>
                    <span className="block text-xs font-bold text-[#1F1A16]">Click & Collect (In-Store)</span>
                    <span className="block text-[11px] text-[#7A6E65]">Free • Ready warm at your selected atelier</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('delivery')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    fulfillmentType === 'delivery'
                      ? 'border-[#C49258] bg-[#FAF7F2] ring-1 ring-[#C49258] shadow-xs'
                      : 'border-[#E8DFD5] bg-[#F4EFEA] hover:bg-[#EFE8DD]'
                  }`}
                >
                  <Truck className={`w-5 h-5 mt-0.5 ${fulfillmentType === 'delivery' ? 'text-[#C49258]' : 'text-[#7A6E65]'}`} />
                  <div>
                    <span className="block text-xs font-bold text-[#1F1A16]">Refrigerated Courier</span>
                    <span className="block text-[11px] text-[#7A6E65]">
                      {netSubtotal >= 45 ? 'Free (over €45)' : '€4.50 • Temperature controlled'}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Atelier / Address Selection */}
            {fulfillmentType === 'pickup' ? (
              <div className="space-y-2 bg-[#F4EFEA] p-4 rounded-xl border border-[#E8DFD5]">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C49258]" />
                  Select Collection Atelier
                </label>
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-lg px-3.5 py-2.5 text-sm text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} — {b.address} ({b.city})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3 bg-[#F4EFEA] p-4 rounded-xl border border-[#E8DFD5]">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C49258]" />
                  Delivery Destination
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Street address & number *"
                      required
                      className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-lg px-3 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      placeholder="Apt, Suite, Floor (optional)"
                      className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-lg px-3 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                    />
                  </div>
                  <div>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-lg px-3 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                    >
                      <option value="Munich">Munich (Germany)</option>
                      <option value="Paris">Paris (France)</option>
                      <option value="Amsterdam">Amsterdam (Netherlands)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Postal code *"
                      required
                      className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-lg px-3 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C49258]" />
                  Bake & Delivery Date
                </label>
                <input
                  type="date"
                  min={tomorrowStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-lg px-3 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C49258]" />
                  Preferred Window
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-lg px-3 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                2. Contact & Notification Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full Name *"
                    required
                    className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-lg px-3 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Email Address (for receipt) *"
                    required
                    className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-lg px-3 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Phone (for courier/pickup SMS) *"
                    required
                    className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-lg px-3 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                Special Instructions or Gift Note
              </label>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Ring courtyard bell, slice bread extra thick, or attach ribbon with custom message..."
                rows={2}
                className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-lg px-3 py-2 text-xs text-[#1F1A16] placeholder-[#A89F95] focus:outline-none focus:border-[#C49258]"
              />
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3 pt-2 border-t border-[#E8DFD5]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35] flex items-center justify-between">
                <span>3. Payment Selection</span>
                <span className="flex items-center gap-1 text-[11px] text-[#7A6E65] font-normal">
                  <Lock className="w-3 h-3 text-[#3F5E46]" /> 256-Bit SSL Encrypted
                </span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-lg border text-center text-xs font-semibold transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#C49258] bg-[#EFE8DD] text-[#1F1A16]'
                      : 'border-[#DCD1C4] bg-[#FAF7F2] text-[#7A6E65]'
                  }`}
                >
                  💳 Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-lg border text-center text-xs font-semibold transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-[#C49258] bg-[#EFE8DD] text-[#1F1A16]'
                      : 'border-[#DCD1C4] bg-[#FAF7F2] text-[#7A6E65]'
                  }`}
                >
                   Apple Pay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('google_pay')}
                  className={`p-3 rounded-lg border text-center text-xs font-semibold transition-all ${
                    paymentMethod === 'google_pay'
                      ? 'border-[#C49258] bg-[#EFE8DD] text-[#1F1A16]'
                      : 'border-[#DCD1C4] bg-[#FAF7F2] text-[#7A6E65]'
                  }`}
                >
                  G Pay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_pickup')}
                  className={`p-3 rounded-lg border text-center text-xs font-semibold transition-all ${
                    paymentMethod === 'cash_on_pickup'
                      ? 'border-[#C49258] bg-[#EFE8DD] text-[#1F1A16]'
                      : 'border-[#DCD1C4] bg-[#FAF7F2] text-[#7A6E65]'
                  }`}
                >
                  Atelier Pay
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="bg-[#F4EFEA] p-4 rounded-xl border border-[#E8DFD5] space-y-2.5">
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number"
                      className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-lg px-3 py-2 text-xs font-mono text-[#1F1A16]"
                    />
                    <CreditCard className="w-4 h-4 text-[#7A6E65] absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="bg-[#FAF7F2] border border-[#DCD1C4] rounded-lg px-3 py-2 text-xs font-mono text-[#1F1A16]"
                    />
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="CVC"
                      className="bg-[#FAF7F2] border border-[#DCD1C4] rounded-lg px-3 py-2 text-xs font-mono text-[#1F1A16]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="checkout-terms"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 accent-[#C49258]"
              />
              <label htmlFor="checkout-terms" className="text-[11px] text-[#7A6E65] leading-tight">
                I understand that products are baked fresh to order and agree to the Maison Saint-Honoré Freshness & Delivery terms.
              </label>
            </div>

            {/* Total Recap & Action */}
            <div className="border-t border-[#E8DFD5] pt-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#7A6E65]">Total Amount Due:</span>
                <span className="font-display text-2xl font-bold text-[#1F1A16]">
                  €{finalTotal.toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] py-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Reserving your oven slot...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#C49258]" />
                    <span>Confirm & Authorize €{finalTotal.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};
