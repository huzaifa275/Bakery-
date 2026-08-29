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
  Sparkles, 
  Truck, 
  Store,
  CheckCircle2
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1F1A16]/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] text-[#2C241E] shadow-2xl flex flex-col justify-between border-l border-[#E8DFD5] animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E8DFD5] flex items-center justify-between bg-[#F4EFEA]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#C49258]" />
              <h2 className="font-display text-xl font-bold tracking-tight text-[#1F1A16]">
                Your Artisan Basket
              </h2>
              <span className="bg-[#1F1A16] text-[#FAF7F2] text-xs font-semibold px-2 py-0.5 rounded-full">
                {cartItemCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-[#7A6E65] hover:text-[#1F1A16] hover:bg-[#E8DFD5] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {cart.length > 0 && (
            <div className="bg-[#ECE5DD] px-6 py-3 border-b border-[#E8DFD5]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-[#4A3F35] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#C49258]" />
                  {remainingForFreeShipping > 0 ? (
                    <>Add <strong className="text-[#1F1A16]">€{remainingForFreeShipping.toFixed(2)}</strong> for free delivery</>
                  ) : (
                    <span className="text-[#3F5E46] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Complimentary refrigerated delivery unlocked!
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-semibold text-[#7A6E65]">
                  €{cartSubtotal.toFixed(2)} / €{FREE_SHIPPING_THRESHOLD.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-[#DCD1C4] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#C49258] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EFE8DD] flex items-center justify-center text-[#A89F95]">
                  <ShoppingBag className="w-8 h-8 text-[#C49258]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-[#1F1A16]">
                    Your basket is empty
                  </h3>
                  <p className="text-xs text-[#7A6E65] max-w-xs">
                    Our morning baguettes, laminated croissants, and handcrafted entremets are waiting for you.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveView('menu');
                  }}
                  className="bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all"
                >
                  Explore Artisan Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-4 bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E8DFD5] shadow-2xs group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg shrink-0 border border-[#E8DFD5]"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-display text-sm font-bold text-[#1F1A16] leading-tight">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#A89F95] hover:text-rose-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <span className="inline-block text-[11px] text-[#7A6E65] font-medium bg-[#F4EFEA] px-2 py-0.5 rounded mt-1">
                          {item.selectedVariant.name}
                        </span>
                      )}

                      {item.customNote && (
                        <p className="text-[11px] text-[#A87438] italic mt-0.5">
                          Note: "{item.customNote}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F4EFEA]">
                      {/* Quantity selector */}
                      <div className="flex items-center border border-[#DCD1C4] rounded-md bg-[#FAF7F2]">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="p-1 hover:bg-[#E8DFD5] text-[#4A3F35] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#1F1A16]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="p-1 hover:bg-[#E8DFD5] text-[#4A3F35] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-semibold text-sm text-[#1F1A16]">
                        €{(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#E8DFD5] bg-[#F4EFEA] space-y-4">
              {/* Promo Code Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#EFE8DD] border border-[#C49258]/40 px-3 py-2 rounded-lg text-xs">
                    <div className="flex items-center gap-1.5 text-[#2C241E]">
                      <Tag className="w-3.5 h-3.5 text-[#C49258]" />
                      <span>Code: <strong>{appliedCoupon.code}</strong> (-€{appliedCoupon.discountAmount.toFixed(2)})</span>
                    </div>
                    <button
                      onClick={removeCouponCode}
                      className="text-rose-600 hover:underline text-[11px] font-medium"
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
                      className="bg-[#FAF7F2] border border-[#DCD1C4] rounded-lg px-3 py-1.5 text-xs text-[#1F1A16] uppercase placeholder-[#A89F95] focus:outline-none focus:border-[#C49258] flex-1"
                    />
                    <button
                      type="submit"
                      disabled={promoLoading}
                      className="bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
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
              <div className="space-y-1.5 text-xs text-[#4A3F35]">
                <div className="flex justify-between">
                  <span>Basket Subtotal:</span>
                  <span className="font-medium text-[#1F1A16]">€{cartSubtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-[#3F5E46] font-medium">
                    <span>Discount Privilege:</span>
                    <span>-€{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] text-[#7A6E65]">
                  <span>Estimated 7% Bakery VAT:</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#7A6E65]">
                  <span>Fulfillment:</span>
                  <span>Calculated at checkout (Free pickup)</span>
                </div>
                <div className="border-t border-[#DCD1C4] pt-2 flex justify-between text-base font-bold text-[#1F1A16]">
                  <span>Estimated Total:</span>
                  <span className="font-display text-lg text-[#1F1A16]">€{estimatedTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] py-3.5 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#C49258] group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[11px] text-center text-[#7A6E65]">
                Fresh morning bake guaranteed • Contactless packaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
