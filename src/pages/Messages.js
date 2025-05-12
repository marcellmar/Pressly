import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import MessageCenter from '../components/MessagingSystem/MessageCenter';

const Messages = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, loading } = useAuth();
  
  const [activeContact, setActiveContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample contacts data
  const mockDesignerContacts = [
    {
      id: 'producer123',
      name: 'PrintMasters Inc.',
      role: 'producer',
      avatar: null,
      lastMessage: 'Great choice! We have a few different weight options for the matte finish...',
      lastMessageTime: '2025-04-10T14:45:00',
      unreadCount: 1,
      orderId: 'order789',
      orderName: 'Spring Marketing Campaign Posters'
    },
    {
      id: 'producer124',
      name: 'Quality Prints',
      role: 'producer',
      avatar: null,
      lastMessage: 'Your order has been confirmed. We\'ll start production tomorrow.',
      lastMessageTime: '2025-04-09T11:20:00',
      unreadCount: 0,
      orderId: 'order790',
      orderName: 'Business Cards - CEO Edition'
    },
    {
      id: 'producer125',
      name: 'Eco Printing Solutions',
      role: 'producer',
      avatar: null,
      lastMessage: 'We received your design files. Everything looks good for production.',
      lastMessageTime: '2025-04-08T15:30:00',
      unreadCount: 0,
      orderId: 'order791',
      orderName: 'Quarterly Newsletter'
    }
  ];
  
  const mockProducerContacts = [
    {
      id: 'designer456',
      name: 'Sarah Design Studio',
      role: 'designer',
      avatar: null,
      lastMessage: 'Let\'s go with the 120lb for better durability. Also, when do you think this will be ready for pickup?',
      lastMessageTime: '2025-04-11T09:20:00',
      unreadCount: 1,
      orderId: 'order789',
      orderName: 'Spring Marketing Campaign Posters'
    },
    {
      id: 'designer457',
      name: 'FoodFocus Design',
      role: 'designer',
      avatar: null,
      lastMessage: 'I just sent over the final menu design files. Let me know if you have any questions.',
      lastMessageTime: '2025-04-07T16:45:00',
      unreadCount: 0,
      orderId: 'order792',
      orderName: 'Restaurant Menu Redesign'
    },
    {
      id: 'designer458',
      name: 'Event Graphics Inc.',
      role: 'designer',
      avatar: null,
      lastMessage: 'When will the badges be ready for pickup? The conference starts on Friday.',
      lastMessageTime: '2025-04-05T10:15:00',
      unreadCount: 2,
      orderId: 'order793',
      orderName: 'Conference Badges'
    }
  ];
  
  // Load contacts based on user role
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (currentUser) {
      setTimeout(() => {
        if (currentUser.role === 'designer') {
          setContacts(mockDesignerContacts);
          if (!activeContact && mockDesignerContacts.length > 0) {
            setActiveContact(mockDesignerContacts[0]);
          }
        } else if (currentUser.role === 'producer') {
          setContacts(mockProducerContacts);
          if (!activeContact && mockProducerContacts.length > 0) {
            setActiveContact(mockProducerContacts[0]);
          }
        }
      }, 800);
    }
  }, [currentUser, isAuthenticated, loading, navigate, activeContact]);
  
  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.orderName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Format timestamp for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <section className="messages-section" style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1 style={{ marginBottom: '2rem' }}>Messages</h1>
        
        <div 
          className="messages-container"
          style={{
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            gap: '1.5rem',
            height: '600px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Contacts sidebar */}
          <div 
            className="contacts-sidebar"
            style={{
              borderRight: '1px solid #dee2e6',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div 
              className="search-container"
              style={{
                padding: '1rem',
                borderBottom: '1px solid #dee2e6'
              }}
            >
              <input
                type="text"
                placeholder="Search contacts or orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div 
              className="contacts-list"
              style={{
                overflowY: 'auto',
                flex: 1
              }}
            >
              {filteredContacts.length === 0 ? (
                <div 
                  className="no-contacts"
                  style={{
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    color: '#6c757d'
                  }}
                >
                  <i className="fas fa-search" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}></i>
                  <p>No contacts found</p>
                </div>
              ) : (
                filteredContacts.map(contact => (
                  <div
                    key={contact.id}
                    className={`contact-item ${activeContact?.id === contact.id ? 'active' : ''}`}
                    onClick={() => setActiveContact(contact)}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #f2f2f2',
                      cursor: 'pointer',
                      backgroundColor: activeContact?.id === contact.id ? '#f0f7ff' : 'transparent',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div 
                        className="contact-avatar"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#e9ecef',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '1rem',
                          fontWeight: 'bold',
                          color: '#6c757d'
                        }}
                      >
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <h4 style={{ 
                            margin: 0, 
                            fontSize: '1rem', 
                            fontWeight: contact.unreadCount > 0 ? '600' : '500',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {contact.name}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                            {formatTime(contact.lastMessageTime)}
                          </span>
                        </div>
                        
                        <p style={{ 
                          margin: '0.25rem 0 0',
                          fontSize: '0.875rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: contact.unreadCount > 0 ? '#212529' : '#6c757d',
                          fontWeight: contact.unreadCount > 0 ? '500' : 'normal'
                        }}>
                          {contact.lastMessage}
                        </p>
                        
                        <p style={{ 
                          margin: '0.25rem 0 0',
                          fontSize: '0.75rem',
                          color: '#6c757d',
                          fontStyle: 'italic'
                        }}>
                          {contact.orderName}
                        </p>
                      </div>
                    </div>
                    
                    {contact.unreadCount > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          backgroundColor: 'var(--primary)',
                          color: 'white',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {contact.unreadCount}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Message area */}
          <div 
            className="message-area"
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
          >
            {activeContact ? (
              <>
                <div 
                  className="message-header"
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #dee2e6',
                    backgroundColor: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div 
                      className="contact-avatar"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#e9ecef',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '1rem',
                        fontWeight: 'bold',
                        color: '#6c757d'
                      }}
                    >
                      {activeContact.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{activeContact.name}</h3>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6c757d' }}>
                        {activeContact.role === 'designer' ? 'Designer' : 'Print Producer'} - {activeContact.orderName}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/orders/${activeContact.orderId}`)}
                    className="btn"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid var(--primary)',
                      color: 'var(--primary)',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    View Order
                  </button>
                </div>
                
                <div 
                  className="message-content"
                  style={{
                    flex: 1,
                    padding: '1rem',
                    overflow: 'hidden'
                  }}
                >
                  <MessageCenter
                    orderId={activeContact.orderId}
                    designerId={activeContact.role === 'designer' ? activeContact.id : ''}
                    producerId={activeContact.role === 'producer' ? activeContact.id : ''}
                  />
                </div>
              </>
            ) : (
              <div 
                className="no-conversation-selected"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#6c757d',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <i className="fas fa-comments" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                <h3 style={{ marginBottom: '0.5rem' }}>No conversation selected</h3>
                <p>Select a contact from the sidebar to start messaging</p>
              </div>
            )}
          </div>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <button 
            onClick={() => navigate(`/${currentUser?.role}-dashboard`)} 
            className="btn"
            style={{ backgroundColor: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </section>
  );
};

export default Messages;