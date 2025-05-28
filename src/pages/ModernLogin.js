import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { 
  Mail, 
  Lock, 
  User, 
  Printer, 
  AlertCircle, 
  ArrowRight,
  Building2,
  Sparkles,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const ModernLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, currentUser, error, clearError, isAuthenticated } = useAuth();

  // Get the redirect path from location state, or default based on role
  const from = location.state?.from?.pathname || null;
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState('designer'); // 'designer' or 'producer'
  const [showSuccess, setShowSuccess] = useState(false);

  // Clear errors on mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Determine redirect path based on role if no specific path was requested
      const redirectPath = from || (currentUser.role === 'producer' ? '/dashboard' : '/dashboard');
      navigate(redirectPath);
    }
  }, [isAuthenticated, currentUser, navigate, from]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear errors when user types
    if (loginError) setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        throw new Error('Please enter both email and password.');
      }

      // Attempt to log in
      await login(formData.email, formData.password);
      
      // Show success briefly
      setShowSuccess(true);
      
      // Redirect after a short delay for UX
      setTimeout(() => {
        const redirectPath = from || '/dashboard';
        navigate(redirectPath);
      }, 500);
      
    } catch (err) {
      console.error('Login error:', err);
      setLoginError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo login functions
  const handleDemoLogin = async (type) => {
    const credentials = {
      designer: { email: 'designer@pressly.com', password: 'password123' },
      producer: { email: 'producer@pressly.com', password: 'password123' }
    };

    setFormData({
      ...credentials[type],
      rememberMe: false
    });

    try {
      setLoading(true);
      setLoginError('');
      await login(credentials[type].email, credentials[type].password);
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
      
    } catch (err) {
      console.error('Demo login error:', err);
      setLoginError('Failed to log in with demo account.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    // Navigate to dashboard without authentication
    navigate('/dashboard');
  };

  const benefits = {
    designer: [
      'Upload and validate print files instantly',
      'Get matched with verified local printers',
      'Track orders and production status',
      'Access design optimization tools'
    ],
    producer: [
      'Receive qualified print requests',
      'Showcase your portfolio and capabilities',
      'Manage production schedule efficiently',
      'Access business analytics dashboard'
    ]
  };

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
            Welcome back to your print network
          </h2>
          
          <p style={{ 
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '48px'
          }}>
            Connect with Chicago's best print shops and bring your designs to life.
          </p>

          {/* Account type selector */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ 
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: '12px'
            }}>
              I am a...
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setAccountType('designer')}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: `2px solid ${accountType === 'designer' ? 'var(--text-primary)' : 'var(--border-light)'}`,
                  borderRadius: 'var(--radius-md)',
                  background: accountType === 'designer' ? 'var(--bg-tertiary)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <User style={{ width: '20px', height: '20px', marginBottom: '8px' }} />
                <div style={{ fontWeight: 600 }}>Designer</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Need printing services
                </div>
              </button>
              <button
                onClick={() => setAccountType('producer')}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: `2px solid ${accountType === 'producer' ? 'var(--text-primary)' : 'var(--border-light)'}`,
                  borderRadius: 'var(--radius-md)',
                  background: accountType === 'producer' ? 'var(--bg-tertiary)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Building2 style={{ width: '20px', height: '20px', marginBottom: '8px' }} />
                <div style={{ fontWeight: 600 }}>Print Shop</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Offer printing services
                </div>
              </button>
            </div>
          </div>

          {/* Benefits list */}
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
              {accountType === 'designer' ? 'Designer' : 'Print Shop'} Benefits
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {benefits[accountType].map((benefit, index) => (
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
        </div>

        {/* Right side - Login form */}
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
                Welcome back!
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Redirecting to your dashboard...
              </p>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '32px' }}>
                Sign in to your account
              </h2>

              {(loginError || error) && (
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
                    {loginError || error}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
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
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <label style={{ 
                      fontWeight: 500,
                      fontSize: '14px'
                    }}>
                      Password
                    </label>
                    <Link 
                      to="/forgot-password" 
                      style={{ 
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        textDecoration: 'none'
                      }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
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

                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    style={{ 
                      width: '16px',
                      height: '16px',
                      marginRight: '8px'
                    }}
                  />
                  <label 
                    htmlFor="rememberMe" 
                    style={{ 
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Remember me for 30 days
                  </label>
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
                  {loading ? 'Signing in...' : 'Sign in'}
                  {!loading && <ArrowRight style={{ width: '18px', height: '18px' }} />}
                </button>
              </form>

              {/* Divider */}
              <div style={{ 
                position: 'relative',
                margin: '32px 0',
                textAlign: 'center'
              }}>
                <div style={{ 
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'var(--border-light)'
                }} />
                <span style={{ 
                  position: 'relative',
                  background: 'var(--bg-primary)',
                  padding: '0 16px',
                  fontSize: '14px',
                  color: 'var(--text-tertiary)'
                }}>
                  Or continue with
                </span>
              </div>

              {/* Quick actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('designer')}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  <User style={{ width: '18px', height: '18px', marginRight: '8px' }} />
                  Designer Demo Account
                </button>
                
                <button
                  type="button"
                  onClick={() => handleDemoLogin('producer')}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  <Building2 style={{ width: '18px', height: '18px', marginRight: '8px' }} />
                  Print Shop Demo Account
                </button>

                <button
                  type="button"
                  onClick={handleContinueAsGuest}
                  className="btn btn-ghost"
                  style={{ width: '100%' }}
                >
                  Continue as Guest
                </button>
              </div>

              {/* Sign up link */}
              <div style={{ 
                textAlign: 'center',
                marginTop: '32px',
                paddingTop: '32px',
                borderTop: '1px solid var(--border-light)'
              }}>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  New to Pressly?{' '}
                  <Link 
                    to="/register" 
                    style={{ 
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    Create an account
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

export default ModernLogin;