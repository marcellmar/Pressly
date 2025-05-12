import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SupplyChainButton from './SupplyChainButton';

// Mock the SupplyChainModal component
jest.mock('./SupplyChainModal', () => {
  return function MockSupplyChainModal({ isOpen, onClose, producer }) {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-modal">
        <button onClick={onClose} data-testid="close-modal-button">Close</button>
        <div>Producer: {producer.name}</div>
      </div>
    );
  };
});

describe('SupplyChainButton', () => {
  const mockProducer = {
    id: 1,
    name: 'Test Producer',
    sustainabilityScore: 85,
    materialSources: ['Organic Cotton', 'Recycled Polyester']
  };

  it('renders the button correctly', () => {
    render(<SupplyChainButton producer={mockProducer} />);
    
    // Check if the button is rendered
    const button = screen.getByRole('button', { name: /view supply chain/i });
    expect(button).toBeInTheDocument();
  });

  it('opens modal when clicked', () => {
    render(<SupplyChainButton producer={mockProducer} />);
    
    // Initially, modal should not be visible
    const modalBefore = screen.queryByTestId('mock-modal');
    expect(modalBefore).not.toBeInTheDocument();
    
    // Click the button
    const button = screen.getByRole('button', { name: /view supply chain/i });
    fireEvent.click(button);
    
    // Modal should now be visible
    const modalAfter = screen.getByTestId('mock-modal');
    expect(modalAfter).toBeInTheDocument();
    expect(screen.getByText(`Producer: ${mockProducer.name}`)).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    render(<SupplyChainButton producer={mockProducer} />);
    
    // Open the modal
    const button = screen.getByRole('button', { name: /view supply chain/i });
    fireEvent.click(button);
    
    // Modal should be visible
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    
    // Click the close button
    const closeButton = screen.getByTestId('close-modal-button');
    fireEvent.click(closeButton);
    
    // Modal should no longer be visible
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
  });
});
