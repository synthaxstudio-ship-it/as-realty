import React from 'react';
import { MapPin, BedDouble, Maximize2, ShieldCheck, Eye, MessageCircle, Sparkles, Trees, Compass } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onBookNow: (property: Property) => void;
  onViewDetails: (property: Property) => void;
  onAskPA: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onBookNow,
  onViewDetails,
  onAskPA,
}) => {
  const bhkLower = (property.bhk || '').toLowerCase();
  const typeLower = (property.type || '').toLowerCase();
  const isFarm =
    bhkLower.includes('farm') ||
    bhkLower.includes('field') ||
    typeLower.includes('farm') ||
    typeLower.includes('field') ||
    typeLower.includes('agro') ||
    typeLower.includes('agri');
  const isPlot =
    !isFarm &&
    (bhkLower.includes('plot') || typeLower.includes('plot') || typeLower.includes('land'));
  return (
    <div
      id={`property-card-${property.id}`}
      className="group relative flex flex-col bg-white border border-slate-200 border-b-4 border-b-[#002347] hover:border-b-[#C5A059] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={property.imageUrl || property.heroImage}
          alt={property.name || property.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#002347]/90 text-[#E6C687] border border-[#C5A059]/40 backdrop-blur-md shadow-md">
            {property.type}
          </span>
          {property.isFeatured && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C5A059] text-white shadow-md">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>

        {/* Quick View Button over image */}
        <button
          onClick={() => onViewDetails(property)}
          className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/85 text-xs text-white backdrop-blur-md border border-white/20 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex items-center gap-1.5 focus:outline-none cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-[#E6C687]" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Title */}
          <div className="flex items-center gap-1.5 text-xs text-[#B8924B] mb-1.5 font-semibold">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{property.location}, Nagpur</span>
          </div>

          <h3
            onClick={() => onViewDetails(property)}
            className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#002347] hover:text-[#C5A059] transition-colors cursor-pointer line-clamp-1"
          >
            {property.name || property.title}
          </h3>

          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {property.subtitle || `${property.type} in ${property.location}, Nagpur`}
          </p>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 gap-2 my-4 p-3 rounded-xl bg-[#F8F9FA] border border-slate-200/80 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              {isFarm ? (
                <Trees className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : isPlot ? (
                <Compass className="w-4 h-4 text-[#B8924B] shrink-0" />
              ) : (
                <BedDouble className="w-4 h-4 text-[#002347] shrink-0" />
              )}
              <span className="truncate font-medium">{property.bhk}</span>
            </div>
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-[#002347] shrink-0" />
              <span className="truncate font-medium">{property.type}</span>
            </div>
          </div>

          {/* Highlights tag pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(property.features || ['MahaRERA Registered', 'Prime Connectivity']).slice(0, 2).map((feat, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-700 border border-slate-200 font-medium"
              >
                {feat}
              </span>
            ))}
            <span className="px-2.5 py-0.5 rounded-md text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              {property.possession || 'Verified Project'}
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 block">Starting At</span>
            <span className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#002347]">
              {property.price}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`ask-pa-button-${property.id}`}
              onClick={() => onAskPA(property)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#002347] hover:bg-[#001730] text-[#E6C687] border border-[#C5A059]/40 font-bold text-xs shadow-sm transition-all transform active:scale-95 cursor-pointer"
              title="Consult Amit Sir's PA about this property"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Ask PA</span>
            </button>

            <button
              id={`book-now-button-${property.id}`}
              onClick={() => onBookNow(property)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#E6C687] hover:from-[#B8924B] hover:to-[#D9B97A] text-[#002347] font-bold text-xs sm:text-sm shadow-md shadow-[#C5A059]/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-[#002347]" />
              <span>Book Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
