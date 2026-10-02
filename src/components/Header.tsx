import React, { useState, useEffect } from 'react';
import { useBakery } from '../context/BakeryContext';
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  Search, 
  ChevronRight,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';
import { AutocompleteSearch } from './AutocompleteSearch';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartItemCount,
    cartSubtotal,
    setIsCartOpen,
    branches,
    selectedBranchId,
    setSelectedBranchId,
  } = useBakery();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartBounced, setCartBounced] = useState(false);

  // Trigger bounce whenever cartItemCount increases
  useEffect(() => {
    if (cartItemCount > 0) {
      setCartBounced(true);
      const timer = setTimeout(() => setCartBounced(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartItemCount]);

  const currentBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  // Primary navigation links
  const primaryNav = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'custom-cakes', label: 'Custom Cakes' },
    { id: 'about', label: 'Our Story' },
    { id: 'locations', label: 'Locations' },
  ];

  // Secondary views for More dropdown
  const secondaryNav = [
    { id: 'weddings-events', label: 'Weddings & Catering' },
    { id: 'gift-boxes', label: 'Gift Boxes & Hampers' },
    { id: 'seasonal', label: 'Seasonal Bakes' },
    { id: 'gallery', label: 'Behind the Counter' },
    { id: 'reviews', label: 'Customer Reviews' },
    { id: 'track-order', label: 'Track Order' },
    { id: 'faq', label: 'FAQ & Allergens' },
    { id: 'contact', label: 'Contact' },
  ];

  // Handle ESC key to close search or mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (viewId: any) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Location & Opening Announcement Bar */}
      <div className="bg-[#1E1511] text-[#FDFBF7] text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#2A1D17]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
            <span className="font-light tracking-wide text-[#EADFCF] text-[11px] sm:text-xs">
              Ovens hot since 4:00 AM • Slow-fermented sourdough &amp; French viennoiserie
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] text-[#D8CEBE] shrink-0">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#D4A373]" />
              <span>Counter:</span>
              <select
                id="header-branch-select"
                aria-label="Select bakery location"
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="bg-transparent text-[#FDFBF7] border-none focus:ring-0 text-[11px] cursor-pointer underline hover:text-[#D4A373] transition-colors pr-3 py-0"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id} className="bg-[#1E1511] text-[#FDFBF7]">
                    {b.city} ({b.address})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-[#D4A373]/40">·</span>

            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#D4A373]" />
              <span>Today: {currentBranch?.hours?.weekdays || '07:00 – 18:30'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Glassmorphism Navbar */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            
            {/* Zone 1: Single text element wordmark */}
            <div className="flex items-center shrink-0">
              <button
                id="header-logo-btn"
                onClick={() => handleNavClick('home')}
                className="text-left group flex flex-col items-start focus:outline-hidden py-1 cursor-pointer"
                aria-label="Maison Éloise Bakery & Coffee Homepage"
              >
                <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#1E1511] group-hover:text-[#C86D51] transition-colors leading-none">
                  MAISON ÉLOISE
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.26em] uppercase text-[#7A6E65] font-semibold mt-0.5">
                  ARTISAN PATISSERIE
                </span>
              </button>
            </div>

            {/* Zone 2: Desktop Navigation Links with custom left-to-right expanding hover underline */}
            <nav className="hidden lg:flex items-center space-x-7" aria-label="Main Navigation">
              {primaryNav.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`nav-link-hover text-xs font-semibold uppercase tracking-wider py-1 transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#C86D51] active'
                        : 'text-[#4A3F35] hover:text-[#1E1511]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {/* More Dropdown */}
              <div className="relative group">
                <button
                  id="nav-more-dropdown-btn"
                  className="nav-link-hover text-xs font-semibold uppercase tracking-wider py-1 text-[#4A3F35] hover:text-[#1E1511] flex items-center gap-1 cursor-pointer"
                  aria-haspopup="true"
                >
                  <span>More</span>
                  <span className="text-[10px] opacity-70">▾</span>
                </button>
                
                <div className="absolute left-0 top-full mt-2 w-52 bg-[#FDFBF7] border border-stone-200/80 shadow-xl rounded-2xl py-2 hidden group-hover:block transition-all z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {secondaryNav.map(sub => (
                    <button
                      key={sub.id}
                      id={`nav-sublink-${sub.id}`}
                      onClick={() => handleNavClick(sub.id)}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-[#4A3F35] hover:bg-[#F7F3EB] hover:text-[#C86D51] transition-colors cursor-pointer"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            {/* Zone 3: Actions (Search, Bouncy Cart Icon Badge, Order Online CTA) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Trigger */}
              <button
                id="header-search-btn"
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  if (mobileMenuOpen) setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-full transition-colors flex items-center justify-center cursor-pointer ${
                  searchOpen 
                    ? 'bg-[#1E1511] text-[#FDFBF7]' 
                    : 'text-[#4A3F35] hover:text-[#1E1511] hover:bg-[#F7F3EB]'
                }`}
                aria-label="Search bakery products"
                title="Search menu"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Shopping Cart Trigger with Bouncy Spring Badge Animation */}
              <button
                id="header-cart-btn"
                onClick={() => {
                  setIsCartOpen(true);
                  if (searchOpen) setSearchOpen(false);
                  if (mobileMenuOpen) setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 bg-[#F7F3EB] hover:bg-[#EFE8DD] text-[#1E1511] border border-stone-200/70 px-3.5 py-2 rounded-xl transition-all shadow-2xs group active:scale-95 cursor-pointer"
                aria-label={`Open shopping cart with ${cartItemCount} items`}
                title="Shopping Cart"
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#C86D51] group-hover:scale-110 transition-transform" />
                  
                  {cartItemCount > 0 && (
                    <span 
                      id="header-cart-badge"
                      className={`absolute -top-2.5 -right-2.5 bg-[#C86D51] text-[#FDFBF7] text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm transition-transform duration-300 ${
                        cartBounced ? 'scale-130 -translate-y-0.5' : 'scale-100'
                      }`}
                    >
                      {cartItemCount}
                    </span>
                  )}
                </div>
                
                <span className="text-xs font-bold tracking-wide hidden md:inline tabular-nums">
                  €{cartSubtotal.toFixed(2)}
                </span>
              </button>

              {/* Primary Action Button: Explore Bakes */}
              <button
                id="header-order-online-btn"
                onClick={() => handleNavClick('menu')}
                className="hidden sm:inline-flex items-center justify-center bg-[#1E1511] hover:bg-[#C86D51] text-[#FDFBF7] text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                Order Online
              </button>

              {/* Mobile Menu Hamburger Toggle */}
              <button
                id="header-mobile-toggle-btn"
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  if (searchOpen) setSearchOpen(false);
                }}
                className="lg:hidden p-2 rounded-xl text-[#1E1511] hover:bg-[#F7F3EB] transition-colors flex items-center justify-center cursor-pointer"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Product Autocomplete Search Dropdown */}
        {searchOpen && (
          <div 
            id="header-search-panel" 
            className="border-t border-stone-200/60 bg-[#FFFFFF] shadow-xl animate-in slide-in-from-top-2 duration-200"
          >
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
              <AutocompleteSearch 
                onClose={() => setSearchOpen(false)}
                autoFocus={true}
                placeholder="Search bakes: croissant, sourdough, chocolate, cake, tart..."
              />
            </div>
          </div>
        )}
      </header>

      {/* Clean Mobile Drawer Navigation with backdrop dim */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Dim */}
          <div 
            className="fixed inset-0 bg-[#1E1511]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel Sliding in from right */}
          <div 
            id="mobile-drawer-menu"
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#FDFBF7] text-[#1E1511] shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-stone-200/80 pb-4">
                <div>
                  <span className="font-display text-lg font-bold text-[#1E1511] block">
                    MAISON ÉLOISE
                  </span>
                  <span className="text-[10px] tracking-widest uppercase text-[#7A6E65]">
                    Artisan Patisserie
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-[#F7F3EB] transition-colors"
                  aria-label="Close navigation drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Online Quick CTA */}
              <button
                id="mobile-order-online-btn"
                onClick={() => handleNavClick('menu')}
                className="w-full bg-[#1E1511] hover:bg-[#C86D51] text-[#FDFBF7] text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4A373]" />
                <span>Explore Fresh Bakes</span>
              </button>

              {/* Navigation Links */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#7A6E65] px-2 block mb-2">
                  Navigation
                </span>
                {primaryNav.map((item) => (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                      activeView === item.id
                        ? 'bg-[#F7F3EB] text-[#C86D51]'
                        : 'text-[#1E1511] hover:bg-[#F7F3EB]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#7A6E65]" />
                  </button>
                ))}
              </div>

              {/* Secondary Links */}
              <div className="space-y-1 border-t border-stone-200/80 pt-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#7A6E65] px-2 block mb-2">
                  More
                </span>
                {secondaryNav.map((sub) => (
                  <button
                    key={sub.id}
                    id={`mobile-subnav-${sub.id}`}
                    onClick={() => handleNavClick(sub.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#4A3F35] hover:bg-[#F7F3EB] rounded-lg transition-colors cursor-pointer"
                  >
                    <span>{sub.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#7A6E65]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Footer Status */}
            <div className="p-6 bg-[#F7F3EB] border-t border-stone-200 text-xs text-[#5D5047] space-y-2">
              <p className="flex items-center gap-1.5 font-medium text-[#1E1511]">
                <Clock className="w-3.5 h-3.5 text-[#C86D51]" />
                <span>Today: 07:00 – 18:30 (Ovens hot)</span>
              </p>
              <p className="flex items-center gap-1.5 text-[11px] text-[#7A6E65]">
                <MapPin className="w-3.5 h-3.5 text-[#C86D51]" />
                <span>12 Rue des Fleurs, Lyon · 18 Rue Saint-Honoré, Paris</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
