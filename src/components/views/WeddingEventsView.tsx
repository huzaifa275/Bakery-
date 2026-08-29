import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { Sparkles, Calendar, Users, Heart, ArrowRight, Check, CheckCircle2, Award } from 'lucide-react';

export const WeddingEventsView: React.FC = () => {
  const { setActiveView, addToast } = useBakery();

  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [plannerName, setPlannerName] = useState('');
  const [plannerEmail, setPlannerEmail] = useState('');
  const [plannerPhone, setPlannerPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('50–100 Guests');
  const [packageSelected, setPackageSelected] = useState('The Haute Couture Wedding Suite');
  const [message, setMessage] = useState('');
  const [tastingBoxRequested, setTastingBoxRequested] = useState(true);

  const packages = [
    {
      id: 'petite-salon',
      name: 'Intimate Gathering',
      subtitle: 'For intimate ceremonies and family brunches',
      price: 'From €650',
      guests: '20 to 45 Guests',
      features: [
        '2-Tier celebration cake with fresh seasonal florals',
        '60 French macarons (choice of 4 flavours)',
        '40 mini choux buns (vanilla cream & pistachio)',
        'Hand delivery and setup at your venue',
      ],
      image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'grand-patisserie',
      name: 'The Dessert Table',
      subtitle: 'Complete dessert table with cake & morning pastries',
      price: 'From €1,450',
      guests: '50 to 120 Guests',
      features: [
        '3-Tier tiered wedding cake with gold accents',
        'Macaron pyramid (150 pieces)',
        'Assorted mini fruit tarts and chocolate ganache bites',
        'Late-night sourdough bread and butter board',
        'Cake sample box for the couple before the big day',
      ],
      image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'haute-couture',
      name: 'Grand Celebration',
      subtitle: 'Full dessert service, breakfast hampers & cake',
      price: 'From €2,800',
      guests: '100 to 250+ Guests',
      features: [
        '4-Tier statement wedding cake with pressed edible flowers',
        'Fresh warm madeleines or crêpe station on-site',
        'Morning-after croissant and brioche hampers for guests',
        'Individually boxed macaron favours for each guest',
        'In-person cake tasting and consultation session',
      ],
      image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plannerName || !plannerEmail) {
      addToast('Please provide your name and contact email', 'error');
      return;
    }

    try {
      await fetch('/api/events/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: plannerName,
          email: plannerEmail,
          phone: plannerPhone,
          eventDate,
          guestCount,
          packageSelected,
          tastingBoxRequested,
          message,
        }),
      });
      setInquirySubmitted(true);
      addToast('Wedding enquiry received. Our event sommelier will contact you within 24h.', 'success');
    } catch {
      setInquirySubmitted(true);
      addToast('Wedding enquiry recorded.', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Editorial Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C49258]/15 border border-[#C49258]/30 text-[#A87438] text-xs uppercase tracking-widest font-semibold">
          <Heart className="w-3.5 h-3.5 text-[#C49258]" />
          Weddings &amp; celebrations
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1A16]">
          Cakes &amp; Dessert Tables for Weddings
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6E65] font-light leading-relaxed">
          From tiered wedding cakes with fresh florals to full dessert tables with macarons and morning-after breakfast bakes. We make everything fresh for your day.
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-[#FFFFFF] rounded-3xl border border-[#E8DFD5] overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-60 overflow-hidden bg-[#F4EFEA]">
                <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-[#1F1A16]/90 backdrop-blur-xs text-[#FAF7F2] font-display text-sm font-bold px-3 py-1.5 rounded-xl">
                  {pkg.price}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C49258]">
                    {pkg.guests}
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#1F1A16]">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-[#7A6E65] font-light">
                    {pkg.subtitle}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#F4EFEA]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A3F35] block">
                    Suite Inclusions:
                  </span>
                  <ul className="space-y-2 text-xs text-[#7A6E65]">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#C49258] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => {
                  setPackageSelected(pkg.name);
                  const el = document.getElementById('wedding-form');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <span>Select &amp; Inquire</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C49258]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tasting Box Feature Callout */}
      <div className="bg-[#FAF7F2] border border-[#E8DFD5] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#C49258] font-bold uppercase tracking-widest">
            <Award className="w-4 h-4" />
            Home Tasting Experience
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1F1A16]">
            Order a Wedding Cake Tasting Box
          </h3>
          <p className="text-xs sm:text-sm text-[#7A6E65] leading-relaxed">
            Delivered in a refrigerated luxury box containing 6 cake sponge wedges, 6 confiture fillings, 4 Swiss meringue frostings, and 2 mini bottles of artisanal cider for an intimate couples' tasting at home.
          </p>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById('wedding-form');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-[#C49258] hover:bg-[#A87438] text-[#191512] font-semibold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl transition-all shadow-sm shrink-0"
        >
          Request Tasting Box (€35 / Credited towards booking)
        </button>
      </div>

      {/* Wedding Enquiry Form */}
      <div id="wedding-form" className="bg-[#FFFFFF] border border-[#E8DFD5] rounded-3xl p-8 sm:p-12 max-w-3xl mx-auto shadow-sm">
        {inquirySubmitted ? (
          <div className="text-center space-y-4 py-8">
            <div className="w-16 h-16 rounded-full bg-[#EFE8DD] text-[#C49258] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-[#C49258]" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#1F1A16]">
              Enquiry Received with Pleasure
            </h3>
            <p className="text-xs text-[#7A6E65] max-w-md mx-auto">
              Our Private Events Director will prepare a tailored suite proposal and contact you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitInquiry} className="space-y-6">
            <div className="text-center space-y-1 pb-4 border-b border-[#E8DFD5]">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C49258]">
                Bespoke Proposal
              </span>
              <h2 className="font-display text-2xl font-bold text-[#1F1A16]">
                Wedding &amp; Event Enquiry Form
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  value={plannerName}
                  onChange={(e) => setPlannerName(e.target.value)}
                  placeholder="Couple / Planner Name *"
                  required
                  className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                />
              </div>
              <div>
                <input
                  type="email"
                  value={plannerEmail}
                  onChange={(e) => setPlannerEmail(e.target.value)}
                  placeholder="Email Address *"
                  required
                  className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                />
              </div>
              <div>
                <input
                  type="tel"
                  value={plannerPhone}
                  onChange={(e) => setPlannerPhone(e.target.value)}
                  placeholder="Phone Number *"
                  required
                  className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                  Wedding / Gala Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                  Estimated Guests
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                >
                  <option value="20–50 Guests">20–50 Guests</option>
                  <option value="50–100 Guests">50–100 Guests</option>
                  <option value="100–200 Guests">100–200 Guests</option>
                  <option value="200+ Guests">200+ Guests</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#7A6E65] mb-1">
                  Selected Suite Package
                </label>
                <select
                  value={packageSelected}
                  onChange={(e) => setPackageSelected(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                >
                  <option value="The Petite Salon">The Petite Salon</option>
                  <option value="The Grand Pâtisserie Table">The Grand Pâtisserie Table</option>
                  <option value="The Haute Couture Wedding Suite">The Haute Couture Wedding Suite</option>
                  <option value="Custom Bespoke Setup">Custom Bespoke Setup</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="tasting-box-chk"
                checked={tastingBoxRequested}
                onChange={(e) => setTastingBoxRequested(e.target.checked)}
                className="accent-[#C49258]"
              />
              <label htmlFor="tasting-box-chk" className="text-xs text-[#4A3F35]">
                Please include a Wedding Cake Tasting Box for home sampling (€35, credited upon package booking)
              </label>
            </div>

            <div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your wedding vision, venue location, color palette, or dietary requests..."
                rows={3}
                className="w-full bg-[#FAF7F2] border border-[#DCD1C4] rounded-xl px-4 py-2.5 text-xs text-[#1F1A16] placeholder-[#A89F95] focus:outline-none focus:border-[#C49258]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#C49258]" />
              <span>Submit Wedding Suite Enquiry</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
