import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { 
  Instagram, 
  Facebook, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldAlert, 
  Check, 
  Award, 
  Coffee,
  Heart
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
    <footer className="bg-[#191512] text-[#FAF7F2] border-t border-[#2C241E] relative z-10">
      {/* Top Value Strip */}
      <div className="border-b border-[#2C241E] py-8 px-5 sm:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start p-2">
            <div className="w-10 h-10 rounded-full bg-[#2C241E] flex items-center justify-center text-[#C49258] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-sm text-[#FAF7F2]">48h Cold Fermentation</h5>
              <p className="text-xs text-[#A89F95]">Stoneground French flours, natural wild levain.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-2">
            <div className="w-10 h-10 rounded-full bg-[#2C241E] flex items-center justify-center text-[#C49258] shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-sm text-[#FAF7F2]">Baked Fresh Hourly</h5>
              <p className="text-xs text-[#A89F95]">Warm croissants and sourdough throughout the day.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-2">
            <div className="w-10 h-10 rounded-full bg-[#2C241E] flex items-center justify-center text-[#C49258] shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-sm text-[#FAF7F2]">Real French Butter</h5>
              <p className="text-xs text-[#A89F95]">84% Charentes-Poitou cultured butter and pure chocolate.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Brand Col (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-1">
              <span className="font-display text-2xl font-bold tracking-tight text-[#FAF7F2] block">
                MAISON ÉLOISE
              </span>
              <span className="text-[11px] tracking-[0.25em] uppercase text-[#C49258] font-medium block">
                BAKERY &amp; COFFEE
              </span>
            </div>
            
            <p className="text-xs leading-relaxed text-[#A89F95] max-w-sm">
              An artisan European bakery and coffee counter in Lyon, Paris and Lille. We bake honest bread, slow-laminated viennoiserie, and celebration cakes every single morning.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-[#FAF7F2] block mb-2">
                Morning Bakes &amp; Weekend Specials
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-[#241E19] p-3 rounded-lg border border-emerald-800/30">
                  <Check className="w-4 h-4" />
                  <span>Merci! You are on our morning specials list.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="flex-1 bg-[#241E19] border border-[#3E342B] rounded-lg px-3.5 py-2.5 text-xs text-[#FAF7F2] placeholder-[#7A6E65] focus:outline-none focus:border-[#C49258]"
                  />
                  <button
                    type="submit"
                    className="bg-[#C49258] hover:bg-[#B37E43] text-[#191512] px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-2 text-[#A89F95]">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#241E19] hover:text-[#C49258] rounded-full transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#241E19] hover:text-[#C49258] rounded-full transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="mailto:bonjour@maisoneloise.com" className="p-2 bg-[#241E19] hover:text-[#C49258] rounded-full transition-colors" aria-label="Email Maison Éloise">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Bakery Menu Column */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-[#FAF7F2] border-b border-[#2C241E] pb-2">
              Our Bakes
            </h4>
            <ul className="space-y-2 text-xs font-light text-[#A89F95]">
              <li>
                <button onClick={() => setActiveView('menu')} className="hover:text-[#C49258] transition-colors">
                  Slow-Fermented Sourdough
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('menu')} className="hover:text-[#C49258] transition-colors">
                  Pure Butter Croissants
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('menu')} className="hover:text-[#C49258] transition-colors">
                  Valrhona Pain au Chocolat
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('custom-cakes')} className="hover:text-[#C49258] transition-colors text-[#E6C594] font-medium">
                  Custom Cake Builder →
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('gift-boxes')} className="hover:text-[#C49258] transition-colors">
                  Pastry Hampers &amp; Boxes
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('seasonal')} className="hover:text-[#C49258] transition-colors">
                  Seasonal Fruit Tarts
                </button>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-[#FAF7F2] border-b border-[#2C241E] pb-2">
              Guest Services
            </h4>
            <ul className="space-y-2 text-xs font-light text-[#A89F95]">
              <li>
                <button onClick={() => setActiveView('menu')} className="hover:text-[#C49258] transition-colors">
                  Click &amp; Collect Orders
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('weddings-events')} className="hover:text-[#C49258] transition-colors">
                  Weddings &amp; Event Catering
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('track-order')} className="hover:text-[#C49258] transition-colors">
                  Track My Order
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('about')} className="hover:text-[#C49258] transition-colors">
                  About Our Bakery
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('reviews')} className="hover:text-[#C49258] transition-colors">
                  Customer Reviews
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('faq')} className="hover:text-[#C49258] transition-colors">
                  FAQ &amp; Allergens
                </button>
              </li>
            </ul>
          </div>

          {/* Locations & Opening Hours Column */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-[#FAF7F2] border-b border-[#2C241E] pb-2">
              Bakery Locations
            </h4>
            <div className="space-y-3.5 text-xs text-[#A89F95] font-light">
              <div>
                <p className="text-[#FAF7F2] font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C49258]" /> Lyon (Flagship)
                </p>
                <p>12 Rue des Fleurs, 69002 Lyon</p>
                <p className="text-[11px] text-[#7A6E65] flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-[#C49258]" /> Mon–Fri: 07:00–18:30 | Sat–Sun: 08:00–17:00
                </p>
              </div>

              <div>
                <p className="text-[#FAF7F2] font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C49258]" /> Paris Atelier
                </p>
                <p>18 Rue Saint-Honoré, 75001 Paris</p>
                <p className="text-[11px] text-[#7A6E65]">Mon–Fri: 07:00–18:30 | Sat–Sun: 08:00–17:00</p>
              </div>

              <div>
                <p className="text-[#FAF7F2] font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C49258]" /> Lille Centre
                </p>
                <p>44 Rue de la Monnaie, 59800 Lille</p>
                <p className="text-[11px] text-[#7A6E65]">Mon–Fri: 07:30–18:30 | Sat–Sun: 08:00–17:00</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar & Legal Links */}
      <div className="border-t border-[#241E19] py-6 px-5 sm:px-8 lg:px-10 text-xs text-[#7A6E65]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Maison Éloise — Bakery &amp; Coffee. All rights reserved.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <button
              onClick={() => setActiveLegalDoc('privacy')}
              className="hover:text-[#FAF7F2] transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveLegalDoc('terms')}
              className="hover:text-[#FAF7F2] transition-colors"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveLegalDoc('allergens')}
              className="hover:text-[#FAF7F2] transition-colors flex items-center gap-1"
            >
              <ShieldAlert className="w-3 h-3 text-[#C49258]" />
              Allergen Guide
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveLegalDoc('refunds')}
              className="hover:text-[#FAF7F2] transition-colors"
            >
              Order &amp; Collection Policy
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setActiveView('admin');
                window.history.pushState({}, '', '/admin');
              }}
              className="hover:text-[#D4AF37] transition-colors text-[#7A6E65] flex items-center gap-1 font-medium"
              title="Maison Éloise Management & Atelier Access"
            >
              <span>Atelier Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
