import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  Star, 
  Sparkles, 
  AlertCircle, 
  Image as ImageIcon,
  Flame,
  Wheat,
  Tag
} from 'lucide-react';
import { Product, DietaryTag, ProductCategory } from '../../types';

export const AdminProducts: React.FC = () => {
  const { products, setProducts, categories, addToast } = useBakery();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock' | 'featured'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const initialFormState: Partial<Product> = {
    name: '',
    frenchName: '',
    slug: '',
    category: categories[0]?.slug || 'bread',
    price: 4.50,
    description: '',
    shortDescription: '',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
    isAvailable: true,
    isFeatured: false,
    isSeasonal: false,
    isBestSeller: false,
    weightGrams: 450,
    prepTime: '24h cold fermentation',
    ingredients: ['Stoneground organic flour', 'Water', 'Sea salt', 'Wild levain starter'],
    allergens: ['Gluten (Wheat)'],
    dietaryTags: ['Vegetarian', 'Artisan Fermented'],
  };

  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);
  const [ingredientsText, setIngredientsText] = useState('');
  const [allergensText, setAllergensText] = useState('');

  const DIETARY_OPTIONS: DietaryTag[] = [
    'Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Organic', 'Artisan Fermented'
  ];

  const COMMON_ALLERGENS = [
    'Gluten (Wheat)', 'Dairy (Milk/Butter)', 'Eggs', 'Tree Nuts (Almonds/Hazelnuts/Pistachios)', 
    'Peanuts', 'Soy', 'Sesame Seeds', 'Lupin'
  ];

  const BAKERY_IMAGE_PRESETS = [
    { label: 'Sourdough Boule', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop' },
    { label: 'Croissant', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop' },
    { label: 'Baguette Tradition', url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=800&auto=format&fit=crop' },
    { label: 'Pain au Chocolat', url: 'https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=800&auto=format&fit=crop' },
    { label: 'Strawberry Tart', url: 'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=800&auto=format&fit=crop' },
    { label: 'Artisan Cake', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop' },
    { label: 'Assorted Macarons', url: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=800&auto=format&fit=crop' },
    { label: 'Brioche Loaf', url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=800&auto=format&fit=crop' },
  ];

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      ...initialFormState,
      category: categories[0]?.slug || 'bread',
    });
    setIngredientsText('Stoneground organic flour, Water, Sea salt, Wild levain starter');
    setAllergensText('Gluten (Wheat)');
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIngredientsText(product.ingredients ? product.ingredients.join(', ') : '');
    setAllergensText(product.allergens ? product.allergens.join(', ') : '');
    setIsModalOpen(true);
  };

  // Toggle quick stock
  const handleToggleStock = async (product: Product) => {
    const newStock = !product.isAvailable;
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: newStock }),
      });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isAvailable: newStock } : p));
      addToast(`${product.name} is now ${newStock ? 'available' : 'marked sold out'}`, 'info');
    } catch {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isAvailable: newStock } : p));
      addToast(`${product.name} updated locally`, 'info');
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (product: Product) => {
    const newFeatured = !product.isFeatured;
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: newFeatured }),
      });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isFeatured: newFeatured } : p));
      addToast(`${product.name} featured status updated`, 'success');
    } catch {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isFeatured: newFeatured } : p));
    }
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.name.trim()) {
      addToast('Product name is required', 'error');
      return;
    }

    const ingredients = ingredientsText.split(',').map(s => s.trim()).filter(Boolean);
    const allergens = allergensText.split(',').map(s => s.trim()).filter(Boolean);

    const payload: Product = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      name: formData.name.trim(),
      frenchName: formData.frenchName?.trim() || formData.name.trim(),
      slug: formData.slug?.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: (formData.category || 'bread') as ProductCategory,
      price: Number(formData.price) || 0,
      description: formData.description?.trim() || formData.shortDescription || '',
      shortDescription: formData.shortDescription?.trim() || formData.description?.slice(0, 80) || '',
      image: formData.image || initialFormState.image!,
      isAvailable: formData.isAvailable !== false,
      isFeatured: Boolean(formData.isFeatured),
      isSeasonal: Boolean(formData.isSeasonal),
      isBestSeller: Boolean(formData.isBestSeller),
      weightGrams: Number(formData.weightGrams) || 350,
      prepTime: formData.prepTime || 'Fresh morning bake',
      ingredients,
      allergens,
      dietary: (formData.dietaryTags || formData.dietary || []) as DietaryTag[],
      dietaryTags: (formData.dietaryTags || formData.dietary || []) as DietaryTag[],
      rating: editingProduct?.rating || 5.0,
      reviewCount: editingProduct?.reviewCount || 12,
    };

    try {
      if (editingProduct) {
        // Edit PUT
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? payload : p));
          addToast(`Updated ${payload.name}`, 'success');
        }
      } else {
        // Create POST
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setProducts(prev => [payload, ...prev]);
          addToast(`Created new product: ${payload.name}`, 'success');
        }
      }
    } catch {
      // Offline fallback
      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? payload : p));
      } else {
        setProducts(prev => [payload, ...prev]);
      }
      addToast(`Saved ${payload.name} (locally)`, 'success');
    }

    setIsModalOpen(false);
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        addToast('Product deleted from catalog', 'info');
      }
    } catch {
      setProducts(prev => prev.filter(p => p.id !== id));
      addToast('Product deleted locally', 'info');
    }
    setDeleteConfirmId(null);
  };

  // Filtered Products
  const filteredProducts = products.filter(product => {
    const matchSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.frenchName && product.frenchName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;

    let matchStock = true;
    if (stockFilter === 'in_stock') matchStock = product.isAvailable;
    if (stockFilter === 'out_of_stock') matchStock = !product.isAvailable;
    if (stockFilter === 'featured') matchStock = Boolean(product.isFeatured);

    return matchSearch && matchCategory && matchStock;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2C2420]">Product Catalog</h2>
          <p className="text-xs text-[#8C827A]">
            Manage items, recipes, pricing, morning availability, and dietary tags
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#2C2420] hover:bg-[#3D332D] text-[#FAF7F2] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EBE3D7] shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A39990]" />
          <input
            type="text"
            placeholder="Search by name, French title, or ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] focus:bg-white rounded-xl pl-10 pr-4 py-2 text-xs text-[#2C2420] outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A39990] hover:text-[#2C2420]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E0D8CE] rounded-xl px-3 py-2 text-xs text-[#2C2420] font-medium outline-none cursor-pointer"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>
                {c.name} ({products.filter(p => p.category === c.slug).length})
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="bg-[#FAF8F5] border border-[#E0D8CE] rounded-xl px-3 py-2 text-xs text-[#2C2420] font-medium outline-none cursor-pointer"
          >
            <option value="all">All Stock Status</option>
            <option value="in_stock">In Stock Only</option>
            <option value="out_of_stock">Sold Out Only</option>
            <option value="featured">Featured Only</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#EBE3D7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EBE3D7] bg-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider text-[#7A6E65]">
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EDE4] text-xs text-[#2C2420]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8C827A]">
                    No bakery products match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-[#FAF8F5] transition-colors">
                    {/* Item with Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover border border-[#EBE3D7] flex-shrink-0"
                        />
                        <div className="space-y-0.5">
                          <div className="font-bold text-[#2C2420] text-sm">{product.name}</div>
                          {product.frenchName && (
                            <div className="text-[11px] font-serif italic text-[#8C827A]">{product.frenchName}</div>
                          )}
                          <div className="text-[10px] text-[#A39990] line-clamp-1 max-w-xs">
                            {product.shortDescription || product.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-[#FAF6EE] text-[#C49258] text-[11px] font-bold capitalize">
                        {categories.find(c => c.slug === product.category)?.name || product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#2C2420]">
                      €{product.price.toFixed(2)}
                    </td>

                    {/* Available / Sold Out Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStock(product)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          product.isAvailable
                            ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                            : 'bg-[#FFF5F5] text-[#C53030] border border-[#FED7D7]'
                        }`}
                      >
                        {product.isAvailable ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{product.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(product)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          product.isFeatured 
                            ? 'bg-[#FFF8EE] text-[#D4AF37]' 
                            : 'text-[#D0C7BC] hover:text-[#A39990]'
                        }`}
                        title="Toggle Featured on Homepage"
                      >
                        <Star className={`w-4 h-4 ${product.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 rounded-lg bg-[#F5F2EB] hover:bg-[#EBE3D7] text-[#2C2420] transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(product.id)}
                          className="p-2 rounded-lg bg-[#FFF5F5] hover:bg-[#FED7D7] text-[#C53030] transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#EBE3D7] shadow-2xl max-w-2xl w-full my-8 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#EBE3D7] flex items-center justify-between bg-[#FAF8F5]">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2C2420]">
                  {editingProduct ? `Edit ${editingProduct.name}` : 'Add New Bakery Product'}
                </h3>
                <p className="text-xs text-[#8C827A]">
                  Configure item specifications, pricing, imagery, and dietary badges
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-[#8C827A] hover:text-[#2C2420] hover:bg-[#EBE3D7] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Row 1: Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                    Product Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Traditional Butter Croissant"
                    className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                    French Artisan Name
                  </label>
                  <input
                    type="text"
                    value={formData.frenchName || ''}
                    onChange={(e) => setFormData({ ...formData, frenchName: e.target.value })}
                    placeholder="e.g. Croissant Pur Beurre d'Isigny"
                    className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none font-serif italic"
                  />
                </div>
              </div>

              {/* Row 2: Category & Price & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category || 'bread'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                    Price (€) *
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                    Weight (Grams)
                  </label>
                  <input
                    type="number"
                    value={formData.weightGrams || 250}
                    onChange={(e) => setFormData({ ...formData, weightGrams: parseInt(e.target.value) || 250 })}
                    className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Descriptions */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                    Short Menu Teaser (Shown in cards)
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription || ''}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="e.g. Crisp layered crust with open honeycomb crumb, crafted with 84% Normandy churned butter."
                    className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                    Full Artisan Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Full product story, pairing notes, and fermentation characteristics..."
                    className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Image & Presets */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047]">
                  Product Image URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none"
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover border border-[#EBE3D7] flex-shrink-0"
                    />
                  )}
                </div>

                {/* Quick Presets */}
                <div className="pt-1">
                  <span className="text-[10px] text-[#8C827A] font-semibold block mb-1">Curated Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {BAKERY_IMAGE_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: p.url })}
                        className="text-[10px] bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#EBE3D7] text-[#5A5047] px-2 py-1 rounded-lg cursor-pointer transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 5: Dietary Tags */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047]">
                  Dietary &amp; Fermentation Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map(tag => {
                    const isSelected = (formData.dietaryTags || []).includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          const current = formData.dietaryTags || [];
                          const updated = isSelected 
                            ? current.filter(t => t !== tag) 
                            : [...current, tag];
                          setFormData({ ...formData, dietaryTags: updated });
                        }}
                        className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2C2420] text-[#FAF7F2] border-[#2C2420]'
                            : 'bg-[#FAF8F5] text-[#5A5047] border-[#E0D8CE] hover:border-[#C49258]'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 6: Ingredients & Allergens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                    Ingredients (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={ingredientsText}
                    onChange={(e) => setIngredientsText(e.target.value)}
                    placeholder="Flour, Butter, Sugar, Yeast..."
                    className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                    Allergens (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={allergensText}
                    onChange={(e) => setAllergensText(e.target.value)}
                    placeholder="Gluten, Milk, Eggs, Nuts..."
                    className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none"
                  />
                </div>
              </div>

              {/* Row 7: Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 bg-[#FAF8F5] p-3 rounded-xl border border-[#E0D8CE] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable !== false}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C49258] focus:ring-0"
                  />
                  <span className="text-xs font-bold text-[#2C2420]">In Stock</span>
                </label>

                <label className="flex items-center gap-2 bg-[#FAF8F5] p-3 rounded-xl border border-[#E0D8CE] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isFeatured)}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C49258] focus:ring-0"
                  />
                  <span className="text-xs font-bold text-[#2C2420]">Featured</span>
                </label>

                <label className="flex items-center gap-2 bg-[#FAF8F5] p-3 rounded-xl border border-[#E0D8CE] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isSeasonal)}
                    onChange={(e) => setFormData({ ...formData, isSeasonal: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C49258] focus:ring-0"
                  />
                  <span className="text-xs font-bold text-[#2C2420]">Seasonal</span>
                </label>

                <label className="flex items-center gap-2 bg-[#FAF8F5] p-3 rounded-xl border border-[#E0D8CE] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isBestSeller)}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C49258] focus:ring-0"
                  />
                  <span className="text-xs font-bold text-[#2C2420]">Best Seller</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#EBE3D7]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E0D8CE] text-xs font-bold uppercase tracking-wider text-[#5A5047] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2C2420] hover:bg-[#3D332D] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EBE3D7] shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5F5] text-[#C53030] flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-serif text-lg font-bold text-[#2C2420]">Delete Product?</h4>
              <p className="text-xs text-[#8C827A]">
                This will permanently remove the product from your active menu and storefront.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#E0D8CE] text-xs font-bold uppercase text-[#5A5047] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-[#C53030] hover:bg-[#9B2C2C] text-white text-xs font-bold uppercase"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
