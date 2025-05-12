import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  AlertCircle,
  User,
  Mail,
  Lock,
  Phone,
  Briefcase,
  Printer,
  UserPlus
} from 'lucide-react';

const Register = () => {
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

  // Check if user is already logged in
  useEffect(() => {
    // Clear any previous auth errors when the component mounts
    clearError();
    
    if (isAuthenticated && currentUser) {
      // Redirect to dashboard
      navigate('/dashboard');
    }
  }, [isAuthenticated, currentUser, navigate, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear password error if either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRegisterError('');
    setPasswordError('');
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords don't match");
      setLoading(false);
      return;
    }
    
    try {
      // Ensure businessName is required for producers
      if (formData.userType === 'producer' && !formData.businessName.trim()) {
        setRegisterError('Business name is required for producers');
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
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setRegisterError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section with background for registration */}
      <section className="relative flex-grow bg-gradient-to-r from-blue-900 to-indigo-900 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1470&auto=format&fit=crop" 
            alt="Printing network background" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="container mx-auto px-4 py-12 flex flex-col items-center relative z-10">
          <div className="flex items-center mb-8">
            <div className="bg-white p-3 rounded-lg mr-4">
              <Printer className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold text-white">
              Pressly
            </h1>
          </div>
          
          <Card className="w-full max-w-lg shadow-lg border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                <div className="flex items-center justify-center gap-2">
                <UserPlus className="h-6 w-6 text-blue-600" />
                  <span>Create an Account</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-center">
                  Join the Pressly network and start connecting with print professionals
                </CardDescription>
            </CardHeader>
            
            <CardContent>
              {(registerError || error) && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500 mt-0.5" />
                  <div>{registerError || error}</div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="userType" className="block text-sm font-medium">I am a:</label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, userType: 'designer'})}
                      className={`flex flex-col items-center p-4 rounded-lg border ${formData.userType === 'designer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <User className={`h-8 w-8 mb-2 ${formData.userType === 'designer' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className={`font-medium ${formData.userType === 'designer' ? 'text-blue-600' : 'text-gray-700'}`}>Designer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, userType: 'producer'})}
                      className={`flex flex-col items-center p-4 rounded-lg border ${formData.userType === 'producer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <Printer className={`h-8 w-8 mb-2 ${formData.userType === 'producer' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className={`font-medium ${formData.userType === 'producer' ? 'text-blue-600' : 'text-gray-700'}`}>Print Producer</span>
                    </button>
                    <input
                      type="hidden"
                      id="userType"
                      name="userType"
                      value={formData.userType}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      id="fullName" 
                      name="fullName" 
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="pl-10 px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      id="email" 
                      name="email" 
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10 px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      id="password" 
                      name="password" 
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required 
                      minLength="8"
                      className="pl-10 px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required 
                      minLength="8"
                      className="pl-10 px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-600 mt-1">{passwordError}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium">Phone Number (optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      id="phone" 
                      name="phone" 
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {formData.userType === 'producer' && (
                  <div className="space-y-2">
                    <label htmlFor="businessName" className="block text-sm font-medium">Business Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        id="businessName" 
                        name="businessName" 
                        type="text"
                        value={formData.businessName}
                        onChange={handleChange}
                        required={formData.userType === 'producer'}
                        className="pl-10 px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <Printer className="w-8 h-8 text-blue-400 mr-3" />
              <span className="text-xl font-bold">Pressly</span>
            </div>
            <div className="flex gap-8">
              <Link to="/about" className="text-gray-300 hover:text-white">About</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
              <Link to="/privacy" className="text-gray-300 hover:text-white">Privacy</Link>
              <Link to="/terms" className="text-gray-300 hover:text-white">Terms</Link>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 Pressly. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;