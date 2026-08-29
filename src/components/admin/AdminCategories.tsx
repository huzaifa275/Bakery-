import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Layers, 
  Sparkles, 
  AlertCircle,
  Package,
  MoveUp,
  MoveDown
} from 'lucide-react';
import { CategoryItem } from '../../types';

export const AdminCategories: React.FC = () => {
  const { categories, setCategories, products, addToast } = useBakery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const initialFormState: Partial<CategoryItem> = {
    name: '',
    slug: '',
    french: '',
    description: '',
    displayOrder: categories.length + 1,
    isEnabled: true,
    icon: 'Sparkles',
  };

  const [formData, setFormData] = useState<Partial<CategoryItem>>(initialFormState);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      ...initialFormState,
      displayOrder: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({ ...cat });
    setIsModalOpen(true);
  };

  const handleToggleEnable = async (cat: CategoryItem) => {
    const updatedStatus = !cat.isEnabled;
    try {
      await fetch(`/api/categories/${cat.id}/toggle`, {
        method: 'PATCH',
      });
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, isEnabled: updatedStatus } : c));
      addToast(`Category ${cat.name} is now ${updatedStatus ? 'visible' : 'hidden'}`, 'info');
    } catch {
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, isEnabled: updatedStatus } : c));
      addToast(`Category status updated locally`, 'info');
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.name.trim()) {
      addToast('Category name is required', 'error');
      return;
    }

    const slug = formData.slug?.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload: CategoryItem = {
      id: editingCategory?.id || slug,
      name: formData.name.trim(),
      slug,
      french: formData.french?.trim() || formData.name.trim(),
      description: formData.description?.trim() || '',
      displayOrder: Number(formData.displayOrder) || categories.length + 1,
      isEnabled: formData.isEnabled !== false,
      icon: formData.icon || 'Sparkles',
    };

    try {
      if (editingCategory) {
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setCategories(prev => prev.map(c => c.id === editingCategory.id ? payload : c));
          addToast(`Updated category: ${payload.name}`, 'success');
        }
      } else {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setCategories(prev => [...prev, payload]);
          addToast(`Created category: ${payload.name}`, 'success');
        }
      }
    } catch {
      if (editingCategory) {
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? payload : c));
      } else {
        setCategories(prev => [...prev, payload]);
      }
      addToast(`Saved ${payload.name} (locally)`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
        addToast('Category deleted', 'info');
      }
    } catch {
      setCategories(prev => prev.filter(c => c.id !== id));
      addToast('Category deleted locally', 'info');
    }
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2C2420]">Menu Categories</h2>
          <p className="text-xs text-[#8C827A]">
            Configure and organize product groups displayed in the storefront and filter navigation
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#2C2420] hover:bg-[#3D332D] text-[#FAF7F2] px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-[#EBE3D7] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#EBE3D7] bg-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider text-[#7A6E65]">
              <th className="py-3.5 px-4">Order</th>
              <th className="py-3.5 px-4">Category Name</th>
              <th className="py-3.5 px-4">French Title</th>
              <th className="py-3.5 px-4">Slug ID</th>
              <th className="py-3.5 px-4 text-center">Items Count</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2EDE4] text-xs text-[#2C2420]">
            {categories.map((cat, idx) => {
              const productCount = products.filter(p => p.category === cat.slug).length;

              return (
                <tr key={cat.id || cat.slug} className="hover:bg-[#FAF8F5] transition-colors">
                  {/* Order */}
                  <td className="py-3.5 px-4 font-mono font-bold text-[#8C827A]">
                    #{cat.displayOrder || idx + 1}
                  </td>

                  {/* Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5 font-bold text-sm text-[#2C2420]">
                      <Layers className="w-4 h-4 text-[#C49258]" />
                      <span>{cat.name}</span>
                    </div>
                  </td>

                  {/* French */}
                  <td className="py-3.5 px-4 font-serif italic text-xs text-[#8C827A]">
                    {cat.french || '—'}
                  </td>

                  {/* Slug */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#A39990]">
                    {cat.slug}
                  </td>

                  {/* Count */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FAF6EE] text-[#C49258] font-bold text-[11px]">
                      {productCount} item(s)
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleEnable(cat)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        cat.isEnabled
                          ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                          : 'bg-[#FFF5F5] text-[#C53030] border border-[#FED7D7]'
                      }`}
                    >
                      {cat.isEnabled ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{cat.isEnabled ? 'Enabled' : 'Hidden'}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-2 rounded-lg bg-[#F5F2EB] hover:bg-[#EBE3D7] text-[#2C2420] transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(cat.id)}
                        className="p-2 rounded-lg bg-[#FFF5F5] hover:bg-[#FED7D7] text-[#C53030] transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EBE3D7] shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#EBE3D7] pb-4">
              <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#8C827A] hover:text-[#2C2420]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Savory Quiches & Lunches"
                  className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                  French Title
                </label>
                <input
                  type="text"
                  value={formData.french || ''}
                  onChange={(e) => setFormData({ ...formData, french: e.target.value })}
                  placeholder="e.g. Quiches & Délices Salés"
                  className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none font-serif italic"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                    Slug ID
                  </label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. quiches"
                    className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A5047] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder || 1}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#FAF8F5] border border-[#E0D8CE] focus:border-[#C49258] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2420] outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 bg-[#FAF8F5] p-3 rounded-xl border border-[#E0D8CE] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isEnabled !== false}
                  onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-[#C49258]"
                />
                <span className="text-xs font-bold text-[#2C2420]">Enable Category in Customer Menu</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EBE3D7]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E0D8CE] text-xs font-bold uppercase text-[#5A5047] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2C2420] hover:bg-[#3D332D] text-[#FAF7F2] text-xs font-bold uppercase shadow-sm"
                >
                  {editingCategory ? 'Update' : 'Create'}
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
              <h4 className="font-serif text-lg font-bold text-[#2C2420]">Delete Category?</h4>
              <p className="text-xs text-[#8C827A]">
                This will remove the category from the menu navigation tabs. Existing products will remain in the catalog.
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
                onClick={() => handleDeleteCategory(deleteConfirmId)}
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
