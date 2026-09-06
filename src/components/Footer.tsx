import React from 'react';
import { COMPANY_DETAILS } from '../data/properties';
import { ShieldCheck, MessageSquare, ArrowUp, Instagram, Linkedin, Youtube } from 'lucide-react';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection, onOpenBooking }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#002347] border-t-2 border-[#C5A059]/40 text-slate-300 text-xs">
      {/* Top Banner */}
      <div className="border-b border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#001730] border border-[#C5A059]/50 flex items-center justify-center font-cinzel text-[#E6C687] font-bold text-sm">
              AS
            </div>
            <div>
              <span className="font-cinzel text-lg font-bold text-white tracking-wider block">
                AS REALTY
              </span>
              <span className="text-[11px] text-slate-300">
                Under the Leadership of Amit Shivpeth
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent('Hello AS Realty, I would like to connect with your luxury advisory desk.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#001730] border border-emerald-400/40 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp: {COMPANY_DETAILS.phoneDisplay}</span>
            </a>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-[#001730] border border-white/15 hover:border-[#C5A059] text-slate-200 hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Summary */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white font-cinzel">
            Defining Elite Living
          </h4>
          <p className="text-slate-300 leading-relaxed text-xs">
            AS Realty is Nagpur’s dedicated boutique luxury real estate advisory, representing the finest residences across Civil Lines, Ramdaspeth, Dharampeth, Byramji Town, and Seminary Hills.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#E6C687] pt-1 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>100% MahaRERA Registered Nagpur Properties</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#E6C687]">
            Nagpur Portfolios
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onScrollToSection('featured-properties-section')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Civil Lines Sky Penthouses
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('featured-properties-section')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Ramdaspeth High-Rise Residences
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('featured-properties-section')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Dharampeth Garden Duplexes
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('featured-properties-section')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Byramji Town Private Manors
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('featured-properties-section')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Wardha Road & MIHAN Mansions
              </button>
            </li>
          </ul>
        </div>

        {/* Company & Founder */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#E6C687]">
            Leadership & Values
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onScrollToSection('founder-section')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                About Amit Shivpeth
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('about-us-section')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                Due Diligence Framework
              </button>
            </li>
            <li>
              <button
                onClick={() => onScrollToSection('services-section')}
                className="hover:text-white transition-colors text-left cursor-pointer"
              >
                VIP Chauffeur Site Visits
              </button>
            </li>
            <li>
              <button
                onClick={onOpenBooking}
                className="hover:text-[#E6C687] text-white font-medium transition-colors text-left cursor-pointer"
              >
                Schedule Meeting on WhatsApp
              </button>
            </li>
          </ul>
        </div>

        {/* Social & Verification */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-[#E6C687]">
            Connect &amp; Follow
          </h4>
          <p className="text-xs text-slate-300">
            Follow private showcases and curated architectural tours across our channels.
          </p>
          <div className="pt-1 space-y-2">
            <a
              href="https://www.instagram.com/asrealty.official?igsi=MXhteGNhM3Y0YjBmcg=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#833ab4]/30 via-[#fd1d1d]/30 to-[#fcb045]/30 border border-[#E6C687]/50 hover:border-[#E6C687] text-white hover:text-[#E6C687] text-xs font-semibold transition-all group shadow-sm"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-4 h-4 text-[#E6C687] group-hover:scale-110 transition-transform" />
              <span>Follow us @asrealty.official</span>
            </a>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/asrealty.official?igsi=MXhteGNhM3Y0YjBmcg=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#001730] border border-white/15 hover:border-[#C5A059] text-slate-200 hover:text-[#E6C687] transition-all"
                aria-label="Instagram"
                title="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#001730] border border-white/15 hover:border-[#C5A059] text-slate-200 hover:text-[#E6C687] transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#001730] border border-white/15 hover:border-[#C5A059] text-slate-200 hover:text-[#E6C687] transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* RERA Disclaimer & Copyright */}
      <div className="border-t border-white/10 py-6 bg-[#001730]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong>Disclaimer:</strong> AS Realty (Owned by Amit Shivpeth) is an authorized luxury real estate advisory and facilitation firm. All property details, architectural perspectives, floor plans, and pricing are indicative and subject to verification against official developer RERA disclosures. Registration certificates and project sanctions are available for inspection upon private meeting.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-white/10 text-[11px] text-slate-400">
            <span>© {new Date().getFullYear()} AS Realty. All Rights Reserved. Owned by Amit Shivpeth.</span>
            <span>Crafted for Discerning Connoisseurs of Architecture.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
