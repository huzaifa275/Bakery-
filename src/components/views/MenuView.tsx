import React, { useState, useMemo } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Heart, 
  Star, 
  Eye, 
  Sparkles, 
  ShieldAlert, 
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { ProductCategory, DietaryTag } from '../../types';
import { ProductCard } from '../product/ProductCard';

export const MenuView: React.FC = () => {
  const {
    products,
    addToCart,
    openProductModal,
    wishlist,
    toggleWishlist,
    setActiveView,
    menuSearchQuery,
    setMenuSearchQuery,
    menuFilterCategory,
    setMenuFilterCategory,
  } = useBakery();

  const [selectedCategory, setSelectedCategory] = useState<string>(menuFilterCategory || 'all');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(menuSearchQuery || '');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'reviews'>('featured');

  // Keep state in sync if context changes (e.g. from header search)
  React.useEffect(() => {
    if (menuFilterCategory) setSelectedCategory(menuFilterCategory);
  }, [menuFilterCategory]);

  React.useEffect(() => {
    if (menuSearchQuery !== undefined) setSearchQuery(menuSearchQuery);
  }, [menuSearchQuery]);

  const categories: { id: string; label: string; french: string }[] = [
    { id: 'all', label: 'All Bakes', french: 'All' },
    { id: 'bread', label: 'Sourdough & Bread', french: 'Bread' },
    { id: 'croissants', label: 'Croissants & Buns', french: 'Pastries' },
    { id: 'pastries', label: 'Pastries & Tarts', french: 'Tarts' },
    { id: 'cakes', label: 'Cakes & Slices', french: 'Cakes' },
    { id: 'cupcakes', label: 'Small Cakes', french: 'Small Cakes' },
    { id: 'cookies', label: 'Cookies & Biscuits', french: 'Biscuits' },
    { id: 'donuts', label: 'Doughnuts & Buns', french: 'Buns' },
    { id: 'desserts', label: 'Macarons & Treats', french: 'Macarons' },
    { id: 'seasonal', label: 'Seasonal Bakes', french: 'Seasonal' },
    { id: 'gift_boxes', label: 'Gift Boxes', french: 'Boxes' },
    { id: 'drinks', label: 'Coffee & Drinks', french: 'Drinks' },
  ];

  const dietaryOptions: { id: string; label: string }[] = [
    { id: 'all', label: 'All Dietary' },
    { id: 'Vegan', label: 'Vegan' },
    { id: 'Vegetarian', label: 'Vegetarian' },
    { id: 'Organic', label: 'Organic' },
    { id: 'Nut-Free', label: 'Nut-Free' },
    { id: 'Gluten-Free', label: 'Gluten-Free' },
    { id: 'Dairy-Free', label: 'Dairy-Free' },
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedDietary !== 'all') {
      result = result.filter(p => p.dietary.includes(selectedDietary as DietaryTag));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        (p.frenchName && p.frenchName.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q) ||
        p.ingredients.some(ing => ing.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    } else {
      // featured
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, selectedDietary, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#C49258] font-bold">
          What's baking today
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1A16]">
          Bakery Menu
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6E65] font-light">
          Croissants, pastries, sourdough and sweet things we bake fresh every morning.
        </p>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD5] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#7A6E65] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search breads, croissants, tarts, flours..."
            className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1F1A16] placeholder-[#7A6E65] focus:outline-none focus:border-[#C49258]"
          />
        </div>

        {/* Dietary & Sorting */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Dietary Select */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#7A6E65] hidden sm:inline">Dietary:</span>
            <select
              value={selectedDietary}
              onChange={(e) => setSelectedDietary(e.target.value)}
              className="bg-[#FFFFFF] border border-[#DCD1C4] rounded-lg px-2.5 py-1.5 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
            >
              {dietaryOptions.map(d => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#7A6E65] hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FFFFFF] border border-[#DCD1C4] rounded-lg px-2.5 py-1.5 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
            >
              <option value="featured">Featured Selection</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="overflow-x-auto pb-2 scrollbar-none flex gap-2">
        {categories.map(cat => {
          const count = cat.id === 'all' 
            ? products.length 
            : products.filter(p => p.category === cat.id).length;
          
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 border ${
                selectedCategory === cat.id
                  ? 'bg-[#1F1A16] text-[#FAF7F2] border-[#1F1A16] shadow-sm'
                  : 'bg-[#FAF7F2] text-[#4A3F35] border-[#E8DFD5] hover:bg-[#EFE8DD]'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat.id ? 'bg-[#C49258] text-[#1F1A16]' : 'bg-[#E8DFD5] text-[#7A6E65]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Header Count */}
      <div className="flex justify-between items-center text-xs text-[#7A6E65] border-b border-[#E8DFD5] pb-3">
        <span>Showing <strong>{filteredProducts.length}</strong> artisan creations</span>
        {selectedCategory !== 'all' && (
          <button 
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDietary('all');
              setSearchQuery('');
            }}
            className="text-[#C49258] hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#EFE8DD] text-[#C49258] flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-display text-xl font-bold text-[#1F1A16]">
            No bakery items found
          </h3>
          <p className="text-xs text-[#7A6E65] max-w-sm mx-auto">
            We couldn't find items matching "{searchQuery}". Try searching for croissants, sourdough, or reset your filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDietary('all');
            }}
            className="bg-[#1F1A16] text-[#FAF7F2] px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Custom Cake Banner Plug in Menu */}
      <div className="bg-[#241E19] text-[#FAF7F2] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#C49258]/30 mt-12">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#E6C594] font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#C49258]" />
            Looking for something bespoke?
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold">
            Build a Custom Celebration or Wedding Cake
          </h3>
          <p className="text-xs text-[#D8CEBE] max-w-xl font-light">
            Choose tiers, Swiss meringue buttercreams, Valrhona fillings, and personalized gold inscriptions with instant price estimation.
          </p>
        </div>

        <button
          onClick={() => setActiveView('custom-cakes')}
          className="bg-[#C49258] hover:bg-[#A87438] text-[#191512] font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shrink-0 shadow-md"
        >
          Launch Cake Builder →
        </button>
      </div>

    </div>
  );
};
