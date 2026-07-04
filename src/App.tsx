/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu, X, Compass, Calendar, Sparkles, MapPin, Phone, Clock, FileCheck } from 'lucide-react';
import { MenuItem, CartItem, ReservationState, CRMPayload } from './types';
import Hero from './components/Hero';
import MenuGrid from './components/MenuGrid';
import ReservationWizard from './components/ReservationWizard';
import CartDrawer from './components/CartDrawer';

type ScreenType = 'home' | 'menu' | 'reserve';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cart Management Handlers
  const handleAddToCart = (item: MenuItem, selectedOptions: { [key: string]: string }, quantity: number) => {
    setCartItems((prev) => {
      // Create options fingerprint to group items with identical choices
      const optionSignature = Object.entries(selectedOptions)
        .map(([k, v]) => `${k}:${v}`)
        .sort()
        .join('|');

      const matchIndex = prev.findIndex(
        (ci) =>
          ci.menuItem.id === item.id &&
          Object.entries(ci.selectedOptions)
            .map(([k, v]) => `${k}:${v}`)
            .sort()
            .join('|') === optionSignature
      );

      if (matchIndex > -1) {
        const next = [...prev];
        next[matchIndex].quantity += quantity;
        return next;
      } else {
        return [
          ...prev,
          {
            id: `${item.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            menuItem: item,
            quantity,
            selectedOptions,
          },
        ];
      }
    });
    // Open cart slide drawer to showcase selections
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckoutSuccess = (crmPayload: CRMPayload) => {
    // Keep cart items on success so drawer can render receipt.
    // We clear the cart when they close the completed order summary.
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
    // If checkout was complete, let's wipe the cart items to complete the lifecycle
    const orderSummationVisible = document.querySelector('[id^="checkout-trigger-button"]') === null && cartItems.length > 0;
    // We will clear the cart if the user closes after a successful order
  };

  const handleClearCompletedOrder = () => {
    setCartItems([]);
    setIsCartOpen(false);
  };

  // Log Reservation success
  const handleReservationSuccess = (booking: ReservationState) => {
    const crmPayload: CRMPayload = {
      transactionType: 'RESERVATION',
      timestamp: new Date().toISOString(),
      payload: {
        guestDetails: {
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          notes: booking.specialRequests,
        },
        bookingDetails: {
          partySize: booking.partySize,
          date: booking.date,
          timeSlot: booking.timeSlot,
        },
      },
    };

    console.log('Payload destined for Admin CRM:', crmPayload);
  };

  // Navigations
  const navigateTo = (screen: ScreenType) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div id="michelin-spa-root" className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between selection:bg-[#C5A880]/30 selection:text-[#1A1A1A]">
      {/* 1. FLOATING LUXURY STICKY NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b-[0.5px] border-[#D5BDAF]/30 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo - Elegant Serif */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center space-x-3 text-left cursor-pointer group"
          >
            <div className="w-8 h-8 border-[0.5px] border-[#C5A880] flex items-center justify-center rotate-45 group-hover:bg-[#C5A880]/15 transition-all duration-500">
              <Sparkles size={11} className="text-[#C5A880] -rotate-45" />
            </div>
            <div>
              <span className="font-serif text-2xl italic tracking-tight text-[#1A1A1A] font-medium block">
                Place Bakehouse & Coffee
              </span>
              <span className="font-sans text-[6.5px] tracking-[0.45em] uppercase text-[#C5A880] block font-semibold -mt-0.5">
                Artisanal Cafe & Bakery
              </span>
            </div>
          </button>

          {/* Desktop Navigation Link Deck */}
          <nav className="hidden md:flex items-center space-x-10">
            {[
              { id: 'home', label: 'Home' },
              { id: 'menu', label: 'The Menu' },
              { id: 'reserve', label: 'Reservations' },
            ].map((link) => {
              const isActive = activeScreen === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => navigateTo(link.id as ScreenType)}
                  className={`relative font-sans text-[10px] tracking-[0.3em] uppercase py-1.5 transition-colors duration-300 cursor-pointer ${
                    isActive ? 'text-[#C5A880] font-semibold' : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="headerUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C5A880]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Interactive Actions Deck */}
          <div className="flex items-center space-x-4">
            {/* Bag Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 border-[0.5px] border-[#D5BDAF]/30 hover:border-[#C5A880] text-[#1A1A1A] hover:bg-[#FDFBF7] transition-all duration-300 rounded-none cursor-pointer flex items-center space-x-2"
              title="View Selections"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              <span className="hidden sm:inline font-sans text-[9px] tracking-widest uppercase font-semibold text-[#1A1A1A]/70">
                Selections
              </span>
              <AnimatePresence>
                {totalCartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 bg-[#C5A880] text-[#1A1A1A] font-mono text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white"
                  >
                    {totalCartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Hamburger Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-[#1A1A1A] border-[0.5px] border-[#D5BDAF]/30 hover:border-[#C5A880] cursor-pointer"
            >
              {mobileMenuOpen ? <X size={16} strokeWidth={1.5} /> : <Menu size={16} strokeWidth={1.5} />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE NAV MENU DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-[73px] left-0 right-0 bg-[#FDFBF7] z-30 border-b border-[#D5BDAF]/40 shadow-xl py-6 px-6 space-y-4"
          >
            {[
              { id: 'home', label: 'Home' },
              { id: 'menu', label: 'The Menu' },
              { id: 'reserve', label: 'Reservations' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => navigateTo(link.id as ScreenType)}
                className={`w-full text-left py-3 font-sans text-xs tracking-widest uppercase block border-b border-[#D5BDAF]/10 cursor-pointer ${
                  activeScreen === link.id ? 'text-[#C5A880] font-semibold' : 'text-[#1A1A1A]/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. DYNAMIC CONTENT MAIN FRAME with screen router and transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeScreen === 'home' && (
            <motion.div
              key="home-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Hero
                onExploreMenu={() => navigateTo('menu')}
                onReserveTable={() => navigateTo('reserve')}
              />
              
              {/* Luxury Introductory Narrative panel */}
              <div className="py-24 px-6 bg-[#FDFBF7] relative overflow-hidden border-t-[0.5px] border-b-[0.5px] border-[#D5BDAF]/30">
                {/* Background luxury pattern */}
                <div className="absolute inset-0 bg-luxury-pattern opacity-15 pointer-events-none z-0" />

                <div className="max-w-4xl mx-auto text-center space-y-8 select-none relative z-10">
                  <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#C5A880] font-semibold block">
                    Our Philosophy
                  </span>
                  <h3 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] font-extralight tracking-tight leading-snug">
                    Bespoke Ingredients. <br />
                    Uncompromising Technical Excellence.
                  </h3>
                  <p className="font-serif text-sm md:text-lg text-[#1A1A1A]/60 italic leading-relaxed max-w-2xl mx-auto font-light">
                    &ldquo;At Place Bakehouse & Coffee, we treat gastronomy not as a utility, but as a fine art. From our 100% Organic Arabica beans roasted from single estates in India, to our 3-day laminated croissants and artisanal hand-stretched pizzas, every touchpoint is curated for visual and sensory perfection.&rdquo;
                  </p>
                  <div className="pt-4">
                    <span className="font-serif text-xs font-semibold text-[#C5A880]">Founder & Head Baker</span>
                  </div>
                </div>
              </div>

              {/* Interactive Visual Gallery */}
              <div className="py-24 px-6 bg-[#FDFBF7] select-none border-b-[0.5px] border-[#D5BDAF]/30">
                <div className="max-w-7xl mx-auto space-y-12">
                  <div className="text-center space-y-3">
                    <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#C5A880] font-semibold block">
                      The Bakehouse Canvas
                    </span>
                    <h3 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] font-extralight tracking-tight">
                      Glimpses of Our Space & Craft
                    </h3>
                    <p className="font-serif text-xs md:text-sm text-[#1A1A1A]/50 italic max-w-md mx-auto">
                      A visual journal of artisanal baking, fresh coffee brewing, and everyday aesthetic moments.
                    </p>
                  </div>

                  {/* 6-Card Aesthetic Bento-style Masonry Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Chic Cafe Sanctum',
                        desc: 'A minimal wood-accented retreat designed for cozy catch-ups.',
                        img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600',
                      },
                      {
                        title: 'Signature Croissants',
                        desc: '3-day laminated pastry loaded with premium butter.',
                        img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600',
                      },
                      {
                        title: 'Artisanal Sourdoughs',
                        desc: 'Crispy blistered crusts, airy crumb, and a perfect wild tang.',
                        img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
                      },
                      {
                        title: 'Specialty Coffee Art',
                        desc: 'Double shot 100% Organic Arabica poured with velvet crema.',
                        img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600',
                      },
                      {
                        title: 'Rosewater Tres Leches',
                        desc: 'Decadent sponge cake soaked in luxury sweetened milks.',
                        img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600',
                      },
                      {
                        title: 'Hand-Stretched Pizzas',
                        desc: 'Thin Neapolitan-style base topped with heritage tomatoes.',
                        img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
                      },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -6 }}
                        className="group relative bg-[#FDFBF7] border-[0.5px] border-[#D5BDAF]/40 overflow-hidden shadow-sm"
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden relative">
                          <img
                            src={item.img}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-[#1A1A1A]/10 group-hover:bg-[#1A1A1A]/40 transition-colors duration-500" />
                        </div>
                        <div className="p-5 space-y-1.5 bg-[#FDFBF7] border-t-[0.5px] border-[#D5BDAF]/20 relative z-10">
                          <span className="font-sans text-[8px] tracking-[0.2em] uppercase text-[#C5A880] font-semibold block">
                            {item.title}
                          </span>
                          <p className="font-serif text-xs text-[#1A1A1A]/60 italic leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* The Sanctuary (Our Location with Interactive Maps) */}
              <div className="py-24 px-6 bg-[#F5EBE0]/30 select-none border-b-[0.5px] border-[#D5BDAF]/30">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left Side: Address details & CTA */}
                  <div className="lg:col-span-5 space-y-8">
                    <div className="space-y-3 text-left">
                      <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#C5A880] font-semibold block">
                        Our Sanctuary
                      </span>
                      <h3 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] font-extralight tracking-tight leading-tight">
                        Visit Place Bakehouse & Coffee
                      </h3>
                      <p className="font-serif text-xs md:text-sm text-[#1A1A1A]/60 italic leading-relaxed">
                        Nestled in the heart of Nagpur at New Sneh Nagar, our cafe is a peaceful sanctuary designed to elevate your coffee and baking experiences. Drop by for fresh morning brews or cozy evening dinners.
                      </p>
                    </div>

                    {/* Quick Contacts Panel */}
                    <div className="space-y-4 border-l-[0.5px] border-[#C5A880] pl-6 font-serif text-xs md:text-sm text-[#1A1A1A]/70">
                      <div className="space-y-1">
                        <span className="font-sans text-[8px] tracking-[0.2em] uppercase text-[#C5A880] font-semibold block">
                          The Address
                        </span>
                        <p className="leading-relaxed font-light">
                          Wardha Road, New Sneh Nagar, <br />
                          Nagpur, Maharashtra, India - 440015
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="font-sans text-[8px] tracking-[0.2em] uppercase text-[#C5A880] font-semibold block">
                          Opening Hours
                        </span>
                        <p className="leading-relaxed font-light">
                          Open Daily: 08:00 AM – 10:00 PM
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="font-sans text-[8px] tracking-[0.2em] uppercase text-[#C5A880] font-semibold block">
                          Contact Info
                        </span>
                        <p className="leading-relaxed font-light">
                          Phone: +91 98765 43210 <br />
                          Email: contact@placebakehouse.com
                        </p>
                      </div>
                    </div>

                    {/* Nav Maps CTA button */}
                    <div className="pt-2 text-left">
                      <motion.a
                        id="external-maps-navigation"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href="https://maps.app.goo.gl/m2cY3tCkUXGLyvNn8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2.5 px-8 py-4 bg-[#1A1A1A] hover:bg-[#C5A880] text-[#FDFBF7] hover:text-[#1A1A1A] font-sans text-[10px] tracking-[0.3em] uppercase font-bold rounded-none transition-all duration-300 shadow-md border border-transparent cursor-pointer"
                      >
                        <MapPin size={14} strokeWidth={1.5} />
                        <span>Navigate via Google Maps</span>
                      </motion.a>
                    </div>
                  </div>

                  {/* Right Side: Interactive Maps Iframe Card */}
                  <div className="lg:col-span-7">
                    <div className="bg-[#FDFBF7] border-[0.5px] border-[#D5BDAF]/50 p-4 shadow-lg relative">
                      {/* Frame lines overlay */}
                      <div className="absolute top-2 left-2 right-2 bottom-2 border-[0.5px] border-[#D5BDAF]/25 pointer-events-none z-10" />
                      
                      <div className="w-full aspect-[16/10] bg-[#F5EBE0]/20 overflow-hidden relative">
                        <iframe
                          title="Place Bakehouse & Coffee Nagpur Map"
                          src="https://maps.google.com/maps?q=Place%20Bakehouse%20and%20Coffee,%20New%20Sneh%20Nagar,%20Nagpur&t=&z=16&ie=UTF8&iwloc=&output=embed"
                          className="w-full h-full border-0 grayscale opacity-85 hover:grayscale-0 transition-all duration-700 ease-out relative z-0"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {activeScreen === 'menu' && (
            <motion.div
              key="menu-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MenuGrid onAddToCart={handleAddToCart} />
            </motion.div>
          )}

          {activeScreen === 'reserve' && (
            <motion.div
              key="reserve-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ReservationWizard
                onSuccess={handleReservationSuccess}
                onNavigateHome={() => navigateTo('home')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. PERSISTENT SYSTEMIC FOOTER */}
      <footer className="bg-[#1A1A1A] text-[#FDFBF7]/80 py-16 px-6 border-t-[0.5px] border-[#D5BDAF]/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left select-none">
          
          {/* Identity column */}
          <div className="space-y-4">
            <h4 className="font-serif text-xl tracking-wider text-[#FDFBF7] font-light">PLACE BAKEHOUSE & COFFEE</h4>
            <p className="font-serif text-xs text-[#FDFBF7]/50 italic max-w-xs mx-auto md:mx-0 leading-relaxed">
              Nagpur&apos;s premium boutique cafe and bakehouse, crafting memories with technical culinary precision.
            </p>
            <div className="font-sans text-[8px] tracking-[0.25em] uppercase text-[#C5A880] font-semibold">
              ESTABLISHED MMXXV
            </div>
          </div>

          {/* Location details */}
          <div className="space-y-4 font-serif text-xs">
            <h5 className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#C5A880] font-semibold">
              The Destination
            </h5>
            <div className="space-y-2 text-[#FDFBF7]/60">
              <p className="flex items-center justify-center md:justify-start space-x-2">
                <MapPin size={12} className="text-[#C5A880]/70" />
                <span>New Sneh Nagar, Nagpur, Maharashtra, India</span>
              </p>
              <p className="flex items-center justify-center md:justify-start space-x-2">
                <Phone size={12} className="text-[#C5A880]/70" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-center justify-center md:justify-start space-x-2">
                <Clock size={12} className="text-[#C5A880]/70" />
                <span>Morning Coffee & Dinner: 08:00 AM - 10:00 PM</span>
              </p>
            </div>
          </div>

          {/* Service intervals summary / CTA card */}
          <div className="space-y-4">
            <h5 className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#C5A880] font-semibold">
              Active Seating
            </h5>
            <p className="font-serif text-xs text-[#FDFBF7]/50 leading-relaxed max-w-xs mx-auto md:mx-0">
              We operate an exclusive reservation register. Guests are recommended to secure service intervals at least 48 hours in advance.
            </p>
            <button
              onClick={() => navigateTo('reserve')}
              className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#C5A880] hover:text-[#FDFBF7] transition-colors duration-300 border-b border-[#C5A880] pb-1 cursor-pointer"
            >
              Secure Seating Now
            </button>
          </div>

        </div>

        {/* Divider line */}
        <div className="max-w-7xl mx-auto h-[0.5px] bg-[#D5BDAF]/10 my-10" />

        {/* Humility & copyright */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[10px] font-sans tracking-widest uppercase text-[#FDFBF7]/40 text-center md:text-left gap-4">
          <span>&copy; 2026 Place Bakehouse & Coffee. All Rights Reserved.</span>
          <span className="text-[#C5A880]">Constructed with Technical Precision for Culinary Enthusiasts</span>
        </div>
      </footer>

      {/* 4. SLIDE-OVER PERSISTENT SELECTION DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckoutSuccess={handleCheckoutSuccess}
      />
    </div>
  );
}
