/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Compass, Calendar } from 'lucide-react';

interface HeroProps {
  onExploreMenu: () => void;
  onReserveTable: () => void;
}

export default function Hero({ onExploreMenu, onReserveTable }: HeroProps) {
  return (
    <div id="hero-module" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#FDFBF7]">
      {/* Background elegant pattern */}
      <div className="absolute inset-0 bg-luxury-pattern opacity-15 pointer-events-none z-0" />

      {/* Dim-masked background image blended with cream */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1920"
          alt="Place Bakehouse & Coffee"
          className="w-full h-full object-cover opacity-10 scale-105 select-none pointer-events-none"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/40 via-transparent to-[#FDFBF7]" />
      </div>

      {/* Absolute Centered Layout Overlay */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center select-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          {/* Accent Label */}
          <span className="text-[10px] tracking-[0.5em] uppercase text-[#C5A880] mb-6 block font-semibold">
            Est. 2025 • Nagpur
          </span>

          {/* Majestic Heading */}
          <h1 className="font-serif text-5xl md:text-8xl text-[#1A1A1A] font-extralight tracking-tighter leading-[0.9] mb-10">
            Artisanal <br />
            <span className="italic font-light text-[#C5A880]">Bakehouse</span>
          </h1>

          {/* Elegant Subtitle */}
          <div className="max-w-md mx-auto text-left border-l-[0.5px] border-[#D5BDAF] pl-6 my-10">
            <p className="font-serif text-sm md:text-base text-[#1A1A1A]/70 leading-relaxed italic">
              A symphony of freshly baked sourdoughs, buttery croissants, single-estate pour-overs, and decadent desserts. Every recipe is crafted with meticulous culinary passion.
            </p>
          </div>

          {/* Dual CTAs with modern thin outlines */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
            <motion.button
              id="cta-explore-menu"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExploreMenu}
              className="w-full sm:w-auto px-10 py-4 bg-[#1A1A1A] hover:bg-[#C5A880] text-[#FDFBF7] hover:text-[#1A1A1A] font-sans text-[10px] tracking-[0.3em] uppercase font-bold rounded-none transition-all duration-300 shadow-sm flex items-center justify-center space-x-2 border border-transparent cursor-pointer"
            >
              <Compass size={14} strokeWidth={1.5} />
              <span>Explore Menu</span>
            </motion.button>

            <motion.button
              id="cta-reserve-table"
              whileHover={{ scale: 1.02, backgroundColor: '#F5EBE0' }}
              whileTap={{ scale: 0.98 }}
              onClick={onReserveTable}
              className="w-full sm:w-auto px-10 py-4 border-[0.5px] border-[#1A1A1A] hover:border-[#C5A880] text-[#1A1A1A] font-sans text-[10px] tracking-[0.3em] uppercase font-bold rounded-none transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Calendar size={14} strokeWidth={1.5} />
              <span>Book Table</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Corner Lines with thin border */}
      <div className="absolute top-8 left-8 right-8 bottom-8 border-[0.5px] border-[#D5BDAF]/30 pointer-events-none z-10" />
    </div>
  );
}
