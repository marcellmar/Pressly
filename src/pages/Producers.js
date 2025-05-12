import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star,
  Wifi as WifiIcon,
  Heart,
  MessageSquare,
  List,
  Leaf,
  Sliders,
  ChevronRight,
  Clock,
  X,
  Printer as PrinterIcon,
  Bike,
  Car,
  Footprints,
  Layers,
  BarChart,
  Download,
  AlertCircle,
  TrendingUp,
  Calendar,
  CheckSquare,
  Truck,
  Database,
  Info,
  FileText,
  Users,
  Shield,
  Award,
  ExternalLink,
  FileCheck
} from 'lucide-react';
import UnsplashImage from '../components/ui/image/UnsplashImage';
import { getPrinterImageUrl, getEcoFriendlyImageUrl } from '../utils/unsplashUtils';
import PrinterMap from '../components/Map/PrinterMap';
import NetworkMap from '../components/Map/NetworkMap';
import mapConfig from '../config/mapConfig';
import { getBusinessData, needsRefresh } from '../services/localBusinessData';
import ProducerCard from '../components/ProducerCard';

const Producers = () => {
  // Main state
  const [producers, setProducers] = useState([
    { 
      id: 1, 
      name: 'EcoPress Chicago', 
      rating: 4.9, 
      reviews: 42,
      location: {
        lat: 41.889, 
        lng: -87.654,
        city: 'Chicago',
        address: '1234 W Industrial Ave, Chicago, IL 60612',
        neighborhood: 'West Town',
        zip: "60612",
        ward: "27",
        industrialCorridor: "Kinzie",
        propertyPIN: "16-12-345-678-0000"
      },
      distance: 3.2,
      capabilities: ['Digital Printing', 'Offset Printing', 'Large Format Printing'],
      specialties: ['Brochures', 'Posters', 'Banners', 'Books', 'Catalogs'],
      turnaround: '3-5 business days',
      priceRange: '$$$',
      availabilityPercent: 85,
      sustainabilityScore: 97,
      website: 'https://ecopresschicago.com',
      email: 'info@ecopresschicago.com',
      imageUrl: getEcoFriendlyImageUrl('eco-press', 400, 300),
      wifiEnabled: true,
      verificationSources: ["Chicago Business License", "EPA Green Business", "OpenStreetMap", "Cook County Property Records"],
      lastVerified: "2025-04-12",
      naicsCode: "323111",
      zoningCompliant: true,
      sustainabilityBadges: ["Green Certified", "Solar Powered", "Recycled Materials"],
      equipment: ["HP Indigo 12000", "Heidelberg Speedmaster XL 106", "Canon Arizona 1380 GT"],
      economicZones: ["Enterprise Zone", "TIF District"],
      transitAccess: {
        truckRoute: true,
        publicTransit: true,
        bikeways: true
      },
      capacity: {
        availableHours: 35,
        leadTime: "3-5 days",
        maxSize: "60 x 100 inches"
      },
      scores: {
        trust: 92,
        capability: 88,
        accessibility: 95,
        sustainability: 97,
        equity: 84
      }
    },
    { 
      id: 2, 
      name: 'Urban Print Solutions', 
      rating: 4.8, 
      reviews: 36,
      location: {
        lat: 41.892, 
        lng: -87.635,
        city: 'Chicago',
        address: '567 N Printer Row, Chicago, IL 60610',
        neighborhood: 'River North',
        zip: "60610",
        ward: "42",
        industrialCorridor: "River North",
        propertyPIN: "17-09-876-543-0000"
      },
      distance: 5.6,
      capabilities: ['Digital Printing', 'Large Format Printing', 'Screen Printing'],
      specialties: ['T-Shirts', 'Signage', 'Stickers', 'Canvas Prints', 'Vehicle Wraps'],
      turnaround: '2-4 business days',
      priceRange: '$$$',
      availabilityPercent: 72,
      sustainabilityScore: 72,
      website: 'https://urbanprintsolutions.com',
      email: 'orders@urbanprintsolutions.com',
      imageUrl: getPrinterImageUrl('urban-print', 400, 300),
      wifiEnabled: true,
      verificationSources: ["Illinois Secretary of State", "OpenCorporates", "Cook County Property Records"],
      lastVerified: "2025-03-28",
      naicsCode: "323113",
      zoningCompliant: true,
      sustainabilityBadges: ["Recycled Materials"],
      equipment: ["Roland TrueVIS VG3-640", "Epson SureColor S80600", "M&R Sportsman EX"],
      economicZones: [],
      transitAccess: {
        truckRoute: true,
        publicTransit: true,
        bikeways: false
      },
      capacity: {
        availableHours: 22,
        leadTime: "2-4 days",
        maxSize: "120 x 240 inches"
      },
      scores: {
        trust: 85,
        capability: 92,
        accessibility: 88,
        sustainability: 72,
        equity: 65
      }
    },
    { 
      id: 3, 
      name: 'South Side Printers Collective', 
      rating: 4.7, 
      reviews: 29,
      location: {
        lat: 41.762, 
        lng: -87.586,
        city: 'Chicago',
        address: '789 E 73rd St, Chicago, IL 60619', 
        neighborhood: 'Greater Grand Crossing',
        zip: "60619",
        ward: "8",
        industrialCorridor: "Calumet",
        propertyPIN: "20-26-123-456-0000"
      },
      distance: 6.1,
      capabilities: ['Digital Printing', 'Screen Printing', 'Letterpress'],
      specialties: ['Business Cards', 'Wedding Invitations', 'Art Prints', 'Apparel', 'Packaging'],
      turnaround: '4-7 business days',
      priceRange: '$$',
      availabilityPercent: 88,
      sustainabilityScore: 89,
      website: 'https://southsideprinters.coop',
      email: 'hello@southsideprinters.coop',
      imageUrl: getPrinterImageUrl('south-side-printers', 400, 300),
      wifiEnabled: false,
      verificationSources: ["Chicago Business License", "Community Verified", "Cook County Property Records"],
      lastVerified: "2025-04-01",
      naicsCode: "323111",
      zoningCompliant: true,
      sustainabilityBadges: ["Community Owned", "Recycled Materials"],
      equipment: ["Xerox Versant 280", "Vandercook SP-15", "Riley Hopkins 250"],
      economicZones: ["Opportunity Zone", "Neighborhood Opportunity Fund"],
      transitAccess: {
        truckRoute: false,
        publicTransit: true,
        bikeways: true
      },
      capacity: {
        availableHours: 40,
        leadTime: "4-7 days",
        maxSize: "20 x 26 inches"
      },
      scores: {
        trust: 78,
        capability: 85,
        accessibility: 76,
        sustainability: 89,
        equity: 98
      }
    },
    { 
      id: 4, 
      name: 'Pilsen Print Works', 
      rating: 4.8, 
      reviews: 33,
      location: {
        lat: 41.857, 
        lng: -87.646,
        city: 'Chicago',
        address: '1820 S Halsted St, Chicago, IL 60608', 
        neighborhood: 'Pilsen',
        zip: "60608",
        ward: "25",
        industrialCorridor: "Pilsen",
        propertyPIN: "17-20-987-654-0000"
      },
      distance: 4.3,
      capabilities: ['Digital Printing', 'Offset Printing', 'Binding'],
      specialties: ['Books', 'Magazines', 'Catalogs', 'Annual Reports', 'Portfolios'],
      turnaround: '5-8 business days',
      priceRange: '$$',
      availabilityPercent: 65,
      sustainabilityScore: 75,
      website: 'https://pilsenprintworks.com',
      email: 'orders@pilsenprintworks.com',
      imageUrl: getPrinterImageUrl('pilsen-print', 400, 300),
      wifiEnabled: true,
      verificationSources: ["Chicago Business License", "OpenCorporates", "Cook County Property Records"],
      lastVerified: "2025-03-15",
      naicsCode: "323117",
      zoningCompliant: true,
      sustainabilityBadges: ["FSC Certified"],
      equipment: ["Konica Minolta AccurioPress C14000", "Heidelberg GTO 52", "Muller Martini Presto II"],
      economicZones: ["TIF District"],
      transitAccess: {
        truckRoute: true,
        publicTransit: true,
        bikeways: true
      },
      capacity: {
        availableHours: 15,
        leadTime: "5-8 days",
        maxSize: "12 x 18 inches"
      },
      scores: {
        trust: 88,
        capability: 90,
        accessibility: 82,
        sustainability: 75,
        equity: 88
      }
    },
    { 
      id: 5, 
      name: 'Rowboat Creative', 
      rating: 4.6, 
      reviews: 18,
      location: {
        lat: 41.9074, 
        lng: -87.6722,
        city: 'Chicago',
        address: '1458 W Chicago Ave, Chicago, IL 60642', 
        neighborhood: 'Noble Square',
        zip: "60642",
        ward: "27",
        industrialCorridor: "Kinzie",
        propertyPIN: "14-08-123-456-0000"
      },
      distance: 2.9,
      capabilities: ['DTG Printing', 'Screen Printing', 'Embroidery'],
      specialties: ['T-Shirts', 'Apparel', 'Brand Merchandise', 'Promotional Products'],
      turnaround: '7-10 business days',
      priceRange: '$$$',
      availabilityPercent: 60,
      sustainabilityScore: 81,
      website: 'https://rowboatcreative.com',
      email: 'hello@rowboatcreative.com',
      imageUrl: getPrinterImageUrl('rowboat-creative', 400, 300),
      wifiEnabled: true,
      verificationSources: ["Chicago Business License", "Illinois Secretary of State", "Cook County Property Records"],
      lastVerified: "2025-02-20",
      naicsCode: "323113",
      zoningCompliant: true,
      sustainabilityBadges: ["Recycled Materials", "Water-Based Inks"],
      equipment: ["Brother GTX Pro", "M&R Diamondback", "Tajima TMEX-C1201"],
      economicZones: ["Enterprise Zone"],
      transitAccess: {
        truckRoute: true,
        publicTransit: true,
        bikeways: true
      },
      capacity: {
        availableHours: 25,
        leadTime: "7-10 days",
        maxSize: "16 x 20 inches"
      },
      scores: {
        trust: 86,
        capability: 91,
        accessibility: 84,
        sustainability: 81,
        equity: 78
      }
    }
  ]);
  
  // States for data loading and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [mapView, setMapView] = useState(true); // Make map view the default
  const [mapType, setMapType] = useState('basic'); // 'basic' | 'network'
  const [transportMode, setTransportMode] = useState('car');
  const [selectedProducers, setSelectedProducers] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Chicago business license data states
  const [chicagoLicenses, setChicagoLicenses] = useState([]);
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);
  const [licenseError, setLicenseError] = useState(null);
  const [showLicensedBusinesses, setShowLicensedBusinesses] = useState(true); // Show all producers by default
  
  // User location (Chicago)
  const userLocation = mapConfig.defaultCenter;
  
  // Check if data needs refresh and pre-load license data on mount
  useEffect(() => {
    setIsLoadingLicenses(true);
    
    const loadAllData = async () => {
      try {
        // Pre-fetch and store data locally
        await getBusinessData({ limit: 100 }, needsRefresh());
        
        // Also fetch and cache license data for immediate use
        const businessData = await getBusinessData({
          limit: 100 // Fetch more data to have a good selection
        });
        
        // Add placeholder images
        const enhancedData = businessData.map(producer => ({
          ...producer,
          imageUrl: producer.sustainabilityScore > 80 
            ? getEcoFriendlyImageUrl(`chicago-print-${producer.id}`, 400, 300)
            : getPrinterImageUrl(`chicago-print-${producer.id}`, 400, 300)
        }));
        
        setChicagoLicenses(enhancedData);
        setAutoLoadComplete(true);
        
        // Automatically enable licensed businesses for search
        setShowLicensedBusinesses(true);
      } catch (error) {
        console.warn('Data loading warning:', error);
      } finally {
        setIsLoadingLicenses(false);
      }
    };
    
    loadAllData();
  }, []);
  
  // Fetch Chicago business licenses when component mounts or when showLicensedBusinesses changes
  useEffect(() => {
    if (showLicensedBusinesses) {
      const fetchLicenseData = async () => {
        try {
          setIsLoadingLicenses(true);
          setLicenseError(null);
          
          // Fetch business data with local storage fallback
          const businessData = await getBusinessData({
            limit: 100 // Fetch more data to have a good selection
          });
          
          // Add placeholder images
          const enhancedData = businessData.map(producer => ({
            ...producer,
            imageUrl: producer.sustainabilityScore > 80 
              ? getEcoFriendlyImageUrl(`chicago-print-${producer.id}`, 400, 300)
              : getPrinterImageUrl(`chicago-print-${producer.id}`, 400, 300)
          }));
          
          setChicagoLicenses(enhancedData);
        } catch (error) {
          console.error('Error fetching Chicago business license data:', error);
          setLicenseError(error.message || 'Failed to load business license data');
        } finally {
          setIsLoadingLicenses(false);
        }
      };
      
      fetchLicenseData();
    }
  }, [showLicensedBusinesses]);
  
  // Always combine all producers for display
  // Add debug log to track producer counts
  console.log(`Producer counts - Default: ${producers.length}, Chicago/External: ${chicagoLicenses.length}`);
  
  // Make sure we keep all producers by combining both arrays
  const allProducers = [...producers, ...chicagoLicenses];
  console.log(`Total combined producers: ${allProducers.length}`);
  
  // Expose filtered producers for testing
  window.filteredProducers = allProducers;
  
  // Log validation for all producers in console
  useEffect(() => {
    if (allProducers.length > 0) {
      console.log("==== PRODUCER DATA VALIDATION ====");
      
      // Count producers with valid coordinates
      const producersWithValidCoords = allProducers.filter(p => 
        p.location && 
        typeof p.location.lat === 'number' && !isNaN(p.location.lat) &&
        typeof p.location.lng === 'number' && !isNaN(p.location.lng)
      );
      
      console.log(`Total producers: ${allProducers.length}`);
      console.log(`Producers with valid coordinates: ${producersWithValidCoords.length}`);
      
      if (producersWithValidCoords.length < allProducers.length) {
        console.warn(`${allProducers.length - producersWithValidCoords.length} producers missing valid coordinates`);
        
        // Log problematic producers
        allProducers.forEach(p => {
          if (!p.location || !p.location.lat || !p.location.lng || isNaN(p.location.lat) || isNaN(p.location.lng)) {
            console.warn(`Producer missing coordinates: ${p.name}`, p);
          }
        });
      }
      
      console.log("==================================");
    }
  }, [allProducers]);
  
  // Filter producers based on search and selected tab
  const filteredProducers = allProducers.filter(producer => {
    // Filter by search query
    if (searchQuery && 
        !producer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(producer.capabilities && producer.capabilities.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase()))) &&
        !(producer.specialties && producer.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())))) {
      return false;
    }
    
    // Filter by selected tab
    if (selectedTab === "wifi-enabled" && !producer.wifiEnabled) {
      return false;
    }
    
    if (selectedTab === "eco-friendly" && producer.sustainabilityScore < 80) {
      return false;
    }
    
    if (selectedTab === "local" && producer.distance > 5) {
      return false;
    }
    
    if (selectedTab === "business-licensed" && 
        (!producer.verificationSources || !producer.verificationSources.some(source => 
          source.includes("Chicago Business License") || source.includes("OpenStreetMap")
        ))) {
      return false;
    }
    
    return true;
  });
  
  // Function to handle selecting a producer
  const handleProducerSelect = (producer) => {
    if (mapType === 'network') {
      // For network map, toggle selection in the array
      const isSelected = selectedProducers.some(p => p.id === producer.id);
      
      if (isSelected) {
        setSelectedProducers(selectedProducers.filter(p => p.id !== producer.id));
      } else {
        setSelectedProducers([...selectedProducers, producer]);
      }
    } else {
      // For basic map or list view, show detail view
      setSelectedProducer(producer);
    }
  };
  
  // Function to clear selected producer
  const clearSelectedProducer = () => {
    setSelectedProducer(null);
  };
  
  // Toggle producer in selection array for network map
  const toggleProducerSelection = (producer) => {
    const isSelected = selectedProducers.some(p => p.id === producer.id);
    
    if (isSelected) {
      setSelectedProducers(selectedProducers.filter(p => p.id !== producer.id));
    } else {
      setSelectedProducers([...selectedProducers, producer]);
    }
  };
  
  // Add new states for the enhanced mockup features
  const [areaView, setAreaView] = useState('zip'); // 'zip', 'industrial', 'ward'
  const [selectedArea, setSelectedArea] = useState(null);
  const [activeTab, setActiveTab] = useState('map'); // 'map', 'data', 'area', 'jobs'
  const [mapLayers, setMapLayers] = useState({
    zoning: true,
    sustainability: false,
    truckRoutes: true,
    economicZones: false,
    productionDensity: false,
    chicagoCorridors: true
  });

  // Auto-load city license data for immediate searchability
  const [autoLoadComplete, setAutoLoadComplete] = useState(false);
  
  // Mock area data from the mockup
  const mockAreaData = {
    zip: [
      { code: "60608", name: "Pilsen Area", productTypes: ["books", "magazines", "catalogs", "apparel"], capabilities: ["digital", "offset", "binding"], economicZones: ["TIF District"], availableCapacity: 75, sustainabilityScore: 82 },
      { code: "60610", name: "River North", productTypes: ["signage", "vehicle wraps", "canvas prints"], capabilities: ["digital", "largeformat"], economicZones: [], availableCapacity: 42, sustainabilityScore: 68 },
      { code: "60612", name: "West Loop/Kinzie", productTypes: ["brochures", "posters", "banners", "catalogs"], capabilities: ["digital", "offset", "largeformat"], economicZones: ["Enterprise Zone", "TIF District"], availableCapacity: 92, sustainabilityScore: 95 },
      { code: "60619", name: "Greater Grand Crossing", productTypes: ["business cards", "art prints", "apparel"], capabilities: ["digital", "screenprinting", "letterpress"], economicZones: ["Opportunity Zone", "Neighborhood Opportunity Fund"], availableCapacity: 88, sustainabilityScore: 89 }
    ],
    industrial: [
      { id: "kinzie", name: "Kinzie Corridor", productTypes: ["brochures", "posters", "banners", "catalogs"], capabilities: ["digital", "offset", "largeformat"], economicZones: ["Enterprise Zone", "TIF District"], availableCapacity: 90, sustainabilityScore: 93 },
      { id: "calumet", name: "Calumet Corridor", productTypes: ["business cards", "art prints", "apparel"], capabilities: ["digital", "screenprinting", "letterpress"], economicZones: ["Opportunity Zone"], availableCapacity: 85, sustainabilityScore: 78 },
      { id: "pilsen", name: "Pilsen Industrial Corridor", productTypes: ["books", "magazines", "catalogs"], capabilities: ["digital", "offset", "binding"], economicZones: ["TIF District"], availableCapacity: 78, sustainabilityScore: 81 },
      { id: "rivernorth", name: "River North", productTypes: ["signage", "vehicle wraps", "canvas prints"], capabilities: ["digital", "largeformat", "screenprinting"], economicZones: [], availableCapacity: 45, sustainabilityScore: 70 }
    ],
    ward: [
      { id: "8", name: "8th Ward", productTypes: ["business cards", "art prints", "apparel"], capabilities: ["digital", "screenprinting", "letterpress"], economicZones: ["Opportunity Zone"], availableCapacity: 83, sustainabilityScore: 87 },
      { id: "25", name: "25th Ward", productTypes: ["books", "magazines", "catalogs"], capabilities: ["digital", "offset", "binding"], economicZones: ["TIF District"], availableCapacity: 75, sustainabilityScore: 82 },
      { id: "27", name: "27th Ward", productTypes: ["brochures", "posters", "banners", "catalogs"], capabilities: ["digital", "offset", "largeformat"], economicZones: ["Enterprise Zone", "TIF District"], availableCapacity: 92, sustainabilityScore: 91 },
      { id: "42", name: "42nd Ward", productTypes: ["signage", "vehicle wraps", "canvas prints"], capabilities: ["digital", "largeformat", "screenprinting"], economicZones: [], availableCapacity: 40, sustainabilityScore: 65 }
    ]
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--gray-dark)' }}>Find Print Producers</h1>
          <p style={{ color: 'var(--gray)' }} className="mt-1">Local Producer Intelligence for Print Professionals</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            className="btn btn-outline btn-sm flex items-center gap-2"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Sliders className="h-4 w-4" />
            <span>Filters</span>
          </button>
          <button 
            className="btn btn-primary btn-sm flex items-center gap-2"
            disabled={true}
          >
            <Database className="h-4 w-4" />
            <span>
              {isLoadingLicenses 
                ? 'Loading Data...' 
                : 'All Producer Data Loaded'}
            </span>
          </button>
          <button className="btn btn-primary btn-sm flex items-center gap-2">
            <PrinterIcon className="h-4 w-4" />
            <span>Add Your Print Shop</span>
          </button>
        </div>
      </div>
      
      {/* Producer Detail View */}
      {selectedProducer && (
        <div className="fixed inset-0 z-50 overflow-auto" style={{ background: 'var(--white)' }}>
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={clearSelectedProducer}
                className="btn btn-ghost btn-sm flex items-center gap-1"
              >
                ← Back to results
              </button>
              
              <div className="flex gap-2">
                <button className="btn btn-outline btn-sm flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>Save</span>
                </button>
                
                <button className="btn btn-primary btn-sm flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Contact</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="card overflow-hidden">
                  <div className="relative">
                    <UnsplashImage
                      src={selectedProducer.imageUrl}
                      alt={selectedProducer.name}
                      className="w-full h-80 object-cover"
                    />
                    
                    {/* Sustainability indicator */}
                    <div className="absolute top-3 right-3 z-10 bg-white/90 rounded-full p-1 shadow-md">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#eeeeee"
                            strokeWidth="3"
                            strokeDasharray="100, 100"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={selectedProducer.sustainabilityScore > 90 ? "var(--secondary)" : selectedProducer.sustainabilityScore > 75 ? "var(--primary)" : "var(--warning)"}
                            strokeWidth="3"
                            strokeDasharray={`${selectedProducer.sustainabilityScore}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Leaf className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                      <div>
                        <div className="flex items-center flex-wrap gap-2">
                          <h2 className="text-2xl font-bold" style={{ color: 'var(--gray-dark)' }}>{selectedProducer.name}</h2>
                          {selectedProducer.wifiEnabled && (
                            <span className="badge badge-outline flex items-center gap-1">
                              <WifiIcon className="w-3 h-3" />
                              WiFi Ready
                            </span>
                          )}
                          <span className="badge badge-secondary">
                            {selectedProducer.sustainabilityScore}% Sustainable
                          </span>
                        </div>
                        
                        <div className="flex items-center mt-2" style={{ color: 'var(--warning)' }}>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                          </div>
                          <span className="text-sm ml-1" style={{ color: 'var(--gray)' }}>({selectedProducer.reviews} reviews)</span>
                        </div>
                        
                        <div className="flex items-center mt-3" style={{ color: 'var(--gray)' }}>
                          <MapPin className="h-4 w-4 mr-2" style={{ color: 'var(--primary)' }} />
                          <span>{selectedProducer.location.address}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        {/* Capacity bar */}
                        <div className="flex flex-col mt-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium mr-2" style={{ color: 'var(--gray)' }}>Availability:</span>
                            <span className="text-sm font-medium" style={{ color: 'var(--gray)' }}>{selectedProducer.availabilityPercent}%</span>
                          </div>
                          <div className="capacity-bar-wrapper w-40">
                            <div 
                              className={`capacity-bar ${
                                selectedProducer.availabilityPercent > 70 ? 'capacity-high' : 
                                selectedProducer.availabilityPercent > 30 ? 'capacity-medium' : 'capacity-low'
                              }`}
                              style={{ width: `${selectedProducer.availabilityPercent}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex flex-col items-end">
                          <div className="text-sm" style={{ color: 'var(--gray)' }}>
                            <span className="font-medium" style={{ color: 'var(--gray-dark)' }}>Turnaround:</span> {selectedProducer.turnaround}
                          </div>
                          <div className="text-sm mt-1" style={{ color: 'var(--gray)' }}>
                            <span className="font-medium" style={{ color: 'var(--gray-dark)' }}>Price Range:</span> {selectedProducer.priceRange}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                      <div>
                        <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--gray-dark)' }}>Capabilities</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProducer.capabilities && selectedProducer.capabilities.length > 0 ? (
                            selectedProducer.capabilities.map((cap, index) => (
                              <span key={index} className="badge badge-outline">{cap}</span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">No capabilities information available</span>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-medium mb-3 mt-6" style={{ color: 'var(--gray-dark)' }}>Specialties</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProducer.specialties && selectedProducer.specialties.length > 0 ? (
                            selectedProducer.specialties.map((spec, index) => (
                              <span key={index} className="badge badge-secondary">{spec}</span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">No specialties information available</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--gray-dark)' }}>Map Location</h3>
                        <div className="h-48 bg-gray-100 rounded-lg">
                          <PrinterMap
                            producers={[selectedProducer]}
                            userLocation={userLocation}
                            onProducerSelect={() => {}}
                            mapLayers={{
                              zoning: true,
                              truckRoutes: selectedProducer?.transitAccess?.truckRoute,
                              economicZones: selectedProducer?.economicZones?.length > 0,
                              chicagoCorridors: true
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--gray-dark)' }}>Request a Quote</h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-dark)' }}>
                          Project Details
                        </label>
                        <textarea
                          rows={4}
                          className="input w-full"
                          style={{ minHeight: '100px' }}
                          placeholder="Describe your project..."
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--gray-dark)' }}>
                          Timeline
                        </label>
                        <select className="input w-full">
                          <option value="standard">Standard ({selectedProducer.turnaround})</option>
                          <option value="rush">Rush (additional fees apply)</option>
                          <option value="flexible">Flexible (may receive discount)</option>
                        </select>
                      </div>
                      
                      <button className="btn btn-primary w-full">Submit Request</button>
                    </form>
                  </div>
                </div>
                
                <div className="card">
                  <div className="card-body">
                    <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--gray-dark)' }}>Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex">
                        <span className="font-medium w-20" style={{ color: 'var(--gray-dark)' }}>Address:</span> 
                        <span style={{ color: 'var(--gray)' }}>{selectedProducer.location.address}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-20" style={{ color: 'var(--gray-dark)' }}>Website:</span> 
                        <a href={selectedProducer.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }} className="hover:underline">
                          {selectedProducer.website}
                        </a>
                      </div>
                      
                      {selectedProducer.verificationSources && selectedProducer.verificationSources.length > 0 && (
                        <div className="flex">
                          <span className="font-medium w-20" style={{ color: 'var(--gray-dark)' }}>Verified:</span> 
                          <span style={{ color: 'var(--gray)' }}>{selectedProducer.verificationSources.join(", ")}</span>
                        </div>
                      )}
                      
                      {/* Chicago Business License Data */}
                      {selectedProducer.licenseData && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center mb-2">
                            <FileCheck className="text-blue-600 mr-2 h-4 w-4" />
                            <span className="font-medium text-blue-700">Chicago Business License Data</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-blue-600">
                            <div>
                              <span className="font-medium block">License Number:</span>
                              {selectedProducer.licenseData.licenseNumber}
                            </div>
                            <div>
                              <span className="font-medium block">Type:</span>
                              {selectedProducer.licenseData.licenseType}
                            </div>
                            <div>
                              <span className="font-medium block">Issue Date:</span>
                              {selectedProducer.licenseData.issueDate}
                            </div>
                            <div>
                              <span className="font-medium block">Expiration:</span>
                              {selectedProducer.licenseData.expirationDate}
                            </div>
                            <div>
                              <span className="font-medium block">Status:</span>
                              {selectedProducer.licenseData.licenseStatus}
                            </div>
                            <div>
                              <span className="font-medium block">Legal Name:</span>
                              {selectedProducer.licenseData.legalName}
                            </div>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <a 
                              href={`https://data.cityofchicago.org/resource/r5kz-chrr.json?license_number=${selectedProducer.licenseData.licenseNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-700 flex items-center"
                            >
                              <span>View in Chicago Data Portal</span>
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  {mapType === 'network' && (
                    <button 
                      className={`btn ${selectedProducers.some(p => p.id === selectedProducer.id) ? 'btn-secondary' : 'btn-outline'} w-full`}
                      onClick={() => {
                        toggleProducerSelection(selectedProducer);
                        clearSelectedProducer();
                        setMapView(true);
                      }}
                    >
                      {selectedProducers.some(p => p.id === selectedProducer.id) 
                        ? 'View in Network Map' 
                        : 'Add to Network Map'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="space-y-6">
        {/* Search and view options */}
        <div className="card">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search bar */}
              <div className="relative flex-grow">
                <div className="input-with-icon">
                  <input
                    type="text"
                    placeholder="Search for print producers..."
                    className="input w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="icon">
                    <Search className="h-5 w-5" style={{ color: 'var(--gray)' }} />
                  </div>
                </div>
              </div>
              
              {/* View/Tabs toggle */}
              <div className="flex gap-2">
                <button 
                  className={`btn btn-sm ${activeTab === 'map' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => {
                    setActiveTab('map');
                    setMapView(true);
                  }}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Map View</span>
                </button>
                <button 
                  className={`btn btn-sm ${activeTab === 'data' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => {
                    setActiveTab('data');
                    setMapView(false);
                  }}
                >
                  <BarChart className="h-4 w-4 mr-1" />
                  <span>Data View</span>
                </button>
                <button 
                  className={`btn btn-sm ${activeTab === 'area' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => {
                    setActiveTab('area');
                    setMapView(true);
                  }}
                >
                  <Layers className="h-4 w-4 mr-1" />
                  <span>Area Analysis</span>
                </button>
              </div>
            </div>
            
            {/* Expandable filters */}
            {filtersOpen && (
              <div className="mt-4 border-t pt-4">
                <div className="flex flex-wrap gap-3 mb-2">
                  <h3 className="text-sm font-medium" style={{ color: 'var(--gray-dark)' }}>Filter by:</h3>
                  <button 
                    className={`badge ${selectedTab === 'all' ? 'badge-primary' : 'badge-outline'}`}
                    onClick={() => setSelectedTab('all')}
                  >
                    All Producers
                  </button>
                  <button 
                    className={`badge ${selectedTab === 'wifi-enabled' ? 'badge-primary' : 'badge-outline'} flex items-center gap-1`}
                    onClick={() => setSelectedTab('wifi-enabled')}
                  >
                    <WifiIcon className="h-3 w-3" />
                    <span>WiFi Ready</span>
                  </button>
                  <button 
                    className={`badge ${selectedTab === 'eco-friendly' ? 'badge-secondary' : 'badge-outline'} flex items-center gap-1`}
                    onClick={() => setSelectedTab('eco-friendly')}
                  >
                    <Leaf className="h-3 w-3" />
                    <span>Eco-Friendly</span>
                  </button>
                  <button 
                    className={`badge ${selectedTab === 'local' ? 'badge-primary' : 'badge-outline'} flex items-center gap-1`}
                    onClick={() => setSelectedTab('local')}
                  >
                    <MapPin className="h-3 w-3" />
                    <span>Local</span>
                  </button>
                  <button 
                    className={`badge ${selectedTab === 'business-licensed' ? 'badge-primary' : 'badge-outline'} flex items-center gap-1`}
                    onClick={() => setSelectedTab('business-licensed')}
                  >
                    <FileCheck className="h-3 w-3" />
                    <span>Verified Businesses</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {/* Capabilities filter */}
                  <div className="border rounded-lg p-3">
                    <div className="font-medium text-sm mb-2">Capabilities</div>
                    <div className="space-y-1">
                      {['digital printing', 'offset printing', 'screen printing', 'large format', 'letterpress', 'binding', 'foiling', 'embossing'].map(cap => (
                        <div key={cap} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`cap-${cap}`}
                            className="mr-2"
                          />
                          <label htmlFor={`cap-${cap}`} className="text-sm capitalize">{cap}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Economic Zones filter */}
                  <div className="border rounded-lg p-3">
                    <div className="font-medium text-sm mb-2">Economic Zones</div>
                    <div className="space-y-1">
                      {[
                        { id: 'enterprise-zone', label: 'Enterprise Zone' },
                        { id: 'tif-district', label: 'TIF District' },
                        { id: 'opportunity-zone', label: 'Opportunity Zone' }, 
                        { id: 'nof', label: 'Neighborhood Opportunity Fund' },
                        { id: 'minority-owned', label: 'Minority-Owned Business' },
                        { id: 'women-owned', label: 'Women-Owned Business' }
                      ].map(zone => (
                        <div key={zone.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={zone.id}
                            className="mr-2"
                          />
                          <label htmlFor={zone.id} className="text-sm">{zone.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Sustainability filter */}
                  <div className="border rounded-lg p-3">
                    <div className="font-medium text-sm mb-2">Sustainability</div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Minimum Score</label>
                        <div className="flex items-center">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            defaultValue="0"
                            className="w-full"
                          />
                          <span className="ml-2 text-sm text-gray-600">0</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {[
                          { id: 'green-certified', label: 'Green Certified' },
                          { id: 'recycled-materials', label: 'Uses Recycled Materials' },
                          { id: 'solar-powered', label: 'Solar Powered' },
                          { id: 'carbon-neutral', label: 'Carbon Neutral' },
                          { id: 'fsc-certified', label: 'FSC Certified' }
                        ].map(option => (
                          <div key={option.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={option.id}
                              className="mr-2"
                            />
                            <label htmlFor={option.id} className="text-sm">{option.label}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {activeTab === 'map' && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--gray-dark)' }}>Map Options:</h3>
                    <div className="flex flex-wrap gap-3">
                      <button 
                        className={`badge ${mapType === 'basic' ? 'badge-primary' : 'badge-outline'} flex items-center gap-1`}
                        onClick={() => setMapType('basic')}
                      >
                        <PrinterIcon className="h-3 w-3" />
                        <span>Basic Map</span>
                      </button>
                      <button 
                        className={`badge ${mapType === 'network' ? 'badge-primary' : 'badge-outline'} flex items-center gap-1`}
                        onClick={() => setMapType('network')}
                      >
                        <MapPin className="h-3 w-3" />
                        <span>Network View</span>
                      </button>
                      
                      {mapType === 'network' && (
                        <div className="flex gap-2 ml-4">
                          <button 
                            className={`badge ${transportMode === 'car' ? 'badge-primary' : 'badge-outline'}`}
                            onClick={() => setTransportMode('car')}
                          >
                            <Car className="h-3 w-3 mr-1" />
                            Car
                          </button>
                          <button 
                            className={`badge ${transportMode === 'bike' ? 'badge-primary' : 'badge-outline'}`}
                            onClick={() => setTransportMode('bike')}
                          >
                            <Bike className="h-3 w-3 mr-1" />
                            Bike
                          </button>
                          <button 
                            className={`badge ${transportMode === 'foot' ? 'badge-primary' : 'badge-outline'}`}
                            onClick={() => setTransportMode('foot')}
                          >
                            <Footprints className="h-3 w-3 mr-1" />
                            Walk
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {activeTab === 'area' && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--gray-dark)' }}>Area Analysis View:</h3>
                    <div className="flex border rounded overflow-hidden">
                      <button 
                        className={`px-3 py-1.5 text-sm ${areaView === 'zip' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50'}`}
                        onClick={() => setAreaView('zip')}
                      >
                        ZIP Codes
                      </button>
                      <button 
                        className={`px-3 py-1.5 text-sm border-l ${areaView === 'industrial' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50'}`}
                        onClick={() => setAreaView('industrial')}
                      >
                        Industrial Corridors
                      </button>
                      <button 
                        className={`px-3 py-1.5 text-sm border-l ${areaView === 'ward' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50'}`}
                        onClick={() => setAreaView('ward')}
                      >
                        City Wards
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  <button className="btn btn-sm btn-outline">Clear All</button>
                </div>
              </div>
            )}
            
            {/* Results count */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <span style={{ color: 'var(--gray)' }}>
                  {filteredProducers.length} Print {filteredProducers.length === 1 ? 'Producer' : 'Producers'} Found
                </span>
                {searchQuery && (
                  <button 
                    className="ml-3 flex items-center text-sm" 
                    style={{ color: 'var(--primary)' }}
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear Search
                  </button>
                )}
              </div>
              
              {/* Data source indicator */}
              <div className="flex items-center text-sm">
                <span className="badge badge-outline badge-sm flex gap-1 items-center">
                  <FileCheck className="h-3 w-3" />
                  <span>Showing {filteredProducers.length} of {allProducers.length} Producers</span>
                </span>
                {isLoadingLicenses && <span className="ml-2 text-gray-500">Loading...</span>}
                {licenseError && (
                  <span className="ml-2 text-red-500 text-xs">{licenseError}</span>
                )}
                {!isLoadingLicenses && (
                  <span className="ml-2 text-green-500 text-xs">✓ Including diverse producers (printing, coffee, glass, binding, ceramics, etc.)</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content based on active tab */}
        {activeTab === 'map' && (
          <div className="card overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium" style={{ color: 'var(--gray-dark)' }}>Map View</h3>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-outline flex items-center gap-1">
                  <Layers className="h-4 w-4" />
                  <span>Map Layers</span>
                </button>
                <button className="btn btn-sm btn-outline flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
            <div className="h-[600px]">
              {mapType === 'network' ? (
                <NetworkMap
                  userLocation={userLocation}
                  producers={filteredProducers}
                  selectedProducers={selectedProducers}
                  onRouteSelect={handleProducerSelect}
                  transportMode={transportMode}
                />
              ) : (
                <PrinterMap
                  producers={filteredProducers}
                  userLocation={userLocation}
                  onProducerSelect={handleProducerSelect}
                  mapLayers={mapLayers}
                />
              )}
            </div>
            
            {mapType === 'network' && selectedProducers.length > 0 && (
              <div className="p-4 border-t">
                <h3 className="font-medium mb-2" style={{ color: 'var(--gray-dark)' }}>Selected Producers</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProducers.map(producer => (
                    <div 
                      key={producer.id}
                      className="badge badge-primary flex items-center gap-1"
                    >
                      <span>{producer.name}</span>
                      <button
                        onClick={() => toggleProducerSelection(producer)}
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  
                  {selectedProducers.length > 1 && (
                    <button 
                      className="text-sm ml-2" 
                      style={{ color: 'var(--primary)' }}
                      onClick={() => setSelectedProducers([])}
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* Map controls that can be toggled */}
            <div className="p-4 border-t">
              <div className="text-sm mb-2 font-medium">Map Layers</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="layer-zoning"
                    checked={mapLayers.zoning}
                    onChange={(e) => setMapLayers({...mapLayers, zoning: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="layer-zoning" className="text-sm">Industrial Zoning</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="layer-sustainability"
                    checked={mapLayers.sustainability}
                    onChange={(e) => setMapLayers({...mapLayers, sustainability: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="layer-sustainability" className="text-sm">Sustainability Heat Map</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="layer-truck-routes"
                    checked={mapLayers.truckRoutes}
                    onChange={(e) => setMapLayers({...mapLayers, truckRoutes: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="layer-truck-routes" className="text-sm">Truck Routes</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="layer-economic-zones"
                    checked={mapLayers.economicZones}
                    onChange={(e) => setMapLayers({...mapLayers, economicZones: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="layer-economic-zones" className="text-sm">Economic Zones</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="layer-production-density"
                    checked={mapLayers.productionDensity}
                    onChange={(e) => setMapLayers({...mapLayers, productionDensity: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="layer-production-density" className="text-sm">Production Density</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="layer-chicago-corridors"
                    checked={mapLayers.chicagoCorridors}
                    onChange={(e) => setMapLayers({...mapLayers, chicagoCorridors: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="layer-chicago-corridors" className="text-sm">Chicago Industrial Corridors</label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Data view (Table) */}
        {activeTab === 'data' && (
          <div className="card overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-medium" style={{ color: 'var(--gray-dark)' }}>Producer Data View</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Capabilities</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Specialties</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Trust</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Zip</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Lead Time</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducers.map((producer) => (
                    <tr 
                      key={producer.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedProducer(producer)}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium">{producer.name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {producer.capabilities && producer.capabilities.length > 0 ? (
                            <>
                              {producer.capabilities.slice(0, 2).map((cap, idx) => (
                                <span key={idx} className="badge badge-outline text-xs">{cap}</span>
                              ))}
                              {producer.capabilities.length > 2 && <span className="text-xs">+{producer.capabilities.length - 2}</span>}
                            </>
                          ) : (
                            <span className="text-xs text-gray-500">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{producer.specialties.slice(0, 2).join(', ')}{producer.specialties.length > 2 ? '...' : ''}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm">{producer.scores?.trust || '-'}/100</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm">{producer.location.zip}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm">{producer.turnaround}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProducer(producer);
                            }}
                          >View</button>
                          
                          {producer.licenseData && (
                            <span 
                              className="badge badge-xs badge-outline" 
                              title="Verified by Chicago Business License"
                            >
                              <FileCheck className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Area Analysis */}
        {activeTab === 'area' && (
          <div className="card overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-medium" style={{ color: 'var(--gray-dark)' }}>
                {areaView === 'zip' ? 'ZIP Code Analysis' : 
                 areaView === 'industrial' ? 'Industrial Corridor Analysis' : 
                 'Ward Analysis'}
              </h3>
            </div>
            
            <div className="flex h-[600px]">
              {/* Area listing */}
              <div className="w-64 border-r p-4 overflow-y-auto">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder={`Search ${areaView === 'zip' ? 'ZIP codes' : areaView === 'industrial' ? 'corridors' : 'wards'}...`}
                    className="input w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  {mockAreaData[areaView].map((area, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 border rounded-lg cursor-pointer ${selectedArea === area ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                      onClick={() => setSelectedArea(area)}
                    >
                      <div className="font-medium">
                        {areaView === 'zip' ? area.code : area.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {areaView === 'zip' ? area.name : `ID: ${area.id}`}
                      </div>
                      <div className="flex mt-2 space-x-1">
                        {area.capabilities.slice(0, 2).map(cap => (
                          <span key={cap} className="badge badge-outline badge-sm">{cap}</span>
                        ))}
                        {area.capabilities.length > 2 && (
                          <span className="badge badge-outline badge-sm">+{area.capabilities.length - 2}</span>
                        )}
                      </div>
                      <div className="flex justify-between mt-2 text-xs">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{area.availableCapacity}%</span>
                        </div>
                        <div className="flex items-center">
                          <Leaf className="h-3 w-3 mr-1" />
                          <span>{area.sustainabilityScore}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Area detail view */}
              <div className="flex-1 p-4 overflow-y-auto">
                {selectedArea ? (
                  <>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-bold">
                          {areaView === 'zip' ? `ZIP: ${selectedArea.code}` : selectedArea.name}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {areaView === 'zip' ? selectedArea.name : `ID: ${selectedArea.id}`}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="btn btn-outline btn-sm">
                          View on Map
                        </button>
                        <button className="btn btn-primary btn-sm">
                          Analyze Jobs
                        </button>
                      </div>
                    </div>
                    
                    {selectedArea && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-3">Available Capabilities</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedArea.capabilities.map(cap => (
                                <div key={cap} className="badge badge-outline badge-lg">{cap}</div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-3">Product Types</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedArea.productTypes.map(product => (
                                <div key={product} className="badge badge-secondary badge-lg">{product}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Area Metrics</h4>
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <div className="text-sm text-gray-600 mb-1">Production Capacity</div>
                              <div className="flex items-end">
                                <div className="text-2xl font-bold text-blue-700">{selectedArea.availableCapacity}%</div>
                                <div className="text-xs text-gray-500 ml-2 mb-1">currently available</div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${selectedArea.availableCapacity}%`}}></div>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 mb-1">Sustainability Score</div>
                              <div className="flex items-end">
                                <div className="text-2xl font-bold text-green-700">{selectedArea.sustainabilityScore}</div>
                                <div className="text-xs text-gray-500 ml-2 mb-1">area average</div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                <div className="bg-green-600 h-2.5 rounded-full" style={{width: `${selectedArea.sustainabilityScore}%`}}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Economic Incentives</h4>
                          {selectedArea.economicZones.length > 0 ? (
                            <div className="space-y-3">
                              {selectedArea.economicZones.map((zone, idx) => (
                                <div key={idx} className="flex border-l-4 border-purple-500 bg-purple-50 p-3 rounded-r-lg">
                                  <Award className="text-purple-600 mr-3" />
                                  <div>
                                    <div className="font-medium">{zone}</div>
                                    <div className="text-sm text-gray-600 mt-1">
                                      {zone === 'TIF District' ? 
                                        'Tax increment financing available for qualifying projects' : 
                                      zone === 'Enterprise Zone' ? 
                                        'Tax incentives and regulatory relief for businesses' :
                                      zone === 'Opportunity Zone' ?
                                        'Federal tax incentives for investments in this area' :
                                      zone === 'Neighborhood Opportunity Fund' ?
                                        'Grant funding available for commercial projects' :
                                        'Economic incentives available for qualifying businesses'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-500 p-3">No economic zones or incentives identified in this area.</div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Select an area from the list to view details
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Producer list - only shows for data tab when not in map view */}
        {!mapView && activeTab === 'data' && (
          <div className="space-y-6">
            {filteredProducers.length === 0 ? (
              <div className="card">
                <div className="card-body text-center py-12">
                  <p style={{ color: 'var(--gray)' }}>No producers found matching your criteria.</p>
                  <button 
                    className="btn btn-outline mt-4 mx-auto"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTab('all');
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducers.map(producer => (
                  <ProducerCard 
                    key={producer.id} 
                    producer={producer}
                    showDistance={true}
                    onRouteClick={() => handleProducerSelect(producer)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Jobs Queue Tab */}
        {activeTab === 'jobs' && (
          <div className="card overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-medium" style={{ color: 'var(--gray-dark)' }}>Job Queue & SmartMatch System</h3>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h4 className="font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    Pending Jobs
                  </h4>
                  <div className="text-3xl font-bold mt-2">3</div>
                  <div className="text-sm text-gray-500 mt-1">Awaiting producer matching</div>
                </div>
                
                <div className="border rounded-lg p-4 bg-green-50">
                  <h4 className="font-medium flex items-center">
                    <CheckSquare className="h-4 w-4 mr-2 text-green-600" />
                    Active Jobs
                  </h4>
                  <div className="text-3xl font-bold mt-2">7</div>
                  <div className="text-sm text-gray-500 mt-1">In production pipeline</div>
                </div>
                
                <div className="border rounded-lg p-4 bg-purple-50">
                  <h4 className="font-medium flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
                    Match Success Rate
                  </h4>
                  <div className="text-3xl font-bold mt-2">94%</div>
                  <div className="text-sm text-gray-500 mt-1">Jobs successfully matched</div>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden mb-6">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Job ID</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Required Capabilities</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">#JOB-2354</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">Corporate Brochure Printing</div>
                        <div className="text-xs text-gray-500">250 copies, full color, 12 pages</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          <span className="badge badge-outline text-xs">offset</span>
                          <span className="badge badge-outline text-xs">binding</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="badge badge-warning">Matching</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                        Today, 10:24 AM
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                        May 10, 2025
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-blue-600">
                        <button className="hover:text-blue-800">View</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">#JOB-2353</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">Custom T-Shirt Order</div>
                        <div className="text-xs text-gray-500">50 shirts, 2 colors, front and back</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          <span className="badge badge-outline text-xs">screenprinting</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="badge badge-warning">Matching</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                        Today, 9:45 AM
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                        May 15, 2025
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-blue-600">
                        <button className="hover:text-blue-800">View</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-blue-50">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">#JOB-2352</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">Trade Show Banner</div>
                        <div className="text-xs text-gray-500">8ft x 4ft, full color, vinyl</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          <span className="badge badge-outline text-xs">largeformat</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="badge badge-success">Matched</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                        Yesterday
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                        May 12, 2025
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-blue-600">
                        <button className="hover:text-blue-800">View</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-700">Data Sources Powering SmartMatch</h3>
                    <div className="mt-2 text-sm text-blue-600">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Business verification via Chicago Business Licenses</li>
                        <li>Property verification via Cook County Property Records (PIN)</li>
                        <li>Geographic routing via CDOT Truck Routes & Transit Data</li>
                        <li>Equity impact analysis via Economic Development zones</li>
                        <li>Real-time capacity calculations via producer profiles</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Producers;