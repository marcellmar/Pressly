import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/notion-modern.css'; // Notion-inspired modern design system
import './styles/notion-overrides.css'; // Apply Notion style to all components
import { Toast } from './components/ui/toast';

// Import Interface Router for ZUO integration
import InterfaceRouter from './components/InterfaceRouter';
import CreatePage from './components/CreatePage';

// Import Layout Components
import ModernLayout from './components/modern/ModernLayout';

// Import Providers
import { useAuth } from './services/auth/AuthContext';
import AppLayout from './components/layout/AppLayout';
import { ThemeProvider } from './services/theme/ThemeContext';
import SessionPersistence from './components/auth/SessionPersistence';

// Import pages
import ModernHome from './pages/ModernHome';
import ModernDashboard from './pages/ModernDashboard';
import PublicPortfolio from './pages/Portfolio/PublicPortfolio';
import MyPortfolio from './pages/Portfolio/MyPortfolio';
import ModernLogin from './pages/ModernLogin';
import ModernRegister from './pages/ModernRegister';
import DesignerAnalytics from './pages/DesignerAnalytics';
import ProducerAnalytics from './pages/ProducerAnalytics';
import Designs from './pages/Designs';
import Producers from './pages/Producers';
import ModernSmartMatch from './pages/ModernSmartMatch';
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
import ModernGallery from './pages/ModernGallery';
import { GalleryItemDetailPage, GalleryUploadPage, GalleryManagementPage } from './pages/gallery';
import Settings from './pages/Settings';
import JobQueue from './pages/JobQueue';
import DesignOptimization from './pages/DesignOptimization'; // Import our AI Design Optimization page
import SmartMatchStudio from './pages/SmartMatchStudio'; // Unified SmartMatch solution
import SmartMatchStudioTest from './pages/SmartMatchStudioTest'; // Test component

// Import enhanced protected route
import EnhancedProtectedRoute from './components/auth/EnhancedProtectedRoute';

// Protected Route Component (backwards compatible)
const ProtectedRoute = ({ children }) => {
  return <EnhancedProtectedRoute>{children}</EnhancedProtectedRoute>;
};

// Role-based Route Component
const RoleRoute = ({ requiredRole, children }) => {
  return <EnhancedProtectedRoute requiredRole={requiredRole}>{children}</EnhancedProtectedRoute>;
};

// Removed DashboardRoute - using ModernLayout for all pages

// Order Detail Wrapper - Redirects to the Orders page with the specific order ID
const OrderDetailWrapper = () => {
  return <Orders />;
};

// Component to handle dashboard redirection
const DashboardRedirect = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  // Modern dashboard handles both authenticated and guest users
  // No need for redirects - dashboard shows appropriate content based on auth status
  return <ModernDashboard />;
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
        <SessionPersistence />
        <Routes>
          {/* Public routes with unified layout - Home page */}
          <Route path="/" element={
            <ModernLayout>
              <ModernHome />
            </ModernLayout>
          } />
          <Route path="/about" element={
            <ModernLayout>
              <About />
            </ModernLayout>
          } />
          <Route path="/pricing" element={
            <ModernLayout>
              <Pricing />
            </ModernLayout>
          } />
          <Route path="/contact" element={
            <ModernLayout>
              <Contact />
            </ModernLayout>
          } />
          <Route path="/features" element={
            <ModernLayout>
              <FeatureShowcase />
            </ModernLayout>
          } />
          
          {/* Search Results Page */}
          <Route path="/search" element={
            <ModernLayout>
              <SearchResults />
            </ModernLayout>
          } />
          
          {/* Authentication routes */}
          <Route path="/login" element={
            <ModernLayout>
              <ModernLogin />
            </ModernLayout>
          } />
          <Route path="/register" element={
            <ModernLayout>
              <ModernRegister />
            </ModernLayout>
          } />
          
          {/* Dashboard routes with unified layout - available to all */}
          <Route path="/dashboard" element={
            <ModernLayout>
              <EnhancedProtectedRoute allowGuest={true}>
                <DashboardRedirect />
              </EnhancedProtectedRoute>
            </ModernLayout>
          } />
          
          {/* Analytics Routes */}
          <Route path="/analytics" element={
            <ProtectedRoute>
              <ModernLayout>
                <AnalyticsSelector />
              </ModernLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/analytics/producer" element={
            <RoleRoute requiredRole="producer">
              <ModernLayout>
                <ProducerAnalytics />
              </ModernLayout>
            </RoleRoute>
          } />
          
          <Route path="/analytics/designer" element={
            <RoleRoute requiredRole="designer">
              <ModernLayout>
                <DesignerAnalytics />
              </ModernLayout>
            </RoleRoute>
          } />
          
          
          {/* Create Route */}
          <Route path="/create" element={
            <ModernLayout>
              <CreatePage />
            </ModernLayout>
          } />
          
          <Route path="/designs" element={
            <ProtectedRoute>
              <ModernLayout>
                <Designs />
              </ModernLayout>
            </ProtectedRoute>
          } />
          
          {/* AI Design Optimization Route */}
          <Route path="/design-optimization" element={
            <ProtectedRoute>
              <ModernLayout>
                <DesignOptimization />
              </ModernLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/producers" element={
            <ModernLayout>
              <Producers />
            </ModernLayout>
          } />
          
          {/* Unified SmartMatch Studio - replaces multiple tools */}
          <Route path="/smart-match" element={
            <ModernLayout>
              <SmartMatchStudio />
            </ModernLayout>
          } />
          
          {/* Test route for SmartMatch Studio */}
          <Route path="/smart-match-test" element={
            <ModernLayout>
              <SmartMatchStudioTest />
            </ModernLayout>
          } />
          
          {/* Legacy routes redirect to unified solution */}
          <Route path="/design-optimization" element={<Navigate to="/smart-match?mode=ai" />} />
          <Route path="/pdf-analysis" element={<Navigate to="/smart-match?mode=quick" />} />
          
          {/* Combined SmartMatch Page (New) */}
          <Route path="/combined-match" element={
            <ProtectedRoute>
              <ModernLayout>
                <CombinedSmartMatch />
              </ModernLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/capacity" element={
            <RoleRoute requiredRole="producer">
              <ModernLayout>
                <CapacityManagement />
              </ModernLayout>
            </RoleRoute>
          } />
          
          <Route path="/schedule" element={
            <RoleRoute requiredRole="producer">
              <ModernLayout>
                <ScheduleManagement />
              </ModernLayout>
            </RoleRoute>
          } />
          
          <Route path="/equipment" element={
            <RoleRoute requiredRole="producer">
              <ModernLayout>
                <Equipment />
              </ModernLayout>
            </RoleRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ModernLayout>
                <ProfileSelector />
              </ModernLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/messages" element={
            <ProtectedRoute>
              <ModernLayout>
                <Messages />
              </ModernLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/orders/:orderId" element={
            <ProtectedRoute>
              <ModernLayout>
                <OrderDetailWrapper />
              </ModernLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute>
              <ModernLayout>
                <Orders />
              </ModernLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/pdf-analysis" element={
            <ProtectedRoute>
              <ModernLayout>
                <PDFAnalysisPage />
              </ModernLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/find-creators" element={
            <RoleRoute requiredRole="producer">
              <ModernLayout>
                <FindCreators />
              </ModernLayout>
            </RoleRoute>
          } />
          
          {/* Geographic Network Visualization */}
          <Route path="/network" element={
            <ProtectedRoute>
              <ModernLayout>
                <NetworkVisualization />
              </ModernLayout>
            </ProtectedRoute>
          } />
          
          {/* Mapping Demo Page */}
          <Route path="/mapping-demo" element={
            <ModernLayout>
              <MappingDemo />
            </ModernLayout>
          } />
          
          {/* Job Queue for producers */}
          <Route path="/job-queue" element={
            <RoleRoute requiredRole="producer">
              <ModernLayout>
                <JobQueue />
              </ModernLayout>
            </RoleRoute>
          } />
          
          {/* Enhanced Producers Page */}
          <Route path="/enhanced-producers" element={
            <ProtectedRoute>
              <ModernLayout>
                <EnhancedProducers />
              </ModernLayout>
            </ProtectedRoute>
          } />
          
          {/* Marketplace Hub Page */}
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <ModernLayout>
                <MarketplaceHub />
              </ModernLayout>
            </ProtectedRoute>
          } />
          
          {/* Gallery Pages */}
          <Route path="/gallery" element={
            <ModernLayout>
              <ModernGallery />
            </ModernLayout>
          } />
          
          <Route path="/gallery/:itemId" element={
            <ModernLayout>
              <GalleryItemDetailPage />
            </ModernLayout>
          } />
          
          <Route path="/dashboard/gallery/upload" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="producer">
                <ModernLayout>
                  <GalleryUploadPage />
                </ModernLayout>
              </RoleRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/gallery/manage" element={
            <ProtectedRoute>
              <RoleRoute requiredRole="producer">
                <ModernLayout>
                  <GalleryManagementPage />
                </ModernLayout>
              </RoleRoute>
            </ProtectedRoute>
          } />
          
          {/* Settings Page */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <ModernLayout>
                <Settings />
              </ModernLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/image-test" element={
            <ModernLayout>
              <ImageTest />
            </ModernLayout>
          } />
          
          {/* Portfolio Pages */}
          <Route path="/portfolio/:portfolioSlug" element={
            <ModernLayout>
              <PublicPortfolio />
            </ModernLayout>
          } />
          
          <Route path="/my-portfolio" element={
            <ProtectedRoute>
              <ModernLayout>
                <MyPortfolio />
              </ModernLayout>
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