import { Property } from '../types';

export const RAW_NAGPUR_PROPERTIES = [
  {"id": 1, "name": "Mittal Atlantis", "location": "Seminary Hills", "bhk": "3 & 4 BHK", "type": "Luxury Flats / Penthouses", "price": "₹1.71 Cr – ₹4.56 Cr", "price_value": 17100000, "imageUrl": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"},
  {"id": 2, "name": "Landmarks Orchid Shivneri", "location": "Gandhi Nagar", "bhk": "3 BHK", "type": "Premium Residences", "price": "₹1.46 Cr – ₹1.76 Cr", "price_value": 14600000, "imageUrl": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"},
  {"id": 3, "name": "Orchid Gokul Residences", "location": "Dharampeth", "bhk": "4 BHK", "type": "Super-Luxury Flats", "price": "₹2.55 Cr", "price_value": 25500000, "imageUrl": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"},
  {"id": 4, "name": "Maxx Shrila Apartment", "location": "Dharampeth", "bhk": "3 BHK", "type": "High-End Apartments", "price": "₹1.95 Cr – ₹1.98 Cr", "price_value": 19500000, "imageUrl": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"},
  {"id": 5, "name": "SDPL Om II", "location": "Lakadganj", "bhk": "3 & 4 BHK", "type": "Luxury Residences", "price": "₹1.23 Cr – ₹2.43 Cr", "price_value": 12300000, "imageUrl": "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"},
  {"id": 6, "name": "Maharshee Gurukrupa", "location": "Laxmi Nagar", "bhk": "3 BHK", "type": "Executive Homes", "price": "₹1.45 Cr", "price_value": 14500000, "imageUrl": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"},
  {"id": 7, "name": "Civil Lines Crown Towers", "location": "Civil Lines", "bhk": "3 & 4 BHK", "type": "Luxury Apartments", "price": "Price on Request", "price_value": 0, "imageUrl": "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80"},
  {"id": 8, "name": "Ramdaspeth Elite Heights", "location": "Ramdaspeth", "bhk": "4 BHK", "type": "Luxury Floors", "price": "Price on Request", "price_value": 0, "imageUrl": "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80"},
  {"id": 9, "name": "Golden Legacy", "location": "Besa", "bhk": "2 & 3 BHK", "type": "Modern Homes", "price": "₹55.58 L – ₹72.23 L", "price_value": 5558000, "imageUrl": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"},
  {"id": 10, "name": "Golden Signature", "location": "Besa", "bhk": "2 & 3 BHK", "type": "Apartments", "price": "₹52.79 L – ₹73.58 L", "price_value": 5279000, "imageUrl": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80"},
  {"id": 11, "name": "Mahalaxmi Tattva Apas", "location": "Beltarodi", "bhk": "2 & 3 BHK", "type": "Smart Homes", "price": "₹53.00 L – ₹73.50 L", "price_value": 5300000, "imageUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"},
  {"id": 12, "name": "Shree Laxmi Aarambh", "location": "Beltarodi", "bhk": "3 BHK", "type": "Premium Apartments", "price": "₹70.90 L – ₹73.60 L", "price_value": 7090000, "imageUrl": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"},
  {"id": 13, "name": "Skyblue Oasis", "location": "Manish Nagar", "bhk": "2, 3 & 4 BHK", "type": "Apartments", "price": "₹46.04 L – ₹67.68 L", "price_value": 4604000, "imageUrl": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"},
  {"id": 14, "name": "Maharshee Nakshatra", "location": "Manish Nagar", "bhk": "2 & 3 BHK", "type": "Gated Society", "price": "₹57.20 L – ₹75.60 L", "price_value": 5720000, "imageUrl": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"},
  {"id": 15, "name": "Meher Ganga", "location": "Narendra Nagar", "bhk": "2 & 3 BHK", "type": "Contemporary Flats", "price": "₹59.35 L – ₹92.60 L", "price_value": 5935000, "imageUrl": "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80"},
  {"id": 16, "name": "Aakar Park Phase II", "location": "Besa", "bhk": "2 & 3 BHK", "type": "Apartments", "price": "₹42.00 L – ₹58.10 L", "price_value": 4200000, "imageUrl": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"},
  {"id": 17, "name": "Golden Glory 101", "location": "Wardha Road", "bhk": "3 & 4 BHK", "type": "Row Houses & Villas", "price": "₹77.83 L – ₹1.31 Cr", "price_value": 7783000, "imageUrl": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"},
  {"id": 18, "name": "Radha Madhav Vrindavan", "location": "Wardha Road", "bhk": "1, 2 & 3 BHK", "type": "Township Flats", "price": "₹24.50 L – ₹78.00 L", "price_value": 2450000, "imageUrl": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"},
  {"id": 19, "name": "Mahindra Bloomdale", "location": "MIHAN", "bhk": "1, 2 & 3 BHK", "type": "Modern Flats", "price": "₹36.41 L – ₹54.66 L", "price_value": 3641000, "imageUrl": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"},
  {"id": 20, "name": "Om Shiv Kailasa Phase II", "location": "MIHAN", "bhk": "2 & 3 BHK", "type": "High-Rise Apartments", "price": "₹59.90 L – ₹81.05 L", "price_value": 5990000, "imageUrl": "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=800&q=80"},
  {"id": 21, "name": "Mahalaxmi Nagar 49 Ayana", "location": "MIHAN", "bhk": "Plots", "type": "Residential Plot Bundles", "price": "₹47.60 L – ₹2.85 Cr", "price_value": 4760000, "imageUrl": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"},
  {"id": 22, "name": "Godrej Rivershore Estate", "location": "Samruddhi Expressway", "bhk": "Plots", "type": "Residential Land", "price": "₹66.00 L – ₹2.83 Cr", "price_value": 6600000, "imageUrl": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"},
  {"id": 23, "name": "Gokul Greens", "location": "Mankapur", "bhk": "2 & 3 BHK", "type": "Modern Homes", "price": "₹51.00 L – ₹77.01 L", "price_value": 5100000, "imageUrl": "https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=800&q=80"},
  {"id": 24, "name": "SDPL Paradise", "location": "Dabha", "bhk": "2 BHK", "type": "Value Apartments", "price": "₹47.00 L – ₹57.60 L", "price_value": 4700000, "imageUrl": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"},
  {"id": 25, "name": "Jinraj Majestic Sky Bungalow", "location": "Wardhaman Nagar", "bhk": "3.5 & 4 BHK", "type": "Sky Villas", "price": "₹2.03 Cr – ₹2.27 Cr", "price_value": 20300000, "imageUrl": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"},
  {"id": 26, "name": "HOABL Nagpur Marina", "location": "Hingna Road", "bhk": "Plots", "type": "Township Plots", "price": "₹65.00 L – ₹93.49 L", "price_value": 6500000, "imageUrl": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"},
  {"id": 27, "name": "Karamchand Greens", "location": "Hingna", "bhk": "Plots", "type": "Residential Plots", "price": "₹29.75 L – ₹67.55 L", "price_value": 2975000, "imageUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"},
  {"id": 28, "name": "Pankaj Gokul Vrindavan", "location": "Friends Colony", "bhk": "3 BHK", "type": "Premium Apartments", "price": "₹48.01 L", "price_value": 4801000, "imageUrl": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"},
  {"id": 29, "name": "Krishna Leela", "location": "Jaitala", "bhk": "2 & 3 BHK", "type": "Affordable Flats", "price": "₹19.65 L – ₹30.66 L", "price_value": 1965000, "imageUrl": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"},
  {"id": 30, "name": "SDPL Om Tatvam", "location": "Kachimet", "bhk": "3 & 4 BHK", "type": "Residential Flats", "price": "₹1.26 Cr – ₹1.27 Cr", "price_value": 12600000, "imageUrl": "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"},
  {"id": 31, "name": "Besa Imperial Greens Plotted Enclave", "location": "Besa", "bhk": "Plot", "type": "NMRDA Sanctioned Plots", "price": "₹42.50 L – ₹88.00 L", "price_value": 4250000, "imageUrl": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"},
  {"id": 32, "name": "Wardha Horizon Plotted Township", "location": "Wardha Road", "bhk": "Plot", "type": "Township Plots", "price": "₹38.00 L – ₹75.00 L", "price_value": 3800000, "imageUrl": "https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=800&q=80"},
  {"id": 33, "name": "Pench Agro Meadows & Orchard Estates", "location": "Ramtek / Pench Corridor", "bhk": "Farm / Field", "type": "Agricultural Farmland & Farmhouse", "price": "₹45.00 L – ₹1.25 Cr", "price_value": 4500000, "imageUrl": "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=80"},
  {"id": 34, "name": "Katol Valley Greenfields & Orange Groves", "location": "Katol Road", "bhk": "Farm / Field", "type": "Agricultural Land & Eco Farm", "price": "₹35.00 L – ₹85.00 L", "price_value": 3500000, "imageUrl": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"},
  {"id": 35, "name": "Umred Countryside Agro Ranch", "location": "Umred Road", "bhk": "Farm / Field", "type": "Cultivated Farmland & Field Plots", "price": "₹28.50 L – ₹62.00 L", "price_value": 2850000, "imageUrl": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80"},
  {"id": 36, "name": "Samruddhi Agri Horizons & Farm Plots", "location": "Samruddhi Expressway", "bhk": "Farm / Field", "type": "Agro Field & Investment Land", "price": "₹52.00 L – ₹1.40 Cr", "price_value": 5200000, "imageUrl": "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=800&q=80"},
  {"id": 37, "name": "Hingna Forest Edge Farm Retreat", "location": "Hingna", "bhk": "Farm / Field", "type": "Gated Weekend Farmhouse Land", "price": "₹65.00 L – ₹1.10 Cr", "price_value": 6500000, "imageUrl": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"}
];

// Helper to determine estimated square footage and details based on bhk/type
function getPropertyDetails(raw: typeof RAW_NAGPUR_PROPERTIES[0]) {
  const bhkLower = (raw.bhk || '').toLowerCase();
  const typeLower = (raw.type || '').toLowerCase();

  const isFarmField =
    bhkLower.includes('farm') ||
    bhkLower.includes('field') ||
    typeLower.includes('farm') ||
    typeLower.includes('field') ||
    typeLower.includes('agro') ||
    typeLower.includes('agri');

  const isPlot =
    !isFarmField &&
    (bhkLower.includes('plot') || typeLower.includes('plot') || typeLower.includes('land'));

  let sqft = 1450;
  let bathrooms = 3;

  if (isFarmField) {
    sqft = 43560; // 1 Acre (43,560 sq ft)
    bathrooms = 0;
  } else if (isPlot) {
    sqft = 2200;
    bathrooms = 0;
  } else if (raw.bhk.includes('4')) {
    sqft = 2850;
    bathrooms = 4;
  } else if (raw.bhk.includes('3')) {
    sqft = 1650;
    bathrooms = 3;
  } else if (raw.bhk.includes('2')) {
    sqft = 1100;
    bathrooms = 2;
  } else if (raw.bhk.includes('1')) {
    sqft = 650;
    bathrooms = 1;
  }

  const isLuxury = raw.price_value >= 15000000 || raw.price.includes('Request');

  if (isFarmField) {
    return {
      sqft,
      bathrooms,
      isFeatured: raw.price_value >= 4500000,
      features: [
        'Clear 7/12 & 8A Land Title Extract',
        'Direct Tar Road Connectivity',
        'Abundant Sweet Groundwater & Borewell Ready',
        'Fenced Boundary with Private Gated Access',
      ],
      amenities: [
        'Tree Plantation & Fruit Orchard Ready',
        'Electricity Line & Transformer Proximity',
        '24/7 Caretaker & Security Outpost',
        'Scenic Countryside & Nature Backdrop',
      ],
      reraId: `AGRI-NAG-${1000 + raw.id}`,
      possession: 'Immediate Registry / Clear Title',
      description: `${raw.name} is an exquisite ${raw.type} situated in the lush ${raw.location} green belt near Nagpur. Boasting clear 7/12 titles, fertile soil, perimeter fencing, and tranquil natural vistas, it is primed for luxury farmhouses, organic farming, or generational land banking.`
    };
  }

  if (isPlot) {
    return {
      sqft,
      bathrooms,
      isFeatured: [21, 22, 31].includes(raw.id),
      features: [
        'NMRDA & RL Sanctioned Layout',
        'Clear Title with Immediate Registry',
        'Wide Asphalt Internal Roads (30-40 ft)',
        'Underground Drainage, Water & Electric Cables',
      ],
      amenities: [
        'Gated Enclave with Guard Post & CCTV',
        'Demarcated Concrete Boundary Stones',
        'Landscaped Central Park & Jogging Track',
        'Streetlighting & Avenue Plantation',
      ],
      reraId: `P505000${26000 + raw.id}`,
      possession: 'Ready for Immediate Construction',
      description: `${raw.name} offers premium sanctioned plotted parcels in fast-developing ${raw.location}, Nagpur. Ideal for building custom luxury bungalows with complete infrastructure readiness and guaranteed legal title clearance.`
    };
  }

  return {
    sqft,
    bathrooms,
    isFeatured: isLuxury || [1, 3, 7, 8, 17, 25].includes(raw.id),
    features: [
      'Prime Nagpur Connectivity',
      'MahaRERA Registered Project',
      'Vastu Compliant Architecture',
      '24/7 Security & High-Speed Elevators',
    ],
    amenities: [
      'Dedicated Reserved Car Parking',
      'Landscaped Green Enclaves',
      'CCTV & Gated Security Protocol',
      '100% Power Backup for Common Areas',
    ],
    reraId: `P505000${25000 + raw.id}`,
    possession: raw.price_value > 20000000 ? 'Ready to Move' : 'Ready / Nearing Possession',
    description: `${raw.name} is a distinguished ${raw.type} development located in prime ${raw.location}, Nagpur. Offering meticulously planned ${raw.bhk} configurations with superior fittings, abundant natural ventilation, and seamless connectivity to prime city corridors.`
  };
}

export const PROPERTIES: Property[] = RAW_NAGPUR_PROPERTIES.map((item) => {
  const details = getPropertyDetails(item);
  return {
    id: item.id,
    name: item.name,
    title: item.name,
    subtitle: `${item.type} in ${item.location}, Nagpur`,
    location: item.location,
    locality: item.location,
    city: 'Nagpur',
    bhk: item.bhk,
    type: item.type,
    price: item.price,
    price_value: item.price_value,
    imageUrl: item.imageUrl,
    heroImage: item.imageUrl,
    gallery: [
      item.imageUrl,
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
    ],
    ...details,
  };
});

export const COMPANY_DETAILS = {
  name: 'AS Realty',
  tagline: 'Nagpur’s Premier Real Estate Advisory',
  founder: 'Amit Shivpeth',
  title: 'Founder & Managing Director',
  phoneDisplay: '+91 87883 75434',
  whatsappNumber: '918788375434',
  email: 'concierge@asrealty.in',
  instagramUrl: 'https://www.instagram.com/asrealty.official?igsi=MXhteGNhM3Y0YjBmcg==',
  instagramHandle: '@asrealty.official',
  city: 'Nagpur',
  offices: [
    {
      city: 'Civil Lines, Nagpur (Headquarters)',
      address: 'Suite 401, Imperial Heights, VIP Road, Civil Lines, Nagpur, Maharashtra 440001',
    },
    {
      city: 'Ramdaspeth, Nagpur (Private Client Suite)',
      address: 'Level 2, Heritage Arcade, Central Avenue, Ramdaspeth, Nagpur, Maharashtra 440010',
    },
  ],
};
