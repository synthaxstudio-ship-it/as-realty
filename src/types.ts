export interface Property {
  id: number | string;
  name: string;
  title: string; // alias for name
  subtitle?: string;
  location: string;
  locality?: string;
  city?: string;
  bhk: string;
  type: string;
  price: string;
  price_value: number; // numeric value in Rupees (e.g., 17100000)
  imageUrl: string;
  heroImage: string; // alias for imageUrl
  gallery?: string[];
  features?: string[];
  amenities?: string[];
  sqft?: number;
  bathrooms?: number;
  reraId?: string;
  possession?: string;
  description?: string;
  isFeatured?: boolean;
}

export interface FilterState {
  priceRange: string; // 'all' | 'under-50l' | '50l-1cr' | '1cr-2cr' | 'above-2cr'
  location: string; // 'all' or location name (e.g. 'Seminary Hills', 'Besa', etc.)
  typology: string; // 'all' | '1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | 'Villa' | 'Plot' | 'Farm / Field'
  searchQuery: string;
}

export interface BookingFormData {
  fullName: string;
  phone: string;
  propertyName: string;
  date: string;
  timeSlot: string;
  visitType: 'Private Site Visit' | 'Virtual Video Walkthrough' | 'Office Consultation';
  notes?: string;
}

