import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  PlusCircle, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Star,
  Mail,
  MapPin,
  Printer,
  BarChart,
  LineChart,
  Activity,
  ShoppingBag,
  Eye,
  DollarSign,
  Calendar,
  ThumbsUp,
  MessageSquare,
  TrendingDown,
  ArrowLeft
} from 'lucide-react';

const DesignerAnalytics = () => {
  const { currentUser } = useAuth();
  
  // Design Performance Data
  const [bestSellingDesigns, setBestSellingDesigns] = useState([
    {
      id: 1,
      name: 'Summer T-Shirt Collection',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=150&h=150&fit=crop',
      orderCount: 32,
      revenue: 1280,
      growth: 15,
      category: 'Apparel'
    },
    {
      id: 2,
      name: 'Company Logo Stickers',
      image: 'https://images.unsplash.com/photo-1535615615570-11bb76192482?w=150&h=150&fit=crop',
      orderCount: 28,
      revenue: 840,
      growth: 8,
      category: 'Stickers'
    },
    {
      id: 3,
      name: 'Custom Event Posters',
      image: 'https://images.unsplash.com/photo-1509225770129-fbcf8a696c0b?w=150&h=150&fit=crop',
      orderCount: 24,
      revenue: 960,
      growth: 12,
      category: 'Posters'
    },
    {
      id: 4,
      name: 'Business Card Design',
      image: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=150&h=150&fit=crop',
      orderCount: 15,
      revenue: 750,
      growth: -3,
      category: 'Business Cards'
    }
  ]);

  // Design Conversion Rates
  const [conversionRates, setConversionRates] = useState([
    { designId: 1, designName: 'Summer T-Shirt Collection', views: 560, orders: 32, rate: 5.7 },
    { designId: 2, designName: 'Company Logo Stickers', views: 420, orders: 28, rate: 6.7 },
    { designId: 3, designName: 'Custom Event Posters', views: 380, orders: 24, rate: 6.3 },
    { designId: 4, designName: 'Business Card Design', views: 290, orders: 15, rate: 5.2 },
    { designId: 5, designName: 'Custom Hoodies', views: 210, orders: 10, rate: 4.8 }
  ]);

  // Customer Ratings
  const [designRatings, setDesignRatings] = useState([
    { 
      designId: 1, 
      designName: 'Summer T-Shirt Collection', 
      averageRating: 4.8,
      totalReviews: 24,
      ratingBreakdown: { 5: 18, 4: 5, 3: 1, 2: 0, 1: 0 },
      recentFeedback: [
        { rating: 5, comment: "Love the quality and design. Perfect for our company event!" },
        { rating: 4, comment: "Great design, but sizing runs a bit small." }
      ]
    },
    { 
      designId: 2, 
      designName: 'Company Logo Stickers', 
      averageRating: 4.6,
      totalReviews: 15,
      ratingBreakdown: { 5: 10, 4: 4, 3: 1, 2: 0, 1: 0 },
      recentFeedback: [
        { rating: 5, comment: "Perfect stickers! The colors are vibrant and they stick well." },
        { rating: 4, comment: "Good quality, but would prefer slightly larger size options." }
      ]
    }
  ]);

  // Monthly Performance Data
  const [monthlyData, setMonthlyData] = useState({
    months: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    orders: [8, 12, 15, 22, 18, 25],
    revenue: [320, 480, 600, 880, 720, 1000],
    views: [180, 220, 260, 350, 320, 410]
  });

  // Market Trends Data
  const [marketTrends, setMarketTrends] = useState({
    trendingCategories: [
      { name: 'Eco-Friendly Apparel', growth: 28, isRising: true },
      { name: 'Custom Tote Bags', growth: 22, isRising: true },
      { name: 'Branded Face Masks', growth: -5, isRising: false },
      { name: 'Minimalist Business Cards', growth: 15, isRising: true },
      { name: 'Digital Gift Cards', growth: 32, isRising: true }
    ],
    seasonalDemand: [
      { season: 'Spring', topProducts: ['T-Shirts', 'Tote Bags', 'Event Banners'] },
      { season: 'Summer', topProducts: ['Tank Tops', 'Beach Towels', 'Outdoor Signage'] },
      { season: 'Fall', topProducts: ['Hoodies', 'Promotional Items', 'Business Cards'] },
      { season: 'Winter', topProducts: ['Holiday Cards', 'Custom Gifts', 'Calendars'] },
      { season: 'Year-Round', topProducts: ['Stickers', 'Business Essentials', 'Branded Items'] }
    ],
    currentSeason: 'Spring'
  });

  // Time period selector state
  const [timePeriod, setTimePeriod] = useState('month');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/dashboard" className="mr-3">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Designer Analytics</h1>
        </div>
        
        <div className="flex">
          <Button 
            variant={timePeriod === 'week' ? 'default' : 'outline'} 
            className="text-xs mr-1"
            onClick={() => setTimePeriod('week')}
          >
            Week
          </Button>
          <Button 
            variant={timePeriod === 'month' ? 'default' : 'outline'} 
            className="text-xs mr-1"
            onClick={() => setTimePeriod('month')}
          >
            Month
          </Button>
          <Button 
            variant={timePeriod === 'year' ? 'default' : 'outline'} 
            className="text-xs"
            onClick={() => setTimePeriod('year')}
          >
            Year
          </Button>
        </div>
      </div>
      
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <h3 className="text-3xl font-bold mt-1">{monthlyData.orders.reduce((a, b) => a + b, 0)}</h3>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +18% from last {timePeriod}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-3xl font-bold mt-1">${monthlyData.revenue.reduce((a, b) => a + b, 0)}</h3>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +22% from last {timePeriod}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Design Views</p>
                <h3 className="text-3xl font-bold mt-1">{monthlyData.views.reduce((a, b) => a + b, 0)}</h3>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +15% from last {timePeriod}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                <h3 className="text-3xl font-bold mt-1">6.1%</h3>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +0.8% from last {timePeriod}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>
            Track how your designs are performing over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Orders Chart */}
            <div>
              <h3 className="text-lg font-medium mb-4">Orders & Revenue Growth</h3>
              <div className="h-64 relative">
                {/* Simplified chart visualization using CSS */}
                <div className="absolute inset-0 flex items-end">
                  {monthlyData.months.map((month, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="relative w-full h-full flex flex-col items-center justify-end">
                        <div 
                          className="w-4/5 bg-blue-500 rounded-t"
                          style={{ height: `${(monthlyData.orders[index] / Math.max(...monthlyData.orders)) * 100}%` }}
                        ></div>
                        <div 
                          className="w-4/5 bg-green-500 rounded-t absolute bottom-0 left-0 right-0 mx-auto"
                          style={{ 
                            height: `${(monthlyData.revenue[index] / Math.max(...monthlyData.revenue)) * 100 * 0.28}%`,
                            width: '60%' 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{month}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center mt-2">
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
                  <span className="text-xs text-gray-600">Orders</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
                  <span className="text-xs text-gray-600">Revenue ($)</span>
                </div>
              </div>
              <div className="text-center mt-2">
                <span className="text-sm font-medium text-gray-700">
                  <TrendingUp className="inline h-4 w-4 text-green-500 mr-1" />
                  38% increase in orders compared to last {timePeriod}
                </span>
              </div>
            </div>

            {/* Views & Conversion Chart */}
            <div>
              <h3 className="text-lg font-medium mb-4">Views & Conversion Rate</h3>
              <div className="h-64 relative">
                {/* Simplified chart visualization using CSS */}
                <div className="absolute inset-0 flex items-end">
                  {monthlyData.months.map((month, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="relative w-full h-full flex flex-col items-center justify-end">
                        <div 
                          className="w-4/5 bg-purple-400 rounded-t"
                          style={{ height: `${(monthlyData.views[index] / Math.max(...monthlyData.views)) * 100}%` }}
                        ></div>
                        <div 
                          className="w-2 h-2 rounded-full bg-yellow-500 absolute"
                          style={{ bottom: `${(monthlyData.orders[index] / monthlyData.views[index]) * 300}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{month}</div>
                    </div>
                  ))}
                </div>
                {/* Line for conversion rate */}
                <div className="absolute inset-0 flex items-end pointer-events-none">
                  <svg className="w-full h-full">
                    <polyline
                      points={
                        monthlyData.months.map((month, index) => {
                          const x = (index / (monthlyData.months.length - 1)) * 100;
                          const y = 100 - (monthlyData.orders[index] / monthlyData.views[index]) * 300;
                          return `${x},${y}`;
                        }).join(' ')
                      }
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex justify-center mt-2">
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 bg-purple-400 rounded-sm mr-1"></div>
                  <span className="text-xs text-gray-600">Views</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-sm mr-1"></div>
                  <span className="text-xs text-gray-600">Conversion Rate</span>
                </div>
              </div>
              <div className="text-center mt-2">
                <span className="text-sm font-medium text-gray-700">
                  <TrendingUp className="inline h-4 w-4 text-green-500 mr-1" />
                  6.1% average conversion rate for this {timePeriod}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Selling Designs */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Best Selling Designs</CardTitle>
          <CardDescription>
            Your top performing designs by volume and revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-gray-500">Design</th>
                  <th className="pb-3 font-medium text-gray-500">Category</th>
                  <th className="pb-3 font-medium text-gray-500">Orders</th>
                  <th className="pb-3 font-medium text-gray-500">Revenue</th>
                  <th className="pb-3 font-medium text-gray-500">Growth</th>
                  <th className="pb-3 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {bestSellingDesigns.map(design => (
                  <tr key={design.id} className="border-b">
                    <td className="py-3">
                      <div className="flex items-center">
                        <img 
                          src={design.image} 
                          alt={design.name} 
                          className="w-10 h-10 object-cover rounded mr-3" 
                        />
                        <span className="font-medium">{design.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm">{design.category}</td>
                    <td className="py-3 text-sm">
                      <div className="flex items-center">
                        <ShoppingBag className="h-4 w-4 text-blue-500 mr-2" />
                        {design.orderCount}
                      </div>
                    </td>
                    <td className="py-3 text-sm">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                        ${design.revenue}
                      </div>
                    </td>
                    <td className="py-3 text-sm">
                      <div className="flex items-center">
                        {design.growth > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={design.growth > 0 ? "text-green-600" : "text-red-600"}>
                          {design.growth > 0 ? "+" : ""}{design.growth}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-sm">
                      <Link to={`/designs/${design.id}`}>
                        <Button size="sm" variant="outline">Analyze</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Design Conversion Rates */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Design Conversion Metrics</CardTitle>
          <CardDescription>
            How often viewers convert to paying customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-gray-500">Design</th>
                  <th className="pb-3 font-medium text-gray-500">Views</th>
                  <th className="pb-3 font-medium text-gray-500">Orders</th>
                  <th className="pb-3 font-medium text-gray-500">Conversion Rate</th>
                  <th className="pb-3 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {conversionRates.map(design => (
                  <tr key={design.designId} className="border-b">
                    <td className="py-3 text-sm font-medium">{design.designName}</td>
                    <td className="py-3 text-sm">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 text-gray-500 mr-2" />
                        {design.views}
                      </div>
                    </td>
                    <td className="py-3 text-sm">
                      <div className="flex items-center">
                        <ShoppingBag className="h-4 w-4 text-blue-500 mr-2" />
                        {design.orders}
                      </div>
                    </td>
                    <td className="py-3 text-sm">
                      <div className="flex items-center">
                        <div className="mr-2 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              design.rate >= 6 ? 'bg-green-500' : 
                              design.rate >= 4 ? 'bg-blue-500' : 
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${Math.min(design.rate * 10, 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{design.rate}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm">
                      <Link to={`/designs/${design.designId}/analytics`}>
                        <Button size="sm" variant="outline">Improve</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              <TrendingUp className="inline h-4 w-4 mr-1" />
              Industry average conversion rate is 4.2%. Your designs are performing above average!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Customer Ratings and Feedback */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Customer Ratings & Feedback</CardTitle>
          <CardDescription>
            What your customers are saying about your designs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {designRatings.map(design => (
            <div key={design.designId} className="mb-6 last:mb-0">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">{design.designName}</h3>
                <div className="flex items-center">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star}
                        className={`h-4 w-4 ${star <= Math.round(design.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill={star <= Math.round(design.averageRating) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <span className="font-bold">{design.averageRating}</span>
                  <span className="text-sm text-gray-500 ml-1">({design.totalReviews})</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Rating breakdown */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Rating Breakdown</h4>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center mb-1">
                      <div className="flex items-center w-16">
                        <span className="text-sm mr-1">{rating}</span>
                        <Star className="h-3 w-3 text-yellow-400" fill="currentColor" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            rating >= 4 ? 'bg-green-500' : 
                            rating >= 3 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${(design.ratingBreakdown[rating] / design.totalReviews) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2 w-4">{design.ratingBreakdown[rating]}</span>
                    </div>
                  ))}
                </div>

                {/* Recent feedback */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Recent Feedback</h4>
                  {design.recentFeedback.map((feedback, index) => (
                    <div key={index} className="mb-2 last:mb-0 p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center mb-1">
                        <div className="flex mr-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star}
                              className={`h-3 w-3 ${star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill={star <= feedback.rating ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{feedback.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Market Trends */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Market Insights</CardTitle>
          <CardDescription>
            Trending products and seasonal demand patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trending Categories */}
            <div>
              <h3 className="text-lg font-medium mb-4">Trending Product Categories</h3>
              <div className="space-y-3">
                {marketTrends.trendingCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-gray-800">{category.name}</span>
                    </div>
                    <div className="flex items-center">
                      {category.isRising ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`
                        ${category.isRising ? 'text-green-600' : 'text-red-600'} 
                        font-medium
                      `}>
                        {category.isRising ? '+' : ''}{category.growth}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <h4 className="font-medium text-sm mb-1">Pro Tip:</h4>
                <p className="text-sm text-gray-700">
                  Consider expanding your portfolio with eco-friendly designs and tote bags to capitalize on current market trends.
                </p>
              </div>
            </div>

            {/* Seasonal Demand */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Seasonal Demand Patterns</h3>
                <Badge className="bg-blue-100 text-blue-800">
                  <Calendar className="h-3 w-3 mr-1" />
                  Current Season: {marketTrends.currentSeason}
                </Badge>
              </div>
              
              {marketTrends.seasonalDemand.map((season, index) => (
                <div 
                  key={index} 
                  className={`mb-3 p-3 rounded-md ${
                    season.season === marketTrends.currentSeason 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'bg-gray-50'
                  }`}
                >
                  <h4 className="font-medium mb-1">{season.season}</h4>
                  <div className="flex flex-wrap gap-2">
                    {season.topProducts.map((product, idx) => (
                      <Badge key={idx} variant="outline" className="bg-white">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="mt-2 text-sm text-gray-600">
                <Calendar className="inline h-4 w-4 mr-1 text-blue-500" />
                Plan your design releases strategically based on seasonal trends.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignerAnalytics;