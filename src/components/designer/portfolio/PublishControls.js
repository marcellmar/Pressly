import React, { useState } from 'react';
import { Switch } from '../../../components/ui/switch';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Copy, Globe, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';

const PublishControls = ({ isPublic, onChange, portfolioId }) => {
  const [alertStatus, setAlertStatus] = useState({ show: false, type: '', message: '' });
  
  // Generate portfolio URL based on ID
  const portfolioSlug = portfolioId ? 
    `designer-${portfolioId.slice(0, 8)}` : 
    'your-portfolio-slug';
    
  const portfolioUrl = `${window.location.origin}/portfolio/${portfolioSlug}`;
  
  // Handle publish toggle
  const handlePublishToggle = (checked) => {
    onChange(checked);
    
    // Show appropriate alert
    if (checked) {
      setAlertStatus({
        show: true,
        type: 'success',
        message: 'Your portfolio is now public and can be viewed by anyone with the link!'
      });
    } else {
      setAlertStatus({
        show: true,
        type: 'info',
        message: 'Your portfolio is now private and can only be viewed by you.'
      });
    }
    
    // Hide alert after 5 seconds
    setTimeout(() => {
      setAlertStatus({ show: false, type: '', message: '' });
    }, 5000);
  };
  
  // Copy portfolio URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(portfolioUrl).then(
      () => {
        setAlertStatus({
          show: true,
          type: 'success',
          message: 'Portfolio URL copied to clipboard!'
        });
        
        // Hide alert after 3 seconds
        setTimeout(() => {
          setAlertStatus({ show: false, type: '', message: '' });
        }, 3000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
        setAlertStatus({
          show: true,
          type: 'error',
          message: 'Failed to copy URL. Please try again.'
        });
      }
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="font-medium">Portfolio Visibility</div>
          <div className="text-sm text-gray-500">
            Control who can view your portfolio
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="publish-toggle"
            checked={isPublic}
            onCheckedChange={handlePublishToggle}
          />
          <label 
            htmlFor="publish-toggle"
            className={`text-sm font-medium ${isPublic ? 'text-green-600' : 'text-gray-500'}`}
          >
            {isPublic ? 'Public' : 'Private'}
          </label>
        </div>
      </div>
      
      {alertStatus.show && (
        <Alert variant={alertStatus.type === 'error' ? 'destructive' : (alertStatus.type === 'info' ? 'default' : 'success')}>
          {alertStatus.type === 'error' ? (
            <AlertCircle className="h-4 w-4" />
          ) : alertStatus.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <AlertTitle>
            {alertStatus.type === 'error' ? 'Error' : 
             alertStatus.type === 'success' ? 'Success' : 
             'Information'}
          </AlertTitle>
          <AlertDescription>
            {alertStatus.message}
          </AlertDescription>
        </Alert>
      )}
      
      <Card className={isPublic ? 'border-green-100' : 'border-gray-200'}>
        <CardContent className="p-4">
          {isPublic ? (
            <div className="space-y-3">
              <div className="flex items-center text-green-600">
                <Globe className="h-5 w-5 mr-2" />
                <span className="font-medium">Your portfolio is public</span>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-700 mb-2">Share your portfolio link:</div>
                <div className="flex">
                  <Input
                    value={portfolioUrl}
                    readOnly
                    className="rounded-r-none"
                  />
                  <Button 
                    onClick={copyToClipboard}
                    className="rounded-l-none"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                Anyone with this link can view your portfolio. Your email and contact details will only be visible if you've chosen to share them in your portfolio settings.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Lock className="h-5 w-5 mr-2" />
                <span className="font-medium">Your portfolio is private</span>
              </div>
              
              <div className="text-sm text-gray-500">
                Only you can view your portfolio. Activate the public option above to get a shareable link.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="pt-2">
        <h3 className="font-medium mb-2">Privacy Options</h3>
        <div className="space-y-2">
          <div className="flex items-start">
            <Switch id="show-contact-info" />
            <label htmlFor="show-contact-info" className="text-sm ml-2 cursor-pointer">
              <div className="font-medium">Show Contact Information</div>
              <div className="text-gray-500">Allow potential clients to contact you directly through your portfolio</div>
            </label>
          </div>
          
          <div className="flex items-start">
            <Switch id="allow-testimonials" defaultChecked />
            <label htmlFor="allow-testimonials" className="text-sm ml-2 cursor-pointer">
              <div className="font-medium">Allow Client Testimonials</div>
              <div className="text-gray-500">Let clients submit reviews and testimonials for your work</div>
            </label>
          </div>
          
          <div className="flex items-start">
            <Switch id="show-in-search" defaultChecked />
            <label htmlFor="show-in-search" className="text-sm ml-2 cursor-pointer">
              <div className="font-medium">Show in Pressly Search</div>
              <div className="text-gray-500">Make your portfolio discoverable by potential clients within Pressly</div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishControls;