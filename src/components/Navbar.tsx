import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Phone,
  MessageSquare,
  Building,
  ShieldCheck,
  ChevronRight,
  Instagram,
  Radio,
  Sparkles,
  Database,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Lock,
} from 'lucide-react';
import { COMPANY_DETAILS } from '../data/properties';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenBooking: (propertyName?: string) => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenAiAssistant: (mode?: 'voice' | 'text') => void;
  onOpenSupabase?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onScrollToSection,
  onOpenAiAssistant,
  onOpenSupabase,
}) => {
  const { user, profile, openAuthModal, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

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

          {onOpenSupabase && (
            <button
              id="nav-supabase-desk-btn"
              onClick={onOpenSupabase}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#001730] border border-emerald-500/40 hover:border-emerald-400 text-xs font-semibold text-emerald-300 hover:text-white transition-all cursor-pointer"
              title="Open Supabase CRM Desk"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Supabase CRM</span>
            </button>
          )}

          {/* VIP Client Auth Button / Dropdown */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                id="nav-user-profile-button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#001730] border border-[#C5A059]/60 hover:border-[#E6C687] text-slate-200 transition-all cursor-pointer"
                title="VIP Client Account Menu"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E6C687] text-[#002347] font-bold text-xs flex items-center justify-center">
                  {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline text-xs font-semibold max-w-[100px] truncate">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#C5A059] transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 text-slate-800 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-slate-100 bg-[#F8F9FA]">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#C5A059] block">
                      VIP Client Member
                    </span>
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {profile?.full_name || 'Valued Client'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">
                      {user.email}
                    </p>
                    {profile?.phone && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {profile.phone}
                      </p>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenBooking();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                    >
                      <Building className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Schedule VIP Site Visit</span>
                    </button>

                    {onOpenSupabase && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenSupabase();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                      >
                        <Database className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Supabase CRM Desk</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await logout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium hover:bg-red-50 flex items-center gap-2.5 text-red-600 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              id="nav-signin-button"
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#001730] border border-[#C5A059]/40 hover:border-[#E6C687] text-xs font-semibold text-slate-200 hover:text-[#E6C687] transition-all cursor-pointer group"
              title="Sign In or Register VIP Account"
            >
              <Lock className="w-3.5 h-3.5 text-[#C5A059] group-hover:scale-110 transition-transform" />
              <span>Sign In</span>
            </button>
          )}
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

            {onOpenSupabase && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSupabase();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#001730] border border-emerald-500/40 text-emerald-300 font-semibold text-xs"
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Supabase CRM &amp; Database Desk</span>
              </button>
            )}

            {/* Mobile Auth Button */}
            {user ? (
              <div className="p-3 rounded-xl bg-[#001730] border border-[#C5A059]/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#C5A059] block">
                      Logged In VIP Client
                    </span>
                    <span className="text-xs font-bold text-white block">
                      {profile?.full_name || 'Client'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      {user.email}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#C5A059] text-[#002347] font-bold text-xs flex items-center justify-center">
                    {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                  }}
                  className="w-full py-2 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 hover:text-red-200 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#001730] border border-[#C5A059]/60 text-[#E6C687] font-bold text-xs uppercase tracking-wider"
              >
                <Lock className="w-4 h-4 text-[#C5A059]" />
                <span>VIP Client Portal (Sign In / Register)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
