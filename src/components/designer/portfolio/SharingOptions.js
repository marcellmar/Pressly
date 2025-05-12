import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Input } from '../../../components/ui/input';
import { Switch } from '../../../components/ui/switch';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Copy, Twitter, Instagram, Facebook, Linkedin, Link, CheckCircle, Share2, Globe, Code } from 'lucide-react';

const SharingOptions = ({ portfolio, onPublishChange }) => {
  const [activeTab, setActiveTab] = useState('link');
  const [copySuccess, setCopySuccess] = useState(false);
  
  const portfolioSlug = portfolio?.id ? 
    `designer-${portfolio.id.slice(0, 8)}` : 
    'your-portfolio-slug';
    
  const portfolioUrl = `${window.location.origin}/portfolio/${portfolioSlug}`;
  
  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    });
  };
  
  // Generate social media sharing links
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(portfolioUrl)}&text=${encodeURIComponent(`Check out my design portfolio: ${portfolio?.title || 'My Design Portfolio'}`)}`;
  
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(portfolioUrl)}`;
  
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`;
  
  // Generate embed code for portfolio
  const embedCode = `<iframe src="${portfolioUrl}/embed" width="100%" height="600" style="border:none;"></iframe>`;
  
  // Handle publishing switch
  const handlePublishSwitch = (checked) => {
    onPublishChange(checked);
  };
  
  return (
    <div className="space-y-6">
      {/* Publish Control */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{portfolio?.isPublic ? 'Your portfolio is public' : 'Your portfolio is private'}</h3>
              <p className="text-sm text-gray-500">
                {portfolio?.isPublic 
                  ? 'Anyone with the link can view your portfolio' 
                  : 'Only you can view your portfolio'
                }
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="public-switch"
                checked={portfolio?.isPublic || false}
                onCheckedChange={handlePublishSwitch}
              />
              <label 
                htmlFor="public-switch" 
                className={`text-sm ${portfolio?.isPublic ? 'text-green-600' : 'text-gray-500'}`}
              >
                {portfolio?.isPublic ? <Globe className="h-4 w-4" /> : 'Make Public'}
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Portfolio Link Card */}
      {portfolio?.isPublic && (
        <>
          <Card>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="link" className="flex items-center">
                    <Link className="h-4 w-4 mr-2" />
                    Direct Link
                  </TabsTrigger>
                  <TabsTrigger value="social" className="flex items-center">
                    <Share2 className="h-4 w-4 mr-2" />
                    Social Media
                  </TabsTrigger>
                  <TabsTrigger value="embed" className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    Embed
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="link">
                  <div className="space-y-4">
                    <div className="flex">
                      <Input
                        value={portfolioUrl}
                        readOnly
                        className="rounded-r-none"
                      />
                      <Button 
                        onClick={() => copyToClipboard(portfolioUrl)}
                        className="rounded-l-none"
                      >
                        {copySuccess ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-500">
                      Share this link directly with clients or on your website to showcase your design work.
                    </div>
                    
                    {copySuccess && (
                      <Alert className="bg-green-50 text-green-800 border-green-100">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Link copied to clipboard!
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="social">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        onClick={() => window.open(twitterUrl, '_blank')}
                        className="flex justify-center items-center bg-[#1DA1F2] hover:bg-[#1a94e0]"
                      >
                        <Twitter className="h-5 w-5 mr-2" />
                        Share on Twitter
                      </Button>
                      <Button 
                        onClick={() => window.open(facebookUrl, '_blank')}
                        className="flex justify-center items-center bg-[#4267B2] hover:bg-[#3b5998]"
                      >
                        <Facebook className="h-5 w-5 mr-2" />
                        Share on Facebook
                      </Button>
                      <Button 
                        onClick={() => window.open(linkedinUrl, '_blank')}
                        className="flex justify-center items-center bg-[#0077B5] hover:bg-[#006699]"
                      >
                        <Linkedin className="h-5 w-5 mr-2" />
                        Share on LinkedIn
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          copyToClipboard(`Check out my design portfolio: ${portfolioUrl}`);
                        }}
                        className="flex justify-center items-center"
                      >
                        <Instagram className="h-5 w-5 mr-2" />
                        Copy for Instagram
                      </Button>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-500">
                      Share your portfolio directly to your social media channels to grow your audience and attract new clients.
                    </div>
                    
                    {copySuccess && (
                      <Alert className="bg-green-50 text-green-800 border-green-100">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Text copied to clipboard! Paste it in your Instagram bio or post.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="embed">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Embed Code
                      </label>
                      <div className="flex">
                        <Input
                          value={embedCode}
                          readOnly
                          className="font-mono text-xs rounded-r-none"
                        />
                        <Button 
                          onClick={() => copyToClipboard(embedCode)}
                          className="rounded-l-none"
                        >
                          {copySuccess ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-500">
                      Use this code to embed your portfolio directly in your website or blog.
                    </div>
                    
                    <div className="border rounded-md p-4 bg-gray-50">
                      <h4 className="font-medium mb-2">Preview</h4>
                      <div className="bg-white border rounded p-4 h-32 flex items-center justify-center text-gray-400">
                        Portfolio Embed Preview
                      </div>
                    </div>
                    
                    {copySuccess && (
                      <Alert className="bg-green-50 text-green-800 border-green-100">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Embed code copied to clipboard!
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Notification Settings</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Switch id="notify-views" defaultChecked />
                  <label htmlFor="notify-views" className="ml-2 text-sm cursor-pointer">
                    <div className="font-medium">Portfolio View Notifications</div>
                    <div className="text-gray-500">Receive notifications when someone views your portfolio</div>
                  </label>
                </div>
                
                <div className="flex items-start">
                  <Switch id="notify-messages" defaultChecked />
                  <label htmlFor="notify-messages" className="ml-2 text-sm cursor-pointer">
                    <div className="font-medium">Message Notifications</div>
                    <div className="text-gray-500">Get notified when someone sends you a message through your portfolio</div>
                  </label>
                </div>
                
                <div className="flex items-start">
                  <Switch id="notify-testimonials" defaultChecked />
                  <label htmlFor="notify-testimonials" className="ml-2 text-sm cursor-pointer">
                    <div className="font-medium">Testimonial Notifications</div>
                    <div className="text-gray-500">Receive alerts when clients leave testimonials on your portfolio</div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      
      {!portfolio?.isPublic && (
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-amber-800">
          <p className="text-sm">
            Your portfolio is currently private. Toggle the switch above to make it public and access sharing options.
          </p>
        </div>
      )}
    </div>
  );
};

export default SharingOptions;