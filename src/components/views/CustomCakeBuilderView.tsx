import React, { useState, useMemo } from 'react';
import { useBakery } from '../../context/BakeryContext';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Layers, 
  Check, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Printer, 
  Heart, 
  Info,
  ShieldCheck,
  Palette,
  FileText,
  UserCheck
} from 'lucide-react';
import { CustomCakeRequest } from '../../types';

export const CustomCakeBuilderView: React.FC = () => {
  const { branches, addToast, setActiveView } = useBakery();

  // Wizard Step State (1 to 6 main grouped steps)
  const [currentStep, setCurrentStep] = useState(1);

  // Selections
  const [tierStyle, setTierStyle] = useState('2-Tier Celebration Masterpiece');
  const [servings, setServings] = useState('20–25 Guests');
  const [spongeFlavor, setSpongeFlavor] = useState('Sicilian Pistachio & Olive Oil');
  const [fillingFlavor, setFillingFlavor] = useState('Wild French Raspberry Confiture');
  const [frostingStyle, setFrostingStyle] = useState('Swiss Meringue Buttercream (Ivory)');
  const [decorationStyle, setDecorationStyle] = useState('Organic Edible Florals & 24K Gold Leaf');
  const [colorPalette, setColorPalette] = useState('Sage Green, Ivory & Brushed Gold');
  const [inscription, setInscription] = useState('Joyeux Anniversaire');
  const [eventType, setEventType] = useState('Milestone Birthday');
  
  // Date minimum 5 days from now
  const minDateStr = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0];
  const [eventDate, setEventDate] = useState(minDateStr);
  const [eventTime, setEventTime] = useState('14:00');
  
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');
  const [pickupBranchId, setPickupBranchId] = useState('munich-flagship');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  const [dietary, setDietary] = useState<string[]>(['Vegetarian']);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  
  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCake, setSubmittedCake] = useState<CustomCakeRequest | null>(null);

  // Price Calculation Logic
  const estimatedPrice = useMemo(() => {
    let base = 95;
    if (tierStyle.includes('Single')) base = 85;
    else if (tierStyle.includes('2-Tier')) base = 195;
    else if (tierStyle.includes('3-Tier')) base = 390;
    else if (tierStyle.includes('Lambeth')) base = 145;
    else if (tierStyle.includes('Sculpted')) base = 220;

    if (servings.includes('35–40')) base += 60;
    else if (servings.includes('50+')) base += 120;

    if (spongeFlavor.includes('Pistachio')) base += 15;
    if (spongeFlavor.includes('Valrhona')) base += 12;

    if (decorationStyle.includes('24K Gold')) base += 25;
    if (decorationStyle.includes('Cascade')) base += 20;

    if (fulfillmentType === 'delivery') base += 18;

    return base;
  }, [tierStyle, servings, spongeFlavor, decorationStyle, fulfillmentType]);

  const tierOptions = [
    {
      id: 'Single Tier Petite (6" or 8")',
      name: 'Single Tier Petite (6" or 8")',
      subtitle: 'Ideal for intimate birthdays & dinners (6–12 guests)',
      baseCost: 'From €85',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: '2-Tier Celebration Masterpiece',
      name: '2-Tier Celebration Masterpiece',
      subtitle: 'Our signature structure for milestone anniversaries & parties (20–30 guests)',
      baseCost: 'From €195',
      image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: '3-Tier Grand Gala & Wedding Suite',
      name: '3-Tier Grand Gala & Wedding Suite',
      subtitle: 'Showstopping tiered architecture with internal dowel supports (40–70 guests)',
      baseCost: 'From €390',
      image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'Vintage Lambeth Victorian Piping',
      name: 'Vintage Lambeth Victorian Piping',
      subtitle: 'Intricate over-piped royal ruffles and maraschino cherries (10–18 guests)',
      baseCost: 'From €145',
      image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const spongeOptions = [
    { name: 'Sicilian Pistachio & Olive Oil', desc: 'Moist cold-pressed extra virgin olive oil cake with finely milled Bronte pistachios' },
    { name: 'Valrhona Grand Cru Noir Chocolate', desc: 'Dense, rich 70% Guanaja chocolate crumb with dark cocoa notes' },
    { name: 'Madagascar Bourbon Vanilla Bean', desc: 'Light, tender sponge speckled with fragrant caviar of cured vanilla pods' },
    { name: 'Earl Grey & French Lavender', desc: 'Bergamot-infused chiffon sponge paired with delicate floral undertones' },
    { name: 'Salted Caramel Roasted Pecan', desc: 'Browned butter sponge with caramelized Georgian pecans' },
    { name: 'Lemon Raspberry Chiffon', desc: 'Zesty organic Amalfi lemon sponge with ribboned raspberry swirls' },
  ];

  const fillingOptions = [
    { name: 'Wild French Raspberry Confiture', desc: 'Slow-cooked tart berry compote with low sugar' },
    { name: 'Hazelnut Praliné Feuilletine Crunch', desc: 'Crispy caramelized crepe wafers folded into Piedmont hazelnut praliné' },
    { name: 'Mango & Passionfruit Curd', desc: 'Bright tropical curd with velvety texture' },
    { name: 'Belgian Dark Chocolate Silk Ganache', desc: 'Whipped 64% dark chocolate ganache cream' },
    { name: 'Mascarpone Crème Chantilly', desc: 'Light Italian mascarpone whipped with Bourbon vanilla' },
  ];

  const frostingOptions = [
    { name: 'Swiss Meringue Buttercream (Ivory)', desc: 'Silky, ultra-smooth and light with balanced sweetness' },
    { name: 'Velvety Dark Chocolate Ganache', desc: 'Rich mirror-smooth or textured dark chocolate' },
    { name: 'Whipped White Chocolate & Vanilla', desc: 'Delicate ivory finish with creamy Tahitian vanilla' },
    { name: 'Semi-Naked Rustic Birch', desc: 'Exposed natural sponge layers with delicate rustic scraping' },
  ];

  const decorationOptions = [
    { name: 'Organic Edible Florals & 24K Gold Leaf', desc: 'Pesticide-free pansies, chamomile, and flakes of pure edible 24-karat gold' },
    { name: 'Botanical Lambeth Ruffle Piping', desc: 'Handcrafted buttercream rosettes, bows, and intricate vintage borders' },
    { name: 'Minimalist Architectural Texture', desc: 'Modern stone-textured or wave palette knife sculpting' },
    { name: 'Haute Macaron Cascade & Fresh Berries', desc: 'Assortment of handmade macarons and wild seasonal blackberries' },
  ];

  const paletteOptions = [
    'Sage Green, Ivory & Brushed Gold',
    'Classic Ivory, Linen & Champagne',
    'Blush Rose, Peony Pink & Gold',
    'Midnight Navy, Bronze & Ivory',
    'Pastel French Spring (Lavender, Mint, Buttercream)',
  ];

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      addToast('Please provide your contact information to receive the cake blueprint', 'error');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      cakeType: tierStyle,
      servings,
      spongeFlavor,
      fillingFlavor,
      frostingStyle,
      decorationStyle,
      colorPalette,
      inscriptionMessage: inscription,
      eventType,
      eventDate,
      fulfillmentType,
      pickupBranchId: fulfillmentType === 'pickup' ? pickupBranchId : undefined,
      deliveryAddress: fulfillmentType === 'delivery' ? deliveryAddress : undefined,
      budgetRange: `€${estimatedPrice - 30} – €${estimatedPrice + 50}`,
      estimatedPrice,
      dietaryRestrictions: dietary,
      additionalNotes,
      referenceImageUrl,
    };

    try {
      const res = await fetch('/api/custom-cakes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedCake(data.customCakeRequest);
        try {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#C49258', '#E6C594', '#FAF7F2']
          });
        } catch {}
        addToast(`Bespoke cake enquiry ${data.customCakeRequest.referenceNumber} submitted!`, 'success');
      } else {
        addToast('Failed to submit quote enquiry', 'error');
      }
    } catch {
      // Local fallback
      const localCake: CustomCakeRequest = {
        id: `cake-${Date.now()}`,
        referenceNumber: `MSH-CAKE-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        ...payload,
        status: 'submitted',
      };
      setSubmittedCake(localCake);
      addToast(`Bespoke cake enquiry ${localCake.referenceNumber} recorded!`, 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDietary = (item: string) => {
    setDietary(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C49258]/15 border border-[#C49258]/30 text-[#A87438] text-xs uppercase tracking-widest font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#C49258]" />
          Celebration cakes
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1F1A16]">
          Custom Cake Builder
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6E65] font-light leading-relaxed">
          Choose your size, sponge flavours, homemade fillings and decorative finish. We bake and assemble each cake by hand for your celebration.
        </p>
      </div>

      {submittedCake ? (
        /* Confirmation Screen */
        <div className="bg-[#FAF7F2] border border-[#E8DFD5] rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#EFE8DD] text-[#C49258] flex items-center justify-center mx-auto border border-[#C49258]/40">
            <CheckCircle2 className="w-10 h-10 text-[#C49258]" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-widest text-[#C49258] font-bold">
              Cake Order Details Received
            </span>
            <h2 className="font-display text-3xl font-bold text-[#1F1A16]">
              Thank you, {submittedCake.customer.name}!
            </h2>
            <p className="text-xs text-[#7A6E65]">
              We've received your cake request <strong className="font-mono text-[#1F1A16]">{submittedCake.referenceNumber}</strong> and will follow up to confirm all details.
            </p>
          </div>

          {/* Blueprint Card */}
          <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E8DFD5] text-left space-y-3 text-xs text-[#4A3F35] shadow-2xs">
            <div className="flex justify-between border-b border-[#E8DFD5] pb-3">
              <div>
                <span className="text-[10px] text-[#7A6E65] uppercase font-bold block">Style &amp; Servings</span>
                <span className="font-bold text-sm text-[#1F1A16]">{submittedCake.cakeType}</span>
                <span className="text-[11px] text-[#7A6E65] block">({submittedCake.servings})</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#7A6E65] uppercase font-bold block">Estimated Cost</span>
                <span className="font-display text-lg font-bold text-[#C49258]">
                  €{submittedCake.estimatedPrice?.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <p><strong>Sponge:</strong> {submittedCake.spongeFlavor}</p>
              <p><strong>Filling:</strong> {submittedCake.fillingFlavor}</p>
              <p><strong>Frosting:</strong> {submittedCake.frostingStyle}</p>
              <p><strong>Decoration:</strong> {submittedCake.decorationStyle}</p>
              <p><strong>Event Date:</strong> {submittedCake.eventDate}</p>
              <p><strong>Palette:</strong> {submittedCake.colorPalette}</p>
            </div>

            {submittedCake.inscriptionMessage && (
              <p className="pt-2 border-t border-[#F4EFEA] italic text-[#C49258]">
                Inscription: "{submittedCake.inscriptionMessage}"
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => window.print()}
              className="bg-[#EFE8DD] hover:bg-[#E5DACD] text-[#1F1A16] px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider border border-[#DCD1C4] flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Cake Blueprint</span>
            </button>

            <button
              onClick={() => {
                setSubmittedCake(null);
                setCurrentStep(1);
              }}
              className="bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider"
            >
              Build Another Cake
            </button>
          </div>
        </div>
      ) : (
        /* Multi-Step Builder Form & Live Summary */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Builder Form Column */}
          <div className="lg:col-span-8 bg-[#FAF7F2] rounded-3xl border border-[#E8DFD5] p-6 sm:p-8 space-y-8 shadow-xs">
            
            {/* Step Progress Tracker */}
            <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-4 text-xs font-semibold">
              <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-1">
                {[
                  { step: 1, label: '1. Architecture & Tiers' },
                  { step: 2, label: '2. Flavors & Fillings' },
                  { step: 3, label: '3. Finishes & Florals' },
                  { step: 4, label: '4. Date & Details' },
                  { step: 5, label: '5. Contact & Submit' },
                ].map(s => (
                  <button
                    key={s.step}
                    onClick={() => setCurrentStep(s.step)}
                    className={`whitespace-nowrap pb-1.5 transition-colors ${
                      currentStep === s.step
                        ? 'border-b-2 border-[#C49258] text-[#C49258]'
                        : currentStep > s.step
                        ? 'text-[#3F5E46]'
                        : 'text-[#7A6E65]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 1: Architecture & Tiers */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="space-y-1">
                  <h3 className="font-display text-xl font-bold text-[#1F1A16]">
                    Select Cake Architecture &amp; Tiers
                  </h3>
                  <p className="text-xs text-[#7A6E65]">
                    Choose the structural design of your celebration cake.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tierOptions.map(t => (
                    <div
                      key={t.id}
                      onClick={() => setTierStyle(t.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        tierStyle === t.id
                          ? 'border-[#C49258] bg-[#EFE8DD] ring-2 ring-[#C49258]/30 shadow-xs'
                          : 'border-[#E8DFD5] bg-[#FFFFFF] hover:border-[#DCD1C4]'
                      }`}
                    >
                      <img src={t.image} alt={t.name} className="h-32 w-full object-cover rounded-xl" />
                      <div>
                        <span className="font-display text-sm font-bold text-[#1F1A16] block">{t.name}</span>
                        <span className="text-[11px] text-[#7A6E65] block mt-0.5 leading-snug">{t.subtitle}</span>
                      </div>
                      <span className="text-xs font-semibold text-[#C49258]">{t.baseCost}</span>
                    </div>
                  ))}
                </div>

                {/* Servings */}
                <div className="space-y-2 pt-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                    Number of Guest Servings
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {['6–8 Guests', '12–16 Guests', '20–25 Guests', '35–40 Guests', '50+ Guests'].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setServings(s)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                          servings === s
                            ? 'border-[#C49258] bg-[#1F1A16] text-[#FAF7F2]'
                            : 'border-[#DCD1C4] bg-[#FFFFFF] text-[#4A3F35] hover:bg-[#F4EFEA]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
                  >
                    <span>Next: Flavors &amp; Fillings</span>
                    <ArrowRight className="w-4 h-4 text-[#C49258]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Flavors & Fillings */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="space-y-1">
                  <h3 className="font-display text-xl font-bold text-[#1F1A16]">
                    Select Sponge Flavour &amp; Interior Confiture
                  </h3>
                  <p className="text-xs text-[#7A6E65]">
                    Our sponges are soaked in light organic syrup and layered with handcrafted confitures.
                  </p>
                </div>

                {/* Sponge selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                    Artisan Sponge Recipe
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {spongeOptions.map(s => (
                      <div
                        key={s.name}
                        onClick={() => setSpongeFlavor(s.name)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          spongeFlavor === s.name
                            ? 'border-[#C49258] bg-[#EFE8DD] ring-1 ring-[#C49258]'
                            : 'border-[#E8DFD5] bg-[#FFFFFF] hover:bg-[#F4EFEA]'
                        }`}
                      >
                        <span className="font-bold text-xs text-[#1F1A16] block">{s.name}</span>
                        <span className="text-[11px] text-[#7A6E65] block mt-0.5 leading-snug">{s.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filling selector */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                    Interior Confiture &amp; Crunch Layer
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {fillingOptions.map(f => (
                      <div
                        key={f.name}
                        onClick={() => setFillingFlavor(f.name)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          fillingFlavor === f.name
                            ? 'border-[#C49258] bg-[#EFE8DD] ring-1 ring-[#C49258]'
                            : 'border-[#E8DFD5] bg-[#FFFFFF] hover:bg-[#F4EFEA]'
                        }`}
                      >
                        <span className="font-bold text-xs text-[#1F1A16] block">{f.name}</span>
                        <span className="text-[11px] text-[#7A6E65] block mt-0.5 leading-snug">{f.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="bg-[#EFE8DD] text-[#1F1A16] px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
                  >
                    <span>Next: Finishes &amp; Florals</span>
                    <ArrowRight className="w-4 h-4 text-[#C49258]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Finishes & Florals */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="space-y-1">
                  <h3 className="font-display text-xl font-bold text-[#1F1A16]">
                    Frosting Style, Aesthetics &amp; Color Palette
                  </h3>
                  <p className="text-xs text-[#7A6E65]">
                    Custom decoration, edible gold leaf, and piped calligraphy inscription.
                  </p>
                </div>

                {/* Frosting Finish */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                    Outer Frosting &amp; Finish
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {frostingOptions.map(f => (
                      <div
                        key={f.name}
                        onClick={() => setFrostingStyle(f.name)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          frostingStyle === f.name
                            ? 'border-[#C49258] bg-[#EFE8DD] ring-1 ring-[#C49258]'
                            : 'border-[#E8DFD5] bg-[#FFFFFF] hover:bg-[#F4EFEA]'
                        }`}
                      >
                        <span className="font-bold text-xs text-[#1F1A16] block">{f.name}</span>
                        <span className="text-[11px] text-[#7A6E65] block mt-0.5 leading-snug">{f.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decoration style */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                    Botanical &amp; Gold Decoration Style
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {decorationOptions.map(d => (
                      <div
                        key={d.name}
                        onClick={() => setDecorationStyle(d.name)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          decorationStyle === d.name
                            ? 'border-[#C49258] bg-[#EFE8DD] ring-1 ring-[#C49258]'
                            : 'border-[#E8DFD5] bg-[#FFFFFF] hover:bg-[#F4EFEA]'
                        }`}
                      >
                        <span className="font-bold text-xs text-[#1F1A16] block">{d.name}</span>
                        <span className="text-[11px] text-[#7A6E65] block mt-0.5 leading-snug">{d.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color Palette */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                    Color Theme / Palette
                  </label>
                  <select
                    value={colorPalette}
                    onChange={(e) => setColorPalette(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-4 py-2.5 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                  >
                    {paletteOptions.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Inscription */}
                <div className="space-y-1 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                    Custom Piped Inscription on Cake or Chocolate Plaque
                  </label>
                  <input
                    type="text"
                    value={inscription}
                    onChange={(e) => setInscription(e.target.value)}
                    placeholder="e.g. Joyeux 30ème Anniversaire Sophie / Clara & Max 2026"
                    className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-4 py-2.5 text-xs text-[#1F1A16] placeholder-[#A89F95] focus:outline-none focus:border-[#C49258]"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="bg-[#EFE8DD] text-[#1F1A16] px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
                  >
                    <span>Next: Event Date &amp; Logistics</span>
                    <ArrowRight className="w-4 h-4 text-[#C49258]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Event Date & Logistics */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="space-y-1">
                  <h3 className="font-display text-xl font-bold text-[#1F1A16]">
                    Event Occasion &amp; Fulfillment Timing
                  </h3>
                  <p className="text-xs text-[#7A6E65]">
                    Custom tiered cakes require 5–7 days preparation to cure sponge structures.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                      Celebration Occasion
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                    >
                      <option value="Milestone Birthday">Milestone Birthday (18th, 30th, 50th, etc.)</option>
                      <option value="Wedding / Engagement">Wedding / Engagement Gala</option>
                      <option value="Anniversary">Anniversary Celebration</option>
                      <option value="Baby Shower / Christening">Baby Shower / Christening</option>
                      <option value="Corporate Gala">Corporate Gala / Brand Launch</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                      Event Date (Min. 5 days lead time)
                    </label>
                    <input
                      type="date"
                      min={minDateStr}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                      required
                    />
                  </div>
                </div>

                {/* Fulfillment */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                    Fulfillment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('pickup')}
                      className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                        fulfillmentType === 'pickup'
                          ? 'border-[#C49258] bg-[#EFE8DD] font-bold text-[#1F1A16]'
                          : 'border-[#E8DFD5] bg-[#FFFFFF] text-[#7A6E65]'
                      }`}
                    >
                      <span>In-Store Atelier Collection</span>
                      <span className="block text-[11px] text-[#7A6E65] font-normal">Packaged in padded tiered box</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfillmentType('delivery')}
                      className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                        fulfillmentType === 'delivery'
                          ? 'border-[#C49258] bg-[#EFE8DD] font-bold text-[#1F1A16]'
                          : 'border-[#E8DFD5] bg-[#FFFFFF] text-[#7A6E65]'
                      }`}
                    >
                      <span>Refrigerated White-Glove Van</span>
                      <span className="block text-[11px] text-[#7A6E65] font-normal">+€18.00 • Handled upright</span>
                    </button>
                  </div>

                  {fulfillmentType === 'pickup' ? (
                    <select
                      value={pickupBranchId}
                      onChange={(e) => setPickupBranchId(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Venue / Home address for refrigerated courier..."
                      className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                    />
                  )}
                </div>

                {/* Dietary pills */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                    Dietary Requirements in Guest Party
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Vegetarian', 'Nut-Free Recipe Preferred', 'Gluten-Friendly Sponge', 'Halal-Friendly'].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDietary(d)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          dietary.includes(d)
                            ? 'bg-[#1F1A16] text-[#FAF7F2] border-[#1F1A16]'
                            : 'bg-[#FFFFFF] text-[#4A3F35] border-[#DCD1C4] hover:bg-[#F4EFEA]'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="bg-[#EFE8DD] text-[#1F1A16] px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
                  >
                    <span>Next: Customer Information</span>
                    <ArrowRight className="w-4 h-4 text-[#C49258]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Contact & Submit Quote */}
            {currentStep === 5 && (
              <form onSubmit={handleSubmitQuote} className="space-y-6 animate-in fade-in">
                <div className="space-y-1">
                  <h3 className="font-display text-xl font-bold text-[#1F1A16]">
                    Finalize Cake Enquiry &amp; Contact Details
                  </h3>
                  <p className="text-xs text-[#7A6E65]">
                    Our pastry atelier will review your design and confirm oven availability within 24 hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Full Name *"
                      required
                      className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Email Address *"
                      required
                      className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Phone Number *"
                      required
                      className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1A16] focus:outline-none focus:border-[#C49258]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3F35]">
                    Special Design Requests or Floral Preferences
                  </label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="e.g. Please include fresh white garden roses, or match our invitation color swatch..."
                    rows={3}
                    className="w-full bg-[#FFFFFF] border border-[#DCD1C4] rounded-xl px-3.5 py-2.5 text-xs text-[#1F1A16] placeholder-[#A89F95] focus:outline-none focus:border-[#C49258]"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="bg-[#EFE8DD] text-[#1F1A16] px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 text-[#C49258]" />
                    <span>{isSubmitting ? 'Registering Blueprint...' : 'Submit Bespoke Cake Enquiry'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Real-time Cake Summary Card Column */}
          <div className="lg:col-span-4 bg-[#FFFFFF] rounded-3xl border border-[#E8DFD5] p-6 space-y-6 shadow-sm sticky top-28">
            <div className="border-b border-[#E8DFD5] pb-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C49258]">
                Real-Time Blueprint
              </span>
              <h3 className="font-display text-lg font-bold text-[#1F1A16]">
                Your Custom Creation
              </h3>
            </div>

            <div className="space-y-3 text-xs text-[#4A3F35]">
              <div className="flex justify-between">
                <span className="text-[#7A6E65]">Tier Architecture:</span>
                <span className="font-semibold text-[#1F1A16] text-right">{tierStyle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A6E65]">Guest Servings:</span>
                <span className="font-semibold text-[#1F1A16]">{servings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A6E65]">Artisan Sponge:</span>
                <span className="font-semibold text-[#1F1A16] text-right">{spongeFlavor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A6E65]">Confiture Layer:</span>
                <span className="font-semibold text-[#1F1A16] text-right">{fillingFlavor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A6E65]">Outer Finish:</span>
                <span className="font-semibold text-[#1F1A16] text-right">{frostingStyle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A6E65]">Decoration:</span>
                <span className="font-semibold text-[#1F1A16] text-right">{decorationStyle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A6E65]">Scheduled Date:</span>
                <span className="font-semibold text-[#C49258]">{eventDate}</span>
              </div>
            </div>

            {inscription && (
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DFD5] text-[11px] text-[#4A3F35]">
                <span className="font-bold block text-[#1F1A16]">Piped Inscription:</span>
                <span className="italic text-[#C49258]">"{inscription}"</span>
              </div>
            )}

            <div className="border-t border-[#E8DFD5] pt-4 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-[#7A6E65]">Estimated Investment:</span>
                <span className="font-display text-2xl font-bold text-[#1F1A16]">
                  €{estimatedPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-[#7A6E65]">
                Includes artisan consultation, dowel staging, and bespoke box packaging.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
