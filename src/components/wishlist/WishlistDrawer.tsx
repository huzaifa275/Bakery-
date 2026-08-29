import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Heart, X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    products,
    toggleWishlist,
    addToCart,
    setActiveView,
    addToast
  } = useBakery();

  if (!isWishlistOpen) return null;

  const favoritedProducts = products.filter(p => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    favoritedProducts.forEach(p => {
      addToCart(p, undefined, undefined, 1);
    });
    addToast(`Added ${favoritedProducts.length} favorites to basket`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-[#1F1A16]/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] text-[#2C241E] shadow-2xl flex flex-col justify-between border-l border-[#E8DFD5] animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E8DFD5] flex items-center justify-between bg-[#F4EFEA]">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="font-display text-xl font-bold tracking-tight text-[#1F1A16]">
                Saved Favorites
              </h2>
              <span className="bg-[#1F1A16] text-[#FAF7F2] text-xs font-semibold px-2 py-0.5 rounded-full">
                {wishlist.length}
              </span>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 rounded-full text-[#7A6E65] hover:text-[#1F1A16] hover:bg-[#E8DFD5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {favoritedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EFE8DD] flex items-center justify-center text-[#A89F95]">
                  <Heart className="w-8 h-8 text-[#A89F95]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-[#1F1A16]">
                    No favorites saved yet
                  </h3>
                  <p className="text-xs text-[#7A6E65] max-w-xs">
                    Click the heart icon on any bread, pastry, or entremet to save it for your next order.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsWishlistOpen(false);
                    setActiveView('menu');
                  }}
                  className="bg-[#1F1A16] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-lg"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              favoritedProducts.map(product => (
                <div 
                  key={product.id}
                  className="flex gap-4 bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E8DFD5] shadow-2xs items-center justify-between"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg shrink-0 border border-[#E8DFD5]"
                  />
                  <div className="flex-1">
                    <h4 className="font-display text-sm font-bold text-[#1F1A16] leading-tight">
                      {product.name}
                    </h4>
                    <span className="text-xs font-semibold text-[#C49258] block mt-0.5">
                      €{product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addToCart(product, undefined, undefined, 1)}
                      className="p-2 bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] rounded-lg text-xs flex items-center gap-1 transition-colors"
                      title="Add to Basket"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C49258]" />
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="p-2 text-[#7A6E65] hover:text-rose-600 rounded-lg transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Action */}
          {favoritedProducts.length > 0 && (
            <div className="p-6 border-t border-[#E8DFD5] bg-[#F4EFEA] space-y-3">
              <button
                onClick={handleAddAllToCart}
                className="w-full bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] py-3.5 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Add All to Basket</span>
                <ArrowRight className="w-4 h-4 text-[#C49258]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
