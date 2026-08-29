import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Heart, Sparkles, Check, ArrowRight, UtensilsCrossed } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setActiveView } = useBakery();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C49258]/15 border border-[#C49258]/30 text-[#A87438] text-xs uppercase tracking-widest font-semibold">
          <UtensilsCrossed className="w-3.5 h-3.5 text-[#C49258]" />
          Our story
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-[#1F1A16]">
          Good ingredients, proper recipes, <br />
          <span className="italic font-serif text-[#C49258]">and plenty of time.</span>
        </h1>
        <p className="text-sm text-[#7A6E65] font-light leading-relaxed">
          We started this bakery because we wanted to make the sort of bread and pastries we'd happily take home ourselves every morning.
        </p>
      </div>

      {/* Main Story Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5 text-xs sm:text-sm text-[#4A3F35] font-light leading-relaxed">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1F1A16] leading-tight">
            How we do things around here
          </h2>
          <p>
            When we first opened our doors, we made a simple rule: no commercial dough improvers, no shortcuts, and no rushing. Real sourdough takes days to build flavor, structure, and that deep custardy crumb we love.
          </p>
          <p>
            Every loaf starts with natural sourdough culture fed daily with clean water and stoneground flour. We let our dough rest in cold fermentation rooms for two to three days. It gives the bread a crisp blistered crust, complex nutty flavour, and makes it much gentler on your stomach.
          </p>

          <div className="pt-2 grid grid-cols-2 gap-4 text-xs">
            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8DFD5]">
              <span className="font-display text-2xl font-bold text-[#C49258] block">72 Hours</span>
              <span className="text-[#7A6E65]">Slow cold fermentation for natural wild loaves</span>
            </div>
            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8DFD5]">
              <span className="font-display text-2xl font-bold text-[#C49258] block">100%</span>
              <span className="text-[#7A6E65]">Unbleached flours from independent family mills</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <img
            src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=1000&q=85"
            alt="Baker scoring bread before the hearth oven"
            className="rounded-3xl shadow-xl border border-[#E8DFD5] object-cover w-full h-[450px]"
          />
          <div className="absolute -bottom-5 -left-5 bg-[#1F1A16] text-[#FAF7F2] p-5 rounded-2xl border border-[#C49258]/40 shadow-lg hidden sm:block max-w-xs">
            <span className="font-serif italic text-base text-[#E6C594] block">"Bread is alive. You can't rush what takes time to build."</span>
            <span className="text-[10px] text-[#A89F95] block mt-1 uppercase tracking-wider">— From the bakery team</span>
          </div>
        </div>
      </div>

      {/* The 4 Principles */}
      <div className="bg-[#FAF7F2] rounded-3xl p-8 sm:p-12 border border-[#E8DFD5] space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#C49258] font-bold">
            What matters to us
          </span>
          <h3 className="font-display text-3xl font-bold text-[#1F1A16]">
            Four things we never compromise on
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E8DFD5] space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-[#EFE8DD] text-[#C49258] flex items-center justify-center font-bold font-display">
              01
            </div>
            <h4 className="font-display text-base font-bold text-[#1F1A16]">
              Wild Fermentation
            </h4>
            <p className="text-xs text-[#7A6E65] leading-relaxed">
              Living wild sourdough starter fed daily, giving natural lift and rich, honest flavour.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E8DFD5] space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-[#EFE8DD] text-[#C49258] flex items-center justify-center font-bold font-display">
              02
            </div>
            <h4 className="font-display text-base font-bold text-[#1F1A16]">
              Real Churned Butter
            </h4>
            <p className="text-xs text-[#7A6E65] leading-relaxed">
              High-fat European cream butter folded by hand for flaky, golden pastry layers.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E8DFD5] space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-[#EFE8DD] text-[#C49258] flex items-center justify-center font-bold font-display">
              03
            </div>
            <h4 className="font-display text-base font-bold text-[#1F1A16]">
              Unbleached Flours
            </h4>
            <p className="text-xs text-[#7A6E65] leading-relaxed">
              Stoneground grains from sustainable family mills with no chemical additives or enzymes.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E8DFD5] space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-[#EFE8DD] text-[#C49258] flex items-center justify-center font-bold font-display">
              04
            </div>
            <h4 className="font-display text-base font-bold text-[#1F1A16]">
              Baked Daily
            </h4>
            <p className="text-xs text-[#7A6E65] leading-relaxed">
              We bake early every single morning so you always get fresh bread at the counter.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-[#1F1A16] text-[#FAF7F2] rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-[#C49258]/30">
        <h3 className="font-display text-2xl sm:text-4xl font-bold max-w-xl mx-auto">
          Come by for a loaf or coffee
        </h3>
        <p className="text-xs sm:text-sm text-[#D8CEBE] max-w-lg mx-auto">
          We're open every morning from 7:00 AM. Stop by to pick up your favourite loaf or order ahead online.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button
            onClick={() => setActiveView('menu')}
            className="bg-[#C49258] hover:bg-[#A87438] text-[#191512] font-semibold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl transition-colors"
          >
            See today's menu
          </button>
          <button
            onClick={() => setActiveView('locations')}
            className="bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-[#FAF7F2] border border-[#FAF7F2]/30 text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-xl"
          >
            Find your nearest bakery
          </button>
        </div>
      </div>

    </div>
  );
};
