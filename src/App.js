import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';
import './styles/pressly-theme.css'; // Import our theme
import './styles/dark-mode.css'; // Import dark mode theme
import './styles/dashboard.css'; // Import dashboard styles
import './styles/settings.css'; // Import settings styles
import { Toast } from './components/ui/toast';

// Import Layout Components
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Import Providers
import { useAuth } from './services/auth/AuthContext';
import AppLayout from './components/layout/AppLayout';
import { ThemeProvider } from './services/theme/ThemeContext';

// Import pages
import Home from './pages/Home';
import PublicPortfolio from './pages/Portfolio/PublicPortfolio';
import MyPortfolio from './pages/Portfolio/MyPortfolio';
import Login from './pages/Login';
import Register from './pages/Register';
import DesignerDashboard from './pages/DesignerDashboard';
import DesignerAnalytics from './pages/DesignerAnalytics';
import ProducerDashboard from './pages/ProducerDashboard';
import ProducerAnalytics from './pages/ProducerAnalytics';
import Designs from './pages/Designs';
import Producers from './pages/Producers';
import SmartMatch from './pages/SmartMatch';
import CombinedSmartMatch from './pages/CombinedSmartMatch'; // Import new combined page
import CapacityManagement from './pages/CapacityManagement';
import ScheduleManagement from './pages/ScheduleManagement';
import DesignerProfile from './pages/DesignerProfile';
import ProducerProfile from './pages/ProducerProfile';
import Messages from './pages/Messages';
import Orders from './pages/Orders';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import FeatureShowcase from './pages/FeatureShowcase';
import PDFAnalysisPage from './pages/PDFAnalysisPage';
import Equipment from './pages/Equipment';
import FindCreators from './pages/FindCreators';
import ImageTest from './pages/ImageTest';
import SearchResults from './pages/SearchResults';
import EnhancedProducers from './pages/enhanced/EnhancedProducers';
import MarketplaceHub from './pages/marketplace/MarketplaceHub';
import NetworkVisualization from './pages/NetworkVisualization'; // Import our network visualization page
import MappingDemo from './pages/MappingDemo'; // Import our new mapping demo page
import { Gallery, GalleryItemDetailPage, GalleryUploadPage, GalleryManagementPage } from './pages/gallery';
import Settings from './pages/Settings';
import JobQueue from './pages/JobQueue';
import DesignOptimization from './pages/DesignOptimization'; // Import our AI Design Optimization page

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Role-based Route Component
const RoleRoute = ({ requiredRole, children }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (currentUser.role !== requiredRole) {
    return currentUser.role === 'designer' ? 
      <Navigate to="/dashboard" /> : 
      <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Dashboard Route Component with sidebar layout
const DashboardRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  return (
    <MainLayout>
      <DashboardLayout>
        {typeof children === 'function' ? children({ currentUser }) : children}
      </DashboardLayout>
    </MainLayout>
  );
};

// Order Detail Wrapper - Redirects to the Orders page with the specific order ID
const OrderDetailWrapper = () => {
  return <Orders />;
};

// Component to handle dashboard redirection based on user role
const DashboardRedirect = () => {
  const { isAuthenticated, currentUser } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Redirect based on user role
  if (currentUser.role === 'producer') {
    return <ProducerDashboard />;
  }
  
  // Default to designer dashboard
  return <DesignerDashboard />;
};

// Profile Route selector based on user role
const ProfileSelector = () => {
  const { currentUser } = useAuth();
  
  if (currentUser?.role === 'producer') {
    return <ProducerProfile />;
  }
  
  return <DesignerProfile />;
};

// Analytics selector based on user role
const AnalyticsSelector = () => {
  const { currentUser } = useAuth();
  
  if (currentUser?.role === 'producer') {
    return <ProducerAnalytics />;
  }
  
  return <DesignerAnalytics />;
};

// Component to redirect authenticated users to their dashboard
const AuthRedirect = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return null;
};

function App() {
  return (
    <AppLayout>
      <ThemeProvider>
      <Router basename="/">
        <Routes>
          {/* Public routes with main layout - Home page with hidden top banner */}
          <Route path="/" element={
            <MainLayout hideTopBanner={true}>
              <AuthRedirect />
              <Home />
            </MainLayout>
          } />
          <Route path="/about" element={
            <MainLayout>
              <About />
            </MainLayout>
          } />
          <Route path="/pricing" element={
            <MainLayout>
              <Pricing />
            </MainLayout>
          } />
          <Route path="/contact" element={
            <MainLayout>
              <Contact />
            </MainLayout>
          } />
          <Route path="/features" element={
            <MainLayout>
              <FeatureShowcase />
            </MainLayout>
          } />
          
          {/* Search Results Page */}
          <Route path="/search" element={
            <MainLayout>
              <SearchResults />
            </MainLayout>
          } />
          
          {/* Authentication routes with hidden top banner */}
          <Route path="/login" element={
            <MainLayout hideTopBanner={true}>
              <Login />
            </MainLayout>
          } />
          <Route path="/register" element={
            <MainLayout hideTopBanner={true}>
              <Register />
            </MainLayout>
          } />
          
          {/* Dashboard routes with dashboard layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardRoute>
                <DashboardRedirect />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          
          {/* Analytics Routes */}
          <Route path="/analytics" element={
            <ProtectedRoute>
              <DashboardRoute>
                <AnalyticsSelector />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/analytics/producer" element={
            <RoleRoute requiredRole="producer">
              <DashboardRoute>
                <ProducerAnalytics />
              </DashboardRoute>
            </RoleRoute>
          } />
          
          <Route path="/analytics/designer" element={
            <RoleRoute requiredRole="designer">
              <DashboardRoute>
                <DesignerAnalytics />
              </DashboardRoute>
            </RoleRoute>
          } />
          
          <Route path="/designs" element={
            <ProtectedRoute>
              <DashboardRoute>
                <Designs />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          
          {/* AI Design Optimization Route */}
          <Route path="/design-optimization" element={
            <ProtectedRoute>
              <DashboardRoute>
                <DesignOptimization />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/producers" element={
            <ProtectedRoute>
              <DashboardRoute>
                <Producers />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/smart-match" element={
            <ProtectedRoute>
              <DashboardRoute>
                <SmartMatch />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          
          {/* Combined SmartMatch Page (New) */}
          <Route path="/combined-match" element={
            <ProtectedRoute>
              <DashboardRoute>
                <CombinedSmartMatch />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/capacity" element={
            <RoleRoute requiredRole="producer">
              <DashboardRoute>
                <CapacityManagement />
              </DashboardRoute>
            </RoleRoute>
          } />
          
          <Route path="/schedule" element={
            <RoleRoute requiredRole="producer">
              <DashboardRoute>
                <ScheduleManagement />
              </DashboardRoute>
            </RoleRoute>
          } />
          
          <Route path="/equipment" element={
            <RoleRoute requiredRole="producer">
              <DashboardRoute>
                <Equipment />
              </DashboardRoute>
            </RoleRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <DashboardRoute>
                <ProfileSelector />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/messages" element={
            <ProtectedRoute>
              <DashboardRoute>
                <Messages />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/orders/:orderId" element={
            <ProtectedRoute>
              <DashboardRoute>
                <OrderDetailWrapper />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute>
              <DashboardRoute>
                <Orders />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/pdf-analysis" element={
            <ProtectedRoute>
              <DashboardRoute>
                <PDFAnalysisPage />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/find-creators" element={
            <RoleRoute requiredRole="producer">
              <DashboardRoute>
                <FindCreators />
              </DashboardRoute>
            </RoleRoute>
          } />
          
          {/* Geographic Network Visualization */}
          <Route path="/network" element={
            <ProtectedRoute>
              <DashboardRoute>
                <NetworkVisualization />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          
          {/* Mapping Demo Page */}
          <Route path="/mapping-demo" element={
            <MainLayout>
              <MappingDemo />
            </MainLayout>
          } />
          
          {/* Job Queue for producers */}
          <Route path="/job-queue" element={
            <RoleRoute requiredRole="producer">
              <DashboardRoute>
                <JobQueue />
              </DashboardRoute>
            </RoleRoute>
          } />
          
          {/* Enhanced Producers Page */}
          <Route path="/enhanced-producers" element={
            <ProtectedRoute>
              <DashboardRoute>
                <EnhancedProducers />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          
          {/* Marketplace Hub Page */}
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <DashboardRoute>
                <MarketplaceHub />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          
          {/* Gallery Pages */}
          <Route path="/gallery" element={
            <MainLayout>
              <Gallery />
            </MainLayout>
          } />
          
          <Route path="/gallery/:itemId" element={
            <MainLayout>
              <GalleryItemDetailPage />
            </MainLayout>
          } />
          
          <Route path="/dashboard/gallery/upload" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="producer">
                <DashboardRoute>
                  <GalleryUploadPage />
                </DashboardRoute>
              </RoleRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/gallery/manage" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="producer">
                <DashboardRoute>
                  <GalleryManagementPage />
                </DashboardRoute>
              </RoleRoute>
            </ProtectedRoute>
          } />
          
          {/* Settings Page */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <DashboardRoute>
                <Settings />
              </DashboardRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/image-test" element={
            <MainLayout>
              <ImageTest />
            </MainLayout>
          } />
          
          {/* Portfolio Pages */}
          <Route path="/portfolio/:portfolioSlug" element={
            <PublicPortfolio />
          } />
          
          <Route path="/my-portfolio" element={
            <ProtectedRoute>
              <DashboardRoute>
                <MyPortfolio />
              </DashboardRoute>
            </ProtectedRoute>
          } />
        </Routes>
        <Toast />
      </Router>
      </ThemeProvider>
    </AppLayout>
  );
}

export default App;