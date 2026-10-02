import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartItemCount,
    appliedCoupon,
    applyCouponCode,
    removeCouponCode,
    setIsCheckoutOpen,
    setActiveView,
  } = useBakery();

  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 45.00;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const estimatedTax = Number((cartSubtotal * 0.055).toFixed(2)); // Standard 5.5% artisan bakery VAT in France
  const estimatedTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError(null);
    const res = await applyCouponCode(promoInput.trim());
    setPromoLoading(false);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      {/* Backdrop Dim */}
      <div 
        className="fixed inset-0 bg-[#1E1511]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FDFBF7] text-[#1E1511] shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-200/80 flex items-center justify-between bg-[#F7F3EB]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#C86D51]" />
              <h2 className="font-display text-xl font-bold tracking-tight text-[#1E1511]">
                Your Artisan Basket
              </h2>
              <span className="bg-[#1E1511] text-[#FDFBF7] text-xs font-semibold px-2 py-0.5 rounded-full tabular-nums">
                {cartItemCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-[#EFE8DD] transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Progress Bar */}
          {cart.length > 0 && (
            <div className="bg-[#FAF7F2] px-6 py-3.5 border-b border-stone-200/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-[#4A3F35] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#C86D51]" />
                  {remainingForFreeShipping > 0 ? (
                    <span>
                      Add <strong className="text-[#1E1511] font-semibold tabular-nums">€{remainingForFreeShipping.toFixed(2)}</strong> more for Free Same-Day Delivery!
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Free Same-Day Delivery unlocked!
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-semibold text-[#7A6E65] tabular-nums">
                  €{cartSubtotal.toFixed(2)} / €{FREE_SHIPPING_THRESHOLD.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#D4A373] to-[#C86D51] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F7F3EB] flex items-center justify-center text-[#A89F95]">
                  <ShoppingBag className="w-8 h-8 text-[#C86D51]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-[#1E1511]">
                    Your basket is empty
                  </h3>
                  <p className="text-xs text-[#7A6E65] max-w-xs leading-relaxed">
                    Our morning sourdough loaves, flaky viennoiserie, and handcrafted entremets are waiting for you.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveView('menu');
                  }}
                  className="bg-[#1E1511] hover:bg-[#C86D51] text-[#FDFBF7] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Explore Fresh Bakes
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-4 bg-[#FFFFFF] p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-xl shrink-0 border border-stone-200/60 bg-[#F7F3EB]"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-display text-sm font-bold text-[#1E1511] leading-tight line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#A89F95] hover:text-rose-600 transition-colors p-1 rounded-md hover:bg-stone-50 cursor-pointer"
                          aria-label={`Remove ${item.product.name} from basket`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <span className="inline-block text-[11px] text-[#7A6E65] font-medium bg-[#F7F3EB] px-2 py-0.5 rounded mt-1">
                          {item.selectedVariant.name}
                        </span>
                      )}

                      {item.customNote && (
                        <p className="text-[11px] text-[#A87438] italic mt-0.5">
                          Note: "{item.customNote}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-lg bg-[#FDFBF7]">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="p-1.5 hover:bg-[#F7F3EB] text-[#4A3F35] transition-colors rounded-l-lg cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#1E1511] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="p-1.5 hover:bg-[#F7F3EB] text-[#4A3F35] transition-colors rounded-r-lg cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-display font-bold text-sm text-[#1E1511] tabular-nums">
                        €{(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Calculations */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200/80 bg-[#F7F3EB] space-y-4">
              {/* Promo Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#FFFFFF] border border-[#D4A373]/40 px-3.5 py-2 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5 text-[#1E1511]">
                      <Tag className="w-3.5 h-3.5 text-[#C86D51]" />
                      <span>Code: <strong>{appliedCoupon.code}</strong> (-€{appliedCoupon.discountAmount.toFixed(2)})</span>
                    </div>
                    <button
                      onClick={removeCouponCode}
                      className="text-rose-600 hover:underline text-[11px] font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. BONJOUR10)"
                      className="bg-[#FFFFFF] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#1E1511] uppercase placeholder-[#A89F95] focus:outline-none focus:border-[#C86D51] flex-1"
                    />
                    <button
                      type="submit"
                      disabled={promoLoading}
                      className="bg-[#1E1511] hover:bg-[#C86D51] text-[#FDFBF7] px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {promoLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-600 mt-1">{promoError}</p>
                )}
              </div>

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs text-[#5D5047]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium text-[#1E1511] tabular-nums">€{cartSubtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Privilege Discount:</span>
                    <span className="tabular-nums">-€{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] text-[#7A6E65]">
                  <span>Estimated Taxes (Included):</span>
                  <span className="tabular-nums">€{estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#7A6E65]">
                  <span>Fulfillment:</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between text-base font-bold text-[#1E1511]">
                  <span>Estimated Total:</span>
                  <span className="font-display text-xl text-[#1E1511] tabular-nums">€{estimatedTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button with Ripple / Hover Feedback */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full bg-[#1E1511] hover:bg-[#C86D51] text-[#FDFBF7] py-4 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-98 cursor-pointer group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#D4A373] group-hover:text-[#FDFBF7] group-hover:translate-x-1 transition-all duration-200" />
              </button>

              <p className="text-[11px] text-center text-[#7A6E65]">
                🔒 Secure checkout · Temperature-controlled packaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
