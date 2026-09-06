import React from 'react';
import { Search, MapPin, Building, Shield, Award, Calendar, ArrowRight, Sparkles, SlidersHorizontal, Radio } from 'lucide-react';
import { FilterState } from '../types';
import { COMPANY_DETAILS } from '../data/properties';

interface HeroProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onSearchSubmit: () => void;
  onOpenBooking: () => void;
  onOpenAiAssistant: (mode?: 'voice' | 'text') => void;
}

export const Hero: React.FC<HeroProps> = ({
  filters,
  onFilterChange,
  onSearchSubmit,
  onOpenBooking,
  onOpenAiAssistant,
}) => {
  return (
    <section id="hero-section" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background Architectural Luxury Image & Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury Architecture AS Realty"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.38] contrast-[1.08]"
        />
        {/* Deep Editorial Navy and Gold Ambient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#002347] via-[#002347]/90 to-[#002347]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#002347] via-transparent to-[#002347]/65" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Prestige Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#001730]/90 border border-[#C5A059]/50 backdrop-blur-md mb-6 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#E6C687]" />
          <span className="text-xs uppercase tracking-widest text-[#E6C687] font-semibold">
            Nagpur Premier Real Estate Advisory
          </span>
          <span className="w-1 h-1 rounded-full bg-[#C5A059]" />
          <span className="text-xs text-slate-200 font-medium">Amit Shivpeth</span>
        </div>

        {/* High-Impact Headline */}
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif-luxury font-bold text-white tracking-tight leading-[1.08]">
            Defining Elite Living in <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#E6C687] via-[#D4AF37] to-[#C5A059]">Nagpur</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-200 font-light leading-relaxed max-w-2xl">
            Curating Nagpur’s most prestigious architectural marvels, sky penthouses, and bespoke private estates across Civil Lines, Ramdaspeth, and Dharampeth.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            id="hero-schedule-visit-btn"
            onClick={onOpenBooking}
            className="flex items-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#E6C687] hover:from-[#B8924B] hover:to-[#D9B97A] text-[#002347] font-bold text-sm tracking-wider uppercase shadow-xl shadow-[#C5A059]/25 transition-all transform active:scale-95 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#002347]" />
            <span>Schedule VIP Site Visit</span>
          </button>

          <button
            id="hero-call-pa-btn"
            onClick={() => onOpenAiAssistant('voice')}
            className="flex items-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm tracking-wider uppercase shadow-xl transition-all transform active:scale-95 cursor-pointer"
          >
            <Radio className="w-4 h-4 text-[#E6C687] animate-pulse" />
            <span>Speak with Amit Sir's PA (Live Voice)</span>
          </button>

          <a
            href="#featured-properties-section"
            className="flex items-center gap-2 px-6 py-4 rounded-xl bg-[#001730]/85 hover:bg-[#001730] border border-[#C5A059]/40 text-white font-medium text-sm tracking-wider transition-all"
          >
            <span>Explore Nagpur Portfolio</span>
            <ArrowRight className="w-4 h-4 text-[#E6C687]" />
          </a>
        </div>

        {/* Search / Filter Bar Component - Editorial Elevated Card */}
        <div className="mt-12 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 border-b-4 border-b-[#002347] shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Location Selector */}
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#002347] mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                Nagpur Location
              </label>
              <select
                id="hero-location-filter"
                value={filters.location}
                onChange={(e) => onFilterChange({ location: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#C5A059] focus:bg-white cursor-pointer"
              >
                <option value="all">All Locations</option>
                <option value="Seminary Hills">Seminary Hills</option>
                <option value="Gandhi Nagar">Gandhi Nagar</option>
                <option value="Dharampeth">Dharampeth</option>
                <option value="Lakadganj">Lakadganj</option>
                <option value="Laxmi Nagar">Laxmi Nagar</option>
                <option value="Civil Lines">Civil Lines</option>
                <option value="Ramdaspeth">Ramdaspeth</option>
                <option value="Besa">Besa</option>
                <option value="Beltarodi">Beltarodi</option>
                <option value="Manish Nagar">Manish Nagar</option>
                <option value="Narendra Nagar">Narendra Nagar</option>
                <option value="Wardha Road">Wardha Road</option>
                <option value="MIHAN">MIHAN</option>
                <option value="Hingna">Hingna / Hingna Road</option>
                <option value="Friends Colony">Friends Colony</option>
                <option value="Wardhaman Nagar">Wardhaman Nagar</option>
              </select>
            </div>

            {/* Typology / Size */}
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#002347] mb-1.5 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#C5A059]" />
                Configuration / Typology
              </label>
              <select
                id="hero-typology-filter"
                value={filters.typology}
                onChange={(e) => onFilterChange({ typology: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#C5A059] focus:bg-white cursor-pointer font-medium"
              >
                <option value="all">All Configurations</option>
                <option value="1 BHK">1 BHK Residences</option>
                <option value="2 BHK">2 BHK Residences</option>
                <option value="3 BHK">3 BHK Luxury Homes</option>
                <option value="4 BHK">4 BHK Penthouses</option>
                <option value="Villa">Villas &amp; Row Houses</option>
                <option value="Plot">Plots (Residential &amp; Commercial)</option>
                <option value="Farm / Field">Farm / Field (Agro Land &amp; Farmhouses)</option>
              </select>
            </div>

            {/* Price Bracket */}
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#002347] mb-1.5 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
                Price Bracket
              </label>
              <select
                id="hero-price-filter"
                value={filters.priceRange}
                onChange={(e) => onFilterChange({ priceRange: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#C5A059] focus:bg-white cursor-pointer"
              >
                <option value="all">All Price Ranges</option>
                <option value="under-50l">Under ₹50 Lakhs</option>
                <option value="50l-1cr">₹50 Lakhs – ₹1 Crore</option>
                <option value="1cr-2cr">₹1 Crore – ₹2 Crore</option>
                <option value="above-2cr">₹2 Crore & Above</option>
              </select>
            </div>

            {/* Search CTA */}
            <div className="flex flex-col justify-end">
              <button
                id="hero-search-properties-btn"
                onClick={onSearchSubmit}
                className="w-full h-[42px] flex items-center justify-center gap-2 px-5 rounded-xl bg-[#002347] hover:bg-[#001730] text-[#E6C687] font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Filter Nagpur Properties</span>
              </button>
            </div>
          </div>
        </div>

        {/* High-Status Trust Metrics Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-white/15 text-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#001730] border border-[#C5A059]/40 text-[#E6C687] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-serif-luxury font-bold text-white">100% MahaRERA</p>
              <p className="text-xs text-slate-300">Nagpur Verified Title Records</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#001730] border border-[#C5A059]/40 text-[#E6C687] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-serif-luxury font-bold text-white">₹250+ Cr</p>
              <p className="text-xs text-slate-300">Curated Nagpur Prime Portfolio</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#001730] border border-[#C5A059]/40 text-[#E6C687] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-serif-luxury font-bold text-white">Nagpur Exclusive</p>
              <p className="text-xs text-slate-300">Bespoke HNI Advisory Desk</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#001730] border border-[#C5A059]/40 text-[#E6C687] shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg sm:text-xl font-serif-luxury font-bold text-white">Direct Scheduling</p>
              <p className="text-xs text-slate-300">VIP Nagpur Site Visits</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
