import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_BRANCHES, 
  INITIAL_COUPONS, 
  INITIAL_REVIEWS, 
  INITIAL_EVENT_PACKAGES, 
  INITIAL_FAQS, 
  INITIAL_GALLERY, 
  INITIAL_STORE_CONTENT,
  INITIAL_CATEGORIES
} from './src/data/bakeryData.ts';
import { 
  Product, 
  Order, 
  CustomCakeRequest, 
  Coupon, 
  CustomerReview, 
  StoreContent,
  BakeryBranch,
  CategoryItem 
} from './src/types.ts';

dotenv.config();

// In-Memory Database Store (persisting during server run)
const db = {
  categories: [...INITIAL_CATEGORIES] as CategoryItem[],
  products: [...INITIAL_PRODUCTS] as Product[],
  branches: [...INITIAL_BRANCHES] as BakeryBranch[],
  coupons: [...INITIAL_COUPONS] as Coupon[],
  reviews: [...INITIAL_REVIEWS] as CustomerReview[],
  eventPackages: [...INITIAL_EVENT_PACKAGES],
  faqs: [...INITIAL_FAQS],
  gallery: [...INITIAL_GALLERY],
  storeContent: { ...INITIAL_STORE_CONTENT } as StoreContent,
  orders: [
    {
      id: 'ord-101',
      orderNumber: 'MSH-8942',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      customer: {
        fullName: 'Charlotte Dupont',
        email: 'charlotte.dupont@example.com',
        phone: '+33 6 12 34 56 78',
        address: {
          street: '24 Rue de Rivoli',
          city: 'Paris',
          postalCode: '75004',
          country: 'France',
        },
      },
      type: 'delivery',
      deliveryDate: new Date().toISOString().split('T')[0],
      deliveryTimeSlot: '10:00 – 12:00',
      items: [
        {
          id: 'item-1',
          productId: 'croissant-pur-beurre',
          product: INITIAL_PRODUCTS.find(p => p.id === 'croissant-pur-beurre')!,
          quantity: 4,
          unitPrice: 3.40,
        },
        {
          id: 'item-2',
          productId: 'pain-de-campagne',
          product: INITIAL_PRODUCTS.find(p => p.id === 'pain-de-campagne')!,
          quantity: 1,
          unitPrice: 6.80,
        },
        {
          id: 'item-3',
          productId: 'saint-honore-signature',
          product: INITIAL_PRODUCTS.find(p => p.id === 'saint-honore-signature')!,
          quantity: 1,
          unitPrice: 42.00,
        }
      ],
      subtotal: 62.40,
      deliveryFee: 0,
      discountAmount: 6.24,
      couponCode: 'BONJOUR10',
      taxAmount: 3.93,
      total: 56.16,
      status: 'preparing',
      paymentMethod: 'apple_pay',
      paymentStatus: 'paid',
      notes: 'Please ring bell 3B on courtyard entrance.',
    },
    {
      id: 'ord-102',
      orderNumber: 'MSH-8943',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      customer: {
        fullName: 'Maximilian Krause',
        email: 'm.krause@example.de',
        phone: '+49 171 892144',
      },
      type: 'pickup',
      pickupBranchId: 'munich-flagship',
      deliveryDate: new Date().toISOString().split('T')[0],
      deliveryTimeSlot: '08:30 – 09:30',
      items: [
        {
          id: 'item-4',
          productId: 'parisian-morning-hamper',
          product: INITIAL_PRODUCTS.find(p => p.id === 'parisian-morning-hamper')!,
          quantity: 1,
          unitPrice: 48.00,
        }
      ],
      subtotal: 48.00,
      deliveryFee: 0,
      discountAmount: 0,
      taxAmount: 3.14,
      total: 48.00,
      status: 'ready',
      paymentMethod: 'card',
      paymentStatus: 'paid',
      notes: 'Gift box for anniversary.',
    }
  ] as Order[],
  customCakeRequests: [
    {
      id: 'cake-req-1',
      referenceNumber: 'MSH-CAKE-4102',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      customer: {
        name: 'Astrid Lindholm',
        email: 'astrid.lindholm@example.nl',
        phone: '+31 6 8841 9920',
      },
      cakeType: '2-Tier Celebration Masterpiece',
      servings: '20-25 Guests',
      spongeFlavor: 'Sicilian Pistachio & Olive Oil',
      fillingFlavor: 'Wild French Raspberry Confiture',
      frostingStyle: 'Swiss Meringue Buttercream (Ivory)',
      decorationStyle: 'Fresh Organic Florals & 24K Gold Leaf',
      colorPalette: 'Sage Green, Ivory & Brushed Gold',
      inscriptionMessage: 'Joyeux 30ème Anniversaire Astrid',
      eventType: '30th Birthday Celebration',
      eventDate: '2026-09-12',
      fulfillmentType: 'pickup',
      pickupBranchId: 'amsterdam-jordaan',
      budgetRange: '€200 – €300',
      estimatedPrice: 245.00,
      dietaryRestrictions: ['Vegetarian', 'Nut Allergy in party (Avoid Hazelnuts, Pistachio is confirmed ok)'],
      additionalNotes: 'Would love delicate chamomile and edible pansies on the tier edges.',
      status: 'approved_quoted',
      adminNotes: 'Confirmed floral supply from our bio florist.',
    }
  ] as CustomCakeRequest[],
  newsletterSubscribers: ['sophie@example.com', 'julien.b@example.fr'],
  contactMessages: [] as any[],
  eventInquiries: [] as any[],
  adminTokens: new Set<string>(['msh-session-artisan-admin-key-2026']),
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Initialize Gemini AI Client for Bakery Concierge
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn('Gemini AI initialization warning:', err);
    }
  }

  // ==========================================
  // API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', brand: 'Maison Saint-Honoré', timestamp: new Date().toISOString() });
  });

  // Products API
  app.get('/api/products', (req: Request, res: Response) => {
    const { category, search, dietary, featured, seasonal, sort } = req.query;
    let results = [...db.products];

    if (category && category !== 'all') {
      results = results.filter(p => p.category === category);
    }

    if (dietary && dietary !== 'all') {
      results = results.filter(p => p.dietary.includes(dietary as any));
    }

    if (featured === 'true') {
      results = results.filter(p => p.isFeatured);
    }

    if (seasonal === 'true') {
      results = results.filter(p => p.isSeasonal);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      results = results.filter(p => 
        p.name.toLowerCase().includes(q) ||
        (p.frenchName && p.frenchName.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q) ||
        p.ingredients.some(i => i.toLowerCase().includes(q))
      );
    }

    if (sort) {
      if (sort === 'price-asc') results.sort((a, b) => a.price - b.price);
      else if (sort === 'price-desc') results.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') results.sort((a, b) => b.rating - a.rating);
      else if (sort === 'reviews') results.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    res.json({ count: results.length, products: results });
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = db.products.find(p => p.id === req.params.id || p.slug === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const related = db.products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
    const reviews = db.reviews.filter(r => r.productId === product.id || r.productName === product.name);
    res.json({ product, related, reviews });
  });

  // Admin Product mutation
  app.post('/api/products', (req: Request, res: Response) => {
    const newProduct: Product = {
      ...req.body,
      id: req.body.id || `prod-${Date.now()}`,
      rating: req.body.rating || 5.0,
      reviewCount: req.body.reviewCount || 0,
      isAvailable: req.body.isAvailable !== false,
    };
    db.products.unshift(newProduct);
    res.status(201).json({ success: true, product: newProduct });
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const index = db.products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    db.products[index] = { ...db.products[index], ...req.body };
    res.json({ success: true, product: db.products[index] });
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const index = db.products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    db.products.splice(index, 1);
    res.json({ success: true, message: 'Product deleted' });
  });

  app.patch('/api/products/:id/toggle-stock', (req: Request, res: Response) => {
    const product = db.products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    product.isAvailable = !product.isAvailable;
    res.json({ success: true, isAvailable: product.isAvailable, product });
  });

  // Branches
  app.get('/api/branches', (req: Request, res: Response) => {
    res.json(db.branches);
  });

  // Categories API
  app.get('/api/categories', (req: Request, res: Response) => {
    const { all } = req.query;
    if (all === 'true') {
      return res.json(db.categories);
    }
    res.json(db.categories.filter(c => c.isEnabled));
  });

  app.post('/api/categories', (req: Request, res: Response) => {
    const { name, slug, french, displayOrder, isEnabled, icon } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat = {
      id: catSlug,
      name: name.trim(),
      slug: catSlug,
      french: french || name,
      displayOrder: Number(displayOrder) || db.categories.length + 1,
      isEnabled: isEnabled !== false,
      icon: icon || 'Sparkles',
    };
    db.categories.push(newCat);
    res.status(201).json({ success: true, category: newCat });
  });

  app.put('/api/categories/:id', (req: Request, res: Response) => {
    const index = db.categories.findIndex(c => c.id === req.params.id || c.slug === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }
    db.categories[index] = { ...db.categories[index], ...req.body };
    res.json({ success: true, category: db.categories[index] });
  });

  app.delete('/api/categories/:id', (req: Request, res: Response) => {
    const index = db.categories.findIndex(c => c.id === req.params.id || c.slug === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }
    db.categories.splice(index, 1);
    res.json({ success: true, message: 'Category deleted' });
  });

  app.patch('/api/categories/:id/toggle', (req: Request, res: Response) => {
    const cat = db.categories.find(c => c.id === req.params.id || c.slug === req.params.id);
    if (!cat) {
      return res.status(404).json({ error: 'Category not found' });
    }
    cat.isEnabled = !cat.isEnabled;
    res.json({ success: true, category: cat });
  });

  // Coupons
  app.post('/api/coupons/validate', (req: Request, res: Response) => {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, message: 'Coupon code required' });
    }
    const coupon = db.coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ valid: false, message: 'Invalid or expired promotional code' });
    }
    if (subtotal < coupon.minimumOrder) {
      return res.status(400).json({ 
        valid: false, 
        message: `Minimum order of €${coupon.minimumOrder.toFixed(2)} required for code ${coupon.code}` 
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
    } else {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        description: coupon.description,
      },
      discountAmount: Number(discountAmount.toFixed(2)),
    });
  });

  app.get('/api/coupons', (req: Request, res: Response) => {
    res.json(db.coupons);
  });

  app.post('/api/coupons', (req: Request, res: Response) => {
    const newCoupon: Coupon = {
      ...req.body,
      code: req.body.code.toUpperCase().trim(),
      discountValue: Number(req.body.discountValue) || 10,
      minimumOrder: Number(req.body.minimumOrder) || 0,
      usedCount: 0,
      isActive: req.body.isActive !== false,
      expiresAt: req.body.expiresAt || new Date(Date.now() + 86400000 * 90).toISOString(),
    };
    db.coupons.push(newCoupon);
    res.status(201).json({ success: true, coupon: newCoupon });
  });

  app.put('/api/coupons/:code', (req: Request, res: Response) => {
    const index = db.coupons.findIndex(c => c.code.toUpperCase() === req.params.code.toUpperCase());
    if (index === -1) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    db.coupons[index] = { 
      ...db.coupons[index], 
      ...req.body, 
      code: req.body.code ? req.body.code.toUpperCase().trim() : db.coupons[index].code,
      discountValue: req.body.discountValue !== undefined ? Number(req.body.discountValue) : db.coupons[index].discountValue,
      minimumOrder: req.body.minimumOrder !== undefined ? Number(req.body.minimumOrder) : db.coupons[index].minimumOrder,
    };
    res.json({ success: true, coupon: db.coupons[index] });
  });

  app.patch('/api/coupons/:code/toggle', (req: Request, res: Response) => {
    const coupon = db.coupons.find(c => c.code.toUpperCase() === req.params.code.toUpperCase());
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    coupon.isActive = !coupon.isActive;
    res.json({ success: true, coupon });
  });

  app.delete('/api/coupons/:code', (req: Request, res: Response) => {
    const index = db.coupons.findIndex(c => c.code.toUpperCase() === req.params.code.toUpperCase());
    if (index === -1) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    db.coupons.splice(index, 1);
    res.json({ success: true, message: 'Coupon deleted' });
  });

  // Orders API
  app.post('/api/orders', (req: Request, res: Response) => {
    const { 
      customer, 
      type, 
      pickupBranchId, 
      deliveryDate, 
      deliveryTimeSlot, 
      items, 
      couponCode, 
      paymentMethod, 
      notes 
    } = req.body;

    if (!customer || !customer.fullName || !customer.email || !customer.phone) {
      return res.status(400).json({ error: 'Customer contact details are required.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart cannot be empty.' });
    }

    if (type === 'delivery' && (!customer.address || !customer.address.street || !customer.address.city)) {
      return res.status(400).json({ error: 'Delivery address is required for courier delivery.' });
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.unitPrice * item.quantity), 0);

    // Delivery rules: €15 min order, €0 delivery for >= €45, else €4.50
    let deliveryFee = 0;
    if (type === 'delivery') {
      if (subtotal < 15) {
        return res.status(400).json({ error: 'Minimum order amount for delivery is €15.00.' });
      }
      deliveryFee = subtotal >= 45 ? 0 : 4.50;
    }

    // Discount
    let discountAmount = 0;
    if (couponCode) {
      const c = db.coupons.find(coup => coup.code.toUpperCase() === couponCode.toUpperCase().trim() && coup.isActive);
      if (c && subtotal >= c.minimumOrder) {
        discountAmount = c.discountType === 'percentage' 
          ? (subtotal * c.discountValue) / 100 
          : Math.min(c.discountValue, subtotal);
        c.usedCount += 1;
      }
    }

    const netAmount = Math.max(0, subtotal - discountAmount);
    // 7% bakery food VAT included / calculated
    const taxAmount = Number(((netAmount / 1.07) * 0.07).toFixed(2));
    const total = Number((netAmount + deliveryFee).toFixed(2));

    const orderNumber = `MSH-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer,
      type,
      pickupBranchId: type === 'pickup' ? pickupBranchId : undefined,
      deliveryDate: deliveryDate || new Date().toISOString().split('T')[0],
      deliveryTimeSlot: deliveryTimeSlot || '10:00 – 12:00',
      items,
      subtotal: Number(subtotal.toFixed(2)),
      deliveryFee: Number(deliveryFee.toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
      couponCode,
      taxAmount,
      total,
      status: 'confirmed',
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'paid',
      notes,
    };

    db.orders.unshift(newOrder);
    res.status(201).json({ success: true, order: newOrder });
  });

  app.get('/api/orders', (req: Request, res: Response) => {
    const { status, search } = req.query;
    let list = [...db.orders];

    if (status && status !== 'all') {
      list = list.filter(o => o.status === status);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      list = list.filter(o => 
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.customer.phone.includes(q)
      );
    }

    res.json(list);
  });

  app.get('/api/orders/track/:orderNumber', (req: Request, res: Response) => {
    const order = db.orders.find(o => 
      o.orderNumber.toLowerCase() === req.params.orderNumber.toLowerCase().trim() ||
      o.id === req.params.orderNumber
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found with this reference number.' });
    }
    res.json(order);
  });

  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    const { status } = req.body;
    const order = db.orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.status = status;
    res.json({ success: true, order });
  });

  // Custom Cake Builder Requests
  app.post('/api/custom-cakes', (req: Request, res: Response) => {
    const reqData = req.body;
    const refNum = `MSH-CAKE-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newCustomCake: CustomCakeRequest = {
      id: `cake-${Date.now()}`,
      referenceNumber: refNum,
      createdAt: new Date().toISOString(),
      customer: reqData.customer,
      cakeType: reqData.cakeType,
      servings: reqData.servings,
      spongeFlavor: reqData.spongeFlavor,
      fillingFlavor: reqData.fillingFlavor,
      frostingStyle: reqData.frostingStyle,
      decorationStyle: reqData.decorationStyle,
      colorPalette: reqData.colorPalette,
      inscriptionMessage: reqData.inscriptionMessage,
      eventType: reqData.eventType,
      eventDate: reqData.eventDate,
      fulfillmentType: reqData.fulfillmentType || 'pickup',
      pickupBranchId: reqData.pickupBranchId,
      deliveryAddress: reqData.deliveryAddress,
      budgetRange: reqData.budgetRange,
      estimatedPrice: reqData.estimatedPrice || 180,
      dietaryRestrictions: reqData.dietaryRestrictions || [],
      additionalNotes: reqData.additionalNotes,
      referenceImageUrl: reqData.referenceImageUrl,
      status: 'submitted',
    };

    db.customCakeRequests.unshift(newCustomCake);
    res.status(201).json({ success: true, customCakeRequest: newCustomCake });
  });

  app.get('/api/custom-cakes', (req: Request, res: Response) => {
    res.json(db.customCakeRequests);
  });

  app.patch('/api/custom-cakes/:id/status', (req: Request, res: Response) => {
    const { status, adminNotes, quoteAmount } = req.body;
    const cakeReq = db.customCakeRequests.find(c => c.id === req.params.id || c.referenceNumber === req.params.id);
    if (!cakeReq) {
      return res.status(404).json({ error: 'Cake request not found' });
    }
    if (status) cakeReq.status = status;
    if (adminNotes) cakeReq.adminNotes = adminNotes;
    if (quoteAmount) cakeReq.estimatedPrice = Number(quoteAmount);
    res.json({ success: true, cakeRequest: cakeReq });
  });

  // Reviews API with Genuine Customer Moderation & Verification
  app.get('/api/reviews', (req: Request, res: Response) => {
    const showAll = req.query.all === 'true';
    const authHeader = req.headers.authorization;
    const isAdmin = authHeader && db.adminTokens.has(authHeader.replace('Bearer ', '').trim());

    if (showAll || isAdmin) {
      return res.json(db.reviews);
    }
    // Public only receives strictly approved reviews
    const approvedReviews = db.reviews.filter(r => r.isApproved === true || r.status === 'approved');
    res.json(approvedReviews);
  });

  app.get('/api/admin/reviews/stats', (req: Request, res: Response) => {
    const totalReviews = db.reviews.length;
    const pendingReviews = db.reviews.filter(r => r.status === 'pending' || (!r.isApproved && r.status !== 'rejected')).length;
    const approvedReviewsList = db.reviews.filter(r => r.isApproved === true || r.status === 'approved');
    const approvedReviews = approvedReviewsList.length;
    const rejectedReviews = db.reviews.filter(r => r.status === 'rejected').length;
    
    // Average rating calculated STRICTLY from genuine approved reviews
    const sumRatings = approvedReviewsList.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    const averageRating = approvedReviews > 0 ? Number((sumRatings / approvedReviews).toFixed(2)) : 0;

    const ratingDistribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    approvedReviewsList.forEach(r => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      ratingDistribution[rounded] = (ratingDistribution[rounded] || 0) + 1;
    });

    const verifiedCount = approvedReviewsList.filter(r => r.isVerifiedPurchase).length;

    res.json({
      totalReviews,
      pendingReviews,
      approvedReviews,
      rejectedReviews,
      averageRating,
      ratingDistribution,
      verifiedCount,
    });
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    const { 
      author, 
      city, 
      rating, 
      title, 
      comment, 
      productName, 
      productId, 
      orderId, 
      orderNumber 
    } = req.body;

    if (!author || !rating || !comment) {
      return res.status(400).json({ error: 'Customer name, star rating (1–5), and written review are required.' });
    }

    const parsedRating = Math.min(5, Math.max(1, Number(rating) || 5));

    // Verify against real database orders
    let isVerifiedPurchase = false;
    let matchedOrderNumber: string | undefined = undefined;
    let matchedOrderId: string | undefined = undefined;

    if (orderNumber || orderId) {
      const searchRef = String(orderNumber || orderId || '').trim().toUpperCase();
      const matchedOrder = db.orders.find(o => 
        o.orderNumber.toUpperCase() === searchRef || 
        o.id.toUpperCase() === searchRef
      );
      if (matchedOrder) {
        isVerifiedPurchase = true;
        matchedOrderNumber = matchedOrder.orderNumber;
        matchedOrderId = matchedOrder.id;
      }
    }

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      orderId: matchedOrderId,
      orderNumber: matchedOrderNumber || (orderNumber ? String(orderNumber).trim() : undefined),
      author: String(author).trim(),
      city: String(city || 'Customer').trim(),
      rating: parsedRating,
      title: title ? String(title).trim() : 'Customer Feedback',
      comment: String(comment).trim(),
      productName: productName ? String(productName).trim() : undefined,
      productId: productId ? String(productId).trim() : undefined,
      date: new Date().toISOString().split('T')[0],
      isVerifiedPurchase,
      isFeatured: false,
      isApproved: false, // New reviews MUST start as Pending moderation
      status: 'pending',
      helpfulVotes: 0,
    };

    db.reviews.unshift(newRev);
    res.status(201).json({ 
      success: true, 
      message: 'Thank you! Your review has been submitted and is currently pending review before appearing publicly.', 
      review: newRev 
    });
  });

  app.patch('/api/reviews/:id/approve', (req: Request, res: Response) => {
    const rev = db.reviews.find(r => r.id === req.params.id);
    if (!rev) return res.status(404).json({ error: 'Review not found' });
    rev.isApproved = true;
    rev.status = 'approved';
    res.json({ success: true, review: rev });
  });

  app.patch('/api/reviews/:id/reject', (req: Request, res: Response) => {
    const rev = db.reviews.find(r => r.id === req.params.id);
    if (!rev) return res.status(404).json({ error: 'Review not found' });
    rev.isApproved = false;
    rev.status = 'rejected';
    res.json({ success: true, review: rev });
  });

  app.patch('/api/reviews/:id/feature', (req: Request, res: Response) => {
    const rev = db.reviews.find(r => r.id === req.params.id);
    if (!rev) return res.status(404).json({ error: 'Review not found' });
    rev.isFeatured = !rev.isFeatured;
    res.json({ success: true, review: rev });
  });

  app.put('/api/reviews/:id', (req: Request, res: Response) => {
    const rev = db.reviews.find(r => r.id === req.params.id);
    if (!rev) return res.status(404).json({ error: 'Review not found' });

    const { author, city, rating, title, comment, productName, isVerifiedPurchase, isApproved, status, isFeatured, adminNotes } = req.body;
    
    if (author !== undefined) rev.author = String(author).trim();
    if (city !== undefined) rev.city = String(city).trim();
    if (rating !== undefined) rev.rating = Math.min(5, Math.max(1, Number(rating)));
    if (title !== undefined) rev.title = String(title).trim();
    if (comment !== undefined) rev.comment = String(comment).trim();
    if (productName !== undefined) rev.productName = String(productName).trim();
    if (isVerifiedPurchase !== undefined) rev.isVerifiedPurchase = Boolean(isVerifiedPurchase);
    if (isFeatured !== undefined) rev.isFeatured = Boolean(isFeatured);
    if (adminNotes !== undefined) rev.adminNotes = String(adminNotes);
    
    if (status !== undefined) {
      rev.status = status;
      rev.isApproved = status === 'approved';
    } else if (isApproved !== undefined) {
      rev.isApproved = Boolean(isApproved);
      rev.status = rev.isApproved ? 'approved' : 'rejected';
    }

    res.json({ success: true, review: rev });
  });

  app.delete('/api/reviews/:id', (req: Request, res: Response) => {
    const index = db.reviews.findIndex(r => r.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }
    db.reviews.splice(index, 1);
    res.json({ success: true, message: 'Review deleted successfully' });
  });

  app.post('/api/reviews/:id/helpful', (req: Request, res: Response) => {
    const rev = db.reviews.find(r => r.id === req.params.id);
    if (!rev) return res.status(404).json({ error: 'Review not found' });
    rev.helpfulVotes = (rev.helpfulVotes || 0) + 1;
    res.json({ success: true, helpfulVotes: rev.helpfulVotes });
  });

  // Event inquiries & wedding catering
  app.post('/api/events/inquire', (req: Request, res: Response) => {
    const inquiry = {
      id: `evt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...req.body,
    };
    db.eventInquiries.unshift(inquiry);
    res.status(201).json({ 
      success: true, 
      message: 'Thank you for your event enquiry. Our private event sommelier will contact you within 24 hours with a bespoke proposal.',
      inquiryId: inquiry.id 
    });
  });

  // Contact messages
  app.post('/api/contact', (req: Request, res: Response) => {
    const message = {
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...req.body,
    };
    db.contactMessages.unshift(message);
    res.status(201).json({ success: true, message: 'Message sent successfully. Our team will respond shortly.' });
  });

  // Newsletter
  app.post('/api/newsletter', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!db.newsletterSubscribers.includes(email.toLowerCase().trim())) {
      db.newsletterSubscribers.push(email.toLowerCase().trim());
    }
    res.json({ 
      success: true, 
      message: 'Welcome to the Maison Saint-Honoré circle. Use promo code BONJOUR10 on your next order for 10% off.' 
    });
  });

  // Admin Auth & Analytics
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const identifier = (username || email || '').trim().toLowerCase();
    const pwd = (password || '').trim();

    // Valid admin identifiers: admin, admin@maisoneloise.com, artisan, baker, manager, chef
    const validIdentifiers = ['admin', 'admin@maisoneloise.com', 'artisan', 'baker', 'manager', 'chef', 'eloise@maisoneloise.com'];
    const validPasswords = ['maisoneloise2026', 'saint-honore2026', 'maison2026', 'admin123', 'eloise2026'];

    if (validIdentifiers.includes(identifier) && validPasswords.includes(pwd)) {
      const token = `msh-session-${Date.now()}-${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
      db.adminTokens.add(token);
      return res.json({ 
        success: true, 
        token, 
        user: { 
          name: 'Head Baker & Manager', 
          role: 'Administrator', 
          email: identifier.includes('@') ? identifier : 'admin@maisoneloise.com',
          lastLogin: new Date().toISOString()
        } 
      });
    }
    res.status(401).json({ 
      error: 'Invalid credentials. Hint: Email "admin@maisoneloise.com" or Username "admin", Password "maisoneloise2026"' 
    });
  });

  app.post('/api/admin/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '').trim();
      db.adminTokens.delete(token);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });

  app.get('/api/admin/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ authenticated: false, error: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '').trim();
    if (!db.adminTokens.has(token)) {
      return res.status(401).json({ authenticated: false, error: 'Session expired or invalid' });
    }
    res.json({ 
      authenticated: true, 
      user: { 
        name: 'Head Baker & Manager', 
        role: 'Administrator', 
        email: 'admin@maisoneloise.com' 
      } 
    });
  });

  app.delete('/api/orders/:id', (req: Request, res: Response) => {
    const index = db.orders.findIndex(o => o.id === req.params.id || o.orderNumber === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    db.orders.splice(index, 1);
    res.json({ success: true, message: 'Order deleted successfully' });
  });

  app.get('/api/admin/analytics', (req: Request, res: Response) => {
    const totalOrders = db.orders.length;
    const totalRevenue = db.orders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Status breakdowns
    const pendingOrders = db.orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
    const preparingOrders = db.orders.filter(o => o.status === 'preparing').length;
    const completedOrders = db.orders.filter(o => o.status === 'completed' || o.status === 'ready').length;
    const cancelledOrders = db.orders.filter(o => o.status === 'cancelled').length;

    // Today's stats
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysOrdersList = db.orders.filter(o => o.createdAt.startsWith(todayStr) || o.deliveryDate === todayStr);
    const todaysRevenue = todaysOrdersList.reduce((sum, o) => sum + o.total, 0);
    const todaysOrders = todaysOrdersList.length;

    const activeCakeRequests = db.customCakeRequests.filter(c => c.status === 'submitted' || c.status === 'under_review').length;
    const outOfStockProducts = db.products.filter(p => !p.isAvailable).length;

    // Sales by category
    const categorySales: Record<string, number> = {};
    db.orders.forEach(order => {
      order.items.forEach(item => {
        const cat = item.product?.category || 'general';
        categorySales[cat] = (categorySales[cat] || 0) + (item.unitPrice * item.quantity);
      });
    });

    res.json({
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      avgOrderValue: Number(avgOrderValue.toFixed(2)),
      pendingOrders,
      preparingOrders,
      completedOrders,
      cancelledOrders,
      todaysRevenue: Number(todaysRevenue.toFixed(2)),
      todaysOrders,
      activeCakeRequests,
      totalProducts: db.products.length,
      outOfStockProducts,
      totalCategories: db.categories.length,
      categorySales,
      recentOrders: db.orders.slice(0, 10),
    });
  });

  // Store Content CMS
  app.get('/api/store-content', (req: Request, res: Response) => {
    res.json(db.storeContent);
  });

  app.put('/api/store-content', (req: Request, res: Response) => {
    db.storeContent = { ...db.storeContent, ...req.body };
    res.json({ success: true, storeContent: db.storeContent });
  });

  // ==========================================
  // SERVER-SIDE GEMINI AI CUSTOMER CONCIERGE
  // ==========================================
  app.post('/api/assistant', async (req: Request, res: Response) => {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build context with live bakery data
    const catalogSummary = db.products.map(p => 
      `- ${p.name} (${p.frenchName || ''}): €${p.price.toFixed(2)}, Category: ${p.category}, Dietary: ${p.dietary.join(', ')}, Allergens: ${p.allergens.join(', ')}, Available: ${p.isAvailable ? 'Yes' : 'Sold out'}, Description: ${p.shortDescription}`
    ).join('\n');

    const branchSummary = db.branches.map(b => 
      `- ${b.name} (${b.city}, ${b.country}): ${b.address}, Phone: ${b.phone}, Hours: Mon-Fri ${b.hours.weekdays}, Sat ${b.hours.saturday}, Sun ${b.hours.sunday}`
    ).join('\n');

    const systemInstruction = `You are "Le Sommelier de la Pâtisserie", the refined, polite, and knowledgeable virtual concierge for "Maison Saint-Honoré", an ultra-premium European artisan bakery and haute pâtisserie with ateliers in Munich, Paris, and Amsterdam.

CRITICAL DIRECTIVES:
1. Ground all your answers strictly in the bakery's authentic configured information provided below.
2. DO NOT invent fake products, prices, opening hours, or allergens not listed.
3. Offer warm, elegant, French/European hospitality (courteous, sophisticated, helpful).
4. If asked about custom cakes, guide them to use the Custom Cake Builder on the website or explain the 5-7 days lead time and flavor tiers.
5. If asked about delivery: explain our refrigerated courier service in Munich, Paris & Amsterdam, €15 minimum order, complimentary delivery over €45, or free Click & Collect pickup.
6. If asked about allergens, always give precise allergen lists from the products.
7. Keep responses concise, clear, and tastefully formatted.

LIVE BAKERY MENU & PRODUCTS:
${catalogSummary}

ATELIER LOCATIONS & OPENING HOURS:
${branchSummary}

POLICIES & GUIDELINES:
- Sourdough fermentation: 48 to 72 hours cold wild levain.
- Ingredients: Label Rouge French T80/T65 flours, 84% fat Charentes-Poitou AOP French butter, Valrhona Grand Cru chocolate, Tahitian vanilla, Bronte pistachios.
- Promo codes: BONJOUR10 gives 10% off first order over €15.
- Lead times: Morning pastries/bread same-day/next-day; Entremet cakes 24-48h; Custom tiered cakes 5-7 days.`;

    if (!ai) {
      // Fallback smart rule-based response if GEMINI_API_KEY is not configured
      const q = message.toLowerCase();
      let reply = "Bonjour! Welcome to Maison Saint-Honoré. How may I assist your culinary journey today?";
      if (q.includes('cake') || q.includes('birthday') || q.includes('custom')) {
        reply = "We offer exquisite celebratory entremets (such as our Signature Saint-Honoré Tart €42, Valrhona Opera Cake €38, and Bronte Pistachio Raspberry Entremet €45) as well as bespoke multi-tiered celebration and wedding cakes via our interactive Custom Cake Builder. May I guide you to our cake section?";
      } else if (q.includes('hour') || q.includes('open') || q.includes('close') || q.includes('time')) {
        reply = "Our Munich Flagship (Maximilianstraße 42) is open weekdays 07:30–19:00, Sat 08:00–19:00, Sun 08:30–17:00. Paris 1er opens weekdays 07:00–20:00, Sat 07:30–20:00, Sun 08:00–18:00. Amsterdam Jordaan opens weekdays 08:00–18:30, Sat 08:00–19:00, Sun 09:00–17:00.";
      } else if (q.includes('deliver') || q.includes('pickup') || q.includes('shipping')) {
        reply = "We provide refrigerated white-glove courier delivery across Munich, Paris, and Amsterdam within 20km of each atelier. Delivery is complimentary for orders over €45 (minimum order €15). Free Click & Collect pickup is also available daily!";
      } else if (q.includes('nut') || q.includes('gluten') || q.includes('vegan') || q.includes('allergen')) {
        reply = "We pride ourselves on total ingredient transparency. Our Heritage Country Loaf and Dark Nordic Rye are 100% vegan and naturally fermented. Our Haute Macaron Collection is naturally gluten-free. For tree nut allergies, please note our croissants and entremets contain butter, and our frangipane / Paris-Brest contains almonds and hazelnuts.";
      } else if (q.includes('croissant') || q.includes('bread') || q.includes('pain')) {
        reply = "Our croissants are laminated with 27 golden layers using 84% fat Charentes-Poitou AOP French butter (€3.40), and our signature Pain de Campagne (€6.80) is fermented for 48 hours with stoneground T80 flour and wild levain.";
      }
      return res.json({ reply, source: 'grounded-rules' });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: [
          ...conversationHistory.map((h: any) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }],
          })),
          {
            role: 'user',
            parts: [{ text: message }],
          },
        ],
        config: {
          systemInstruction,
          temperature: 0.4,
        },
      });

      const reply = response.text || "Bonjour! How may I assist you with our artisan bakery catalog today?";
      res.json({ reply, source: 'gemini-3.7-flash' });
    } catch (err: any) {
      console.error('Gemini AI Assistant error:', err);
      res.status(500).json({ 
        error: 'Failed to generate response', 
        reply: "Bonjour! I am currently consulting our master baker. In the meantime, please feel free to browse our digital menu or use our online ordering checkout." 
      });
    }
  });

  // ==========================================
  // VITE MIDDLEWARE OR STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Maison Saint-Honoré luxury bakery server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server startup failure:', err);
});
