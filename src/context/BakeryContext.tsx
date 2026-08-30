import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  CustomCakeRequest, 
  Coupon, 
  CustomerReview, 
  BakeryBranch, 
  StoreContent,
  ProductVariant,
  CategoryItem
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_BRANCHES, 
  INITIAL_COUPONS, 
  INITIAL_REVIEWS, 
  INITIAL_STORE_CONTENT,
  INITIAL_CATEGORIES
} from '../data/bakeryData';

export type ActiveView = 
  | 'home'
  | 'menu'
  | 'custom-cakes'
  | 'weddings-events'
  | 'about'
  | 'locations'
  | 'gallery'
  | 'reviews'
  | 'faq'
  | 'seasonal'
  | 'gift-boxes'
  | 'contact'
  | 'track-order'
  | 'admin'
  | 'order-confirmation';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AdminUser {
  name: string;
  role: string;
  email: string;
}

interface BakeryContextType {
  // Navigation & View
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  openProductModal: (productId: string) => void;
  closeProductModal: () => void;
  menuSearchQuery: string;
  setMenuSearchQuery: (query: string) => void;
  menuFilterCategory: string;
  setMenuFilterCategory: (category: string) => void;
  navigateToMenuWithSearch: (query?: string, category?: string) => void;
  
  // Data
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: CategoryItem[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryItem[]>>;
  branches: BakeryBranch[];
  reviews: CustomerReview[];
  setReviews: React.Dispatch<React.SetStateAction<CustomerReview[]>>;
  refreshReviews: () => Promise<void>;
  submitReview: (reviewData: {
    author: string;
    city?: string;
    rating: number;
    title?: string;
    comment: string;
    productName?: string;
    productId?: string;
    orderId?: string;
    orderNumber?: string;
  }) => Promise<{ success: boolean; message: string; review?: CustomerReview }>;
  approveReview: (id: string) => Promise<boolean>;
  rejectReview: (id: string) => Promise<boolean>;
  toggleFeatureReview: (id: string) => Promise<boolean>;
  updateReview: (id: string, updatedData: Partial<CustomerReview>) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
  voteHelpfulReview: (id: string) => Promise<void>;
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  storeContent: StoreContent;
  setStoreContent: React.Dispatch<React.SetStateAction<StoreContent>>;
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshCoupons: () => Promise<void>;
  refreshStoreContent: () => Promise<void>;
  updateStoreContent: (content: Partial<StoreContent>) => Promise<boolean>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  currentOrder: Order | null;
  
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, variant?: ProductVariant, options?: Record<string, string>, quantity?: number, note?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;

  // Checkout & Ordering
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  appliedCoupon: { code: string; discountAmount: number; description: string } | null;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCouponCode: () => void;
  selectedBranchId: string;
  setSelectedBranchId: (id: string) => void;
  lastCompletedOrder: Order | null;
  setLastCompletedOrder: (order: Order | null) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  // AI Assistant Modal
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;

  // Legal Modal
  activeLegalDoc: 'privacy' | 'terms' | 'allergens' | 'refunds' | null;
  setActiveLegalDoc: (doc: 'privacy' | 'terms' | 'allergens' | 'refunds' | null) => void;

  // Custom Cake Flow Draft
  cakeDraft: Partial<CustomCakeRequest>;
  setCakeDraft: React.Dispatch<React.SetStateAction<Partial<CustomCakeRequest>>>;

  // Notifications
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Admin Auth
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
  adminUser: AdminUser | null;
  setAdminUser: (user: AdminUser | null) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  logoutAdmin: () => Promise<void>;
}

const BakeryContext = createContext<BakeryContextType | undefined>(undefined);

export const BakeryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Detect initial route
  const getInitialView = (): ActiveView => {
    try {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin') {
        return 'admin';
      }
      if (hash.startsWith('#')) {
        const view = hash.substring(1) as ActiveView;
        const validViews: ActiveView[] = [
          'home', 'menu', 'custom-cakes', 'weddings-events', 'about', 
          'locations', 'gallery', 'reviews', 'faq', 'seasonal', 
          'gift-boxes', 'contact', 'track-order', 'admin', 'order-confirmation'
        ];
        if (validViews.includes(view)) return view;
      }
    } catch {}
    return 'home';
  };

  const [activeView, setActiveViewState] = useState<ActiveView>(getInitialView);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [branches, setBranches] = useState<BakeryBranch[]>(INITIAL_BRANCHES);
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [storeContent, setStoreContent] = useState<StoreContent>(INITIAL_STORE_CONTENT);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('msh_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<'privacy' | 'terms' | 'allergens' | 'refunds' | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('lyon-flore');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number; description: string } | null>(null);
  
  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('msh_orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [lastCompletedOrder, setLastCompletedOrderState] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem('msh_last_order');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const setLastCompletedOrder = (order: Order | null) => {
    setLastCompletedOrderState(order);
    if (order) {
      try {
        localStorage.setItem('msh_last_order', JSON.stringify(order));
        setOrders(prev => {
          const exists = prev.some(o => o.id === order.id || o.orderNumber === order.orderNumber);
          const updated = exists ? prev.map(o => (o.id === order.id || o.orderNumber === order.orderNumber) ? order : o) : [order, ...prev];
          try {
            localStorage.setItem('msh_orders', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      } catch (e) {
        console.warn('Failed to save last order:', e);
      }
    } else {
      localStorage.removeItem('msh_last_order');
    }
  };

  const [menuSearchQuery, setMenuSearchQuery] = useState<string>('');
  const [menuFilterCategory, setMenuFilterCategory] = useState<string>('all');

  const navigateToMenuWithSearch = (query: string = '', category: string = 'all') => {
    setMenuSearchQuery(query);
    setMenuFilterCategory(category);
    setActiveView('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('msh_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cake Draft
  const [cakeDraft, setCakeDraft] = useState<Partial<CustomCakeRequest>>({});

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Admin Auth Token & User state
  const [adminToken, setAdminTokenState] = useState<string | null>(() => {
    try {
      return localStorage.getItem('msh_admin_token');
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('msh_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedInState] = useState<boolean>(() => {
    return Boolean(adminToken);
  });

  const setAdminToken = (token: string | null) => {
    setAdminTokenState(token);
    setIsAdminLoggedInState(Boolean(token));
    if (token) {
      try {
        localStorage.setItem('msh_admin_token', token);
      } catch {}
    } else {
      try {
        localStorage.removeItem('msh_admin_token');
        localStorage.removeItem('msh_admin_user');
      } catch {}
      setAdminUser(null);
    }
  };

  const setIsAdminLoggedIn = (val: boolean) => {
    setIsAdminLoggedInState(val);
    if (!val) {
      setAdminToken(null);
    }
  };

  // Controlled setActiveView that synchronizes the browser address bar
  const setActiveView = useCallback((view: ActiveView) => {
    setActiveViewState(view);
    try {
      if (view === 'admin') {
        if (window.location.pathname !== '/admin') {
          window.history.pushState({ view: 'admin' }, '', '/admin');
        }
      } else {
        if (window.location.pathname === '/admin') {
          window.history.pushState({ view: 'home' }, '', '/');
        }
      }
    } catch {}
  }, []);

  // Listen to browser navigation (Back/Forward, hash changes)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin') {
        setActiveViewState('admin');
      } else if (hash.startsWith('#')) {
        const view = hash.substring(1) as ActiveView;
        if (view) setActiveViewState(view);
      } else {
        setActiveViewState('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('msh_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('msh_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [wishlist]);

  useEffect(() => {
    if (adminUser) {
      try {
        localStorage.setItem('msh_admin_user', JSON.stringify(adminUser));
      } catch {}
    }
  }, [adminUser]);

  // Data Fetching & Refresher Functions
  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      }
    } catch (err) {
      console.warn('Using local catalog fallback:', err);
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories?all=true');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      }
    } catch (err) {
      console.warn('Category fetch error:', err);
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      }
    } catch (err) {
      console.warn('Orders fetch error:', err);
    }
  }, []);

  const refreshReviews = useCallback(async () => {
    try {
      const url = adminToken ? '/api/reviews?all=true' : '/api/reviews';
      const res = await fetch(url, {
        headers: adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setReviews(data);
        }
      }
    } catch (err) {
      console.warn('Reviews fetch error:', err);
    }
  }, [adminToken]);

  const submitReview = async (reviewData: {
    author: string;
    city?: string;
    rating: number;
    title?: string;
    comment: string;
    productName?: string;
    productId?: string;
    orderId?: string;
    orderNumber?: string;
  }): Promise<{ success: boolean; message: string; review?: CustomerReview }> => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        addToast(data.message || 'Merci! Your review has been submitted for moderation.', 'success');
        refreshReviews();
        return { success: true, message: data.message, review: data.review };
      } else {
        const errMsg = data.error || 'Unable to submit review.';
        addToast(errMsg, 'error');
        return { success: false, message: errMsg };
      }
    } catch (err) {
      const errMsg = 'Network error while submitting review.';
      addToast(errMsg, 'error');
      return { success: false, message: errMsg };
    }
  };

  const approveReview = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/reviews/${id}/approve`, {
        method: 'PATCH',
        headers: {
          ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {})
        }
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, isApproved: true, status: 'approved' } : r));
        addToast('Review approved & published publicly', 'success');
        return true;
      }
    } catch (err) {
      console.warn('Failed to approve review:', err);
    }
    setReviews(prev => prev.map(r => r.id === id ? { ...r, isApproved: true, status: 'approved' } : r));
    addToast('Review approved', 'success');
    return true;
  };

  const rejectReview = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/reviews/${id}/reject`, {
        method: 'PATCH',
        headers: {
          ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {})
        }
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, isApproved: false, status: 'rejected' } : r));
        addToast('Review rejected', 'info');
        return true;
      }
    } catch (err) {
      console.warn('Failed to reject review:', err);
    }
    setReviews(prev => prev.map(r => r.id === id ? { ...r, isApproved: false, status: 'rejected' } : r));
    addToast('Review rejected', 'info');
    return true;
  };

  const toggleFeatureReview = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/reviews/${id}/feature`, {
        method: 'PATCH',
        headers: {
          ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {})
        }
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(prev => prev.map(r => r.id === id ? { ...r, isFeatured: data.review?.isFeatured ?? !r.isFeatured } : r));
        addToast('Review featured status updated', 'success');
        return true;
      }
    } catch (err) {
      console.warn('Failed to toggle feature status:', err);
    }
    setReviews(prev => prev.map(r => r.id === id ? { ...r, isFeatured: !r.isFeatured } : r));
    return true;
  };

  const updateReview = async (id: string, updatedData: Partial<CustomerReview>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {})
        },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.review) {
          setReviews(prev => prev.map(r => r.id === id ? { ...r, ...data.review } : r));
        }
        addToast('Review updated successfully', 'success');
        return true;
      }
    } catch (err) {
      console.warn('Failed to update review:', err);
    }
    setReviews(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
    addToast('Review updated', 'success');
    return true;
  };

  const deleteReview = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {})
        }
      });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
        addToast('Review deleted from database', 'info');
        return true;
      }
    } catch (err) {
      console.warn('Failed to delete review:', err);
    }
    setReviews(prev => prev.filter(r => r.id !== id));
    addToast('Review deleted', 'info');
    return true;
  };

  const voteHelpfulReview = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}/helpful`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setReviews(prev => prev.map(r => r.id === id ? { ...r, helpfulVotes: data.helpfulVotes } : r));
        addToast('Thank you for your feedback!', 'success');
      }
    } catch {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, helpfulVotes: (r.helpfulVotes || 0) + 1 } : r));
    }
  };

  const refreshCoupons = useCallback(async () => {
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCoupons(data);
        }
      }
    } catch (err) {
      console.warn('Coupons fetch error:', err);
    }
  }, []);

  const refreshStoreContent = useCallback(async () => {
    try {
      const res = await fetch('/api/store-content');
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          setStoreContent(prev => ({ ...prev, ...data }));
        }
      }
    } catch (err) {
      console.warn('Store content fetch error:', err);
    }
  }, []);

  const updateStoreContent = async (newContent: Partial<StoreContent>): Promise<boolean> => {
    try {
      const res = await fetch('/api/store-content', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {})
        },
        body: JSON.stringify(newContent),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.storeContent) {
          setStoreContent(data.storeContent);
          return true;
        }
      }
    } catch (e) {
      console.warn('Failed to update store content on server:', e);
    }
    setStoreContent(prev => ({ ...prev, ...newContent }));
    return true;
  };

  const logoutAdmin = async () => {
    try {
      if (adminToken) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${adminToken}` },
        });
      }
    } catch {}
    setAdminToken(null);
    setIsAdminLoggedInState(false);
    setAdminUser(null);
    setActiveView('home');
    addToast('Logged out of Admin Control Panel', 'info');
  };

  // Initial Load of all data
  useEffect(() => {
    refreshProducts();
    refreshCategories();
    refreshOrders();
    refreshReviews();
    refreshCoupons();
    refreshStoreContent();
  }, [refreshProducts, refreshCategories, refreshOrders, refreshReviews, refreshCoupons, refreshStoreContent]);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openProductModal = (productId: string) => {
    setSelectedProductId(productId);
  };

  const closeProductModal = () => {
    setSelectedProductId(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      const product = products.find(p => p.id === productId);
      if (exists) {
        addToast(`Removed ${product ? product.name : 'item'} from favorites`, 'info');
        return prev.filter(id => id !== productId);
      } else {
        addToast(`Added ${product ? product.name : 'item'} to your favorites list`, 'success');
        return [...prev, productId];
      }
    });
  };

  // Cart operations
  const addToCart = (
    product: Product, 
    variant?: ProductVariant, 
    options?: Record<string, string>, 
    quantity = 1, 
    note = ''
  ) => {
    if (!product.isAvailable) {
      addToast(`${product.name} is currently sold out for today`, 'error');
      return;
    }

    const basePrice = product.price;
    const variantPrice = variant ? variant.priceModifier : 0;
    const unitPrice = Number((basePrice + variantPrice).toFixed(2));

    const itemHash = `${product.id}-${variant?.id || 'default'}-${JSON.stringify(options || {})}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === itemHash);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          id: itemHash,
          productId: product.id,
          product,
          selectedVariant: variant,
          selectedOptions: options,
          customNote: note,
          quantity,
          unitPrice,
        };
        return [...prev, newItem];
      }
    });

    addToast(`Added ${quantity}x ${product.name} to basket`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    addToast('Item removed from basket', 'info');
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartSubtotal = Number(
    cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0).toFixed(2)
  );

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyCouponCode = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: cartSubtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountAmount: data.discountAmount,
          description: data.coupon.description,
        });
        addToast(`Code ${data.coupon.code} applied! Saved €${data.discountAmount.toFixed(2)}`, 'success');
        return { success: true, message: `Discount of €${data.discountAmount.toFixed(2)} applied.` };
      } else {
        return { success: false, message: data.message || 'Invalid promotional code.' };
      }
    } catch {
      // Fallback local verification
      const found = coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim() && c.isActive);
      if (found) {
        if (cartSubtotal < found.minimumOrder) {
          return { success: false, message: `Minimum order of €${found.minimumOrder.toFixed(2)} required.` };
        }
        const disc = found.discountType === 'percentage' 
          ? (cartSubtotal * found.discountValue) / 100 
          : Math.min(found.discountValue, cartSubtotal);
        setAppliedCoupon({
          code: found.code,
          discountAmount: Number(disc.toFixed(2)),
          description: found.description,
        });
        addToast(`Code ${found.code} applied!`, 'success');
        return { success: true, message: `Saved €${disc.toFixed(2)}` };
      }
      return { success: false, message: 'Invalid or expired code.' };
    }
  };

  const removeCouponCode = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  return (
    <BakeryContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedProductId,
        setSelectedProductId,
        openProductModal,
        closeProductModal,
        menuSearchQuery,
        setMenuSearchQuery,
        menuFilterCategory,
        setMenuFilterCategory,
        navigateToMenuWithSearch,
        products,
        setProducts,
        categories,
        setCategories,
        branches,
        reviews,
        setReviews,
        refreshReviews,
        submitReview,
        approveReview,
        rejectReview,
        toggleFeatureReview,
        updateReview,
        deleteReview,
        voteHelpfulReview,
        coupons,
        setCoupons,
        storeContent,
        setStoreContent,
        refreshProducts,
        refreshCategories,
        refreshOrders,
        refreshCoupons,
        refreshStoreContent,
        updateStoreContent,
        orders,
        setOrders,
        currentOrder: lastCompletedOrder,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartItemCount,
        isCheckoutOpen,
        setIsCheckoutOpen,
        appliedCoupon,
        applyCouponCode,
        removeCouponCode,
        selectedBranchId,
        setSelectedBranchId,
        lastCompletedOrder,
        setLastCompletedOrder,
        wishlist,
        toggleWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        isAssistantOpen,
        setIsAssistantOpen,
        activeLegalDoc,
        setActiveLegalDoc,
        cakeDraft,
        setCakeDraft,
        toasts,
        addToast,
        removeToast,
        adminToken,
        setAdminToken,
        adminUser,
        setAdminUser,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        logoutAdmin,
      }}
    >
      {children}
    </BakeryContext.Provider>
  );
};

export const useBakery = () => {
  const context = useContext(BakeryContext);
  if (!context) {
    throw new Error('useBakery must be used within a BakeryProvider');
  }
  return context;
};
