import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Plus, 
  Tag, 
  Trash2, 
  Check, 
  X, 
  Percent, 
  DollarSign, 
  Calendar, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Coupon } from '../../types';

export const AdminCoupons: React.FC = () => {
  const { coupons, setCoupons, addToast } = useBakery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmCode, setDeleteConfirmCode] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    discountValue: 15,
    minimumOrder: 25,
    expiresAt: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    description: '15% off orders over €25',
    isActive: true,
  });

  const handleOpenAdd = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 15,
      minimumOrder: 25,
      expiresAt: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      description: '15% off orders over €25',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.code.trim()) {
      addToast('Coupon code is required', 'error');
      return;
    }

    const newCoupon: Coupon = {
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType || 'percentage',
      discountValue: Number(formData.discountValue) || 10,
      minimumOrder: Number(formData.minimumOrder) || 0,
      usedCount: 0,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : new Date(Date.now() + 86400000 * 30).toISOString(),
      description: formData.description || `${formData.discountValue}${formData.discountType === 'percentage' ? '%' : '€'} discount`,
      isActive: formData.isActive !== false,
    };

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon),
      });
      if (res.ok) {
        setCoupons(prev => [...prev.filter(c => c.code !== newCoupon.code), newCoupon]);
        addToast(`Promo code ${newCoupon.code} created`, 'success');
      }
    } catch {
      setCoupons(prev => [...prev.filter(c => c.code !== newCoupon.code), newCoupon]);
      addToast(`Promo code ${newCoupon.code} created locally`, 'info');
    }

    setIsModalOpen(false);
  };

  const handleToggleActive = (code: string) => {
    setCoupons(prev => prev.map(c => {
      if (c.code === code) {
        const next = !c.isActive;
        addToast(`Promo code ${code} is now ${next ? 'active' : 'paused'}`, 'info');
        return { ...c, isActive: next };
      }
      return c;
    }));
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    addToast(`Promo code ${code} removed`, 'info');
    setDeleteConfirmCode(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2C2420]">Promotions &amp; Voucher Codes</h2>
          <p className="text-xs text-[#8C827A]">
            Create promotional discount codes for special events, newsletter subscribers, and morning regulars
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#2C2420] hover:bg-[#3D332D] text-[#FAF7F2] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promo Code</span>
        </button>
      </div>

      {/* Coupon Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(coupon => (
          <div 
            key={coupon.code}
            className={`bg-white rounded-3xl border p-5 shadow-sm space-y-4 transition-all ${
              coupon.isActive ? 'border-[#EBE3D7]' : 'border-[#E0D8CE] opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="font-mono text-base font-bold text-[#2C2420] bg-[#FAF8F5] px-3 py-1 rounded-xl border border-[#EBE3D7] inline-block tracking-wider">
                  {coupon.code}
                </span>
                <p className="text-xs text-[#5A5047] font-medium pt-1">{coupon.description}</p>
              </div>

              <button
                onClick={() => setDeleteConfirmCode(coupon.code)}
                className="p-1.5 rounded-lg text-[#8C827A] hover:text-[#C53030] hover:bg-[#FFF5F5] transition-colors"
                title="Delete Coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-[#FAF8F5] p-3 rounded-2xl border border-[#EDE4D8]">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#8C827A]">Discount</span>
                <div className="font-serif font-bold text-sm text-[#2C2420]">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `€${coupon.discountValue.toFixed(2)} OFF`}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-[#8C827A]">Min. Order</span>
                <div className="font-serif font-bold text-sm text-[#2C2420]">
                  {coupon.minimumOrder ? `€${coupon.minimumOrder.toFixed(2)}` : 'No Minimum'}
                </div>
              </div>
            </div>

            {/* Status & Expiry */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[11px] text-[#8C827A] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C49258]" />
                <span>Exp: {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'}</span>
              </span>

              <button
                onClick={() => handleToggleActive(coupon.code)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  coupon.isActive
                    ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                    : 'bg-[#FFF5F5] text-[#C53030] border border-[#FED7D7]'
                }`}
              >
                {coupon.isActive ? 'Active' : 'Paused'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE COUPON MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EBE3D7] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EBE3D7] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2C2420]">Create New Promo Voucher</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8C827A] hover:text-[#2C2420]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                  Voucher Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. BONJOUR15"
                  className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType || 'percentage'}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full bg-[#FAF8F5] border border-[#E0D8CE] rounded-xl px-3 py-2 text-xs text-[#2C2420] outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.discountValue || 15}
                    onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#FAF8F5] border border-[#E0D8CE] rounded-xl px-3 py-2 text-xs text-[#2C2420] outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                    Min Order (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minimumOrder || 20}
                    onChange={(e) => setFormData({ ...formData, minimumOrder: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#FAF8F5] border border-[#E0D8CE] rounded-xl px-3 py-2 text-xs text-[#2C2420] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt ? formData.expiresAt.split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E0D8CE] rounded-xl px-3 py-2 text-xs text-[#2C2420] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                  Description / Customer Summary
                </label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 15% off your first artisan morning basket"
                  className="w-full bg-[#FAF8F5] border border-[#E0D8CE] rounded-xl px-3.5 py-2 text-xs text-[#2C2420] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EBE3D7]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E0D8CE] text-xs font-bold uppercase text-[#5A5047] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2C2420] hover:bg-[#3D332D] text-[#FAF7F2] text-xs font-bold uppercase shadow-sm"
                >
                  Activate Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteConfirmCode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EBE3D7] shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5F5] text-[#C53030] flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-serif text-lg font-bold text-[#2C2420]">Delete Voucher {deleteConfirmCode}?</h4>
              <p className="text-xs text-[#8C827A]">
                Customers will no longer be able to apply this promotion during checkout.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmCode(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#E0D8CE] text-xs font-bold uppercase text-[#5A5047] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCoupon(deleteConfirmCode)}
                className="flex-1 py-2.5 rounded-xl bg-[#C53030] hover:bg-[#9B2C2C] text-white text-xs font-bold uppercase"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
