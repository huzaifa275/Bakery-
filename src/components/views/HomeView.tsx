import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Hero } from '../home/Hero';
import { MenuGrid } from '../home/MenuGrid';
import { ProcessShowcase } from '../home/ProcessShowcase';
import { SocialProofSection } from '../home/SocialProofSection';
import { Sparkles, ArrowRight, MapPin, Phone, Clock, ShoppingBag } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setActiveView, branches } = useBakery();

  return (
    <div className="w-full bg-[#FDFBF7] text-[#1E1511] overflow-x-hidden">
      
      {/* 1. Hero Section (High Conversion, Organic Feel, Dual CTA, Trust Badges, Floating Mini-Badge) */}
      <Hero />

      {/* 2. Interactive Menu & Filtering Engine (Category Tabs, Debounced Search, Product Cards) */}
      <MenuGrid />

      {/* 3. Story & Process Showcase (Editorial 3-Column 01/02/03 with Numbering Watermarks) */}
      <ProcessShowcase />

      {/* 4. Bespoke Celebration Cakes & Wedding Showcase Banner */}
      <section 
        id="bespoke-cakes" 
        aria-label="Custom cake builder spotlight"
        className="py-16 sm:py-20 bg-[#F7F3EB] border-b border-stone-200/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1E1511] text-[#FDFBF7] rounded-3xl p-8 sm:p-12 lg:p-14 border border-[#D4A373]/30 shadow-2xl relative overflow-hidden">
            
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C86D51]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A373]/20 text-[#D4A373] text-xs uppercase tracking-widest font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>Bespoke Celebration Atelier</span>
                </div>

                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-tight">
                  Got a celebration in mind? <br />
                  <span className="italic font-serif text-[#D4A373]">We will bake it for your day.</span>
                </h2>

                <p className="text-xs sm:text-sm text-[#D8CEBE] font-light leading-relaxed max-w-xl">
                  Birthdays, intimate weddings, anniversaries, and weekend celebrations. Choose your sponge, fillings, Swiss meringue buttercream, and custom calligraphy in our interactive builder.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    type="button"
                    id="home-cake-builder-btn"
                    onClick={() => setActiveView('custom-cakes')}
                    className="bg-[#C86D51] hover:bg-[#B35E43] text-[#FDFBF7] font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#FDFBF7]" />
                    <span>Launch Cake Builder</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveView('weddings-events')}
                    className="bg-transparent hover:bg-stone-800/60 text-[#FDFBF7] border border-stone-700 px-6 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Weddings &amp; Large Events
                  </button>
                </div>

                <div className="pt-2 text-xs text-[#A89F95] flex flex-wrap items-center gap-4">
                  <span>✓ 48-Hour Notice</span>
                  <span aria-hidden="true">·</span>
                  <span>✓ Hand-Piped Inscriptions</span>
                  <span aria-hidden="true">·</span>
                  <span>✓ Counter Pickup or Chilled Delivery</span>
                </div>
              </div>

              <div className="lg:col-span-4 relative hidden sm:block">
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-square border border-stone-800 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=85"
                    alt="Handcrafted artisan celebration cake with buttercream and florals"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1511]/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. Authentic Social Proof & Customer Reviews */}
      <SocialProofSection />

      {/* 6. Bakery Atelier Locations Showcase */}
      <section 
        id="locations" 
        aria-label="Bakery locations"
        className="py-16 sm:py-24 bg-[#FDFBF7] border-b border-stone-200/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#C86D51] font-bold">
              Counters &amp; Ateliers
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1E1511]">
              Visit Our Bakery
            </h2>
            <p className="text-xs sm:text-sm text-[#5D5047] font-light">
              Stop by for warm bread from the ovens, morning coffee, or quick pre-order pickup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {branches.map((branch) => (
              <div 
                key={branch.id}
                className="bg-[#FFFFFF] rounded-2xl border border-stone-200/80 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#D4A373]/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-[#F7F3EB]">
                    <img
                      src={branch.image}
                      alt={branch.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-[#1E1511]/80 backdrop-blur-xs text-emerald-400 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Open Today</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-display text-lg font-bold text-[#1E1511]">
                      {branch.name}
                    </h3>

                    <p className="text-xs text-[#5D5047] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C86D51] shrink-0" />
                      <span>{branch.address}, {branch.postalCode}</span>
                    </p>

                    <div className="text-xs text-[#7A6E65] space-y-1 pt-2 border-t border-stone-100">
                      <p><strong className="text-[#1E1511] font-medium">Mon – Fri:</strong> {branch.hours.weekdays}</p>
                      <p><strong className="text-[#1E1511] font-medium">Sat – Sun:</strong> {branch.hours.saturday}</p>
                    </div>

                    <p className="text-xs text-[#7A6E65] flex items-center gap-1.5 pt-1">
                      <Phone className="w-3 h-3 text-[#C86D51]" />
                      <span>{branch.phone}</span>
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => setActiveView('locations')}
                    className="w-full bg-[#F7F3EB] hover:bg-[#EFE8DD] text-[#1E1511] border border-stone-200 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    View Map &amp; Directions
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Final Order Ahead CTA Banner */}
      <section 
        id="final-callout"
        aria-label="Order ahead call to action"
        className="py-16 sm:py-20 bg-[#F7F3EB] text-[#1E1511]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <span className="text-xs uppercase tracking-widest text-[#C86D51] font-bold">
            Start Your Morning Right
          </span>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-tight">
            Fresh bread and golden pastries are waiting.
          </h2>

          <p className="text-xs sm:text-sm text-[#5D5047] font-light max-w-lg mx-auto leading-relaxed">
            Reserve ahead for quick counter collection, or order directly for morning delivery across Lyon, Paris &amp; Lille.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => setActiveView('menu')}
              className="w-full sm:w-auto bg-[#1E1511] hover:bg-[#C86D51] text-[#FDFBF7] font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4A373]" />
              <span>Order Online Now</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('locations')}
              className="w-full sm:w-auto bg-[#FFFFFF] hover:bg-[#FDFBF7] text-[#1E1511] border border-stone-300 font-semibold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#C86D51]" />
              <span>Find Nearest Bakery</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
