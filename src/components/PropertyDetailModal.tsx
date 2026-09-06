import React, { useState } from 'react';
import { X, MapPin, Check, ShieldCheck, Calendar, PhoneCall, BedDouble, Maximize2, Bath, Compass, Sparkles, Trees } from 'lucide-react';
import { Property } from '../types';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onBookNow: (property: Property) => void;
  onAskPA: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onBookNow,
  onAskPA,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!property) return null;

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

  const allImages = [
    property.imageUrl || property.heroImage,
    ...(property.gallery || []),
  ].filter(Boolean).filter((val, idx, arr) => arr.indexOf(val) === idx);

  return (
    <div
      id="property-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#001730]/60 backdrop-blur-md transition-all duration-300 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="property-detail-modal-content"
        className="relative w-full max-w-4xl my-6 bg-white border border-slate-200 border-b-4 border-b-[#002347] rounded-2xl shadow-2xl text-slate-800 overflow-hidden"
      >
        {/* Top Gold Accent */}
        <div className="h-1.5 bg-gradient-to-r from-[#9E7D3B] via-[#E5C378] to-[#9E7D3B]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white text-slate-800 rounded-full border border-slate-200 shadow-md transition-all focus:outline-none cursor-pointer"
          aria-label="Close detail modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery / Media Section */}
        <div className="relative bg-black/60 aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
          <img
            src={allImages[activeImageIndex] || property.imageUrl || property.heroImage}
            alt={property.name || property.title}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

          {/* Badges on image */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#C5A059] text-white tracking-wider uppercase shadow-md mb-2">
                {property.type}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-white drop-shadow-md">
                {property.name || property.title}
              </h2>
              <p className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-200 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#E6C687]" />
                {property.location}, Nagpur
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-300 uppercase tracking-widest block font-medium">Offered At</span>
              <span className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#E6C687]">
                {property.price}
              </span>
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="px-6 py-3 bg-[#F8F9FA] border-b border-slate-200 flex gap-2 overflow-x-auto">
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIndex === index ? 'border-[#002347] scale-105 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Body Details */}
        <div className="p-6 sm:p-8 max-h-[55vh] overflow-y-auto space-y-6">
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#F8F9FA] border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#002347] text-[#E6C687] shadow-sm">
                {isFarm ? (
                  <Trees className="w-5 h-5 text-emerald-400" />
                ) : isPlot ? (
                  <Compass className="w-5 h-5 text-[#E6C687]" />
                ) : (
                  <BedDouble className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Configuration</p>
                <p className="text-sm font-bold text-[#002347]">{property.bhk}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#002347] text-[#E6C687] shadow-sm">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  {isFarm ? 'Land Extent' : isPlot ? 'Plot Area' : 'Super Area'}
                </p>
                <p className="text-sm font-bold text-[#002347]">
                  {isFarm
                    ? `${(property.sqft || 43560).toLocaleString('en-IN')} Sq. Ft. (1 Acre)`
                    : `${(property.sqft || 1500).toLocaleString('en-IN')} Sq. Ft.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#002347] text-[#E6C687] shadow-sm">
                {isFarm || isPlot ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <Bath className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  {isFarm ? 'Land Title' : isPlot ? 'Sanction' : 'Baths'}
                </p>
                <p className="text-sm font-bold text-[#002347]">
                  {isFarm ? 'Clear 7/12 & 8A' : isPlot ? 'NMRDA / RL Approved' : `${property.bathrooms || 3} Baths`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#002347] text-[#E6C687] shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Possession</p>
                <p className="text-sm font-bold text-emerald-600">{property.possession || 'Ready Possession'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#002347] mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              Property Overview
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {property.description || `${property.name} is a premier ${property.type} development in ${property.location}, Nagpur.`}
            </p>
          </div>

          {/* Key Features & Interior Highlights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#002347] mb-3">
              Key Features & Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(property.features || ['Prime Connectivity', 'MahaRERA Registered', 'Vastu Compliant Architecture', '24/7 Security']).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#F8F9FA] border border-slate-200 text-xs text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusive Amenities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#002347] mb-3">
              Amenities & Facilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(property.amenities || ['Reserved Parking', 'Landscaped Green Enclaves', 'CCTV & Gated Security', '100% Power Backup']).map((amen, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#F8F9FA] border border-slate-200 text-xs text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{amen}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RERA & Compliance */}
          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <ShieldCheck className="w-5 h-5 text-[#002347] shrink-0" />
              <div>
                <span className="font-bold text-[#002347] block">MahaRERA / State Verified</span>
                <span className="text-slate-500 font-mono">Registration: {property.reraId}</span>
              </div>
            </div>
            <span className="inline-block text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full font-semibold">
              100% Title Clear & Approved
            </span>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-6 bg-[#F8F9FA] border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 block font-medium">Personalized Advisory by</span>
            <span className="text-sm font-bold text-[#002347]">Amit Shivpeth (AS Realty)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onAskPA(property);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#E6C687]" />
              <span>Ask Amit Sir's PA</span>
            </button>
            <button
              id={`detail-book-now-${property.id}`}
              onClick={() => {
                onClose();
                onBookNow(property);
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#002347] hover:bg-[#001730] text-[#E6C687] border border-[#C5A059]/40 font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#C5A059]" />
              <span>Book Site Visit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
