import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Clock, Send, ShieldCheck, CheckCircle2, Instagram } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/properties';

interface ContactSectionProps {
  onOpenBooking: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenBooking }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Civil Lines Grand Sky Penthouses');
  const [message, setMessage] = useState('');

  const handleDirectWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedMessage = `Hello AS Realty,\nI would like to inquire regarding luxury real estate advisory with Amit Shivpeth.\n👤 Name: ${name.trim()}\n📱 Phone: ${phone.trim() || 'Not specified'}\n🏢 Interest: ${interest}\n💬 Message: ${message.trim() || 'Please arrange a call back.'}`;
    const url = `https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent(formattedMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact-section" className="py-20 bg-white relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details & Leadership Column */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002347] border border-[#C5A059]/40 text-xs text-[#E6C687] uppercase tracking-widest font-semibold mb-3">
                Private Advisory
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#002347] tracking-tight">
                Connect with AS Realty
              </h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed max-w-lg">
                Whether you are exploring private acquisitions in Civil Lines, seeking high-floor penthouses in Ramdaspeth, or arranging a confidential meeting with <strong className="text-[#002347] font-semibold">Amit Shivpeth</strong>, our executive desk is at your service.
              </p>
            </div>

            {/* Direct Channel Cards */}
            <div className="space-y-4">
              {/* WhatsApp Direct */}
              <a
                href={`https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent('Hello AS Realty, I would like to schedule a private advisory meeting.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[#F8F9FA] border border-slate-200 border-b-4 border-b-emerald-600 hover:border-b-emerald-500 transition-all flex items-start gap-4 group block shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-emerald-600 font-bold">
                      Instant WhatsApp Concierge
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Average Reply &lt; 15 mins</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#002347] mt-0.5 group-hover:text-emerald-700 transition-colors">
                    {COMPANY_DETAILS.phoneDisplay}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Direct line for site visits, portfolio dossiers, and meeting coordination.
                  </p>
                </div>
              </a>

              {/* Direct Email */}
              <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-slate-200 border-b-4 border-b-[#002347] flex items-start gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#002347] text-[#E6C687] border border-[#C5A059]/40 flex items-center justify-center shrink-0 shadow-sm">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
                    Confidential Dossier Inquiries
                  </span>
                  <a
                    href={`mailto:${COMPANY_DETAILS.email}`}
                    className="text-base font-bold text-[#002347] hover:text-[#C5A059] transition-colors block mt-0.5"
                  >
                    {COMPANY_DETAILS.email}
                  </a>
                  <p className="text-xs text-slate-600 mt-1">
                    Formal RFPs, developer correspondence, and institutional mandates.
                  </p>
                </div>
              </div>

              {/* Instagram Channel */}
              <a
                id="contact-instagram-card"
                href="https://www.instagram.com/asrealty.official?igsi=MXhteGNhM3Y0YjBmcg=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[#F8F9FA] border border-slate-200 border-b-4 border-b-[#002347] hover:border-[#C5A059] flex items-start gap-4 shadow-sm transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-[#002347] text-[#E6C687] border border-[#C5A059]/40 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Instagram className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
                    Official Social Desk
                  </span>
                  <span className="text-base font-bold text-[#002347] group-hover:text-[#C5A059] transition-colors block mt-0.5">
                    Follow us on Instagram
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    Follow <strong className="text-[#002347] font-semibold">@asrealty.official</strong> for exclusive project walkthroughs and architecture highlights.
                  </p>
                </div>
              </a>
            </div>

            {/* Office Locations */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#002347] mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                Private Advisory Suites
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COMPANY_DETAILS.offices.map((office, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#F8F9FA] border border-slate-200 text-xs">
                    <span className="font-bold text-[#002347] block mb-1">{office.city}</span>
                    <span className="text-slate-600 leading-relaxed block">{office.address}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Direct WhatsApp Inquiry Form */}
          <div className="lg:col-span-6 bg-[#F8F9FA] border border-slate-200 border-b-4 border-b-[#002347] rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#002347]">
                  Direct Advisory Request
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Pre-fills and connects to Amit Shivpeth on WhatsApp
                </p>
              </div>
              <span className="p-2 rounded-lg bg-[#002347] text-[#E6C687]">
                <ShieldCheck className="w-5 h-5" />
              </span>
            </div>

            <form onSubmit={handleDirectWhatsAppSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#002347] font-bold mb-1.5">
                  Your Name <span className="text-amber-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikramaditya Oberoi"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#002347] font-bold mb-1.5">
                  Contact Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#002347] font-bold mb-1.5">
                  Interest Category
                </label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-[#C5A059] cursor-pointer"
                >
                  <option value="Civil Lines Grand Sky Penthouses">Civil Lines Grand Sky Penthouses</option>
                  <option value="Ramdaspeth Luxury High-Rise Residences">Ramdaspeth Luxury High-Rise Residences</option>
                  <option value="Dharampeth Garden Duplexes">Dharampeth Garden Duplexes</option>
                  <option value="Gated Sanctioned Plots (MIHAN, Hingna, Besa, Samruddhi)">Gated Sanctioned Plots (MIHAN, Hingna, Besa, Samruddhi)</option>
                  <option value="Agricultural Farmland, Fields & Country Estates (Pench, Katol, Umred)">Agricultural Farmland, Fields &amp; Country Estates (Pench, Katol, Umred)</option>
                  <option value="Byramji Town & Sadar Private Manors">Byramji Town & Sadar Private Manors</option>
                  <option value="Seminary Hills Forest Ridge Villas">Seminary Hills Forest Ridge Villas</option>
                  <option value="Wardha Road & MIHAN High-Rise Mansions">Wardha Road & MIHAN High-Rise Mansions</option>
                  <option value="Confidential Nagpur HNI Asset Acquisition">Confidential Nagpur HNI Asset Acquisition</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#002347] font-bold mb-1.5">
                  Specific Requirements or Preferred Timing
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g., Looking for a ready-to-move 4+ BHK sky residence in Civil Lines or Ramdaspeth, budget ₹4-8 Cr."
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send WhatsApp Inquiry (+91 87883 75434)</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="text-xs text-slate-600 hover:text-[#002347] underline font-medium cursor-pointer transition-colors"
                >
                  Or click here to book a formal Site Visit appointment with Date & Time
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
