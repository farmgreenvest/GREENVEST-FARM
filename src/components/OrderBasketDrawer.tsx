import React, { useState } from 'react';
import { CartItem, Order } from '../types/index.ts';
import { GreenvestDB } from '../lib/supabaseClient.ts';
import { CROP_HARVEST_IMAGE } from '../data/initialData.ts';
import { safeImageSrc } from '../utils/safeImage.ts';
import { X, Trash2, Plus, Minus, Send, ShoppingBag } from 'lucide-react';

interface OrderBasketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderCompleted: (order: Order, prefilledWhatsAppText: string) => void;
  onBrowseProducts: () => void;
}

export const OrderBasketDrawer: React.FC<OrderBasketDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCompleted,
  onBrowseProducts,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Calculate order subtotal and items
  let totalAmount = 0;
  let hasPriceOnRequest = false;

  cart.forEach((item) => {
    if (item.product.price !== null) {
      totalAmount += item.product.price * item.quantity;
    } else {
      hasPriceOnRequest = true;
    }
  });

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMsg('Your order basket is currently empty.');
      return;
    }
    if (!fullName || !phone || !deliveryAddress) {
      setErrorMsg('Please complete your name, phone number, and delivery address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // 1. Save order to Supabase / persistent DB
      // 2. Generate unique sequential order number
      // 3. Calculate order total from current stored prices
      const createdOrder = GreenvestDB.createOrder({
        customerName: fullName,
        phone,
        email: email || 'N/A',
        deliveryAddress,
        notes,
        cartItems: cart.map((c) => ({
          productId: c.product.id,
          quantity: c.quantity,
        })),
      });

      // Format prefilled WhatsApp message as strictly requested:
      const productLines = createdOrder.items
        .map((i) => `• ${i.productName}`)
        .join('\n');
      const quantityLines = createdOrder.items
        .map((i) => `• ${i.quantity} x ${i.unit}`)
        .join('\n');

      const formattedTotal =
        createdOrder.totalAmount > 0
          ? `₦${createdOrder.totalAmount.toLocaleString()}${
              createdOrder.hasPriceOnRequest ? ' (plus items with Price on Request)' : ''
            }`
          : 'Price on Request / Commercial Quote';

      const prefilledWhatsAppText = `Hello Greenvest Farms,

I would like to place the following order:

Order Number: ${createdOrder.orderNumber}
Customer Name: ${createdOrder.customerName}
Phone: ${createdOrder.phone}
Products:
${productLines}
Quantities:
${quantityLines}
Total Amount: ${formattedTotal}
Delivery Address: ${createdOrder.deliveryAddress}

Please confirm my order and provide the next steps.`;

      onClearCart();
      onOrderCompleted(createdOrder, prefilledWhatsAppText);
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      console.error('Order submission failure:', err);
      setErrorMsg('An error occurred while creating your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <aside
          aria-label="Order Basket"
          className="w-screen max-w-xl bg-white shadow-2xl flex flex-col border-l border-neutral-200"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-[#075E2B] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-[#F4B400]" />
              <div>
                <h2 className="font-serif-display text-xl font-bold tracking-tight">
                  Your Farm Order Basket
                </h2>
                <p className="text-xs text-[#F4B400] font-medium">
                  {cart.length} product{cart.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close Order Basket"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F7F3E8] mx-auto flex items-center justify-center text-[#2E8B57]">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-serif-display text-xl font-bold text-[#263238]">
                  Your Basket is Empty
                </h3>
                <p className="text-sm text-neutral-500 max-w-xs mx-auto">
                  Select fresh produce, commercial grains, aquaculture, eggs or agro-processed products to request an order.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onBrowseProducts();
                  }}
                  className="px-6 py-2.5 rounded-lg bg-[#075E2B] text-white text-xs font-semibold hover:bg-[#064e24] transition-colors cursor-pointer"
                >
                  Browse Product Catalogue
                </button>
              </div>
            ) : (
              <>
                {/* Product List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    <span>Products Selected</span>
                    <button
                      onClick={onClearCart}
                      className="text-red-600 hover:text-red-700 normal-case font-normal text-xs"
                    >
                      Clear All
                    </button>
                  </div>

                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3.5 rounded-xl border border-neutral-200 bg-[#FDFCF7] flex items-center gap-4"
                    >
                      <img
                        src={safeImageSrc(item.product.image, CROP_HARVEST_IMAGE)!}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-lg object-cover bg-neutral-200 shrink-0 border border-neutral-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#263238] truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-neutral-500">
                          {item.product.category} · {item.product.unit}
                        </p>
                        <p className="text-xs font-bold text-[#075E2B] mt-1">
                          {item.product.price !== null
                            ? `₦${(item.product.price * item.quantity).toLocaleString()}`
                            : 'Price on Request'}
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg p-1">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded disabled:opacity-40"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold tabular-nums text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Subtotal Summary */}
                <div className="p-4 rounded-xl bg-[#F7F3E8] border border-[#2E8B57]/20 space-y-2">
                  <div className="flex justify-between text-xs text-neutral-600">
                    <span>Item Count:</span>
                    <span className="font-semibold">{cart.reduce((a, b) => a + b.quantity, 0)} units</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-[#2E8B57]/10">
                    <span className="text-sm font-bold text-[#263238]">Estimated Total:</span>
                    <span className="text-base font-extrabold text-[#075E2B] tabular-nums">
                      ₦{totalAmount.toLocaleString()}
                      {hasPriceOnRequest && (
                        <span className="block text-[10px] text-neutral-600 font-normal text-right">
                          + Custom quotes for wholesale items
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Customer Checkout Form */}
                <form id="checkout-order-form" onSubmit={handleSubmitOrder} className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#075E2B] border-b border-neutral-200 pb-1">
                    Delivery & Customer Details
                  </h3>

                  {errorMsg && (
                    <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Babatunde Lawal"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0803 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. babatunde@agrobusiness.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Delivery Address & State *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Street address, warehouse location, city, and state"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Additional Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Need sortex certification or delivery by Tuesday morning"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#075E2B] focus:outline-none"
                    />
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Footer Actions */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-100 transition-colors"
              >
                Continue Browsing
              </button>
              <button
                type="submit"
                form="checkout-order-form"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-lg bg-[#075E2B] hover:bg-[#064e24] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#F4B400]" />
                <span>
                  {isSubmitting ? 'Submitting Order...' : 'Submit Order & Open WhatsApp'}
                </span>
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
