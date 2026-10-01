import React, { useState } from 'react';
import { Product, ProductCategory, SiteSettings } from '../types/index.ts';
import { CROP_HARVEST_IMAGE } from '../data/initialData.ts';
import { safeImageSrc } from '../utils/safeImage.ts';
import {
  Search,
  ShoppingCart,
  MessageCircle,
  Plus,
  Minus,
  Check,
  ShoppingBag,
} from 'lucide-react';

interface ProductsPageProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onOpenCart: () => void;
  cartCount: number;
  settings?: SiteSettings;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  onAddToCart,
  onOpenCart,
  cartCount,
  settings,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});
  const [recentlyAdded, setRecentlyAdded] = useState<{ [productId: string]: boolean }>({});

  const categories: ProductCategory[] = [
    'All',
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

  const getQty = (id: string) => quantities[id] || 1;

  const setQty = (id: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, value),
    }));
  };

  const handleAddWithQty = (product: Product) => {
    const qty = getQty(product.id);
    onAddToCart(product, qty);
    setRecentlyAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setRecentlyAdded((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      p.category === selectedCategory ||
      (selectedCategory === 'Grains' && (p.category === 'Grains & Cereals' || p.category === 'Maize')) ||
      (selectedCategory === 'Vegetables' && p.category === 'Horticulture & Vegetables') ||
      (selectedCategory === 'Livestock' && p.category === 'Aquaculture & Livestock');
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 sm:space-y-16 py-8">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#075E2B]/10 text-[#075E2B] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#075E2B]" />
              <span>{settings?.productsEyebrow || 'Direct Farm Supply Catalogue'}</span>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-6xl font-bold text-[#075E2B]">
              {settings?.productsHeadline || 'Agricultural Products & Commodities'}
            </h1>

            <p className="text-base sm:text-lg text-neutral-700 leading-relaxed">
              {settings?.productsSubtext ||
                'Wholesale grains, fresh greenhouse produce, premium table fish, layer eggs, and sortex-milled food products. Sourced directly from our Nigerian commercial estates for distributors, FMCGs, and retail markets.'}
            </p>
          </div>

          {/* Quick Basket Summary Button */}
          <button
            onClick={onOpenCart}
            className="self-start lg:self-auto px-5 py-3 rounded-xl bg-[#075E2B] text-white font-bold text-xs flex items-center gap-2.5 shadow-lg hover:bg-[#064e24] transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#F4B400]" />
            <span>Open Order Basket</span>
            <span className="bg-[#F4B400] text-[#075E2B] rounded-full w-5 h-5 flex items-center justify-center text-xs font-extrabold tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mt-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search maize, rice, catfish, eggs, cassava flour..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#075E2B]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-[#F7F3E8] rounded-2xl border border-neutral-200 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#075E2B] text-white shadow-sm'
                    : 'text-neutral-700 hover:bg-neutral-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 space-y-3">
            <p className="text-base font-semibold text-neutral-700">
              No products found matching your filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs text-[#075E2B] font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const qty = getQty(product.id);
              const isAdded = recentlyAdded[product.id];
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Image & Badges */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                    <img
                      src={safeImageSrc(product.image, CROP_HARVEST_IMAGE)!}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-[#075E2B]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {product.category}
                    </span>
                    <span
                      className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${
                        product.available
                          ? 'bg-[#F4B400] text-[#075E2B]'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {product.available ? 'In Stock' : 'Harvesting Soon'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif-display text-lg font-bold text-[#263238] line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 space-y-3">
                      {/* Price & Unit */}
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] text-neutral-500 font-medium">
                          Packaging / Unit:
                        </span>
                        <span className="text-xs font-semibold text-neutral-800">
                          {product.unit}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] text-neutral-500 font-medium">
                          Price:
                        </span>
                        <span className="text-base font-extrabold text-[#075E2B] tabular-nums">
                          {product.price !== null
                            ? `₦${product.price.toLocaleString()}`
                            : 'Price on Request'}
                        </span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between bg-neutral-50 rounded-lg p-1 border border-neutral-200">
                        <span className="text-[11px] font-semibold text-neutral-600 pl-2">
                          Qty:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setQty(product.id, qty - 1)}
                            disabled={qty <= 1}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-neutral-200 text-neutral-700 disabled:opacity-30 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold tabular-nums text-neutral-800">
                            {qty}
                          </span>
                          <button
                            onClick={() => setQty(product.id, qty + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-neutral-200 text-neutral-700 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => handleAddWithQty(product)}
                          disabled={!product.available}
                          className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-700 text-white'
                              : 'bg-[#075E2B] hover:bg-[#064e24] text-white active:scale-[0.98]'
                          } disabled:opacity-50`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Added to Basket!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 text-[#F4B400]" />
                              <span>Add to Order Basket</span>
                            </>
                          )}
                        </button>

                        <a
                          href={`https://wa.me/2348139487363?text=Hello%20Greenvest%20Farms,%20I%20would%20like%20to%20order%20the%20following%20product:%0A- Product: ${encodeURIComponent(
                            product.name
                          )}%0A- Quantity: ${qty}%20x%20${encodeURIComponent(
                            product.unit
                          )}%0APlease%20confirm%20pricing%20and%20delivery%20availability.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                          <span>Order via WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
