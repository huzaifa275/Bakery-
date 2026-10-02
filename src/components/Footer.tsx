import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { 
  Instagram, 
  Facebook, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Check, 
  Award, 
  Coffee,
  Heart,
  Send,
  ExternalLink
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setActiveLegalDoc } = useBakery();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#1E1511] text-[#FDFBF7] border-t border-[#2A1D17] relative z-10">
      
      {/* Top Value Badges Strip */}
      <div className="border-b border-[#2A1D17] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          
          <div className="flex items-center gap-4 justify-center md:justify-start p-2">
            <div className="w-11 h-11 rounded-2xl bg-[#261B16] border border-[#D4A373]/20 flex items-center justify-center text-[#D4A373] shrink-0 shadow-2xs">
              <Award className="w-5 h-5 text-[#D4A373]" />
            </div>
            <div>
              <h5 className="font-semibold text-sm text-[#FDFBF7]">48h Cold Fermentation</h5>
              <p className="text-xs text-[#A89F95]">Stoneground French grains, pure water, natural starter.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-2">
            <div className="w-11 h-11 rounded-2xl bg-[#261B16] border border-[#D4A373]/20 flex items-center justify-center text-[#D4A373] shrink-0 shadow-2xs">
              <Coffee className="w-5 h-5 text-[#D4A373]" />
            </div>
            <div>
              <h5 className="font-semibold text-sm text-[#FDFBF7]">Baked Fresh Hourly</h5>
              <p className="text-xs text-[#A89F95]">Warm croissants and sourdough pulled fresh from ovens.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-2">
            <div className="w-11 h-11 rounded-2xl bg-[#261B16] border border-[#D4A373]/20 flex items-center justify-center text-[#D4A373] shrink-0 shadow-2xs">
              <Heart className="w-5 h-5 text-[#D4A373]" />
            </div>
            <div>
              <h5 className="font-semibold text-sm text-[#FDFBF7]">Real French Butter</h5>
              <p className="text-xs text-[#A89F95]">84% Charentes-Poitou cultured butter and Valrhona cacao.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand & Newsletter Column (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-1">
              <span className="font-display text-2xl font-bold tracking-tight text-[#FDFBF7] block">
                MAISON ÉLOISE
              </span>
              <span className="text-[10px] tracking-[0.26em] uppercase text-[#D4A373] font-semibold block">
                ARTISAN BAKERY &amp; COFFEE
              </span>
            </div>
            
            <p className="text-xs leading-relaxed text-[#A89F95] max-w-sm">
              Artisan neighbourhood bakery and coffee counter in Lyon, Paris, and Lille. Slow-fermented sourdough, all-butter croissants, morning bakes, and celebration cakes baked fresh every morning.
            </p>

            {/* Newsletter Signup with Interactive Success Feedback */}
            <div className="pt-2 max-w-sm">
              <span className="text-xs font-semibold text-[#FDFBF7] block mb-2">
                Morning Specials &amp; Weekend Pastry Dispatch
              </span>
              
              {subscribed ? (
                <div className="flex items-center gap-2.5 text-xs text-emerald-400 bg-[#261B16] p-3.5 rounded-xl border border-emerald-800/40 animate-in fade-in duration-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Merci! You're on our morning specials list.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 bg-[#261B16] border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-[#FDFBF7] placeholder-[#7A6E65] focus:outline-none focus:border-[#C86D51] transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-[#C86D51] hover:bg-[#B35E43] text-[#FDFBF7] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Join</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2 text-[#A89F95]">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 bg-[#261B16] hover:text-[#D4A373] hover:bg-[#2F211B] rounded-xl transition-colors" 
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 bg-[#261B16] hover:text-[#D4A373] hover:bg-[#2F211B] rounded-xl transition-colors" 
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Menu Column (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-[#FDFBF7] border-b border-stone-800/80 pb-2">
              Our Bakes
            </h4>
            <ul className="space-y-2 text-xs font-light text-[#A89F95]">
              <li>
                <button onClick={() => setActiveView('menu')} className="hover:text-[#D4A373] transition-colors cursor-pointer">
                  Artisan Sourdough
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('menu')} className="hover:text-[#D4A373] transition-colors cursor-pointer">
                  All-Butter Croissants
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('menu')} className="hover:text-[#D4A373] transition-colors cursor-pointer">
                  Pain au Chocolat
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('custom-cakes')} className="hover:text-[#D4A373] text-[#D4A373] font-medium transition-colors cursor-pointer">
                  Custom Cake Builder →
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('gift-boxes')} className="hover:text-[#D4A373] transition-colors cursor-pointer">
                  Gift Hampers &amp; Boxes
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('seasonal')} className="hover:text-[#D4A373] transition-colors cursor-pointer">
                  Seasonal Tarts
                </button>
              </li>
            </ul>
          </div>

          {/* Guest Services Column (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-[#FDFBF7] border-b border-stone-800/80 pb-2">
              Services
            </h4>
            <ul className="space-y-2 text-xs font-light text-[#A89F95]">
              <li>
                <button onClick={() => setActiveView('menu')} className="hover:text-[#D4A373] transition-colors cursor-pointer">
                  Online Click &amp; Collect
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('weddings-events')} className="hover:text-[#D4A373] transition-colors cursor-pointer">
                  Weddings &amp; Catering
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('track-order')} className="hover:text-[#D4A373] transition-colors cursor-pointer">
                  Track My Order
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('reviews')} className="hover:text-[#D4A373] transition-colors cursor-pointer">
                  Customer Reviews
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('faq')} className="hover:text-[#D4A373] transition-colors cursor-pointer">
                  FAQ &amp; Allergens
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('contact')} className="hover:text-[#D4A373] transition-colors cursor-pointer">
                  Contact Bakery
                </button>
              </li>
            </ul>
          </div>

          {/* Opening Hours & Google Maps Column (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-[#FDFBF7] border-b border-stone-800/80 pb-2">
              Visit Our Atelier
            </h4>
            
            <div className="space-y-3.5 text-xs text-[#A89F95] font-light">
              {/* Opening Hours Status */}
              <div className="p-3 bg-[#261B16] rounded-xl border border-stone-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Open Today: 7 AM – 9 PM</span>
                </div>
                <p className="text-[11px] text-[#A89F95]">
                  Counter service &amp; online pre-order collections
                </p>
              </div>

              {/* Address with Google Maps link */}
              <div>
                <p className="text-[#FDFBF7] font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D4A373]" /> 
                  <span>Flagship Lyon Bakery</span>
                </p>
                <p className="mt-0.5">12 Rue des Fleurs, 69002 Lyon, France</p>
                
                <a
                  href="https://maps.google.com/?q=12+Rue+des+Fleurs+69002+Lyon+France"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#D4A373] hover:underline mt-1 font-medium"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <p className="text-[#FDFBF7] font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>Regular Schedule</span>
                </p>
                <p className="text-[11px]">Mon – Sun: 07:00 – 21:00 (Ovens hot at 4 AM)</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-[#2A1D17] py-6 px-4 sm:px-6 lg:px-8 text-xs text-[#7A6E65]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Maison Éloise — Artisan Patisserie &amp; Sourdough. All rights reserved.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <button
              onClick={() => setActiveLegalDoc('privacy')}
              className="hover:text-[#FDFBF7] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveLegalDoc('terms')}
              className="hover:text-[#FDFBF7] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveLegalDoc('allergens')}
              className="hover:text-[#FDFBF7] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ShieldAlert className="w-3 h-3 text-[#D4A373]" />
              Allergen Guide
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                setActiveView('admin');
                window.history.pushState({}, '', '/admin');
              }}
              className="hover:text-[#D4A373] transition-colors text-[#7A6E65] cursor-pointer"
            >
              Atelier Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
