import React, { useState } from 'react';
import { Order, OrderStatus } from '../types/index.ts';
import { GreenvestDB } from '../lib/supabaseClient.ts';
import {
  Search,
  MessageCircle,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Trash2,
} from 'lucide-react';

interface AdminOrdersManagerProps {
  orders: Order[];
  onOrdersUpdated: (orders: Order[]) => void;
}

export const AdminOrdersManager: React.FC<AdminOrdersManagerProps> = ({
  orders,
  onOrdersUpdated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeOrderModal, setActiveOrderModal] = useState<Order | null>(null);

  const statuses: (OrderStatus | 'All')[] = [
    'All',
    'New',
    'Contacted',
    'Confirmed',
    'Processing',
    'Ready',
    'Delivered',
    'Cancelled',
  ];

  const handleDeleteOrder = (orderId: string, orderNumber: string) => {
    if (confirm(`Permanently delete order ${orderNumber}? This action cannot be undone.`)) {
      GreenvestDB.deleteOrder(orderId);
      const updatedList = GreenvestDB.getOrders();
      onOrdersUpdated(updatedList);
      if (activeOrderModal && activeOrderModal.id === orderId) {
        setActiveOrderModal(null);
      }
    }
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    GreenvestDB.updateOrderStatus(orderId, newStatus);
    const updatedList = GreenvestDB.getOrders();
    onOrdersUpdated(updatedList);
    if (activeOrderModal && activeOrderModal.id === orderId) {
      setActiveOrderModal({ ...activeOrderModal, status: newStatus });
    }
  };

  const handleOpenWhatsAppCustomer = (order: Order) => {
    const cleanPhone = order.phone.replace(/[^\d+]/g, '');
    const message = `Hello ${order.customerName},

This is the Greenvest Farms Trade Desk following up regarding your order:
Order Number: ${order.orderNumber}
Total Amount: ₦${order.totalAmount.toLocaleString()}
Delivery Address: ${order.deliveryAddress}

Current Order Status: ${order.status}

Please let us know if you have any questions or require updated dispatch timing.`;

    const url = `https://wa.me/${cleanPhone.startsWith('0') ? '234' + cleanPhone.substring(1) : cleanPhone}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = selectedStatus === 'All' || o.status === selectedStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.items.some((i) => i.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#075E2B]">
            Commercial Trade Desk
          </span>
          <h2 className="font-serif-display text-3xl font-bold text-[#263238]">
            Order Management & Dispatches
          </h2>
          <p className="text-xs text-neutral-500">
            Track customer requests, verify product volumes, update fulfillment statuses, and initiate immediate WhatsApp communication.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-neutral-500 block">Total Active Orders</span>
          <span className="font-serif-display text-2xl font-bold text-[#075E2B] tabular-nums">
            {orders.length} Records
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search order #, customer, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#075E2B]"
          />
        </div>

        <div className="flex flex-wrap gap-1 p-1 bg-neutral-100 rounded-xl overflow-x-auto w-full sm:w-auto">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedStatus === st ? 'bg-white text-[#075E2B] shadow-sm' : 'text-neutral-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <Package className="w-8 h-8 text-neutral-400 mx-auto" />
            <p className="text-sm font-semibold text-neutral-700">No orders found.</p>
            <p className="text-xs text-neutral-500">New customer basket submissions will populate here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F3E8] border-b border-neutral-200 text-neutral-600 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="p-4">Order Reference</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items / Commodities</th>
                  <th className="p-4">Total (NGN)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50">
                    <td className="p-4">
                      <span className="font-mono font-bold text-[#075E2B] block">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        {ord.items.length} line item{ord.items.length !== 1 ? 's' : ''}
                      </span>
                    </td>

                    <td className="p-4 max-w-xs">
                      <span className="font-bold text-[#263238] block">{ord.customerName}</span>
                      <span className="text-[11px] text-neutral-500 block">{ord.phone}</span>
                      <span className="text-[11px] text-neutral-400 block truncate" title={ord.deliveryAddress}>
                        {ord.deliveryAddress}
                      </span>
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="space-y-0.5 text-[11px] text-neutral-700">
                        {ord.items.slice(0, 2).map((it, idx) => (
                          <div key={idx} className="truncate">
                            • {it.quantity} x {it.productName} ({it.unit})
                          </div>
                        ))}
                        {ord.items.length > 2 && (
                          <span className="text-[10px] text-neutral-400 italic">
                            +{ord.items.length - 2} more...
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-extrabold text-[#075E2B] tabular-nums">
                      ₦{ord.totalAmount.toLocaleString()}
                      {ord.hasPriceOnRequest && (
                        <span className="block text-[10px] text-neutral-400 font-normal">
                          + Custom quotes
                        </span>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-bold uppercase rounded-lg px-2.5 py-1 border cursor-pointer ${
                          ord.status === 'New'
                            ? 'bg-blue-50 border-blue-200 text-blue-800'
                            : ord.status === 'Confirmed' || ord.status === 'Delivered'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : ord.status === 'Processing' || ord.status === 'Ready'
                            ? 'bg-amber-50 border-amber-200 text-amber-800'
                            : ord.status === 'Cancelled'
                            ? 'bg-rose-50 border-rose-200 text-rose-800'
                            : 'bg-neutral-100 border-neutral-300 text-neutral-700'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Ready">Ready</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4 text-neutral-500 whitespace-nowrap">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions: Open WhatsApp button, View Details, & Delete */}
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenWhatsAppCustomer(ord)}
                        className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        title="Open WhatsApp chat with prefilled customer details"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => setActiveOrderModal(ord)}
                        className="px-2.5 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold cursor-pointer"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleDeleteOrder(ord.id, ord.orderNumber)}
                        className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer inline-flex items-center justify-center transition-colors"
                        title="Delete this order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {activeOrderModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="text-[11px] font-bold text-[#075E2B] uppercase">Order Dossier</span>
                <h3 className="font-serif-display text-2xl font-bold text-[#263238]">
                  #{activeOrderModal.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setActiveOrderModal(null)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#F7F3E8] border border-[#2E8B57]/20 space-y-1.5">
                <p className="text-neutral-700">
                  <strong>Customer:</strong> {activeOrderModal.customerName}
                </p>
                <p className="text-neutral-700">
                  <strong>Phone Contact:</strong> {activeOrderModal.phone}
                </p>
                <p className="text-neutral-700">
                  <strong>Email:</strong> {activeOrderModal.email || 'N/A'}
                </p>
                <p className="text-neutral-700">
                  <strong>Delivery Address:</strong> {activeOrderModal.deliveryAddress}
                </p>
                {activeOrderModal.notes && (
                  <p className="text-neutral-700">
                    <strong>Special Instructions:</strong> {activeOrderModal.notes}
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[11px] mb-2">
                  Line Items Manifest
                </h4>
                <div className="border border-neutral-200 rounded-xl divide-y divide-neutral-100 overflow-hidden">
                  {activeOrderModal.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between bg-neutral-50/50">
                      <div>
                        <span className="font-bold text-neutral-800 block">{item.productName}</span>
                        <span className="text-[11px] text-neutral-500">
                          {item.quantity} x {item.unit}
                        </span>
                      </div>
                      <span className="font-bold text-[#075E2B]">
                        {item.subtotal !== null ? `₦${item.subtotal.toLocaleString()}` : 'Price on Request'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-neutral-100">
                <span className="text-sm font-bold text-neutral-800">Total Calculated Order:</span>
                <span className="text-lg font-extrabold text-[#075E2B] tabular-nums">
                  ₦{activeOrderModal.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between gap-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => handleDeleteOrder(activeOrderModal.id, activeOrderModal.orderNumber)}
                className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>Delete</span>
              </button>

              <div className="flex-1 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenWhatsAppCustomer(activeOrderModal)}
                  className="px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#20ba5a] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => setActiveOrderModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-50 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
