import React from 'react';
import { BakeryProvider, useBakery } from './context/BakeryContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { CartDrawer } from './components/cart/CartDrawer';
import { WishlistDrawer } from './components/wishlist/WishlistDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { BakeryAssistantModal } from './components/assistant/BakeryAssistantModal';
import { LegalModal } from './components/legal/LegalModal';

// Views
import { HomeView } from './components/views/HomeView';
import { MenuView } from './components/views/MenuView';
import { CustomCakeBuilderView } from './components/views/CustomCakeBuilderView';
import { WeddingEventsView } from './components/views/WeddingEventsView';
import { AboutView } from './components/views/AboutView';
import { LocationsView } from './components/views/LocationsView';
import { GalleryView } from './components/views/GalleryView';
import { ReviewsView } from './components/views/ReviewsView';
import { FAQView } from './components/views/FAQView';
import { SeasonalView } from './components/views/SeasonalView';
import { GiftBoxesView } from './components/views/GiftBoxesView';
import { ContactView } from './components/views/ContactView';
import { OrderTrackingView } from './components/views/OrderTrackingView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OrderConfirmationView } from './components/views/OrderConfirmationView';

const MainContent: React.FC = () => {
  const { activeView } = useBakery();

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'menu':
        return <MenuView />;
      case 'custom-cakes':
        return <CustomCakeBuilderView />;
      case 'weddings-events':
        return <WeddingEventsView />;
      case 'about':
        return <AboutView />;
      case 'locations':
        return <LocationsView />;
      case 'gallery':
        return <GalleryView />;
      case 'reviews':
        return <ReviewsView />;
      case 'faq':
        return <FAQView />;
      case 'seasonal':
        return <SeasonalView />;
      case 'gift-boxes':
        return <GiftBoxesView />;
      case 'contact':
        return <ContactView />;
      case 'track-order':
        return <OrderTrackingView />;
      case 'order-confirmation':
        return <OrderConfirmationView />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomeView />;
    }
  };

  if (activeView === 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F4EE] text-[#1F1A16] font-sans antialiased selection:bg-[#C49258]/30 selection:text-[#1F1A16]">
        <ToastContainer />
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1F1A16] font-sans antialiased selection:bg-[#C49258]/30 selection:text-[#1F1A16]">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <ProductDetailModal />
      <BakeryAssistantModal />
      <LegalModal />

      {/* Top Header & Navigation */}
      <Header />

      {/* Main Page Body */}
      <main className="flex-1 w-full">
        {renderActiveView()}
      </main>

      {/* Luxury Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BakeryProvider>
      <MainContent />
    </BakeryProvider>
  );
}
