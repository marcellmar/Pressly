import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import '../../styles/Producers.css';

// Component to handle dynamic radius circle on map
const RadiusCircle = ({ center, radius }) => {
  const map = useMap();
  
  useEffect(() => {
    // Ensure map stays centered when radius changes
    map.setView(center);
  }, [center, radius, map]);
  
  return (
    <Circle 
      center={center} 
      radius={radius * 1609.34} // Convert miles to meters
      pathOptions={{ 
        fillColor: '#3a6ea5', 
        fillOpacity: 0.1, 
        color: '#3a6ea5', 
        weight: 1 
      }} 
    />
  );
};

const ChicagoPrintProducersMap = () => {
  const [mapCenter] = useState([41.8781, -87.6298]); // Chicago coordinates
  const [radiusInMiles, setRadiusInMiles] = useState(10);
  
  // Chicago-based producers data with real producers from our research
  const producers = [
    {
      id: 1,
      name: "Chicago Signs",
      description: "Full service custom apparel company offering screen printing, embroidery, DTG, heat transfers and more.",
      address: "1920 N. Clybourn Ave, Chicago, IL 60614",
      phone: "(773) 649-5600",
      website: "https://chicagosigns.com",
      capabilities: ["Screen Printing", "DTG", "Embroidery", "Heat Transfers", "DTF Printing"],
      specialties: ["Complex full color designs", "Business Uniforms", "Custom t-shirts"],
      techniques: ["screen", "dtg", "embroidery", "heatTransfer", "dtf"],
      rating: 4.8,
      reviews: 42,
      pricing: "Custom quote based on quantity",
      turnaround: "Standard production time",
      sustainable: true,
      coordinates: [41.9211, -87.6588],
      availability: 75,
      joinedAt: "2022-05-15"
    },
    {
      id: 2,
      name: "Rowboat Creative",
      description: "Screen printing company and custom merch facility for all your merchandise needs, custom branded products & printing services.",
      address: "1148 W Madison St, Chicago, IL 60607",
      phone: "(312) 432-1350",
      website: "https://rowboatcreative.com",
      capabilities: ["Screen Printing", "DTG", "Embroidery", "Dye Sublimation"],
      specialties: ["Branded merchandise", "Custom t-shirts", "All-over printing"],
      techniques: ["screen", "dtg", "embroidery", "dyeSublimation"],
      rating: 4.9,
      reviews: 38,
      pricing: "Low minimum order quantities",
      turnaround: "Fast for DTG printing",
      sustainable: true,
      coordinates: [41.8819, -87.6558],
      availability: 65,
      joinedAt: "2021-09-10"
    },
    {
      id: 3,
      name: "Sharprint",
      description: "Chicago custom screen printing and embroidery services with eco-friendly printing options.",
      address: "4200 W Wrightwood Ave, Chicago, IL 60639",
      phone: "(888) 800-5646",
      website: "https://www.sharprint.com",
      capabilities: ["Screen Printing", "Embroidery", "Digital Printing", "Eco-Friendly Printing"],
      specialties: ["Sustainable clothing", "Organic cotton", "Custom company apparel"],
      techniques: ["screen", "embroidery", "digital", "ecoFriendly"],
      rating: 4.7,
      reviews: 55,
      pricing: "Contact for quote",
      turnaround: "Varies based on order",
      sustainable: true,
      coordinates: [41.9289, -87.7324],
      availability: 70,
      joinedAt: "2019-06-22"
    },
    {
      id: 4,
      name: "The Chicago Print Shop",
      description: "Custom DTG printing and design services offering high-quality prints with no minimum order quantity.",
      address: "73 E Lake St, Chicago, IL 60601",
      phone: "(773) 609-1918",
      website: "https://www.thechicagoprintshop.com",
      capabilities: ["DTG", "Custom t-shirts", "Vintage Clothing"],
      specialties: ["High-resolution prints", "Small batch orders", "Custom designs"],
      techniques: ["dtg", "customDesign", "vintage"],
      rating: 4.9,
      reviews: 29,
      pricing: "No minimum order quantity",
      turnaround: "Quick turnaround times",
      sustainable: true,
      coordinates: [41.8857, -87.6260],
      availability: 85,
      joinedAt: "2022-11-05"
    },
    {
      id: 5,
      name: "Method Printing",
      description: "Custom t-shirt printing offering screen printing, embroidery, and apparel finishing.",
      address: "1243 W Fulton Market, Chicago, IL 60607",
      phone: "(312) 243-1250",
      website: "https://methodprinting.com",
      capabilities: ["Screen Printing", "Embroidery", "Custom t-shirts"],
      specialties: ["Business branded apparel", "Restaurant uniforms", "Retail merchandise"],
      techniques: ["screen", "embroidery", "apparel"],
      rating: 4.8,
      reviews: 36,
      pricing: "Contact for pricing",
      turnaround: "Multiple options available",
      sustainable: false,
      coordinates: [41.8868, -87.6599],
      availability: 60,
      joinedAt: "2021-03-18"
    },
    {
      id: 6,
      name: "Minuteman Press",
      description: "DTG t-shirt printing services with same day options available for quick turnaround orders.",
      address: "227 W Van Buren St, Chicago, IL 60607",
      phone: "(312) 664-6150",
      website: "https://www.samedayteeshirts.com",
      capabilities: ["DTG", "Screen Printing", "Custom t-shirts"],
      specialties: ["Same day service", "Full color printing", "On-demand printing"],
      techniques: ["dtg", "screen", "sameDay"],
      rating: 4.6,
      reviews: 31,
      pricing: "Volume discounts available",
      turnaround: "Same day possible",
      sustainable: false,
      coordinates: [41.8768, -87.6345],
      availability: 90,
      joinedAt: "2020-08-14"
    },
    {
      id: 7,
      name: "Threaded Merch",
      description: "Chicago screen printing services for custom t-shirts, merch, band merchandise and more.",
      address: "17 N Elizabeth St, Chicago, IL 60607",
      phone: "(844) 696-3724",
      website: "https://www.threadedmerch.com",
      capabilities: ["Screen Printing", "DTG", "Custom t-shirts"],
      specialties: ["Band merchandise", "Event shirts", "Marketing materials"],
      techniques: ["screen", "dtg", "marketing"],
      rating: 4.7,
      reviews: 25,
      pricing: "Discounts on bulk orders",
      turnaround: "Quick turnaround for DTG orders",
      sustainable: false,
      coordinates: [41.8817, -87.6580],
      availability: 55,
      joinedAt: "2021-11-12"
    },
    {
      id: 8,
      name: "Culture Studio",
      description: "Sublimation printing services specializing in full coverage custom printing and apparel.",
      address: "4042 W Belmont Ave, Chicago, IL 60641",
      phone: "(773) 654-4550",
      website: "https://culturestudio.net",
      capabilities: ["Sublimation", "Embroidery", "Custom Apparel"],
      specialties: ["All-over printing", "Seam-to-seam designs", "Vibrant colors"],
      techniques: ["sublimation", "embroidery", "allOver"],
      rating: 4.9,
      reviews: 22,
      pricing: "Minimum 50 units",
      turnaround: "12-15 business days",
      sustainable: true,
      coordinates: [41.9388, -87.7277],
      availability: 45,
      joinedAt: "2022-04-21"
    },
    {
      id: 9,
      name: "One Hour Tees",
      description: "Custom t-shirt printing with one hour turnaround times starting at $5.99 with no minimums.",
      address: "1130 W Bryn Mawr Ave, Chicago, IL 60660",
      phone: "(773) 944-0930",
      website: "https://www.onehourtees.com",
      capabilities: ["DTG", "Screen Printing", "Custom t-shirts"],
      specialties: ["Fast service", "No minimums", "Affordable pricing"],
      techniques: ["dtg", "screen", "sameDay"],
      rating: 4.5,
      reviews: 52,
      pricing: "Starting at $5.99",
      turnaround: "As quick as one hour",
      sustainable: false,
      coordinates: [41.9834, -87.6597],
      availability: 95,
      joinedAt: "2020-06-08"
    }
  ];

  // Calculate distance between two coordinates in miles
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
  };

  // Filter producers by distance radius
  const producersWithinRadius = producers.filter(producer => {
    const distance = calculateDistance(
      mapCenter[0], mapCenter[1],
      producer.coordinates[0], producer.coordinates[1]
    );
    return distance <= radiusInMiles;
  });

  // Custom icon for each producer based on availability
  const getMarkerIcon = (availability, sustainable) => {
    let color = '#dc3545'; // red for low availability
    if (availability > 70) {
      color = '#28a745'; // green for high availability
    } else if (availability > 30) {
      color = '#ffc107'; // yellow for medium availability
    }

    return L.divIcon({
      className: 'custom-marker-icon',
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; ${sustainable ? 'border: 3px solid #28a745;' : ''}">${sustainable ? '<div style="position: absolute; top: -5px; right: -5px; background-color: #28a745; border-radius: 50%; width: 10px; height: 10px;"></div>' : ''}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  // Get technique badge styling and label
  const getTechniqueBadge = (technique) => {
    const badges = {
      screen: { label: 'Screen Printing', bg: '#6c5ce7', icon: 'fas fa-tshirt' },
      dtg: { label: 'DTG', bg: '#00b894', icon: 'fas fa-print' },
      embroidery: { label: 'Embroidery', bg: '#e17055', icon: 'fas fa-cut' },
      heatTransfer: { label: 'Heat Transfer', bg: '#fdcb6e', icon: 'fas fa-fire' },
      dtf: { label: 'DTF', bg: '#d63031', icon: 'fas fa-tshirt' },
      digital: { label: 'Digital', bg: '#0984e3', icon: 'fas fa-laptop' },
      ecoFriendly: { label: 'Eco-Friendly', bg: '#00b894', icon: 'fas fa-leaf' },
      customDesign: { label: 'Custom Design', bg: '#6c5ce7', icon: 'fas fa-pencil-alt' },
      vintage: { label: 'Vintage', bg: '#fdcb6e', icon: 'fas fa-tshirt' },
      apparel: { label: 'Apparel', bg: '#e84393', icon: 'fas fa-tshirt' },
      sameDay: { label: 'Same Day', bg: '#e84393', icon: 'fas fa-bolt' },
      marketing: { label: 'Marketing', bg: '#00cec9', icon: 'fas fa-ad' },
      sublimation: { label: 'Sublimation', bg: '#a29bfe', icon: 'fas fa-print' },
      allOver: { label: 'All-Over Print', bg: '#fd79a8', icon: 'fas fa-tshirt' },
      dyeSublimation: { label: 'Dye Sublimation', bg: '#a29bfe', icon: 'fas fa-print' }
    };
    
    return badges[technique] || { label: technique, bg: '#7f8c8d', icon: 'fas fa-print' };
  };

  return (
    <div className="chicago-map-container">
      <div className="section-header">
        <h2>Local Chicago Print Producers</h2>
        <p>Find the perfect local partner for your printing needs</p>
      </div>
      
      {/* Map View of Producer Locations with Distance Radius Slider */}
      <div className="map-container">
        <MapContainer 
          center={mapCenter} 
          zoom={11} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Dynamic Radius Circle */}
          <RadiusCircle center={mapCenter} radius={radiusInMiles} />
          
          {/* Show only producers within radius */}
          {producersWithinRadius.map(producer => (
            <Marker 
              key={producer.id} 
              position={producer.coordinates}
              icon={getMarkerIcon(producer.availability, producer.sustainable)}
            >
              <Popup>
                <div>
                  <h4 style={{ margin: '0 0 8px 0' }}>{producer.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ marginRight: '5px' }}>
                      <i className="fas fa-star" style={{ color: '#ffc107' }}></i> {producer.rating}
                    </span>
                    <span>({producer.reviews} reviews)</span>
                  </div>
                  
                  {producer.sustainable && (
                    <div style={{ color: '#28a745', marginBottom: '5px' }}>
                      <i className="fas fa-leaf" style={{ marginRight: '5px' }}></i>
                      <span>Eco-Friendly</span>
                    </div>
                  )}
                  
                  <p style={{ margin: '5px 0' }}>{producer.address}</p>
                  <p style={{ margin: '5px 0' }}>Turnaround: {producer.turnaround}</p>
                  <p style={{ margin: '5px 0' }}>Availability: {producer.availability}%</p>
                  
                  <div style={{ marginTop: '10px' }}>
                    <a 
                      href={producer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{ marginRight: '5px', textDecoration: 'none' }}
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Distance Radius Slider */}
      <div className="radius-slider-container">
        <label htmlFor="radius-slider">Distance Radius: <strong>{radiusInMiles} miles</strong></label>
        <input 
          type="range" 
          id="radius-slider" 
          min="1" 
          max="30" 
          value={radiusInMiles}
          onChange={(e) => setRadiusInMiles(parseInt(e.target.value))}
          className="radius-slider"
        />
        <div className="radius-labels">
          <span>1 mile</span>
          <span>30 miles</span>
        </div>
      </div>
      
      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-color high"></div>
          <span>High Availability</span>
        </div>
        <div className="legend-item">
          <div className="legend-color medium"></div>
          <span>Medium Availability</span>
        </div>
        <div className="legend-item">
          <div className="legend-color low"></div>
          <span>Low Availability</span>
        </div>
        <div className="legend-item">
          <div className="legend-icon eco"></div>
          <span>Eco-Friendly</span>
        </div>
      </div>
      
      {/* Producer Cards List */}
      <div className="grid">
        {producersWithinRadius.map(producer => (
          <div key={producer.id} className="card">
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{producer.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ marginRight: '0.5rem' }}>
                  <i className="fas fa-star" style={{ color: '#ffc107' }}></i> {producer.rating}
                </span>
                <span className="rating-count">({producer.reviews} reviews)</span>
                {producer.sustainable && (
                  <span style={{ color: '#28a745', marginLeft: '1rem' }}>
                    <i className="fas fa-leaf"></i> Eco-Friendly
                  </span>
                )}
              </div>
            </div>
            
            {/* Production Technique Badges */}
            <div className="technique-badges">
              {producer.techniques.slice(0, 3).map((technique, index) => {
                const badge = getTechniqueBadge(technique);
                return (
                  <div 
                    key={index} 
                    className="technique-badge"
                    style={{ backgroundColor: badge.bg }}
                  >
                    <i className={badge.icon}></i>
                    <span>{badge.label}</span>
                  </div>
                );
              })}
              {producer.techniques.length > 3 && (
                <div className="technique-badge" style={{ backgroundColor: '#7f8c8d' }}>
                  <span>+{producer.techniques.length - 3} more</span>
                </div>
              )}
            </div>
            
            <p className="producer-description">{producer.description}</p>
            
            <div className="producer-details">
              <div className="producer-detail">
                <i className="fas fa-tag"></i>
                <span>Pricing: {producer.pricing}</span>
              </div>
              <div className="producer-detail">
                <i className="fas fa-clock"></i>
                <span>Turnaround: {producer.turnaround}</span>
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div>Current Availability</div>
                <div>{producer.availability}%</div>
              </div>
              <div className="availability-indicator">
                <div 
                  className={`availability-bar ${producer.availability > 70 ? 'high' : producer.availability > 30 ? 'medium' : 'low'}`}
                  style={{ width: `${producer.availability}%` }}
                ></div>
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '0.5rem' }}></i>
                <span>{producer.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-phone" style={{ marginRight: '0.5rem' }}></i>
                <span>{producer.phone}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a 
                href={producer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ flex: '1', textDecoration: 'none', textAlign: 'center' }}
              >
                Visit Website
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {/* Show message when no producers are within radius */}
      {producersWithinRadius.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="fas fa-search"></i>
          </div>
          <h3>No producers found within {radiusInMiles} miles</h3>
          <p>Try increasing your search radius or adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default ChicagoPrintProducersMap;