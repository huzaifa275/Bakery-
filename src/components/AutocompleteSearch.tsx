import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useBakery } from '../context/BakeryContext';
import { 
  Search, 
  X, 
  ArrowRight, 
  Plus, 
  Sparkles, 
  ShoppingBag, 
  MapPin, 
  Cake, 
  Gift, 
  Clock, 
  ChevronRight,
  Flame,
  Wheat,
  Coffee
} from 'lucide-react';
import { Product } from '../types';

interface AutocompleteSearchProps {
  onClose?: () => void;
  isHeaderPanel?: boolean;
  autoFocus?: boolean;
  className?: string;
  placeholder?: string;
}

interface ServiceItem {
  type: 'service';
  id: string;
  name: string;
  subtitle: string;
  viewId: string;
  icon: React.ReactNode;
}

interface CategoryItem {
  type: 'category';
  id: string;
  name: string;
  subtitle: string;
  categoryKey: string;
  icon: string;
}

type SuggestionItem = 
  | { type: 'product'; data: Product; score: number }
  | { type: 'category'; id: string; name: string; subtitle: string; categoryKey: string; icon: string; score: number }
  | { type: 'service'; id: string; name: string; subtitle: string; viewId: string; icon: React.ReactNode; score: number };

export const AutocompleteSearch: React.FC<AutocompleteSearchProps> = ({
  onClose,
  isHeaderPanel = true,
  autoFocus = true,
  className = '',
  placeholder = 'Search bakes: croissant, sourdough, chocolate, cake, pastry...'
}) => {
  const {
    products,
    openProductModal,
    addToCart,
    navigateToMenuWithSearch,
    setActiveView
  } = useBakery();

  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto focus on mount if requested
  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Clean and normalize query
  const cleanQuery = useMemo(() => {
    return query.replace(/\s+/g, ' ').trim().toLowerCase();
  }, [query]);

  // Popular searches for initial empty state
  const popularSearches = [
    { label: 'Croissants', icon: '🥐', query: 'Croissant' },
    { label: 'Sourdough', icon: '🍞', query: 'Sourdough' },
    { label: 'Birthday cakes', icon: '🎂', query: 'Cake' },
    { label: 'Cookies', icon: '🍪', query: 'Cookie' },
    { label: 'Coffee', icon: '☕', query: 'Coffee' },
  ];

  // Bakery services for smart keyword routing
  const bakeryServices: ServiceItem[] = [
    {
      type: 'service',
      id: 'srv-custom-cakes',
      name: 'Custom Cake Builder',
      subtitle: 'Design bespoke celebration, birthday & wedding cakes',
      viewId: 'custom-cakes',
      icon: <Cake className="w-5 h-5 text-[#C49258]" />
    },
    {
      type: 'service',
      id: 'srv-weddings',
      name: 'Weddings & Event Catering',
      subtitle: 'Pastry tables, tier cakes & morning brunch delivery',
      viewId: 'weddings-events',
      icon: <Sparkles className="w-5 h-5 text-[#C49258]" />
    },
    {
      type: 'service',
      id: 'srv-gift-boxes',
      name: 'Gift Boxes & Hampers',
      subtitle: 'Curated boxes of viennoiserie, macarons & treats',
      viewId: 'gift-boxes',
      icon: <Gift className="w-5 h-5 text-[#C49258]" />
    },
    {
      type: 'service',
      id: 'srv-locations',
      name: 'Bakery Locations & Hours',
      subtitle: 'Visit our bakeries in Lyon, Paris and Lille',
      viewId: 'locations',
      icon: <MapPin className="w-5 h-5 text-[#C49258]" />
    },
    {
      type: 'service',
      id: 'srv-track',
      name: 'Track Order Status',
      subtitle: 'Live oven & pickup preparation tracker',
      viewId: 'track-order',
      icon: <Clock className="w-5 h-5 text-[#C49258]" />
    }
  ];

  // Main categories
  const bakeryCategories: CategoryItem[] = [
    { type: 'category', id: 'cat-bread', name: 'Sourdough & Bread', subtitle: 'Stoneground loaves & baguettes', categoryKey: 'bread', icon: '🍞' },
    { type: 'category', id: 'cat-croissants', name: 'Croissants & Pastries', subtitle: 'Laminated butter viennoiserie', categoryKey: 'croissants', icon: '🥐' },
    { type: 'category', id: 'cat-cakes', name: 'Cakes & Slices', subtitle: 'Fresh tarts, entremets & sponges', categoryKey: 'cakes', icon: '🎂' },
    { type: 'category', id: 'cat-cookies', name: 'Cookies & Biscuits', subtitle: 'Shortbread, sablés & chocolate cookies', categoryKey: 'cookies', icon: '🍪' },
    { type: 'category', id: 'cat-desserts', name: 'Macarons & Treats', subtitle: 'French macarons, brownies & eclairs', categoryKey: 'desserts', icon: '🍫' },
    { type: 'category', id: 'cat-drinks', name: 'Coffee & Drinks', subtitle: 'Espresso, flat whites & hot chocolate', categoryKey: 'drinks', icon: '☕' },
  ];

  // Intelligent scoring and ranking algorithm
  const suggestions: SuggestionItem[] = useMemo(() => {
    if (!cleanQuery) return [];

    const items: SuggestionItem[] = [];

    // 1. Check Product matches
    products.forEach((product) => {
      let score = 0;
      const nameLower = product.name.toLowerCase();
      const frenchLower = product.frenchName?.toLowerCase() || '';
      const catLower = product.category.toLowerCase();
      const shortDescLower = product.shortDescription.toLowerCase();
      const descLower = product.description.toLowerCase();
      const ingredientsLower = product.ingredients.map(i => i.toLowerCase()).join(' ');
      const dietaryLower = product.dietary.map(d => d.toLowerCase()).join(' ');

      // Name exact or prefix match
      if (nameLower === cleanQuery) {
        score += 200;
      } else if (nameLower.startsWith(cleanQuery)) {
        score += 120;
      } else if (nameLower.split(' ').some(word => word.startsWith(cleanQuery))) {
        score += 90;
      } else if (nameLower.includes(cleanQuery)) {
        score += 70;
      }

      // French name match
      if (frenchLower) {
        if (frenchLower.startsWith(cleanQuery)) {
          score += 100;
        } else if (frenchLower.split(' ').some(word => word.startsWith(cleanQuery))) {
          score += 80;
        } else if (frenchLower.includes(cleanQuery)) {
          score += 60;
        }
      }

      // Category match
      if (catLower === cleanQuery) {
        score += 80;
      } else if (catLower.includes(cleanQuery)) {
        score += 50;
      }

      // Category aliases
      if ((cleanQuery === 'pastry' || cleanQuery === 'pastries') && (catLower === 'pastries' || catLower === 'croissants')) {
        score += 70;
      }
      if ((cleanQuery === 'bread' || cleanQuery === 'breads' || cleanQuery === 'loaf' || cleanQuery === 'loaves') && catLower === 'bread') {
        score += 70;
      }
      if ((cleanQuery === 'cake' || cleanQuery === 'cakes' || cleanQuery === 'tart' || cleanQuery === 'tarts') && catLower === 'cakes') {
        score += 70;
      }
      if ((cleanQuery === 'croissant' || cleanQuery === 'croissants') && (catLower === 'croissants' || nameLower.includes('croissant'))) {
        score += 90;
      }
      if ((cleanQuery === 'cookie' || cleanQuery === 'cookies') && catLower === 'cookies') {
        score += 75;
      }
      if ((cleanQuery === 'sweet' || cleanQuery === 'sweets') && (catLower === 'desserts' || catLower === 'cakes' || catLower === 'cupcakes')) {
        score += 50;
      }

      // Ingredients match (e.g. "chocolate", "butter", "almond", "cardamom")
      if (ingredientsLower.includes(cleanQuery)) {
        score += 45;
      }

      // Dietary / Tags match
      if (dietaryLower.includes(cleanQuery)) {
        score += 35;
      }

      // Descriptions match
      if (shortDescLower.includes(cleanQuery)) {
        score += 25;
      } else if (descLower.includes(cleanQuery)) {
        score += 15;
      }

      // Boost featured and best sellers slightly for tie-breaking
      if (score > 0) {
        if (product.isBestSeller) score += 5;
        if (product.isFeatured) score += 3;
        items.push({ type: 'product', data: product, score });
      }
    });

    // 2. Check Category suggestions
    bakeryCategories.forEach(cat => {
      let score = 0;
      const nameLower = cat.name.toLowerCase();
      const subLower = cat.subtitle.toLowerCase();
      const keyLower = cat.categoryKey.toLowerCase();

      if (nameLower.startsWith(cleanQuery) || keyLower.startsWith(cleanQuery)) {
        score = 85;
      } else if (nameLower.includes(cleanQuery) || keyLower.includes(cleanQuery) || subLower.includes(cleanQuery)) {
        score = 65;
      }

      if (score > 0) {
        items.push({
          type: 'category',
          id: cat.id,
          name: cat.name,
          subtitle: cat.subtitle,
          categoryKey: cat.categoryKey,
          icon: cat.icon,
          score
        });
      }
    });

    // 3. Check Service suggestions (e.g. "custom cake", "wedding", "catering", "gift", "location", "order")
    bakeryServices.forEach(srv => {
      let score = 0;
      const nameLower = srv.name.toLowerCase();
      const subLower = srv.subtitle.toLowerCase();

      if (nameLower.includes(cleanQuery)) {
        score = 75;
      } else if (subLower.includes(cleanQuery)) {
        score = 55;
      }

      // Alias triggers
      if (cleanQuery.includes('custom') || cleanQuery.includes('bespoke') || cleanQuery.includes('tier') || cleanQuery.includes('birthday')) {
        if (srv.id === 'srv-custom-cakes') score = 95;
      }
      if (cleanQuery.includes('wedding') || cleanQuery.includes('cater') || cleanQuery.includes('event')) {
        if (srv.id === 'srv-weddings') score = 95;
      }
      if (cleanQuery.includes('gift') || cleanQuery.includes('box') || cleanQuery.includes('hamper') || cleanQuery.includes('present')) {
        if (srv.id === 'srv-gift-boxes') score = 95;
      }
      if (cleanQuery.includes('where') || cleanQuery.includes('store') || cleanQuery.includes('shop') || cleanQuery.includes('address') || cleanQuery.includes('hour') || cleanQuery.includes('lyon') || cleanQuery.includes('paris') || cleanQuery.includes('lille')) {
        if (srv.id === 'srv-locations') score = 95;
      }
      if (cleanQuery.includes('track') || cleanQuery.includes('status') || cleanQuery.includes('my order')) {
        if (srv.id === 'srv-track') score = 95;
      }

      if (score > 0) {
        items.push({
          type: 'service',
          id: srv.id,
          name: srv.name,
          subtitle: srv.subtitle,
          viewId: srv.viewId,
          icon: srv.icon,
          score
        });
      }
    });

    // Sort items by score descending
    items.sort((a, b) => b.score - a.score);

    // Limit to top 8 suggestions for clean and fast UI
    return items.slice(0, 8);
  }, [cleanQuery, products]);

  // Highlight matching substring helper
  const highlightMatch = (text: string, searchStr: string) => {
    if (!searchStr.trim()) return text;

    try {
      const escaped = searchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
      return (
        <span>
          {parts.map((part, i) =>
            part.toLowerCase() === searchStr.toLowerCase() ? (
              <mark key={i} className="bg-[#E6C594]/40 text-[#1F1A16] font-bold rounded-xs px-0.5">
                {part}
              </mark>
            ) : (
              part
            )
          )}
        </span>
      );
    } catch {
      return text;
    }
  };

  // Action handlers
  const handleSelectProduct = (product: Product) => {
    openProductModal(product.id);
    setQuery('');
    setIsFocused(false);
    onClose?.();
  };

  const handleSelectCategory = (categoryKey: string) => {
    navigateToMenuWithSearch('', categoryKey);
    setQuery('');
    setIsFocused(false);
    onClose?.();
  };

  const handleSelectService = (viewId: string) => {
    setActiveView(viewId as any);
    setQuery('');
    setIsFocused(false);
    onClose?.();
  };

  const handleViewAllResults = () => {
    navigateToMenuWithSearch(query.trim(), 'all');
    setQuery('');
    setIsFocused(false);
    onClose?.();
  };

  const handleQuickTermClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalItems = suggestions.length + (cleanQuery ? 1 : 0); // +1 for "View all results" row

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        const item = suggestions[selectedIndex];
        if (item.type === 'product') {
          handleSelectProduct(item.data);
        } else if (item.type === 'category') {
          handleSelectCategory(item.categoryKey);
        } else if (item.type === 'service') {
          handleSelectService(item.viewId);
        }
      } else if (selectedIndex === suggestions.length && cleanQuery) {
        // "View all results" row selected
        handleViewAllResults();
      } else if (suggestions.length > 0) {
        // Default to first suggestion
        const first = suggestions[0];
        if (first.type === 'product') {
          handleSelectProduct(first.data);
        } else if (first.type === 'category') {
          handleSelectCategory(first.categoryKey);
        } else {
          handleSelectService(first.viewId);
        }
      } else if (cleanQuery) {
        handleViewAllResults();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsFocused(false);
      inputRef.current?.blur();
      onClose?.();
    }
  };

  const showDropdown = isFocused;
  const isQueryActive = Boolean(cleanQuery);
  const totalMatchingProducts = useMemo(() => {
    if (!cleanQuery) return 0;
    return products.filter(p => 
      p.name.toLowerCase().includes(cleanQuery) ||
      (p.frenchName && p.frenchName.toLowerCase().includes(cleanQuery)) ||
      p.category.toLowerCase().includes(cleanQuery) ||
      p.shortDescription.toLowerCase().includes(cleanQuery) ||
      p.ingredients.some(ing => ing.toLowerCase().includes(cleanQuery))
    ).length;
  }, [cleanQuery, products]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      
      {/* Search Input Bar */}
      <div className="relative flex items-center w-full">
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-[#7A6E65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          
          <input
            ref={inputRef}
            id="autocomplete-search-input"
            type="text"
            role="combobox"
            aria-expanded={showDropdown}
            aria-autocomplete="list"
            aria-controls="autocomplete-suggestions-dropdown"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-[#FAF7F2] border border-[#DCD1C4] focus:border-[#C49258] focus:bg-[#FFFFFF] text-[#1F1A16] rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm placeholder-[#7A6E65] focus:outline-none focus:ring-2 focus:ring-[#C49258]/20 transition-all shadow-2xs"
            autoComplete="off"
            spellCheck="false"
          />

          {query && (
            <button
              type="button"
              id="autocomplete-clear-btn"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#7A6E65] hover:text-[#1F1A16] hover:bg-[#EFE8DD] rounded-full transition-colors"
              aria-label="Clear search text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            id="autocomplete-close-btn"
            onClick={onClose}
            className="ml-2 p-2 text-[#7A6E65] hover:text-[#1F1A16] hover:bg-[#FAF7F2] rounded-xl transition-colors shrink-0"
            aria-label="Close search panel"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* DROPDOWN CONTAINER (Directly underneath the search field) */}
      {/* ------------------------------------------------------------ */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          id="autocomplete-suggestions-dropdown"
          className="absolute left-0 right-0 top-full mt-2 bg-[#FFFFFF] border border-[#E8DFD5] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          
          {/* 1. INITIAL EMPTY STATE: POPULAR SEARCHES & QUICK CATEGORIES */}
          {!isQueryActive && (
            <div className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              
              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7A6E65] mb-2.5">
                  <Flame className="w-3.5 h-3.5 text-[#C49258]" />
                  <span>Popular searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleQuickTermClick(item.query)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE8DD] text-[#1F1A16] border border-[#E8DFD5] text-xs font-medium transition-colors hover:border-[#C49258] cursor-pointer"
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Categories Bar */}
              <div className="pt-3 border-t border-[#F4EFEA]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A6E65] mb-2">
                  Browse by category
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {bakeryCategories.slice(0, 6).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelectCategory(cat.categoryKey)}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE8DD] border border-[#E8DFD5] text-left transition-colors cursor-pointer group"
                    >
                      <span className="text-base group-hover:scale-110 transition-transform">{cat.icon}</span>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-[#1F1A16] block truncate">
                          {cat.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Useful Services */}
              <div className="pt-3 border-t border-[#F4EFEA]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A6E65] mb-2">
                  Bakery Services
                </div>
                <div className="space-y-1">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectService('custom-cakes')}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF7F2] text-left transition-colors text-xs text-[#1F1A16] cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-[#C49258]" />
                      Custom Celebration Cake Builder
                    </span>
                    <ArrowRight className="w-3 h-3 text-[#7A6E65]" />
                  </button>

                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectService('locations')}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF7F2] text-left transition-colors text-xs text-[#1F1A16] cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#C49258]" />
                      Bakery Locations (Lyon, Paris, Lille)
                    </span>
                    <ArrowRight className="w-3 h-3 text-[#7A6E65]" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* 2. LIVE TYPING AUTOCOMPLETE RESULTS */}
          {isQueryActive && suggestions.length > 0 && (
            <div className="flex flex-col max-h-[70vh] sm:max-h-[80vh]">
              
              {/* Header Label */}
              <div className="px-4 py-2.5 bg-[#FAF7F2] border-b border-[#E8DFD5] flex items-center justify-between text-[11px] text-[#7A6E65]">
                <span className="font-semibold uppercase tracking-wider">
                  Suggestions for &ldquo;{query}&rdquo;
                </span>
                <span>Use ↑↓ arrows to navigate, Enter to select</span>
              </div>

              {/* Suggestions List */}
              <div className="overflow-y-auto divide-y divide-[#F4EFEA] flex-1">
                {suggestions.map((item, idx) => {
                  const isSelected = selectedIndex === idx;

                  // Product Row
                  if (item.type === 'product') {
                    const product = item.data;
                    return (
                      <div
                        key={product.id}
                        id={`autocomplete-item-${product.id}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectProduct(product)}
                        className={`flex items-center justify-between p-3 sm:p-3.5 transition-colors cursor-pointer group ${
                          isSelected ? 'bg-[#EFE8DD]' : 'hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover shrink-0 border border-[#E8DFD5]"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs sm:text-sm font-bold text-[#1F1A16] group-hover:text-[#C49258] transition-colors truncate">
                                {highlightMatch(product.name, cleanQuery)}
                              </h4>
                              {product.frenchName && (
                                <span className="text-[10px] italic text-[#7A6E65] hidden sm:inline truncate">
                                  ({highlightMatch(product.frenchName, cleanQuery)})
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#7A6E65]">
                              <span className="capitalize font-medium text-[#7A6E65] bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#E8DFD5]/60">
                                {product.category}
                              </span>
                              <span className="truncate hidden sm:inline font-light">
                                {product.shortDescription}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 pl-2">
                          <span className="font-display text-xs sm:text-sm font-bold text-[#1F1A16]">
                            €{product.price.toFixed(2)}
                          </span>

                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product, undefined, undefined, 1);
                            }}
                            className="p-1.5 sm:p-2 rounded-lg bg-[#1F1A16] text-[#FAF7F2] hover:bg-[#C49258] hover:text-[#191512] transition-colors"
                            title="Add to cart"
                            aria-label={`Add ${product.name} to cart`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // Category Row
                  if (item.type === 'category') {
                    return (
                      <div
                        key={item.id}
                        id={`autocomplete-cat-${item.id}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectCategory(item.categoryKey)}
                        className={`flex items-center justify-between p-3 sm:p-3.5 transition-colors cursor-pointer group ${
                          isSelected ? 'bg-[#EFE8DD]' : 'hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] flex items-center justify-center text-lg shrink-0">
                            {item.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-[#1F1A16] group-hover:text-[#C49258] transition-colors">
                                {highlightMatch(item.name, cleanQuery)}
                              </h4>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C49258] bg-[#C49258]/10 px-2 py-0.5 rounded">
                                Category
                              </span>
                            </div>
                            <p className="text-[11px] text-[#7A6E65] font-light">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-semibold text-[#C49258] shrink-0">
                          <span>Browse</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  }

                  // Service Row
                  if (item.type === 'service') {
                    return (
                      <div
                        key={item.id}
                        id={`autocomplete-srv-${item.id}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectService(item.viewId)}
                        className={`flex items-center justify-between p-3 sm:p-3.5 transition-colors cursor-pointer group ${
                          isSelected ? 'bg-[#EFE8DD]' : 'hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFD5] flex items-center justify-center shrink-0">
                            {item.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-[#1F1A16] group-hover:text-[#C49258] transition-colors">
                                {highlightMatch(item.name, cleanQuery)}
                              </h4>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3F5E46] bg-[#3F5E46]/10 px-2 py-0.5 rounded">
                                Bakery Service
                              </span>
                            </div>
                            <p className="text-[11px] text-[#7A6E65] font-light">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-semibold text-[#C49258] shrink-0">
                          <span>Open</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>

              {/* Bottom Action: View all results */}
              <div className="p-3 bg-[#FAF7F2] border-t border-[#E8DFD5]">
                <button
                  type="button"
                  id="autocomplete-view-all-btn"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleViewAllResults}
                  className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-between text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    selectedIndex === suggestions.length
                      ? 'bg-[#C49258] text-[#191512]'
                      : 'bg-[#1F1A16] text-[#FAF7F2] hover:bg-[#C49258] hover:text-[#191512]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5" />
                    <span>View all results for &ldquo;{query}&rdquo;</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="opacity-80">({totalMatchingProducts} {totalMatchingProducts === 1 ? 'item' : 'items'})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </div>

            </div>
          )}

          {/* 3. EMPTY STATE: NO LUCK YET */}
          {isQueryActive && suggestions.length === 0 && (
            <div id="autocomplete-empty-state" className="p-6 text-center space-y-4">
              <div className="space-y-1">
                <h4 className="font-display text-base font-bold text-[#1F1A16]">
                  No luck yet.
                </h4>
                <p className="text-xs text-[#7A6E65] font-light max-w-sm mx-auto">
                  Try searching for bread, croissants, cakes or pastries.
                </p>
              </div>

              {/* Suggested categories */}
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A6E65] mb-2.5">
                  Explore popular categories
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectCategory('bread')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE8DD] text-[#1F1A16] border border-[#E8DFD5] text-xs font-semibold hover:border-[#C49258] transition-colors"
                  >
                    🍞 Bread
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectCategory('croissants')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE8DD] text-[#1F1A16] border border-[#E8DFD5] text-xs font-semibold hover:border-[#C49258] transition-colors"
                  >
                    🥐 Pastries
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectCategory('cakes')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE8DD] text-[#1F1A16] border border-[#E8DFD5] text-xs font-semibold hover:border-[#C49258] transition-colors"
                  >
                    🎂 Cakes
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectCategory('desserts')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE8DD] text-[#1F1A16] border border-[#E8DFD5] text-xs font-semibold hover:border-[#C49258] transition-colors"
                  >
                    🍫 Sweet Things
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
