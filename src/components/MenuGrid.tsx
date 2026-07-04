/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Leaf, ShieldAlert, Wheat, Plus, X, Minus, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data';

interface MenuGridProps {
  onAddToCart: (item: MenuItem, options: { [key: string]: string }, quantity: number) => void;
}

type CategoryType = 'House Bakes' | 'Coffees' | 'Appetizers' | 'Pizzas' | 'Mains' | 'Salads & Sushi' | 'Desserts';

export default function MenuGrid({ onAddToCart }: MenuGridProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('House Bakes');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});

  const sliderRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const categories: CategoryType[] = ['House Bakes', 'Coffees', 'Appetizers', 'Pizzas', 'Mains', 'Salads & Sushi', 'Desserts'];

  const categoryMetadata: Record<CategoryType, { img: string; subtitle: string }> = {
    'House Bakes': {
      img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=300',
      subtitle: 'Warm Artisanal'
    },
    'Coffees': {
      img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=300',
      subtitle: 'Premium Brews'
    },
    'Appetizers': {
      img: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=300',
      subtitle: 'Gourmet Starters'
    },
    'Pizzas': {
      img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300',
      subtitle: 'Hand-Stretched'
    },
    'Mains': {
      img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=300',
      subtitle: 'Signature Plates'
    },
    'Salads & Sushi': {
      img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=300',
      subtitle: 'Fresh & Light'
    },
    'Desserts': {
      img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=300',
      subtitle: 'Sweet Confections'
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const totalScrollable = scrollWidth - clientWidth;
      if (totalScrollable > 0) {
        setScrollProgress(scrollLeft / totalScrollable);
      }
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 240;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const filteredItems = MENU_ITEMS.filter(item => item.category === activeCategory);

  const handleOpenDrawer = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    
    // Initialize default choices for required options
    const defaults: { [key: string]: string } = {};
    if (item.options) {
      item.options.forEach(opt => {
        if (opt.required && opt.choices.length > 0) {
          defaults[opt.name] = opt.choices[0];
        }
      });
    }
    setSelectedOptions(defaults);
  };

  const handleOptionChange = (optionName: string, choice: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: choice
    }));
  };

  const handleConfirmAdd = () => {
    if (!selectedItem) return;
    onAddToCart(selectedItem, selectedOptions, quantity);
    setSelectedItem(null);
  };

  const getDietaryIcon = (tag: string) => {
    switch (tag) {
      case 'Signature':
        return <Sparkles size={11} className="text-[#C5A880]" strokeWidth={1.5} />;
      case 'Vegan':
        return <Leaf size={11} className="text-emerald-600/80" strokeWidth={1.5} />;
      case 'Gluten-Free':
        return <Wheat size={11} className="text-amber-600/80" strokeWidth={1.5} />;
      case 'Contains Nuts':
        return <ShieldAlert size={11} className="text-rose-600/80" strokeWidth={1.5} />;
      default:
        return null;
    }
  };

  return (
    <div id="gastronomy-menu-grid" className="py-20 bg-[#FDFBF7] relative min-h-screen">
      {/* Background elegant pattern */}
      <div className="absolute inset-0 bg-luxury-pattern opacity-15 pointer-events-none z-0" />

      {/* Decorative Border Details */}
      <div className="absolute top-0 left-0 right-0 h-[0.5px] bg-[#D5BDAF]/30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Module Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
            The Culinary Collection
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] font-extralight tracking-tight">
            Our Gastronomic Offerings
          </h2>
          <p className="max-w-lg mx-auto font-serif text-sm md:text-base text-[#1A1A1A]/60 italic">
            Artisanal ingredients imported weekly, crafted with technical virtuosity and aesthetic balance.
          </p>
        </div>

        {/* Fixed/Sticky Navigation Category Slider */}
        <div className="sticky top-[72px] z-30 bg-[#FDFBF7]/95 backdrop-blur-md py-6 mb-16 border-b border-[#D5BDAF]/20 flex flex-col items-center">
          <div className="relative w-full max-w-5xl flex items-center px-2 md:px-10 group">
            {/* Left Scroll Arrow */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 md:left-2 z-10 p-2 rounded-full border border-[#D5BDAF]/30 bg-[#FDFBF7]/90 hover:bg-[#1A1A1A] hover:text-[#FDFBF7] text-[#1A1A1A]/70 hover:border-[#1A1A1A] transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-30"
              title="Scroll Left"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>

            {/* Horizontal Slider Scroll Container */}
            <div
              ref={sliderRef}
              onScroll={handleScroll}
              className="flex items-center space-x-6 md:space-x-10 overflow-x-auto no-scrollbar scroll-smooth w-full py-2 px-6 select-none"
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const metadata = categoryMetadata[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="flex flex-col items-center flex-shrink-0 cursor-pointer focus:outline-none group/btn"
                  >
                    {/* Rounded Square Image Container */}
                    <div
                      className={`relative w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-2xl transition-all duration-500 bg-[#F5EBE0]/30 border ${
                        isActive
                          ? 'border-[#C5A880] ring-2 ring-[#C5A880] ring-offset-2 scale-105 shadow-md'
                          : 'border-[#D5BDAF]/30 group-hover/btn:border-[#C5A880]/70 group-hover/btn:scale-102'
                      }`}
                    >
                      <img
                        src={metadata.img}
                        alt={cat}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/btn:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div
                        className={`absolute inset-0 bg-[#1A1A1A]/10 transition-opacity duration-300 ${
                          isActive ? 'opacity-0' : 'opacity-20 group-hover/btn:opacity-10'
                        }`}
                      />
                    </div>

                    {/* Name Label */}
                    <span
                      className={`mt-3 font-sans text-[10px] md:text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 whitespace-nowrap ${
                        isActive ? 'text-[#C5A880] font-bold' : 'text-[#1A1A1A]/60 font-semibold group-hover/btn:text-[#1A1A1A]'
                      }`}
                    >
                      {cat}
                    </span>

                    {/* Mini Subtitle */}
                    <span className="font-serif text-[8px] md:text-[9px] text-[#1A1A1A]/40 italic mt-0.5 tracking-normal whitespace-nowrap opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300">
                      {metadata.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Arrow */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 md:right-2 z-10 p-2 rounded-full border border-[#D5BDAF]/30 bg-[#FDFBF7]/90 hover:bg-[#1A1A1A] hover:text-[#FDFBF7] text-[#1A1A1A]/70 hover:border-[#1A1A1A] transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-30"
              title="Scroll Right"
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>

          {/* Styled scroll progress indicator track */}
          <div className="w-48 h-[2.5px] bg-[#D5BDAF]/20 rounded-full mt-4 relative overflow-hidden">
            <motion.div
              className="absolute top-0 bottom-0 bg-[#C5A880] rounded-full w-1/3"
              animate={{
                left: `${scrollProgress * 66.6}%`
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            />
          </div>
        </div>

        {/* Multi-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group flex flex-col justify-between bg-white border-[0.5px] border-[#D5BDAF]/30 hover:border-[#C5A880]/60 transition-all duration-500 overflow-hidden shadow-[0_4px_24px_rgba(213,189,175,0.08)] hover:shadow-[0_8px_32px_rgba(197,168,128,0.12)] h-full"
              >
                {/* Product Image Panel */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F5EBE0]/30">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Luxury Ambient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  
                  {/* Signature Tag Pin */}
                  {item.dietary.includes('Signature') && (
                    <div className="absolute top-4 left-4 bg-[#1A1A1A]/90 text-[#C5A880] text-[9px] tracking-[0.2em] uppercase py-1 px-3 border border-[#C5A880]/30 backdrop-blur-sm flex items-center space-x-1">
                      <Sparkles size={8} />
                      <span>Signature</span>
                    </div>
                  )}
                </div>

                {/* Product Info Block */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-serif text-lg md:text-xl text-[#1A1A1A] font-medium leading-snug group-hover:text-[#C5A880] transition-colors duration-300">
                        {item.name}
                      </h3>
                      <span className="font-sans text-xs tracking-wider text-[#C5A880] font-semibold pt-1 whitespace-nowrap">
                        ₹{item.price}
                      </span>
                    </div>

                    <p className="font-serif text-xs md:text-sm text-[#1A1A1A]/60 leading-relaxed font-light line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Dietary Icons & Interactive CTA Row */}
                  <div className="pt-4 border-t border-[#D5BDAF]/10 flex items-center justify-between">
                    {/* Dietary Tags */}
                    <div className="flex flex-wrap gap-2">
                      {item.dietary.filter(tag => tag !== 'Signature').map((tag) => (
                        <span
                          key={tag}
                          title={tag}
                          className="flex items-center space-x-1 text-[9px] font-sans tracking-widest uppercase text-[#1A1A1A]/60 bg-[#F5EBE0]/40 px-2 py-0.5 border-[0.5px] border-[#D5BDAF]/20"
                        >
                          {getDietaryIcon(tag)}
                          <span className="hidden xs:inline">{tag}</span>
                        </span>
                      ))}
                      {item.dietary.length === 0 && (
                        <span className="text-[9px] font-sans tracking-widest uppercase text-[#1A1A1A]/35 italic">
                          Artisan Original
                        </span>
                      )}
                    </div>

                    {/* Interactive Button */}
                    <button
                      onClick={() => handleOpenDrawer(item)}
                      className="p-2 border-[0.5px] border-[#D5BDAF]/40 group-hover:border-[#C5A880] text-[#1A1A1A] hover:bg-[#C5A880] hover:text-[#1A1A1A] transition-all duration-300 rounded-none cursor-pointer flex items-center space-x-1"
                      title="Select & Add"
                    >
                      <Plus size={14} strokeWidth={1.5} />
                      <span className="font-sans text-[9px] tracking-widest uppercase pl-0.5">Select</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM SHEET DRAWER: Granular Item Options with Framer Motion Springs */}
      <AnimatePresence>
        {selectedItem && (
          <>
            {/* Backdrop Dimmer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-[#1A1A1A] z-50 cursor-pointer"
            />

            {/* Sliding Drawer Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 bg-[#FDFBF7] border-t border-[#D5BDAF]/50 z-50 max-h-[90vh] overflow-y-auto shadow-2xl rounded-t-3xl"
            >
              <div className="max-w-2xl mx-auto px-6 py-8 relative">
                {/* Pull bar indicator */}
                <div className="w-12 h-1 bg-[#D5BDAF]/40 rounded-full mx-auto mb-6 cursor-pointer" onClick={() => setSelectedItem(null)} />

                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 p-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors duration-200 cursor-pointer"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>

                {/* Main Content Layout */}
                <div className="space-y-6">
                  {/* Item Summary Header */}
                  <div className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-[#D5BDAF]/20">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="w-32 h-24 object-cover border-[0.5px] border-[#D5BDAF]/30"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-2">
                      <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#C5A880] font-semibold">
                        {selectedItem.category}
                      </span>
                      <h3 className="font-serif text-2xl text-[#1A1A1A] font-normal">
                        {selectedItem.name}
                      </h3>
                      <p className="font-sans text-sm text-[#C5A880] font-semibold">
                        ₹{selectedItem.price}
                      </p>
                    </div>
                  </div>

                  {/* Culinary Description */}
                  <div className="bg-[#F5EBE0]/30 p-4 border-l-[3px] border-[#C5A880] text-xs font-serif italic text-[#1A1A1A]/70 leading-relaxed flex items-start space-x-2">
                    <Info size={14} className="text-[#C5A880] mt-0.5 flex-shrink-0" />
                    <span>{selectedItem.description}</span>
                  </div>

                  {/* Configurable Option Groups */}
                  {selectedItem.options && selectedItem.options.map((opt) => (
                    <div key={opt.name} className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="font-sans text-[10px] tracking-widest uppercase text-[#1A1A1A]/70 font-semibold">
                          {opt.name}
                        </label>
                        {opt.required ? (
                          <span className="font-sans text-[8px] tracking-wider uppercase text-[#C5A880] bg-[#C5A880]/10 px-2 py-0.5 border border-[#C5A880]/20">
                            Required
                          </span>
                        ) : (
                          <span className="font-sans text-[8px] tracking-wider uppercase text-[#1A1A1A]/40 bg-[#1A1A1A]/5 px-2 py-0.5 border border-[#1A1A1A]/10">
                            Optional
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {opt.choices.map((choice) => {
                          const isSelected = selectedOptions[opt.name] === choice;
                          return (
                            <button
                              key={choice}
                              onClick={() => handleOptionChange(opt.name, choice)}
                              className={`px-4 py-3 text-left font-sans text-xs transition-all duration-300 border rounded-none cursor-pointer flex justify-between items-center ${
                                isSelected
                                  ? 'border-[#C5A880] bg-[#F5EBE0]/20 text-[#1A1A1A]'
                                  : 'border-[#D5BDAF]/20 hover:border-[#C5A880]/50 text-[#1A1A1A]/60'
                              }`}
                            >
                              <span>{choice}</span>
                              {isSelected && <div className="w-1.5 h-1.5 bg-[#C5A880]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Quantity & Add to Order Trigger */}
                  <div className="pt-6 border-t border-[#D5BDAF]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Quantity Selector Counter */}
                    <div className="flex items-center space-x-4 border-[0.5px] border-[#D5BDAF]/40 p-1">
                      <button
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="p-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] cursor-pointer"
                        disabled={quantity <= 1}
                      >
                        <Minus size={14} strokeWidth={1.5} />
                      </button>
                      <span className="font-mono text-sm font-semibold w-8 text-center text-[#1A1A1A]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="p-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] cursor-pointer"
                      >
                        <Plus size={14} strokeWidth={1.5} />
                      </button>
                    </div>

                    {/* Action button */}
                    <motion.button
                      id="drawer-add-to-cart"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleConfirmAdd}
                      className="w-full sm:w-auto flex-grow sm:flex-grow-0 px-8 py-4 bg-[#1A1A1A] hover:bg-[#C5A880] text-[#FDFBF7] hover:text-[#1A1A1A] font-sans text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 rounded-none shadow-md text-center cursor-pointer"
                    >
                      Add To Experience • ₹{selectedItem.price * quantity}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
