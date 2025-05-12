import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import AddressForm from '../components/Forms/AddressForm';
import RecentOrders from '../components/Orders/RecentOrders';

const DesignerProfile = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, loading, updateUserProfile } = useAuth();
  
  // Profile state management
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    brandName: '',
    bio: '',
    portfolioUrl: '',
    designPreferences: '',
    address: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    profileImage: null,
    profileImageUrl: '',
  });
  
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  // Redirect if user is not authenticated or not a designer
  useEffect(() => {
    if (!loading && (!isAuthenticated || currentUser?.role !== 'designer')) {
      navigate('/login');
    }
    
    // Initialize form with current user data
    if (currentUser) {
      setProfile({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        brandName: currentUser.brandName || '',
        bio: currentUser.bio || '',
        portfolioUrl: currentUser.portfolioUrl || '',
        designPreferences: Array.isArray(currentUser.designPreferences) 
          ? currentUser.designPreferences.join(', ') 
          : typeof currentUser.designPreferences === 'object'
            ? JSON.stringify(currentUser.designPreferences)
            : currentUser.designPreferences || '',
        address: currentUser.address || {
          street1: '',
          street2: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        profileImage: null,
        profileImageUrl: currentUser.profileImageUrl || '',
      });
    }
  }, [isAuthenticated, currentUser, loading, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddressChange = (addressData) => {
    setProfile(prev => ({
      ...prev,
      address: addressData
    }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(prev => ({
        ...prev,
        profileImage: file,
        profileImageUrl: URL.createObjectURL(file)
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      // In a real application, you would upload the profile image
      // and save the profile data to your backend
      
      // For the demo, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Parse designPreferences to be an array or object if needed
      let parsedPreferences = profile.designPreferences;
      try {
        // Try to parse as JSON if it looks like a JSON string
        if (profile.designPreferences.startsWith('{') || profile.designPreferences.startsWith('[')) {
          parsedPreferences = JSON.parse(profile.designPreferences);
        } else if (profile.designPreferences.includes(',')) {
          // If it's a comma-separated list, convert to array
          parsedPreferences = profile.designPreferences.split(',').map(item => item.trim());
        }
      } catch (error) {
        // If parsing fails, keep the original string
        console.error('Failed to parse design preferences', error);
      }
      
      // Create updated profile object
      const updatedProfile = {
        ...profile,
        designPreferences: parsedPreferences,
        // In a real app, you would get the URL from your image upload service
        profileImageUrl: profile.profileImageUrl
      };
      delete updatedProfile.profileImage; // Remove the file object
      
      // Update the user profile in your authentication context
      updateUserProfile(updatedProfile);
      
      setSaveSuccess(true);
      setIsEditing(false);
      
      // In a real app, you would redirect or update the UI based on success
    } catch (error) {
      console.error('Failed to update profile', error);
      setSaveError('Failed to update profile. Please try again.');
    }
  };
  
  return (
    <section className="profile-section" style={{ padding: '2rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Designer Profile</h1>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)} 
              className="btn"
            >
              Edit Profile
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(false)} 
              className="btn"
              style={{ backgroundColor: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}
            >
              Cancel
            </button>
          )}
        </div>
        
        {saveSuccess && (
          <div 
            style={{ 
              backgroundColor: '#d4edda', 
              color: '#155724', 
              padding: '1rem', 
              borderRadius: '5px',
              marginBottom: '1rem'
            }}
          >
            Profile updated successfully!
          </div>
        )}
        
        {saveError && (
          <div 
            style={{ 
              backgroundColor: '#f8d7da', 
              color: '#721c24', 
              padding: '1rem', 
              borderRadius: '5px',
              marginBottom: '1rem'
            }}
          >
            {saveError}
          </div>
        )}
        
        <div style={{ display: 'flex', marginBottom: '2rem' }}>
          <div 
            className={`profile-tab ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSection('profile')}
            style={{
              padding: '1rem 2rem',
              borderBottom: activeSection === 'profile' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeSection === 'profile' ? 'var(--primary)' : '#6c757d',
              fontWeight: activeSection === 'profile' ? '600' : '400',
              cursor: 'pointer'
            }}
          >
            Profile
          </div>
          <div 
            className={`profile-tab ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveSection('orders')}
            style={{
              padding: '1rem 2rem',
              borderBottom: activeSection === 'orders' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeSection === 'orders' ? 'var(--primary)' : '#6c757d',
              fontWeight: activeSection === 'orders' ? '600' : '400',
              cursor: 'pointer'
            }}
          >
            Orders
          </div>
        </div>
        
        {activeSection === 'profile' && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
              <div 
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  borderRadius: '50%', 
                  overflow: 'hidden',
                  marginBottom: '1rem',
                  border: '3px solid var(--primary)'
                }}
              >
                {profile.profileImageUrl ? (
                  <img 
                    src={profile.profileImageUrl} 
                    alt={profile.fullName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      backgroundColor: '#e9ecef',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                      color: '#adb5bd'
                    }}
                  >
                    {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'D'}
                  </div>
                )}
              </div>
              
              {isEditing && (
                <div style={{ marginBottom: '1rem' }}>
                  <label 
                    htmlFor="profile-image" 
                    className="btn"
                    style={{ cursor: 'pointer' }}
                  >
                    Upload Photo
                  </label>
                  <input 
                    type="file" 
                    id="profile-image" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
              
              <div style={{ textAlign: 'center' }}>
                <h2>{profile.brandName || profile.fullName}</h2>
                <p style={{ color: '#666' }}>Designer</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: isEditing ? '1fr' : '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Personal Information</h3>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: isEditing ? 'block' : 'none' }}>
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px' }}
                        required
                      />
                    ) : (
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#666' }}>Full Name: </span>
                        <span>{profile.fullName}</span>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: isEditing ? 'block' : 'none' }}>
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px' }}
                        required
                      />
                    ) : (
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#666' }}>Email: </span>
                        <span>{profile.email}</span>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: isEditing ? 'block' : 'none' }}>
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px' }}
                      />
                    ) : (
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#666' }}>Phone: </span>
                        <span>{profile.phone || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Address Information */}
                  <AddressForm 
                    address={profile.address} 
                    onChange={handleAddressChange} 
                    isEditing={isEditing} 
                  />
                </div>
                
                <div>
                  <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Designer Information</h3>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: isEditing ? 'block' : 'none' }}>
                      Brand Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="brandName"
                        value={profile.brandName}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px' }}
                      />
                    ) : (
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#666' }}>Brand Name: </span>
                        <span>{profile.brandName || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: isEditing ? 'block' : 'none' }}>
                      Portfolio URL
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="portfolioUrl"
                        value={profile.portfolioUrl}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px' }}
                      />
                    ) : (
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#666' }}>Portfolio: </span>
                        {profile.portfolioUrl ? (
                          <a 
                            href={profile.portfolioUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: 'var(--primary)' }}
                          >
                            {profile.portfolioUrl}
                          </a>
                        ) : (
                          <span>Not provided</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: isEditing ? 'block' : 'none' }}>
                      Design Preferences
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="designPreferences"
                        value={profile.designPreferences}
                        onChange={handleInputChange}
                        placeholder="e.g., Minimalist, Modern, Typography (comma-separated)"
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px' }}
                      />
                    ) : (
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#666' }}>Design Preferences: </span>
                        <span>
                          {profile.designPreferences 
                            ? typeof profile.designPreferences === 'string' 
                              ? profile.designPreferences 
                              : Array.isArray(profile.designPreferences) 
                                ? profile.designPreferences.join(', ') 
                                : JSON.stringify(profile.designPreferences)
                            : 'Not provided'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: isEditing ? 'block' : 'none' }}>
                  Bio / About Me
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    rows="4"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px' }}
                  ></textarea>
                ) : (
                  <div>
                    <h3 style={{ marginBottom: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Bio</h3>
                    <p style={{ lineHeight: '1.6' }}>
                      {profile.bio || 'No bio provided yet.'}
                    </p>
                  </div>
                )}
              </div>
              
              {isEditing && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn">
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
        
        {activeSection === 'orders' && (
          <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <RecentOrders userRole="designer" />
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button 
            onClick={() => navigate('/designer-dashboard')} 
            className="btn"
            style={{ backgroundColor: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}
          >
            Back to Dashboard
          </button>
          
          {!isEditing && activeSection === 'profile' && (
            <button onClick={() => setIsEditing(true)} className="btn">
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default DesignerProfile;