import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { MapPin, Phone, Mail, Clock, Navigation, CheckCircle2, ArrowRight, Store } from 'lucide-react';

export const LocationsView: React.FC = () => {
  const { branches, selectedBranchId, setSelectedBranchId, setActiveView, addToast } = useBakery();
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);

  const handleSelectBranch = (b: any) => {
    setSelectedBranch(b);
    setSelectedBranchId(b.id);
    addToast(`Selected ${b.name} for your Click & Collect orders`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C49258]/15 border border-[#C49258]/30 text-[#A87438] text-xs uppercase tracking-widest font-semibold">
          <Store className="w-3.5 h-3.5 text-[#C49258]" />
          Bakery locations
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1A16]">
          Where to find us
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6E65] font-light">
          Drop by for fresh morning pastries, sourdough loaves, or to pick up your online orders.
        </p>
      </div>

      {/* Atelier Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {branches.map(branch => {
          const isCurrent = branch.id === selectedBranch.id;

          return (
            <div
              key={branch.id}
              onClick={() => handleSelectBranch(branch)}
              className={`bg-[#FFFFFF] rounded-3xl border overflow-hidden shadow-2xs transition-all cursor-pointer flex flex-col justify-between ${
                isCurrent 
                  ? 'border-[#C49258] ring-2 ring-[#C49258]/40 shadow-md' 
                  : 'border-[#E8DFD5] hover:border-[#DCD1C4]'
              }`}
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-[#F4EFEA]">
                  <img
                    src={branch.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'}
                    alt={branch.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#1F1A16]/85 backdrop-blur-xs text-[#FAF7F2] text-xs font-bold px-3 py-1 rounded-lg">
                    {branch.city}, {branch.country}
                  </div>
                  {isCurrent && (
                    <div className="absolute top-4 right-4 bg-[#C49258] text-[#191512] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active Atelier
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#1F1A16]">
                      {branch.name}
                    </h3>
                    <p className="text-xs text-[#7A6E65] flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C49258] shrink-0" />
                      {branch.address}, {branch.postalCode} {branch.city}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#4A3F35] pt-2 border-t border-[#F4EFEA]">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#C49258]" />
                      <span>{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#C49258]" />
                      <span>{branch.email}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-[#7A6E65] bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E8DFD5]">
                    <div className="font-bold text-[#1F1A16] flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3 text-[#C49258]" /> Opening Hours
                    </div>
                    <p><strong>Mon – Fri:</strong> {branch.hours.weekdays}</p>
                    <p><strong>Saturday:</strong> {branch.hours.saturday}</p>
                    <p><strong>Sunday:</strong> {branch.hours.sunday}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address + ' ' + branch.city)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-[#EFE8DD] hover:bg-[#E5DACD] text-[#1F1A16] py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border border-[#DCD1C4]"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#C49258]" />
                  <span>Directions</span>
                </a>

                <button
                  onClick={() => {
                    setSelectedBranchId(branch.id);
                    setActiveView('menu');
                  }}
                  className="flex-1 bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Order Here</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C49258]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Click & Collect Guide Callout */}
      <div className="bg-[#FAF7F2] border border-[#E8DFD5] rounded-3xl p-8 sm:p-10 space-y-4">
        <h3 className="font-display text-2xl font-bold text-[#1F1A16]">
          Click &amp; Collect Priority Counter
        </h3>
        <p className="text-xs sm:text-sm text-[#7A6E65] max-w-3xl leading-relaxed">
          When ordering online, select your preferred collection atelier. Upon arrival, bypass the standard queue and approach the designated <strong>"Click &amp; Collect"</strong> priority counter. Simply state your name or show your order reference number (e.g. <code>MSH-8942</code>) to receive your warm morning bread and chilled entremet box.
        </p>
      </div>

    </div>
  );
};
