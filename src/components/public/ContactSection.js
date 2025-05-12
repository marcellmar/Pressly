import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Mail, Phone, Globe, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

const ContactSection = ({ designer, portfolio }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    addTestimonial: false,
    rating: 5,
  });
  
  const [status, setStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle switch toggle
  const handleSwitchChange = (checked) => {
    setFormData({
      ...formData,
      addTestimonial: checked
    });
  };
  
  // Handle rating selection
  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate form submission with a delay
    setStatus({
      submitted: true,
      success: null,
      message: 'Sending your message...'
    });
    
    setTimeout(() => {
      // Simulate successful submission
      if (formData.name && formData.email && formData.message) {
        setStatus({
          submitted: true,
          success: true,
          message: 'Your message has been sent! The designer will respond to you soon.'
        });
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          addTestimonial: false,
          rating: 5
        });
      } else {
        // Simulate error
        setStatus({
          submitted: true,
          success: false,
          message: 'Please fill out all required fields before submitting.'
        });
      }
    }, 1500);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Designer Contact Info */}
      <div className="md:col-span-1">
        <h2 className="text-xl font-bold mb-4">Contact Information</h2>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
                <div>
                  <p className="font-medium">Email</p>
                  <a 
                    href={`mailto:${designer.email}`} 
                    className="text-blue-600 hover:underline"
                    style={{ color: 'var(--portfolio-primary)' }}
                  >
                    {designer.email}
                  </a>
                </div>
              </div>
              
              {designer.phone && (
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a 
                      href={`tel:${designer.phone}`} 
                      className="text-blue-600 hover:underline"
                      style={{ color: 'var(--portfolio-primary)' }}
                    >
                      {designer.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {designer.website && (
                <div className="flex items-start">
                  <Globe className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
                  <div>
                    <p className="font-medium">Website</p>
                    <a 
                      href={designer.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                      style={{ color: 'var(--portfolio-primary)' }}
                    >
                      {designer.website}
                    </a>
                  </div>
                </div>
              )}
              
              {designer.location && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p>{designer.location}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="font-medium mb-2">Availability</h3>
              <p className="text-green-600 flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Available for new projects
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Response time: usually within 24 hours
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>
            All communication through Pressly is protected by our community guidelines.
          </p>
        </div>
      </div>
      
      {/* Contact Form */}
      <div className="md:col-span-2">
        <h2 className="text-xl font-bold mb-4">Send a Message</h2>
        
        {status.submitted && status.success !== null && (
          <Alert 
            variant={status.success ? "success" : "destructive"} 
            className="mb-4"
          >
            {status.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {status.success ? 'Success' : 'Error'}
            </AlertTitle>
            <AlertDescription>
              {status.message}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Your Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="What's this regarding?"
            />
          </div>
          
          <div>
            <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={5}
              required
              placeholder="Tell the designer about your project or inquiry..."
            />
          </div>
          
          <div className="pt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="add-testimonial"
                checked={formData.addTestimonial}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="add-testimonial">Include a testimonial about this designer's work</Label>
            </div>
            
            {formData.addTestimonial && (
              <div className="mt-4 p-4 border rounded-md bg-gray-50">
                <Label className="mb-2 block">Rating</Label>
                <div className="flex items-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="text-gray-300 hover:text-yellow-400 focus:outline-none focus:ring-0"
                    >
                      <svg
                        className={`h-6 w-6 ${
                          formData.rating >= star ? 'text-yellow-400 fill-yellow-400' : ''
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {formData.rating === 5 && 'Excellent'}
                    {formData.rating === 4 && 'Very Good'}
                    {formData.rating === 3 && 'Good'}
                    {formData.rating === 2 && 'Fair'}
                    {formData.rating === 1 && 'Poor'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  Your testimonial will be included with your message and may appear on the designer's portfolio.
                </div>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full sm:w-auto" 
            style={{ backgroundColor: 'var(--portfolio-primary)' }}
            disabled={status.submitted && status.success === null}
          >
            {status.submitted && status.success === null ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactSection;