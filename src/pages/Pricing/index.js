import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Pricing.css';
import './integrations.css';

const Pricing = () => {
  const [activeTab, setActiveTab] = useState('platform');
  
  return (
    <div className="pricing-page">
      <section className="pricing-hero">
        <div className="container">
          <h1>Pricing & Materials</h1>
          <p className="hero-subtitle">Transparent pricing for all your printing needs</p>
        </div>
      </section>
      
      <section className="pricing-tabs">
        <div className="container">
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'platform' ? 'active' : ''}`}
              onClick={() => setActiveTab('platform')}
            >
              Platform Pricing
            </button>
            <button 
              className={`tab-button ${activeTab === 'materials' ? 'active' : ''}`}
              onClick={() => setActiveTab('materials')}
            >
              Print Materials Guide
            </button>
            <button 
              className={`tab-button ${activeTab === 'pricing-calculator' ? 'active' : ''}`}
              onClick={() => setActiveTab('pricing-calculator')}
            >
              Pricing Calculator
            </button>
            <button 
              className={`tab-button ${activeTab === 'integrations' ? 'active' : ''}`}
              onClick={() => setActiveTab('integrations')}
            >
              Integrations
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'platform' && (
              <div className="platform-pricing">
                <h2>Pressly Platform Pricing</h2>
                <p className="pricing-intro">
                  Pressly offers flexible pricing options to meet the needs of both designers and print producers of all sizes. Our pricing is designed to align with your usage and provide exceptional value.
                </p>
                
                <div className="pricing-plans">
                  <div className="pricing-card">
                    <div className="pricing-header">
                      <h3>Basic</h3>
                      <div className="price">
                        <span className="price-value">Free</span>
                      </div>
                      <p>Perfect for getting started</p>
                    </div>
                    <div className="pricing-features">
                      <ul>
                        <li><i className="fas fa-check"></i> Access to the Pressly network</li>
                        <li><i className="fas fa-check"></i> Basic matching capabilities</li>
                        <li><i className="fas fa-check"></i> 3 active projects</li>
                        <li><i className="fas fa-check"></i> Standard communication tools</li>
                        <li><i className="fas fa-check"></i> 7.5% platform fee on transactions</li>
                      </ul>
                    </div>
                    <div className="pricing-cta">
                      <Link to="/register" className="btn btn-outline btn-block">Sign Up Free</Link>
                    </div>
                  </div>
                  
                  <div className="pricing-card featured">
                    <div className="featured-tag">Most Popular</div>
                    <div className="pricing-header">
                      <h3>Professional</h3>
                      <div className="price">
                        <span className="price-currency">$</span>
                        <span className="price-value">29</span>
                        <span className="price-period">/month</span>
                      </div>
                      <p>For active professionals</p>
                    </div>
                    <div className="pricing-features">
                      <ul>
                        <li><i className="fas fa-check"></i> Priority in the matching algorithm</li>
                        <li><i className="fas fa-check"></i> Advanced matching capabilities</li>
                        <li><i className="fas fa-check"></i> 15 active projects</li>
                        <li><i className="fas fa-check"></i> Enhanced profile visibility</li>
                        <li><i className="fas fa-check"></i> 5% platform fee on transactions</li>
                        <li><i className="fas fa-check"></i> Real-time analytics dashboard</li>
                        <li><i className="fas fa-check"></i> Premium customer support</li>
                      </ul>
                    </div>
                    <div className="pricing-cta">
                      <Link to="/register" className="btn btn-block">Get Professional</Link>
                    </div>
                  </div>
                  
                  <div className="pricing-card">
                    <div className="pricing-header">
                      <h3>Enterprise</h3>
                      <div className="price">
                        <span className="price-value">Custom</span>
                      </div>
                      <p>For high-volume businesses</p>
                    </div>
                    <div className="pricing-features">
                      <ul>
                        <li><i className="fas fa-check"></i> Unlimited active projects</li>
                        <li><i className="fas fa-check"></i> Custom integration options</li>
                        <li><i className="fas fa-check"></i> Dedicated account manager</li>
                        <li><i className="fas fa-check"></i> Customized matching algorithms</li>
                        <li><i className="fas fa-check"></i> Negotiated platform fees</li>
                        <li><i className="fas fa-check"></i> Advanced analytics and reporting</li>
                        <li><i className="fas fa-check"></i> Priority technical support</li>
                        <li><i className="fas fa-check"></i> Team collaboration tools</li>
                      </ul>
                    </div>
                    <div className="pricing-cta">
                      <Link to="/contact" className="btn btn-outline btn-block">Contact Sales</Link>
                    </div>
                  </div>
                </div>
                
                <div className="pricing-comparison">
                  <h3>Feature Comparison</h3>
                  <div className="table-container">
                    <table className="comparison-table">
                      <thead>
                        <tr>
                          <th>Feature</th>
                          <th>Basic</th>
                          <th>Professional</th>
                          <th>Enterprise</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Active Projects</td>
                          <td>3</td>
                          <td>15</td>
                          <td>Unlimited</td>
                        </tr>
                        <tr>
                          <td>Platform Fee</td>
                          <td>7.5%</td>
                          <td>5%</td>
                          <td>Custom</td>
                        </tr>
                        <tr>
                          <td>Smart Matching</td>
                          <td>Basic</td>
                          <td>Advanced</td>
                          <td>Custom</td>
                        </tr>
                        <tr>
                          <td>Search Visibility</td>
                          <td>Standard</td>
                          <td>Enhanced</td>
                          <td>Premium</td>
                        </tr>
                        <tr>
                          <td>Analytics</td>
                          <td>Basic</td>
                          <td>Advanced</td>
                          <td>Custom Reports</td>
                        </tr>
                        <tr>
                          <td>Support</td>
                          <td>Email</td>
                          <td>Priority</td>
                          <td>Dedicated</td>
                        </tr>
                        <tr>
                          <td>API Access</td>
                          <td><i className="fas fa-times"></i></td>
                          <td><i className="fas fa-check"></i></td>
                          <td><i className="fas fa-check"></i></td>
                        </tr>
                        <tr>
                          <td>Custom Integration</td>
                          <td><i className="fas fa-times"></i></td>
                          <td><i className="fas fa-times"></i></td>
                          <td><i className="fas fa-check"></i></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'materials' && (
              <div className="materials-guide">
                <h2>Print Materials Guide</h2>
                <p className="materials-intro">
                  Understanding the right materials for your print project is crucial for achieving the desired results. Below are industry standard materials with typical pricing for reference.
                </p>
                
                <div className="materials-categories">
                  <div className="category-tabs">
                    <button className="category-tab active">Paper</button>
                    <button className="category-tab">Specialty</button>
                    <button className="category-tab">Textiles</button>
                    <button className="category-tab">Large Format</button>
                    <button className="category-tab">Packaging</button>
                  </div>
                  
                  <div className="materials-table-container">
                    <table className="materials-table">
                      <thead>
                        <tr>
                          <th>Material</th>
                          <th>Description</th>
                          <th>Best For</th>
                          <th>Average Price Range</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>80# Gloss Text</td>
                          <td>Lightweight, glossy coated paper</td>
                          <td>Flyers, Brochures, Catalogs</td>
                          <td>$0.10-0.15 per sq ft</td>
                        </tr>
                        <tr>
                          <td>100# Gloss Cover</td>
                          <td>Medium weight, glossy coated stock</td>
                          <td>Business Cards, Postcards, Folder Covers</td>
                          <td>$0.15-0.25 per sq ft</td>
                        </tr>
                        <tr>
                          <td>80# Uncoated Text</td>
                          <td>Matte finish, uncoated paper</td>
                          <td>Letterhead, Inner Pages, Workbooks</td>
                          <td>$0.08-0.12 per sq ft</td>
                        </tr>
                        <tr>
                          <td>100# Uncoated Cover</td>
                          <td>Heavier weight, uncoated stock</td>
                          <td>Premium Business Cards, Invitations</td>
                          <td>$0.18-0.30 per sq ft</td>
                        </tr>
                        <tr>
                          <td>14pt Coated Cover</td>
                          <td>Thick, durable, coated cardstock</td>
                          <td>Premium Business Cards, Postcards, Hangtags</td>
                          <td>$0.25-0.35 per sq ft</td>
                        </tr>
                        <tr>
                          <td>100# Gloss Book</td>
                          <td>Medium weight, glossy coated paper</td>
                          <td>Magazine Pages, Premium Brochures</td>
                          <td>$0.12-0.18 per sq ft</td>
                        </tr>
                        <tr>
                          <td>70# Uncoated Text</td>
                          <td>Lightweight, uncoated paper</td>
                          <td>Book Pages, Inserts, Stationery</td>
                          <td>$0.06-0.10 per sq ft</td>
                        </tr>
                        <tr>
                          <td>80# Silk/Matte Text</td>
                          <td>Low-gloss, smooth finish</td>
                          <td>High-end Brochures, Annual Reports</td>
                          <td>$0.12-0.18 per sq ft</td>
                        </tr>
                        <tr>
                          <td>110# Index</td>
                          <td>Heavyweight, uncoated card stock</td>
                          <td>Dividers, Index Cards, Durable Items</td>
                          <td>$0.15-0.22 per sq ft</td>
                        </tr>
                        <tr>
                          <td>65# Cover Kraft</td>
                          <td>Brown kraft paper, recycled look</td>
                          <td>Eco-friendly Packaging, Rustic Designs</td>
                          <td>$0.20-0.30 per sq ft</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="materials-recommendations">
                  <h3>Recommendations by Project Type</h3>
                  <div className="recommendation-cards">
                    <div className="recommendation-card">
                      <h4>Business Cards</h4>
                      <p><strong>Standard:</strong> 14pt Coated Cover with gloss or matte finish</p>
                      <p><strong>Premium:</strong> 32pt Uncoated with letterpress or 18pt Soft-Touch</p>
                      <p><strong>Eco:</strong> 100# Recycled Uncoated or 80# Kraft Cover</p>
                    </div>
                    <div className="recommendation-card">
                      <h4>Brochures</h4>
                      <p><strong>Standard:</strong> 100# Gloss Text for interior, 100# Gloss Cover for exterior</p>
                      <p><strong>Premium:</strong> 100# Silk Text for interior, 100# Silk Cover for exterior</p>
                      <p><strong>Eco:</strong> 80# Recycled Matte Text</p>
                    </div>
                    <div className="recommendation-card">
                      <h4>Posters</h4>
                      <p><strong>Indoor:</strong> 100# Gloss Cover or 80# Gloss Text</p>
                      <p><strong>Outdoor:</strong> 10mil Vinyl or 13oz Scrim Vinyl Banner</p>
                      <p><strong>Premium:</strong> 100# Silk Cover with Soft-Touch Lamination</p>
                    </div>
                    <div className="recommendation-card">
                      <h4>Packaging</h4>
                      <p><strong>Standard:</strong> 18pt Coated 1-Side Cardstock</p>
                      <p><strong>Premium:</strong> 24pt Coated 2-Side with Spot UV</p>
                      <p><strong>Eco:</strong> 18pt Kraft or 15pt Recycled Chipboard</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'pricing-calculator' && (
              <div className="pricing-calculator">
                <h2>Print Pricing Calculator</h2>
                <p className="calculator-intro">
                  Use our interactive calculator to estimate costs for your printing projects. Adjust quantities, materials, and finishing options to see how they affect pricing.
                </p>
                
                <div className="calculator-form">
                  <div className="calculator-section">
                    <h3>Product Details</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Product Type</label>
                        <select className="form-control">
                          <option>Business Cards</option>
                          <option>Flyers/Brochures</option>
                          <option>Posters</option>
                          <option>Banners</option>
                          <option>Packaging</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Quantity</label>
                        <select className="form-control">
                          <option>100</option>
                          <option>250</option>
                          <option>500</option>
                          <option>1,000</option>
                          <option>2,500</option>
                          <option>5,000</option>
                          <option>10,000</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Size</label>
                        <select className="form-control">
                          <option>Standard (3.5" x 2")</option>
                          <option>Square (2.5" x 2.5")</option>
                          <option>Slim (3.5" x 1.5")</option>
                          <option>European (3.375" x 2.125")</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Sides</label>
                        <select className="form-control">
                          <option>Single-sided</option>
                          <option>Double-sided</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="calculator-section">
                    <h3>Material & Finish</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Paper/Material</label>
                        <select className="form-control">
                          <option>14pt Gloss Cover</option>
                          <option>16pt Matte Cover</option>
                          <option>100# Uncoated Cover</option>
                          <option>32pt Premium</option>
                          <option>18pt Recycled Uncoated</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Coating/Finish</label>
                        <select className="form-control">
                          <option>None</option>
                          <option>Gloss Coating</option>
                          <option>Matte Coating</option>
                          <option>Soft-Touch Lamination</option>
                          <option>Spot UV</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Color</label>
                        <select className="form-control">
                          <option>Full Color (4/0)</option>
                          <option>Full Color Both Sides (4/4)</option>
                          <option>Full Color + Spot (4/1)</option>
                          <option>Black & White (1/0)</option>
                          <option>Black & White Both Sides (1/1)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Special Options</label>
                        <select className="form-control">
                          <option>None</option>
                          <option>Foil Stamping</option>
                          <option>Embossing</option>
                          <option>Die Cutting</option>
                          <option>Rounded Corners</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="calculator-section">
                    <h3>Turnaround & Shipping</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Turnaround Time</label>
                        <select className="form-control">
                          <option>Standard (7-10 business days)</option>
                          <option>Rush (3-5 business days)</option>
                          <option>Express (1-2 business days)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Shipping Method</label>
                        <select className="form-control">
                          <option>Ground</option>
                          <option>2-Day</option>
                          <option>Overnight</option>
                          <option>Local Pickup</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="calculator-total">
                    <button className="btn btn-primary">Calculate Price</button>
                    <div className="price-estimation">
                      <h3>Estimated Price</h3>
                      <div className="price-breakdown">
                        <div className="price-row">
                          <span>Base Price:</span>
                          <span>$45.00</span>
                        </div>
                        <div className="price-row">
                          <span>Finishing Options:</span>
                          <span>$0.00</span>
                        </div>
                        <div className="price-row">
                          <span>Rush Fee:</span>
                          <span>$0.00</span>
                        </div>
                        <div className="price-row">
                          <span>Shipping:</span>
                          <span>$8.50</span>
                        </div>
                        <div className="price-row total">
                          <span>Total:</span>
                          <span>$53.50</span>
                        </div>
                      </div>
                      <p className="price-note">*Prices are estimates only. Final pricing will be provided by the selected producer.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'integrations' && (
              <div className="integrations-guide">
                <h2>E-commerce Platform Integrations</h2>
                <p className="integrations-intro">
                  Pressly seamlessly integrates with major e-commerce platforms to enhance your print business operations. Our industry-standard API connections and plug-and-play solutions make it easy to connect your existing shops or expand to new marketplaces.
                </p>

                <div className="integration-cards">
                  <div className="integration-card">
                    <div className="integration-header">
                      <img src="/images/shopify-logo.svg" alt="Shopify" className="integration-logo" />
                      <h3>Shopify Integration</h3>
                    </div>
                    <div className="integration-features">
                      <ul>
                        <li><i className="fas fa-check"></i> One-click product sync</li>
                        <li><i className="fas fa-check"></i> Automated order fulfillment</li>
                        <li><i className="fas fa-check"></i> Real-time inventory updates</li>
                        <li><i className="fas fa-check"></i> Enhanced Shopify Plus features</li>
                      </ul>
                    </div>
                    <div className="integration-pricing">
                      <h4>Integration Pricing</h4>
                      <div className="pricing-tiers">
                        <div className="pricing-tier">
                          <span className="tier-name">Basic</span>
                          <span className="tier-price">Free</span>
                          <span className="tier-details">Basic sync features</span>
                        </div>
                        <div className="pricing-tier">
                          <span className="tier-name">Pro</span>
                          <span className="tier-price">Included in Pro Plan</span>
                          <span className="tier-details">Advanced features</span>
                        </div>
                        <div className="pricing-tier">
                          <span className="tier-name">Enterprise</span>
                          <span className="tier-price">Custom</span>
                          <span className="tier-details">Custom workflow</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="integration-card">
                    <div className="integration-header">
                      <img src="/images/etsy-logo.svg" alt="Etsy" className="integration-logo" />
                      <h3>Etsy Integration</h3>
                    </div>
                    <div className="integration-features">
                      <ul>
                        <li><i className="fas fa-check"></i> Etsy listing synchronization</li>
                        <li><i className="fas fa-check"></i> Auto fulfillment for Etsy orders</li>
                        <li><i className="fas fa-check"></i> Listing optimization tools</li>
                        <li><i className="fas fa-check"></i> Inventory management</li>
                      </ul>
                    </div>
                    <div className="integration-pricing">
                      <h4>Integration Pricing</h4>
                      <div className="pricing-tiers">
                        <div className="pricing-tier">
                          <span className="tier-name">Basic</span>
                          <span className="tier-price">Free</span>
                          <span className="tier-details">Limited to 50 listings</span>
                        </div>
                        <div className="pricing-tier">
                          <span className="tier-name">Pro</span>
                          <span className="tier-price">Included in Pro Plan</span>
                          <span className="tier-details">Unlimited listings</span>
                        </div>
                        <div className="pricing-tier">
                          <span className="tier-name">Enterprise</span>
                          <span className="tier-price">Custom</span>
                          <span className="tier-details">Multi-shop support</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="integration-card">
                    <div className="integration-header">
                      <img src="/images/woocommerce-logo.svg" alt="WooCommerce" className="integration-logo" />
                      <h3>WooCommerce Integration</h3>
                    </div>
                    <div className="integration-features">
                      <ul>
                        <li><i className="fas fa-check"></i> WordPress plugin</li>
                        <li><i className="fas fa-check"></i> WooCommerce product sync</li>
                        <li><i className="fas fa-check"></i> Automated order processing</li>
                        <li><i className="fas fa-check"></i> Shipping and tracking updates</li>
                      </ul>
                    </div>
                    <div className="integration-pricing">
                      <h4>Integration Pricing</h4>
                      <div className="pricing-tiers">
                        <div className="pricing-tier">
                          <span className="tier-name">Basic</span>
                          <span className="tier-price">Free</span>
                          <span className="tier-details">Core features</span>
                        </div>
                        <div className="pricing-tier">
                          <span className="tier-name">Pro</span>
                          <span className="tier-price">Included in Pro Plan</span>
                          <span className="tier-details">Advanced features</span>
                        </div>
                        <div className="pricing-tier">
                          <span className="tier-name">Enterprise</span>
                          <span className="tier-price">Custom</span>
                          <span className="tier-details">Custom integration</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="integration-card">
                    <div className="integration-header">
                      <img src="/images/bigcommerce-logo.svg" alt="BigCommerce" className="integration-logo" />
                      <h3>BigCommerce Integration</h3>
                    </div>
                    <div className="integration-features">
                      <ul>
                        <li><i className="fas fa-check"></i> App marketplace integration</li>
                        <li><i className="fas fa-check"></i> Product synchronization</li>
                        <li><i className="fas fa-check"></i> Automated order routing</li>
                        <li><i className="fas fa-check"></i> Multi-channel selling</li>
                      </ul>
                    </div>
                    <div className="integration-pricing">
                      <h4>Integration Pricing</h4>
                      <div className="pricing-tiers">
                        <div className="pricing-tier">
                          <span className="tier-name">Basic</span>
                          <span className="tier-price">Free</span>
                          <span className="tier-details">Up to 100 products</span>
                        </div>
                        <div className="pricing-tier">
                          <span className="tier-name">Pro</span>
                          <span className="tier-price">Included in Pro Plan</span>
                          <span className="tier-details">Unlimited products</span>
                        </div>
                        <div className="pricing-tier">
                          <span className="tier-name">Enterprise</span>
                          <span className="tier-price">Custom</span>
                          <span className="tier-details">Custom integration</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="integration-card">
                    <div className="integration-header">
                      <img src="/images/wix-logo.svg" alt="Wix" className="integration-logo" />
                      <h3>Wix Integration</h3>
                    </div>
                    <div className="integration-features">
                      <ul>
                        <li><i className="fas fa-check"></i> Wix App Market integration</li>
                        <li><i className="fas fa-check"></i> Automatic product sync</li>
                        <li><i className="fas fa-check"></i> Order fulfillment automation</li>
                        <li><i className="fas fa-check"></i> Tracking number updates</li>
                      </ul>
                    </div>
                    <div className="integration-pricing">
                      <h4>Integration Pricing</h4>
                      <div className="pricing-tiers">
                        <div className="pricing-tier">
                          <span className="tier-name">Basic</span>
                          <span className="tier-price">Free</span>
                          <span className="tier-details">Basic features</span>
                        </div>
                        <div className="pricing-tier">
                          <span className="tier-name">Pro</span>
                          <span className="tier-price">Included in Pro Plan</span>
                          <span className="tier-details">Enhanced features</span>
                        </div>
                        <div className="pricing-tier">
                          <span className="tier-name">Enterprise</span>
                          <span className="tier-price">Custom</span>
                          <span className="tier-details">Custom solutions</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="integration-card">
                    <div className="integration-header">
                      <img src="/images/squarespace-logo.svg" alt="Squarespace" className="integration-logo" />
                      <h3>Squarespace Integration</h3>
                    </div>
                    <div className="integration-features">
                      <ul>
                        <li><i className="fas fa-check"></i> Extension marketplace</li>
                        <li><i className="fas fa-check"></i> Product catalog sync</li>
                        <li><i className="fas fa-check"></i> Automated order fulfillment</li>
                        <li><i className="fas fa-check"></i> Custom notification settings</li>
                      </ul>
                    </div>
                    <div className="integration-pricing">
                      <h4>Integration Pricing</h4>
                      <div className="pricing-tiers">
                        <div className="pricing-tier">
                          <span className="tier-name">Basic</span>
                          <span className="tier-price">Free</span>
                          <span className="tier-details">Basic integration</span>
                        </div>
                        <div className="pricing-tier">
                          <span className="tier-name">Pro</span>
                          <span className="tier-price">Included in Pro Plan</span>
                          <span className="tier-details">Full integration</span>
                        </div>
                        <div className="pricing-tier">
                          <span className="tier-name">Enterprise</span>
                          <span className="tier-price">Custom</span>
                          <span className="tier-details">Advanced options</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="api-integration">
                  <h3>API Integration & Developer Resources</h3>
                  <p>For custom solutions and advanced integrations, Pressly offers a robust API with comprehensive documentation.</p>
                  <div className="api-features">
                    <div className="api-feature">
                      <i className="fas fa-code"></i>
                      <h4>RESTful API Access</h4>
                      <p>Well-documented endpoints for all Pressly functionality</p>
                    </div>
                    <div className="api-feature">
                      <i className="fas fa-file-code"></i>
                      <h4>SDK Libraries</h4>
                      <p>Ready-to-use libraries for popular programming languages</p>
                    </div>
                    <div className="api-feature">
                      <i className="fas fa-plug"></i>
                      <h4>Webhooks</h4>
                      <p>Real-time event notifications for your applications</p>
                    </div>
                    <div className="api-feature">
                      <i className="fas fa-book"></i>
                      <h4>Documentation</h4>
                      <p>Comprehensive guides and reference materials</p>
                    </div>
                  </div>
                  <div className="api-pricing">
                    <h4>API Pricing</h4>
                    <table className="api-pricing-table">
                      <thead>
                        <tr>
                          <th>Plan</th>
                          <th>API Calls</th>
                          <th>Rate Limits</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Basic</td>
                          <td>1,000 calls/day</td>
                          <td>60 calls/minute</td>
                          <td>Free</td>
                        </tr>
                        <tr>
                          <td>Pro</td>
                          <td>50,000 calls/day</td>
                          <td>300 calls/minute</td>
                          <td>Included in Pro Plan</td>
                        </tr>
                        <tr>
                          <td>Enterprise</td>
                          <td>Unlimited</td>
                          <td>Custom limits</td>
                          <td>Custom pricing</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="integration-faq">
                  <h3>Integration FAQs</h3>
                  <div className="faq-grid">
                    <div className="faq-item">
                      <h4>How long does integration typically take?</h4>
                      <p>Basic platform integrations can be completed in minutes using our one-click setup. Custom API integrations vary based on complexity but typically take 1-3 days with our developer support.</p>
                    </div>
                    <div className="faq-item">
                      <h4>Do you charge transaction fees for integrated orders?</h4>
                      <p>No, we don't charge additional transaction fees for orders processed through our integrations. You'll only pay the standard platform fees based on your plan.</p>
                    </div>
                    <div className="faq-item">
                      <h4>Can I connect multiple stores from different platforms?</h4>
                      <p>Yes, all paid plans support multiple store connections across different platforms, allowing you to centralize your print fulfillment operations.</p>
                    </div>
                    <div className="faq-item">
                      <h4>How are product variations handled in integrations?</h4>
                      <p>Our platform automatically maps standard product variations (size, color, etc.) between systems while preserving your custom attributes and options.</p>
                    </div>
                  </div>
                </div>

                <div className="integration-cta">
                  <h3>Ready to Connect Your Store?</h3>
                  <p>Start integrating your e-commerce platforms with Pressly for seamless print-on-demand operations.</p>
                  <div className="cta-buttons">
                    <Link to="/register" className="btn">Create Free Account</Link>
                    <Link to="/contact" className="btn btn-outline">Contact Sales for Custom Integration</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How are print costs calculated?</h3>
              <p>Print costs typically include materials, production time, equipment usage, finishing processes, and producer markup. Factors that affect pricing include quantity, material quality, production complexity, and turnaround time.</p>
            </div>
            <div className="faq-item">
              <h3>Can I request custom quotes from producers?</h3>
              <p>Yes! When you submit a project through Pressly, you can receive custom quotes from multiple producers based on your specific requirements. This allows you to compare options and choose the best fit for your project.</p>
            </div>
            <div className="faq-item">
              <h3>Are there any hidden fees?</h3>
              <p>Pressly is committed to transparent pricing. Our platform fee is clearly stated for each plan, and producers provide comprehensive quotes that include all costs. There are no surprise charges or hidden fees.</p>
            </div>
            <div className="faq-item">
              <h3>How can I reduce my printing costs?</h3>
              <p>Consider printing in larger quantities to benefit from economies of scale, choose standard sizes to reduce waste, opt for lighter weight papers when possible, and plan projects with adequate lead time to avoid rush fees.</p>
            </div>
            <div className="faq-item">
              <h3>What if I'm not satisfied with the print quality?</h3>
              <p>Pressly has a quality assurance policy. If the final product doesn't meet the agreed specifications, you can file a quality dispute through the platform. We'll work with the producer to resolve the issue promptly.</p>
            </div>
            <div className="faq-item">
              <h3>Can I upgrade or downgrade my subscription?</h3>
              <p>Yes, you can change your subscription plan at any time. Changes take effect at the start of your next billing cycle. There are no penalties for upgrading or downgrading your plan.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="pricing-cta">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of designers and producers already using Pressly to streamline their print production workflow.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-lg">Create Free Account</Link>
            <Link to="/contact" className="btn btn-outline btn-lg">Contact Sales</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;