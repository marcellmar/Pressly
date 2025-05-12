import React from 'react';

const AddressForm = ({ address, onChange, isEditing }) => {
  // If not in editing mode, display the formatted address
  if (!isEditing) {
    if (!address || !address.street1) {
      return (
        <div>
          <span style={{ fontWeight: 'bold', color: '#666' }}>Address: </span>
          <span>Not provided</span>
        </div>
      );
    }
    
    return (
      <div>
        <span style={{ fontWeight: 'bold', color: '#666' }}>Address: </span>
        <div>
          <p>{address.street1}</p>
          {address.street2 && <p>{address.street2}</p>}
          <p>{address.city}, {address.state} {address.zipCode}</p>
          {address.country && <p>{address.country}</p>}
        </div>
      </div>
    );
  }
  
  // In editing mode, show the form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...address,
      [name]: value
    });
  };
  
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>
        Address
      </label>
      
      <div style={{ marginBottom: '0.75rem' }}>
        <input
          type="text"
          name="street1"
          value={address?.street1 || ''}
          onChange={handleInputChange}
          placeholder="Street Address"
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px' }}
        />
      </div>
      
      <div style={{ marginBottom: '0.75rem' }}>
        <input
          type="text"
          name="street2"
          value={address?.street2 || ''}
          onChange={handleInputChange}
          placeholder="Apt, Suite, Building (optional)"
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px' }}
        />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <input
          type="text"
          name="city"
          value={address?.city || ''}
          onChange={handleInputChange}
          placeholder="City"
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px' }}
        />
        
        <input
          type="text"
          name="state"
          value={address?.state || ''}
          onChange={handleInputChange}
          placeholder="State/Province"
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px' }}
        />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <input
          type="text"
          name="zipCode"
          value={address?.zipCode || ''}
          onChange={handleInputChange}
          placeholder="Zip/Postal Code"
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px' }}
        />
        
        <input
          type="text"
          name="country"
          value={address?.country || ''}
          onChange={handleInputChange}
          placeholder="Country"
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '5px' }}
        />
      </div>
    </div>
  );
};

export default AddressForm;