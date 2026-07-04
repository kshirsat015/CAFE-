/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Calendar, User, ArrowRight, ArrowLeft, Check, Compass, FileText, Loader2, Sparkles, Phone, Mail, FileCheck } from 'lucide-react';
import { ReservationState, CRMPayload } from '../types';
import { SERVICE_HOURS } from '../data';

interface ReservationWizardProps {
  onSuccess: (booking: ReservationState) => void;
  onNavigateHome: () => void;
}

export default function ReservationWizard({ onSuccess, onNavigateHome }: ReservationWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 'loading' | 'success'>(1);
  const [partySize, setPartySize] = useState<number>(2);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Form error states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Generate the next 14 available booking dates starting from July 2, 2026
  const [availableDates, setAvailableDates] = useState<{ dateString: string; dayName: string; dayNum: number; monthName: string }[]>([]);

  useEffect(() => {
    const dates = [];
    const baseDate = new Date('2026-07-02T12:00:00'); // Starting from July 2, 2026 as per local metadata
    
    for (let i = 0; i < 14; i++) {
      const current = new Date(baseDate);
      current.setDate(baseDate.getDate() + i);
      
      const dateString = current.toISOString().split('T')[0];
      const dayName = current.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = current.getDate();
      const monthName = current.toLocaleDateString('en-US', { month: 'short' });
      
      dates.push({
        dateString,
        dayName,
        dayNum,
        monthName
      });
    }
    setAvailableDates(dates);
    // Default to the first date
    setSelectedDate(dates[0].dateString);
    setSelectedTime(SERVICE_HOURS[2]); // Default 11:00 AM
  }, []);

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!selectedDate || !selectedTime) {
        setErrors({ dateTime: 'Please select both date and time.' });
        return;
      }
      setErrors({});
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const validateStep3 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!guestName.trim()) newErrors.name = 'Full name is required.';
    if (!guestEmail.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(guestEmail)) {
      newErrors.email = 'Please provide a valid email address.';
    }
    if (!guestPhone.trim()) {
      newErrors.phone = 'Phone number is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitBooking = () => {
    if (!validateStep3()) return;

    setStep('loading');

    // Simulate high-fidelity premium loading transition
    setTimeout(() => {
      const reservationData: ReservationState = {
        partySize,
        date: selectedDate,
        timeSlot: selectedTime,
        name: guestName,
        email: guestEmail,
        phone: guestPhone,
        specialRequests: specialRequests
      };

      // Trigger SUCCESS State
      setStep('success');

      // Raise booking success callback with standard CRMPayload trigger
      onSuccess(reservationData);
    }, 2400);
  };

  // Human readable date string for the receipt
  const getReadableDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div id="reservation-wizard" className="py-20 px-6 bg-[#FDFBF7] min-h-screen relative flex items-center justify-center">
      {/* Background elegant pattern */}
      <div className="absolute inset-0 bg-luxury-pattern opacity-15 pointer-events-none z-0" />

      {/* Decorative Fine Borders */}
      <div className="absolute top-0 left-0 right-0 h-[0.5px] bg-[#D5BDAF]/30" />
      
      <div className="w-full max-w-2xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {/* STEP 1: PARTY SIZE */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              <div className="text-center space-y-3">
                <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
                  Step I of III
                </span>
                <h3 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] font-extralight tracking-tight">
                  Select Guest Count
                </h3>
                <p className="font-serif text-xs md:text-sm text-[#1A1A1A]/50 italic max-w-md mx-auto">
                  For parties larger than 8, please contact our Guest Relations Concierge directly at contact@poshbakehouse.com
                </p>
              </div>

              {/* Party Selection Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => {
                  const isSelected = partySize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setPartySize(size)}
                      className={`py-5 border transition-all duration-500 rounded-none cursor-pointer text-center relative overflow-hidden flex flex-col items-center justify-center space-y-2 ${
                        isSelected
                          ? 'border-[#C5A880] bg-[#FDFBF7] text-[#C5A880]'
                          : 'border-[#D5BDAF]/30 hover:border-[#C5A880]/50 text-[#1A1A1A]/70 hover:bg-[#FDFBF7]/50'
                      }`}
                    >
                      <Users size={16} strokeWidth={1} className={isSelected ? 'text-[#C5A880]' : 'text-[#1A1A1A]/40'} />
                      <span className="font-serif text-lg font-light">{size} {size === 1 ? 'Guest' : 'Guests'}</span>
                    </button>
                  );
                })}
              </div>

              {/* Progress & Next Controls */}
              <div className="pt-6 border-t border-[#D5BDAF]/20 flex justify-between items-center">
                <button
                  onClick={onNavigateHome}
                  className="font-sans text-[10px] tracking-widest uppercase text-[#1A1A1A]/40 hover:text-[#1A1A1A] flex items-center space-x-1 cursor-pointer"
                >
                  <ArrowLeft size={12} strokeWidth={1.5} />
                  <span>Return Home</span>
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextStep}
                  className="px-8 py-4 bg-[#1A1A1A] hover:bg-[#C5A880] text-white hover:text-[#1A1A1A] font-sans text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 rounded-none flex items-center space-x-2 cursor-pointer"
                >
                  <span>Select Date</span>
                  <ArrowRight size={12} strokeWidth={1.5} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: MINIMALIST CALENDAR & SERVICE INTERVALS */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="text-center space-y-3">
                <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
                  Step II of III
                </span>
                <h3 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] font-extralight tracking-tight">
                  Choose Date & Time
                </h3>
                <p className="font-serif text-xs md:text-sm text-[#1A1A1A]/50 italic max-w-md mx-auto">
                  Available service intervals are dynamically adjusted based on party size.
                </p>
              </div>

              {/* Minimalist Calendar Horizontal List */}
              <div className="space-y-3">
                <label className="font-sans text-[9px] tracking-widest uppercase text-[#1A1A1A]/60 font-semibold flex items-center space-x-1.5">
                  <Calendar size={12} strokeWidth={1.5} />
                  <span>Select Desired Date</span>
                </label>
                
                <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar border-b border-[#D5BDAF]/20 mask-gradient">
                  {availableDates.map((d) => {
                    const isSelected = selectedDate === d.dateString;
                    return (
                      <button
                        key={d.dateString}
                        onClick={() => {
                          setSelectedDate(d.dateString);
                          setErrors({});
                        }}
                        className={`flex-shrink-0 w-16 py-3 border transition-all duration-300 rounded-none cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                          isSelected
                            ? 'border-[#C5A880] bg-[#1A1A1A] text-[#C5A880]'
                            : 'border-[#D5BDAF]/30 hover:border-[#C5A880]/50 text-[#1A1A1A]/70 hover:bg-[#FDFBF7]'
                        }`}
                      >
                        <span className="font-sans text-[9px] tracking-wider uppercase opacity-60">{d.dayName}</span>
                        <span className="font-serif text-lg font-medium">{d.dayNum}</span>
                        <span className="font-sans text-[8px] tracking-wider uppercase opacity-60">{d.monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Service Intervals Grid */}
              <div className="space-y-3">
                <label className="font-sans text-[9px] tracking-widest uppercase text-[#1A1A1A]/60 font-semibold flex items-center space-x-1.5">
                  <ClockIcon size={12} />
                  <span>Available Dining Slots</span>
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {SERVICE_HOURS.map((slot) => {
                    const isSelected = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => {
                          setSelectedTime(slot);
                          setErrors({});
                        }}
                        className={`py-3.5 border text-center transition-all duration-300 rounded-none font-sans text-xs tracking-wider cursor-pointer ${
                          isSelected
                            ? 'border-[#C5A880] bg-[#FDFBF7] text-[#C5A880] font-semibold'
                            : 'border-[#D5BDAF]/20 hover:border-[#C5A880]/40 text-[#1A1A1A]/70'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {errors.dateTime && (
                <p className="text-xs font-sans text-rose-500 tracking-wider text-center">{errors.dateTime}</p>
              )}

              {/* Progress & Next Controls */}
              <div className="pt-6 border-t border-[#D5BDAF]/20 flex justify-between items-center">
                <button
                  onClick={handlePrevStep}
                  className="font-sans text-[10px] tracking-widest uppercase text-[#1A1A1A]/40 hover:text-[#1A1A1A] flex items-center space-x-1 cursor-pointer"
                >
                  <ArrowLeft size={12} strokeWidth={1.5} />
                  <span>Previous</span>
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextStep}
                  className="px-8 py-4 bg-[#1A1A1A] hover:bg-[#C5A880] text-white hover:text-[#1A1A1A] font-sans text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 rounded-none flex items-center space-x-2 cursor-pointer"
                >
                  <span>Guest Details</span>
                  <ArrowRight size={12} strokeWidth={1.5} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: IDENTITY COLLECTION */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="text-center space-y-3">
                <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#C5A880] font-semibold">
                  Step III of III
                </span>
                <h3 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] font-extralight tracking-tight">
                  Guest Credentials
                </h3>
                <p className="font-serif text-xs md:text-sm text-[#1A1A1A]/50 italic max-w-md mx-auto">
                  Please complete the booking registry to secure your reservation at L&apos;Étoile.
                </p>
              </div>

              {/* Input Forms */}
              <div className="space-y-4 text-left">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="font-sans text-[9px] tracking-widest uppercase text-[#1A1A1A]/60 font-semibold flex items-center space-x-1">
                    <User size={10} strokeWidth={1.5} />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Baroness Vivienne de Rothschild"
                    value={guestName}
                    onChange={(e) => {
                      setGuestName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    className={`w-full px-4 py-3 bg-[#FDFBF7] border rounded-none font-serif text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C5A880] transition-colors placeholder:text-[#1A1A1A]/20 ${
                      errors.name ? 'border-rose-500' : 'border-[#D5BDAF]/30'
                    }`}
                  />
                  {errors.name && <p className="text-[10px] font-sans text-rose-500">{errors.name}</p>}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="font-sans text-[9px] tracking-widest uppercase text-[#1A1A1A]/60 font-semibold flex items-center space-x-1">
                    <Mail size={10} strokeWidth={1.5} />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    placeholder="E.g., vivienne@rothschild.com"
                    value={guestEmail}
                    onChange={(e) => {
                      setGuestEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    className={`w-full px-4 py-3 bg-[#FDFBF7] border rounded-none font-serif text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C5A880] transition-colors placeholder:text-[#1A1A1A]/20 ${
                      errors.email ? 'border-rose-500' : 'border-[#D5BDAF]/30'
                    }`}
                  />
                  {errors.email && <p className="text-[10px] font-sans text-rose-500">{errors.email}</p>}
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="font-sans text-[9px] tracking-widest uppercase text-[#1A1A1A]/60 font-semibold flex items-center space-x-1">
                    <Phone size={10} strokeWidth={1.5} />
                    <span>Contact Number *</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="E.g., +33 1 42 74 75 75"
                    value={guestPhone}
                    onChange={(e) => {
                      setGuestPhone(e.target.value);
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    className={`w-full px-4 py-3 bg-[#FDFBF7] border rounded-none font-serif text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C5A880] transition-colors placeholder:text-[#1A1A1A]/20 ${
                      errors.phone ? 'border-rose-500' : 'border-[#D5BDAF]/30'
                    }`}
                  />
                  {errors.phone && <p className="text-[10px] font-sans text-rose-500">{errors.phone}</p>}
                </div>

                {/* Special Requests */}
                <div className="space-y-1">
                  <label className="font-sans text-[9px] tracking-widest uppercase text-[#1A1A1A]/60 font-semibold flex items-center space-x-1">
                    <FileText size={10} strokeWidth={1.5} />
                    <span>Special Requests / Dietary Mandates</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="E.g., Preferred table by the bay window; strict almond allergy."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FDFBF7] border border-[#D5BDAF]/30 rounded-none font-serif text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C5A880] transition-colors placeholder:text-[#1A1A1A]/20 resize-none"
                  />
                </div>
              </div>

              {/* Summary of selections */}
              <div className="bg-[#FDFBF7] border border-[#D5BDAF]/30 p-4 text-left">
                <h4 className="font-sans text-[9px] tracking-widest uppercase text-[#C5A880] font-semibold border-b border-[#D5BDAF]/20 pb-2 mb-3 flex items-center justify-between">
                  <span>Selected Schedule</span>
                  <Sparkles size={10} className="text-[#C5A880]" />
                </h4>
                <div className="grid grid-cols-3 gap-2 font-serif text-xs md:text-sm text-[#1A1A1A]/70">
                  <div>
                    <span className="font-sans text-[8px] tracking-widest uppercase text-[#1A1A1A]/40 block">Party Size</span>
                    <span className="font-medium text-[#1A1A1A]">{partySize} Guests</span>
                  </div>
                  <div>
                    <span className="font-sans text-[8px] tracking-widest uppercase text-[#1A1A1A]/40 block">Dining Date</span>
                    <span className="font-medium text-[#1A1A1A]">{selectedDate.split('-').slice(1).join('/')}</span>
                  </div>
                  <div>
                    <span className="font-sans text-[8px] tracking-widest uppercase text-[#1A1A1A]/40 block">Service Interval</span>
                    <span className="font-medium text-[#1A1A1A]">{selectedTime}</span>
                  </div>
                </div>
              </div>

              {/* Progress & Next Controls */}
              <div className="pt-6 border-t border-[#D5BDAF]/20 flex justify-between items-center">
                <button
                  onClick={handlePrevStep}
                  className="font-sans text-[10px] tracking-widest uppercase text-[#1A1A1A]/40 hover:text-[#1A1A1A] flex items-center space-x-1 cursor-pointer"
                >
                  <ArrowLeft size={12} strokeWidth={1.5} />
                  <span>Previous</span>
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitBooking}
                  className="px-8 py-4 bg-[#C5A880] hover:bg-[#b4966e] text-[#1A1A1A] font-sans text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 rounded-none flex items-center space-x-2 cursor-pointer shadow-md"
                >
                  <span>Confirm Reservation</span>
                  <Check size={12} strokeWidth={1.5} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* HIGH FIDELITY LOADING TRANSITION */}
          {step === 'loading' && (
            <motion.div
              key="loading-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-6 py-20"
            >
              <div className="relative flex items-center justify-center">
                <Loader2 size={44} className="text-[#C5A880] animate-spin" strokeWidth={1} />
                <div className="absolute font-serif text-[10px] text-[#C5A880]/80">24K</div>
              </div>
              <div className="space-y-2">
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#C5A880] animate-pulse">
                  Verifying Ledger Availability
                </p>
                <h3 className="font-serif text-2xl text-[#1A1A1A] font-light italic">
                  Confirming Your Culinary Experience...
                </h3>
              </div>
              <p className="font-serif text-xs text-[#1A1A1A]/40 italic max-w-xs mx-auto">
                Allocating pristine placement, table settings, and preparing our kitchen curators for your arrival.
              </p>
            </motion.div>
          )}

          {/* LUXURY RECEIPT CARD */}
          {step === 'success' && (
            <motion.div
              key="success-receipt"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 180 }}
              className="space-y-8"
            >
              {/* Receipt Wrapper with custom vintage serrated border-like shadow or frame */}
              <div className="bg-[#FDFBF7] border-[0.5px] border-[#D5BDAF]/50 p-8 md:p-12 shadow-[0_12px_40px_rgba(213,189,175,0.15)] relative overflow-hidden select-text text-left">
                {/* Vintage Gilded Seals */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C5A880] via-[#F5EBE0] to-[#C5A880]" />
                
                {/* Header Logo */}
                <div className="text-center space-y-3 pb-8 border-b border-[#D5BDAF]/20">
                  <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#C5A880] block">
                    Reservation Ledger
                  </span>
                  <h3 className="font-serif text-3xl text-[#1A1A1A] font-extralight tracking-tight">
                    Place Bakehouse & Coffee
                  </h3>
                  <div className="font-mono text-[9px] tracking-widest text-[#1A1A1A]/40 uppercase">
                    Ref: #PBHC-{(Math.floor(Math.random() * 90000) + 10000)}-2026
                  </div>
                </div>

                {/* Receipt Details Block */}
                <div className="py-8 space-y-6">
                  {/* Status Indicator */}
                  <div className="flex items-center justify-center space-x-2 bg-[#C5A880]/10 border-[0.5px] border-[#C5A880]/30 py-2.5 px-4 max-w-sm mx-auto">
                    <FileCheck size={14} className="text-[#C5A880]" strokeWidth={1.5} />
                    <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#C5A880] font-semibold">
                      Confirmed & Secured
                    </span>
                  </div>

                  {/* Fields list */}
                  <div className="space-y-4 pt-4">
                    {/* Guest Name */}
                    <div className="flex justify-between items-baseline border-b border-[#D5BDAF]/10 pb-2">
                      <span className="font-sans text-[9px] tracking-widest uppercase text-[#1A1A1A]/40">Host Guest</span>
                      <span className="font-serif text-sm font-medium text-[#1A1A1A]">{guestName}</span>
                    </div>

                    {/* Email */}
                    <div className="flex justify-between items-baseline border-b border-[#D5BDAF]/10 pb-2">
                      <span className="font-sans text-[9px] tracking-widest uppercase text-[#1A1A1A]/40">Secured Email</span>
                      <span className="font-mono text-xs text-[#1A1A1A]/70">{guestEmail}</span>
                    </div>

                    {/* Phone */}
                    <div className="flex justify-between items-baseline border-b border-[#D5BDAF]/10 pb-2">
                      <span className="font-sans text-[9px] tracking-widest uppercase text-[#1A1A1A]/40">Registered Phone</span>
                      <span className="font-mono text-xs text-[#1A1A1A]/70">{guestPhone}</span>
                    </div>

                    {/* Date */}
                    <div className="flex justify-between items-baseline border-b border-[#D5BDAF]/10 pb-2">
                      <span className="font-sans text-[9px] tracking-widest uppercase text-[#1A1A1A]/40">Date Assigned</span>
                      <span className="font-serif text-sm font-medium text-[#1A1A1A]">{getReadableDate(selectedDate)}</span>
                    </div>

                    {/* Time Slot */}
                    <div className="flex justify-between items-baseline border-b border-[#D5BDAF]/10 pb-2">
                      <span className="font-sans text-[9px] tracking-widest uppercase text-[#1A1A1A]/40">Seating Interval</span>
                      <span className="font-serif text-sm font-medium text-[#1A1A1A]">{selectedTime}</span>
                    </div>

                    {/* Party Size */}
                    <div className="flex justify-between items-baseline border-b border-[#D5BDAF]/10 pb-2">
                      <span className="font-sans text-[9px] tracking-widest uppercase text-[#1A1A1A]/40">Cover Count</span>
                      <span className="font-serif text-sm font-medium text-[#1A1A1A]">{partySize} Cover{partySize > 1 ? 's' : ''}</span>
                    </div>

                    {/* Special Requests */}
                    {specialRequests.trim() && (
                      <div className="pt-2">
                        <span className="font-sans text-[9px] tracking-widest uppercase text-[#1A1A1A]/40 block mb-1">
                          Special Accommodations
                        </span>
                        <p className="font-serif text-xs italic text-[#1A1A1A]/70 bg-[#F5EBE0]/30 p-3 border-l-2 border-[#C5A880] leading-relaxed">
                          &ldquo;{specialRequests}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Elegant Seal Footer */}
                <div className="border-t border-dashed border-[#D5BDAF]/40 pt-8 text-center space-y-4">
                  <p className="font-serif text-xs text-[#1A1A1A]/50 italic">
                    A verification token has been transmitted to your credentials. Present this receipt to the receptionist upon arrival. We look forward to hosting you.
                  </p>
                  <div className="font-sans text-[8px] tracking-[0.3em] uppercase text-[#C5A880]">
                    ★ ★ ★ ★ ★ Premium Boutique Hospitality
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onNavigateHome}
                  className="px-8 py-4 bg-[#1A1A1A] hover:bg-[#C5A880] text-white hover:text-[#1A1A1A] font-sans text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 rounded-none flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                >
                  <Compass size={14} strokeWidth={1.5} />
                  <span>Explore Menu</span>
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="px-8 py-4 border-[0.5px] border-[#1A1A1A]/40 hover:border-[#1A1A1A] text-[#1A1A1A] font-sans text-xs tracking-[0.2em] uppercase font-medium rounded-none transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Print Receipt</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Simple Clock Icon component to prevent imports that don't exist
function ClockIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
