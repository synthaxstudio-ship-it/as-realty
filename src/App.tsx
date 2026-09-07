import React, { useState } from 'react';
import { Property, FilterState } from './types';
import { PROPERTIES } from './data/properties';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PropertyGrid } from './components/PropertyGrid';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppBookingModal } from './components/WhatsAppBookingModal';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AIPersonalAssistantModal } from './components/AIPersonalAssistantModal';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';

function AppContent() {
  const [properties] = useState<Property[]>(PROPERTIES);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: 'all',
    location: 'all',
    typology: 'all',
    searchQuery: '',
  });

  // Modal states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedBookingPropertyName, setSelectedBookingPropertyName] = useState<string>('');
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);

  // AI Personal Assistant Modal state
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiAssistantProperty, setAiAssistantProperty] = useState<Property | null>(null);
  const [aiAssistantInitialMode, setAiAssistantInitialMode] = useState<'voice' | 'chat'>('voice');

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSearchSubmit = () => {
    const el = document.getElementById('featured-properties-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (propertyOrName?: Property | string) => {
    if (typeof propertyOrName === 'string') {
      setSelectedBookingPropertyName(propertyOrName);
    } else if (propertyOrName && typeof propertyOrName === 'object') {
      setSelectedBookingPropertyName(propertyOrName.name || propertyOrName.title);
    } else {
      setSelectedBookingPropertyName('');
    }
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  const handleViewDetails = (property: Property) => {
    setDetailProperty(property);
  };

  const handleCloseDetails = () => {
    setDetailProperty(null);
  };

  // Open Amit Sir's Executive PA
  const handleOpenAiAssistant = (property?: Property | null, mode: 'voice' | 'chat' = 'voice') => {
    setAiAssistantProperty(property || null);
    setAiAssistantInitialMode(mode);
    setIsAiAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] selection:bg-[#C5A059] selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onScrollToSection={handleScrollToSection}
        onOpenAiAssistant={(mode) => handleOpenAiAssistant(null, mode || 'voice')}
      />

      {/* Main Content Area */}
      <main>
        {/* Hero Section */}
        <Hero
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchSubmit={handleSearchSubmit}
          onOpenBooking={() => handleOpenBooking()}
          onOpenAiAssistant={(mode) => handleOpenAiAssistant(null, mode || 'voice')}
        />

        {/* Featured Properties Grid with Interactive Filters */}
        <PropertyGrid
          properties={properties}
          filters={filters}
          onFilterChange={handleFilterChange}
          onBookNow={(prop) => handleOpenBooking(prop)}
          onViewDetails={handleViewDetails}
          onAskPA={(prop) => handleOpenAiAssistant(prop, 'voice')}
        />

        {/* About AS Realty & Amit Shivpeth */}
        <AboutSection onOpenBooking={() => handleOpenBooking()} />

        {/* Bespoke Client Services & VIP Privileges */}
        <ServicesSection onOpenBooking={() => handleOpenBooking()} />

        {/* Contact Us & Direct Inquiry Section */}
        <ContactSection onOpenBooking={() => handleOpenBooking()} />
      </main>

      {/* Site Footer */}
      <Footer
        onScrollToSection={handleScrollToSection}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Interactive WhatsApp Booking Modal Component */}
      <WhatsAppBookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        selectedPropertyName={selectedBookingPropertyName}
        properties={properties}
      />

      {/* Property Deep Dive & Gallery Modal */}
      <PropertyDetailModal
        property={detailProperty}
        onClose={handleCloseDetails}
        onBookNow={(prop) => handleOpenBooking(prop)}
        onAskPA={(prop) => handleOpenAiAssistant(prop, 'voice')}
      />

      {/* Live AI Personal Assistant to Amit Sir (Gemini 3.1 Flash Live & Gemini 3.8 Flash) */}
      <AIPersonalAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        selectedProperty={aiAssistantProperty}
        initialMode={aiAssistantInitialMode}
        onOpenBooking={(name) => handleOpenBooking(name)}
      />

      {/* Supabase VIP Authentication Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
