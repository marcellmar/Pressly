import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, Cell, AreaChart, Area
} from 'recharts';
import { 
  ChevronDown, ChevronUp, Calendar, TrendingUp, 
  TrendingDown, Award, Truck, CheckCircle, 
  Droplet, DollarSign, Clock, Users, Filter,
  Download, Printer, Activity, Repeat, PieChart as PieChartIcon
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const ProducerAnalytics = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('30d');
  const [compareWith, setCompareWith] = useState('lastPeriod');
  const [showExplanations, setShowExplanations] = useState(false);
  
  // Mock data for the charts
  const monthlyRevenueData = [
    { name: 'Jan', current: 12000, previous: 10500 },
    { name: 'Feb', current: 14000, previous: 11200 },
    { name: 'Mar', current: 13500, previous: 12400 },
    { name: 'Apr', current: 15000, previous: 13000 },
    { name: 'May', current: 16200, previous: 13800 },
    { name: 'Jun', current: 18000, previous: 14500 },
    { name: 'Jul', current: 17500, previous: 16000 },
    { name: 'Aug', current: 19200, previous: 17400 },
    { name: 'Sep', current: 21000, previous: 18500 },
    { name: 'Oct', current: 22500, previous: 19700 },
    { name: 'Nov', current: 24000, previous: 21000 },
    { name: 'Dec', current: 26500, previous: 22800 }
  ];

  const ordersByProductData = [
    { name: 'T-Shirts', value: 3450 },
    { name: 'Posters', value: 2100 },
    { name: 'Business Cards', value: 1850 },
    { name: 'Banners', value: 1200 },
    { name: 'Hoodies', value: 950 }
  ];

  const customerRetentionData = [
    { name: 'New', value: 35 },
    { name: 'Returning', value: 65 }
  ];

  const materialUsageData = [
    { name: 'Recycled Paper', value: 25 },
    { name: 'Sustainable Fabric', value: 30 },
    { name: 'Eco-Friendly Ink', value: 20 },
    { name: 'Standard Materials', value: 25 }
  ];

  const weeklyOrderData = [
    { day: 'Mon', orders: 58 },
    { day: 'Tue', orders: 42 },
    { day: 'Wed', orders: 65 },
    { day: 'Thu', orders: 78 },
    { day: 'Fri', orders: 95 },
    { day: 'Sat', orders: 48 },
    { day: 'Sun', orders: 35 }
  ];

  const hourlyActivityData = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const baseActivity = i >= 9 && i <= 17 ? 50 + Math.random() * 50 : 10 + Math.random() * 30;
    return {
      hour: `${hour}:00`,
      activity: Math.floor(baseActivity)
    };
  });

  const deliveryPerformanceData = [
    { name: 'Early', value: 28 },
    { name: 'On Time', value: 64 },
    { name: 'Late', value: 8 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#4CAF50'];
  const DELIVERY_COLORS = ['#4CAF50', '#2196F3', '#F44336'];

  // Performance metrics
  const metrics = {
    customerSatisfaction: 4.8,
    customerSatisfactionTrend: 0.3,
    onTimeDelivery: 92,
    onTimeDeliveryTrend: 4,
    qualityAssurance: 98,
    qualityAssuranceTrend: 2,
    sustainabilityScore: 87,
    sustainabilityScoreTrend: 5,
    orderGrowth: 12,
    orderGrowthTrend: 3
  };

  const detailedMetrics = {
    totalOrders: 1243,
    totalOrdersGrowth: 16,
    averageOrderValue: 285,
    averageOrderValueGrowth: 7,
    returnRate: 2.5,
    returnRateChange: -0.5,
    topDesigners: [
      { name: 'Creative Studios', orders: 125 },
      { name: 'Modern Design Co', orders: 98 },
      { name: 'Artisan Collective', orders: 87 },
      { name: 'Minimalist Design', orders: 63 },
      { name: 'The Design Lab', orders: 52 }
    ],
    capacityUtilization: 78,
    capacityUtilizationTrend: 12,
    materialWaste: 3.2,
    materialWasteTrend: -1.8,
    energyUsage: {
      current: 3450,
      previous: 3800,
      unit: 'kWh'
    },
    carbonFootprint: {
      current: 12.5,
      previous: 14.2,
      unit: 'tons'
    }
  };

  const renderTrendIcon = (value) => {
    if (value > 0) {
      return <TrendingUp className="text-green-500 h-4 w-4" />;
    } else if (value < 0) {
      return <TrendingDown className="text-red-500 h-4 w-4" />;
    }
    return null;
  };

  const formatTrendValue = (value, isInverse = false) => {
    const formattedValue = Math.abs(value).toFixed(1);
    
    if (isInverse) {
      // For metrics where a decrease is positive (like return rate, waste)
      if (value < 0) {
        return <span className="text-green-500">-{formattedValue}%</span>;
      } else if (value > 0) {
        return <span className="text-red-500">+{formattedValue}%</span>;
      }
    } else {
      // For standard metrics where an increase is positive
      if (value > 0) {
        return <span className="text-green-500">+{formattedValue}%</span>;
      } else if (value < 0) {
        return <span className="text-red-500">-{formattedValue}%</span>;
      }
    }
    
    return <span className="text-gray-500">0%</span>;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Producer Analytics Dashboard</h1>
          <p className="text-gray-500">Comprehensive view of your business performance</p>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last 12 months</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Repeat className="h-5 w-5 text-gray-400" />
            <Select value={compareWith} onValueChange={setCompareWith}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Compare with" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastPeriod">Previous period</SelectItem>
                <SelectItem value="lastYear">Last year</SelectItem>
                <SelectItem value="targetGoals">Target goals</SelectItem>
                <SelectItem value="industryAvg">Industry average</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={() => setShowExplanations(!showExplanations)}>
            {showExplanations ? 'Hide' : 'Show'} Explanations
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Customer Satisfaction</p>
                <div className="flex items-baseline mt-1">
                  <p className="text-2xl font-bold">{metrics.customerSatisfaction}/5.0</p>
                  <span className="ml-2 flex items-center">
                    {renderTrendIcon(metrics.customerSatisfactionTrend)}
                    {formatTrendValue(metrics.customerSatisfactionTrend)}
                  </span>
                </div>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
            {showExplanations && (
              <p className="mt-2 text-xs text-gray-500">
                Average rating from customer reviews and feedback surveys.
              </p>
            )}
            <div className="mt-2 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(metrics.customerSatisfaction / 5) * 100}%` }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">On-Time Delivery</p>
                <div className="flex items-baseline mt-1">
                  <p className="text-2xl font-bold">{metrics.onTimeDelivery}%</p>
                  <span className="ml-2 flex items-center">
                    {renderTrendIcon(metrics.onTimeDeliveryTrend)}
                    {formatTrendValue(metrics.onTimeDeliveryTrend)}
                  </span>
                </div>
              </div>
              <Truck className="h-8 w-8 text-blue-500" />
            </div>
            {showExplanations && (
              <p className="mt-2 text-xs text-gray-500">
                Percentage of orders delivered on or before the committed date.
              </p>
            )}
            <div className="mt-2 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${metrics.onTimeDelivery}%` }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Quality Assurance</p>
                <div className="flex items-baseline mt-1">
                  <p className="text-2xl font-bold">{metrics.qualityAssurance}%</p>
                  <span className="ml-2 flex items-center">
                    {renderTrendIcon(metrics.qualityAssuranceTrend)}
                    {formatTrendValue(metrics.qualityAssuranceTrend)}
                  </span>
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
            {showExplanations && (
              <p className="mt-2 text-xs text-gray-500">
                Percentage of orders that passed quality inspections without defects.
              </p>
            )}
            <div className="mt-2 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${metrics.qualityAssurance}%` }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Sustainability Score</p>
                <div className="flex items-baseline mt-1">
                  <p className="text-2xl font-bold">{metrics.sustainabilityScore}%</p>
                  <span className="ml-2 flex items-center">
                    {renderTrendIcon(metrics.sustainabilityScoreTrend)}
                    {formatTrendValue(metrics.sustainabilityScoreTrend)}
                  </span>
                </div>
              </div>
              <Droplet className="h-8 w-8 text-green-500" />
            </div>
            {showExplanations && (
              <p className="mt-2 text-xs text-gray-500">
                Calculated based on eco-friendly materials, waste reduction, and energy efficiency.
              </p>
            )}
            <div className="mt-2 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${metrics.sustainabilityScore}%` }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Order Growth</p>
                <div className="flex items-baseline mt-1">
                  <p className="text-2xl font-bold">{metrics.orderGrowth}%</p>
                  <span className="ml-2 flex items-center">
                    {renderTrendIcon(metrics.orderGrowthTrend)}
                    {formatTrendValue(metrics.orderGrowthTrend)}
                  </span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-500" />
            </div>
            {showExplanations && (
              <p className="mt-2 text-xs text-gray-500">
                Monthly growth rate in total order volume compared to previous month.
              </p>
            )}
            <div className="mt-2 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${metrics.orderGrowth * 2.5}%` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Monthly revenue compared to the previous period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyRevenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke="#0088FE"
                    strokeWidth={3}
                    name="Current Period"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="previous"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Previous Period"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders by Product Type</CardTitle>
            <CardDescription>Distribution of sales across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ordersByProductData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ordersByProductData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <div className="flex items-baseline mt-1">
                  <p className="text-2xl font-bold">{detailedMetrics.totalOrders}</p>
                  <span className="ml-2 flex items-center">
                    {renderTrendIcon(detailedMetrics.totalOrdersGrowth)}
                    {formatTrendValue(detailedMetrics.totalOrdersGrowth)}
                  </span>
                </div>
              </div>
              <Printer className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Order Value</p>
                <div className="flex items-baseline mt-1">
                  <p className="text-2xl font-bold">${detailedMetrics.averageOrderValue}</p>
                  <span className="ml-2 flex items-center">
                    {renderTrendIcon(detailedMetrics.averageOrderValueGrowth)}
                    {formatTrendValue(detailedMetrics.averageOrderValueGrowth)}
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Return Rate</p>
                <div className="flex items-baseline mt-1">
                  <p className="text-2xl font-bold">{detailedMetrics.returnRate}%</p>
                  <span className="ml-2 flex items-center">
                    {renderTrendIcon(-detailedMetrics.returnRateChange)}
                    {formatTrendValue(detailedMetrics.returnRateChange, true)}
                  </span>
                </div>
              </div>
              <Repeat className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Capacity Utilization</p>
                <div className="flex items-baseline mt-1">
                  <p className="text-2xl font-bold">{detailedMetrics.capacityUtilization}%</p>
                  <span className="ml-2 flex items-center">
                    {renderTrendIcon(detailedMetrics.capacityUtilizationTrend)}
                    {formatTrendValue(detailedMetrics.capacityUtilizationTrend)}
                  </span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Additional Insights */}
      <Tabs defaultValue="operational">
        <TabsList className="mb-6">
          <TabsTrigger value="operational">Operational Insights</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability Metrics</TabsTrigger>
        </TabsList>

        {/* Operational Insights Tab */}
        <TabsContent value="operational">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders by Day of Week</CardTitle>
                <CardDescription>Distribution of orders across weekdays</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weeklyOrderData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hourly Activity</CardTitle>
                <CardDescription>Order and production activity by hour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={hourlyActivityData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="activity"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
                <CardDescription>Breakdown of delivery timing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deliveryPerformanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deliveryPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={DELIVERY_COLORS[index % DELIVERY_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Designers by Order Volume</CardTitle>
              <CardDescription>Clients generating the most business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium p-2">Designer</th>
                      <th className="text-left font-medium p-2">Orders</th>
                      <th className="text-left font-medium p-2">% of Total</th>
                      <th className="text-left font-medium p-2">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedMetrics.topDesigners.map((designer, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{designer.name}</td>
                        <td className="p-2">{designer.orders}</td>
                        <td className="p-2">{(designer.orders / detailedMetrics.totalOrders * 100).toFixed(1)}%</td>
                        <td className="p-2">
                          <TrendingUp className="text-green-500 h-4 w-4 inline-block" />
                          <span className="text-green-500 ml-1">+{Math.floor(Math.random() * 15 + 5)}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Insights Tab */}
        <TabsContent value="customers">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Retention</CardTitle>
                <CardDescription>New vs. returning customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerRetentionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#0088FE" />
                        <Cell fill="#00C49F" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction by Category</CardTitle>
                <CardDescription>Ratings across different service aspects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Print Quality', score: 4.9 },
                        { name: 'Delivery Speed', score: 4.6 },
                        { name: 'Customer Service', score: 4.8 },
                        { name: 'Value for Money', score: 4.5 },
                        { name: 'Product Selection', score: 4.7 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 5]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="score" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Customer Feedback</CardTitle>
              <CardDescription>Latest reviews and comments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center text-blue-600 font-bold">MS</div>
                      <div className="ml-3">
                        <p className="font-medium">Modern Studios</p>
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z"/>
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">2 days ago</span>
                  </div>
                  <p className="mt-3 text-gray-700">
                    "The quality of the business cards exceeded our expectations. The colors are vibrant and the paper stock feels premium. Delivered ahead of schedule!"
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center text-purple-600 font-bold">AC</div>
                      <div className="ml-3">
                        <p className="font-medium">Artisan Collective</p>
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z"/>
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">1 week ago</span>
                  </div>
                  <p className="mt-3 text-gray-700">
                    "Great experience overall. The eco-friendly materials were important to us and the team was knowledgeable about sustainable options. Would have liked faster turnaround time."
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full w-10 h-10 flex items-center justify-center text-green-600 font-bold">MD</div>
                      <div className="ml-3">
                        <p className="font-medium">Minimalist Design</p>
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z"/>
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">2 weeks ago</span>
                  </div>
                  <p className="mt-3 text-gray-700">
                    "Exceptional service from start to finish. The team provided helpful suggestions to improve our designs, and the final posters were stunning. Highly recommend!"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sustainability Metrics Tab */}
        <TabsContent value="sustainability">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Material Usage</CardTitle>
                <CardDescription>Distribution of sustainable vs. standard materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={materialUsageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {materialUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sustainability Improvements</CardTitle>
                <CardDescription>Year-over-year progress on key metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Material Waste', current: detailedMetrics.materialWaste, previous: detailedMetrics.materialWaste + Math.abs(detailedMetrics.materialWasteTrend) },
                        { name: 'Water Usage', current: 2.8, previous: 3.5 },
                        { name: 'Carbon Footprint', current: detailedMetrics.carbonFootprint.current, previous: detailedMetrics.carbonFootprint.previous },
                        { name: 'Energy Usage', current: detailedMetrics.energyUsage.current, previous: detailedMetrics.energyUsage.previous, adjusted: true }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name, props) => {
                          if (props.dataKey === 'previous') return ['Previous Year', value];
                          if (props.dataKey === 'current') return ['Current Year', value];
                          return [name, value];
                        }}
                      />
                      <Legend />
                      <Bar dataKey="previous" fill="#8884d8" name="Previous Year" />
                      <Bar dataKey="current" fill="#82ca9d" name="Current Year" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sustainability Certification Progress</CardTitle>
              <CardDescription>Status of key sustainability initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">FSC Certification</span>
                    <span className="text-green-600 font-medium">Complete</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Carbon Neutral Operations</span>
                    <span className="text-blue-600 font-medium">75% Complete</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Zero Waste to Landfill</span>
                    <span className="text-blue-600 font-medium">60% Complete</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">100% Renewable Energy</span>
                    <span className="text-blue-600 font-medium">40% Complete</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Sustainable Supply Chain</span>
                    <span className="text-amber-600 font-medium">In Progress</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recommendations Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recommendations & Insights</CardTitle>
          <CardDescription>Data-driven suggestions to improve your performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
              <h4 className="font-medium text-green-800">Opportunity: Expand T-Shirt Production</h4>
              <p className="text-green-700 mt-1">
                T-shirts account for 35% of your orders. Consider adding additional production capacity to meet growing demand and reduce lead times.
              </p>
            </div>
            
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded">
              <h4 className="font-medium text-yellow-800">Attention: Friday Order Spike</h4>
              <p className="text-yellow-700 mt-1">
                Order volume is 40% higher on Fridays. Adjust staffing and production schedules to accommodate this pattern and maintain delivery performance.
              </p>
            </div>
            
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
              <h4 className="font-medium text-blue-800">Insight: Customer Retention</h4>
              <p className="text-blue-700 mt-1">
                65% of your business comes from returning customers. Focus on loyalty programs and special offers to encourage repeat orders.
              </p>
            </div>
            
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded">
              <h4 className="font-medium text-purple-800">Sustainability: Material Usage</h4>
              <p className="text-purple-700 mt-1">
                Your sustainability score has improved by 5% this quarter, largely due to increased use of recycled paper. Continue to expand eco-friendly material options.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Business Forecast</CardTitle>
          <CardDescription>Projected performance for next 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <p className="text-gray-500 mb-1">Projected Revenue</p>
              <p className="text-2xl font-bold">$28,500</p>
              <p className="text-green-500 text-sm">+8% vs. last month</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Printer className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <p className="text-gray-500 mb-1">Projected Orders</p>
              <p className="text-2xl font-bold">325</p>
              <p className="text-green-500 text-sm">+12% vs. last month</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <p className="text-gray-500 mb-1">New Designers</p>
              <p className="text-2xl font-bold">18</p>
              <p className="text-green-500 text-sm">+5% vs. last month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProducerAnalytics;