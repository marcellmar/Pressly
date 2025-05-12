import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="hero about-hero">
        <div className="container">
          <h1>About Pressly</h1>
          <p className="hero-subtitle">Revolutionizing the print industry through intelligent network connections</p>
        </div>
      </section>

      <section className="about-intro">
        <div className="container">
          <div className="grid-2">
            <div className="about-content">
              <h2>Our Mission</h2>
              <p>Pressly was founded with a simple yet powerful vision: to create a thriving ecosystem that connects designers with print producers seamlessly, making high-quality print production accessible, efficient, and sustainable.</p>
              <p>By leveraging technology to bridge the gap between creative vision and production capabilities, we empower both designers and producers to focus on what they do best while optimizing the entire print workflow.</p>
            </div>
            <div className="about-image">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Team collaborating on design project" 
                className="rounded-img"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="container">
          <h2>Our Story</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-date">2023</div>
              <div className="timeline-content">
                <h3>The Beginning</h3>
                <p>Pressly was born from the frustration experienced by our founders - a team of designers and print producers who recognized the inefficiencies and communication barriers in the traditional print production process.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2024</div>
              <div className="timeline-content">
                <h3>Developing the Platform</h3>
                <p>After extensive research and industry consultation, our team developed the first version of the Pressly platform, focusing on creating a standardized quality framework and intelligent matching system.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2025</div>
              <div className="timeline-content">
                <h3>Launch and Growth</h3>
                <p>With our official launch, Pressly has connected hundreds of designers with local print producers, driving efficiency, reducing waste, and creating a more sustainable print ecosystem.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="platform-section" id="how-it-works">
        <div className="container">
          <h2>How Pressly Works</h2>
          <div className="process-flow">
            <div className="process-step">
              <div className="step-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <h3>Registration</h3>
              <p>Sign up as a designer or producer and create your detailed profile with your specific needs or capabilities.</p>
            </div>
            <div className="process-step">
              <div className="step-icon">
                <i className="fas fa-link"></i>
              </div>
              <h3>Connection</h3>
              <p>Our intelligent matching system analyzes profiles and project requirements to suggest optimal partnerships.</p>
            </div>
            <div className="process-step">
              <div className="step-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Collaboration</h3>
              <p>Communicate, share designs, and finalize specifications directly through our secure platform.</p>
            </div>
            <div className="process-step">
              <div className="step-icon">
                <i className="fas fa-print"></i>
              </div>
              <h3>Production</h3>
              <p>Track progress with real-time updates as your project moves through the production process.</p>
            </div>
            <div className="process-step">
              <div className="step-icon">
                <i className="fas fa-truck"></i>
              </div>
              <h3>Delivery</h3>
              <p>Receive your finished product with complete quality assurance and standardized expectations.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="for-designers" id="for-designers">
        <div className="container">
          <h2>For Designers</h2>
          <div className="grid-2">
            <div className="designers-image">
              <img 
                src="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Designer working on creative project" 
                className="rounded-img"
              />
            </div>
            <div className="designers-content">
              <h3>Unlock Your Creative Potential</h3>
              <p>Pressly gives designers unprecedented access to a network of vetted print producers with diverse capabilities. No more compromising your vision due to production limitations.</p>
              
              <h3>Key Benefits for Designers</h3>
              <ul className="benefits-list">
                <li>
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <h4>Find the Perfect Production Partner</h4>
                    <p>Match with producers who have exactly the right equipment, materials, and expertise for your specific project needs.</p>
                  </div>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <h4>Transparent Pricing</h4>
                    <p>Get clear, upfront quotes with no hidden fees or surprises, allowing you to budget more effectively.</p>
                  </div>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <h4>Quality Assurance</h4>
                    <p>Our standardized quality metrics mean consistent results across all producers in our network.</p>
                  </div>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <h4>Real-Time Project Tracking</h4>
                    <p>Monitor your project's progress from approval to production to delivery with detailed status updates.</p>
                  </div>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <h4>Direct Communication</h4>
                    <p>Our integrated messaging system keeps all project communication in one place, preventing details from getting lost.</p>
                  </div>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <h4>Expanded Capabilities</h4>
                    <p>Access specialized printing techniques and materials that might otherwise be out of reach for your projects.</p>
                  </div>
                </li>
              </ul>
              
              <div className="cta-container">
                <Link to="/register" className="btn">Sign Up as a Designer</Link>
                <Link to="/smart-match" className="btn btn-outline">Try Smart Match</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="for-producers" id="for-producers">
        <div className="container">
          <h2>For Print Producers</h2>
          <div className="grid-2">
            <div className="producers-content">
              <h3>Maximize Your Production Potential</h3>
              <p>Pressly helps print producers optimize capacity utilization, increase revenue, and build relationships with quality designers who understand the value of your expertise.</p>
              
              <h3>Key Benefits for Producers</h3>
              <ul className="benefits-list">
                <li>
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <h4>Increased Capacity Utilization</h4>
                    <p>Fill production gaps and maximize equipment usage with a steady stream of well-matched projects.</p>
                  </div>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <h4>Showcase Your Capabilities</h4>
                    <p>Create a detailed profile highlighting your unique equipment, materials, and expertise to attract the right clients.</p>
                  </div>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <h4>Dynamic Capacity Management</h4>
                    <p>Update your availability in real-time to ensure you only receive projects when you have the capacity to fulfill them.</p>
                  </div>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <h4>Simplified Project Management</h4>
                    <p>Manage all client communications, file transfers, and project details in one centralized platform.</p>
                  </div>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <h4>Reduced Administrative Overhead</h4>
                    <p>Streamlined quoting, approval, and invoicing processes mean less paperwork and more production time.</p>
                  </div>
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <h4>Expanded Client Base</h4>
                    <p>Connect with designers beyond your local market who are looking for your specific capabilities.</p>
                  </div>
                </li>
              </ul>
              
              <div className="cta-container">
                <Link to="/register" className="btn">Sign Up as a Producer</Link>
                <Link to="/capacity" className="btn btn-outline">Learn About Capacity Management</Link>
              </div>
            </div>
            <div className="producers-image">
              <img 
                src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Modern printing facility" 
                className="rounded-img"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="network-value" id="network-value">
        <div className="container">
          <h2>The Power of Our Network</h2>
          <div className="value-metrics">
            <div className="metric-card">
              <div className="metric-value">500+</div>
              <div className="metric-label">Active Designers</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">200+</div>
              <div className="metric-label">Print Producers</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">50+</div>
              <div className="metric-label">Cities Covered</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">5,000+</div>
              <div className="metric-label">Projects Completed</div>
            </div>
          </div>
          <p className="network-description">
            Every new designer and producer who joins Pressly makes our network smarter and more valuable. Our proprietary matching algorithms learn from each successful project, continuously improving match quality and production outcomes.
          </p>
          <div className="network-benefits">
            <h3>Network Benefits</h3>
            <div className="grid-3">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <i className="fas fa-sliders-h"></i>
                </div>
                <h4>Optimized Matching</h4>
                <p>As more users join, our matching system becomes increasingly precise in connecting the right designers with the right producers.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h4>Dynamic Pricing</h4>
                <p>Our marketplace helps establish fair market pricing based on actual production capabilities and quality.</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h4>Quality Standards</h4>
                <p>Our network establishes and enforces quality benchmarks that elevate the entire industry.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="join-cta">
        <div className="container">
          <h2>Join the Pressly Revolution</h2>
          <p>Whether you're a designer looking for the perfect print partner or a producer seeking to maximize your capacity, Pressly is the platform that connects you to success.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-lg">Get Started Today</Link>
            <Link to="/pricing" className="btn btn-outline btn-lg">View Pricing</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;