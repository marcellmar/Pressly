import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { 
  Mail, 
  Lock, 
  User, 
  Phone,
  Building2,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Sparkles,
  Printer
} from 'lucide-react';

const ModernRegister = () => {
  const navigate = useNavigate();
  const { register, currentUser, error, clearError, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    userType: 'designer',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: account type, 2: details

  // Clear errors on mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear errors when user types
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
    if (registerError) setRegisterError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRegisterError('');
    setPasswordError('');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords don't match");
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    
    try {
      // Additional validation for producers
      if (formData.userType === 'producer' && !formData.businessName.trim()) {
        setRegisterError('Business name is required for print shops');
        setLoading(false);
        return;
      }
      
      // Prepare registration data
      const userData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone || null,
        role: formData.userType,
        businessName: formData.userType === 'producer' ? formData.businessName : null
      };
      
      // Register the user
      await register(userData);
      
      // Show success message
      setShowSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (err) {
      console.error('Registration error:', err);
      setRegisterError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = {
    designer: [
      'Upload unlimited design files',
      'Get instant quotes from local printers',
      'Track production in real-time',
      'Access to 500+ verified print shops'
    ],
    producer: [
      'Receive qualified print requests',
      'Set your own pricing and terms',
      'Manage production schedule',
      'Analytics and growth insights'
    ]
  };

  const features = [
    { icon: '🎯', text: 'Smart matching algorithm' },
    { icon: '⚡', text: 'Real-time collaboration' },
    { icon: '🔒', text: 'Secure file transfers' },
    { icon: '💳', text: 'Protected payments' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--bg-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '1200px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
        alignItems: 'center'
      }}>
        {/* Left side - Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ 
              width: '48px',
              height: '48px',
              background: 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px'
            }}>
              <Printer style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Pressly</h1>
          </div>

          <h2 style={{ 
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '16px',
            lineHeight: 1.2
          }}>
            Join Chicago's largest print network
          </h2>
          
          <p style={{ 
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '48px'
          }}>
            Whether you're a designer looking for quality printing or a print shop ready to grow your business, Pressly connects you with the right partners.
          </p>

          {/* Features Grid */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '48px'
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{feature.icon}</span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* Benefits for selected type */}
          {currentStep === 2 && (
            <div>
              <h3 style={{ 
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Sparkles style={{ width: '18px', height: '18px' }} />
                {formData.userType === 'designer' ? 'Designer' : 'Print Shop'} Benefits
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {benefits[formData.userType].map((benefit, index) => (
                  <li key={index} style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <CheckCircle style={{ 
                      width: '16px', 
                      height: '16px', 
                      color: 'var(--accent-green)',
                      flexShrink: 0
                    }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right side - Registration form */}
        <div className="card" style={{ padding: '48px' }}>
          {showSuccess ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ 
                width: '80px',
                height: '80px',
                background: 'var(--accent-green)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <CheckCircle style={{ width: '40px', height: '40px', color: 'white' }} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
                Welcome to Pressly!
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Setting up your account...
              </p>
            </div>
          ) : (
            <>
              {/* Step 1: Account Type */}
              {currentStep === 1 && (
                <>
                  <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
                    Create your account
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    First, tell us what brings you to Pressly
                  </p>

                  <div style={{ marginBottom: '32px' }}>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '16px',
                      fontWeight: 500,
                      fontSize: '14px'
                    }}>
                      I want to...
                    </label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, userType: 'designer' })}
                        style={{
                          flex: 1,
                          padding: '24px',
                          border: `2px solid ${formData.userType === 'designer' ? 'var(--text-primary)' : 'var(--border-light)'}`,
                          borderRadius: 'var(--radius-md)',
                          background: formData.userType === 'designer' ? 'var(--bg-tertiary)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <User style={{ width: '24px', height: '24px', marginBottom: '12px' }} />
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                          Get Printing Done
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          I need printing services
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, userType: 'producer' })}
                        style={{
                          flex: 1,
                          padding: '24px',
                          border: `2px solid ${formData.userType === 'producer' ? 'var(--text-primary)' : 'var(--border-light)'}`,
                          borderRadius: 'var(--radius-md)',
                          background: formData.userType === 'producer' ? 'var(--bg-tertiary)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <Building2 style={{ width: '24px', height: '24px', marginBottom: '12px' }} />
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                          Offer Printing
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          I'm a print shop
                        </div>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentStep(2)}
                    className="btn btn-primary"
                    style={{ 
                      width: '100%',
                      padding: '12px',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    Continue
                    <ArrowRight style={{ width: '18px', height: '18px' }} />
                  </button>
                </>
              )}

              {/* Step 2: Account Details */}
              {currentStep === 2 && (
                <>
                  <div style={{ marginBottom: '32px' }}>
                    <button
                      onClick={() => setCurrentStep(1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: 0,
                        marginBottom: '16px'
                      }}
                    >
                      ← Back
                    </button>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
                      {formData.userType === 'designer' ? 'Designer' : 'Print Shop'} Account
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      Complete your registration to get started
                    </p>
                  </div>

                  {(registerError || error || passwordError) && (
                    <div style={{
                      background: 'var(--error-bg)',
                      border: '1px solid var(--error-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 16px',
                      marginBottom: '24px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <AlertCircle style={{ 
                        width: '20px', 
                        height: '20px', 
                        color: 'var(--error-text)',
                        flexShrink: 0,
                        marginTop: '2px'
                      }} />
                      <div style={{ color: 'var(--error-text)', fontSize: '14px' }}>
                        {registerError || error || passwordError}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 500,
                        fontSize: '14px'
                      }}>
                        Full name
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px 12px 44px',
                            border: '1px solid var(--border-light)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '16px',
                            transition: 'border-color var(--transition-fast)',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                        />
                        <User style={{ 
                          position: 'absolute',
                          left: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '20px',
                          height: '20px',
                          color: 'var(--text-tertiary)'
                        }} />
                      </div>
                    </div>

                    {formData.userType === 'producer' && (
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                          display: 'block',
                          marginBottom: '8px',
                          fontWeight: 500,
                          fontSize: '14px'
                        }}>
                          Business name
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            placeholder="Acme Print Shop"
                            required
                            style={{
                              width: '100%',
                              padding: '12px 16px 12px 44px',
                              border: '1px solid var(--border-light)',
                              borderRadius: 'var(--radius-md)',
                              fontSize: '16px',
                              transition: 'border-color var(--transition-fast)',
                              outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                          />
                          <Building2 style={{ 
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '20px',
                            height: '20px',
                            color: 'var(--text-tertiary)'
                          }} />
                        </div>
                      </div>
                    )}

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 500,
                        fontSize: '14px'
                      }}>
                        Email address
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="name@example.com"
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px 12px 44px',
                            border: '1px solid var(--border-light)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '16px',
                            transition: 'border-color var(--transition-fast)',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                        />
                        <Mail style={{ 
                          position: 'absolute',
                          left: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '20px',
                          height: '20px',
                          color: 'var(--text-tertiary)'
                        }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 500,
                        fontSize: '14px'
                      }}>
                        Phone (optional)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(555) 123-4567"
                          style={{
                            width: '100%',
                            padding: '12px 16px 12px 44px',
                            border: '1px solid var(--border-light)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '16px',
                            transition: 'border-color var(--transition-fast)',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                        />
                        <Phone style={{ 
                          position: 'absolute',
                          left: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '20px',
                          height: '20px',
                          color: 'var(--text-tertiary)'
                        }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 500,
                        fontSize: '14px'
                      }}>
                        Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a password"
                          required
                          style={{
                            width: '100%',
                            padding: '12px 48px 12px 44px',
                            border: '1px solid var(--border-light)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '16px',
                            transition: 'border-color var(--transition-fast)',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                        />
                        <Lock style={{ 
                          position: 'absolute',
                          left: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '20px',
                          height: '20px',
                          color: 'var(--text-tertiary)'
                        }} />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            color: 'var(--text-tertiary)'
                          }}
                        >
                          {showPassword ? (
                            <EyeOff style={{ width: '20px', height: '20px' }} />
                          ) : (
                            <Eye style={{ width: '20px', height: '20px' }} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 500,
                        fontSize: '14px'
                      }}>
                        Confirm password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          required
                          style={{
                            width: '100%',
                            padding: '12px 48px 12px 44px',
                            border: '1px solid var(--border-light)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '16px',
                            transition: 'border-color var(--transition-fast)',
                            outline: 'none'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--text-primary)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                        />
                        <Lock style={{ 
                          position: 'absolute',
                          left: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '20px',
                          height: '20px',
                          color: 'var(--text-tertiary)'
                        }} />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{
                            position: 'absolute',
                            right: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            color: 'var(--text-tertiary)'
                          }}
                        >
                          {showConfirmPassword ? (
                            <EyeOff style={{ width: '20px', height: '20px' }} />
                          ) : (
                            <Eye style={{ width: '20px', height: '20px' }} />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                      style={{ 
                        width: '100%',
                        padding: '12px',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      {loading ? 'Creating account...' : 'Create account'}
                      {!loading && <ArrowRight style={{ width: '18px', height: '18px' }} />}
                    </button>

                    <p style={{ 
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      textAlign: 'center',
                      marginTop: '16px'
                    }}>
                      By creating an account, you agree to our{' '}
                      <Link to="/terms" style={{ color: 'var(--text-primary)' }}>Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" style={{ color: 'var(--text-primary)' }}>Privacy Policy</Link>
                    </p>
                  </form>
                </>
              )}

              {/* Sign in link */}
              <div style={{ 
                textAlign: 'center',
                marginTop: '32px',
                paddingTop: '32px',
                borderTop: '1px solid var(--border-light)'
              }}>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    style={{ 
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernRegister;