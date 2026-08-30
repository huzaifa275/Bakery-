export type ProductCategory = 
  | 'bread'
  | 'croissants'
  | 'pastries'
  | 'cakes'
  | 'cupcakes'
  | 'cookies'
  | 'donuts'
  | 'desserts'
  | 'seasonal'
  | 'drinks'
  | 'gift-boxes'
  | string;

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  french?: string;
  description?: string;
  displayOrder: number;
  isEnabled: boolean;
  icon?: string;
}

export type DietaryTag = 'Vegan' | 'Vegetarian' | 'Gluten-Free' | 'Dairy-Free' | 'Nut-Free' | 'Organic' | 'Artisan Fermented';

export interface ProductVariant {
  id: string;
  name: string;
  priceModifier: number; // e.g. +2.50
  inStock?: boolean;
}

export interface ProductOption {
  id: string;
  title: string;
  type: 'select' | 'radio' | 'checkbox';
  required?: boolean;
  choices: {
    id: string;
    label: string;
    priceModifier?: number;
  }[];
}

export interface Product {
  id: string;
  name: string;
  frenchName?: string;
  slug: string;
  category: ProductCategory;
  price: number;
  description: string;
  shortDescription: string;
  image: string;
  gallery?: string[];
  ingredients: string[];
  allergens: string[];
  dietary: DietaryTag[];
  dietaryTags?: DietaryTag[];
  isAvailable: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isSeasonal?: boolean;
  preparationTimeHours?: number;
  prepTime?: string;
  calories?: number;
  weightGrams?: number;
  variants?: ProductVariant[];
  options?: ProductOption[];
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  id: string; // unique item uuid (product.id + variant/options hash)
  productId: string;
  product: Product;
  selectedVariant?: ProductVariant;
  selectedOptions?: Record<string, string>;
  customNote?: string;
  quantity: number;
  unitPrice: number;
}

export type OrderType = 'pickup' | 'delivery';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'ideal' | 'giropay' | 'cash_on_pickup';

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  address?: {
    street: string;
    apartment?: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. MSH-2026-8921
  createdAt: string;
  customer: OrderCustomer;
  type: OrderType;
  pickupBranchId?: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  couponCode?: string;
  taxAmount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  notes?: string;
}

export interface CustomCakeRequest {
  id: string;
  referenceNumber: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  cakeType: string;
  servings: string;
  spongeFlavor: string;
  fillingFlavor: string;
  frostingStyle: string;
  decorationStyle: string;
  colorPalette: string;
  inscriptionMessage?: string;
  eventType: string;
  eventDate: string;
  fulfillmentType: 'pickup' | 'delivery';
  pickupBranchId?: string;
  deliveryAddress?: string;
  budgetRange: string;
  estimatedPrice: number;
  dietaryRestrictions?: string[];
  additionalNotes?: string;
  referenceImageUrl?: string;
  status: 'submitted' | 'under_review' | 'approved_quoted' | 'deposit_paid' | 'in_production' | 'completed' | 'declined';
  adminNotes?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 15 for 15% or 10 for €10
  minimumOrder: number;
  maxUses?: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  description: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type CustomerReview = {
  id: string;
  orderId?: string;
  orderNumber?: string;
  productId?: string;
  productName?: string;
  author: string;
  city: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
  isFeatured?: boolean;
  isApproved: boolean;
  status?: ReviewStatus;
  adminNotes?: string;
  helpfulVotes?: number;
};

export type Review = CustomerReview;

export interface BakeryBranch {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  image: string;
  isPickupAvailable: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  specialties: string[];
}

export interface EventPackage {
  id: string;
  name: string;
  frenchSubtitle: string;
  minGuests: number;
  pricePerGuest: number;
  description: string;
  image: string;
  includes: string[];
  recommendedFor: string;
}

export interface BakeryFAQ {
  id: string;
  category: 'Orders' | 'Delivery & Pickup' | 'Custom Cakes' | 'Allergens & Dietary' | 'Weddings & Events' | 'Storage & Care';
  question: string;
  answer: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'artisan-bread' | 'patisserie' | 'wedding-cakes' | 'atelier' | 'events';
  imageUrl: string;
  description: string;
}

export interface StoreContent {
  announcementBanner: {
    enabled: boolean;
    text: string;
    linkText?: string;
    linkUrl?: string;
  };
  brandName?: string;
  brandTagline?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  hoursSummary?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  aboutStoryHeading?: string;
  aboutStoryBody?: string;
  seasonalHighlightTitle: string;
  seasonalHighlightSubtitle: string;
  deliveryMinSpend?: number;
  freeDeliveryThreshold?: number;
  socialInstagram?: string;
  socialFacebook?: string;
  emergencyNotice?: string;
}
