import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { X, ShieldCheck, ShieldAlert, FileText, RefreshCw } from 'lucide-react';

export const LegalModal: React.FC = () => {
  const { activeLegalDoc, setActiveLegalDoc } = useBakery();

  if (!activeLegalDoc) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F1A16]/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-[#FAF7F2] text-[#2C241E] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#E8DFD5] overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#1F1A16] text-[#FAF7F2] px-6 py-5 flex items-center justify-between border-b border-[#C49258]/30">
          <div className="flex items-center gap-3">
            {activeLegalDoc === 'privacy' && <FileText className="w-5 h-5 text-[#C49258]" />}
            {activeLegalDoc === 'terms' && <ShieldCheck className="w-5 h-5 text-[#C49258]" />}
            {activeLegalDoc === 'allergens' && <ShieldAlert className="w-5 h-5 text-[#C49258]" />}
            {activeLegalDoc === 'refunds' && <RefreshCw className="w-5 h-5 text-[#C49258]" />}
            <div>
              <h3 className="font-display text-lg font-bold">
                {activeLegalDoc === 'privacy' && 'GDPR Privacy Policy & Data Protection'}
                {activeLegalDoc === 'terms' && 'Terms of Service & Ordering Agreement'}
                {activeLegalDoc === 'allergens' && 'Allergen Directory & Atelier Safety Policy'}
                {activeLegalDoc === 'refunds' && 'Freshness Guarantee & Cancellation Terms'}
              </h3>
              <span className="text-[11px] text-[#A89F95] font-light">
                Maison Saint-Honoré Artisans S.A. • Compliant with EU Regulations
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveLegalDoc(null)}
            className="p-1.5 rounded-full text-[#A89F95] hover:text-[#FAF7F2] hover:bg-[#2C241E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-4 text-xs text-[#4A3F35] leading-relaxed">
          {activeLegalDoc === 'privacy' && (
            <>
              <h4 className="font-display text-base font-bold text-[#1F1A16]">1. Data Controller & Scope</h4>
              <p>Maison Saint-Honoré Artisans S.A. processes your personal data (name, email, delivery address, phone number) strictly to bake, fulfill, and deliver your artisan bakery orders under General Data Protection Regulation (EU) 2016/679 (GDPR).</p>
              
              <h4 className="font-display text-base font-bold text-[#1F1A16] pt-2">2. Processing & Storage</h4>
              <p>Your payment data is securely processed via PCI-DSS Level 1 compliant gateways. We do not store full credit card numbers on our servers. Your contact information is kept strictly for fulfillment and order tracking notifications.</p>

              <h4 className="font-display text-base font-bold text-[#1F1A16] pt-2">3. Your GDPR Rights</h4>
              <p>You have the right to request access to, rectification of, or erasure of your personal data at any time by contacting our Data Protection Officer at privacy@maisonsainthonore.com.</p>
            </>
          )}

          {activeLegalDoc === 'terms' && (
            <>
              <h4 className="font-display text-base font-bold text-[#1F1A16]">1. Artisan Nature of Products</h4>
              <p>All breads, pastries, and entremets are handcrafted daily using traditional slow-fermentation and baking techniques. Minor artisanal variations in crust color, scoring pattern, and crumb structure are the mark of genuine artisan craftsmanship.</p>

              <h4 className="font-display text-base font-bold text-[#1F1A16] pt-2">2. Lead Times & Order Cutoff</h4>
              <p>Daily morning viennoiserie and bread orders require an evening cutoff of 20:00 for next-day 07:30 pickup. Custom celebratory cakes and multi-tiered wedding cakes require a minimum lead time of 5 to 7 days.</p>

              <h4 className="font-display text-base font-bold text-[#1F1A16] pt-2">3. Collection & Non-Pickup</h4>
              <p>Orders designated for Click & Collect are held for the duration of the chosen opening window. Because our items contain no artificial preservatives, items uncollected at closing cannot be refunded or stored overnight.</p>
            </>
          )}

          {activeLegalDoc === 'allergens' && (
            <>
              <div className="bg-[#FAF0E6] p-4 rounded-xl border border-[#E6C594] space-y-1.5">
                <h4 className="font-display text-sm font-bold text-[#8C5511] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Atelier Allergen Advisory
                </h4>
                <p className="text-[11px] text-[#6E420C]">
                  Our ateliers handle Wheat/Gluten, Milk, Eggs, Tree Nuts (Almonds, Hazelnuts, Pistachios, Walnuts, Pecans), Soy, and Sesame. While we maintain rigorous HACCP separation protocols, cross-contact risk cannot be 100% eliminated for individuals with severe airborne or anaphylactic allergies.
                </p>
              </div>

              <h4 className="font-display text-base font-bold text-[#1F1A16] pt-2">EU 14 Major Allergen Table</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Cereals containing Gluten:</strong> Used in our sourdoughs, baguettes, croissants, brioches, and tarts. (Our Macarons are made with 100% almond flour and contain no wheat).</li>
                <li><strong>Milk / Dairy:</strong> Used across our Viennoiserie (84% Charentes-Poitou AOP French butter), Crème Pâtissière, and Buttercreams. (Dark Sourdough Loaf is 100% dairy-free).</li>
                <li><strong>Eggs:</strong> Present in Brioche, Choux pastry, Macaron shells, and Custards.</li>
                <li><strong>Nuts:</strong> Almonds in Frangipane & Macarons; Hazelnuts in Paris-Brest; Bronte Pistachios in Pistachio Entremet.</li>
              </ul>
            </>
          )}

          {activeLegalDoc === 'refunds' && (
            <>
              <h4 className="font-display text-base font-bold text-[#1F1A16]">1. 100% Freshness Guarantee</h4>
              <p>We guarantee that every product you receive was baked on the day of delivery or pickup. If an item arrives damaged during refrigerated transit, please photograph it and report within 4 hours for an immediate re-bake or full refund.</p>

              <h4 className="font-display text-base font-bold text-[#1F1A16] pt-2">2. Cancellations</h4>
              <p>Standard menu orders may be modified or cancelled up to 24 hours before the scheduled time slot. Bespoke custom cakes may be cancelled up to 72 hours before delivery for a full refund; cancellations within 72 hours are subject to a 50% ingredient staging fee.</p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F4EFEA] px-6 py-4 border-t border-[#E8DFD5] flex justify-end">
          <button
            onClick={() => setActiveLegalDoc(null)}
            className="bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
