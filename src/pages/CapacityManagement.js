import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';

const CapacityManagement = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, loading } = useAuth();
  const [dailyCapacity, setDailyCapacity] = useState(100); // Maximum daily capacity (in units)
  const [capacitySettings, setCapacitySettings] = useState({
    monday: { percentage: 80, available: true },
    tuesday: { percentage: 80, available: true },
    wednesday: { percentage: 80, available: true },
    thursday: { percentage: 80, available: true },
    friday: { percentage: 80, available: true },
    saturday: { percentage: 50, available: false },
    sunday: { percentage: 0, available: false },
  });
  
  // Production equipment list
  const [equipment, setEquipment] = useState([
    { 
      id: 1, 
      name: 'Roland Texart RT-640', 
      type: 'dye-sublimation',
      status: 'operational',
      capacityPerHour: 15,
      hoursAvailable: 8,
      maintenanceScheduled: false
    },
    { 
      id: 2, 
      name: 'Brother GTX DTG Printer', 
      type: 'dtg',
      status: 'operational',
      capacityPerHour: 25,
      hoursAvailable: 8,
      maintenanceScheduled: false
    },
    { 
      id: 3, 
      name: 'M&R Sportsman EX 8-Color', 
      type: 'screen-printing',
      status: 'maintenance-required',
      capacityPerHour: 60,
      hoursAvailable: 4,
      maintenanceScheduled: true
    },
  ]);

  // Production queue/orders
  const [productionQueue, setProductionQueue] = useState([
    {
      id: 'order-1',
      orderNumber: 'ORD-12345',
      client: 'Sarah Johnson',
      product: 'T-Shirts',
      quantity: 20,
      machineId: 2,
      priority: 1,
      dueDate: '2025-04-25',
      estimatedCompletionTime: 0.8, // hours
      status: 'in-queue'
    },
    {
      id: 'order-2',
      orderNumber: 'ORD-12346',
      client: 'Michael Chen',
      product: 'Banners',
      quantity: 5,
      machineId: 1,
      priority: 2,
      dueDate: '2025-04-26',
      estimatedCompletionTime: 2, // hours
      status: 'in-progress'
    },
    {
      id: 'order-3',
      orderNumber: 'ORD-12347',
      client: 'ABC Corp',
      product: 'Polo Shirts',
      quantity: 100,
      machineId: 3,
      priority: 3,
      dueDate: '2025-04-30',
      estimatedCompletionTime: 1.7, // hours
      status: 'in-queue'
    },
    {
      id: 'order-4',
      orderNumber: 'ORD-12348',
      client: 'Local High School',
      product: 'Team Jerseys',
      quantity: 25,
      machineId: 2,
      priority: 4,
      dueDate: '2025-05-02',
      estimatedCompletionTime: 1, // hours
      status: 'in-queue'
    },
  ]);

  // Product types
  const [productTypes, setProductTypes] = useState([
    { id: 1, name: 'T-Shirts', defaultMachine: 2, avgTimePerUnit: 0.04 },
    { id: 2, name: 'Hoodies', defaultMachine: 2, avgTimePerUnit: 0.06 },
    { id: 3, name: 'Banners', defaultMachine: 1, avgTimePerUnit: 0.4 },
    { id: 4, name: 'Posters', defaultMachine: 1, avgTimePerUnit: 0.2 },
    { id: 5, name: 'Business Cards', defaultMachine: 3, avgTimePerUnit: 0.01 },
    { id: 6, name: 'Stickers', defaultMachine: 3, avgTimePerUnit: 0.01 },
    { id: 7, name: 'Polo Shirts', defaultMachine: 2, avgTimePerUnit: 0.05 },
    { id: 8, name: 'Team Jerseys', defaultMachine: 2, avgTimePerUnit: 0.04 },
  ]);

  // Machine statuses and capacities
  const [showAddMachineForm, setShowAddMachineForm] = useState(false);
  const [newMachine, setNewMachine] = useState({
    name: '',
    type: 'dtg',
    capacityPerHour: 20,
    hoursAvailable: 8,
  });

  // Redirect if user is not authenticated or not a producer
  useEffect(() => {
    if (!loading && (!isAuthenticated || currentUser?.role !== 'producer')) {
      navigate('/login');
    }
  }, [isAuthenticated, currentUser, loading, navigate]);
  
  const handleCapacityChange = (day, field, value) => {
    setCapacitySettings(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: field === 'percentage' ? parseInt(value, 10) : value
      }
    }));
  };
  
  const handleDailyCapacityChange = (e) => {
    setDailyCapacity(parseInt(e.target.value, 10));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the capacity settings to your backend
    console.log('Saving capacity settings:', { dailyCapacity, capacitySettings });
    alert('Capacity settings saved successfully!');
  };

  const handleMachineInputChange = (e) => {
    const { name, value } = e.target;
    setNewMachine(prev => ({
      ...prev,
      [name]: name === 'capacityPerHour' || name === 'hoursAvailable' 
        ? parseInt(value, 10) 
        : value
    }));
  };

  const handleAddMachine = () => {
    const machine = {
      id: equipment.length + 1,
      ...newMachine,
      status: 'operational',
      maintenanceScheduled: false
    };

    setEquipment([...equipment, machine]);
    setShowAddMachineForm(false);
    setNewMachine({
      name: '',
      type: 'dtg',
      capacityPerHour: 20,
      hoursAvailable: 8,
    });
  };

  const handleMachineStatusChange = (id, status) => {
    setEquipment(equipment.map(machine => {
      if (machine.id === id) {
        return { ...machine, status };
      }
      return machine;
    }));
  };

  const handleMachineHoursChange = (id, hoursAvailable) => {
    setEquipment(equipment.map(machine => {
      if (machine.id === id) {
        return { ...machine, hoursAvailable: parseInt(hoursAvailable, 10) };
      }
      return machine;
    }));
  };

  const handleChangePriority = (id, newPriority) => {
    // Find the order with the given id
    const order = productionQueue.find(o => o.id === id);
    if (!order) return;

    // Update the priorities of all orders
    const updatedQueue = productionQueue
      .map(o => {
        if (o.id === id) {
          return { ...o, priority: newPriority };
        } else if (o.priority >= newPriority && o.priority < order.priority) {
          // Shift down orders that were moved up
          return { ...o, priority: o.priority + 1 };
        } else if (o.priority <= newPriority && o.priority > order.priority) {
          // Shift up orders that were moved down
          return { ...o, priority: o.priority - 1 };
        }
        return o;
      })
      .sort((a, b) => a.priority - b.priority);

    setProductionQueue(updatedQueue);
  };

  const handleMoveUp = (id) => {
    const orderIndex = productionQueue.findIndex(o => o.id === id);
    if (orderIndex <= 0) return; // Already at the top

    const newPriority = productionQueue[orderIndex - 1].priority;
    handleChangePriority(id, newPriority);
  };

  const handleMoveDown = (id) => {
    const orderIndex = productionQueue.findIndex(o => o.id === id);
    if (orderIndex >= productionQueue.length - 1) return; // Already at the bottom

    const newPriority = productionQueue[orderIndex + 1].priority;
    handleChangePriority(id, newPriority);
  };

  const handleAssignMachine = (orderId, machineId) => {
    setProductionQueue(productionQueue.map(order => {
      if (order.id === orderId) {
        return { ...order, machineId };
      }
      return order;
    }));
  };

  // Calculate derived capacities
  const totalMachineCapacity = equipment.reduce((total, machine) => {
    if (machine.status === 'operational') {
      return total + (machine.capacityPerHour * machine.hoursAvailable);
    }
    return total;
  }, 0);

  const capacityBySupportedProducts = {};
  productTypes.forEach(type => {
    const supportedMachines = equipment.filter(m => m.status === 'operational');
    const capacity = supportedMachines.reduce((total, machine) => {
      return total + Math.floor(machine.hoursAvailable / type.avgTimePerUnit);
    }, 0);
    capacityBySupportedProducts[type.name] = capacity;
  });

  const machineUtilization = equipment.map(machine => {
    const ordersForMachine = productionQueue.filter(order => order.machineId === machine.id);
    const totalHoursAssigned = ordersForMachine.reduce((total, order) => total + order.estimatedCompletionTime, 0);
    const utilizationPercentage = Math.min(100, Math.round((totalHoursAssigned / machine.hoursAvailable) * 100));
    
    return {
      ...machine,
      ordersAssigned: ordersForMachine.length,
      hoursAssigned: totalHoursAssigned,
      utilizationPercentage
    };
  });

  // Sort queue by priority
  const sortedQueue = [...productionQueue].sort((a, b) => a.priority - b.priority);

  // Get machine type name
  const getMachineType = (typeId) => {
    const machineTypes = {
      'dtg': 'Direct-to-Garment',
      'dye-sublimation': 'Dye Sublimation',
      'screen-printing': 'Screen Printing',
      'large-format': 'Large Format Printer',
      'vinyl-cutter': 'Vinyl Cutter',
      'heat-press': 'Heat Press',
      'embroidery': 'Embroidery Machine'
    };
    return machineTypes[typeId] || typeId;
  };
  
  return (
    <section className="capacity-management" style={{ padding: '2rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Production Capacity Management</h1>
          <div>
            <button onClick={() => navigate('/schedule')} className="btn" style={{ marginRight: '1rem', backgroundColor: 'var(--secondary)' }}>
              Schedule View
            </button>
            <button onClick={() => navigate('/equipment')} className="btn" style={{ marginRight: '1rem', backgroundColor: 'var(--primary)' }}>
              Equipment Details
            </button>
            <button onClick={() => navigate(-1)} className="btn" style={{ backgroundColor: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
              Back to Dashboard
            </button>
          </div>
        </div>
        
        {/* Capacity Overview */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Capacity Overview</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f8f9fa' }}>
              <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Total Daily Units</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{dailyCapacity}</h3>
            </div>
            
            <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f8f9fa' }}>
              <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Active Machines</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{equipment.filter(m => m.status === 'operational').length} <span style={{ fontSize: '1rem', color: '#666' }}>/ {equipment.length}</span></h3>
            </div>
            
            <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f8f9fa' }}>
              <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Machine Capacity</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{totalMachineCapacity} <span style={{ fontSize: '1rem', color: '#666' }}>units/day</span></h3>
            </div>
            
            <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f8f9fa' }}>
              <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Orders in Queue</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{productionQueue.length}</h3>
            </div>
          </div>
        </div>
        
        {/* Overall Capacity Settings */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Daily Production Capacity</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="daily-capacity" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Maximum Daily Capacity (in production units)
            </label>
            <input
              type="number"
              id="daily-capacity"
              value={dailyCapacity}
              onChange={handleDailyCapacityChange}
              min="1"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ddd', 
                borderRadius: '5px', 
                fontSize: '1rem'
              }}
            />
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
              This represents your maximum production capability in a day with 100% capacity.
            </p>
          </div>
        </div>
        
        {/* Production Machines */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Production Equipment</h2>
            <button 
              onClick={() => setShowAddMachineForm(!showAddMachineForm)} 
              className="btn"
              style={{ backgroundColor: showAddMachineForm ? 'var(--danger)' : 'var(--primary)' }}
            >
              {showAddMachineForm ? 'Cancel' : 'Add Machine'}
            </button>
          </div>
          
          {showAddMachineForm && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ marginBottom: '1rem' }}>Add New Machine</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                <div>
                  <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Machine Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newMachine.name}
                    onChange={handleMachineInputChange}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '1px solid #ddd', 
                      borderRadius: '5px', 
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div>
                  <label htmlFor="type" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Machine Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={newMachine.type}
                    onChange={handleMachineInputChange}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '1px solid #ddd', 
                      borderRadius: '5px', 
                      fontSize: '1rem'
                    }}
                  >
                    <option value="dtg">Direct-to-Garment</option>
                    <option value="dye-sublimation">Dye Sublimation</option>
                    <option value="screen-printing">Screen Printing</option>
                    <option value="large-format">Large Format Printer</option>
                    <option value="vinyl-cutter">Vinyl Cutter</option>
                    <option value="heat-press">Heat Press</option>
                    <option value="embroidery">Embroidery Machine</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="capacityPerHour" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Units Per Hour
                  </label>
                  <input
                    type="number"
                    id="capacityPerHour"
                    name="capacityPerHour"
                    value={newMachine.capacityPerHour}
                    onChange={handleMachineInputChange}
                    min="1"
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '1px solid #ddd', 
                      borderRadius: '5px', 
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div>
                  <label htmlFor="hoursAvailable" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Hours Available Per Day
                  </label>
                  <input
                    type="number"
                    id="hoursAvailable"
                    name="hoursAvailable"
                    value={newMachine.hoursAvailable}
                    onChange={handleMachineInputChange}
                    min="1"
                    max="24"
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '1px solid #ddd', 
                      borderRadius: '5px', 
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
              
              <button 
                onClick={handleAddMachine}
                className="btn"
                style={{ marginTop: '1rem' }}
              >
                Add Machine
              </button>
            </div>
          )}
          
          <div style={{ marginBottom: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Machine</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Hours Available</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Daily Capacity</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Current Load</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Utilization</th>
                </tr>
              </thead>
              <tbody>
                {machineUtilization.map(machine => (
                  <tr key={machine.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.75rem' }}>{machine.name}</td>
                    <td style={{ padding: '0.75rem' }}>{getMachineType(machine.type)}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <select
                        value={machine.status}
                        onChange={(e) => handleMachineStatusChange(machine.id, e.target.value)}
                        style={{ 
                          padding: '0.25rem',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          backgroundColor: 
                            machine.status === 'operational' ? '#d1e7dd' :
                            machine.status === 'maintenance-required' ? '#fff3cd' :
                            machine.status === 'offline' ? '#f8d7da' : '#ffffff'
                        }}
                      >
                        <option value="operational">Operational</option>
                        <option value="maintenance-required">Needs Maintenance</option>
                        <option value="offline">Offline</option>
                      </select>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <input
                        type="number"
                        value={machine.hoursAvailable}
                        onChange={(e) => handleMachineHoursChange(machine.id, e.target.value)}
                        min="0"
                        max="24"
                        style={{ 
                          width: '60px',
                          padding: '0.25rem',
                          border: '1px solid #ddd',
                          borderRadius: '3px'
                        }}
                      />
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {machine.status === 'operational' ? 
                        `${machine.capacityPerHour * machine.hoursAvailable} units` : 
                        'N/A'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {machine.ordersAssigned} orders / {machine.hoursAssigned.toFixed(1)} hrs
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ 
                        width: '100%', 
                        backgroundColor: '#e9ecef', 
                        height: '10px', 
                        borderRadius: '5px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${machine.utilizationPercentage}%`,
                          backgroundColor: 
                            machine.utilizationPercentage > 90 ? '#dc3545' :
                            machine.utilizationPercentage > 75 ? '#ffc107' : '#28a745'
                        }}></div>
                      </div>
                      <span style={{ fontSize: '0.8rem' }}>{machine.utilizationPercentage}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Production Queue */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Production Queue</h2>
          
          <div style={{ marginBottom: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Priority</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Order #</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Client</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Product</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Quantity</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Due Date</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Assigned Machine</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Est. Time</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedQueue.map((order, index) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.75rem' }}>{order.priority}</td>
                    <td style={{ padding: '0.75rem' }}>{order.orderNumber}</td>
                    <td style={{ padding: '0.75rem' }}>{order.client}</td>
                    <td style={{ padding: '0.75rem' }}>{order.product}</td>
                    <td style={{ padding: '0.75rem' }}>{order.quantity} units</td>
                    <td style={{ padding: '0.75rem' }}>{order.dueDate}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <select
                        value={order.machineId}
                        onChange={(e) => handleAssignMachine(order.id, parseInt(e.target.value, 10))}
                        style={{ 
                          padding: '0.25rem',
                          border: '1px solid #ddd',
                          borderRadius: '3px'
                        }}
                      >
                        {equipment.map(machine => (
                          <option 
                            key={machine.id} 
                            value={machine.id}
                            disabled={machine.status !== 'operational'}
                          >
                            {machine.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{order.estimatedCompletionTime.toFixed(1)} hrs</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem',
                        borderRadius: '3px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        backgroundColor: 
                          order.status === 'in-progress' ? '#cfe2ff' :
                          order.status === 'in-queue' ? '#fff3cd' : '#d1e7dd',
                        color: 
                          order.status === 'in-progress' ? '#084298' :
                          order.status === 'in-queue' ? '#664d03' : '#0f5132'
                      }}>
                        {order.status === 'in-progress' ? 'In Progress' :
                         order.status === 'in-queue' ? 'In Queue' : 'Completed'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleMoveUp(order.id)}
                          disabled={index === 0}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: index === 0 ? '#e9ecef' : 'var(--primary)',
                            color: index === 0 ? '#6c757d' : 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: index === 0 ? 'not-allowed' : 'pointer'
                          }}
                        >
                          ↑
                        </button>
                        <button 
                          onClick={() => handleMoveDown(order.id)}
                          disabled={index === sortedQueue.length - 1}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: index === sortedQueue.length - 1 ? '#e9ecef' : 'var(--primary)',
                            color: index === sortedQueue.length - 1 ? '#6c757d' : 'white',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: index === sortedQueue.length - 1 ? 'not-allowed' : 'pointer'
                          }}
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Weekly Availability */}
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Weekly Availability</h2>
            <div style={{ marginBottom: '1rem' }}>
              <p>Set your weekly capacity and availability for each day.</p>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd', background: '#f8f9fa' }}>Day</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd', background: '#f8f9fa' }}>Available</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd', background: '#f8f9fa' }}>Capacity %</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd', background: '#f8f9fa' }}>Units Available</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(capacitySettings).map(([day, settings]) => (
                  <tr key={day}>
                    <td style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                      <input
                        type="checkbox"
                        checked={settings.available}
                        onChange={(e) => handleCapacityChange(day, 'available', e.target.checked)}
                        style={{ width: 'auto' }}
                      />
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.percentage}
                        onChange={(e) => handleCapacityChange(day, 'percentage', e.target.value)}
                        disabled={!settings.available}
                        style={{ width: '100%' }}
                      />
                      <span>{settings.percentage}%</span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                      {settings.available ? Math.round((settings.percentage / 100) * dailyCapacity) : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button type="submit" className="btn" style={{ marginTop: '1rem' }}>
              Save Capacity Settings
            </button>
          </div>
        </form>
        
        {/* Product Type Capacities */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Product Type Capacities</h2>
          <p style={{ marginBottom: '1rem' }}>
            Based on your equipment and settings, here's your estimated capacity for different product types:
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {Object.entries(capacityBySupportedProducts).map(([productName, capacity]) => (
              <div key={productName} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{productName}</h3>
                <p style={{ color: '#666' }}>Daily Capacity: <strong>{capacity} units</strong></p>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#e9ecef', 
                  borderRadius: '4px',
                  marginTop: '0.5rem',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${Math.min(100, (capacity / dailyCapacity) * 100)}%`,
                    backgroundColor: 'var(--primary)'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Need More Detailed Scheduling?</h2>
          <p style={{ marginBottom: '1rem' }}>
            If you need to set specific capacity for individual dates or manage your production schedule in more detail,
            use our advanced scheduling tool.
          </p>
          <button 
            onClick={() => navigate('/schedule')} 
            className="btn" 
            style={{ backgroundColor: 'var(--secondary)' }}
          >
            Advanced Schedule Management
          </button>
        </div>
      </div>
    </section>
  );
};

export default CapacityManagement;