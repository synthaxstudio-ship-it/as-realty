import React, { useMemo } from 'react';
import { Property, FilterState } from '../types';
import { PropertyCard } from './PropertyCard';
import { SlidersHorizontal, MapPin, IndianRupee, Home, Search, RefreshCcw, Sparkles } from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onBookNow: (property: Property) => void;
  onViewDetails: (property: Property) => void;
  onAskPA: (property: Property) => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  filters,
  onFilterChange,
  onBookNow,
  onViewDetails,
  onAskPA,
}) => {
  // Dynamically extract unique sorted locations from properties
  const availableLocations = useMemo(() => {
    const locs = Array.from<string>(new Set(properties.map((p) => p.location))).filter(
      (loc): loc is string => Boolean(loc)
    );
    return locs.sort((a, b) => a.localeCompare(b));
  }, [properties]);

  // Typology / Configuration options
  const typologyOptions = [
    { label: 'All', value: 'all' },
    { label: '1 BHK', value: '1 BHK' },
    { label: '2 BHK', value: '2 BHK' },
    { label: '3 BHK', value: '3 BHK' },
    { label: '4 BHK', value: '4 BHK' },
    { label: 'Villa', value: 'Villa' },
    { label: 'Plot', value: 'Plot' },
    { label: 'Farm / Field', value: 'Farm / Field' },
  ];

  // Dynamic filter logic
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // 1. Location Filter
      if (filters.location && filters.location !== 'all') {
        if (prop.location.toLowerCase() !== filters.location.toLowerCase()) {
          return false;
        }
      }

      // 2. Typology / Configuration Filter
      if (filters.typology && filters.typology !== 'all') {
        const typeLower = (prop.type || '').toLowerCase();
        const bhkLower = (prop.bhk || '').toLowerCase();

        if (filters.typology === 'Farm / Field') {
          const isFarmField =
            bhkLower.includes('farm') ||
            bhkLower.includes('field') ||
            typeLower.includes('farm') ||
            typeLower.includes('field') ||
            typeLower.includes('agro') ||
            typeLower.includes('agri') ||
            typeLower.includes('orchard') ||
            typeLower.includes('farmland');
          if (!isFarmField) return false;
        } else if (filters.typology === 'Plot') {
          const isFarmField =
            bhkLower.includes('farm') ||
            bhkLower.includes('field') ||
            typeLower.includes('farm') ||
            typeLower.includes('field') ||
            typeLower.includes('agro') ||
            typeLower.includes('agri') ||
            typeLower.includes('orchard') ||
            typeLower.includes('farmland');
          const isPlot =
            !isFarmField &&
            (bhkLower.includes('plot') ||
              typeLower.includes('plot') ||
              (typeLower.includes('land') && !typeLower.includes('island')));
          if (!isPlot) return false;
        } else if (filters.typology === 'Villa') {
          const isVilla =
            typeLower.includes('villa') ||
            typeLower.includes('row house') ||
            typeLower.includes('bungalow') ||
            bhkLower.includes('villa');
          if (!isVilla) return false;
        } else if (filters.typology === '1 BHK') {
          const has1BHK = bhkLower.includes('1') && (bhkLower.includes('bhk') || bhkLower.includes('flats'));
          if (!has1BHK) return false;
        } else if (filters.typology === '2 BHK') {
          const has2BHK = bhkLower.includes('2') && (bhkLower.includes('bhk') || bhkLower.includes('flats'));
          if (!has2BHK) return false;
        } else if (filters.typology === '3 BHK') {
          const has3BHK =
            (bhkLower.includes('3') || bhkLower.includes('3.5')) &&
            (bhkLower.includes('bhk') || bhkLower.includes('flats'));
          if (!has3BHK) return false;
        } else if (filters.typology === '4 BHK') {
          const has4BHK = bhkLower.includes('4') && (bhkLower.includes('bhk') || bhkLower.includes('flats'));
          if (!has4BHK) return false;
        }
      }

      // 3. Price Range Filter
      if (filters.priceRange && filters.priceRange !== 'all') {
        const val = prop.price_value;
        const isPriceOnRequest = (prop.price || '').toLowerCase().includes('request') || val === 0;

        if (filters.priceRange === 'under-50l') {
          if (isPriceOnRequest || val <= 0 || val >= 5000000) return false;
        } else if (filters.priceRange === '50l-1cr') {
          if (isPriceOnRequest || val < 5000000 || val >= 10000000) return false;
        } else if (filters.priceRange === '1cr-2cr') {
          if (isPriceOnRequest || val < 10000000 || val >= 20000000) return false;
        } else if (filters.priceRange === 'above-2cr') {
          if (!isPriceOnRequest && val < 20000000) return false;
        }
      }

      // 4. Search Query Filter
      if (filters.searchQuery && filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesName = (prop.name || prop.title || '').toLowerCase().includes(q);
        const matchesLoc = (prop.location || '').toLowerCase().includes(q);
        const matchesBhk = (prop.bhk || '').toLowerCase().includes(q);
        const matchesType = (prop.type || '').toLowerCase().includes(q);
        const matchesPrice = (prop.price || '').toLowerCase().includes(q);

        if (!matchesName && !matchesLoc && !matchesBhk && !matchesType && !matchesPrice) {
          return false;
        }
      }

      return true;
    });
  }, [properties, filters]);

  const resetFilters = () => {
    onFilterChange({
      priceRange: 'all',
      location: 'all',
      typology: 'all',
      searchQuery: '',
    });
  };

  const hasActiveFilters =
    filters.location !== 'all' ||
    filters.priceRange !== 'all' ||
    filters.typology !== 'all' ||
    Boolean(filters.searchQuery && filters.searchQuery.trim());

  return (
    <section id="featured-properties-section" className="py-20 bg-[#F8F9FA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-[2px] bg-[#C5A059]" />
              <span className="text-xs uppercase tracking-widest text-[#002347] font-bold">
                Nagpur Real Estate Portfolio
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#002347] tracking-tight">
              Featured Nagpur Properties
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-xl">
              Curated residential developments, luxury floors, sky villas, and plotted estates across prime Nagpur corridors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-[#002347] font-bold">{filteredProperties.length}</strong> of {properties.length} Properties
            </span>
            {hasActiveFilters && (
              <button
                id="reset-all-filters-btn"
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-[#002347] text-xs hover:border-[#C5A059] transition-colors shadow-sm cursor-pointer"
              >
                <RefreshCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE FILTERS CONTROLS ABOVE PROPERTY GRID                          */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-6 mb-8 rounded-2xl bg-white border border-slate-200 border-b-4 border-b-[#002347] shadow-lg space-y-5">
          {/* Top Row: Typology / Size Pill Buttons */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#002347] flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Configuration / Typology</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Select configuration</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {typologyOptions.map((option) => {
                const isActive = filters.typology === option.value;
                return (
                  <button
                    key={option.value}
                    id={`typology-pill-${option.value.replace(/\s+/g, '-').toLowerCase()}`}
                    type="button"
                    onClick={() => onFilterChange({ typology: option.value })}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#002347] text-[#E6C687] shadow-md border border-[#002347]'
                        : 'bg-[#F8F9FA] text-slate-700 border border-slate-200 hover:border-[#C5A059] hover:bg-white'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Grid: Location Dropdown, Price Dropdown, and Search Input */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            {/* 1. Dynamic Location Filter Dropdown */}
            <div>
              <label
                htmlFor="filter-location-select"
                className="block text-xs font-bold uppercase tracking-wider text-[#002347] mb-1.5 flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Location</span>
              </label>
              <select
                id="filter-location-select"
                value={filters.location}
                onChange={(e) => onFilterChange({ location: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white cursor-pointer transition-colors"
              >
                <option value="all">All Locations ({properties.length} Properties)</option>
                {availableLocations.map((loc) => {
                  const count = properties.filter((p) => p.location === loc).length;
                  return (
                    <option key={loc} value={loc}>
                      {loc} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 2. Price Range Filter Dropdown */}
            <div>
              <label
                htmlFor="filter-price-select"
                className="block text-xs font-bold uppercase tracking-wider text-[#002347] mb-1.5 flex items-center gap-1.5"
              >
                <IndianRupee className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Price Range</span>
              </label>
              <select
                id="filter-price-select"
                value={filters.priceRange}
                onChange={(e) => onFilterChange({ priceRange: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white cursor-pointer transition-colors"
              >
                <option value="all">All Prices</option>
                <option value="under-50l">Under ₹50 Lakhs</option>
                <option value="50l-1cr">₹50 Lakhs – ₹1 Crore</option>
                <option value="1cr-2cr">₹1 Crore – ₹2 Crore</option>
                <option value="above-2cr">₹2 Crore & Above (Luxury / Request)</option>
              </select>
            </div>

            {/* 3. Search / Keyword Input */}
            <div>
              <label
                htmlFor="filter-search-input"
                className="block text-xs font-bold uppercase tracking-wider text-[#002347] mb-1.5 flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Search by Name or Landmark</span>
              </label>
              <div className="relative">
                <input
                  id="filter-search-input"
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                  placeholder="e.g., Mittal, Godrej, Wardha Road..."
                  className="w-full pl-3.5 pr-8 py-2.5 bg-[#F8F9FA] border border-slate-300 rounded-xl text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#C5A059] focus:bg-white transition-colors"
                />
                {filters.searchQuery && (
                  <button
                    type="button"
                    onClick={() => onFilterChange({ searchQuery: '' })}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PROPERTY CARDS GRID                                                       */}
        {/* ========================================================================= */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onBookNow={onBookNow}
                onViewDetails={onViewDetails}
                onAskPA={onAskPA}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
            <SlidersHorizontal className="w-12 h-12 text-[#C5A059] mx-auto mb-4 opacity-70" />
            <h3 className="text-xl font-serif-luxury font-bold text-[#002347] mb-2">
              No matching Nagpur properties found
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
              Try adjusting your price range, location, or typology filters, or contact Amit Shivpeth directly on WhatsApp for customized options.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-xl bg-[#002347] text-[#E6C687] font-bold text-xs uppercase tracking-wider hover:bg-[#001730] transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* WhatsApp VIP Consultation Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-[#002347] border border-[#C5A059]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#C5A059]/20 text-[#E6C687] border border-[#C5A059]/30">
              <Sparkles className="w-3.5 h-3.5" />
              Direct VIP Advisory
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
              Looking for tailored property recommendations in Nagpur?
            </h3>
            <p className="text-sm text-slate-200 max-w-xl">
              Connect directly with Amit Shivpeth at AS Realty (+91 87883 75434) for private consultations, builder-direct pricing, and site visit arrangements.
            </p>
          </div>

          <button
            onClick={() => onBookNow(properties[0] || {
              id: 'custom-mandate',
              name: 'Nagpur Property Consultation',
              title: 'Nagpur Property Consultation',
              location: 'Nagpur',
              price: 'Bespoke Consultation',
              price_value: 0,
              bhk: 'Custom Requirement',
              type: 'Private Advisory',
              imageUrl: '',
              heroImage: '',
            })}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E6C687] hover:from-[#B8924B] hover:to-[#D9B97A] text-[#002347] font-bold text-xs uppercase tracking-wider shrink-0 shadow-lg shadow-black/20 transition-all cursor-pointer"
          >
            Schedule VIP Consultation
          </button>
        </div>
      </div>
    </section>
  );
};
