import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Sparkles, Calendar, ShoppingBag, Eye, Heart, Star, Clock } from 'lucide-react';

export const SeasonalView: React.FC = () => {
  const { products, addToCart, openProductModal, toggleWishlist, wishlist } = useBakery();
  const seasonalProducts = products.filter(p => p.isSeasonal || p.category === 'seasonal');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Editorial Spring Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#1F1A16] text-[#FAF7F2] p-8 sm:p-14 border border-[#C49258]/40 shadow-xl">
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80"
            alt="Spring Atelier"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C49258]/20 border border-[#C49258]/30 text-[#E6C594] text-xs uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C49258]" />
            Spring seasonal menu
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Spring bakes &amp; <br />
            <span className="italic font-serif text-[#E6C594]">seasonal specials</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#D8CEBE] font-light leading-relaxed">
            Fresh rhubarb tarts, Meyer lemon buns, hot cross brioche and Easter chocolate bakes. We make these in small batches while spring fruit is at its peak.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#E6C594] pt-2">
            <Clock className="w-4 h-4" />
            <span>Available for pre-order and in-store pickup throughout the season.</span>
          </div>
        </div>
      </div>

      {/* Seasonal Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-2xl font-bold text-[#1F1A16]">
            Limited Seasonal Releases
          </h2>
          <span className="text-xs text-[#7A6E65]">
            {seasonalProducts.length} seasonal creations
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {seasonalProducts.map(product => {
            const isFavorited = wishlist.includes(product.id);

            return (
              <div
                key={product.id}
                className="bg-[#FFFFFF] rounded-2xl border border-[#E8DFD5] overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-[#F4EFEA]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#C49258] text-[#191512] text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded">
                    Spring Exclusive
                  </span>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-[#FAF7F2]/90 backdrop-blur-xs text-[#7A6E65] hover:text-rose-600 shadow-sm transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'text-rose-500 fill-rose-500' : ''}`} />
                  </button>

                  <button
                    onClick={() => openProductModal(product.id)}
                    className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-[#1F1A16]/80 text-[#FAF7F2] text-[10px] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Details</span>
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[#7A6E65]">
                      <span className="uppercase text-[9px] font-bold bg-[#F4EFEA] px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{product.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => openProductModal(product.id)}
                      className="font-display text-lg font-bold text-[#1F1A16] group-hover:text-[#C49258] transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#7A6E65] font-light line-clamp-2">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F4EFEA] flex items-center justify-between">
                    <span className="font-display text-xl font-bold text-[#1F1A16]">
                      €{product.price.toFixed(2)}
                    </span>

                    <button
                      onClick={() => addToCart(product, undefined, undefined, 1)}
                      className="bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C49258]" />
                      <span>Reserve</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
