import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Printer, 
  Edit, 
  Trash2, 
  Plus, 
  Check, 
  HelpCircle, 
  X, 
  Download,
  Calendar,
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const Equipment = () => {
  const { currentUser } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'printing-press',
    model: '',
    manufacturer: '',
    purchaseDate: '',
    lastMaintenance: '',
    nextMaintenance: '',
    status: 'operational',
    capabilities: '',
    maxSize: '',
    resolution: '',
    colorCapacity: '',
    materials: '',
    notes: ''
  });
  const [viewDetails, setViewDetails] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Pre-populated equipment data (in a real app, this would come from an API)
  useEffect(() => {
    // Sample data for demonstration
    const sampleEquipment = [
      {
        id: 1,
        name: 'Roland Texart RT-640',
        type: 'dye-sublimation',
        model: 'RT-640',
        manufacturer: 'Roland',
        purchaseDate: '2023-09-15',
        lastMaintenance: '2025-03-10',
        nextMaintenance: '2025-06-10',
        status: 'operational',
        capabilities: 'Dye sublimation printing for fabrics, apparel, and soft signage',
        maxSize: '63.6" (1615mm)',
        resolution: '1440 dpi',
        colorCapacity: '8 colors (dual CMYK or 4 colors + Lt Cyan, Lt Magenta, Orange, Violet)',
        materials: 'Transfer paper, polyester fabrics',
        maintenanceHistory: [
          { date: '2025-03-10', type: 'Routine', notes: 'Print head cleaning, firmware update', technician: 'Internal' },
          { date: '2024-12-05', type: 'Minor Repair', notes: 'Fixed feed roller, replaced ink tubes', technician: 'Roland Service' }
        ],
        notes: 'Our primary machine for fabric printing. Running dual CMYK configuration.'
      },
      {
        id: 2,
        name: 'Brother GTX DTG Printer',
        type: 'dtg',
        model: 'GTX',
        manufacturer: 'Brother',
        purchaseDate: '2024-05-22',
        lastMaintenance: '2025-02-15',
        nextMaintenance: '2025-05-15',
        status: 'operational',
        capabilities: 'Direct-to-garment printing, high-quality graphics on light and dark garments',
        maxSize: '16" x 21"',
        resolution: '1200 x 1200 dpi',
        colorCapacity: 'CMYK + White',
        materials: 'Cotton, polyester, blended fabrics',
        maintenanceHistory: [
          { date: '2025-02-15', type: 'Routine', notes: 'Print head cleaning, white ink circulation', technician: 'Internal' }
        ],
        notes: 'Best for small to medium custom t-shirt orders. Excellent for detailed designs.'
      },
      {
        id: 3,
        name: 'M&R Sportsman EX 8-Color',
        type: 'screen-printing',
        model: 'Sportsman EX',
        manufacturer: 'M&R',
        purchaseDate: '2022-11-30',
        lastMaintenance: '2025-01-20',
        nextMaintenance: '2025-04-20',
        status: 'maintenance-required',
        capabilities: 'High-volume screen printing, 8-color jobs, up to 500+ pieces/hour',
        maxSize: '20" x 28"',
        resolution: 'Up to 65 LPI (lines per inch)',
        colorCapacity: '8 colors',
        materials: 'Cotton, polyester, blends, canvas, specialty fabrics',
        maintenanceHistory: [
          { date: '2025-01-20', type: 'Routine', notes: 'Lubrication, belt tension adjustment', technician: 'Internal' },
          { date: '2024-08-12', type: 'Major Service', notes: 'Replaced indexer, electrical system check', technician: 'M&R Certified Tech' }
        ],
        notes: 'Alert: Registration system needs adjustment. Schedule full maintenance soon.'
      },
      {
        id: 4,
        name: 'Kornit Atlas MAX DTG',
        type: 'dtg',
        model: 'Atlas MAX',
        manufacturer: 'Kornit',
        purchaseDate: '2023-12-10',
        lastMaintenance: '2025-03-05',
        nextMaintenance: '2025-05-05',
        status: 'operational',
        capabilities: 'Industrial DTG printing with high throughput, exceptional detail and color gamut',
        maxSize: '23.5" x 35"',
        resolution: 'Up to 1200 dpi',
        colorCapacity: 'CMYKRG + White',
        materials: 'Natural & synthetic fabrics, blends, specialty materials',
        maintenanceHistory: [
          { date: '2025-03-05', type: 'Routine', notes: 'System diagnostics, print head alignment', technician: 'Internal' },
          { date: '2024-10-17', type: 'Routine', notes: 'Firmware update, calibration', technician: 'Kornit Service' }
        ],
        notes: 'Our premium DTG system for high-volume production and specialty orders.'
      },
      {
        id: 5,
        name: 'GCC Expert II Vinyl Cutter',
        type: 'vinyl-cutter',
        model: 'Expert II 52 LX',
        manufacturer: 'GCC',
        purchaseDate: '2024-02-28',
        lastMaintenance: '2025-02-28',
        nextMaintenance: '2025-05-28',
        status: 'operational',
        capabilities: 'Precision vinyl cutting for decals, stickers, heat transfers',
        maxSize: '52" width',
        resolution: '0.0005" mechanical resolution',
        colorCapacity: 'N/A (cutting only)',
        materials: 'Vinyl, heat transfer vinyl, reflective materials, window film',
        maintenanceHistory: [
          { date: '2025-02-28', type: 'Routine', notes: 'Blade replacement, calibration', technician: 'Internal' }
        ],
        notes: 'Used for custom vinyl applications and heat transfer designs.'
      },
      {
        id: 6,
        name: 'Epson SureColor P9000 Large Format',
        type: 'large-format',
        model: 'SureColor P9000',
        manufacturer: 'Epson',
        purchaseDate: '2023-03-15',
        lastMaintenance: '2025-03-01',
        nextMaintenance: '2025-06-01',
        status: 'offline',
        capabilities: 'Fine art and photographic printing, posters, proofs',
        maxSize: '44" width',
        resolution: '2880 x 1440 dpi',
        colorCapacity: '10-color UltraChrome HDX pigment ink',
        materials: 'Photo paper, fine art paper, canvas, vinyl, backlit film',
        maintenanceHistory: [
          { date: '2025-03-01', type: 'Routine', notes: 'Print head cleaning, nozzle check', technician: 'Internal' },
          { date: '2024-09-20', type: 'Repair', notes: 'Fixed paper feed mechanism', technician: 'Epson Certified Tech' }
        ],
        notes: 'Currently offline due to clogged print heads. Parts ordered, waiting for service.'
      },
      {
        id: 7,
        name: 'Tajima TMAR-KC915 Embroidery Machine',
        type: 'embroidery',
        model: 'TMAR-KC915',
        manufacturer: 'Tajima',
        purchaseDate: '2024-01-05',
        lastMaintenance: '2025-03-20',
        nextMaintenance: '2025-06-20',
        status: 'operational',
        capabilities: 'Industrial multi-head embroidery, caps, flats, 1000+ stitches/minute',
        maxSize: '15" x 19.5" (per head)',
        resolution: 'N/A',
        colorCapacity: '15 colors',
        materials: 'Caps, shirts, bags, patches, various fabrics',
        maintenanceHistory: [
          { date: '2025-03-20', type: 'Routine', notes: 'Tension adjustment, hook timing', technician: 'Internal' }
        ],
        notes: 'Used for all embroidery orders. Working excellently after recent calibration.'
      }
    ];
    
    setEquipment(sampleEquipment);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddEquipment = () => {
    setFormData({
      name: '',
      type: 'printing-press',
      model: '',
      manufacturer: '',
      purchaseDate: '',
      lastMaintenance: '',
      nextMaintenance: '',
      status: 'operational',
      capabilities: '',
      maxSize: '',
      resolution: '',
      colorCapacity: '',
      materials: '',
      notes: ''
    });
    setShowAddForm(true);
    setShowEditForm(false);
    setViewDetails(null);
  };

  const handleEditEquipment = (equipmentItem) => {
    setCurrentEquipment(equipmentItem);
    setFormData({
      name: equipmentItem.name,
      type: equipmentItem.type,
      model: equipmentItem.model,
      manufacturer: equipmentItem.manufacturer,
      purchaseDate: equipmentItem.purchaseDate,
      lastMaintenance: equipmentItem.lastMaintenance,
      nextMaintenance: equipmentItem.nextMaintenance,
      status: equipmentItem.status,
      capabilities: equipmentItem.capabilities,
      maxSize: equipmentItem.maxSize,
      resolution: equipmentItem.resolution,
      colorCapacity: equipmentItem.colorCapacity,
      materials: equipmentItem.materials,
      notes: equipmentItem.notes
    });
    setShowEditForm(true);
    setShowAddForm(false);
    setViewDetails(null);
  };

  const handleSaveEquipment = () => {
    if (showAddForm) {
      // Add new equipment
      const newEquipment = {
        id: equipment.length + 1,
        ...formData,
        maintenanceHistory: [{
          date: formData.lastMaintenance,
          type: 'Initial',
          notes: 'Equipment added to system',
          technician: 'Internal'
        }]
      };
      setEquipment([...equipment, newEquipment]);
    } else if (showEditForm && currentEquipment) {
      // Update existing equipment
      const updatedEquipment = equipment.map(item => {
        if (item.id === currentEquipment.id) {
          return {
            ...item,
            ...formData
          };
        }
        return item;
      });
      setEquipment(updatedEquipment);
    }
    
    setShowAddForm(false);
    setShowEditForm(false);
    setCurrentEquipment(null);
  };

  const handleDeleteEquipment = (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      setEquipment(equipment.filter(item => item.id !== id));
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setCurrentEquipment(null);
  };

  const handleViewDetails = (equipmentItem) => {
    setViewDetails(equipmentItem);
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleCloseDetails = () => {
    setViewDetails(null);
  };

  const handleScheduleMaintenance = (equipmentItem) => {
    // In a real app, this would open a modal or form for scheduling maintenance
    alert(`Schedule maintenance for ${equipmentItem.name}`);
  };

  // Filter the equipment list based on status, type, and search term
  const filteredEquipment = equipment.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  // Map equipment types to friendly names
  const equipmentTypeNames = {
    'printing-press': 'Printing Press',
    'dtg': 'Direct to Garment',
    'dye-sublimation': 'Dye Sublimation',
    'screen-printing': 'Screen Printing',
    'large-format': 'Large Format',
    'vinyl-cutter': 'Vinyl Cutter',
    'heat-press': 'Heat Press',
    'embroidery': 'Embroidery Machine',
    'laser-engraver': 'Laser Engraver',
    'other': 'Other Equipment'
  };

  // Equipment status badges
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      'operational': { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      'maintenance-required': { color: 'bg-yellow-100 text-yellow-800', icon: <AlertCircle className="h-3 w-3 mr-1" /> },
      'offline': { color: 'bg-red-100 text-red-800', icon: <X className="h-3 w-3 mr-1" /> },
      'maintenance-scheduled': { color: 'bg-blue-100 text-blue-800', icon: <Calendar className="h-3 w-3 mr-1" /> }
    };
    
    const config = statusConfig[status] || statusConfig['operational'];
    
    return (
      <Badge variant="outline" className={`flex items-center ${config.color}`}>
        {config.icon}
        {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </Badge>
    );
  };

  // Get upcoming maintenance requirements
  const upcomingMaintenance = equipment
    .filter(item => {
      const nextDate = new Date(item.nextMaintenance);
      const today = new Date();
      const diffTime = nextDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    })
    .sort((a, b) => new Date(a.nextMaintenance) - new Date(b.nextMaintenance));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Equipment Management</h1>
        <Button onClick={handleAddEquipment}>
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="statusFilter"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="operational">Operational</option>
            <option value="maintenance-required">Maintenance Required</option>
            <option value="maintenance-scheduled">Maintenance Scheduled</option>
            <option value="offline">Offline</option>
          </select>
        </div>
        <div>
          <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-1">Equipment Type</label>
          <select
            id="typeFilter"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            {Object.entries(equipmentTypeNames).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="lg:col-span-2">
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            id="searchTerm"
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Search by name, model, or manufacturer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Equipment List and Details View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment List */}
        <div className={viewDetails ? "lg:col-span-2" : "lg:col-span-3"}>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Equipment</p>
                    <h3 className="text-2xl font-bold mt-1">{equipment.length}</h3>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Printer className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Operational</p>
                    <h3 className="text-2xl font-bold mt-1">{equipment.filter(item => item.status === 'operational').length}</h3>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Needs Maintenance</p>
                    <h3 className="text-2xl font-bold mt-1">{equipment.filter(item => item.status === 'maintenance-required').length}</h3>
                  </div>
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Offline</p>
                    <h3 className="text-2xl font-bold mt-1">{equipment.filter(item => item.status === 'offline').length}</h3>
                  </div>
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Equipment Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Equipment</CardTitle>
              <CardDescription>
                Manage your printing and production equipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredEquipment.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-medium text-gray-500">Name</th>
                        <th className="pb-3 font-medium text-gray-500">Type</th>
                        <th className="pb-3 font-medium text-gray-500">Status</th>
                        <th className="pb-3 font-medium text-gray-500">Next Maintenance</th>
                        <th className="pb-3 font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEquipment.map(item => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 text-sm font-medium">{item.name}</td>
                          <td className="py-3 text-sm">{equipmentTypeNames[item.type] || item.type}</td>
                          <td className="py-3 text-sm">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="py-3 text-sm">
                            {item.nextMaintenance}
                          </td>
                          <td className="py-3 text-sm">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleViewDetails(item)}>
                                Details
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleEditEquipment(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteEquipment(item.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No equipment found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your filters or add some equipment.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Maintenance */}
          {upcomingMaintenance.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Upcoming Maintenance</CardTitle>
                <CardDescription>
                  Equipment scheduled for maintenance in the next 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMaintenance.map(item => {
                    const nextDate = new Date(item.nextMaintenance);
                    const today = new Date();
                    const diffTime = nextDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    return (
                      <div key={item.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">Scheduled for: {item.nextMaintenance}</p>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className={diffDays <= 7 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                            <Calendar className="h-3 w-3 mr-1" />
                            {diffDays} days
                          </Badge>
                          <Button size="sm" variant="outline" className="ml-4" onClick={() => handleScheduleMaintenance(item)}>
                            Schedule
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Equipment Details View */}
        {viewDetails && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{viewDetails.name}</CardTitle>
                  <CardDescription>{equipmentTypeNames[viewDetails.type] || viewDetails.type}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCloseDetails}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <StatusBadge status={viewDetails.status} />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Specifications</h3>
                    <div className="bg-gray-50 p-3 rounded-md space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Model</span>
                        <span className="text-sm">{viewDetails.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Manufacturer</span>
                        <span className="text-sm">{viewDetails.manufacturer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Purchase Date</span>
                        <span className="text-sm">{viewDetails.purchaseDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Max Size</span>
                        <span className="text-sm">{viewDetails.maxSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Resolution</span>
                        <span className="text-sm">{viewDetails.resolution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Color Capacity</span>
                        <span className="text-sm">{viewDetails.colorCapacity}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Capabilities</h3>
                    <p className="text-sm">{viewDetails.capabilities}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Compatible Materials</h3>
                    <p className="text-sm">{viewDetails.materials}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Maintenance</h3>
                    <div className="bg-gray-50 p-3 rounded-md space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Last Maintenance</span>
                        <span className="text-sm">{viewDetails.lastMaintenance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Next Maintenance</span>
                        <span className="text-sm">{viewDetails.nextMaintenance}</span>
                      </div>
                    </div>
                  </div>

                  {viewDetails.maintenanceHistory && viewDetails.maintenanceHistory.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Maintenance History</h3>
                      <div className="space-y-2">
                        {viewDetails.maintenanceHistory.map((record, index) => (
                          <div key={index} className="border-l-2 border-blue-500 pl-3 py-1">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{record.date}</span>
                              <span className="text-sm">{record.type}</span>
                            </div>
                            <p className="text-xs text-gray-600">{record.notes}</p>
                            <p className="text-xs text-gray-500">Technician: {record.technician}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {viewDetails.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Notes</h3>
                      <p className="text-sm">{viewDetails.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleEditEquipment(viewDetails)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleScheduleMaintenance(viewDetails)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>

      {/* Equipment Form (Add/Edit) */}
      {(showAddForm || showEditForm) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {showAddForm ? 'Add New Equipment' : 'Edit Equipment'}
                </h2>
                <Button variant="ghost" onClick={handleCancel}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Equipment Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Equipment Type *</label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    >
                      {Object.entries(equipmentTypeNames).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                    <input
                      type="text"
                      id="manufacturer"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                    <input
                      type="date"
                      id="purchaseDate"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    >
                      <option value="operational">Operational</option>
                      <option value="maintenance-required">Maintenance Required</option>
                      <option value="maintenance-scheduled">Maintenance Scheduled</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="lastMaintenance" className="block text-sm font-medium text-gray-700 mb-1">Last Maintenance</label>
                    <input
                      type="date"
                      id="lastMaintenance"
                      name="lastMaintenance"
                      value={formData.lastMaintenance}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="nextMaintenance" className="block text-sm font-medium text-gray-700 mb-1">Next Maintenance</label>
                    <input
                      type="date"
                      id="nextMaintenance"
                      name="nextMaintenance"
                      value={formData.nextMaintenance}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="capabilities" className="block text-sm font-medium text-gray-700 mb-1">Capabilities</label>
                    <textarea
                      id="capabilities"
                      name="capabilities"
                      value={formData.capabilities}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="maxSize" className="block text-sm font-medium text-gray-700 mb-1">Maximum Size</label>
                      <input
                        type="text"
                        id="maxSize"
                        name="maxSize"
                        value={formData.maxSize}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="e.g., 24 x 36 inches"
                      />
                    </div>
                    <div>
                      <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
                      <input
                        type="text"
                        id="resolution"
                        name="resolution"
                        value={formData.resolution}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="e.g., 1200 dpi"
                      />
                    </div>
                    <div>
                      <label htmlFor="colorCapacity" className="block text-sm font-medium text-gray-700 mb-1">Color Capacity</label>
                      <input
                        type="text"
                        id="colorCapacity"
                        name="colorCapacity"
                        value={formData.colorCapacity}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="e.g., CMYK + 2 spot colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-1">Compatible Materials</label>
                    <textarea
                      id="materials"
                      name="materials"
                      value={formData.materials}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="e.g., Paper, cardstock, vinyl, fabric"
                    />
                  </div>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button onClick={handleSaveEquipment}>
                    {showAddForm ? 'Add Equipment' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipment;