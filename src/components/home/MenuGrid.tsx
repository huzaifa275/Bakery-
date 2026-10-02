import React, { useState, useMemo, useEffect } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { ProductCard } from '../product/ProductCard';
import { Search, Sparkles, X, ArrowRight } from 'lucide-react';

export const MenuGrid: React.FC = () => {
  const { products, setActiveView, setMenuFilterCategory } = useBakery();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input for instant fluid response
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 180);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Categories specified by user: All, Signature Cakes, French Pastries, Artisan Breads, Coffee & Treats
  const filterTabs = [
    { id: 'all', label: 'All Bakes' },
    { id: 'cakes', label: 'Signature Cakes' },
    { id: 'pastries', label: 'French Pastries' },
    { id: 'bread', label: 'Artisan Breads' },
    { id: 'treats', label: 'Coffee & Treats' },
  ];

  // Filtering engine
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category tab
    if (activeCategory === 'cakes') {
      result = result.filter(p => p.category === 'cakes' || p.category === 'cupcakes');
    } else if (activeCategory === 'pastries') {
      result = result.filter(p => p.category === 'pastries' || p.category === 'croissants');
    } else if (activeCategory === 'bread') {
      result = result.filter(p => p.category === 'bread');
    } else if (activeCategory === 'treats') {
      result = result.filter(p => p.category === 'drinks' || p.category === 'desserts' || p.category === 'cookies' || p.category === 'donuts');
    }

    // Filter by search query
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        (p.frenchName && p.frenchName.toLowerCase().includes(q)) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.ingredients.some(ing => ing.toLowerCase().includes(q))
      );
    }

    return result;
  }, [products, activeCategory, debouncedSearch]);

  const handleTabClick = (tabId: string) => {
    setActiveCategory(tabId);
  };

  return (
    <section 
      id="menu" 
      aria-label="Bakery storefront catalogue"
      className="py-16 sm:py-24 bg-[#F7F3EB] border-b border-stone-200/60 relative"
    >
      {/* Subtle flour texture background */}
      <div className="absolute inset-0 bg-flour-texture pointer-events-none opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C86D51]">
              <Sparkles className="w-3.5 h-3.5 text-[#C86D51]" />
              <span>Morning Bakes &amp; Patisserie</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1E1511]">
              Featured Artisan Collection
            </h2>
            <p className="text-xs sm:text-sm text-[#5D5047] font-light max-w-lg">
              Freshly pulled from our stone deck ovens. Reserve online for fast counter collection or morning delivery.
            </p>
          </div>

          {/* Instant Search Bar */}
          <div className="relative w-full md:w-72 lg:w-80">
            <Search className="w-4 h-4 text-[#7A6E65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search croissants, sourdough, tarts..."
              className="w-full bg-[#FFFFFF] border border-stone-200/80 rounded-xl pl-9.5 pr-8 py-2.5 text-xs text-[#1E1511] placeholder-[#7A6E65] focus:outline-none focus:border-[#C86D51] focus:ring-1 focus:ring-[#C86D51] transition-all shadow-2xs"
              aria-label="Search fresh bakes"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Interactive Category Tabs with smooth active background */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 p-1.5 bg-[#FFFFFF]/80 backdrop-blur-xs rounded-2xl border border-stone-200/70 shadow-2xs">
            {filterTabs.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative px-4 sm:px-5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap cursor-pointer select-none ${
                    isActive
                      ? 'bg-[#1E1511] text-[#FDFBF7] shadow-sm'
                      : 'text-[#5D5047] hover:text-[#1E1511] hover:bg-[#F7F3EB]'
                  }`}
                  aria-pressed={isActive}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid with subtle fade transitions */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-[#FFFFFF] rounded-3xl border border-stone-200/60 p-8 space-y-4">
            <span className="text-4xl block">🥐</span>
            <h3 className="font-display text-xl font-semibold text-[#1E1511]">No bakes found</h3>
            <p className="text-xs text-[#7A6E65] max-w-sm mx-auto">
              We couldn't find items matching "{debouncedSearch}". Try searching for sourdough, chocolate, or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#1E1511] hover:bg-[#C86D51] text-[#FDFBF7] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All Bakes Link Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200/60">
          <p className="text-xs text-[#7A6E65]">
            Showing <strong className="text-[#1E1511] font-semibold">{Math.min(8, filteredProducts.length)}</strong> of {products.length} bakery specialities
          </p>

          <button
            type="button"
            onClick={() => {
              setMenuFilterCategory(activeCategory === 'all' ? undefined : activeCategory);
              setActiveView('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C86D51] hover:text-[#1E1511] transition-colors group cursor-pointer"
          >
            <span>Explore Complete Bakery Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
