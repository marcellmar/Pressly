import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { useTheme } from '../services/theme/ThemeContext';
import { 
  User, 
  Lock, 
  Bell, 
  FileText, 
  Leaf, 
  Settings as SettingsIcon, 
  Shield, 
  Plug 
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, loading, updateUserProfile } = useAuth();
  const { theme, setThemeMode } = useTheme();
  
  // Settings state management
  const [settings, setSettings] = useState({
    // Profile Information
    profileInfo: {
      notificationEmail: '',
      phone: '',
      preferredContactMethod: 'email',
    },
    // Privacy Controls
    privacy: {
      profileVisibility: 'all',
      contactPermissions: 'connections',
      designVisibility: 'public',
    },
    // Communication Preferences
    communication: {
      emailNotifications: true,
      pushNotifications: true,
      messageNotifications: true,
      orderUpdates: true,
      marketingEmails: false,
      notificationFrequency: 'immediate',
    },
    // Project Preferences
    projectPreferences: {
      preferredMaterials: [],
      standardTimeline: 'normal',
      defaultPricing: 'standard',
    },
    // Sustainability Preferences
    sustainability: {
      ecoFriendlyMaterials: true,
      carbonOffset: false,
      minSustainabilityRating: '3',
    },
    // Application Settings
    appSettings: {
      theme: theme,
      dashboardLayout: 'default',
      viewMode: 'expanded',
      unitSystem: 'imperial',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
    },
    // Security Settings
    security: {
      twoFactorEnabled: false,
      passwordLastChanged: null,
      loginNotifications: true,
    },
    // Integration Settings
    integrations: {
      connectedSoftware: [],
      apiEnabled: false,
    }
  });

  const [activeSection, setActiveSection] = useState('profileInfo');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  // Redirect if user is not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
    
    // Initialize settings with current user data
    if (currentUser) {
      setSettings(prevSettings => ({
        ...prevSettings,
        profileInfo: {
          ...prevSettings.profileInfo,
          notificationEmail: currentUser.email || '',
          phone: currentUser.phone || '',
          preferredContactMethod: currentUser.preferredContactMethod || 'email',
        },
        // If the user has saved settings, merge them here
        ...(currentUser.settings || {}),
      }));
    }
  }, [isAuthenticated, currentUser, loading, navigate]);
  
  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  
  const handleCheckboxChange = (section, field) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  };
  
  const handleArrayToggle = (section, field, item) => {
    setSettings(prev => {
      const currentArray = [...prev[section][field]];
      const index = currentArray.indexOf(item);
      
      if (index === -1) {
        currentArray.push(item);
      } else {
        currentArray.splice(index, 1);
      }
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: currentArray
        }
      };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      // In a real app, you would make an API call here
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = {
        ...currentUser,
        settings: settings,
        phone: settings.profileInfo.phone,
        preferredContactMethod: settings.profileInfo.preferredContactMethod,
      };
      
      // Update the user profile
      await updateUserProfile(updatedUser);
      
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to update settings', error);
      setSaveError('Failed to update settings. Please try again.');
    }
  };
  
  // Generate section classes
  const getSectionClass = (section) => {
    return `settings-tab ${activeSection === section ? 'active' : ''}`;
  };
  
  // If still loading, show loading indicator
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }
  
  return (
    <section className="settings-section">
      <div className="container">
        <div className="section-header">
          <h1>Settings</h1>
          <p>Configure your account preferences and settings</p>
        </div>
        
        {saveSuccess && (
          <div className="flash flash-success">
            Settings saved successfully!
          </div>
        )}
        
        {saveError && (
          <div className="flash flash-danger">
            {saveError}
          </div>
        )}
        
        <div className="settings-container">
          <div className="settings-sidebar">
            <div 
              className={getSectionClass('profileInfo')}
              onClick={() => setActiveSection('profileInfo')}
            >
              <User size={18} />
              <span>Profile Information</span>
            </div>
            <div 
              className={getSectionClass('privacy')}
              onClick={() => setActiveSection('privacy')}
            >
              <Lock size={18} />
              <span>Account Privacy</span>
            </div>
            <div 
              className={getSectionClass('communication')}
              onClick={() => setActiveSection('communication')}
            >
              <Bell size={18} />
              <span>Communication</span>
            </div>
            <div 
              className={getSectionClass('projectPreferences')}
              onClick={() => setActiveSection('projectPreferences')}
            >
              <FileText size={18} />
              <span>Project Preferences</span>
            </div>
            <div 
              className={getSectionClass('sustainability')}
              onClick={() => setActiveSection('sustainability')}
            >
              <Leaf size={18} />
              <span>Sustainability</span>
            </div>
            <div 
              className={getSectionClass('appSettings')}
              onClick={() => setActiveSection('appSettings')}
            >
              <SettingsIcon size={18} />
              <span>Application Settings</span>
            </div>
            <div 
              className={getSectionClass('security')}
              onClick={() => setActiveSection('security')}
            >
              <Shield size={18} />
              <span>Security</span>
            </div>
            <div 
              className={getSectionClass('integrations')}
              onClick={() => setActiveSection('integrations')}
            >
              <Plug size={18} />
              <span>Integrations</span>
            </div>
          </div>
          
          <div className="settings-content">
            <form onSubmit={handleSubmit}>
              {/* Profile Information */}
              {activeSection === 'profileInfo' && (
                <div className="settings-panel">
                  <h2>Profile Information</h2>
                  <p className="settings-description">Manage your contact information and profile details</p>
                  
                  <div className="form-group">
                    <label htmlFor="notificationEmail">Notification Email</label>
                    <input
                      type="email"
                      id="notificationEmail"
                      value={settings.profileInfo.notificationEmail}
                      onChange={(e) => handleInputChange('profileInfo', 'notificationEmail', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      value={settings.profileInfo.phone}
                      onChange={(e) => handleInputChange('profileInfo', 'phone', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Preferred Contact Method</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="preferredContactMethod"
                          value="email"
                          checked={settings.profileInfo.preferredContactMethod === 'email'}
                          onChange={() => handleInputChange('profileInfo', 'preferredContactMethod', 'email')}
                        />
                        <span>Email</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="preferredContactMethod"
                          value="phone"
                          checked={settings.profileInfo.preferredContactMethod === 'phone'}
                          onChange={() => handleInputChange('profileInfo', 'preferredContactMethod', 'phone')}
                        />
                        <span>Phone</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="preferredContactMethod"
                          value="app"
                          checked={settings.profileInfo.preferredContactMethod === 'app'}
                          onChange={() => handleInputChange('profileInfo', 'preferredContactMethod', 'app')}
                        />
                        <span>In-App</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Privacy Controls */}
              {activeSection === 'privacy' && (
                <div className="settings-panel">
                  <h2>Account Privacy</h2>
                  <p className="settings-description">Control what information is visible to other users</p>
                  
                  <div className="form-group">
                    <label htmlFor="profileVisibility">Profile Visibility</label>
                    <select
                      id="profileVisibility"
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => handleInputChange('privacy', 'profileVisibility', e.target.value)}
                    >
                      <option value="all">Everyone</option>
                      <option value="connections">Connections Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="contactPermissions">Who Can Contact Me</label>
                    <select
                      id="contactPermissions"
                      value={settings.privacy.contactPermissions}
                      onChange={(e) => handleInputChange('privacy', 'contactPermissions', e.target.value)}
                    >
                      <option value="all">Everyone</option>
                      <option value="connections">Connections Only</option>
                      <option value="verified">Verified Users Only</option>
                      <option value="nobody">Nobody</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="designVisibility">Design/Production Visibility</label>
                    <select
                      id="designVisibility"
                      value={settings.privacy.designVisibility}
                      onChange={(e) => handleInputChange('privacy', 'designVisibility', e.target.value)}
                    >
                      <option value="public">Public - Anyone can see</option>
                      <option value="platform">Platform Users Only</option>
                      <option value="connections">Connections Only</option>
                      <option value="private">Private - Only me</option>
                    </select>
                  </div>
                </div>
              )}
              
              {/* Communication Preferences */}
              {activeSection === 'communication' && (
                <div className="settings-panel">
                  <h2>Communication Preferences</h2>
                  <p className="settings-description">Manage your notification settings and messaging preferences</p>
                  
                  <div className="form-group">
                    <label>Notification Settings</label>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={settings.communication.emailNotifications}
                          onChange={() => handleCheckboxChange('communication', 'emailNotifications')}
                        />
                        <span>Email Notifications</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={settings.communication.pushNotifications}
                          onChange={() => handleCheckboxChange('communication', 'pushNotifications')}
                        />
                        <span>Push Notifications</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={settings.communication.messageNotifications}
                          onChange={() => handleCheckboxChange('communication', 'messageNotifications')}
                        />
                        <span>New Message Alerts</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={settings.communication.orderUpdates}
                          onChange={() => handleCheckboxChange('communication', 'orderUpdates')}
                        />
                        <span>Order Updates</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={settings.communication.marketingEmails}
                          onChange={() => handleCheckboxChange('communication', 'marketingEmails')}
                        />
                        <span>Marketing Emails</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="notificationFrequency">Notification Frequency</label>
                    <select
                      id="notificationFrequency"
                      value={settings.communication.notificationFrequency}
                      onChange={(e) => handleInputChange('communication', 'notificationFrequency', e.target.value)}
                    >
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly Digest</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Summary</option>
                    </select>
                  </div>
                </div>
              )}
              
              {/* Project Preferences */}
              {activeSection === 'projectPreferences' && (
                <div className="settings-panel">
                  <h2>Project Preferences</h2>
                  <p className="settings-description">Configure your default project settings and production preferences</p>
                  
                  <div className="form-group">
                    <label>Preferred Materials</label>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={settings.projectPreferences.preferredMaterials.includes('cotton')}
                          onChange={() => handleArrayToggle('projectPreferences', 'preferredMaterials', 'cotton')}
                        />
                        <span>Cotton</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={settings.projectPreferences.preferredMaterials.includes('polyester')}
                          onChange={() => handleArrayToggle('projectPreferences', 'preferredMaterials', 'polyester')}
                        />
                        <span>Polyester</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={settings.projectPreferences.preferredMaterials.includes('canvas')}
                          onChange={() => handleArrayToggle('projectPreferences', 'preferredMaterials', 'canvas')}
                        />
                        <span>Canvas</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={settings.projectPreferences.preferredMaterials.includes('cardstock')}
                          onChange={() => handleArrayToggle('projectPreferences', 'preferredMaterials', 'cardstock')}
                        />
                        <span>Cardstock</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={settings.projectPreferences.preferredMaterials.includes('vinyl')}
                          onChange={() => handleArrayToggle('projectPreferences', 'preferredMaterials', 'vinyl')}
                        />
                        <span>Vinyl</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="standardTimeline">Standard Production Timeline</label>
                    <select
                      id="standardTimeline"
                      value={settings.projectPreferences.standardTimeline}
                      onChange={(e) => handleInputChange('projectPreferences', 'standardTimeline', e.target.value)}
                    >
                      <option value="rush">Rush (1-2 days)</option>
                      <option value="normal">Normal (3-5 days)</option>
                      <option value="extended">Extended (6-10 days)</option>
                      <option value="flexible">Flexible (Set per project)</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="defaultPricing">Default Pricing Tier</label>
                    <select
                      id="defaultPricing"
                      value={settings.projectPreferences.defaultPricing}
                      onChange={(e) => handleInputChange('projectPreferences', 'defaultPricing', e.target.value)}
                    >
                      <option value="economy">Economy</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>
              )}
              
              {/* Sustainability Preferences */}
              {activeSection === 'sustainability' && (
                <div className="settings-panel">
                  <h2>Sustainability Preferences</h2>
                  <p className="settings-description">Manage your environmental impact and sustainability options</p>
                  
                  <div className="form-group">
                    <label>Sustainability Options</label>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={settings.sustainability.ecoFriendlyMaterials}
                          onChange={() => handleCheckboxChange('sustainability', 'ecoFriendlyMaterials')}
                        />
                        <span>Prioritize Eco-Friendly Materials</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={settings.sustainability.carbonOffset}
                          onChange={() => handleCheckboxChange('sustainability', 'carbonOffset')}
                        />
                        <span>Carbon Offset for Orders</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="minSustainabilityRating">Minimum Sustainability Rating</label>
                    <select
                      id="minSustainabilityRating"
                      value={settings.sustainability.minSustainabilityRating}
                      onChange={(e) => handleInputChange('sustainability', 'minSustainabilityRating', e.target.value)}
                    >
                      <option value="1">1 - No Preference</option>
                      <option value="2">2 - Basic Requirements</option>
                      <option value="3">3 - Medium Standards</option>
                      <option value="4">4 - High Standards</option>
                      <option value="5">5 - Maximum Sustainability</option>
                    </select>
                  </div>
                </div>
              )}
              
              {/* Application Settings */}
              {activeSection === 'appSettings' && (
                <div className="settings-panel">
                  <h2>Application Settings</h2>
                  <p className="settings-description">Customize your app experience and interface preferences</p>
                  
                  <div className="form-group">
                    <label htmlFor="theme">Theme</label>
                    <select
                      id="theme"
                      value={settings.appSettings.theme}
                      onChange={(e) => {
                        handleInputChange('appSettings', 'theme', e.target.value);
                        setThemeMode(e.target.value);
                      }}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="dashboardLayout">Dashboard Layout</label>
                    <select
                      id="dashboardLayout"
                      value={settings.appSettings.dashboardLayout}
                      onChange={(e) => handleInputChange('appSettings', 'dashboardLayout', e.target.value)}
                    >
                      <option value="default">Default</option>
                      <option value="compact">Compact</option>
                      <option value="expanded">Expanded</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="viewMode">View Mode</label>
                    <select
                      id="viewMode"
                      value={settings.appSettings.viewMode}
                      onChange={(e) => handleInputChange('appSettings', 'viewMode', e.target.value)}
                    >
                      <option value="compact">Compact</option>
                      <option value="expanded">Expanded</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="unitSystem">Units of Measurement</label>
                    <select
                      id="unitSystem"
                      value={settings.appSettings.unitSystem}
                      onChange={(e) => handleInputChange('appSettings', 'unitSystem', e.target.value)}
                    >
                      <option value="imperial">Imperial (in, lb, oz)</option>
                      <option value="metric">Metric (cm, g, kg)</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="currency">Currency</label>
                    <select
                      id="currency"
                      value={settings.appSettings.currency}
                      onChange={(e) => handleInputChange('appSettings', 'currency', e.target.value)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="dateFormat">Date Format</label>
                    <select
                      id="dateFormat"
                      value={settings.appSettings.dateFormat}
                      onChange={(e) => handleInputChange('appSettings', 'dateFormat', e.target.value)}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              )}
              
              {/* Security Settings */}
              {activeSection === 'security' && (
                <div className="settings-panel">
                  <h2>Security Settings</h2>
                  <p className="settings-description">Manage your account security and authentication options</p>
                  
                  <div className="form-group">
                    <label>Two-Factor Authentication</label>
                    <div className="toggle-switch">
                      <input
                        type="checkbox"
                        id="twoFactorEnabled"
                        checked={settings.security.twoFactorEnabled}
                        onChange={() => handleCheckboxChange('security', 'twoFactorEnabled')}
                      />
                      <label htmlFor="twoFactorEnabled">
                        {settings.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                    {!settings.security.twoFactorEnabled && (
                      <p className="setting-hint">Enhance your account security with two-factor authentication</p>
                    )}
                    {settings.security.twoFactorEnabled && (
                      <button 
                        type="button" 
                        className="btn btn-outline"
                        style={{ marginTop: '0.5rem' }}
                      >
                        Configure 2FA
                      </button>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Password Management</label>
                    <button type="button" className="btn btn-outline">Change Password</button>
                    <p className="setting-hint">
                      {settings.security.passwordLastChanged 
                        ? `Last changed: ${new Date(settings.security.passwordLastChanged).toLocaleDateString()}`
                        : 'Regularly update your password for better security'}
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label>Login Notifications</label>
                    <div className="toggle-switch">
                      <input
                        type="checkbox"
                        id="loginNotifications"
                        checked={settings.security.loginNotifications}
                        onChange={() => handleCheckboxChange('security', 'loginNotifications')}
                      />
                      <label htmlFor="loginNotifications">
                        {settings.security.loginNotifications ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                    <p className="setting-hint">Receive notifications about new login attempts</p>
                  </div>
                </div>
              )}
              
              {/* Integration Settings */}
              {activeSection === 'integrations' && (
                <div className="settings-panel">
                  <h2>Integrations</h2>
                  <p className="settings-description">Connect external tools and manage API access</p>
                  
                  <div className="form-group">
                    <label>Connected Software</label>
                    <div className="integration-options">
                      <div className="integration-item">
                        <img src="https://via.placeholder.com/40" alt="Adobe" />
                        <div className="integration-details">
                          <strong>Adobe Creative Cloud</strong>
                          <p>Connect your Adobe apps</p>
                        </div>
                        <button type="button" className="btn btn-sm">Connect</button>
                      </div>
                      
                      <div className="integration-item">
                        <img src="https://via.placeholder.com/40" alt="Figma" />
                        <div className="integration-details">
                          <strong>Figma</strong>
                          <p>Import designs directly from Figma</p>
                        </div>
                        <button type="button" className="btn btn-sm">Connect</button>
                      </div>
                      
                      <div className="integration-item">
                        <img src="https://via.placeholder.com/40" alt="Google Drive" />
                        <div className="integration-details">
                          <strong>Google Drive</strong>
                          <p>Access files from Google Drive</p>
                        </div>
                        <button type="button" className="btn btn-sm">Connect</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>API Access</label>
                    <div className="toggle-switch">
                      <input
                        type="checkbox"
                        id="apiEnabled"
                        checked={settings.integrations.apiEnabled}
                        onChange={() => handleCheckboxChange('integrations', 'apiEnabled')}
                      />
                      <label htmlFor="apiEnabled">
                        {settings.integrations.apiEnabled ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                    {settings.integrations.apiEnabled && (
                      <div className="api-settings">
                        <div className="api-key-display">
                          <p>API Key: <code>••••••••••••••••••••••••••</code></p>
                          <button type="button" className="btn btn-sm">Reveal</button>
                          <button type="button" className="btn btn-sm">Regenerate</button>
                        </div>
                        <p className="setting-hint">Keep your API key secure. Never share it publicly.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="settings-actions">
                <button type="submit" className="btn">Save Settings</button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;