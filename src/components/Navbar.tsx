import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageSquare, Building, ShieldCheck, ChevronRight, Instagram, Radio, Sparkles } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/properties';

interface NavbarProps {
  onOpenBooking: (propertyName?: string) => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenAiAssistant: (mode?: 'voice' | 'text') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onScrollToSection, onOpenAiAssistant }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Featured Residences', id: 'featured-properties-section' },
    { name: 'About AS Realty', id: 'about-us-section' },
    { name: 'Founder Profile', id: 'founder-section' },
    { name: 'Private Services', id: 'services-section' },
    { name: 'Contact & Offices', id: 'contact-section' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onScrollToSection(id);
  };

  return (
    <header
      id="main-navigation-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#002347]/95 backdrop-blur-md border-b border-[#C5A059]/30 py-3 shadow-lg shadow-[#002347]/30'
          : 'bg-[#002347] py-4 border-b border-[#001730]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* Custom Gold Monogram Crest */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#001730] border border-[#C5A059]/70 flex items-center justify-center shadow-md group-hover:border-[#E6C687] transition-all">
            <span className="font-cinzel text-lg sm:text-xl font-bold tracking-tighter text-[#E6C687]">
              AS
            </span>
          </div>

          <div>
            <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-widest text-white flex items-center gap-1.5">
              AS <span className="text-[#C5A059]">REALTY</span>
            </span>
            <span className="block text-[10px] text-slate-300 uppercase tracking-wider font-sans">
              Amit Shivpeth
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="text-xs uppercase tracking-widest text-slate-200 hover:text-[#E6C687] font-medium transition-colors cursor-pointer py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#C5A059] hover:after:w-full after:transition-all"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Action Group: AI PA Voice, Instagram, Phone & Schedule Button */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            id="nav-call-pa-button"
            onClick={() => onOpenAiAssistant('voice')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold tracking-wide shadow-md transition-all cursor-pointer group"
            title="Speak with Amit Sir's PA & Property Expert in real-time"
          >
            <Radio className="w-3.5 h-3.5 text-[#E6C687] animate-pulse" />
            <span>Amit Sir's PA</span>
            <span className="hidden xl:inline text-[10px] px-1.5 py-0.2 rounded bg-black/20 text-[#E6C687] font-mono">
              Live Voice
            </span>
          </button>

          <a
            id="nav-instagram-button"
            href="https://www.instagram.com/asrealty.official?igsi=MXhteGNhM3Y0YjBmcg=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#001730] border border-[#C5A059]/40 hover:border-[#E6C687] text-xs font-semibold text-slate-200 hover:text-[#E6C687] transition-all group"
            title="Follow us on Instagram @asrealty.official"
          >
            <Instagram className="w-3.5 h-3.5 text-[#E6C687] group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">Follow us</span>
          </a>

          <a
            href={`https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent('Hello AS Realty, I am interested in inquiring about your luxury property portfolio.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#001730] border border-[#C5A059]/40 hover:border-[#C5A059] text-xs font-semibold text-slate-200 transition-all"
            title="Chat directly on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>{COMPANY_DETAILS.phoneDisplay}</span>
          </a>

          <button
            id="nav-contact-us-button"
            onClick={() => onOpenBooking()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#E6C687] hover:from-[#B8924B] hover:to-[#D9B97A] text-[#002347] font-bold text-xs uppercase tracking-wider shadow-md shadow-[#C5A059]/20 transition-all transform active:scale-95 cursor-pointer"
          >
            <Building className="w-3.5 h-3.5 text-[#002347]" />
            <span>Meeting</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => onOpenBooking()}
            className="px-3 py-1.5 rounded-lg bg-[#C5A059] text-[#002347] font-bold text-[11px] uppercase tracking-wider"
          >
            Book Visit
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#001730] border border-white/15 text-slate-200 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#002347] border-b border-[#C5A059]/30 px-6 py-6 space-y-4 backdrop-blur-xl animate-fadeIn">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="flex items-center justify-between text-left py-2.5 text-sm uppercase tracking-wider text-slate-200 hover:text-[#E6C687] border-b border-white/10"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="pt-2 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAiAssistant('voice');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-md"
            >
              <Radio className="w-4 h-4 text-[#E6C687] animate-pulse" />
              <span>Speak with Amit Sir's PA (Live Voice)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#E6C687] text-[#002347] font-bold text-sm shadow-md"
            >
              <Building className="w-4 h-4" />
              <span>Schedule Site Visit (WhatsApp)</span>
            </button>

            <a
              href={`https://wa.me/${COMPANY_DETAILS.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp: {COMPANY_DETAILS.phoneDisplay}</span>
            </a>

            <a
              id="mobile-nav-instagram-button"
              href="https://www.instagram.com/asrealty.official?igsi=MXhteGNhM3Y0YjBmcg=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-[#833ab4]/25 via-[#fd1d1d]/25 to-[#fcb045]/25 border border-[#E6C687]/40 text-white font-medium text-sm"
            >
              <Instagram className="w-4 h-4 text-[#E6C687]" />
              <span>Follow us on Instagram (@asrealty.official)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
