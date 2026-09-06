import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Building2, User, Send, CheckCircle2, MessageSquare, Copy } from 'lucide-react';
import { Property } from '../types';
import { COMPANY_DETAILS } from '../data/properties';

interface WhatsAppBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPropertyName?: string;
  properties: Property[];
}

export const WhatsAppBookingModal: React.FC<WhatsAppBookingModalProps> = ({
  isOpen,
  onClose,
  selectedPropertyName,
  properties,
}) => {
  const [fullName, setFullName] = useState('');
  const [propertyName, setPropertyName] = useState(selectedPropertyName || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [customTime, setCustomTime] = useState('');
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Set default date to tomorrow in YYYY-MM-DD
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Sync selectedPropertyName when modal opens or property changes
  useEffect(() => {
    if (selectedPropertyName) {
      setPropertyName(selectedPropertyName);
    } else if (properties.length > 0 && !propertyName) {
      setPropertyName(properties[0].name || properties[0].title);
    }
  }, [selectedPropertyName, properties]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setCopied(false);
      if (!fullName) setFullName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const finalTime = useCustomTime ? (customTime || '11:00 AM') : selectedTime;

  // Format date nicely (e.g. "Saturday, 5 September 2026")
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'Pending Selection';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Pre-formatted WhatsApp message as strictly requested in prompt 2:
  const generateWhatsAppMessage = () => {
    const formattedDate = formatDisplayDate(selectedDate);
    return `Hello AS Realty, I would like to book an appointment for a site visit/meeting.\n👤 Name: ${fullName.trim() || '[Your Name]'}\n🏢 Property: ${propertyName || '[Property Name]'}\n📅 Date: ${formattedDate}\n⏰ Time: ${finalTime}`;
  };

  const whatsappMessage = generateWhatsAppMessage();
  const whatsappUrl = `https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    // Trigger WhatsApp link
    const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);

    // Fallback if popup blocker interfered
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = whatsappUrl;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const timeSlots = [
    '10:30 AM (Morning Slot)',
    '01:00 PM (Afternoon Slot)',
    '04:00 PM (Tea & Sunset Slot)',
    '06:00 PM (Evening Twilight)',
  ];

  return (
    <div
      id="whatsapp-booking-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#001730]/60 backdrop-blur-md transition-all duration-300 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="whatsapp-booking-modal-container"
        className="relative w-full max-w-xl my-8 bg-white border border-slate-200 border-b-4 border-b-[#002347] rounded-2xl shadow-2xl text-slate-800 overflow-hidden"
      >
        {/* Top Gold Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#9E7D3B] via-[#E5C378] to-[#9E7D3B]" />

        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 flex items-start justify-between border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#002347] text-[#E6C687] border border-[#C5A059]/40 uppercase tracking-widest">
                VIP Appointment
              </span>
              <span className="text-xs text-slate-500 font-medium">Direct Concierge</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#002347] tracking-wide">
              Schedule a Site Visit
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Connect directly with <strong className="text-[#002347] font-semibold">{COMPANY_DETAILS.name}</strong> under the leadership of <strong className="text-[#002347] font-semibold">{COMPANY_DETAILS.founder}</strong>.
            </p>
          </div>

          <button
            id="close-booking-modal-button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 pt-6 max-h-[75vh] overflow-y-auto">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Client Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#002347] mb-2">
                  1. Full Name <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="booking-client-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Rajesh Singhania"
                    className="w-full pl-10 pr-4 py-3 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors"
                  />
                </div>
              </div>

              {/* Selected Property Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#002347] mb-2">
                  2. Selected Property <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <select
                    id="booking-property-name"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors appearance-none cursor-pointer"
                  >
                    {properties.map((prop) => (
                      <option key={prop.id} value={prop.name || prop.title} className="bg-white text-slate-800">
                        {prop.name || prop.title} — {prop.location} ({prop.price})
                      </option>
                    ))}
                    <option value="General Luxury Portfolio Consultation" className="bg-white text-slate-800">
                      General Luxury Portfolio Consultation (Custom Search)
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#002347] mb-2">
                  3. Preferred Date for Visit / Meeting <span className="text-amber-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    id="booking-selected-date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors"
                  />
                </div>
              </div>

              {/* Time Slot Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#002347]">
                    4. Preferred Time <span className="text-amber-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseCustomTime(!useCustomTime)}
                    className="text-xs text-slate-500 hover:text-[#002347] underline font-medium transition-colors cursor-pointer"
                  >
                    {useCustomTime ? 'Select curated slots' : 'Enter specific time'}
                  </button>
                </div>

                {!useCustomTime ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`flex items-center gap-2 p-3 text-left rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#002347] border-[#002347] text-[#E6C687] shadow-sm'
                              : 'bg-[#F8F9FA] border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-[#E6C687]' : 'text-slate-400'}`} />
                          <span className="truncate">{slot}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 03:30 PM (or specific hour)"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                    />
                  </div>
                )}
              </div>

              {/* Live Preview Box of WhatsApp message */}
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-slate-200 text-xs text-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 font-bold text-[#002347] text-[11px] uppercase tracking-wider">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    WhatsApp Message Preview
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#002347] font-semibold transition-colors cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-xs bg-white p-3 rounded-lg border border-slate-200 text-slate-700 select-all leading-relaxed">
                  {whatsappMessage}
                </pre>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2">
                <button
                  id="submit-whatsapp-booking-btn"
                  type="submit"
                  disabled={!fullName.trim()}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Book Visit</span>
                </button>
                <p className="text-center text-[11px] text-slate-500 mt-2.5 font-medium">
                  Opens WhatsApp directly with your pre-formatted booking details.
                </p>
              </div>
            </form>
          ) : (
            /* Confirmation & Fallback View */
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-2xl font-serif-luxury font-bold text-[#002347]">
                  WhatsApp Launch Initiated
                </h4>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Thank you, <strong className="text-[#002347]">{fullName}</strong>. If WhatsApp did not open automatically on your device, click the button below:
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-slate-200 text-left max-w-md mx-auto text-xs text-slate-700 font-sans whitespace-pre-wrap">
                {whatsappMessage}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  Open WhatsApp Chat
                </a>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#002347] font-bold text-xs uppercase tracking-wider transition-all border border-slate-200"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied to Clipboard!' : 'Copy Text'}
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="text-xs text-slate-500 hover:text-[#002347] font-semibold transition-colors cursor-pointer"
                >
                  Return to Properties
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
