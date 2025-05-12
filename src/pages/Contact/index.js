import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    role: 'designer',
    interest: 'platform',
    message: '',
  });
  
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // In a real implementation, this would be an API call
    setSubmitted(true);
  };
  
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p className="hero-subtitle">We're here to help you connect and create</p>
        </div>
      </section>
      
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>Have questions about Pressly? We're here to help! Fill out the form and a team member will get back to you as soon as possible.</p>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <h3>Email Us</h3>
                    <p>info@pressly.com</p>
                    <p>support@pressly.com</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <i className="fas fa-phone-alt"></i>
                  <div>
                    <h3>Call Us</h3>
                    <p>(800) 555-1234</p>
                    <p>Monday - Friday, 9AM - 5PM EST</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <h3>Visit Us</h3>
                    <p>123 Print Street</p>
                    <p>Suite 500</p>
                    <p>San Francisco, CA 94107</p>
                  </div>
                </div>
              </div>
              
              <div className="contact-social">
                <h3>Connect With Us</h3>
                <div className="social-icons">
                  <a href="#" className="social-icon">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="contact-form-container">
              {submitted ? (
                <div className="form-success">
                  <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h2>Thank You!</h2>
                  <p>Your message has been received. A member of our team will contact you shortly.</p>
                  <button 
                    className="btn"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <h2>Contact Form</h2>
                  
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input 
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input 
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="company">Company</label>
                      <input 
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input 
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="role">I am a *</label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="designer">Designer</option>
                        <option value="producer">Print Producer</option>
                        <option value="business">Business Owner</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="interest">I'm interested in *</label>
                      <select
                        id="interest"
                        name="interest"
                        value={formData.interest}
                        onChange={handleChange}
                        required
                      >
                        <option value="platform">Platform Information</option>
                        <option value="pricing">Pricing Details</option>
                        <option value="enterprise">Enterprise Solutions</option>
                        <option value="partnership">Partnership Opportunities</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Your Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-block">Send Message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How quickly will I receive a response?</h3>
              <p>We strive to respond to all inquiries within 24 business hours. Enterprise inquiries may require additional time to prepare a customized response.</p>
            </div>
            <div className="faq-item">
              <h3>What information should I include in my message?</h3>
              <p>The more details you can provide about your specific needs, the better we can assist you. For enterprise inquiries, information about company size, print volume, and specific requirements is helpful.</p>
            </div>
            <div className="faq-item">
              <h3>Is there a phone support option available?</h3>
              <p>Yes, phone support is available for all paid plan subscribers. Free users can schedule a call by submitting a request through this contact form.</p>
            </div>
            <div className="faq-item">
              <h3>Can I request a demo of the platform?</h3>
              <p>Absolutely! Select "Platform Information" in the interest dropdown and mention that you'd like a demo in your message. Our team will schedule a personalized walkthrough.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;