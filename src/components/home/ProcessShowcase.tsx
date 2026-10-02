import React from 'react';
import { Sparkles, Clock, Flame, Truck } from 'lucide-react';

export const ProcessShowcase: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: '48-Hour Fermentation',
      subtitle: 'Living Wild Levain',
      description:
        'We feed our heirloom wild sourdough starter with stoneground organic flour and pure water, giving every batch a full 48-hour cold fermentation to build complex crust and digestible airy crumb.',
      icon: Clock,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      badge: 'Zero Commercial Yeast',
    },
    {
      step: '02',
      title: 'French Butter Lamination',
      subtitle: '27 Folded Golden Layers',
      description:
        'Crafted with 84% fat cultured butter from Normandy. Dough and butter are chilled, rolled, folded, and turned three times to achieve our signature whisper-light, honeycombed interior.',
      icon: Flame,
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
      badge: 'Normandy Cultured Butter',
    },
    {
      step: '03',
      title: 'Fresh Morning Delivery',
      subtitle: 'Direct from Hearth Oven',
      description:
        'Our bakers begin baking at 4:00 AM so the baguettes, country loaves, and viennoiserie arrive warm at counter pickup and delivered in temperature-guarded packaging before breakfast.',
      icon: Truck,
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80',
      badge: 'Baked Fresh Hourly',
    },
  ];

  return (
    <section 
      id="process"
      aria-label="Artisan baking process"
      className="relative py-20 lg:py-28 bg-[#1E1511] text-[#FDFBF7] overflow-hidden"
    >
      {/* Background glow and subtle flour atmosphere */}
      <div className="absolute inset-0 bg-espresso-glow pointer-events-none opacity-60" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C86D51]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A373]/15 border border-[#D4A373]/30 text-xs text-[#D4A373] uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>The Artisan Method</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#FDFBF7] leading-tight">
            Our 3-Stage Hearth Philosophy
          </h2>

          <p className="text-sm sm:text-base text-[#D8CEBE] font-light leading-relaxed max-w-xl mx-auto">
            Great bread cannot be rushed. We honour century-old French baking craft with patience, stoneground grains, and uncompromised technique.
          </p>
        </div>

        {/* 3-Column Editorial Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-[#261B16] rounded-3xl p-8 border border-stone-800/80 shadow-xl flex flex-col justify-between overflow-hidden group hover:border-[#D4A373]/40 transition-all duration-300"
              >
                {/* Subtle Numbering Watermark */}
                <span 
                  className="absolute -top-4 right-4 font-serif text-8xl font-bold text-[#FDFBF7]/5 select-none pointer-events-none group-hover:text-[#D4A373]/10 transition-colors duration-500"
                  aria-hidden="true"
                >
                  {item.step}
                </span>

                <div className="space-y-6 relative z-10">
                  {/* Step Image Thumbnail */}
                  <div className="relative aspect-16/10 rounded-2xl overflow-hidden border border-stone-800/80 bg-[#1E1511]">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out opacity-85 group-hover:opacity-100"
                    />
                    <div className="absolute top-3 left-3 bg-[#1E1511]/85 backdrop-blur-xs text-[#D4A373] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                      {item.badge}
                    </div>
                  </div>

                  {/* Icon & Title */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#C86D51] text-xs font-semibold uppercase tracking-wider">
                      <Icon className="w-4 h-4 text-[#D4A373]" />
                      <span>{item.step}. {item.subtitle}</span>
                    </div>

                    <h3 className="font-display text-2xl font-semibold text-[#FDFBF7] tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  {/* Prose */}
                  <p className="text-xs sm:text-sm text-[#D8CEBE] font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom subtle divider line */}
                <div className="mt-8 pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-[#A89F95]">
                  <span>Pâtisserie Normande</span>
                  <span className="text-[#D4A373] group-hover:translate-x-1 transition-transform">Chapter {item.step} →</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
