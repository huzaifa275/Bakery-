import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Check, 
  X, 
  Sparkles, 
  AlertTriangle, 
  Sun, 
  RotateCcw, 
  Search,
  Filter
} from 'lucide-react';
import { Product } from '../../types';

export const AdminQuickStock: React.FC = () => {
  const { products, setProducts, categories, addToast } = useBakery();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const handleToggle = async (product: Product) => {
    const nextState = !product.isAvailable;
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: nextState }),
      });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isAvailable: nextState } : p));
      addToast(`${product.name} is now ${nextState ? 'IN STOCK' : 'SOLD OUT'}`, 'info');
    } catch {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isAvailable: nextState } : p));
      addToast(`${product.name} updated locally`, 'info');
    }
  };

  const handleSetAll = async (available: boolean) => {
    // Optimistic batch update
    setProducts(prev => prev.map(p => ({ ...p, isAvailable: available })));
    addToast(`All items marked as ${available ? 'IN STOCK' : 'SOLD OUT'}`, 'success');
  };

  const filtered = products.filter(p => {
    const matchQuery = search === '' || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.frenchName && p.frenchName.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCat === 'all' || p.category === selectedCat;
    return matchQuery && matchCat;
  });

  const inStockCount = products.filter(p => p.isAvailable).length;
  const outOfStockCount = products.length - inStockCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs text-[#C49258] font-bold uppercase tracking-widest">
            <Sun className="w-4 h-4" />
            Morning Oven Shift Manager
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2C2420]">Rapid Stock &amp; Sold Out Toggle</h2>
          <p className="text-xs text-[#8C827A]">
            Quickly switch items between available and sold out during morning counter rush and courier dispatch
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSetAll(true)}
            className="bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0] px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Mark All In Stock
          </button>
        </div>
      </div>

      {/* Overview summary bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EBE3D7] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-[#8C827A]">Available Today: </span>
            <strong className="text-[#16A34A] font-bold">{inStockCount} items</strong>
          </div>
          <div>
            <span className="text-[#8C827A]">Sold Out: </span>
            <strong className="text-[#C53030] font-bold">{outOfStockCount} items</strong>
          </div>
        </div>

        {/* Quick filters */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Quick search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E0D8CE] rounded-xl px-3 py-1.5 text-xs text-[#2C2420] outline-none"
          />
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E0D8CE] rounded-xl px-3 py-1.5 text-xs text-[#2C2420] outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Rapid Toggle Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(product => {
          return (
            <div
              key={product.id}
              onClick={() => handleToggle(product)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between gap-3 ${
                product.isAvailable
                  ? 'bg-white border-[#EBE3D7] hover:border-[#16A34A] shadow-sm'
                  : 'bg-[#FFF8F8] border-[#FED7D7] shadow-none opacity-80'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className={`w-12 h-12 rounded-xl object-cover border flex-shrink-0 ${
                    product.isAvailable ? 'border-[#EBE3D7]' : 'border-[#FED7D7] grayscale'
                  }`}
                />
                <div className="min-w-0">
                  <h4 className={`text-xs font-bold truncate ${product.isAvailable ? 'text-[#2C2420]' : 'text-[#8C827A] line-through'}`}>
                    {product.name}
                  </h4>
                  <div className="text-[11px] font-serif italic text-[#8C827A] truncate">
                    {product.frenchName}
                  </div>
                  <div className="text-[11px] font-serif font-bold text-[#C49258] mt-0.5">
                    €{product.price.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <div
                className={`w-10 h-6 rounded-full flex items-center p-0.5 transition-colors flex-shrink-0 ${
                  product.isAvailable ? 'bg-[#16A34A] justify-end' : 'bg-[#D0C7BC] justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center text-[10px]">
                  {product.isAvailable ? (
                    <Check className="w-3 h-3 text-[#16A34A]" />
                  ) : (
                    <X className="w-3 h-3 text-[#8C827A]" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
