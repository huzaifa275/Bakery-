import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  Tag, 
  Settings, 
  Clock, 
  Sparkles, 
  LogOut, 
  Layers, 
  Store, 
  Sun,
  LayoutDashboard,
  ExternalLink,
  ChevronRight,
  User,
  Sliders
} from 'lucide-react';
import { AdminLogin } from './AdminLogin';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminOrders } from './AdminOrders';
import { AdminCustomCakes } from './AdminCustomCakes';
import { AdminCoupons } from './AdminCoupons';
import { AdminContentCMS } from './AdminContentCMS';
import { AdminQuickStock } from './AdminQuickStock';

type AdminTab = 
  | 'overview' 
  | 'products' 
  | 'categories' 
  | 'orders' 
  | 'cakes' 
  | 'coupons' 
  | 'quick-stock' 
  | 'cms';

export const AdminDashboard: React.FC = () => {
  const { 
    isAdminLoggedIn, 
    adminUser, 
    logoutAdmin, 
    setActiveView, 
    orders, 
    products, 
    categories 
  } = useBakery();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // If not authenticated, render the dedicated luxury AdminLogin screen
  if (!isAdminLoggedIn) {
    return <AdminLogin onSuccess={() => setActiveTab('overview')} />;
  }

  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;

  const NAV_ITEMS: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: number | string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
    { id: 'quick-stock', label: 'Morning Stock Shift', icon: Sun },
    { id: 'products', label: 'Product Catalog', icon: Package, badge: products.length },
    { id: 'categories', label: 'Menu Categories', icon: Layers, badge: categories.length },
    { id: 'cakes', label: 'Custom Cake Studio', icon: Sparkles },
    { id: 'coupons', label: 'Promotions & Vouchers', icon: Tag },
    { id: 'cms', label: 'Storefront CMS & Settings', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex flex-col">
      {/* Top Navbar for Admin */}
      <header className="bg-[#2C2420] text-[#FAF7F2] border-b border-[#3D332D] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Portal Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3D332D] text-[#D4AF37] flex items-center justify-center border border-[#4E413A]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm tracking-tight text-white flex items-center gap-2">
                <span>Maison Éloise</span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#D4AF37] bg-[#3D332D] px-2 py-0.5 rounded-md">
                  Admin Panel
                </span>
              </div>
              <div className="text-[10px] text-[#A39990]">Atelier &amp; Order Management</div>
            </div>
          </div>

          {/* Right actions: View Store & User Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveView('home');
                window.history.pushState({}, '', '/');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#3D332D] hover:bg-[#4E413A] text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-colors text-[#FAF7F2] cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>View Customer Store</span>
              <ExternalLink className="w-3 h-3 text-[#A39990]" />
            </button>

            {/* Admin User Badge */}
            <div className="hidden md:flex items-center gap-2 bg-[#1F1A16] px-3 py-1.5 rounded-xl border border-[#3D332D]">
              <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#1F1A16] flex items-center justify-center text-[10px] font-bold">
                <User className="w-3 h-3" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-white leading-tight">
                  {adminUser?.name || 'Administrator'}
                </div>
                <div className="text-[9px] text-[#A39990] leading-tight">
                  {adminUser?.role || 'Executive Chef'}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logoutAdmin}
              className="bg-[#3D332D] hover:bg-[#4E413A] text-[#FAF7F2] px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Secure Logout"
            >
              <LogOut className="w-3.5 h-3.5 text-[#C53030]" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Strip */}
        <div className="lg:hidden border-t border-[#3D332D] bg-[#241D1A] overflow-x-auto py-2 px-4 flex gap-1.5 scrollbar-none">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#2C2420]'
                    : 'text-[#C9BFB5] hover:bg-[#3D332D]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-[#2C2420] text-[#D4AF37]' : 'bg-[#3D332D] text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Body with Sidebar Layout on Desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Desktop Left Navigation Sidebar (1 Col) */}
          <aside className="hidden lg:block lg:col-span-1 space-y-2">
            <div className="bg-white rounded-3xl border border-[#EBE3D7] p-3 shadow-sm space-y-1 sticky top-24">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#8C827A]">
                Navigation Menu
              </div>

              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#2C2420] text-[#FAF7F2] shadow-sm'
                        : 'text-[#5A5047] hover:bg-[#FAF8F5] hover:text-[#2C2420]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#8C827A]'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        isActive 
                          ? 'bg-[#D4AF37] text-[#2C2420]' 
                          : 'bg-[#FAF6EE] text-[#C49258]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-3 border-t border-[#F2EDE4] mt-3">
                <button
                  onClick={() => {
                    setActiveView('home');
                    window.history.pushState({}, '', '/');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#8C827A] hover:text-[#2C2420] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#C49258]" />
                    <span>Return to Store</span>
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area (4 Cols) */}
          <main className="lg:col-span-4 min-w-0">
            {activeTab === 'overview' && (
              <AdminOverview onNavigateTab={(tab) => setActiveTab(tab)} />
            )}
            {activeTab === 'products' && <AdminProducts />}
            {activeTab === 'categories' && <AdminCategories />}
            {activeTab === 'orders' && <AdminOrders />}
            {activeTab === 'quick-stock' && <AdminQuickStock />}
            {activeTab === 'cakes' && <AdminCustomCakes />}
            {activeTab === 'coupons' && <AdminCoupons />}
            {activeTab === 'cms' && <AdminContentCMS />}
          </main>
        </div>
      </div>
    </div>
  );
};
