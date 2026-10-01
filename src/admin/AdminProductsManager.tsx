import React, { useState } from 'react';
import { Product, ProductCategory } from '../types/index.ts';
import { GreenvestDB } from '../lib/supabaseClient.ts';
import { Plus, Edit2, Trash2, Search, X, Check, ShoppingCart, Star } from 'lucide-react';
import { CROP_HARVEST_IMAGE, AGRONOMISTS_IMAGE, AGRO_PROCESSING_IMAGE } from '../data/initialData.ts';
import { ImageUploadField } from '../components/ImageUploadField.tsx';
import { safeImageSrc } from '../utils/safeImage.ts';

interface AdminProductsManagerProps {
  products: Product[];
  onProductsUpdated: (products: Product[]) => void;
}

export const AdminProductsManager: React.FC<AdminProductsManagerProps> = ({
  products,
  onProductsUpdated,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Grains');
  const [description, setDescription] = useState('');
  const [isPriceOnRequest, setIsPriceOnRequest] = useState(false);
  const [price, setPrice] = useState<number | ''>(35000);
  const [unit, setUnit] = useState('50kg Bag');
  const [stock, setStock] = useState<number | ''>(500);
  const [image, setImage] = useState(CROP_HARVEST_IMAGE);
  const [featured, setFeatured] = useState(false);
  const [available, setAvailable] = useState(true);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const categories: ProductCategory[] = [
    'Grains & Cereals',
    'Oilseeds & Legumes',
    'Horticulture & Vegetables',
    'Aquaculture & Livestock',
    'Fresh Produce',
    'Vegetables',
    'Maize',
    'Grains',
    'Fish',
    'Eggs',
    'Poultry',
    'Livestock',
    'Processed Agricultural Products',
  ];

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setCategory('Grains');
    setDescription('');
    setIsPriceOnRequest(false);
    setPrice(35000);
    setUnit('50kg Bag');
    setStock(500);
    setImage(CROP_HARVEST_IMAGE);
    setFeatured(false);
    setAvailable(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSlug(p.slug);
    setCategory(p.category);
    setDescription(p.description);
    setIsPriceOnRequest(p.price === null);
    setPrice(p.price !== null ? p.price : '');
    setUnit(p.unit);
    setStock(p.stock !== undefined && p.stock !== null ? p.stock : 100);
    setImage(p.image || CROP_HARVEST_IMAGE);
    setFeatured(p.featured);
    setAvailable(p.available);
    setModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedSlug = (
      slug.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') ||
      'prod-' + Date.now()
    );

    const defaultDesc = 'Premium commercial harvest produce directly from Greenvest commercial estates.';

    const prod: Product = {
      id: editingProduct ? editingProduct.id : 'prod-' + Date.now(),
      name: name.trim(),
      slug: generatedSlug,
      category: category || 'Grains',
      description: description.trim() || defaultDesc,
      price: isPriceOnRequest || price === '' ? null : Number(price),
      currency: 'NGN',
      unit: unit.trim() || '50kg Bag',
      stock: stock === '' ? 100 : Number(stock),
      image: image && image.trim() ? image.trim() : CROP_HARVEST_IMAGE,
      featured,
      available,
      minOrderQty: 1,
    };

    GreenvestDB.saveProduct(prod);
    onProductsUpdated(GreenvestDB.getProducts());
    setSuccessNotice(
      editingProduct
        ? `Product "${prod.name}" updated successfully.`
        : `Product "${prod.name}" successfully added to catalogue!`
    );
    setTimeout(() => setSuccessNotice(null), 4000);
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this product from catalog?')) {
      GreenvestDB.deleteProduct(id);
      onProductsUpdated(GreenvestDB.getProducts());
    }
  };

  const toggleAvailability = (p: Product) => {
    const updated = { ...p, available: !p.available };
    GreenvestDB.saveProduct(updated);
    onProductsUpdated(GreenvestDB.getProducts());
  };

  const toggleFeatured = (p: Product) => {
    const updated = { ...p, featured: !p.featured };
    GreenvestDB.saveProduct(updated);
    onProductsUpdated(GreenvestDB.getProducts());
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Success Notification Banner */}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button
            onClick={() => setSuccessNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#075E2B]">
            Commercial Inventory
          </span>
          <h2 className="font-serif-display text-3xl font-bold text-[#263238]">
            Product Catalogue & Stock Manager
          </h2>
          <p className="text-xs text-neutral-500">
            Control agricultural items, packaging units, pricing, availability toggles, and featured homepage spots.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-[#075E2B] hover:bg-[#064e24] text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#F4B400]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#075E2B]"
          />
        </div>
        <span className="text-xs text-neutral-500 font-semibold">
          {filtered.length} Items Configured
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F3E8] border-b border-neutral-200 text-neutral-600 uppercase font-semibold text-[11px]">
              <tr>
                <th className="p-4">Commodity</th>
                <th className="p-4">Category</th>
                <th className="p-4">Unit</th>
                <th className="p-4">Price (NGN)</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-neutral-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={safeImageSrc(prod.image, CROP_HARVEST_IMAGE)!}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-neutral-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-[#263238] block">{prod.name}</span>
                        <span className="text-[11px] text-neutral-400 block font-mono">
                          /{prod.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-[#075E2B]">{prod.category}</td>
                  <td className="p-4 text-neutral-600">{prod.unit}</td>
                  <td className="p-4 font-extrabold text-[#075E2B] tabular-nums">
                    {prod.price !== null ? `₦${prod.price.toLocaleString()}` : 'Price on Request'}
                  </td>
                  <td className="p-4 tabular-nums text-neutral-700">{prod.stock}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleFeatured(prod)}
                      className={`p-1 rounded cursor-pointer ${
                        prod.featured ? 'text-amber-500' : 'text-neutral-300 hover:text-neutral-500'
                      }`}
                      title={prod.featured ? 'Featured on homepage' : 'Mark as featured'}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleAvailability(prod)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                        prod.available
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {prod.available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(prod)}
                      className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-200 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-serif-display text-2xl font-bold text-[#075E2B]">
                {editingProduct ? 'Edit Agricultural Product' : 'Add New Agricultural Product'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commercial Hybrid Yellow Maize"
                  value={name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setName(newName);
                    const oldAutoSlug = (editingProduct?.name || '')
                      .toLowerCase()
                      .replace(/[^\w ]+/g, '')
                      .replace(/ +/g, '-');
                    const newAutoSlug = newName
                      .toLowerCase()
                      .replace(/[^\w ]+/g, '')
                      .replace(/ +/g, '-');
                    if (!editingProduct || !slug || slug === oldAutoSlug) {
                      setSlug(newAutoSlug);
                    }
                  }}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  URL Slug (Auto-generated if left blank)
                </label>
                <input
                  type="text"
                  placeholder="e.g. hybrid-yellow-maize"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl font-mono text-neutral-600 focus:ring-2 focus:ring-[#075E2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white focus:ring-2 focus:ring-[#075E2B]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Packaging / Unit *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50kg Bag, Crate, Metric Tonne"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Premium commercial harvest produce directly from Greenvest commercial estates."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                />
                <span className="text-[10px] text-neutral-400">Optional. Default commercial description will be applied if left empty.</span>
              </div>

              {/* Price Row */}
              <div className="p-4 rounded-xl bg-[#F7F3E8] border border-[#2E8B57]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-800">
                    Pricing Configuration
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-neutral-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPriceOnRequest}
                      onChange={(e) => setIsPriceOnRequest(e.target.checked)}
                      className="rounded text-[#075E2B]"
                    />
                    <span>Price on Request (Bulk/Export)</span>
                  </label>
                </div>

                {!isPriceOnRequest && (
                  <div>
                    <label className="block text-xs text-neutral-600 mb-1">Price in Nigerian Naira (₦)</label>
                    <input
                      type="number"
                      required={!isPriceOnRequest}
                      min={0}
                      placeholder="e.g. 35000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl bg-white focus:ring-2 focus:ring-[#075E2B]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Available Stock Qty</label>
                <input
                  type="number"
                  min={0}
                  placeholder="500"
                  value={stock}
                  onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#075E2B]"
                />
              </div>

              {/* Product Image Upload with Device, Media & Presets support */}
              <ImageUploadField
                label="Product Photograph"
                value={image}
                onChange={setImage}
                helperText="Upload image from computer, pick from media library, or paste external URL."
                category="Products"
                recommendedAspect="1:1 Square or 4:3"
              />

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-[#075E2B]"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="rounded text-[#075E2B]"
                  />
                  <span>Mark In Stock & Orderable</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-between gap-3 border-t border-neutral-100">
                {editingProduct ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Permanently delete "${editingProduct.name}" from catalog?`)) {
                        GreenvestDB.deleteProduct(editingProduct.id);
                        onProductsUpdated(GreenvestDB.getProducts());
                        setSuccessNotice(`Product "${editingProduct.name}" deleted from catalog.`);
                        setTimeout(() => setSuccessNotice(null), 3000);
                        setModalOpen(false);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Delete Product</span>
                  </button>
                ) : (
                  <div />
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-[#075E2B] text-white font-bold text-xs hover:bg-[#064e24] shadow-md cursor-pointer transition-all"
                  >
                    {editingProduct ? 'Update Product' : 'Save Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
