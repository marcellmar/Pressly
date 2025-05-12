import { useState, useEffect } from 'react';
import { 
  Map, 
  AlertCircle, 
  Printer, 
  Truck, 
  Zap, 
  Award, 
  Filter, 
  Download, 
  Layers, 
  BarChart,
  Search,
  ChevronRight,
  ChevronDown,
  Database,
  FileText,
  Info,
  Users,
  TrendingUp,
  Calendar,
  CheckSquare,
  Clock,
  Shield
} from 'lucide-react';

const PresslyMVP = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    distance: 10,
    capabilities: ['digital', 'offset', 'screenprinting'],
    verifiedOnly: true,
    sustainabilityMin: 0
  });
  
  const [expandedFilters, setExpandedFilters] = useState({
    capabilities: true,
    productTypes: false,
    verification: false,
    sustainability: false,
    economicZones: false,
    transitAccess: false,
    productionCapacity: false,
    propertyData: false
  });
  
  const [producers, setProducers] = useState([]);
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [areaView, setAreaView] = useState('zip'); // 'zip', 'industrial', 'ward'
  const [mapLayers, setMapLayers] = useState({
    zoning: true,
    sustainability: false,
    truckRoutes: true,
    economicZones: false,
    productionDensity: false
  });
  
  // Mock data for demonstration
  useEffect(() => {
    const mockProducers = [
      {
        id: 1,
        name: "EcoPress Chicago",
        location: {
          address: "1234 W Industrial Ave, Chicago, IL 60612",
          lat: 41.889,
          lng: -87.654,
          zip: "60612",
          ward: "27",
          industrialCorridor: "Kinzie",
          propertyPIN: "16-12-345-678-0000"
        },
        capabilities: ["digital", "offset", "largeformat"],
        productTypes: ["brochures", "posters", "banners", "books", "catalogs"],
        scores: {
          trust: 92,
          capability: 88,
          accessibility: 95,
          sustainability: 97,
          equity: 84
        },
        capacity: {
          availableHours: 35,
          leadTime: "3-5 days",
          maxSize: "60 x 100 inches"
        },
        verificationSources: ["Chicago Business License", "EPA Green Business", "OpenStreetMap", "Cook County Property Records"],
        lastVerified: "2025-04-12",
        website: "https://ecopresschicago.com",
        contact: "info@ecopresschicago.com",
        naicsCode: "323111",
        zoningCompliant: true,
        sustainabilityBadges: ["Green Certified", "Solar Powered", "Recycled Materials"],
        equipment: ["HP Indigo 12000", "Heidelberg Speedmaster XL 106", "Canon Arizona 1380 GT"],
        economicZones: ["Enterprise Zone", "TIF District"],
        transitAccess: {
          truckRoute: true,
          publicTransit: true,
          bikeways: true
        }
      },
      {
        id: 2,
        name: "Urban Print Solutions",
        location: {
          address: "567 N Printer Row, Chicago, IL 60610",
          lat: 41.892,
          lng: -87.635,
          zip: "60610",
          ward: "42",
          industrialCorridor: "River North",
          propertyPIN: "17-09-876-543-0000"
        },
        capabilities: ["digital", "largeformat", "screenprinting"],
        productTypes: ["t-shirts", "signage", "stickers", "canvas prints", "vehicle wraps"],
        scores: {
          trust: 85,
          capability: 92,
          accessibility: 88,
          sustainability: 72,
          equity: 65
        },
        capacity: {
          availableHours: 22,
          leadTime: "2-4 days",
          maxSize: "120 x 240 inches"
        },
        verificationSources: ["Illinois Secretary of State", "OpenCorporates", "Cook County Property Records"],
        lastVerified: "2025-03-28",
        website: "https://urbanprintsolutions.com",
        contact: "orders@urbanprintsolutions.com",
        naicsCode: "323113",
        zoningCompliant: true,
        sustainabilityBadges: ["Recycled Materials"],
        equipment: ["Roland TrueVIS VG3-640", "Epson SureColor S80600", "M&R Sportsman EX"],
        economicZones: [],
        transitAccess: {
          truckRoute: true,
          publicTransit: true,
          bikeways: false
        }
      },
      {
        id: 3,
        name: "South Side Printers Collective",
        location: {
          address: "789 E 73rd St, Chicago, IL 60619",
          lat: 41.762,
          lng: -87.586,
          zip: "60619",
          ward: "8",
          industrialCorridor: "Calumet",
          propertyPIN: "20-26-123-456-0000"
        },
        capabilities: ["digital", "screenprinting", "letterpress"],
        productTypes: ["business cards", "wedding invitations", "art prints", "apparel", "packaging"],
        scores: {
          trust: 78,
          capability: 85,
          accessibility: 76,
          sustainability: 89,
          equity: 98
        },
        capacity: {
          availableHours: 40,
          leadTime: "4-7 days",
          maxSize: "20 x 26 inches"
        },
        verificationSources: ["Chicago Business License", "Community Verified", "Cook County Property Records"],
        lastVerified: "2025-04-01",
        website: "https://southsideprinters.coop",
        contact: "hello@southsideprinters.coop",
        naicsCode: "323111",
        zoningCompliant: true,
        sustainabilityBadges: ["Community Owned", "Recycled Materials"],
        equipment: ["Xerox Versant 280", "Vandercook SP-15", "Riley Hopkins 250"],
        economicZones: ["Opportunity Zone", "Neighborhood Opportunity Fund"],
        transitAccess: {
          truckRoute: false,
          publicTransit: true,
          bikeways: true
        }
      },
      {
        id: 4,
        name: "Pilsen Print Works",
        location: {
          address: "1820 S Halsted St, Chicago, IL 60608",
          lat: 41.857,
          lng: -87.646,
          zip: "60608",
          ward: "25",
          industrialCorridor: "Pilsen",
          propertyPIN: "17-20-987-654-0000"
        },
        capabilities: ["digital", "offset", "binding"],
        productTypes: ["books", "magazines", "catalogs", "annual reports", "portfolios"],
        scores: {
          trust: 88,
          capability: 90,
          accessibility: 82,
          sustainability: 75,
          equity: 88
        },
        capacity: {
          availableHours: 15,
          leadTime: "5-8 days",
          maxSize: "12 x 18 inches"
        },
        verificationSources: ["Chicago Business License", "OpenCorporates", "Cook County Property Records"],
        lastVerified: "2025-03-15",
        website: "https://pilsenprintworks.com",
        contact: "orders@pilsenprintworks.com",
        naicsCode: "323117",
        zoningCompliant: true,
        sustainabilityBadges: ["FSC Certified"],
        equipment: ["Konica Minolta AccurioPress C14000", "Heidelberg GTO 52", "Muller Martini Presto II"],
        economicZones: ["TIF District"],
        transitAccess: {
          truckRoute: true,
          publicTransit: true,
          bikeways: true
        }
      }
    ];
    
    // Mock area data
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
    
    setProducers(mockProducers);
    window.mockAreaData = mockAreaData; // Making it available globally for this demo
  }, []);
  
  const handleProducerSelect = (producer) => {
    setSelectedProducer(producer);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow py-4 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="text-xl font-bold text-blue-600">Pressly</div>
            <div className="text-sm text-gray-600">Local Producer Intelligence</div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-sm text-gray-600 hover:text-blue-600">About</button>
            <button className="text-sm text-gray-600 hover:text-blue-600">Help</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Add Your Print Shop</button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Search and filters */}
        <div className="w-80 bg-white shadow-md p-4 flex flex-col">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for print producers..."
                className="w-full border rounded-lg py-2 px-4 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-3 top-2.5 text-gray-400">
                <Search size={18} />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-800">Filters</h3>
              <button className="text-blue-600 text-sm flex items-center">
                <Filter size={14} className="mr-1" /> Clear All
              </button>
            </div>
            
            {/* Distance Filter - Always Visible */}
            <div className="mb-4 border rounded-lg p-3">
              <div className="flex items-center justify-between cursor-pointer">
                <label className="block text-sm font-medium text-gray-700">Distance</label>
              </div>
              <div className="mt-2">
                <div className="flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={filters.distance}
                    onChange={(e) => setFilters({...filters, distance: e.target.value})}
                    className="w-full"
                  />
                  <span className="ml-2 text-sm text-gray-600">{filters.distance} mi</span>
                </div>
              </div>
            </div>
            
            {/* Capabilities Filter - Dropdown */}
            <div className="mb-4 border rounded-lg p-3">
              <div 
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => setExpandedFilters({...expandedFilters, capabilities: !expandedFilters.capabilities})}
              >
                <label className="block text-sm font-medium text-gray-700">Capabilities</label>
                {expandedFilters.capabilities ? 
                  <ChevronDown size={16} className="text-gray-400" /> : 
                  <ChevronRight size={16} className="text-gray-400" />
                }
              </div>
              {expandedFilters.capabilities && (
                <div className="space-y-1">
                  {['digital', 'offset', 'screenprinting', 'largeformat', 'letterpress', 'binding', 'foiling', 'embossing', 'die-cutting', 'variable data'].map(cap => (
                    <div key={cap} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`cap-${cap}`}
                        checked={filters.capabilities.includes(cap)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({...filters, capabilities: [...filters.capabilities, cap]});
                          } else {
                            setFilters({...filters, capabilities: filters.capabilities.filter(c => c !== cap)});
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`cap-${cap}`} className="text-sm capitalize">{cap}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Types Filter - Dropdown */}
            <div className="mb-4 border rounded-lg p-3">
              <div 
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => setExpandedFilters({...expandedFilters, productTypes: !expandedFilters.productTypes})}
              >
                <label className="block text-sm font-medium text-gray-700">Product Types</label>
                {expandedFilters.productTypes ? 
                  <ChevronDown size={16} className="text-gray-400" /> : 
                  <ChevronRight size={16} className="text-gray-400" />
                }
              </div>
              {expandedFilters.productTypes && (
                <div className="space-y-1">
                  {['business cards', 'brochures', 'posters', 'banners', 'books', 'catalogs', 'magazines', 'packaging', 'labels', 'stickers', 'apparel', 'signage', 'canvas prints'].map(product => (
                    <div key={product} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`product-${product.replace(/\s+/g, '-')}`}
                        className="mr-2"
                      />
                      <label htmlFor={`product-${product.replace(/\s+/g, '-')}`} className="text-sm capitalize">{product}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Verification Filter - Dropdown */}
            <div className="mb-4 border rounded-lg p-3">
              <div 
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => setExpandedFilters({...expandedFilters, verification: !expandedFilters.verification})}
              >
                <label className="block text-sm font-medium text-gray-700">Verification</label>
                {expandedFilters.verification ? 
                  <ChevronDown size={16} className="text-gray-400" /> : 
                  <ChevronRight size={16} className="text-gray-400" />
                }
              </div>
              {expandedFilters.verification && (
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="verified-only"
                      checked={filters.verifiedOnly}
                      onChange={(e) => setFilters({...filters, verifiedOnly: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="verified-only" className="text-sm">Verified businesses only</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="property-verified"
                      className="mr-2"
                    />
                    <label htmlFor="property-verified" className="text-sm">Property records verified</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="license-verified"
                      className="mr-2"
                    />
                    <label htmlFor="license-verified" className="text-sm">Business license verified</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="naics-verified"
                      className="mr-2"
                    />
                    <label htmlFor="naics-verified" className="text-sm">NAICS code verified</label>
                  </div>
                </div>
              )}
            </div>
            
            {/* Sustainability Filter - Dropdown */}
            <div className="mb-4 border rounded-lg p-3">
              <div 
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => setExpandedFilters({...expandedFilters, sustainability: !expandedFilters.sustainability})}
              >
                <label className="block text-sm font-medium text-gray-700">Sustainability</label>
                {expandedFilters.sustainability ? 
                  <ChevronDown size={16} className="text-gray-400" /> : 
                  <ChevronRight size={16} className="text-gray-400" />
                }
              </div>
              {expandedFilters.sustainability && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Minimum Score</label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.sustainabilityMin}
                        onChange={(e) => setFilters({...filters, sustainabilityMin: e.target.value})}
                        className="w-full"
                      />
                      <span className="ml-2 text-sm text-gray-600">{filters.sustainabilityMin}</span>
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
              )}
            </div>

            {/* Economic Zones Filter - Dropdown */}
            <div className="mb-4 border rounded-lg p-3">
              <div 
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => setExpandedFilters({...expandedFilters, economicZones: !expandedFilters.economicZones})}
              >
                <label className="block text-sm font-medium text-gray-700">Economic Zones</label>
                {expandedFilters.economicZones ? 
                  <ChevronDown size={16} className="text-gray-400" /> : 
                  <ChevronRight size={16} className="text-gray-400" />
                }
              </div>
              {expandedFilters.economicZones && (
                <div className="space-y-1">
                  {[
                    { id: 'enterprise-zone', label: 'Enterprise Zone' },
                    { id: 'tif-district', label: 'TIF District' },
                    { id: 'opportunity-zone', label: 'Opportunity Zone' }, 
                    { id: 'nof', label: 'Neighborhood Opportunity Fund' },
                    { id: 'minority-owned', label: 'Minority-Owned Business' },
                    { id: 'women-owned', label: 'Women-Owned Business' },
                    { id: 'veteran-owned', label: 'Veteran-Owned Business' }
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
              )}
            </div>

            {/* Transit Access Filter - Dropdown */}
            <div className="mb-4 border rounded-lg p-3">
              <div 
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => setExpandedFilters({...expandedFilters, transitAccess: !expandedFilters.transitAccess})}
              >
                <label className="block text-sm font-medium text-gray-700">Transit Access</label>
                {expandedFilters.transitAccess ? 
                  <ChevronDown size={16} className="text-gray-400" /> : 
                  <ChevronRight size={16} className="text-gray-400" />
                }
              </div>
              {expandedFilters.transitAccess && (
                <div className="space-y-1">
                  {[
                    {id: 'truck-route', label: 'Truck Route Access'},
                    {id: 'public-transit', label: 'Public Transit Access'},
                    {id: 'bike-friendly', label: 'Bike-Friendly Access'},
                    {id: 'loading-dock', label: 'Loading Dock Available'},
                    {id: 'freight-elevator', label: 'Freight Elevator Available'}
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
              )}
            </div>

            {/* Production Capacity Filter - Dropdown */}
            <div className="mb-4 border rounded-lg p-3">
              <div 
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => setExpandedFilters({...expandedFilters, productionCapacity: !expandedFilters.productionCapacity})}
              >
                <label className="block text-sm font-medium text-gray-700">Production Capacity</label>
                {expandedFilters.productionCapacity ? 
                  <ChevronDown size={16} className="text-gray-400" /> : 
                  <ChevronRight size={16} className="text-gray-400" />
                }
              </div>
              {expandedFilters.productionCapacity && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Minimum Available Hours</label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value="10"
                        className="w-full"
                      />
                      <span className="ml-2 text-sm text-gray-600">10h</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Maximum Lead Time</label>
                    <select className="w-full border rounded p-2 text-sm">
                      <option>Any</option>
                      <option>1-2 days</option>
                      <option>3-5 days</option>
                      <option>1 week</option>
                      <option>2 weeks</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Size Capabilities</label>
                    <select className="w-full border rounded p-2 text-sm">
                      <option>Any</option>
                      <option>Small (up to 11×17)</option>
                      <option>Medium (up to 24×36)</option>
                      <option>Large (up to 48×96)</option>
                      <option>Extra Large (96+ inches)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Property Data Filter - Dropdown */}
            <div className="mb-4 border rounded-lg p-3">
              <div 
                className="flex items-center justify-between cursor-pointer mb-2"
                onClick={() => setExpandedFilters({...expandedFilters, propertyData: !expandedFilters.propertyData})}
              >
                <label className="block text-sm font-medium text-gray-700">Property Characteristics</label>
                {expandedFilters.propertyData ? 
                  <ChevronDown size={16} className="text-gray-400" /> : 
                  <ChevronRight size={16} className="text-gray-400" />
                }
              </div>
              {expandedFilters.propertyData && (
                <div className="space-y-1">
                  {[
                    {id: 'industrial-zoning', label: 'Industrial Zoning'},
                    {id: 'manufacturing-district', label: 'Planned Manufacturing District'},
                    {id: 'commercial-corridor', label: 'Commercial Corridor'},
                    {id: 'has-loading-zone', label: 'Has Loading Zone Permit'},
                    {id: 'meets-floor-load', label: 'Meets Floor Load Requirements'}
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
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <h3 className="font-medium text-gray-800 mb-2">Results ({producers.length})</h3>
            
            <div className="space-y-3">
              {producers.map(producer => (
                <div 
                  key={producer.id}
                  className={`bg-white border rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors ${selectedProducer?.id === producer.id ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
                  onClick={() => handleProducerSelect(producer)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{producer.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{producer.location.address}</p>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <AlertCircle size={12} className="mr-1" /> Verified
                    </div>
                  </div>
                  
                  <div className="flex mt-2 space-x-2">
                    {producer.capabilities.map(cap => (
                      <span key={cap} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded capitalize">{cap}</span>
                    ))}
                  </div>
                  
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    <div className="flex flex-col items-center">
                      <div className="text-xs font-medium">Trust</div>
                      <div className={`text-sm font-bold ${producer.scores.trust > 80 ? 'text-green-600' : 'text-yellow-600'}`}>{producer.scores.trust}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xs font-medium">Capability</div>
                      <div className={`text-sm font-bold ${producer.scores.capability > 80 ? 'text-green-600' : 'text-yellow-600'}`}>{producer.scores.capability}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xs font-medium">Access</div>
                      <div className={`text-sm font-bold ${producer.scores.accessibility > 80 ? 'text-green-600' : 'text-yellow-600'}`}>{producer.scores.accessibility}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xs font-medium">Eco</div>
                      <div className={`text-sm font-bold ${producer.scores.sustainability > 80 ? 'text-green-600' : 'text-yellow-600'}`}>{producer.scores.sustainability}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xs font-medium">Equity</div>
                      <div className={`text-sm font-bold ${producer.scores.equity > 80 ? 'text-green-600' : 'text-yellow-600'}`}>{producer.scores.equity}</div>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <Clock size={12} className="mr-1" /> 
                    <span className="mr-3">Lead time: {producer.capacity.leadTime}</span>
                    <Calendar size={12} className="mr-1" /> 
                    <span>Available capacity: {producer.capacity.availableHours}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="bg-white p-2 shadow-sm flex items-center">
            <div className="flex space-x-1">
              <button 
                className={`px-4 py-2 text-sm rounded-md flex items-center ${activeTab === 'map' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('map')}
              >
                <Map size={16} className="mr-2" /> Map View
              </button>
              <button 
                className={`px-4 py-2 text-sm rounded-md flex items-center ${activeTab === 'data' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('data')}
              >
                <BarChart size={16} className="mr-2" /> Data View
              </button>
              <button 
                className={`px-4 py-2 text-sm rounded-md flex items-center ${activeTab === 'area' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('area')}
              >
                <Layers size={16} className="mr-2" /> Area Analysis
              </button>
              <button 
                className={`px-4 py-2 text-sm rounded-md flex items-center ${activeTab === 'jobs' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('jobs')}
              >
                <CheckSquare size={16} className="mr-2" /> Job Queue
              </button>
            </div>
            
            <div className="ml-auto flex space-x-2">
              {activeTab === 'area' && (
                <div className="flex border rounded-md overflow-hidden mr-2">
                  <button 
                    className={`px-3 py-1.5 text-sm flex items-center ${areaView === 'zip' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    onClick={() => setAreaView('zip')}
                  >
                    ZIP Codes
                  </button>
                  <button 
                    className={`px-3 py-1.5 text-sm flex items-center border-l ${areaView === 'industrial' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    onClick={() => setAreaView('industrial')}
                  >
                    Industrial Corridors
                  </button>
                  <button 
                    className={`px-3 py-1.5 text-sm flex items-center border-l ${areaView === 'ward' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    onClick={() => setAreaView('ward')}
                  >
                    City Wards
                  </button>
                </div>
              )}
              <button className="px-3 py-1.5 text-sm border rounded-md flex items-center text-gray-600 hover:bg-gray-50">
                <Layers size={16} className="mr-1" /> Map Layers
              </button>
              <button className="px-3 py-1.5 text-sm border rounded-md flex items-center text-gray-600 hover:bg-gray-50">
                <Download size={16} className="mr-1" /> Export
              </button>
            </div>
          </div>
          
          {/* Content based on active tab */}
          {activeTab === 'map' ? (
            <div className="flex-1 bg-blue-50 p-4 relative">
              {/* This would be your actual map component, using Leaflet.js or MapLibre */}
              <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-4/5 p-4 flex overflow-hidden">
                  <div className="flex-1 bg-blue-100 rounded-lg relative">
                    {/* Simulated map */}
                    <div className="absolute inset-0 p-4">
                      <div className="text-blue-800 font-medium text-center">
                        Map View (Chicago)
                        <div className="text-xs text-blue-600 mt-1">
                          Using OpenStreetMap + Chicago Open Data
                        </div>
                      </div>
                      
                      {/* Producer markers (simplified) */}
                      <div className="absolute top-1/4 left-1/3 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg -ml-4 -mt-4 border-2 border-white cursor-pointer">
                        <Printer size={16} />
                      </div>
                      
                      <div className="absolute top-1/3 left-2/3 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg -ml-4 -mt-4 border-2 border-white cursor-pointer">
                        <Printer size={16} />
                      </div>
                      
                      <div className="absolute bottom-1/3 left-1/4 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg -ml-4 -mt-4 border-2 border-white cursor-pointer">
                        <Printer size={16} />
                      </div>

                      <div className="absolute bottom-1/4 right-1/3 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg -ml-4 -mt-4 border-2 border-white cursor-pointer">
                        <Printer size={16} />
                      </div>
                      
                      {/* Map controls */}
                      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 space-y-2">
                        <button className="bg-white p-2 rounded-md shadow-sm hover:bg-gray-100">+</button>
                        <button className="bg-white p-2 rounded-md shadow-sm hover:bg-gray-100">−</button>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
                        <div className="text-xs text-gray-600 mb-2">Map Layers</div>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="layer-zoning"
                              checked={mapLayers.zoning}
                              onChange={(e) => setMapLayers({...mapLayers, zoning: e.target.checked})}
                              className="mr-2"
                            />
                            <label htmlFor="layer-zoning" className="text-xs">Industrial Zoning</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="layer-sustainability"
                              checked={mapLayers.sustainability}
                              onChange={(e) => setMapLayers({...mapLayers, sustainability: e.target.checked})}
                              className="mr-2"
                            />
                            <label htmlFor="layer-sustainability" className="text-xs">Sustainability Heat Map</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="layer-truck-routes"
                              checked={mapLayers.truckRoutes}
                              onChange={(e) => setMapLayers({...mapLayers, truckRoutes: e.target.checked})}
                              className="mr-2"
                            />
                            <label htmlFor="layer-truck-routes" className="text-xs">Truck Routes</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="layer-economic-zones"
                              checked={mapLayers.economicZones}
                              onChange={(e) => setMapLayers({...mapLayers, economicZones: e.target.checked})}
                              className="mr-2"
                            />
                            <label htmlFor="layer-economic-zones" className="text-xs">Economic Zones</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="layer-production-density"
                              checked={mapLayers.productionDensity}
                              onChange={(e) => setMapLayers({...mapLayers, productionDensity: e.target.checked})}
                              className="mr-2"
                            />
                            <label htmlFor="layer-production-density" className="text-xs">Production Density</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Selected producer details */}
                  {selectedProducer && (
                    <div className="w-72 ml-4 overflow-y-auto">
                      <div className="mb-3 pb-3 border-b">
                        <h3 className="font-bold text-gray-800">{selectedProducer.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{selectedProducer.location.address}</p>
                        <div className="flex mt-1 text-xs text-gray-500">
                          <span>ZIP: {selectedProducer.location.zip}</span>
                          <span className="mx-2">|</span>
                          <span>Ward: {selectedProducer.location.ward}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span>Property PIN: {selectedProducer.location.propertyPIN}</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Overview Scores</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center">
                            <div className={`w-2 h-10 rounded-full ${selectedProducer.scores.trust > 80 ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
                            <div>
                              <div className="text-xs text-gray-500">Trust Score</div>
                              <div className="text-base font-bold">{selectedProducer.scores.trust}%</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-2 h-10 rounded-full ${selectedProducer.scores.capability > 80 ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
                            <div>
                              <div className="text-xs text-gray-500">Capability</div>
                              <div className="text-base font-bold">{selectedProducer.scores.capability}%</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-2 h-10 rounded-full ${selectedProducer.scores.accessibility > 80 ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
                            <div>
                              <div className="text-xs text-gray-500">Accessibility</div>
                              <div className="text-base font-bold">{selectedProducer.scores.accessibility}%</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className={`w-2 h-10 rounded-full ${selectedProducer.scores.sustainability > 80 ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></div>
                            <div>
                              <div className="text-xs text-gray-500">Sustainability</div>
                              <div className="text-base font-bold">{selectedProducer.scores.sustainability}%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Capabilities</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProducer.capabilities.map(cap => (
                            <span key={cap} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs capitalize">{cap}</span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Product Types</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProducer.productTypes.map(product => (
                            <span key={product} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs capitalize">{product}</span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Capacity & Lead Time</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Available Capacity:</span>
                            <span className="font-medium">{selectedProducer.capacity.availableHours} hours</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Lead Time:</span>
                            <span className="font-medium">{selectedProducer.capacity.leadTime}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Max Size:</span>
                            <span className="font-medium">{selectedProducer.capacity.maxSize}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Equipment</h4>
                        <div className="space-y-1 text-sm">
                          {selectedProducer.equipment.map((equipment, idx) => (
                            <div key={idx} className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              <span>{equipment}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Verification Sources</h4>
                        <div className="space-y-1">
                          {selectedProducer.verificationSources.map((source, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              <AlertCircle size={14} className="mr-2 text-green-600" />
                              <span>{source}</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Last verified: {selectedProducer.lastVerified}</div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Sustainability</h4>
                        <div className="space-y-1">
                          {selectedProducer.sustainabilityBadges.map((badge, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              <Zap size={14} className="mr-2 text-green-600" />
                              <span>{badge}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Economic Zones</h4>
                        <div className="space-y-1">
                          {selectedProducer.economicZones.length > 0 ? (
                            selectedProducer.economicZones.map((zone, idx) => (
                              <div key={idx} className="flex items-center text-sm">
                                <Award size={14} className="mr-2 text-purple-600" />
                                <span>{zone}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500">No economic zones</div>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Transit Access</h4>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Truck size={14} className="mr-2 text-gray-600" />
                            <span className={selectedProducer.transitAccess.truckRoute ? "text-gray-800" : "text-gray-400"}>
                              Truck Route Access {selectedProducer.transitAccess.truckRoute ? '✓' : '✗'}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Users size={14} className="mr-2 text-gray-600" />
                            <span className={selectedProducer.transitAccess.publicTransit ? "text-gray-800" : "text-gray-400"}>
                              Public Transit {selectedProducer.transitAccess.publicTransit ? '✓' : '✗'}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Map size={14} className="mr-2 text-gray-600" />
                            <span className={selectedProducer.transitAccess.bikeways ? "text-gray-800" : "text-gray-400"}>
                              Bikeway Access {selectedProducer.transitAccess.bikeways ? '✓' : '✗'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Contact</h4>
                        <div className="space-y-1 text-sm">
                          <div>{selectedProducer.website}</div>
                          <div>{selectedProducer.contact}</div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex gap-2">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm flex-1">Match Job</button>
                        <button className="border border-gray-300 px-4 py-2 rounded text-sm">View Details</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'data' ? (
            <div className="flex-1 bg-gray-50 p-4">
              <div className="bg-white rounded-lg shadow p-4 h-full">
                <h3 className="font-medium text-gray-800 mb-4">Producer Data View</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capabilities</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Types</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trust Score</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAICS</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ZIP</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Time</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {producers.map(producer => (
                        <tr key={producer.id} 
                            className={selectedProducer?.id === producer.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                            onClick={() => handleProducerSelect(producer)}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{producer.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-1">
                              {producer.capabilities.map(cap => (
                                <span key={cap} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                  {cap}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {producer.productTypes.slice(0, 2).join(', ')}
                              {producer.productTypes.length > 2 && '...'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{producer.scores.trust}/100</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{producer.naicsCode}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{producer.location.zip}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{producer.capacity.leadTime}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-blue-600 hover:text-blue-800">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'area' ? (
            <div className="flex-1 bg-gray-50 p-4">
              <div className="bg-white rounded-lg shadow p-4 h-full">
                <h3 className="font-medium text-gray-800 mb-4">
                  {areaView === 'zip' ? 'ZIP Code Analysis' : 
                   areaView === 'industrial' ? 'Industrial Corridor Analysis' : 
                   'Ward Analysis'}
                </h3>

                <div className="flex h-full">
                  {/* Area listing */}
                  <div className="w-64 border-r pr-4 h-full overflow-y-auto">
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder={`Search ${areaView === 'zip' ? 'ZIP codes' : areaView === 'industrial' ? 'corridors' : 'wards'}...`}
                        className="w-full border rounded-lg py-2 px-3 text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      {window.mockAreaData && window.mockAreaData[areaView].map((area, idx) => (
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
                              <span key={cap} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs capitalize">{cap}</span>
                            ))}
                            {area.capabilities.length > 2 && (
                              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">+{area.capabilities.length - 2}</span>
                            )}
                          </div>
                          <div className="flex justify-between mt-2 text-xs">
                            <div className="flex items-center">
                              <Calendar size={10} className="mr-1" />
                              <span>{area.availableCapacity}%</span>
                            </div>
                            <div className="flex items-center">
                              <Zap size={10} className="mr-1" />
                              <span>{area.sustainabilityScore}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Area detail view */}
                  <div className="flex-1 pl-4 overflow-y-auto">
                    {selectedArea ? (
                      <>
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {areaView === 'zip' ? `ZIP: ${selectedArea.code}` : selectedArea.name}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {areaView === 'zip' ? selectedArea.name : `ID: ${selectedArea.id}`}
                            </p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button className="border rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                              View on Map
                            </button>
                            <button className="bg-blue-600 text-white rounded-md px-3 py-1.5 text-sm">
                              Analyze Jobs
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 mb-6">
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium text-gray-700 mb-3">Available Capabilities</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedArea.capabilities.map(cap => (
                                <div key={cap} className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm capitalize flex items-center">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                  {cap}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium text-gray-700 mb-3">Available Product Types</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedArea.productTypes.map(product => (
                                <div key={product} className="bg-green-100 text-green-800 px-3 py-1.5 rounded-lg text-sm capitalize flex items-center">
                                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                  {product}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4 mb-6">
                          <h4 className="font-medium text-gray-700 mb-3">Area Metrics</h4>
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

                        <div className="border rounded-lg p-4 mb-6">
                          <h4 className="font-medium text-gray-700 mb-3">Economic Incentives</h4>
                          {selectedArea.economicZones.length > 0 ? (
                            <div className="space-y-3">
                              {selectedArea.economicZones.map((zone, idx) => (
                                <div key={idx} className="flex border-l-4 border-purple-500 bg-purple-50 p-3 rounded-r-lg">
                                  <Award size={20} className="text-purple-600 mr-3" />
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
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium text-gray-700 mb-3">Producers in Area</h4>
                          <div className="space-y-3">
                            {producers
                              .filter(p => {
                                if (areaView === 'zip') return p.location.zip === selectedArea.code;
                                if (areaView === 'industrial') return p.location.industrialCorridor.toLowerCase() === selectedArea.id.toLowerCase();
                                if (areaView === 'ward') return p.location.ward === selectedArea.id;
                                return false;
                              })
                              .map(producer => (
                                <div key={producer.id} className="border rounded-lg p-3 hover:border-blue-500 cursor-pointer">
                                  <div className="flex justify-between">
                                    <div className="font-medium text-gray-800">{producer.name}</div>
                                    <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                      {producer.scores.trust}% Trust
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">{producer.location.address}</div>
                                  <div className="flex mt-2 space-x-1">
                                    {producer.capabilities.slice(0, 3).map(cap => (
                                      <span key={cap} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs capitalize">{cap}</span>
                                    ))}
                                  </div>
                                  <div className="mt-2 text-xs flex justify-between">
                                    <div className="text-gray-600">
                                      Lead time: {producer.capacity.leadTime}
                                    </div>
                                    <div className="text-gray-600">
                                      Available: {producer.capacity.availableHours}h
                                    </div>
                                  </div>
                                </div>
                              ))
                            }
                            
                            {producers.filter(p => {
                              if (areaView === 'zip') return p.location.zip === selectedArea.code;
                              if (areaView === 'industrial') return p.location.industrialCorridor.toLowerCase() === selectedArea.id.toLowerCase();
                              if (areaView === 'ward') return p.location.ward === selectedArea.id;
                              return false;
                            }).length === 0 && (
                              <div className="text-center py-6 text-gray-500">
                                No verified producers found in this area.
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Select an area from the list to view details
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-gray-50 p-4">
              <div className="bg-white rounded-lg shadow p-4 h-full">
                <h3 className="font-medium text-gray-800 mb-4">Job Queue & SmartMatch System</h3>
                
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h4 className="font-medium text-gray-700 flex items-center">
                      <Clock size={16} className="mr-2 text-blue-600" />
                      Pending Jobs
                    </h4>
                    <div className="text-3xl font-bold mt-2">3</div>
                    <div className="text-sm text-gray-500 mt-1">Awaiting producer matching</div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-green-50">
                    <h4 className="font-medium text-gray-700 flex items-center">
                      <CheckSquare size={16} className="mr-2 text-green-600" />
                      Active Jobs
                    </h4>
                    <div className="text-3xl font-bold mt-2">7</div>
                    <div className="text-sm text-gray-500 mt-1">In production pipeline</div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-purple-50">
                    <h4 className="font-medium text-gray-700 flex items-center">
                      <TrendingUp size={16} className="mr-2 text-purple-600" />
                      Match Success Rate
                    </h4>
                    <div className="text-3xl font-bold mt-2">94%</div>
                    <div className="text-sm text-gray-500 mt-1">Jobs successfully matched</div>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required Capabilities</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">#JOB-2354</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">Corporate Brochure Printing</div>
                          <div className="text-xs text-gray-500">250 copies, full color, 12 pages</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex space-x-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">offset</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">binding</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Matching
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          Today, 10:24 AM
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          May 10, 2025
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">
                          <button className="hover:text-blue-800">View</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">#JOB-2353</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">Custom T-Shirt Order</div>
                          <div className="text-xs text-gray-500">50 shirts, 2 colors, front and back</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex space-x-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">screenprinting</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Matching
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          Today, 9:45 AM
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          May 15, 2025
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">
                          <button className="hover:text-blue-800">View</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 bg-blue-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">#JOB-2352</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">Trade Show Banner</div>
                          <div className="text-xs text-gray-500">8ft x 4ft, full color, vinyl</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex space-x-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">largeformat</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Matched
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          Yesterday
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          May 12, 2025
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">
                          <button className="hover:text-blue-800">View</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">#JOB-2351</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">Business Cards</div>
                          <div className="text-xs text-gray-500">500 cards, double-sided, premium stock</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex space-x-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">digital</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Matching
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          Yesterday
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          May 8, 2025
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">
                          <button className="hover:text-blue-800">View</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 border-t pt-6">
                  <h4 className="font-medium text-gray-800 mb-4">SmartMatch System Integration</h4>
                  
                  <div className="border rounded-lg overflow-hidden mb-6">
                    <div className="bg-gray-50 p-4 border-b">
                      <h5 className="font-medium text-gray-700">Job #JOB-2352: Trade Show Banner</h5>
                      <p className="text-sm text-gray-500 mt-1">Matched with Urban Print Solutions</p>
                    </div>
                    
                    <div className="p-4">
                      <h6 className="text-sm font-medium text-gray-700 mb-3">Match Factors</h6>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-32 text-sm text-gray-600">Capability Match:</div>
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{width: '95%'}}></div>
                            </div>
                          </div>
                          <div className="w-8 text-right text-sm font-medium">95%</div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-32 text-sm text-gray-600">Delivery ETA:</div>
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{width: '88%'}}></div>
                            </div>
                          </div>
                          <div className="w-8 text-right text-sm font-medium">88%</div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-32 text-sm text-gray-600">Capacity Available:</div>
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-yellow-500 h-2 rounded-full" style={{width: '72%'}}></div>
                            </div>
                          </div>
                          <div className="w-8 text-right text-sm font-medium">72%</div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-32 text-sm text-gray-600">Geo-Routing:</div>
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{width: '90%'}}></div>
                            </div>
                          </div>
                          <div className="w-8 text-right text-sm font-medium">90%</div>
                        </div>

                        <div className="flex items-center">
                          <div className="w-32 text-sm text-gray-600">Equity Impact:</div>
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-600 h-2 rounded-full" style={{width: '65%'}}></div>
                            </div>
                          </div>
                          <div className="w-8 text-right text-sm font-medium">65%</div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-32 text-sm text-gray-600">Overall Match:</div>
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{width: '87%'}}></div>
                            </div>
                          </div>
                          <div className="w-8 text-right text-sm font-medium">87%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Shield size={20} className="text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Data Sources Powering SmartMatch</h3>
                        <div className="mt-2 text-sm text-blue-700">
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
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white shadow-inner py-3 px-6">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>Pressly MVP - Local Producer Intelligence</div>
          <div>Data sources: Chicago Open Data Portal, OpenStreetMap, IL Secretary of State, Cook County Assessor</div>
        </div>
      </footer>
    </div>
  );
};

export default PresslyMVP;