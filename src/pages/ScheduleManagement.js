import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';

// Define a basic calendar component since we don't have a calendar library installed
const Calendar = ({ selectedDate, onSelectDate, capacityData }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek;
    
    // Calculate total days needed in the calendar (max 6 rows of 7 days)
    const totalDays = Math.ceil((daysInMonth + daysFromPrevMonth) / 7) * 7;
    
    const days = [];
    
    // Previous month's days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      days.push({
        date,
        isCurrentMonth: false,
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0))
      });
    }
    
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0))
      });
    }
    
    // Next month's days
    const remainingDays = totalDays - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isPast: false
      });
    }
    
    setCalendarDays(days);
  }, [currentMonth]);
  
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  const isSelectedDate = (date) => {
    return (
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };
  
  const getCapacityForDate = (date) => {
    if (!capacityData) return null;
    
    const dateString = date.toISOString().split('T')[0];
    return capacityData[dateString] || null;
  };
  
  return (
    <div className="calendar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button onClick={goToPreviousMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
          &lt;
        </button>
        <h3>
          {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
        </h3>
        <button onClick={goToNextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
          &gt;
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', padding: '0.5rem' }}>
            {day}
          </div>
        ))}
        
        {calendarDays.map((dayInfo, index) => {
          const { date, isCurrentMonth, isPast } = dayInfo;
          const capacity = getCapacityForDate(date);
          
          return (
            <div
              key={index}
              onClick={() => !isPast && onSelectDate(date)}
              style={{
                padding: '0.5rem',
                textAlign: 'center',
                backgroundColor: isSelectedDate(date) 
                  ? 'var(--primary)' 
                  : isCurrentMonth ? 'white' : '#f9f9f9',
                color: isSelectedDate(date) 
                  ? 'white' 
                  : isPast 
                    ? '#ccc' 
                    : isCurrentMonth ? '#333' : '#999',
                cursor: isPast ? 'not-allowed' : 'pointer',
                borderRadius: '5px',
                position: 'relative',
                minHeight: '100px',
                border: '1px solid #eee'
              }}
            >
              <div style={{ marginBottom: '0.5rem' }}>{date.getDate()}</div>
              {capacity && (
                <div 
                  style={{ 
                    position: 'absolute', 
                    bottom: '0', 
                    left: '0', 
                    width: '100%', 
                    height: `${capacity}%`,
                    backgroundColor: isSelectedDate(date) ? 'rgba(255,255,255,0.3)' : 'rgba(58, 110, 165, 0.2)',
                    borderRadius: '0 0 5px 5px'
                  }}
                ></div>
              )}
              {capacity !== null && (
                <div style={{ position: 'relative', zIndex: 1, fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {capacity}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ScheduleManagement = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, loading } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [capacityData, setCapacityData] = useState({});
  const [currentCapacity, setCurrentCapacity] = useState(80);
  const [orders, setOrders] = useState([]);
  
  // Sample data - in a real app, this would come from your backend
  useEffect(() => {
    // Sample capacity data
    const sampleCapacityData = {};
    const today = new Date();
    
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      // Generate random capacity between 20% and 90%
      const capacity = Math.floor(Math.random() * 70) + 20;
      sampleCapacityData[dateString] = capacity;
    }
    
    setCapacityData(sampleCapacityData);
    
    // Sample orders for the selected date
    setOrders([
      {
        id: '12345',
        designer: 'Sarah Johnson',
        project: 'Summer T-Shirt Design',
        units: 30,
        status: 'Scheduled'
      },
      {
        id: '12346',
        designer: 'Michael Chen',
        project: 'Business Cards',
        units: 15,
        status: 'Confirmed'
      }
    ]);
  }, []);
  
  // Update orders when selected date changes
  useEffect(() => {
    // In a real app, you would fetch orders for the selected date from your backend
    const dateString = selectedDate.toISOString().split('T')[0];
    const capacity = capacityData[dateString] || 80;
    setCurrentCapacity(capacity);
    
    // For the demo, we're just setting the same orders
  }, [selectedDate, capacityData]);
  
  // Redirect if user is not authenticated or not a producer
  useEffect(() => {
    if (!loading && (!isAuthenticated || currentUser?.role !== 'producer')) {
      navigate('/login');
    }
  }, [isAuthenticated, currentUser, loading, navigate]);
  
  const handleCapacityChange = (e) => {
    const capacity = parseInt(e.target.value, 10);
    setCurrentCapacity(capacity);
    
    // Update capacity data for the selected date
    const dateString = selectedDate.toISOString().split('T')[0];
    setCapacityData(prev => ({
      ...prev,
      [dateString]: capacity
    }));
  };
  
  const handleSaveCapacity = () => {
    // Here you would send the capacity data to your backend
    console.log('Saving capacity data:', capacityData);
    alert('Schedule updated successfully!');
  };
  
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <section className="schedule-management" style={{ padding: '2rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Schedule Management</h1>
          <button onClick={() => navigate(-1)} className="btn" style={{ backgroundColor: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
            Back to Dashboard
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Production Calendar</h2>
            <p style={{ marginBottom: '1rem' }}>
              Click on a date to view and set specific capacity. Past dates cannot be modified.
            </p>
            
            <Calendar 
              selectedDate={selectedDate} 
              onSelectDate={setSelectedDate} 
              capacityData={capacityData}
            />
            
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button onClick={handleSaveCapacity} className="btn">
                Save Schedule
              </button>
            </div>
          </div>
          
          <div>
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>
                {formatDate(selectedDate)}
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="day-capacity" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Available Capacity
                </label>
                <input
                  type="range"
                  id="day-capacity"
                  min="0"
                  max="100"
                  value={currentCapacity}
                  onChange={handleCapacityChange}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>0%</span>
                  <span style={{ fontWeight: 'bold' }}>{currentCapacity}%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div style={{ marginTop: '1rem' }}>
                <div style={{ height: '20px', backgroundColor: '#e9ecef', borderRadius: '5px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                  <div style={{ height: '100%', width: `${currentCapacity}%`, backgroundColor: 'var(--primary)' }}></div>
                </div>
                <p>
                  <strong>{currentCapacity}%</strong> capacity available on this day.
                </p>
              </div>
            </div>
            
            <div className="card" style={{ padding: '1.5rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>Scheduled Orders</h2>
              
              {orders.length > 0 ? (
                orders.map(order => (
                  <div key={order.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>#{order.id}</strong>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '3px', 
                        backgroundColor: order.status === 'Scheduled' ? '#17a2b8' : '#28a745', 
                        color: 'white',
                        fontSize: '0.85rem'
                      }}>
                        {order.status}
                      </span>
                    </div>
                    <div>{order.project}</div>
                    <div style={{ color: '#666' }}>Designer: {order.designer}</div>
                    <div>Units: {order.units}</div>
                  </div>
                ))
              ) : (
                <p>No orders scheduled for this date.</p>
              )}
              
              <button 
                className="btn" 
                style={{ marginTop: '1rem', width: '100%', backgroundColor: 'var(--secondary)' }}
              >
                Add Order to Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleManagement;