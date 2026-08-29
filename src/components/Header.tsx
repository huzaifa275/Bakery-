import React, { useState, useEffect } from 'react';
import { useBakery } from '../context/BakeryContext';
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  Search, 
  ChevronRight,
  ArrowRight,
  Clock,
  MapPin
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

  const currentBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  // Primary navigation links
  const primaryNav = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'custom-cakes', label: 'Custom Cakes' },
    { id: 'about', label: 'About' },
    { id: 'locations', label: 'Locations' },
  ];

  // Secondary views for More menu
  const secondaryNav = [
    { id: 'weddings-events', label: 'Weddings & Catering' },
    { id: 'gift-boxes', label: 'Gift Boxes' },
    { id: 'seasonal', label: 'Seasonal Bakes' },
    { id: 'gallery', label: 'Behind the Counter' },
    { id: 'reviews', label: 'Customer Reviews' },
    { id: 'track-order', label: 'Track Order' },
    { id: 'faq', label: 'FAQ' },
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
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD5] transition-all">
      {/* Top Location / Status Bar */}
      <div className="bg-[#1F1A16] text-[#FAF7F2] text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#3A3129]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
            <span className="font-light tracking-wide text-[#EADFCF] text-[11px] sm:text-xs">
              Ovens hot since 5:00 AM • Fresh sourdough &amp; pastries baked daily
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] text-[#D8CEBE] shrink-0">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#C49258]" />
              <span>Bakery:</span>
              <select
                id="header-branch-select"
                aria-label="Select bakery location"
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="bg-transparent text-[#FAF7F2] border-none focus:ring-0 text-[11px] cursor-pointer underline hover:text-[#C49258] transition-colors pr-4 py-0"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id} className="bg-[#1F1A16] text-[#FAF7F2]">
                    {b.city} ({b.address})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-[#C49258]/40">|</span>

            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#C49258]" />
              <span>Today: {currentBranch?.hours?.weekdays || '07:00 – 18:30'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* LEFT: BRAND LOGO */}
          <div className="flex items-center shrink-0">
            <button
              id="header-logo-btn"
              onClick={() => handleNavClick('home')}
              className="text-left group flex flex-col items-start focus:outline-hidden py-1"
              aria-label="Maison Éloise Bakery & Coffee Homepage"
            >
              <span className="font-display text-lg sm:text-2xl font-bold tracking-tight text-[#1F1A16] group-hover:text-[#A87438] transition-colors leading-tight">
                MAISON ÉLOISE
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.25em] uppercase text-[#7A6E65] font-semibold -mt-0.5">
                BAKERY &amp; COFFEE
              </span>
            </button>
          </div>

          {/* CENTER: DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2" aria-label="Main Navigation">
            {primaryNav.map(item => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-colors ${
                  activeView === item.id
                    ? 'text-[#C49258] bg-[#FAF7F2] font-bold shadow-2xs'
                    : 'text-[#3E342B] hover:text-[#1F1A16] hover:bg-[#EFE8DD]/60'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* More Dropdown */}
            <div className="relative group">
              <button
                id="nav-more-dropdown-btn"
                className="text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-lg transition-colors text-[#3E342B] hover:text-[#1F1A16] hover:bg-[#EFE8DD]/60 flex items-center gap-1"
                aria-haspopup="true"
              >
                <span>More</span>
                <span className="text-[10px] opacity-70">▾</span>
              </button>
              
              <div className="absolute left-0 top-full mt-1 w-48 bg-[#FAF7F2] border border-[#E8DFD5] shadow-lg rounded-xl py-2 hidden group-hover:block transition-all z-50">
                {secondaryNav.map(sub => (
                  <button
                    key={sub.id}
                    id={`nav-sublink-${sub.id}`}
                    onClick={() => handleNavClick(sub.id)}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-[#3E342B] hover:bg-[#EFE8DD] hover:text-[#C49258] transition-colors"
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* RIGHT: SEARCH, CART, ORDER BUTTON & MOBILE TOGGLE */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Icon Trigger */}
            <button
              id="header-search-btn"
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (mobileMenuOpen) setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-full transition-colors flex items-center justify-center ${
                searchOpen 
                  ? 'bg-[#1F1A16] text-[#FAF7F2]' 
                  : 'text-[#3E342B] hover:text-[#1F1A16] hover:bg-[#EFE8DD]'
              }`}
              aria-label="Search bakery products"
              title="Search menu"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Shopping Cart Trigger */}
            <button
              id="header-cart-btn"
              onClick={() => {
                setIsCartOpen(true);
                if (searchOpen) setSearchOpen(false);
                if (mobileMenuOpen) setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 bg-[#FAF7F2] hover:bg-[#EFE8DD] text-[#1F1A16] border border-[#DCD1C4] px-3 py-2 rounded-xl transition-all shadow-2xs group active:scale-95"
              aria-label="Open Shopping Cart"
              title="Shopping Cart"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#C49258] group-hover:scale-110 transition-transform" />
                {cartItemCount > 0 && (
                  <span 
                    id="header-cart-badge"
                    className="absolute -top-2.5 -right-2.5 bg-[#C49258] text-[#191512] text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs"
                  >
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold tracking-wide hidden md:inline">
                €{cartSubtotal.toFixed(2)}
              </span>
            </button>

            {/* PRIMARY CTA: ORDER ONLINE (DESKTOP) */}
            <button
              id="header-order-online-btn"
              onClick={() => handleNavClick('menu')}
              className="hidden sm:inline-flex items-center justify-center bg-[#C49258] hover:bg-[#B37E43] text-[#191512] text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98]"
            >
              ORDER ONLINE
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              id="header-mobile-toggle-btn"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (searchOpen) setSearchOpen(false);
              }}
              className="lg:hidden p-2 rounded-xl text-[#1F1A16] hover:bg-[#EFE8DD] transition-colors flex items-center justify-center"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* REAL FUNCTIONAL PRODUCT AUTOCOMPLETE SEARCH PANEL */}
      {/* ------------------------------------------------------------------ */}
      {searchOpen && (
        <div 
          id="header-search-panel" 
          className="border-t border-[#E8DFD5] bg-[#FFFFFF] shadow-xl animate-in slide-in-from-top-2 duration-200"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
            <AutocompleteSearch 
              onClose={() => setSearchOpen(false)}
              autoFocus={true}
              placeholder="Search bakes: croissant, sourdough, chocolate, cake, pastry..."
            />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MOBILE DRAWER MENU (Clean, responsive, non-intrusive) */}
      {/* ------------------------------------------------------------------ */}
      {mobileMenuOpen && (
        <div 
          id="mobile-drawer-menu"
          className="lg:hidden border-t border-[#E8DFD5] bg-[#FAF7F2] max-h-[calc(100vh-5rem)] overflow-y-auto px-5 py-6 space-y-5 shadow-xl animate-in slide-in-from-top-2"
        >
          {/* Primary Mobile Action: Order Online */}
          <button
            id="mobile-order-online-btn"
            onClick={() => handleNavClick('menu')}
            className="w-full bg-[#C49258] hover:bg-[#B37E43] text-[#191512] text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-[#191512]" />
            <span>ORDER ONLINE</span>
          </button>

          {/* Primary Navigation Links */}
          <div className="space-y-1 border-b border-[#E8DFD5] pb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#7A6E65] px-2 block mb-2">
              Main Menu
            </span>
            {primaryNav.map(item => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  activeView === item.id
                    ? 'bg-[#EFE8DD] text-[#C49258]'
                    : 'text-[#1F1A16] hover:bg-[#EFE8DD]/50'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-[#7A6E65]" />
              </button>
            ))}
          </div>

          {/* Secondary Navigation Links */}
          <div className="space-y-1 border-b border-[#E8DFD5] pb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#7A6E65] px-2 block mb-2">
              More to Explore
            </span>
            {secondaryNav.map(sub => (
              <button
                key={sub.id}
                id={`mobile-subnav-${sub.id}`}
                onClick={() => handleNavClick(sub.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#4A3F35] hover:bg-[#EFE8DD]/50 rounded-lg transition-colors"
              >
                <span>{sub.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#7A6E65]" />
              </button>
            ))}
          </div>

          {/* Quick Location info */}
          <div className="text-[11px] text-[#7A6E65] space-y-1.5 pt-1">
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C49258] shrink-0" />
              <span>12 Rue des Fleurs, Lyon • 18 Rue Saint-Honoré, Paris</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C49258] shrink-0" />
              <span>Mon–Fri 07:00–18:30 | Sat–Sun 08:00–17:00</span>
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
