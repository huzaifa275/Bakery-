import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { ShoppingBag, ArrowRight, Wheat, Clock, Sparkles, MapPin, Star } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveView } = useBakery();
  const [imgError, setImgError] = useState(false);

  const heroImage = "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=85";

  return (
    <section 
      id="hero"
      aria-label="Bakery introduction"
      className="relative overflow-hidden bg-[#FDFBF7] py-12 md:py-20 lg:py-24 border-b border-stone-200/60"
    >
      {/* Soft radial glow & organic flour background texture */}
      <div className="absolute inset-0 pointer-events-none bg-flour-texture" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#D4A373]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-96 h-96 rounded-full bg-[#C86D51]/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Narrative & Dual CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Morning Status Pill / Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F3EB] border border-[#D4A373]/30 text-xs text-[#1E1511] font-medium shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="tracking-wide">Ovens hot since 4:00 AM · Hearth baked daily</span>
            </div>

            {/* Bold, Appetizing Headline with Italic Accent Word */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1E1511] font-normal tracking-tight leading-[1.12]">
              Slow-baked <span className="italic font-serif text-[#C86D51] font-normal">daily</span> with organic grains &amp; French butter
            </h1>

            {/* Subheading Narrative */}
            <p className="text-base sm:text-lg text-[#5D5047] font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Every loaf rests for 48 hours to unlock natural wild fermentation. Every croissant is laminated with 84% churned cultured butter for golden, paper-thin flakes.
            </p>

            {/* Dual Call to Action */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              {/* Primary CTA with subtle hover lift and scale */}
              <button
                type="button"
                id="hero-explore-btn"
                onClick={() => setActiveView('menu')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1E1511] hover:bg-[#C86D51] text-[#FDFBF7] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4A373] group-hover:text-[#FDFBF7] transition-colors" />
                <span>Explore Fresh Bakes</span>
              </button>

              {/* Ghost Secondary Button with arrow hover transition */}
              <button
                type="button"
                id="hero-story-btn"
                onClick={() => setActiveView('about')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-transparent hover:bg-[#F7F3EB] text-[#1E1511] border border-stone-300 text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Our Story</span>
                <ArrowRight className="w-4 h-4 text-[#C86D51] group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* Trust Badges Strip Beneath Hero */}
            <div className="pt-6 border-t border-stone-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-5 sm:gap-8 text-xs font-medium text-[#7A6E65]">
              <div className="flex items-center gap-2">
                <Wheat className="w-4 h-4 text-[#C86D51]" />
                <span>100% Organic Sourdough</span>
              </div>
              <span className="text-stone-300 hidden sm:inline" aria-hidden="true">·</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C86D51]" />
                <span>Baked at 4:00 AM Daily</span>
              </div>
              <span className="text-stone-300 hidden sm:inline" aria-hidden="true">·</span>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C86D51]" />
                <span>Locally Sourced</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Imagery with Floating Decorative Mini-Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Decorative Frame Drop Shadow & Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#D4A373]/30 to-[#C86D51]/10 -rotate-2 transform scale-102 filter blur-sm"></div>

              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200/60 aspect-4/3 sm:aspect-5/4 bg-[#F7F3EB]">
                {!imgError ? (
                  <img
                    src={heroImage}
                    alt="Artisan bakery table with fresh sourdough, golden croissants, and morning pastries"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#F7F3EB] to-[#EFE8DD] p-8 text-center">
                    <span className="text-5xl mb-3">🥐</span>
                    <h3 className="font-display text-xl font-bold text-[#1E1511]">Maison Éloise Bakery</h3>
                    <p className="text-xs text-[#5D5047] mt-1">Artisan French baking since dawn</p>
                  </div>
                )}

                {/* Subtle gradient overlay at bottom for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1511]/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Decorative Mini-Badge over Hero Imagery */}
              <div className="absolute -bottom-5 -left-4 sm:-bottom-6 sm:-left-6 bg-[#FFFFFF]/95 backdrop-blur-md border border-stone-200/80 rounded-2xl p-4 shadow-xl flex items-center gap-3.5 transition-transform hover:-translate-y-1 duration-300">
                <div className="w-10 h-10 rounded-xl bg-[#F7F3EB] flex items-center justify-center text-amber-500 shadow-2xs">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-sm text-[#1E1511]">4.9 / 5</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">Verified</span>
                  </div>
                  <p className="text-[11px] text-[#7A6E65] font-light">From 1,200+ pastry lovers</p>
                </div>
              </div>

              {/* Floating Mini Ribbon: French Butter */}
              <div className="hidden sm:flex absolute -top-4 -right-4 bg-[#1E1511] text-[#FDFBF7] border border-[#D4A373]/30 rounded-xl px-3.5 py-2 shadow-lg items-center gap-2 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                <span className="font-medium tracking-wide">84% Charentes Butter</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
