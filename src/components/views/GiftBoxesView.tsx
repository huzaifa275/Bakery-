import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Gift, Sparkles, ShoppingBag, Plus, Check, Heart, Eye } from 'lucide-react';

export const GiftBoxesView: React.FC = () => {
  const { products, addToCart, addToast } = useBakery();

  const curatedHampers = products.filter(p => p.category === 'gift_boxes');

  // Custom Hamper Builder State
  const [boxStyle, setBoxStyle] = useState('Wooden Hearth Crate with Wax Seal');
  const [selectedItems, setSelectedItems] = useState<string[]>([
    'Pain de Campagne Sourdough',
    'Haute Macaron Assortment (12 pcs)',
    'Wild French Confiture',
  ]);
  const [giftNote, setGiftNote] = useState('With warmest wishes for a delightful morning.');
  const [recipientName, setRecipientName] = useState('');

  const hamperAvailableItems = [
    { name: 'Pain de Campagne Sourdough', price: 7.80 },
    { name: 'Haute Macaron Assortment (12 pcs)', price: 28.00 },
    { name: 'Wild French Confiture (250g)', price: 9.50 },
    { name: 'Pure Charentes-Poitou Butter Croissants (4 pcs)', price: 14.00 },
    { name: 'Stoneground Heritage French T80 Flour (1kg)', price: 6.50 },
    { name: 'French Linen Baker Tea Towel', price: 18.00 },
    { name: 'Valrhona Chocolate Sablé Tin (200g)', price: 12.50 },
  ];

  const customHamperTotal = 15.00 + selectedItems.reduce((acc, name) => {
    const itm = hamperAvailableItems.find(i => i.name === name);
    return acc + (itm ? itm.price : 0);
  }, 0);

  const toggleItem = (name: string) => {
    setSelectedItems(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const handleAddCustomHamper = () => {
    if (selectedItems.length < 2) {
      addToast('Please select at least 2 items for your gift box', 'error');
      return;
    }

    const customHamperProduct = {
      id: `custom-hamper-${Date.now()}`,
      name: `Custom ${boxStyle}`,
      frenchName: 'Gift Box',
      category: 'gift_boxes' as any,
      price: customHamperTotal,
      rating: 5.0,
      reviewCount: 1,
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
      shortDescription: `Packed with ${selectedItems.join(', ')}. Note: "${giftNote}"`,
      description: `Gift box containing ${selectedItems.join(', ')}. Packed neatly with ribbon and handwritten note card.`,
      ingredients: ['Bakery selections', 'Packaging & card'],
      allergens: ['Wheat', 'Dairy', 'Eggs', 'Nuts'],
      dietary: ['Vegetarian'] as any,
      calories: 1200,
      weightGrams: 1800,
      servings: '2–4 Persons',
      preparationTimeHours: 24,
      isSeasonal: false,
      isFeatured: false,
      isAvailable: true,
      stockQuantity: 50,
    };

    addToCart(customHamperProduct, undefined, giftNote ? `To: ${recipientName || 'Friend'} - "${giftNote}"` : undefined, 1);
    addToast('Gift box added to your basket', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C49258]/15 border border-[#C49258]/30 text-[#A87438] text-xs uppercase tracking-widest font-semibold">
          <Gift className="w-3.5 h-3.5 text-[#C49258]" />
          Gift boxes &amp; baskets
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1A16]">
          Bakery Gift Boxes &amp; Hampers
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6E65] font-light">
          Breakfast baskets, macaron boxes, and sourdough hampers packed fresh with ribbon and a personal card.
        </p>
      </div>

      {/* Curated Hampers Grid */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-[#1F1A16]">
          Curated Gift Boxes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {curatedHampers.map(hamper => (
            <div
              key={hamper.id}
              className="bg-[#FFFFFF] rounded-2xl border border-[#E8DFD5] overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-[#F4EFEA]">
                <img
                  src={hamper.image}
                  alt={hamper.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#1F1A16]/85 backdrop-blur-xs text-[#E6C594] text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded">
                  {hamper.frenchName || 'Coffret Cadeau'}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <h3 className="font-display text-lg font-bold text-[#1F1A16]">
                    {hamper.name}
                  </h3>
                  <p className="text-xs text-[#7A6E65] font-light leading-relaxed">
                    {hamper.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F4EFEA] flex items-center justify-between">
                  <span className="font-display text-xl font-bold text-[#1F1A16]">
                    €{hamper.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(hamper, undefined, undefined, 1)}
                    className="bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C49258]" />
                    <span>Add to Basket</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Custom Hamper Atelier */}
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] p-8 sm:p-12 space-y-8 shadow-xs">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#C49258] font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            Atelier Sur Mesure
          </div>
          <h2 className="font-display text-3xl font-bold text-[#1F1A16]">
            Build Your Bespoke Artisan Hamper
          </h2>
          <p className="text-xs text-[#7A6E65]">
            Select your premium wooden gift box, choose your artisan delicacies, and include a hand-calligraphed wax-sealed note.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Builder Form */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Box Style */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                1. Select Gift Packaging Style (+€15.00)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Wooden Hearth Crate with Wax Seal',
                  'Linen Bound French Velvet Ribbon Box',
                ].map(box => (
                  <button
                    key={box}
                    type="button"
                    onClick={() => setBoxStyle(box)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      boxStyle === box
                        ? 'border-[#C49258] bg-[#EFE8DD] text-[#1F1A16] ring-1 ring-[#C49258]'
                        : 'border-[#E8DFD5] bg-[#FFFFFF] text-[#4A3F35]'
                    }`}
                  >
                    {box}
                  </button>
                ))}
              </div>
            </div>

            {/* Delicacy items */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                2. Choose Artisan Contents
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {hamperAvailableItems.map(item => {
                  const isChecked = selectedItems.includes(item.name);
                  return (
                    <div
                      key={item.name}
                      onClick={() => toggleItem(item.name)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                        isChecked
                          ? 'border-[#C49258] bg-[#FFFFFF] shadow-2xs font-semibold'
                          : 'border-[#E8DFD5] bg-[#FAF7F2] text-[#7A6E65] hover:bg-[#FFFFFF]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                          isChecked ? 'bg-[#C49258] border-[#C49258] text-[#191512]' : 'border-[#DCD1C4]'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{item.name}</span>
                      </div>
                      <span className="text-[#C49258] font-bold">€{item.price.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note & Recipient */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Madame Catherine Dupont"
                  className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                  Hand-Piped Gift Card Message
                </label>
                <input
                  type="text"
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Personalized message on botanical card..."
                  className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                />
              </div>
            </div>

          </div>

          {/* Live Hamper Summary Card */}
          <div className="lg:col-span-4 bg-[#FFFFFF] p-6 rounded-2xl border border-[#E8DFD5] space-y-4 shadow-sm">
            <h3 className="font-display text-lg font-bold text-[#1F1A16]">
              Hamper Overview
            </h3>

            <div className="space-y-2 text-xs text-[#7A6E65] border-b border-[#E8DFD5] pb-4">
              <div className="flex justify-between font-semibold text-[#1F1A16]">
                <span>{boxStyle}</span>
                <span>€15.00</span>
              </div>

              {selectedItems.map(name => {
                const itm = hamperAvailableItems.find(i => i.name === name);
                return (
                  <div key={name} className="flex justify-between">
                    <span>{name}</span>
                    <span>€{itm?.price.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-xs font-bold text-[#4A3F35]">Total Investment:</span>
              <span className="font-display text-2xl font-bold text-[#1F1A16]">
                €{customHamperTotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleAddCustomHamper}
              className="w-full bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Gift className="w-4 h-4 text-[#C49258]" />
              <span>Add Custom Hamper to Basket</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
