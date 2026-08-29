import React, { useState, useEffect } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Save, 
  Sparkles, 
  Megaphone, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Truck, 
  ShieldCheck,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { StoreContent } from '../../types';

export const AdminContentCMS: React.FC = () => {
  const { storeContent, updateStoreContent, addToast } = useBakery();
  const [formData, setFormData] = useState<StoreContent>(storeContent);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(storeContent);
  }, [storeContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateStoreContent(formData);
      addToast('Storefront content and settings saved successfully!', 'success');
    } catch {
      addToast('Saved locally', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2C2420]">Storefront CMS &amp; Configuration</h2>
          <p className="text-xs text-[#8C827A]">
            Customize live announcement banners, contact information, delivery rules, and brand statements
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-[#2C2420] hover:bg-[#3D332D] text-[#FAF7F2] px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-[#D4AF37]" />
          <span>{isSaving ? 'Publishing Changes...' : 'Save & Publish Live'}</span>
        </button>
      </div>

      {/* Section 1: Live Announcement Top Banner */}
      <div className="bg-white rounded-3xl border border-[#EBE3D7] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#2C2420]">
          <Megaphone className="w-4 h-4 text-[#C49258]" />
          <span>Top Announcement Banner (Customer Storefront)</span>
        </div>

        <label className="flex items-center gap-2.5 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E0D8CE] cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(formData.announcement?.enabled)}
            onChange={(e) => setFormData({
              ...formData,
              announcement: {
                ...formData.announcement,
                enabled: e.target.checked,
                text: formData.announcement?.text || 'Fresh morning sourdough & viennoiserie out of the oven daily at 07:00 AM.',
              }
            })}
            className="w-4 h-4 rounded text-[#C49258] focus:ring-0"
          />
          <span className="text-xs font-bold text-[#2C2420]">
            Enable Announcement Ribbon on all pages
          </span>
        </label>

        {formData.announcement?.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                Announcement Message
              </label>
              <input
                type="text"
                value={formData.announcement?.text || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  announcement: {
                    ...formData.announcement,
                    text: e.target.value,
                  }
                })}
                placeholder="e.g. Free delivery on artisan breakfast baskets over €35 with code BONJOUR15"
                className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                CTA Link Text (Optional)
              </label>
              <input
                type="text"
                value={formData.announcement?.linkText || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  announcement: {
                    ...formData.announcement,
                    linkText: e.target.value,
                  }
                })}
                placeholder="e.g. Order Breakfast"
                className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Contact Information & Hours */}
      <div className="bg-white rounded-3xl border border-[#EBE3D7] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#2C2420]">
          <Phone className="w-4 h-4 text-[#C49258]" />
          <span>Boutique Contact, Address &amp; Operating Hours</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
              Main Telephone
            </label>
            <input
              type="text"
              value={formData.contact?.phone || ''}
              onChange={(e) => setFormData({
                ...formData,
                contact: { ...formData.contact, phone: e.target.value }
              })}
              className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
              WhatsApp Order Line
            </label>
            <input
              type="text"
              value={formData.contact?.whatsapp || ''}
              onChange={(e) => setFormData({
                ...formData,
                contact: { ...formData.contact, whatsapp: e.target.value }
              })}
              className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
              Customer Support Email
            </label>
            <input
              type="email"
              value={formData.contact?.email || ''}
              onChange={(e) => setFormData({
                ...formData,
                contact: { ...formData.contact, email: e.target.value }
              })}
              className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
              Flagship Boutique Address
            </label>
            <input
              type="text"
              value={formData.contact?.address || ''}
              onChange={(e) => setFormData({
                ...formData,
                contact: { ...formData.contact, address: e.target.value }
              })}
              className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
              Opening Hours Summary
            </label>
            <input
              type="text"
              value={formData.hours?.summary || ''}
              onChange={(e) => setFormData({
                ...formData,
                hours: { ...formData.hours, summary: e.target.value }
              })}
              className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Delivery Rules & Minimums */}
      <div className="bg-white rounded-3xl border border-[#EBE3D7] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#2C2420]">
          <Truck className="w-4 h-4 text-[#C49258]" />
          <span>Checkout &amp; Delivery Rules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
              Minimum Order (€)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.deliveryPolicy?.minOrder || 15}
              onChange={(e) => setFormData({
                ...formData,
                deliveryPolicy: {
                  ...formData.deliveryPolicy,
                  minOrder: parseFloat(e.target.value) || 0,
                  freeThreshold: formData.deliveryPolicy?.freeThreshold || 35,
                  standardFee: formData.deliveryPolicy?.standardFee || 3.50,
                  estimatedTime: formData.deliveryPolicy?.estimatedTime || '35-45 mins',
                }
              })}
              className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
              Free Delivery Threshold (€)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.deliveryPolicy?.freeThreshold || 35}
              onChange={(e) => setFormData({
                ...formData,
                deliveryPolicy: {
                  ...formData.deliveryPolicy,
                  freeThreshold: parseFloat(e.target.value) || 0,
                  minOrder: formData.deliveryPolicy?.minOrder || 15,
                  standardFee: formData.deliveryPolicy?.standardFee || 3.50,
                  estimatedTime: formData.deliveryPolicy?.estimatedTime || '35-45 mins',
                }
              })}
              className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
              Standard Courier Fee (€)
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={formData.deliveryPolicy?.standardFee || 3.50}
              onChange={(e) => setFormData({
                ...formData,
                deliveryPolicy: {
                  ...formData.deliveryPolicy,
                  standardFee: parseFloat(e.target.value) || 0,
                  minOrder: formData.deliveryPolicy?.minOrder || 15,
                  freeThreshold: formData.deliveryPolicy?.freeThreshold || 35,
                  estimatedTime: formData.deliveryPolicy?.estimatedTime || '35-45 mins',
                }
              })}
              className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none font-bold"
            />
          </div>
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-[#2C2420] hover:bg-[#3D332D] text-[#FAF7F2] px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-[#D4AF37]" />
          <span>{isSaving ? 'Publishing Changes...' : 'Save & Publish Live'}</span>
        </button>
      </div>
    </form>
  );
};
