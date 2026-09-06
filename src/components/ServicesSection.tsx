import React from 'react';
import { Car, Briefcase, Globe2, Compass, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/properties';

interface ServicesSectionProps {
  onOpenBooking: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenBooking }) => {
  const services = [
    {
      icon: Car,
      tag: 'White Glove Hospitality',
      title: 'Chauffeur-Driven VIP Site Visits',
      description: 'Experience property viewings in complete comfort. We coordinate discreet luxury Mercedes/BMW transfers with private site escorts and dedicated property walkthroughs.',
    },
    {
      icon: Globe2,
      tag: 'Cross-Border Advisory',
      title: 'NRI & Global Investor Concierge',
      description: 'Seamless repatriation compliance, FEMA / RBI regulations, power-of-attorney execution, and end-to-end digital documentation for non-resident Indian investors.',
    },
    {
      icon: Briefcase,
      tag: 'Capital Management',
      title: 'HNI Real Estate Portfolio Advisory',
      description: 'Strategic asset rebalancing, rental yield optimization, capital gains structuring, and pre-launch anchor allotments directly with prime developers.',
    },
    {
      icon: Compass,
      tag: 'Bespoke Turnkey',
      title: 'Architectural & Interior Curation',
      description: 'Liaison with India and Milan’s premier interior architectural ateliers, high-end automated home tech integrators, and luxury landscape artists.',
    },
  ];

  return (
    <section id="services-section" className="py-20 bg-[#F8F9FA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-[2px] bg-[#C5A059]" />
              <span className="text-xs uppercase tracking-widest text-[#002347] font-bold">
                Tailored Privileges
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#002347] tracking-tight">
              Bespoke Client Services
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              From your initial consultation with Amit Shivpeth to handing over the keys of your private estate.
            </p>
          </div>

          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-300 hover:border-[#002347] text-xs uppercase tracking-wider text-[#002347] font-bold transition-all shadow-sm cursor-pointer"
          >
            <span>Request Bespoke Service</span>
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 border-b-4 border-b-[#002347] hover:border-b-[#C5A059] transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#002347] text-[#E6C687] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8924B] block mb-1">
                    {srv.tag}
                  </span>
                  <h3 className="text-lg font-serif-luxury font-bold text-[#002347] mb-2">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100">
                  <button
                    onClick={onOpenBooking}
                    className="flex items-center gap-1.5 text-xs text-[#002347] font-bold hover:text-[#C5A059] transition-colors cursor-pointer"
                  >
                    <span>Inquire Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
