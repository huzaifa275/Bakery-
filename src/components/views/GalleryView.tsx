import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { INITIAL_GALLERY } from '../../data/bakeryData';
import { X, Eye, Sparkles } from 'lucide-react';

export const GalleryView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<any | null>(null);

  const categories = [
    { id: 'all', label: 'All Atelier Moments' },
    { id: 'bread', label: 'Hearth Sourdoughs' },
    { id: 'croissant', label: 'Laminated Viennoiserie' },
    { id: 'patisserie', label: 'Entremets & Tarts' },
    { id: 'wedding', label: 'Celebration & Wedding Cakes' },
    { id: 'atelier', label: 'Bakers at Work' },
  ];

  const filteredPhotos = selectedCategory === 'all'
    ? INITIAL_GALLERY
    : INITIAL_GALLERY.filter(p => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C49258]/15 border border-[#C49258]/30 text-[#A87438] text-xs uppercase tracking-widest font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#C49258]" />
          Galerie Photographique de l'Atelier
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1A16]">
          Visual Artistry &amp; Hearth Life
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6E65] font-light">
          A visual chronicle of our stone hearth ovens, caramelized crusts, tiered wedding cakes, and golden laminations.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
              selectedCategory === c.id
                ? 'bg-[#1F1A16] text-[#FAF7F2] border-[#1F1A16] shadow-sm'
                : 'bg-[#FAF7F2] text-[#4A3F35] border-[#E8DFD5] hover:bg-[#EFE8DD]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Masonry / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setActivePhoto(photo)}
            className="group relative h-80 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer border border-[#E8DFD5] bg-[#F4EFEA]"
          >
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#191512]/90 via-[#191512]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-[#FAF7F2]">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#E6C594]">
                {photo.category}
              </span>
              <p className="text-sm font-medium mt-1">
                {photo.title}
              </p>
              <div className="flex items-center gap-1 text-xs text-[#E6C594] mt-2">
                <Eye className="w-3.5 h-3.5" />
                <span>Zoom Photo</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 bg-[#1F1A16]/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActivePhoto(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-[#191512] rounded-3xl overflow-hidden shadow-2xl border border-[#C49258]/30 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#191512]/80 text-[#FAF7F2] hover:bg-[#2C241E] z-10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={activePhoto.imageUrl}
              alt={activePhoto.title}
              className="w-full h-[65vh] object-cover"
            />

            <div className="p-6 bg-[#191512] text-[#FAF7F2] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C49258]">
                  {activePhoto.category}
                </span>
                <h4 className="font-display text-lg font-bold text-[#FAF7F2] mt-0.5">
                  {activePhoto.title}
                </h4>
                <p className="text-xs text-[#D8CEBE] font-light mt-0.5">{activePhoto.description}</p>
              </div>

              <span className="text-xs text-[#A89F95] font-mono">
                Maison Saint-Honoré Archives
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
