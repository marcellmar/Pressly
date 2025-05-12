import { useAuth } from '../services/auth/AuthContext';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedGalleryItems } from '../services/gallery';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Leaf, 
  Search, 
  ChevronRight, 
  MapPin, 
  Star, 
  TrendingUp, 
  Clock, 
  Heart, 
  Filter, 
  ShoppingBag,
  Zap,
  Users,
  PenTool,
  Share2,
  BarChart,
  CheckCircle,
  Code,
  RefreshCw,
  Printer,
  Layers,
  LineChart,
  LayoutDashboard,
  File,
  Map,
  BookOpen,
  Upload,
  Activity,
  CircleUser,
  ExternalLink,
  Image
} from 'lucide-react';

// Our modified Network component to fix the error
const Network = Share2;

const Home = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [featuredGalleryItems, setFeaturedGalleryItems] = useState([]);
  const [showUpdates, setShowUpdates] = useState(true);
  const [codeUpdates, setCodeUpdates] = useState([]);

  useEffect(() => {
    // Fetch featured gallery items
    const fetchFeaturedGalleryItems = async () => {
      try {
        const items = await getFeaturedGalleryItems(4); // Limit to 4 items
        setFeaturedGalleryItems(items);
      } catch (error) {
        console.error('Error fetching featured gallery items:', error);
      }
    };
    
    fetchFeaturedGalleryItems();

    // In a real app this would come from an API
    setCodeUpdates([
      {
        id: 1,
        title: "Network Visualization Engine",
        description: "Interactive visualization showing connections between designers and producers",
        date: "April 20, 2025",
        type: "feature",
        icon: <Network className="w-4 h-4" />
      },
      {
        id: 2,
        title: "Real-time Capacity Tracking",
        description: "Monitor producer availability with live updates",
        date: "April 18, 2025",
        type: "enhancement",
        icon: <BarChart className="w-4 h-4" />
      },
      {
        id: 3,
        title: "Distributed Printing API",
        description: "New endpoints for connecting to local print networks",
        date: "April 16, 2025",
        type: "api",
        icon: <Code className="w-4 h-4" />
      }
    ]);
  }, []);

  // Featured producers data with sustainability scores
  const featuredProducers = [
    {
      id: 1,
      name: 'LuckyPrints Chicago',
      image: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1369&q=80',
      location: 'Wicker Park',
      description: 'Sustainable full-service print shop',
      sustainabilityScore: 85
    },
    {
      id: 2, 
      name: 'Rowboat Creative',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
      location: 'West Town',
      description: 'Custom apparel and merchandise studio',
      sustainabilityScore: 90
    },
    {
      id: 3,
      name: 'Eco Prints Chicago',
      image: 'https://images.unsplash.com/photo-1581077968166-ca219fe47b7f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      location: 'Logan Square',
      description: 'Zero-waste printing studio',
      sustainabilityScore: 98
    }
  ];

  // Popular product categories
  const categories = [
    { name: 'All', icon: <Filter className="w-4 h-4" /> },
    { name: 'T-Shirts', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Posters', icon: <PenTool className="w-4 h-4" /> },
    { name: 'Business Cards', icon: <Users className="w-4 h-4" /> },
    { name: 'Eco-Friendly', icon: <Leaf className="w-4 h-4" /> },
    { name: 'Fast Turnaround', icon: <Zap className="w-4 h-4" /> }
  ];

  // Sample trending designs
  const trendingDesigns = [
    {
      id: 1,
      title: 'Minimalist Logo Design',
      image: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
      designer: 'MinimalStudio',
      price: '$45',
      likes: 128
    },
    {
      id: 2,
      title: 'Custom Event Poster',
      image: 'https://images.unsplash.com/photo-1509225770129-fbcf8a696c0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
      designer: 'DesignWorks',
      price: '$65',
      likes: 89
    },
    {
      id: 3,
      title: 'Eco-Friendly Packaging',
      image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      designer: 'GreenDesigns',
      price: '$35',
      likes: 112
    },
    {
      id: 4,
      title: 'Business Card Collection',
      image: 'https://images.unsplash.com/photo-1563290515-3a9b9de9c0e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80',
      designer: 'ProfessionalPrints',
      price: '$25',
      likes: 76
    }
  ];

  // Recently viewed (would be dynamic in real app)
  const recentlyViewed = [
    {
      id: 1,
      title: 'Custom T-Shirt Design',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
      producer: 'ShirtWorks',
      price: '$29'
    },
    {
      id: 2,
      title: 'Wedding Invitations',
      image: 'https://images.unsplash.com/photo-1607144087932-123adca6ebfc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1528&q=80',
      producer: 'ElegantPaper',
      price: '$2.50'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section with modern design */}
      <section className="relative h-[75vh] min-h-[500px] overflow-hidden" style={{ 
        background: `linear-gradient(120deg, var(--primary-dark), var(--primary))` 
      }}>
        {/* Background geometric shapes */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full" style={{ 
            background: `var(--primary-light)`,
            opacity: 0.2,
            filter: 'blur(40px)'
          }}></div>
          <div className="absolute bottom-40 right-[15%] w-80 h-80 rounded-full" style={{ 
            background: `var(--primary-light)`,
            opacity: 0.15,
            filter: 'blur(50px)'
          }}></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full" style={{ 
            background: `var(--secondary)`,
            opacity: 0.1,
            filter: 'blur(30px)'
          }}></div>
        </div>
        
        {/* Hero content */}
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <div className="max-w-5xl">
            <div className="flex items-center mb-8">
              <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)' }} className="p-3 mr-4 shadow-lg">
                <Printer className="w-10 h-10" style={{ color: 'var(--primary)' }} />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                Pressly
              </h1>
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-white/90 mb-6">
              Connect. Create. Print.
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mb-10">
              Pressly is revolutionizing printing by connecting designers with local print producers through our distributed network platform.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <button className="btn btn-lg" style={{ background: 'var(--white)', color: 'var(--primary)' }}>
                  Get Started
                </button>
              </Link>
              <Link to="/producers">
                <button className="btn btn-lg btn-outline" style={{ borderColor: 'var(--white)', color: 'var(--white)' }}>
                  Find Print Producers
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Search bar overlapping hero and content */}
        <div className="absolute -bottom-6 left-0 right-0 px-4 z-20">
          <div className="container mx-auto">
            <div className="card p-4 flex items-center">
              <div className="flex-grow flex input-with-icon">
                <input 
                  type="text" 
                  placeholder="Search for designs, producers, or print services..."
                  className="input w-full"
                />
                <div className="absolute right-0 top-0 bottom-0 flex items-center">
                  <button className="btn btn-primary h-full rounded-l-none" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Spacer to account for the search bar overlap */}
      <div className="h-12" style={{ background: 'var(--gray-light)' }}></div>
      
      {/* Feature Categories */}
      <section className="py-16" style={{ background: 'var(--white)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--gray-dark)' }}>
              Discover the Pressly Platform
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: 'var(--gray)' }}>
              Explore our distributed printing network tools and services
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.name}
                to={`/category/${category.name.toLowerCase().replace(' ', '-')}`}
                className={`card cursor-pointer transition-all hover:shadow-md flex flex-col items-center justify-center p-6`}
                style={{ 
                  backgroundColor: selectedCategory === category.name ? 'var(--primary-light)' : 'white',
                  borderColor: selectedCategory === category.name ? 'var(--primary)' : '#E5E7EB'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory(category.name);
                }}
              >
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-sm"
                  style={{ 
                    backgroundColor: selectedCategory === category.name ? 'var(--primary)' : 'var(--gray-light)',
                    color: selectedCategory === category.name ? 'var(--white)' : 'var(--primary)'
                  }}
                >
                  {category.icon}
                </div>
                <span className="text-center font-medium" style={{ color: 'var(--gray-dark)' }}>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What's New in Pressly */}
      {showUpdates && (
        <section className="py-16" style={{ background: 'var(--gray-light)' }}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between md:items-end mb-10">
              <div>
                <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--gray-dark)' }}>
                  What's New in Pressly
                </h2>
                <p style={{ color: 'var(--gray)' }}>
                  Latest features and platform enhancements
                </p>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <Link to="/feature-showcase" className="flex items-center" style={{ color: 'var(--primary)' }}>
                  View all updates
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
                <button 
                  onClick={() => setShowUpdates(false)}
                  className="flex items-center"
                  style={{ color: 'var(--gray)' }}
                >
                  Dismiss
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {codeUpdates.map((update) => (
                <div key={update.id} className="card overflow-hidden">
                  <div className="h-3" style={{ background: 'var(--primary)' }}></div>
                  <div className="card-body">
                    <div className="flex items-start">
                      <div className="mr-4 p-2 rounded-full" 
                        style={{ 
                          background: 'var(--primary-light)',
                          color: 'var(--primary)'
                        }}>
                        {update.icon}
                      </div>
                      <div>
                        <span className="badge badge-primary mb-2">
                          {update.type}
                        </span>
                        <h3 className="font-medium text-lg mb-2" style={{ color: 'var(--gray-dark)' }}>
                          {update.title}
                        </h3>
                        <p className="mb-4" style={{ color: 'var(--gray)' }}>
                          {update.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm" style={{ color: 'var(--gray)' }}>
                            {update.date}
                          </span>
                          <Link to={`/updates/${update.id}`} className="text-sm flex items-center" style={{ color: 'var(--primary)' }}>
                            Learn more
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed Section (Only if authenticated) */}
      {isAuthenticated && (
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recently Viewed</h2>
              <Link to="/designs" className="text-blue-600 hover:underline flex items-center">
                See all <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recentlyViewed.map((item) => (
                <Link to={`/designs/${item.id}`} key={item.id}>
                  <div className="group">
                    <div className="aspect-square overflow-hidden rounded-lg mb-2 relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute bottom-2 right-2">
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                          <Heart className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{item.producer}</span>
                      <span className="font-semibold">{item.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg aspect-square text-center text-gray-500 hover:text-blue-600 hover:border-blue-600 transition-colors">
                <Link to="/designs" className="p-6 flex flex-col items-center">
                  <Search className="w-8 h-8 mb-2" />
                  <span>Discover more</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Popular Designs Section */}
      <section className="py-16" style={{ background: 'var(--white)' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-10">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--gray-dark)' }}>Popular Designs</h2>
            <Link to="/designs" className="flex items-center mt-4 md:mt-0" style={{ color: 'var(--primary)' }}>
              See all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingDesigns.map((design) => (
              <Link to={`/designs/${design.id}`} key={design.id}>
                <div className="card overflow-hidden group">
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={design.image}
                      alt={design.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-3 right-3">
                      <button className="p-2 rounded-full shadow-md" style={{ background: 'var(--white)' }}>
                        <Heart className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                      </button>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="badge badge-primary shadow-md flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" /> Popular
                      </span>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <h3 className="font-medium truncate" style={{ color: 'var(--gray-dark)' }}>{design.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--gray)' }}>{design.designer}</span>
                      <span className="font-semibold" style={{ color: 'var(--primary)' }}>{design.price}</span>
                    </div>
                    <div className="flex items-center text-sm mt-2" style={{ color: 'var(--gray)' }}>
                      <Heart className="w-3 h-3 mr-1" fill="currentColor" style={{ color: 'var(--accent)' }} />
                      <span>{design.likes}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Producers Gallery */}
      <section className="py-16" style={{ background: 'var(--gray-light)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="badge badge-primary inline-flex mb-3">Featured Creators</span>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--gray-dark)' }}>
              Chicago Print Producers
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--gray)' }}>
              Discover top-rated local print producers ready to bring your designs to life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducers.map(producer => (
              <div key={producer.id} className="card overflow-hidden group">
                {/* Image with gradient overlay */}
                <div className="h-60 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10"></div>
                  <img
                    src={producer.image}
                    alt={producer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-20 text-white">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="badge badge-primary">
                        {producer.location}
                      </span>
                      <span className="badge badge-secondary flex items-center gap-1">
                        <Leaf className="w-3 h-3" />
                        {producer.sustainabilityScore}%
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{producer.name}</h3>
                  </div>
                </div>
                
                {/* Content */}
                <div className="card-body">
                  <p className="mb-4" style={{ color: 'var(--gray)' }}>{producer.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1" style={{ color: 'var(--warning)' }}>
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm ml-1" style={{ color: 'var(--gray)' }}>(5.0)</span>
                    </div>
                    <Link 
                      to={`/producers/${producer.id}`} 
                      className="text-sm font-medium flex items-center"
                      style={{ color: 'var(--primary)' }}
                    >
                      View Profile
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
                
                {/* Sustainability indicator */}
                <div className="absolute top-3 right-3 z-20 bg-white/90 rounded-full p-1 shadow-md">
                  <div className="relative w-8 h-8 flex items-center justify-center">
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
                        stroke={producer.sustainabilityScore > 90 ? "var(--secondary)" : producer.sustainabilityScore > 75 ? "var(--primary)" : "var(--warning)"}
                        strokeWidth="3"
                        strokeDasharray={`${producer.sustainabilityScore}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Leaf className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/producers" className="btn btn-primary">
              Explore All Print Producers
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Showcase */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-2">Gallery</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Explore Project Gallery</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Browse our collection of real-world projects from Pressly producers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGalleryItems.map((item) => (
              <Link to={`/gallery/${item.id}`} key={item.id} className="group">
                <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-200 h-full flex flex-col">
                  {/* Image */}
                  <div className="h-48 overflow-hidden relative">
                    {item.images && item.images.length > 0 ? (
                      <img 
                        src={item.images[0]} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full bg-gray-200 flex items-center justify-center">
                        <Image className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Sustainability badge */}
                    <div className="absolute bottom-2 right-2 bg-white rounded-full px-2 py-1 shadow-md flex items-center">
                      <Leaf className="h-3 w-3 text-green-600 mr-1" />
                      <span className="text-xs font-medium">{item.sustainabilityScore}%</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex-grow flex flex-col">
                    <div className="flex items-center mb-2">
                      <Printer className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">{item.producerName}</span>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags && item.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                      {item.tags && item.tags.length > 2 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                          +{item.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="border-t px-4 py-2 mt-auto">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-3 w-3 mr-1" />
                        <span className="text-xs">
                          {new Date(item.dateCreated).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short'
                          })}
                        </span>
                      </div>
                      <div className="text-blue-600 hover:text-blue-700 flex items-center text-xs font-medium">
                        View details
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link 
              to="/gallery" 
              className="inline-flex items-center bg-white border border-blue-600 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Explore Full Gallery
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section - ArcGIS Style Process Steps */}
      <section className="py-16 bg-gray-50" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-2">Platform Guide</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How Pressly Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Our distributed printing platform connects designers with local producers through a simple process</p>
          </div>
          
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-24 left-1/2 w-[calc(100%-150px)] h-0.5 bg-blue-200 -translate-x-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-12 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-md">
                  <PenTool className="w-7 h-7 text-white" />
                </div>
                <span className="absolute top-10 right-0 md:right-16 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm">1</span>
                <h3 className="text-xl font-bold mb-3">For Designers</h3>
                <p className="text-gray-600">
                  Upload your designs, set your requirements, and get matched with the perfect producer. Track your project from start to finish with real-time updates.
                </p>
                <Link to="/how-it-works/designers" className="mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  Learn more
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-md">
                  <Printer className="w-7 h-7 text-white" />
                </div>
                <span className="absolute top-10 right-0 md:right-16 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm">2</span>
                <h3 className="text-xl font-bold mb-3">For Producers</h3>
                <p className="text-gray-600">
                  Showcase your capabilities, manage your capacity, and connect with designers looking for your expertise. Grow your business with a steady stream of projects.
                </p>
                <Link to="/how-it-works/producers" className="mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  Learn more
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-md">
                  <Network className="w-7 h-7 text-white" />
                </div>
                <span className="absolute top-10 right-0 md:right-16 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm">3</span>
                <h3 className="text-xl font-bold mb-3">Better Together</h3>
                <p className="text-gray-600">
                  Experience the power of our distributed network. Our visualization engine helps you track connections and optimize collaborations in real-time.
                </p>
                <Link to="/network-visualization" className="mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  Learn more
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/how-it-works" className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-700 hover:bg-blue-50 font-medium rounded-lg transition-colors">
              View Detailed Process
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials - ArcGIS Style */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full mb-2">Testimonials</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What Our Community Says</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Hear from designers and print producers using our platform</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-blue-600 h-2"></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                    JD
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Jane Designer</h4>
                    <p className="text-gray-500 text-sm">Graphic Designer, Chicago</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-4">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "Pressly connected me with a local print shop that delivered my business cards faster than any online service I've used before. The quality was outstanding and their sustainability practices aligned with my values."
                </blockquote>
                <div className="text-sm text-gray-500">April 12, 2025</div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-blue-600 h-2"></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                    SP
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Sam Producer</h4>
                    <p className="text-gray-500 text-sm">Owner, PrintMasters Inc.</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-4">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "Since joining Pressly, my print shop has seen a 30% increase in local business. The platform makes it easy to showcase our capabilities to designers in Chicago. The capacity tracking feature helps us optimize our workflow."
                </blockquote>
                <div className="text-sm text-gray-500">April 8, 2025</div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-blue-600 h-2"></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
                    AC
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Alex Creative</h4>
                    <p className="text-gray-500 text-sm">Product Designer</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-4">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 text-gray-300" />
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "I needed eco-friendly packaging for my product line, and Pressly matched me with the perfect producer. The sustainability score feature was a game-changer! I can now easily find producers aligned with my brand values."
                </blockquote>
                <div className="text-sm text-gray-500">April 3, 2025</div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/testimonials" className="inline-flex items-center px-6 py-2.5 border border-blue-600 text-blue-700 hover:bg-blue-50 text-sm font-medium rounded-lg transition-colors">
              Read More Testimonials
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Features Highlight - ArcGIS Style */}
      <section className="py-16 bg-gradient-to-b from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-blue-700 text-white text-sm font-medium rounded-full mb-2">New in v2.4.0</span>
            <h2 className="text-3xl font-bold mb-3">Platform Capabilities</h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">Explore our latest innovations for the distributed printing network</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Network Visualization</h3>
              </div>
              <p className="text-blue-100 mb-4">
                Explore connections between designers and producers with our interactive visualization tool.
              </p>
              <Link to="/network-visualization" className="inline-flex items-center text-white hover:text-blue-200 font-medium">
                Try it now <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <BarChart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Capacity Tracking</h3>
              </div>
              <p className="text-blue-100 mb-4">
                Monitor printer availability and capacity in real-time for better scheduling and workflow optimization.
              </p>
              <Link to="/capacity-management" className="inline-flex items-center text-white hover:text-blue-200 font-medium">
                View dashboard <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Smart Matching</h3>
              </div>
              <p className="text-blue-100 mb-4">
                Our enhanced algorithm connects you with the perfect partner based on your specific needs and requirements.
              </p>
              <Link to="/smart-match" className="inline-flex items-center text-white hover:text-blue-200 font-medium">
                Find matches <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Developer API</h3>
              </div>
              <p className="text-blue-100 mb-4">
                Integrate Pressly's distributed printing capabilities into your own applications with our comprehensive API.
              </p>
              <Link to="/developers" className="inline-flex items-center text-white hover:text-blue-200 font-medium">
                API documentation <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/feature-showcase" className="inline-flex items-center bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium transition-colors">
              Explore All Features
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - ArcGIS Style */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 z-0 opacity-5">
          <div className="absolute inset-0 bg-blue-500"></div>
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="absolute rounded-full bg-blue-600" 
                style={{
                  width: `${Math.random() * 10 + 5}rem`,
                  height: `${Math.random() * 10 + 5}rem`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.3
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left section */}
              <div className="md:w-2/3 p-8 md:p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Printing Experience?</h2>
                <p className="text-gray-600 mb-8">
                  Join the Pressly community and start connecting with local print producers or finding new clients for your business.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <Button size="lg" className="px-8 bg-blue-600 text-white hover:bg-blue-700">
                      Get Started Now
                    </Button>
                  </Link>
                  <Link to="/how-it-works">
                    <Button variant="outline" size="lg" className="px-8 border-blue-600 text-blue-600 hover:bg-blue-50">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Right section */}
              <div className="md:w-1/3 bg-blue-600 p-8 md:p-12 flex flex-col justify-center">
                <div className="text-white mb-4">
                  <div className="flex items-center mb-4">
                    <LayoutDashboard className="w-6 h-6 mr-2" />
                    <h3 className="font-bold text-lg">For Designers</h3>
                  </div>
                  <p className="text-blue-100 text-sm mb-4">Find the perfect print producers for your creative projects</p>
                </div>
                
                <div className="text-white">
                  <div className="flex items-center mb-4">
                    <Printer className="w-6 h-6 mr-2" />
                    <h3 className="font-bold text-lg">For Producers</h3>
                  </div>
                  <p className="text-blue-100 text-sm">Connect with more clients and grow your printing business</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* We can leave the Footer component since we've already updated it in Footer.js */}
    </div>
  );
};

export default Home;