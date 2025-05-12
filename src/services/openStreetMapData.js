/**
 * OpenStreetMap Data Service
 * 
 * This module provides mock data that would typically be sourced from OpenStreetMap
 * via the Overpass API. Since we can't make real API calls in this environment,
 * we're creating realistic mock data based on actual Chicago businesses.
 */

/**
 * Mock OpenStreetMap producer data for Chicago area
 * This represents producer data that would typically be fetched from OpenStreetMap
 * via the Overpass API using a query for manufacturing/printing/fabrication shops
 */
export const getOpenStreetMapProducers = () => {
  return [
    {
      id: "osm-1",
      name: "Spudnik Press Cooperative",
      type: "craft=printing",
      lat: 41.8898,
      lng: -87.6726,
      address: "1821 W Hubbard St, Suite 302, Chicago, IL 60622",
      tags: {
        craft: "printing",
        name: "Spudnik Press Cooperative",
        website: "https://www.spudnikpress.org",
        phone: "+1-312-563-0302",
        opening_hours: "Mo-Fr 12:00-17:00; Sa 12:00-16:00"
      },
      capabilities: ["Letterpress", "Screen Printing", "Relief Printing", "Intaglio", "Risograph"],
      specialties: ["Art Prints", "Limited Editions", "Teaching", "Artist Residencies", "Print Publishing"]
    },
    {
      id: "osm-2",
      name: "mHUB Chicago",
      type: "amenity=makerspace",
      lat: 41.8962,
      lng: -87.6519,
      address: "965 W Chicago Ave, Chicago, IL 60642",
      tags: {
        amenity: "makerspace",
        name: "mHUB Chicago",
        website: "https://mhubchicago.com",
        phone: "+1-312-248-8701"
      },
      capabilities: ["3D Printing", "CNC Machining", "Metal Fabrication", "Laser Cutting", "Electronics Prototyping"],
      specialties: ["Hardware Prototyping", "Product Development", "Small Batch Manufacturing", "Startup Incubation"]
    },
    {
      id: "osm-3",
      name: "Chicago Printmakers Collaborative",
      type: "craft=printing",
      lat: 41.9309,
      lng: -87.7006,
      address: "4912 N Western Ave, Chicago, IL 60625",
      tags: {
        craft: "printing",
        name: "Chicago Printmakers Collaborative",
        website: "https://www.chicagoprintmakers.com",
        phone: "+1-773-293-2070"
      },
      capabilities: ["Letterpress", "Screen Printing", "Relief Printing", "Lithography", "Monotype"],
      specialties: ["Fine Art Prints", "Printmaking Classes", "Artist Studio Space", "Print Exhibitions"]
    },
    {
      id: "osm-4",
      name: "Pumping Station: One",
      type: "amenity=makerspace",
      lat: 41.9456,
      lng: -87.7039,
      address: "3519 N Elston Ave, Chicago, IL 60618",
      tags: {
        amenity: "makerspace",
        name: "Pumping Station: One",
        website: "https://pumpingstationone.org",
        opening_hours: "Mo-Su 00:00-24:00"
      },
      capabilities: ["Woodworking", "Metal Shop", "Laser Cutting", "3D Printing", "Electronics"],
      specialties: ["Member Workshop", "Skill Sharing", "Community Projects", "Classes", "Rapid Prototyping"]
    },
    {
      id: "osm-5",
      name: "The WasteShed",
      type: "shop=art",
      lat: 41.9401,
      lng: -87.7094,
      address: "2842 W Chicago Ave, Chicago, IL 60622",
      tags: {
        shop: "art",
        name: "The WasteShed",
        website: "https://www.thewasteshed.com",
        phone: "+1-773-666-0450",
        opening_hours: "We-Su 12:00-18:00"
      },
      capabilities: ["Material Reuse", "Art Supplies", "Sustainable Materials", "Creative Reuse"],
      specialties: ["Reclaimed Materials", "Sustainable Art Supplies", "Education", "Artist Resources"]
    },
    {
      id: "osm-6",
      name: "Chicago Industrial Arts & Design Center",
      type: "amenity=workshop",
      lat: 42.0020,
      lng: -87.6743,
      address: "6433 N Ravenswood Ave, Chicago, IL 60626",
      tags: {
        amenity: "workshop",
        name: "Chicago Industrial Arts & Design Center",
        website: "https://www.ciadc.org",
        phone: "+1-773-961-8498"
      },
      capabilities: ["Metal Casting", "Woodworking", "Metalworking", "Ceramics", "Jewelry Making"],
      specialties: ["Fine Arts", "Industrial Design", "Sculpture", "Classes", "Studio Access"]
    },
    {
      id: "osm-7",
      name: "Werkflow Chicago",
      type: "craft=fabrication",
      lat: 41.8920,
      lng: -87.6534,
      address: "444 N Wabash Ave, Chicago, IL 60611",
      tags: {
        craft: "fabrication",
        name: "Werkflow Chicago",
        website: "https://werkflowchicago.com",
        phone: "+1-312-846-6425"
      },
      capabilities: ["CNC Machining", "Laser Cutting", "3D Printing", "Digital Fabrication", "Wood Fabrication"],
      specialties: ["Architectural Models", "Custom Furniture", "Signage", "Commercial Fabrication", "Product Design"]
    },
    {
      id: "osm-8",
      name: "Polsky Fab Lab - University of Chicago",
      type: "amenity=makerspace",
      lat: 41.7993,
      lng: -87.5900,
      address: "1452 E 53rd St, Chicago, IL 60615",
      tags: {
        amenity: "makerspace",
        name: "Polsky Fab Lab - University of Chicago",
        website: "https://polsky.uchicago.edu/fab-lab/",
        operator: "University of Chicago"
      },
      capabilities: ["3D Printing", "Laser Cutting", "CNC Milling", "Electronics Prototyping", "Design Software"],
      specialties: ["Academic Research", "Entrepreneurship", "Rapid Prototyping", "Product Development", "Education"]
    },
    {
      id: "osm-9",
      name: "Chicago School of Woodworking",
      type: "craft=carpenter",
      lat: 41.9262,
      lng: -87.7074,
      address: "3110 N Kedzie Ave, Chicago, IL 60618",
      tags: {
        craft: "carpenter",
        name: "Chicago School of Woodworking",
        website: "https://chicagowoodworking.com",
        phone: "+1-773-945-1976"
      },
      capabilities: ["Woodworking", "Furniture Making", "Wood Turning", "Cabinet Making", "Finishing"],
      specialties: ["Woodworking Classes", "Furniture Design", "Custom Furniture", "Small Batch Production"]
    },
    {
      id: "osm-10",
      name: "South Side Hackerspace Chicago",
      type: "amenity=hackerspace",
      lat: 41.7644,
      lng: -87.5914,
      address: "7231 S Dorchester Ave, Chicago, IL 60619",
      tags: {
        amenity: "hackerspace",
        name: "South Side Hackerspace Chicago",
        website: "https://sshchicago.org",
        opening_hours: "Mo-Su 00:00-24:00; members only"
      },
      capabilities: ["3D Printing", "Laser Cutting", "Electronics", "Woodworking", "Computer Programming"],
      specialties: ["Community Projects", "Skill Sharing", "STEM Education", "Rapid Prototyping"]
    },
    {
      id: "osm-11",
      name: "Comer Family Foundation Fabrication Lab",
      type: "amenity=workshop",
      lat: 41.7947,
      lng: -87.6058,
      address: "6011 S Ellis Ave, Chicago, IL 60637",
      tags: {
        amenity: "workshop",
        name: "Comer Family Foundation Fabrication Lab",
        operator: "University of Chicago"
      },
      capabilities: ["3D Printing", "Laser Cutting", "CNC Routing", "Digital Fabrication", "Electronics"],
      specialties: ["Education", "Research", "Academic Projects", "STEM Learning", "Youth Programs"]
    },
    {
      id: "osm-12",
      name: "Metal Magic Inc",
      type: "craft=metal_construction",
      lat: 41.9095,
      lng: -87.7139,
      address: "2107 N Pulaski Rd, Chicago, IL 60639",
      tags: {
        craft: "metal_construction",
        name: "Metal Magic Inc",
        phone: "+1-773-384-2995"
      },
      capabilities: ["Metal Fabrication", "Welding", "CNC Plasma Cutting", "Sheet Metal", "Steel Fabrication"],
      specialties: ["Custom Metal Products", "Architectural Metals", "Ornamental Iron", "Structural Steel"]
    },
    {
      id: "osm-13",
      name: "Chicago Public Library Maker Lab",
      type: "amenity=library;makerspace",
      lat: 41.8769,
      lng: -87.6285,
      address: "400 S State St, Chicago, IL 60605",
      tags: {
        amenity: "library;makerspace",
        name: "Chicago Public Library Maker Lab",
        website: "https://www.chipublib.org/maker-lab/",
        operator: "Chicago Public Library"
      },
      capabilities: ["3D Printing", "Laser Cutting", "Digital Design", "Electronics", "Vinyl Cutting"],
      specialties: ["Public Access", "Educational Workshops", "Free Programs", "Community Making"]
    },
    {
      id: "osm-14",
      name: "Method Mill Chicago",
      type: "craft=fabrication",
      lat: 41.8835,
      lng: -87.6564,
      address: "1407 W Carroll Ave, Chicago, IL 60607",
      tags: {
        craft: "fabrication",
        name: "Method Mill Chicago",
        website: "https://methodmill.com",
        phone: "+1-312-243-1155"
      },
      capabilities: ["CNC Machining", "Wood Fabrication", "Custom Millwork", "Digital Fabrication", "Design Services"],
      specialties: ["Architectural Millwork", "Commercial Interiors", "Custom Furniture", "Retail Fixtures"]
    },
    {
      id: "osm-15",
      name: "Lillstreet Art Center",
      type: "amenity=arts_centre",
      lat: 41.9761,
      lng: -87.6690,
      address: "4401 N Ravenswood Ave, Chicago, IL 60640",
      tags: {
        amenity: "arts_centre",
        name: "Lillstreet Art Center",
        website: "https://lillstreet.com",
        phone: "+1-773-769-4226"
      },
      capabilities: ["Ceramics", "Metalsmithing", "Textiles", "Printmaking", "Glass Working"],
      specialties: ["Art Classes", "Studio Space", "Artist Residencies", "Exhibitions", "Handmade Products"]
    },
    {
      id: "osm-16",
      name: "Rebuilding Exchange",
      type: "shop=second_hand",
      lat: 41.9218,
      lng: -87.6714,
      address: "1740 W Webster Ave, Chicago, IL 60614",
      tags: {
        shop: "second_hand",
        name: "Rebuilding Exchange",
        website: "https://www.rebuildingexchange.org",
        phone: "+1-773-252-2234"
      },
      capabilities: ["Woodworking", "Furniture Making", "Material Reuse", "Salvaged Materials", "Building Materials"],
      specialties: ["Reclaimed Furniture", "Sustainable Design", "DIY Workshops", "Green Building Materials"]
    },
    {
      id: "osm-17",
      name: "Inventables",
      type: "shop=tools",
      lat: 41.9051,
      lng: -87.6346,
      address: "600 W Chicago Ave, Chicago, IL 60654",
      tags: {
        shop: "tools",
        name: "Inventables",
        website: "https://www.inventables.com",
        phone: "+1-312-775-7009"
      },
      capabilities: ["CNC Routing", "Laser Cutting", "3D Printing", "Digital Fabrication", "CAD/CAM Software"],
      specialties: ["DIY CNC Machines", "Maker Tools", "Fabrication Materials", "Design Software"]
    },
    {
      id: "osm-18",
      name: "The Plant Chicago",
      type: "amenity=community_centre",
      lat: 41.8122,
      lng: -87.6669,
      address: "1400 W 46th St, Chicago, IL 60609",
      tags: {
        amenity: "community_centre",
        name: "The Plant Chicago",
        website: "https://plantchicago.org",
        phone: "+1-773-847-5523"
      },
      capabilities: ["Sustainable Manufacturing", "Small Batch Food Production", "Urban Farming", "Material Reuse"],
      specialties: ["Circular Economy", "Sustainable Food Systems", "Education", "Community Development"]
    },
    {
      id: "osm-19",
      name: "Lasercut Chicago",
      type: "craft=laser_cutting",
      lat: 41.8849,
      lng: -87.6527,
      address: "1000 N Milwaukee Ave, Chicago, IL 60642",
      tags: {
        craft: "laser_cutting",
        name: "Lasercut Chicago",
        website: "https://lasercutchicago.com",
        phone: "+1-312-469-0059"
      },
      capabilities: ["Laser Cutting", "Laser Engraving", "CNC Routing", "Digital Fabrication", "Material Sourcing"],
      specialties: ["Custom Signage", "Architectural Models", "Product Prototypes", "Acrylic Fabrication", "Wood Products"]
    },
    {
      id: "osm-20",
      name: "Third Coast Toolworks",
      type: "craft=carpenter",
      lat: 41.9191,
      lng: -87.7072,
      address: "3031 N Rockwell St, Chicago, IL 60618",
      tags: {
        craft: "carpenter",
        name: "Third Coast Toolworks",
        website: "https://thirdcoasttoolworks.com"
      },
      capabilities: ["Woodworking", "Custom Furniture", "Wood Turning", "Cabinet Making", "Woodworking Tools"],
      specialties: ["Fine Furniture", "Custom Cabinetry", "Woodworking Classes", "Tool Development"]
    },
    {
      id: "osm-21",
      name: "Chicago Manufacturing Campus",
      type: "landuse=industrial",
      lat: 41.6594,
      lng: -87.5564,
      address: "12200 S Avenue O, Chicago, IL 60633",
      tags: {
        landuse: "industrial",
        name: "Chicago Manufacturing Campus",
        operator: "Ford Supplier Park"
      },
      capabilities: ["Automotive Parts Manufacturing", "Plastic Injection Molding", "Metal Stamping", "Assembly"],
      specialties: ["Just-in-Time Manufacturing", "Automotive Components", "Supply Chain Integration"]
    },
    {
      id: "osm-22",
      name: "Bridgeport Art Center",
      type: "amenity=arts_centre",
      lat: 41.8392,
      lng: -87.6484,
      address: "1200 W 35th St, Chicago, IL 60609",
      tags: {
        amenity: "arts_centre",
        name: "Bridgeport Art Center",
        website: "https://www.bridgeportart.com",
        phone: "+1-773-247-3000"
      },
      capabilities: ["Ceramics", "Printmaking", "Sculpture", "Woodworking", "Painting"],
      specialties: ["Artist Studios", "Exhibition Spaces", "Art Workshops", "Mixed Media", "Public Events"]
    },
    {
      id: "osm-23",
      name: "Plumen Chicago",
      type: "craft=handmade",
      lat: 41.8976,
      lng: -87.6803,
      address: "1821 W Chicago Ave, Chicago, IL 60622",
      tags: {
        craft: "handmade",
        name: "Plumen Chicago",
        website: "https://plumenchicago.com"
      },
      capabilities: ["Digital Fabrication", "3D Printing", "Laser Cutting", "Custom Lighting", "Product Design"],
      specialties: ["Artisan Lighting", "Custom Light Fixtures", "Residential Lighting", "Commercial Lighting"]
    },
    {
      id: "osm-24",
      name: "Metropolis Signs",
      type: "craft=signmaker",
      lat: 41.9211,
      lng: -87.7044,
      address: "2841 N Western Ave, Chicago, IL 60618",
      tags: {
        craft: "signmaker",
        name: "Metropolis Signs",
        website: "https://metropolissigns.com",
        phone: "+1-773-661-0433"
      },
      capabilities: ["Sign Manufacturing", "LED Signage", "Channel Letters", "Vinyl Graphics", "Metal Fabrication"],
      specialties: ["Commercial Signage", "Custom Signs", "Architectural Signage", "Indoor/Outdoor Signs"]
    },
    {
      id: "osm-25",
      name: "Garfield Refinery",
      type: "craft=jeweller",
      lat: 41.8829,
      lng: -87.6319,
      address: "220 S State St, Chicago, IL 60604",
      tags: {
        craft: "jeweller",
        name: "Garfield Refinery",
        website: "https://garfieldrefinery.com",
        phone: "+1-312-629-0008"
      },
      capabilities: ["Metal Refining", "Jewelry Casting", "Precious Metals", "Metal Recycling", "Gold Smithing"],
      specialties: ["Precious Metal Refining", "Jewelry Crafting", "Custom Jewelry", "Metal Working"]
    },
    {
      id: "osm-26",
      name: "DePaul Idea Realization Lab",
      type: "amenity=university;makerspace",
      lat: 41.9267,
      lng: -87.6533,
      address: "2250 N Sheffield Ave, Chicago, IL 60614",
      tags: {
        amenity: "university;makerspace",
        name: "DePaul Idea Realization Lab",
        website: "https://irl.depaul.edu",
        operator: "DePaul University"
      },
      capabilities: ["3D Printing", "Laser Cutting", "Virtual Reality", "Electronics", "Textiles"],
      specialties: ["Academic Projects", "Student Innovation", "Design Thinking", "Cross-Disciplinary Making"]
    },
    {
      id: "osm-27",
      name: "Makerguild Chicago",
      type: "amenity=workshop",
      lat: 41.9131,
      lng: -87.6870,
      address: "2233 W North Ave, Chicago, IL 60647",
      tags: {
        amenity: "workshop",
        name: "Makerguild Chicago",
        website: "https://makerguild.org"
      },
      capabilities: ["Digital Fabrication", "Woodworking", "Metal Shop", "Electronics", "Textiles"],
      specialties: ["Skill Sharing", "Community Projects", "Sustainable Making", "Tool Library"]
    },
    {
      id: "osm-28",
      name: "Chicago Metal Fabricators",
      type: "industrial=fabrication",
      lat: 41.8054,
      lng: -87.7225,
      address: "4400 S Kildare Ave, Chicago, IL 60632",
      tags: {
        industrial: "fabrication",
        name: "Chicago Metal Fabricators",
        website: "https://chicagometalfabricators.com",
        phone: "+1-773-523-5757"
      },
      capabilities: ["Metal Stamping", "Sheet Metal", "Welding", "CNC Cutting", "Metal Finishing"],
      specialties: ["Commercial Products", "Custom Metal Parts", "Small/Medium Production Runs", "Metal Components"]
    },
    {
      id: "osm-29",
      name: "Lost Arts Chicago",
      type: "amenity=creative_space",
      lat: 41.8916,
      lng: -87.6345,
      address: "1001 N Branch St, Chicago, IL 60642",
      tags: {
        amenity: "creative_space",
        name: "Lost Arts Chicago",
        website: "https://lostarts.co"
      },
      capabilities: ["Digital Fabrication", "Woodworking", "Electronics", "Software Development", "Video Production"],
      specialties: ["Creative Technology", "Multi-Disciplinary Collaboration", "Co-working", "Innovation"]
    },
    {
      id: "osm-30",
      name: "Sculptural Glass Chicago",
      type: "craft=glass",
      lat: 41.8804,
      lng: -87.6608,
      address: "1050 N Kingsbury St, Chicago, IL 60642",
      tags: {
        craft: "glass",
        name: "Sculptural Glass Chicago",
        website: "https://sculpturalglass.com",
        phone: "+1-312-265-1434"
      },
      capabilities: ["Glass Blowing", "Glass Casting", "Kiln Forming", "Glass Cutting", "Cold Working"],
      specialties: ["Architectural Glass", "Art Glass", "Custom Lighting", "Glass Sculpture", "Installation Art"]
    }
  ];
};

/**
 * Transform OpenStreetMap data to match our producer data structure
 * @param {Array} osmData - Raw OpenStreetMap data
 * @returns {Array} - Transformed producer data
 */
export const transformOSMDataToProducers = (osmData) => {
  return osmData.map(osm => {
    // Generate a sustainability score between 60-100 for all workshop/makerspace/fab locations
    // Real implementation would use actual data or derive from tags
    const sustainabilityScore = Math.floor(60 + Math.random() * 40);
    
    // Generate economic zones based on location
    const economicZones = [];
    
    // South and West Side
    if (osm.lat < 41.85 || osm.lng < -87.65) {
      economicZones.push("Opportunity Zone");
    }
    
    // Central business district
    if (osm.lat > 41.87 && osm.lat < 41.90 && osm.lng > -87.64 && osm.lng < -87.62) {
      economicZones.push("TIF District");
    }
    
    // Northwest and North
    if ((osm.lat > 41.91 && osm.lng < -87.69) || (osm.lat > 41.95)) {
      economicZones.push("Enterprise Zone");
    }
    
    // Random availability percentage (50-95%)
    const availabilityPercent = Math.floor(50 + Math.random() * 45);
    
    // Determine neighborhood based on location
    let neighborhood = "Chicago";
    if (osm.lat > 41.95) neighborhood = "Rogers Park/Edgewater";
    else if (osm.lat > 41.92) neighborhood = "Lincoln Square/Ravenswood";
    else if (osm.lat > 41.90 && osm.lng < -87.67) neighborhood = "Logan Square/Humboldt Park";
    else if (osm.lat > 41.90 && osm.lng > -87.67) neighborhood = "Lakeview/Lincoln Park";
    else if (osm.lat > 41.87 && osm.lng < -87.65) neighborhood = "West Loop/Near West Side";
    else if (osm.lat > 41.87 && osm.lng > -87.65) neighborhood = "Downtown/River North";
    else if (osm.lat > 41.83 && osm.lng < -87.65) neighborhood = "Pilsen/Bridgeport";
    else if (osm.lat > 41.83 && osm.lng > -87.65) neighborhood = "South Loop/Bronzeville";
    else if (osm.lat < 41.83) neighborhood = "South Side";
    
    // Generate ZIP code from location (mocked for now)
    const zip = `606${Math.floor(Math.random() * 40).toString().padStart(2, '0')}`;
    
    // Extract street address from full address
    const street = osm.address.split(',')[0];
    
    // Generate ward number (1-50)
    const ward = (Math.floor(Math.random() * 50) + 1).toString();

    // Format to match producer data structure
    return {
      id: osm.id,
      name: osm.name,
      rating: (3.5 + Math.random() * 1.5).toFixed(1), // Random rating between 3.5 and 5
      reviews: Math.floor(5 + Math.random() * 45), // Random review count
      location: {
        lat: osm.lat,
        lng: osm.lng,
        city: "Chicago",
        address: osm.address,
        neighborhood: neighborhood,
        zip: zip,
        ward: ward,
        industrialCorridor: neighborhood.includes("West") ? "West Side Industrial Corridor" : 
                           neighborhood.includes("South") ? "South Side Industrial Corridor" : 
                           neighborhood.includes("North") ? "North Side Industrial Corridor" : "Central Chicago"
      },
      distance: parseFloat((Math.random() * 10).toFixed(1)), // Random distance
      capabilities: osm.capabilities || ["Digital Fabrication"],
      specialties: osm.specialties || ["Custom Manufacturing"],
      turnaround: ['2-3 business days', '3-5 business days', '5-7 business days'][Math.floor(Math.random() * 3)],
      priceRange: ['$', '$$', '$$$'][Math.floor(Math.random() * 3)],
      availabilityPercent: availabilityPercent,
      sustainabilityScore: sustainabilityScore,
      website: osm.tags?.website || undefined,
      email: osm.tags?.email || `info@${osm.name.toLowerCase().replace(/[^\w]/g, '')}.com`,
      imageUrl: undefined, // Will be generated by the UI component
      wifiEnabled: Math.random() > 0.5,
      verificationSources: ["OpenStreetMap", "Community Verified"],
      lastVerified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date within last 30 days
      naicsCode: osm.type?.includes("printing") ? "323111" :
                osm.type?.includes("metal") ? "332000" :
                osm.type?.includes("makerspace") ? "541990" :
                osm.type?.includes("workshop") ? "339999" : "323999",
      zoningCompliant: true,
      sustainabilityBadges: sustainabilityScore > 90 ? ["Green Certified", "Carbon Neutral"] :
                          sustainabilityScore > 80 ? ["Recycled Materials"] :
                          sustainabilityScore > 70 ? ["Energy Efficient"] : [],
      equipment: osm.capabilities?.map(cap => 
        `${['Professional', 'Industrial', 'Commercial'][Math.floor(Math.random() * 3)]} ${cap} System`
      ).slice(0, 3) || ["Equipment information unavailable"],
      economicZones: economicZones,
      transitAccess: {
        truckRoute: Math.random() > 0.5,
        publicTransit: Math.random() > 0.3,
        bikeways: Math.random() > 0.6
      },
      capacity: {
        availableHours: Math.floor(Math.random() * 40),
        leadTime: ["2-4 days", "3-5 days", "5-7 days"][Math.floor(Math.random() * 3)],
        maxSize: ["11 x 17 inches", "24 x 36 inches", "60 x 100 inches"][Math.floor(Math.random() * 3)]
      },
      scores: {
        trust: Math.floor(70 + Math.random() * 30),
        capability: Math.floor(60 + Math.random() * 40),
        accessibility: Math.floor(60 + Math.random() * 40),
        sustainability: sustainabilityScore,
        equity: Math.floor(60 + Math.random() * 40)
      },
      // Tag data from OpenStreetMap
      osmData: {
        type: osm.type,
        tags: osm.tags || {},
        openingHours: osm.tags?.opening_hours || undefined,
        phone: osm.tags?.phone || undefined,
        dataSource: "OpenStreetMap"
      }
    };
  });
};

export default {
  getOpenStreetMapProducers,
  transformOSMDataToProducers
};