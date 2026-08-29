import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { INITIAL_FAQS } from '../../data/bakeryData';
import { HelpCircle, ChevronDown, ChevronUp, Search, Flame, Wind, Sparkles } from 'lucide-react';

export const FAQView: React.FC = () => {
  const { setActiveView } = useBakery();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-3']);

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'ordering', label: 'Ordering & Lead Times' },
    { id: 'sourdough', label: 'Fermentation & Breads' },
    { id: 'cakes', label: 'Celebration & Wedding Cakes' },
    { id: 'delivery', label: 'Click & Collect / Delivery' },
    { id: 'allergens', label: 'Allergens & Dietary' },
    { id: 'storage', label: 'Storage & Reheating' },
  ];

  const filteredFaqs = INITIAL_FAQS.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setOpenIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C49258]/15 border border-[#C49258]/30 text-[#A87438] text-xs uppercase tracking-widest font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-[#C49258]" />
          Foire Aux Questions
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1A16]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6E65] font-light">
          Everything you need to know about our wild sourdough fermentations, advance ordering windows, allergen care, and bread rejuvenation.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-lg mx-auto">
        <Search className="w-4 h-4 text-[#7A6E65] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search question, reheating, butter, gluten, lead times..."
          className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-2xl pl-10 pr-4 py-3 text-xs text-[#1F1A16] placeholder-[#7A6E65] focus:outline-none focus:border-[#C49258] shadow-2xs"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
              selectedCategory === c.id
                ? 'bg-[#1F1A16] text-[#FAF7F2] border-[#1F1A16]'
                : 'bg-[#FAF7F2] text-[#4A3F35] border-[#E8DFD5] hover:bg-[#EFE8DD]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map(faq => {
          const isOpen = openIds.includes(faq.id);
          return (
            <div
              key={faq.id}
              className="bg-[#FFFFFF] rounded-2xl border border-[#E8DFD5] overflow-hidden shadow-2xs transition-all"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-[#FAF7F2]/50 transition-colors"
              >
                <span className="font-display text-base font-bold text-[#1F1A16]">
                  {faq.question}
                </span>
                <span className="text-[#C49258] shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#4A3F35] font-light leading-relaxed border-t border-[#F4EFEA]">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sourdough Reheating & Storage Master Guide */}
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] p-8 sm:p-10 space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#C49258] font-bold uppercase tracking-widest">
            <Flame className="w-4 h-4" />
            Master Baker Guide
          </div>
          <h3 className="font-display text-2xl font-bold text-[#1F1A16]">
            How to Reheat &amp; Preserve Sourdough Crust
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#4A3F35]">
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8DFD5] space-y-2">
            <strong className="text-sm font-bold text-[#1F1A16] block">Day 1 to 3: Linen Bag</strong>
            <p className="text-[#7A6E65] leading-relaxed">
              Store un-sliced sourdough cut-side down on a wooden cutting board or wrapped in a breathable linen tea towel at room temperature. Never refrigerate!
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8DFD5] space-y-2">
            <strong className="text-sm font-bold text-[#1F1A16] block">The Hearth Revival Trick</strong>
            <p className="text-[#7A6E65] leading-relaxed">
              Spritz the entire whole loaf lightly with water. Bake in a preheated oven at 190°C (375°F) for 7–9 minutes. The crust returns to glass-shattering crispness!
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8DFD5] space-y-2">
            <strong className="text-sm font-bold text-[#1F1A16] block">Freezing Slices</strong>
            <p className="text-[#7A6E65] leading-relaxed">
              Slice the remaining loaf into thick slices. Freeze in an airtight container with parchment separators. Toast straight from frozen.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
