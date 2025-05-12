import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { AlertCircle, User, Lock, Printer } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, currentUser, error, clearError, isAuthenticated } = useAuth();

  // Get the redirect path from location state, or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    // Clear any previous auth errors when the component mounts
    clearError();

    if (isAuthenticated && currentUser) {
      // Redirect to the original page the user was trying to access, or dashboard
      navigate(from);
    }
  }, [isAuthenticated, currentUser, navigate, clearError, from]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      // Validate inputs
      if (formData.email === '' || formData.password === '') {
        throw new Error('Please enter both email and password.');
      }

      // Attempt to log in
      await login(formData.email, formData.password);

      // Save login state (already handled by auth.js)

      // Redirect to the original page the user was trying to access
      navigate(from);
    } catch (err) {
      console.error('Login error:', err);
      setLoginError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Demo login credentials
  const demoDesignerLogin = async () => {
    const demoCredentials = {
      email: 'designer@pressly.com',
      password: 'password123',
      rememberMe: false
    };

    setFormData(demoCredentials);

    // Auto-login with demo credentials
    try {
      setLoading(true);
      setLoginError('');
      await login(demoCredentials.email, demoCredentials.password);

      // Redirect to the original page the user was trying to access
      navigate(from);
    } catch (err) {
      console.error('Demo login error:', err);
      setLoginError(err.message || 'Failed to log in with demo account.');
    } finally {
      setLoading(false);
    }
  };

  const demoProducerLogin = async () => {
    const demoCredentials = {
      email: 'producer@pressly.com',
      password: 'password123',
      rememberMe: false
    };

    setFormData(demoCredentials);

    // Auto-login with demo credentials
    try {
      setLoading(true);
      setLoginError('');
      await login(demoCredentials.email, demoCredentials.password);

      // Redirect to the original page the user was trying to access
      navigate(from);
    } catch (err) {
      console.error('Demo login error:', err);
      setLoginError(err.message || 'Failed to log in with demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section with background for login */}
      <section className="relative flex-grow bg-gradient-to-r from-blue-900 to-indigo-900 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1470&auto=format&fit=crop" 
            alt="Printing network background" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="container mx-auto px-4 py-16 flex flex-col items-center relative z-10">
          <div className="flex items-center mb-8">
            <div className="bg-white p-3 rounded-lg mr-4">
              <Printer className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold text-white">
              Pressly
            </h1>
          </div>
          
          <Card className="w-full max-w-md shadow-lg border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Sign in to continue to your Pressly account
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {(loginError || error) && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500 mt-0.5" />
                  <div>{loginError || error}</div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10 px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="block text-sm font-medium">Password</label>
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      id="password" 
                      name="password" 
                      type="password" 
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required 
                      className="pl-10 px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="rememberMe" 
                    name="rememberMe" 
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm font-medium text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Demo accounts</span>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={demoDesignerLogin}
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Designer Demo
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={demoProducerLogin}
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Producer Demo
                  </Button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <div className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Login;