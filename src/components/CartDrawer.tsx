/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, CreditCard, Sparkles, Check, ChevronRight, AlertCircle, Award } from 'lucide-react';
import { CartItem, CRMPayload } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckoutSuccess: (payload: CRMPayload) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckoutSuccess
}: CartDrawerProps) {
  const [fulfillment, setFulfillment] = useState<'DINE_IN' | 'CURBSIDE'>('DINE_IN');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [completedOrderNum, setCompletedOrderNum] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Calculations
  const TAX_RATE = 0.085; // 8.5% Luxury Gastronomy Tax
  const CURBSIDE_FEE = 150; // ₹150 luxury packaging fee

  const subtotal = cartItems.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const fulfillmentSurcharge = fulfillment === 'CURBSIDE' ? CURBSIDE_FEE : 0.00;
  const total = subtotal + tax + fulfillmentSurcharge;

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!guestName.trim()) errors.name = 'Full name is required.';
    if (!guestEmail.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(guestEmail)) {
      errors.email = 'Please provide a valid email.';
    }
    if (!guestPhone.trim()) errors.phone = 'Phone number is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate luxury packaging & delivery confirmation delay
    setTimeout(() => {
      const orderNumber = `L-ORD-${Math.floor(Math.random() * 900000) + 100000}`;
      setCompletedOrderNum(orderNumber);

      const crmPayload: CRMPayload = {
        transactionType: 'ORDER',
        timestamp: new Date().toISOString(),
        payload: {
          guestDetails: {
            name: guestName,
            email: guestEmail,
            phone: guestPhone,
            notes: `Fulfillment: ${fulfillment}. Specially packaged by Place Bakehouse.`
          },
          orderItems: cartItems.map(item => ({
            id: item.menuItem.id,
            quantity: item.quantity,
            selections: Object.entries(item.selectedOptions).map(([key, val]) => `${key}: ${val}`)
          })),
          financials: {
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat(total.toFixed(2))
          }
        }
      };

      // Console logger as requested by CRM requirement
      console.log('Payload destined for Admin CRM:', crmPayload);

      setIsProcessing(false);
      setCheckoutComplete(true);
      onCheckoutSuccess(crmPayload);
    }, 2800);
  };

  const handleCloseAndReset = () => {
    onClose();
    // Reset state after transition finishes
    setTimeout(() => {
      setCheckoutComplete(false);
      setGuestName('');
      setGuestEmail('');
      setGuestPhone('');
      setFormErrors({});
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop dimmer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={checkoutComplete ? handleCloseAndReset : onClose}
            className="fixed inset-0 bg-[#1A1A1A] z-40 cursor-pointer"
          />

          {/* Persistent Slide-Over Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:max-w-md bg-[#FDFBF7] shadow-2xl z-50 flex flex-col justify-between"
          >
            {/* Background pattern overlay */}
            <div className="absolute inset-0 bg-luxury-pattern opacity-10 pointer-events-none z-0" />

            {/* Header */}
            <div className="p-6 border-b border-[#D5BDAF]/20 flex items-center justify-between bg-[#FDFBF7] relative z-10">
              <div className="flex items-center space-x-3">
                <ShoppingBag size={18} className="text-[#C5A880]" strokeWidth={1.5} />
                <div>
                  <h3 className="font-serif text-lg md:text-xl text-[#1A1A1A] font-light tracking-tight">
                    Gastronomy Selection
                  </h3>
                  <p className="font-sans text-[8px] tracking-widest uppercase text-[#1A1A1A]/40">
                    {cartItems.length} {cartItems.length === 1 ? 'artisan creation' : 'artisan creations'}
                  </p>
                </div>
              </div>

              <button
                onClick={checkoutComplete ? handleCloseAndReset : onClose}
                className="p-2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors duration-200 cursor-pointer"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content Body: Scrollable */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar select-text text-left relative z-10">
              <AnimatePresence mode="wait">
                {checkoutComplete ? (
                  /* CHECKOUT RECEIPT */
                  <motion.div
                    key="receipt"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6 text-center py-4"
                  >
                    <div className="w-16 h-16 bg-[#C5A880]/15 border-[0.5px] border-[#C5A880]/40 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check size={26} className="text-[#C5A880]" strokeWidth={1.5} />
                    </div>

                    <div className="space-y-2">
                      <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#C5A880] font-semibold">
                        Order Secured
                      </span>
                      <h4 className="font-serif text-2xl text-[#1A1A1A] font-light">
                        Place Bakehouse Order
                      </h4>
                      <p className="font-mono text-xs text-[#1A1A1A]/45">
                        Ref: {completedOrderNum}
                      </p>
                    </div>

                    <div className="border-[0.5px] border-[#D5BDAF]/40 p-5 bg-[#FDFBF7] text-left space-y-4">
                      <div className="font-sans text-[9px] tracking-widest uppercase text-[#C5A880] border-b border-[#D5BDAF]/20 pb-1.5 font-semibold">
                        Gourmet Summation
                      </div>
                      
                      {cartItems.map((item) => (
                        <div key={item.id} className="text-xs space-y-1">
                          <div className="flex justify-between font-serif text-[#1A1A1A]">
                            <span>{item.quantity}x {item.menuItem.name}</span>
                            <span>₹{item.menuItem.price * item.quantity}</span>
                          </div>
                          {Object.entries(item.selectedOptions).map(([opt, choice]) => (
                            <span key={opt} className="text-[10px] text-[#1A1A1A]/50 block font-serif italic">
                              • {opt}: {choice}
                            </span>
                          ))}
                        </div>
                      ))}

                      <div className="border-t border-[#D5BDAF]/20 pt-3 space-y-2 font-sans text-[10px] tracking-wider uppercase text-[#1A1A1A]/60">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-mono text-[#1A1A1A]">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-[9px] text-[#1A1A1A]/45">
                          <span>Luxury Gastronomy Tax (8.5%)</span>
                          <span className="font-mono">₹{Math.round(tax)}</span>
                        </div>
                        {fulfillment === 'CURBSIDE' && (
                          <div className="flex justify-between text-[9px] text-amber-800">
                            <span>Signature Gift Box</span>
                            <span className="font-mono">₹{CURBSIDE_FEE}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-[#C5A880] font-semibold pt-2 border-t border-[#D5BDAF]/10">
                          <span>Total Experience</span>
                          <span className="font-mono text-sm">₹{Math.round(total)}</span>
                        </div>
                      </div>
                    </div>

                    <p className="font-serif text-xs text-[#1A1A1A]/50 italic leading-relaxed">
                      Your gourmet order has been registered in our session log. For curbside pickup, look for our delivery executive at the valet counter.
                    </p>

                    <button
                      onClick={handleCloseAndReset}
                      className="w-full py-4 bg-[#1A1A1A] hover:bg-[#C5A880] text-[#FDFBF7] hover:text-[#1A1A1A] font-sans text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 rounded-none cursor-pointer"
                    >
                      Close Summary
                    </button>
                  </motion.div>
                ) : isProcessing ? (
                  /* PROCESSING LOADER */
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-24 space-y-6 text-center"
                  >
                    <div className="relative">
                      <svg className="w-14 h-14 text-[#C5A880]/20 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <Award size={20} className="absolute inset-0 m-auto text-[#C5A880]" strokeWidth={1} />
                    </div>
                    <div className="space-y-1">
                      <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold animate-pulse block">
                        Signature Vault
                      </span>
                      <h4 className="font-serif text-xl text-[#1A1A1A] font-light">
                        Packaging Gourmet Delicacies...
                      </h4>
                      <p className="font-serif text-xs text-[#1A1A1A]/40 italic max-w-xs">
                        Applying bespoke thermal insulation and pristine wax seals.
                      </p>
                    </div>
                  </motion.div>
                ) : cartItems.length === 0 ? (
                  /* EMPTY STATE */
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 space-y-4 text-center"
                  >
                    <div className="w-12 h-12 bg-[#F5EBE0]/40 rounded-full flex items-center justify-center text-[#1A1A1A]/30">
                      <ShoppingBag size={18} strokeWidth={1} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-lg text-[#1A1A1A] font-light">
                        Registry is Clear
                      </h4>
                      <p className="font-serif text-xs text-[#1A1A1A]/40 italic max-w-[200px]">
                        Add items from our Gastronomy Collection to initiate your order.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  /* ACTIVE SELECTIONS LIST */
                  <motion.div key="active-items" className="space-y-6">
                    {/* Items List */}
                    <div className="space-y-4">
                      <div className="font-sans text-[9px] tracking-widest uppercase text-[#1A1A1A]/40 border-b border-[#D5BDAF]/20 pb-2 flex justify-between">
                        <span>Items Selected</span>
                        <button
                          onClick={onClearCart}
                          className="hover:text-rose-500 transition-colors duration-200 cursor-pointer flex items-center space-x-1"
                        >
                          <Trash2 size={10} />
                          <span>Clear All</span>
                        </button>
                      </div>

                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-4 pb-4 border-b border-[#D5BDAF]/10 group"
                          >
                            <img
                              src={item.menuItem.image}
                              alt={item.menuItem.name}
                              className="w-16 h-16 object-cover border-[0.5px] border-[#D5BDAF]/20"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-grow flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start">
                                  <h4 className="font-serif text-sm font-medium text-[#1A1A1A] pr-2">
                                    {item.menuItem.name}
                                  </h4>
                                  <span className="font-sans text-xs tracking-wider text-[#C5A880] font-semibold">
                                    ₹{item.menuItem.price * item.quantity}
                                  </span>
                                </div>
                                {/* Selected Options */}
                                {Object.entries(item.selectedOptions).map(([opt, val]) => (
                                  <span key={opt} className="text-[10px] text-[#1A1A1A]/40 block font-serif italic mt-0.5">
                                    {opt}: {val}
                                  </span>
                                ))}
                              </div>

                              <div className="flex justify-between items-center mt-2">
                                {/* Quantity Toggler */}
                                <div className="flex items-center space-x-2 border-[0.5px] border-[#D5BDAF]/30 p-0.5">
                                  <button
                                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    className="p-1 text-[#1A1A1A]/50 hover:text-[#1A1A1A] cursor-pointer"
                                  >
                                    <Minus size={10} />
                                  </button>
                                  <span className="font-mono text-xs w-4 text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 text-[#1A1A1A]/50 hover:text-[#1A1A1A] cursor-pointer"
                                  >
                                    <Plus size={10} />
                                  </button>
                                </div>

                                {/* Trash */}
                                <button
                                  onClick={() => onRemoveItem(item.id)}
                                  className="text-[#1A1A1A]/30 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                                  title="Remove Item"
                                >
                                  <Trash2 size={12} strokeWidth={1.5} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fulfillment Selection */}
                    <div className="space-y-3">
                      <label className="font-sans text-[9px] tracking-widest uppercase text-[#1A1A1A]/60 font-semibold block">
                        Fulfillment Method
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Dine In Option */}
                        <button
                          onClick={() => setFulfillment('DINE_IN')}
                          className={`p-3 border text-left transition-all duration-300 rounded-none cursor-pointer ${
                            fulfillment === 'DINE_IN'
                              ? 'border-[#C5A880] bg-[#F5EBE0]/15'
                              : 'border-[#D5BDAF]/20 hover:border-[#C5A880]/30'
                          }`}
                        >
                          <div className="font-serif text-xs font-semibold text-[#1A1A1A]">Dine-In</div>
                          <div className="text-[9px] font-sans text-[#1A1A1A]/40 uppercase mt-0.5">Silver Seating</div>
                        </button>

                        {/* Curbside Option */}
                        <button
                          onClick={() => setFulfillment('CURBSIDE')}
                          className={`p-3 border text-left transition-all duration-300 rounded-none cursor-pointer ${
                            fulfillment === 'CURBSIDE'
                              ? 'border-[#C5A880] bg-[#F5EBE0]/15'
                              : 'border-[#D5BDAF]/20 hover:border-[#C5A880]/30'
                          }`}
                        >
                          <div className="font-serif text-xs font-semibold text-[#1A1A1A]">Luxury Curbside</div>
                          <div className="text-[9px] font-sans text-amber-800 uppercase mt-0.5">Signature Box (+₹{CURBSIDE_FEE})</div>
                        </button>
                      </div>
                    </div>

                    {/* Guest Information Identity inputs inside cart to authorize order */}
                    <div className="space-y-3 pt-3 border-t border-[#D5BDAF]/10">
                      <label className="font-sans text-[9px] tracking-widest uppercase text-[#1A1A1A]/60 font-semibold block">
                        Guest Authentication
                      </label>
                      
                      <div className="space-y-2 text-left">
                        {/* Name */}
                        <input
                          type="text"
                          placeholder="Your Name *"
                          value={guestName}
                          onChange={(e) => {
                            setGuestName(e.target.value);
                            if (formErrors.name) setFormErrors(prev => ({ ...prev, name: '' }));
                          }}
                          className={`w-full px-3 py-2 bg-[#FDFBF7] border rounded-none font-serif text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C5A880] transition-colors placeholder:text-[#1A1A1A]/20 ${
                            formErrors.name ? 'border-rose-500' : 'border-[#D5BDAF]/30'
                          }`}
                        />
                        {formErrors.name && <p className="text-[9px] font-sans text-rose-500">{formErrors.name}</p>}

                        {/* Email */}
                        <input
                          type="email"
                          placeholder="Email Address *"
                          value={guestEmail}
                          onChange={(e) => {
                            setGuestEmail(e.target.value);
                            if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
                          }}
                          className={`w-full px-3 py-2 bg-[#FDFBF7] border rounded-none font-serif text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C5A880] transition-colors placeholder:text-[#1A1A1A]/20 ${
                            formErrors.email ? 'border-rose-500' : 'border-[#D5BDAF]/30'
                          }`}
                        />
                        {formErrors.email && <p className="text-[9px] font-sans text-rose-500">{formErrors.email}</p>}

                        {/* Phone */}
                        <input
                          type="tel"
                          placeholder="Contact Number *"
                          value={guestPhone}
                          onChange={(e) => {
                            setGuestPhone(e.target.value);
                            if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: '' }));
                          }}
                          className={`w-full px-3 py-2 bg-[#FDFBF7] border rounded-none font-serif text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C5A880] transition-colors placeholder:text-[#1A1A1A]/20 ${
                            formErrors.phone ? 'border-rose-500' : 'border-[#D5BDAF]/30'
                          }`}
                        />
                        {formErrors.phone && <p className="text-[9px] font-sans text-rose-500">{formErrors.phone}</p>}
                      </div>
                    </div>

                    {/* Receipt calculations block */}
                    <div className="bg-[#FDFBF7] border-[0.5px] border-[#D5BDAF]/40 p-4 space-y-2 font-sans text-[10px] tracking-wider uppercase text-[#1A1A1A]/60">
                      <div className="flex justify-between">
                        <span>Gourmet Subtotal</span>
                        <span className="font-mono text-[#1A1A1A]">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-[9px] text-[#1A1A1A]/40">
                        <span>Luxury Gastronomy Tax (8.5%)</span>
                        <span className="font-mono">₹{Math.round(tax)}</span>
                      </div>
                      {fulfillment === 'CURBSIDE' && (
                        <div className="flex justify-between text-[9px] text-amber-800">
                          <span>Signature Packaging</span>
                          <span className="font-mono">₹{CURBSIDE_FEE}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[#C5A880] font-semibold border-t border-[#D5BDAF]/10 pt-2 text-xs">
                        <span>Total Summation</span>
                        <span className="font-mono text-sm">₹{Math.round(total)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sticky Action Footer */}
            {!checkoutComplete && !isProcessing && cartItems.length > 0 && (
              <div className="p-6 border-t border-[#D5BDAF]/20 bg-[#FDFBF7] space-y-3 relative z-10">
                <button
                  id="checkout-trigger-button"
                  onClick={handleCheckout}
                  className="w-full py-4 bg-[#1A1A1A] hover:bg-[#C5A880] text-[#FDFBF7] hover:text-[#1A1A1A] font-sans text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 rounded-none shadow-md flex items-center justify-center space-x-2 cursor-pointer border border-transparent"
                >
                  <CreditCard size={14} strokeWidth={1.5} />
                  <span>Execute Order • ₹{Math.round(total)}</span>
                </button>
                <p className="text-[8px] font-serif text-[#1A1A1A]/40 text-center italic">
                  By executing, you authenticate this selection and register your billing credentials on our secure luxury server.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
