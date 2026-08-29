import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Star, 
  Check, 
  ShieldAlert, 
  Info, 
  Sparkles, 
  Clock, 
  Plus, 
  Minus,
  Layers
} from 'lucide-react';
import { ProductVariant } from '../../types';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductId,
    closeProductModal,
    products,
    reviews,
    addToCart,
    wishlist,
    toggleWishlist,
    openProductModal
  } = useBakery();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [customNote, setCustomNote] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'serving' | 'reviews'>('details');

  if (!selectedProductId) return null;

  const product = products.find(p => p.id === selectedProductId || p.slug === selectedProductId);
  if (!product) return null;

  const isFavorited = wishlist.includes(product.id);
  const productReviews = reviews.filter(r => r.productId === product.id || r.productName === product.name);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const currentPrice = selectedVariant 
    ? product.price + selectedVariant.priceModifier 
    : product.price;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, undefined, quantity, customNote);
    closeProductModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F1A16]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-[#FAF7F2] text-[#2C241E] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#E8DFD5] overflow-hidden my-6 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="p-4 sm:px-6 bg-[#F4EFEA] border-b border-[#E8DFD5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-[#EFE8DD] text-[#7A6E65] border border-[#DCD1C4]">
              {product.category}
            </span>
            {product.isSeasonal && (
              <span className="text-[11px] uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-[#C49258]/15 text-[#A87438] border border-[#C49258]/30">
                Seasonal Limited
              </span>
            )}
          </div>
          <button
            onClick={closeProductModal}
            className="p-1.5 rounded-full text-[#7A6E65] hover:text-[#1F1A16] hover:bg-[#E8DFD5] transition-colors"
            aria-label="Close product view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Gallery Column */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#ECE5DD] border border-[#E8DFD5] shadow-xs">
                <img
                  src={images[selectedImageIndex] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-[#FAF7F2]/90 backdrop-blur-xs text-[#7A6E65] hover:text-rose-600 shadow-md transition-colors"
                  aria-label="Toggle favorite"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'text-rose-500 fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImageIndex === idx ? 'border-[#C49258] shadow-xs' : 'border-[#E8DFD5] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Artisan Attributes Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {product.dietary.map(d => (
                  <span key={d} className="text-[11px] bg-[#EFE8DD] text-[#4A3F35] px-2.5 py-1 rounded-md font-medium">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Product Details & Purchase Form Column */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                {product.frenchName && (
                  <span className="text-xs uppercase tracking-widest text-[#C49258] font-semibold block mb-0.5">
                    {product.frenchName}
                  </span>
                )}
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1F1A16] leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[#A89F95] text-xs">•</span>
                  <span className="text-xs text-[#7A6E65]">
                    {product.reviewCount || productReviews.length} verified reviews
                  </span>
                  <span className="text-[#A89F95] text-xs">•</span>
                  <span className="text-xs text-[#3F5E46] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#3F5E46]" /> Baked daily 05:00
                  </span>
                </div>
              </div>

              {/* Price & Weight/Servings */}
              <div className="flex items-baseline gap-3">
                <span className="font-display text-2xl sm:text-3xl font-bold text-[#1F1A16]">
                  €{currentPrice.toFixed(2)}
                </span>
                {product.weight && (
                  <span className="text-xs text-[#7A6E65]">
                    Approx. {product.weight}
                  </span>
                )}
                {product.servings && (
                  <span className="text-xs text-[#7A6E65]">
                    • {product.servings}
                  </span>
                )}
              </div>

              <p className="text-xs text-[#4A3F35] leading-relaxed">
                {product.description}
              </p>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                    Format / Quantity Pack
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                          selectedVariant?.id === v.id
                            ? 'border-[#C49258] bg-[#EFE8DD] font-semibold text-[#1F1A16]'
                            : 'border-[#DCD1C4] bg-[#FAF7F2] text-[#4A3F35] hover:bg-[#F4EFEA]'
                        }`}
                      >
                        <span className="block">{v.name}</span>
                        <span className="text-[11px] text-[#C49258] font-medium">
                          {v.priceModifier > 0 ? `+€${v.priceModifier.toFixed(2)}` : 'Standard'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Note / Instruction */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#7A6E65]">
                  Custom Slicing or Gift Note (Optional)
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. Sliced thin, gift box ribbon..."
                  className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-lg px-3 py-1.5 text-xs text-[#1F1A16] placeholder-[#A89F95] focus:outline-none focus:border-[#C49258]"
                />
              </div>

              {/* Add to Cart Controls */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center border border-[#DCD1C4] rounded-lg bg-[#FFFFFF]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-[#EFE8DD] text-[#4A3F35] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3.5 text-xs font-bold text-[#1F1A16]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-[#EFE8DD] text-[#4A3F35] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable}
                  className="flex-1 bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] py-3 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C49258]" />
                  <span>
                    {product.isAvailable 
                      ? `Add to Basket • €${(currentPrice * quantity).toFixed(2)}` 
                      : 'Sold Out for Today'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabbed In-Depth Information */}
          <div className="mt-10 border-t border-[#E8DFD5] pt-6">
            <div className="flex border-b border-[#E8DFD5] gap-6 text-xs uppercase font-bold tracking-wider">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 transition-colors ${
                  activeTab === 'details' ? 'border-b-2 border-[#C49258] text-[#C49258]' : 'text-[#7A6E65] hover:text-[#1F1A16]'
                }`}
              >
                Craftsmanship & Story
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`pb-3 transition-colors ${
                  activeTab === 'ingredients' ? 'border-b-2 border-[#C49258] text-[#C49258]' : 'text-[#7A6E65] hover:text-[#1F1A16]'
                }`}
              >
                Ingredients & Allergens
              </button>
              <button
                onClick={() => setActiveTab('serving')}
                className={`pb-3 transition-colors ${
                  activeTab === 'serving' ? 'border-b-2 border-[#C49258] text-[#C49258]' : 'text-[#7A6E65] hover:text-[#1F1A16]'
                }`}
              >
                Storage & Serving
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 transition-colors ${
                  activeTab === 'reviews' ? 'border-b-2 border-[#C49258] text-[#C49258]' : 'text-[#7A6E65] hover:text-[#1F1A16]'
                }`}
              >
                Reviews ({productReviews.length})
              </button>
            </div>

            <div className="py-5 text-xs text-[#4A3F35] leading-relaxed">
              {activeTab === 'details' && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="bg-[#F4EFEA] p-3 rounded-lg border border-[#E8DFD5]">
                      <span className="font-bold text-[#1F1A16] block">Slow Fermentation</span>
                      <span className="text-[#7A6E65] text-[11px]">48–72 hours cold wild sourdough levain</span>
                    </div>
                    <div className="bg-[#F4EFEA] p-3 rounded-lg border border-[#E8DFD5]">
                      <span className="font-bold text-[#1F1A16] block">AOP French Butter</span>
                      <span className="text-[#7A6E65] text-[11px]">84% fat Charentes-Poitou French churn</span>
                    </div>
                    <div className="bg-[#F4EFEA] p-3 rounded-lg border border-[#E8DFD5]">
                      <span className="font-bold text-[#1F1A16] block">Daily Morning Bake</span>
                      <span className="text-[#7A6E65] text-[11px]">Baked fresh at 05:00 in stone hearth ovens</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-[#1F1A16] uppercase tracking-wider text-[11px] mb-1">
                      Full Artisan Ingredients
                    </h4>
                    <p>{product.ingredients.join(', ')}.</p>
                  </div>

                  <div className="bg-[#FAF0E6] p-4 rounded-xl border border-[#E6C594] space-y-1">
                    <h4 className="font-bold text-[#8C5511] flex items-center gap-1.5 text-xs">
                      <ShieldAlert className="w-3.5 h-3.5" /> Allergen Information
                    </h4>
                    <p className="text-[11px] text-[#6E420C]">
                      Contains: <strong>{product.allergens.join(', ')}</strong>. Handcrafted in an atelier environment that processes wheat, milk, eggs, nuts, and sesame.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'serving' && (
                <div className="space-y-3">
                  <p>
                    {product.storageInstructions || 'Best enjoyed on the day of purchase. Keep in a cool, dry place wrapped in linen or paper bag.'}
                  </p>
                  <div className="bg-[#F4EFEA] p-3.5 rounded-lg border border-[#E8DFD5]">
                    <span className="font-bold text-[#1F1A16] block mb-1">Master Baker's Reheating Tip:</span>
                    <span className="text-[#4A3F35]">
                      To revive the crisp crust, preheat your oven to 180°C (350°F). Lightly mist the crust with water and warm for 3 to 4 minutes.
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {productReviews.length === 0 ? (
                    <p className="text-[#7A6E65] italic">
                      Be the first to review this artisan creation!
                    </p>
                  ) : (
                    productReviews.map(rev => (
                      <div key={rev.id} className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E8DFD5] space-y-1.5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1F1A16]">{rev.author}</span>
                            <span className="text-[10px] text-[#7A6E65]">({rev.city})</span>
                          </div>
                          <div className="flex text-amber-400">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="font-medium text-[#1F1A16]">{rev.title}</p>
                        <p className="text-xs text-[#4A3F35]">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-8 border-t border-[#E8DFD5] pt-6">
              <h3 className="font-display text-lg font-bold text-[#1F1A16] mb-4">
                Recommended Atelier Pairings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedProducts.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => openProductModal(rel.id)}
                    className="flex items-center gap-3 bg-[#FFFFFF] p-2.5 rounded-xl border border-[#E8DFD5] cursor-pointer hover:border-[#C49258] transition-colors"
                  >
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-display text-xs font-bold text-[#1F1A16] line-clamp-1">{rel.name}</h4>
                      <span className="text-xs font-semibold text-[#C49258]">€{rel.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
