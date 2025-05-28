/**
 * ZUO Creation Flow Component
 * 
 * Simplified design creation and ordering flow for consumers
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder, uploadFile } from '../../services/api';
import { getConsumerProducers } from '../../services/consumerApi';
import ZuoProducerCard from './ZuoProducerCard';

const ZuoCreationFlow = ({ user }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState('creation');
  const [design, setDesign] = useState(null);
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    quantity: 25,
    size: 'M',
    color: 'Black'
  });

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const uploadedFile = await uploadFile(file);
      setDesign({
        type: 'upload',
        file: uploadedFile,
        name: file.name
      });
      handleNextStep('creation');
    } catch (error) {
      alert('Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle text design
  const handleTextDesign = () => {
    const text = prompt('Enter your text:');
    if (text) {
      setDesign({
        type: 'text',
        content: text,
        name: `Text: "${text}"`
      });
      handleNextStep('creation');
    }
  };

  // Move to next step
  const handleNextStep = async (currentStep) => {
    if (currentStep === 'creation') {
      // Load producers
      setLoading(true);
      try {
        const availableProducers = await getConsumerProducers({ design });
        setProducers(availableProducers);
        
        // Show producer selection
        setStep('producers');
      } catch (error) {
        alert('Failed to load producers. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 'producers') {
      setStep('confirm');
    }
  };

  // Complete order
  const handleCompleteOrder = async () => {
    if (!selectedProducer || !design) return;

    setLoading(true);
    try {
      // Create order
      const order = await createOrder({
        design,
        producer_id: selectedProducer.id,
        quantity: orderDetails.quantity,
        size: orderDetails.size,
        color: orderDetails.color,
        auto_select_producer: false
      });

      // Order created successfully

      // Show success
      setStep('success');
      
      // Redirect after delay
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (error) {
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="zuo-creation-flow">
      {loading && (
        <div className="zuo-loading">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}

      {/* Step 1: Creation Options */}
      {step === 'creation' && !loading && (
        <div className="zuo-step-creation">
          <h2>What would you like to create?</h2>
          <div className="zuo-creation-options">
            <div className="zuo-creation-option">
              <label htmlFor="file-upload" className="zuo-upload-label">
                <div className="option-icon">📤</div>
                <h3>Upload Design</h3>
                <p>Upload your own artwork</p>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,.pdf,.ai,.psd"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className="zuo-creation-option" onClick={handleTextDesign}>
              <div className="option-icon">✏️</div>
              <h3>Text Design</h3>
              <p>Create simple text</p>
            </div>

            <div 
              className="zuo-creation-option"
              onClick={() => navigate('/designs/new')}
            >
              <div className="option-icon">🎨</div>
              <h3>Design Studio</h3>
              <p>Advanced design tools</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Producer Selection */}
      {step === 'producers' && !loading && (
        <div className="zuo-step-producers">
          <h2>Choose your printer</h2>
          <p className="zuo-helper-text">
            We've found the best matches for your design
          </p>
          <div className="zuo-producers-grid">
            {producers.map((producer) => (
              <ZuoProducerCard
                key={producer.id}
                producer={producer}
                selected={selectedProducer?.id === producer.id}
                onSelect={() => setSelectedProducer(producer)}
              />
            ))}
          </div>
          <button 
            className="zuo-btn-primary"
            disabled={!selectedProducer}
            onClick={() => handleNextStep('producers')}
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 3: Confirm Order */}
      {step === 'confirm' && !loading && (
        <div className="zuo-step-confirm">
          <h2>Confirm your order</h2>
          
          <div className="zuo-order-summary">
            <div className="summary-section">
              <h3>Design</h3>
              <p>{design.name}</p>
            </div>

            <div className="summary-section">
              <h3>Printer</h3>
              <p>{selectedProducer.name}</p>
              <p className="detail">{selectedProducer.delivery_simple}</p>
            </div>

            <div className="summary-section">
              <h3>Details</h3>
              <div className="order-details">
                <label>
                  Quantity:
                  <select 
                    value={orderDetails.quantity}
                    onChange={(e) => setOrderDetails({...orderDetails, quantity: e.target.value})}
                  >
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </label>
                <label>
                  Size:
                  <select 
                    value={orderDetails.size}
                    onChange={(e) => setOrderDetails({...orderDetails, size: e.target.value})}
                  >
                    <option value="S">Small</option>
                    <option value="M">Medium</option>
                    <option value="L">Large</option>
                    <option value="XL">X-Large</option>
                  </select>
                </label>
                <label>
                  Color:
                  <select 
                    value={orderDetails.color}
                    onChange={(e) => setOrderDetails({...orderDetails, color: e.target.value})}
                  >
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Navy">Navy</option>
                    <option value="Gray">Gray</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <button 
            className="zuo-btn-primary"
            onClick={handleCompleteOrder}
          >
            Place Order
          </button>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 'success' && (
        <div className="zuo-step-success">
          <div className="success-icon">✅</div>
          <h2>Order placed successfully!</h2>
          <p>Your order has been sent to {selectedProducer.name}</p>
          <p className="detail">Redirecting to your orders...</p>
        </div>
      )}
    </div>
  );
};

export default ZuoCreationFlow;