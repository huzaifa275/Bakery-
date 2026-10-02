import React, { useState } from 'react';
import { Product } from '../../types';
import { useBakery } from '../../context/BakeryContext';
import { ShoppingBag, Check, Eye, Heart, Star, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  onQuickView?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, wishlist, toggleWishlist, openProductModal } = useBakery();
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isFavorited = wishlist.includes(product.id);

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product.id);
    } else {
      openProductModal(product.id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;

    addToCart(product, undefined, undefined, 1);
    setIsAdded(true);

    toast.success(`${product.name} added to your basket!`, {
      icon: '🥐',
      duration: 2500,
      style: {
        background: '#1E1511',
        color: '#FDFBF7',
        border: '1px solid rgba(212, 163, 115, 0.25)',
        fontSize: '13px',
        fontWeight: '500',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(30, 21, 17, 0.3)',
      },
    });

    setTimeout(() => {
      setIsAdded(false);
    }, 1400);
  };

  // Determine dietary and spotlight flag
  const isChefsChoice = product.isBestSeller || product.isFeatured;
  const primaryDietary = product.dietary?.find(d => d === 'Vegan' || d === 'Gluten-Free' || d === 'Organic');
  const comparePrice = product.isBestSeller ? (product.price * 1.15).toFixed(2) : null;

  return (
    <article 
      onClick={() => openProductModal(product.id)}
      className="group relative bg-[#FFFFFF] rounded-2xl border border-stone-200/70 overflow-hidden transition-all duration-300 hover:shadow-[0_12px_28px_rgba(30,21,17,0.08)] hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-[#F7F3EB]">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#F7F3EB] to-[#EFE8DD] text-[#7A6E65] p-4 text-center">
            <span className="text-3xl mb-1">🥖</span>
            <span className="font-display font-medium text-xs text-[#1E1511]">{product.name}</span>
          </div>
        )}

        {/* Top Badges (Dietary & Chef's Choice) */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {isChefsChoice && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-[#1E1511]/90 text-[#D4A373] backdrop-blur-xs px-2.5 py-0.5 rounded-md shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-[#D4A373]" />
              Chef's Choice
            </span>
          )}
          {primaryDietary && (
            <span className="inline-flex items-center text-[10px] font-medium tracking-wide bg-[#70826E]/90 text-[#FDFBF7] backdrop-blur-xs px-2 py-0.5 rounded-md shadow-xs">
              {primaryDietary}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-[#FDFBF7]/90 hover:bg-[#FFFFFF] text-[#7A6E65] hover:text-[#C86D51] backdrop-blur-xs shadow-xs transition-colors z-10 focus:outline-none"
          aria-label={isFavorited ? "Remove from favorites" : "Save to favorites"}
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${isFavorited ? 'text-rose-500 fill-rose-500' : ''}`} />
        </button>

        {/* Quick View Button Hover Slide-Up */}
        <div className="absolute inset-x-0 bottom-3 px-3 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-10">
          <button
            type="button"
            onClick={handleQuickView}
            className="w-full max-w-[200px] py-2 px-3 rounded-xl bg-[#1E1511]/90 hover:bg-[#1E1511] text-[#FDFBF7] backdrop-blur-md text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Metadata Row: Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#7A6E65]">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#A87438]">
              {product.frenchName || product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-600 font-semibold text-xs">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-display text-lg font-semibold text-[#1E1511] group-hover:text-[#C86D51] transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#5D5047] font-normal leading-relaxed line-clamp-2">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold text-[#1E1511] tabular-nums">
              €{product.price.toFixed(2)}
            </span>
            {comparePrice && (
              <span className="text-xs text-[#A89F95] line-through tabular-nums">
                €{comparePrice}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.isAvailable}
            className={`relative px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 overflow-hidden ${
              isAdded 
                ? 'bg-emerald-700 text-[#FDFBF7]' 
                : 'bg-[#1E1511] hover:bg-[#C86D51] text-[#FDFBF7] disabled:opacity-50'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 animate-in zoom-in-50 duration-200" />
                <span className="font-medium">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#D4A373] group-hover:rotate-12 transition-transform" />
                <span>{product.isAvailable ? 'Add' : 'Sold Out'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
