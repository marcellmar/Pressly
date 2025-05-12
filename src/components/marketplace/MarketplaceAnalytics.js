import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

/**
 * MarketplaceAnalytics component for displaying marketplace statistics and trends
 */
const MarketplaceAnalytics = ({ data, period = 'month' }) => {
  const [activeTab, setActiveTab] = useState('activity');
  
  // Sample data for marketplace analytics
  const [analyticsData, setAnalyticsData] = useState({
    activity: [],
    connections: [],
    growth: [],
    distribution: []
  });
  
  // Load analytics data on mount and when period changes
  useEffect(() => {
    // If data prop is provided, use it directly
    if (data) {
      setAnalyticsData(data);
      return;
    }
    
    // Otherwise use sample data
    const generateSampleData = () => {
      // Activity data - connections made over time
      const activity = [];
      const connectionsData = [];
      const growthData = [];
      
      // Create sample data based on period
      const periods = period === 'week' ? 7 : period === 'month' ? 30 : 12;
      const periodLabels = period === 'week' ? 
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : 
        period === 'month' ? 
          Array.from({ length: 30 }, (_, i) => `Day ${i+1}`) : 
          ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Activity data
      for (let i = 0; i < periods; i++) {
        activity.push({
          name: periodLabels[i],
          designers: Math.floor(Math.random() * 20) + 5,
          producers: Math.floor(Math.random() * 15) + 2,
          connections: Math.floor(Math.random() * 10) + 1
        });
      }
      
      // Connections data (network growth)
      for (let i = 0; i < periods; i++) {
        connectionsData.push({
          name: periodLabels[i],
          requests: Math.floor(Math.random() * 30) + 10,
          matches: Math.floor(Math.random() * 20) + 5,
          completed: Math.floor(Math.random() * 15) + 2
        });
      }
      
      // Growth data (cumulative)
      let designers = 120;
      let producers = 45;
      for (let i = 0; i < periods; i++) {
        designers += Math.floor(Math.random() * 10) - 2;
        producers += Math.floor(Math.random() * 5) - 1;
        growthData.push({
          name: periodLabels[i],
          designers,
          producers
        });
      }
      
      // Distribution data (pie chart)
      const distributionData = [
        { name: 'Chicago', value: 35 },
        { name: 'New York', value: 20 },
        { name: 'Los Angeles', value: 15 },
        { name: 'Austin', value: 10 },
        { name: 'Other', value: 20 }
      ];
      
      setAnalyticsData({
        activity,
        connections: connectionsData,
        growth: growthData,
        distribution: distributionData
      });
    };
    
    generateSampleData();
  }, [data, period]);

  // Colors for charts
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Marketplace Analytics</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={analyticsData.activity}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="designers" name="Designers" fill="#8b5cf6" />
              <Bar dataKey="producers" name="Producers" fill="#3b82f6" />
              <Bar dataKey="connections" name="Connections" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="connections" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={analyticsData.connections}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="requests" name="Requests" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="matches" name="Matches" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="growth" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={analyticsData.growth}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="designers" name="Designers" stroke="#8b5cf6" fill="#8b5cf680" />
              <Area type="monotone" dataKey="producers" name="Producers" stroke="#3b82f6" fill="#3b82f680" />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="distribution" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analyticsData.distribution}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {analyticsData.distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketplaceAnalytics;
