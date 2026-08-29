import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  ShoppingBag, 
  ArrowRight, 
  Clock, 
  Heart, 
  Star, 
  MapPin, 
  Check, 
  Eye, 
  Sparkles,
  Flame,
  Wheat,
  ChefHat,
  CheckCircle2,
  Phone,
  Mail,
  Send
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    setActiveView,
    products,
    branches,
    reviews,
    addToCart,
    openProductModal,
    wishlist,
    toggleWishlist,
    selectedBranchId,
  } = useBakery();

  const [videoError, setVideoError] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // 6 Popular Daily Bakes
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 6);
  const currentBranch = branches.find(b => b.id === selectedBranchId) || branches[0];
  const featuredReviews = reviews.slice(0, 4);

  const categoriesOverview = [
    {
      id: 'bread',
      title: 'Sourdough & Country Bread',
      desc: 'Naturally fermented over 48 hours with stoneground flour, water and sea salt.',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=85',
      count: '3 Varieties',
    },
    {
      id: 'croissants',
      title: 'Croissants & Morning Pastries',
      desc: 'All-butter flaky croissants, pain au chocolat, cardamom buns and cinnamon knots.',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=85',
      count: '5 Varieties',
    },
    {
      id: 'cakes',
      title: 'Cakes & Afternoon Tarts',
      desc: 'Seasonal fruit tarts, chocolate entremets, and slices for your afternoon table.',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85',
      count: '6 Varieties',
    },
    {
      id: 'gift_boxes',
      title: 'Pastry Boxes & Hampers',
      desc: 'Boxes of croissants, macarons and treats packed up for sharing or gifting.',
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=85',
      count: '4 Curated Sets',
    },
  ];

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=85',
      caption: 'Fresh sourdough resting from the hearth oven',
    },
    {
      url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=85',
      caption: 'Laminating 27 layers of cultured butter',
    },
    {
      url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=85',
      caption: 'Hand scoring loaves before morning baking',
    },
    {
      url: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=85',
      caption: 'Warm cardamom and cinnamon knots with pearl sugar',
    },
    {
      url: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=85',
      caption: 'Artisan bakery counter in Lyon',
    },
    {
      url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=85',
      caption: 'Hand-piped buttercream celebration cake',
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1F1A16] overflow-x-hidden">
      
      {/* ---------------------------------------------------- */}
      {/* 2. HERO SECTION */}
      {/* ---------------------------------------------------- */}
      <section 
        id="hero-section"
        className="relative min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh] flex items-center overflow-hidden bg-[#181411] text-[#FAF7F2]"
      >
        {/* Background Visual: Subtle Video or High-res Fallback */}
        <div className="absolute inset-0 z-0">
          {!videoError ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=2400&q=85"
              onError={() => setVideoError(true)}
              className="w-full h-full object-cover object-center"
            >
              <source 
                src="https://cdn.coverr.co/videos/coverr-baker-placing-bread-in-the-oven-5178/1080p.mp4" 
                type="video/mp4" 
              />
            </video>
          ) : null}

          <img
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=2400&q=85"
            alt="Fresh sourdough bread and artisan bakery"
            className={`absolute inset-0 w-full h-full object-cover object-center ${videoError ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
          />

          {/* Gradients for WCAG Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#181411]/95 via-[#181411]/70 to-[#181411]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181411] via-transparent to-[#181411]/40" />
        </div>

        {/* Hero Content with Perfect Spacing */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-16 lg:py-20 w-full">
          <div className="max-w-2xl flex flex-col justify-center">
            
            {/* Morning Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2]/10 backdrop-blur-md border border-[#FAF7F2]/20 text-[#EADFCF] text-xs font-medium w-fit mb-5 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ovens hot since 5:00 AM • Baking fresh today</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#FAF7F2] leading-[1.12] mb-4 sm:mb-5">
              Fresh from our oven, <br />
              <span className="italic font-serif text-[#E6C594]">every morning.</span>
            </h1>

            {/* Narrative Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-[#D8CEBE] font-light leading-relaxed max-w-xl mb-6 sm:mb-8">
              Good bread, proper pastries and cakes made with care in our bakery. Baked throughout the morning with stoneground flours and real butter.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <button
                id="hero-order-btn"
                onClick={() => setActiveView('menu')}
                className="bg-[#C49258] hover:bg-[#B37E43] text-[#191512] font-bold text-xs uppercase tracking-wider px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#191512]" />
                <span>Order for Pickup</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-menu-btn"
                onClick={() => {
                  const el = document.getElementById('why-us-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-[#FAF7F2] border border-[#FAF7F2]/30 font-semibold text-xs uppercase tracking-wider px-6 py-3.5 sm:px-7 sm:py-4 rounded-xl backdrop-blur-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>See What We Bake</span>
              </button>
            </div>

            {/* Micro Trust Strip */}
            <div className="pt-4 border-t border-[#FAF7F2]/15 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#D8CEBE]">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#C49258]" />
                Baked Fresh Hourly
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Wheat className="w-3.5 h-3.5 text-[#C49258]" />
                48h Cold Fermentation
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5 text-[#C49258]" />
                Real Cultured Butter
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. WHY US (3 BLOCKS) — "Why people come to us" */}
      {/* ---------------------------------------------------- */}
      <section id="why-us-section" className="py-16 sm:py-20 lg:py-24 bg-[#FFFFFF] border-b border-[#E8DFD5]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C49258] font-bold">
              Our Promise
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1F1A16]">
              Why people come to us
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6E65] font-light">
              Simple principles we hold onto every morning when the ovens heat up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Block 1: Baked Fresh */}
            <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD5] space-y-4 hover:border-[#C49258] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#C49258]/15 text-[#C49258] flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#1F1A16]">
                Baked Fresh
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3F35] font-light leading-relaxed">
                We bake in small batches throughout the morning so the croissants and bread are fresh when you arrive.
              </p>
            </div>

            {/* Block 2: Made Here */}
            <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD5] space-y-4 hover:border-[#C49258] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#C49258]/15 text-[#C49258] flex items-center justify-center">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#1F1A16]">
                Made Here
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3F35] font-light leading-relaxed">
                Every loaf, bun and cake is made by hand in our bakery using traditional methods, real butter and stoneground flour.
              </p>
            </div>

            {/* Block 3: Order Ahead */}
            <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD5] space-y-4 hover:border-[#C49258] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#C49258]/15 text-[#C49258] flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#1F1A16]">
                Order Ahead
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3F35] font-light leading-relaxed">
                Order online for quick counter pickup, or have celebration cakes and pastry boxes prepared for your event.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. FAVOURITES / POPULAR DAILY BAKES */}
      {/* ---------------------------------------------------- */}
      <section id="favourites-section" className="py-16 sm:py-20 lg:py-24 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-widest text-[#C49258] font-bold">
                Daily Favourites
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#1F1A16] font-bold tracking-tight">
                Our most popular morning bakes
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6E65] font-light">
                The bakes our regulars return for every week.
              </p>
            </div>

            <button
              onClick={() => setActiveView('menu')}
              className="self-start sm:self-auto bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>See Full Menu ({products.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C49258]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProducts.map((product) => {
              const isFavorited = wishlist.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-[#FFFFFF] rounded-2xl border border-[#E8DFD5] overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  {/* Image & Overlays */}
                  <div className="relative aspect-4/3 overflow-hidden bg-[#F4EFEA]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Wishlist button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-[#FAF7F2]/90 backdrop-blur-xs text-[#7A6E65] hover:text-rose-600 shadow-sm transition-colors cursor-pointer"
                      aria-label="Save to favorites"
                    >
                      <Heart className={`w-4 h-4 ${isFavorited ? 'text-rose-500 fill-rose-500' : ''}`} />
                    </button>

                    {/* Quick look button */}
                    <button
                      onClick={() => openProductModal(product.id)}
                      className="absolute bottom-3 right-3 p-2 rounded-full bg-[#1F1A16]/80 backdrop-blur-xs text-[#FAF7F2] hover:bg-[#1F1A16] shadow-sm transition-colors text-xs flex items-center gap-1.5 opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="View Ingredients"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-medium pr-1">Ingredients</span>
                    </button>

                    {product.frenchName && (
                      <span className="absolute top-3 left-3 bg-[#1F1A16]/85 backdrop-blur-xs text-[#E6C594] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md">
                        {product.frenchName}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#7A6E65]">
                        <span className="uppercase tracking-wider font-semibold text-[10px] bg-[#F4EFEA] px-2 py-0.5 rounded text-[#7A6E65]">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{product.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <h3 
                        onClick={() => openProductModal(product.id)}
                        className="font-display text-lg font-bold text-[#1F1A16] group-hover:text-[#C49258] transition-colors cursor-pointer leading-snug"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-[#7A6E65] font-light line-clamp-2">
                        {product.shortDescription}
                      </p>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="pt-3 border-t border-[#F4EFEA] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#7A6E65] block uppercase font-medium">Price</span>
                        <span className="font-display text-xl font-bold text-[#1F1A16]">
                          €{product.price.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(product, undefined, undefined, 1)}
                        className="bg-[#1F1A16] hover:bg-[#2C241E] text-[#FAF7F2] px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs group/btn cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#C49258] group-hover/btn:rotate-12 transition-transform" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. MENU PREVIEW (CATEGORIES) */}
      {/* ---------------------------------------------------- */}
      <section id="menu-preview-section" className="py-16 sm:py-20 lg:py-24 bg-[#FFFFFF] border-t border-b border-[#E8DFD5]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-widest text-[#C49258] font-bold">
                Menu Overview
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#1F1A16] font-bold tracking-tight">
                Explore what we make
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6E65] font-light">
                From crusty loaves and breakfast croissants to celebration cakes and gift boxes.
              </p>
            </div>

            <button
              onClick={() => setActiveView('menu')}
              className="self-start sm:self-auto text-xs font-semibold text-[#C49258] hover:text-[#A87438] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <span>View full menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoriesOverview.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setActiveView('menu')}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#E8DFD5] flex flex-col justify-end p-6 bg-[#2C241E]"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#191512] via-[#191512]/50 to-transparent" />
                
                <div className="relative z-10 space-y-1.5 text-[#FAF7F2]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E6C594]">
                    {cat.count}
                  </span>
                  <h3 className="font-display text-xl font-bold leading-tight group-hover:text-[#E6C594] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#D8CEBE] font-light line-clamp-2">
                    {cat.desc}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#E6C594]">
                    <span>Browse category</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 6. CUSTOM CAKES SECTION */}
      {/* ---------------------------------------------------- */}
      <section id="custom-cakes-section" className="py-16 sm:py-20 lg:py-24 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="bg-[#241E19] text-[#FAF7F2] rounded-3xl p-8 sm:p-12 lg:p-14 border border-[#C49258]/30 shadow-xl overflow-hidden relative">
            <div className="relative z-10 max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C49258]/20 text-[#E6C594] text-xs uppercase tracking-widest font-semibold">
                <Sparkles className="w-3 h-3 text-[#C49258]" />
                Bespoke Cakes
              </div>

              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                Got a celebration in mind? <br />
                <span className="text-[#E6C594] font-serif italic">We'll bake it for your day.</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#D8CEBE] font-light leading-relaxed">
                Birthdays, weddings, anniversaries or weekend gatherings. Choose your sponge, fillings, buttercream and custom inscription in our interactive cake builder.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  id="custom-cake-builder-btn"
                  onClick={() => setActiveView('custom-cakes')}
                  className="bg-[#C49258] hover:bg-[#B37E43] text-[#191512] font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Custom Cake Builder</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveView('weddings-events')}
                  className="bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-[#FAF7F2] border border-[#FAF7F2]/30 px-6 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Weddings &amp; Large Events
                </button>
              </div>

              <div className="pt-2 text-xs text-[#A89F95] flex items-center gap-4">
                <span>✓ 48-hour notice</span>
                <span>•</span>
                <span>✓ Hand-piped inscriptions</span>
                <span>•</span>
                <span>✓ Counter collection or delivery</span>
              </div>
            </div>

            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/3">
              <img
                src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=85"
                alt="Artisan celebration cake"
                className="w-full h-full object-cover opacity-85"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 7. ABOUT SECTION */}
      {/* ---------------------------------------------------- */}
      <section id="about-section" className="py-16 sm:py-20 lg:py-24 bg-[#191512] text-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Story Text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C49258]/15 border border-[#C49258]/30 text-[#E6C594] text-xs uppercase tracking-widest font-medium">
                <ChefHat className="w-3.5 h-3.5 text-[#C49258]" />
                About Maison Éloise
              </div>

              <h2 className="font-display text-3xl sm:text-5xl font-normal leading-tight text-[#FAF7F2]">
                We started this bakery to make the kind of bread we love taking home.
              </h2>

              <p className="text-xs sm:text-sm text-[#D8CEBE] font-light leading-relaxed">
                Good flour, clean water, sea salt and plenty of time. We feed our sourdough starter every single day and let the dough rest for up to three days before baking on the stone hearth. No artificial preservatives, no commercial bread improvers — just patient fermentation and proper crust.
              </p>

              <div className="space-y-3 pt-2 text-xs text-[#D8CEBE]">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C49258]/20 flex items-center justify-center text-[#C49258] shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <strong className="text-[#FAF7F2] block">Stoneground flours with nothing added</strong>
                    <span>Milled grain that keeps its natural wheat germ and nutty flavour.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C49258]/20 flex items-center justify-center text-[#C49258] shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <strong className="text-[#FAF7F2] block">Real churned butter for every croissant</strong>
                    <span>High-fat cultured butter layered into dough for honest golden flakes.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C49258]/20 flex items-center justify-center text-[#C49258] shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <strong className="text-[#FAF7F2] block">Naturally fermented for better digestion</strong>
                    <span>Slow wild sourdough cultures that break down gluten naturally.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setActiveView('about')}
                  className="bg-[#C49258] hover:bg-[#B37E43] text-[#191512] px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Read our full story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Photos */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=85"
                alt="Scoring sourdough dough"
                className="rounded-2xl object-cover h-64 sm:h-72 w-full border border-[#3E342B] shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=85"
                alt="Golden baked croissants"
                className="rounded-2xl object-cover h-64 sm:h-72 w-full border border-[#3E342B] shadow-lg translate-y-4"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 8. GALLERY / BEHIND THE COUNTER */}
      {/* ---------------------------------------------------- */}
      <section id="gallery-section" className="py-16 sm:py-20 lg:py-24 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs uppercase tracking-widest text-[#C49258] font-bold">
              Behind the Counter
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1F1A16]">
              Life in our bakery
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6E65] font-light">
              Flour on the counters, wood peel ovens, and morning rituals.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {galleryImages.map((item, idx) => (
              <div 
                key={idx}
                className="group relative h-56 sm:h-64 rounded-2xl overflow-hidden bg-[#241E19] shadow-2xs border border-[#E8DFD5]"
              >
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#191512]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs text-[#FAF7F2] font-medium">
                    {item.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-8">
            <button
              onClick={() => setActiveView('gallery')}
              className="text-xs font-semibold uppercase tracking-wider text-[#C49258] hover:underline cursor-pointer"
            >
              View full bakery photo archive →
            </button>
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 9. REVIEWS */}
      {/* ---------------------------------------------------- */}
      <section id="reviews-section" className="py-16 sm:py-20 lg:py-24 bg-[#FAF7F2] border-t border-b border-[#E8DFD5]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C49258] font-bold">
              Customer Notes
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1F1A16] font-bold tracking-tight">
              Words from our customers
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6E65] font-light">
              From morning commuters to weekend breakfast tables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E8DFD5] shadow-2xs space-y-4 flex flex-col justify-between hover:border-[#C49258] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <h4 className="font-display text-base font-bold text-[#1F1A16]">
                    "{rev.title}"
                  </h4>
                  <p className="text-xs text-[#4A3F35] font-light leading-relaxed">
                    {rev.comment}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F4EFEA] flex justify-between items-end text-xs">
                  <div>
                    <span className="font-bold text-[#1F1A16] block">{rev.author}</span>
                    <span className="text-[11px] text-[#7A6E65]">{rev.city}</span>
                  </div>
                  <span className="text-[10px] text-[#C49258] font-medium bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8DFD5]">
                    {rev.productName}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-8">
            <button
              onClick={() => setActiveView('reviews')}
              className="text-xs font-semibold uppercase tracking-wider text-[#C49258] hover:underline cursor-pointer"
            >
              Read all customer reviews or share your feedback →
            </button>
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 10. ORDERING / HOW IT WORKS */}
      {/* ---------------------------------------------------- */}
      <section id="ordering-section" className="py-16 sm:py-20 lg:py-24 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C49258] font-bold">
              Ordering Process
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1F1A16]">
              How ordering works
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6E65] font-light">
              Simple, fast and ready when you walk through the door.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD5] space-y-4">
              <span className="font-display text-3xl font-bold text-[#C49258] block">01</span>
              <h3 className="font-display text-lg font-bold text-[#1F1A16]">
                Choose your bakes
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3F35] font-light leading-relaxed">
                Browse our fresh loaves, breakfast viennoiserie, celebration cakes or custom hampers online.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD5] space-y-4">
              <span className="font-display text-3xl font-bold text-[#C49258] block">02</span>
              <h3 className="font-display text-lg font-bold text-[#1F1A16]">
                Select bakery &amp; time
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3F35] font-light leading-relaxed">
                Pick your nearest counter in Lyon, Paris or Lille, and choose your preferred morning or afternoon collection slot.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD5] space-y-4">
              <span className="font-display text-3xl font-bold text-[#C49258] block">03</span>
              <h3 className="font-display text-lg font-bold text-[#1F1A16]">
                Collect warm &amp; ready
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3F35] font-light leading-relaxed">
                Skip the line at the counter. Your sealed bakery box will be waiting fresh with your name.
              </p>
            </div>

          </div>

          <div className="text-center pt-10">
            <button
              onClick={() => setActiveView('menu')}
              className="bg-[#C49258] hover:bg-[#B37E43] text-[#191512] px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Start an Order Now</span>
            </button>
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 11. LOCATIONS & OPENING TIMES */}
      {/* ---------------------------------------------------- */}
      <section id="locations-section" className="py-16 sm:py-20 lg:py-24 bg-[#FAF7F2] border-t border-[#E8DFD5]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C49258] font-bold">
              Visit Us
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#1F1A16] font-bold tracking-tight">
              Our bakery locations
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6E65] font-light">
              Come by for fresh morning bread, warm coffee or order pickup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {branches.map((branch) => (
              <div 
                key={branch.id}
                className="bg-[#FFFFFF] rounded-2xl border border-[#E8DFD5] overflow-hidden shadow-2xs hover:border-[#C49258] transition-colors flex flex-col justify-between"
              >
                <div>
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-bold text-[#1F1A16]">
                        {branch.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3F5E46] bg-[#3F5E46]/10 px-2 py-0.5 rounded-full">
                        Open Today
                      </span>
                    </div>

                    <p className="text-xs text-[#7A6E65] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C49258] shrink-0" />
                      {branch.address}, {branch.postalCode}
                    </p>

                    <div className="text-xs text-[#4A3F35] space-y-1 pt-2 border-t border-[#F4EFEA]">
                      <p><strong>Mon – Fri:</strong> {branch.hours.weekdays}</p>
                      <p><strong>Saturday:</strong> {branch.hours.saturday}</p>
                      <p><strong>Sunday:</strong> {branch.hours.sunday}</p>
                    </div>

                    <p className="text-xs text-[#7A6E65] flex items-center gap-1.5 pt-1">
                      <Phone className="w-3 h-3 text-[#C49258]" />
                      {branch.phone}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => setActiveView('locations')}
                    className="w-full bg-[#FAF7F2] hover:bg-[#EFE8DD] text-[#1F1A16] border border-[#DCD1C4] py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    View Map &amp; Directions
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 12. NEWSLETTER */}
      {/* ---------------------------------------------------- */}
      <section id="newsletter-section" className="py-16 sm:py-20 bg-[#1F1A16] text-[#FAF7F2]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C49258]/15 border border-[#C49258]/30 text-[#E6C594] text-xs uppercase tracking-widest font-semibold">
            <Mail className="w-3.5 h-3.5 text-[#C49258]" />
            Bakery Dispatch
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Morning bakes &amp; weekend specials
          </h2>

          <p className="text-xs sm:text-sm text-[#D8CEBE] font-light max-w-xl mx-auto leading-relaxed">
            Get our weekend pastry schedule, seasonal fruit tart announcements, and holiday pre-order dates sent directly to your inbox.
          </p>

          {newsletterSubscribed ? (
            <div className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-[#2C241E] px-6 py-3.5 rounded-xl border border-emerald-700/40">
              <CheckCircle2 className="w-4 h-4" />
              <span>Merci! You are now subscribed to our morning specials.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 bg-[#2C241E] border border-[#3E342B] rounded-xl px-4 py-3 text-xs text-[#FAF7F2] placeholder-[#7A6E65] focus:outline-none focus:border-[#C49258]"
              />
              <button
                type="submit"
                className="bg-[#C49258] hover:bg-[#B37E43] text-[#191512] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <p className="text-[11px] text-[#7A6E65]">
            No spam. Unsubscribe anytime with a single click.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 13. FINAL CTA */}
      {/* ---------------------------------------------------- */}
      <section id="final-cta-section" className="py-20 sm:py-24 bg-[#EFE8DD] text-[#1F1A16] border-t border-[#DCD1C4]">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#C49258] font-bold">
            Start Your Day Right
          </span>

          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Fresh bread and warm pastries are waiting.
          </h2>

          <p className="text-xs sm:text-base text-[#4A3F35] font-light max-w-xl mx-auto leading-relaxed">
            Order ahead for speedy counter pickup, or visit us today in Lyon, Paris &amp; Lille.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveView('menu')}
              className="w-full sm:w-auto bg-[#C49258] hover:bg-[#B37E43] text-[#191512] font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Online Now</span>
            </button>

            <button
              onClick={() => setActiveView('locations')}
              className="w-full sm:w-auto bg-[#FFFFFF] hover:bg-[#FAF7F2] text-[#1F1A16] border border-[#DCD1C4] font-semibold text-xs uppercase tracking-wider px-8 py-4 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#C49258]" />
              <span>Find Nearest Bakery</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
