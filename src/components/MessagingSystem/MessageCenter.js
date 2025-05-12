import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/auth/AuthContext';

const MessageCenter = ({ orderId, designerId, producerId, viewOnly = false }) => {
  const { currentUser } = useAuth();
  
  // Message state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Simulated data
  const mockMessages = [
    {
      id: 1,
      senderId: 'producer123',
      senderName: 'PrintMasters Inc.',
      senderRole: 'producer',
      receiverId: 'designer456',
      orderId: orderId || 'order789',
      content: 'Hi there! I received your order and wanted to discuss the paper quality options. Would you prefer glossy or matte finish?',
      timestamp: new Date('2025-04-10T10:30:00').getTime(),
      isRead: true
    },
    {
      id: 2,
      senderId: 'designer456',
      senderName: 'Sarah Design Studio',
      senderRole: 'designer',
      receiverId: 'producer123',
      orderId: orderId || 'order789',
      content: 'Thanks for reaching out! For this project, I think a matte finish would work better with the design aesthetic.',
      timestamp: new Date('2025-04-10T11:15:00').getTime(),
      isRead: true
    },
    {
      id: 3,
      senderId: 'producer123',
      senderName: 'PrintMasters Inc.',
      senderRole: 'producer',
      receiverId: 'designer456',
      orderId: orderId || 'order789',
      content: 'Great choice! We have a few different weight options for the matte finish. The standard is 100lb, but we also offer 80lb and 120lb. Do you have a preference?',
      timestamp: new Date('2025-04-10T14:45:00').getTime(),
      isRead: true
    },
    {
      id: 4,
      senderId: 'designer456',
      senderName: 'Sarah Design Studio',
      senderRole: 'designer',
      receiverId: 'producer123',
      orderId: orderId || 'order789',
      content: 'Let\'s go with the 120lb for better durability. Also, when do you think this will be ready for pickup?',
      timestamp: new Date('2025-04-11T09:20:00').getTime(),
      isRead: false
    }
  ];
  
  // Fetch messages
  useEffect(() => {
    // In a real app, you would fetch messages from your API
    // For this demo, we'll just use the mock data
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessages(mockMessages);
      setLoading(false);
    }, 800);
  }, [orderId]);
  
  // Send message handler
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // In a real app, you would send this message to your API
    const message = {
      id: Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.role === 'designer' ? (currentUser.brandName || currentUser.fullName) : currentUser.businessName,
      senderRole: currentUser.role,
      receiverId: currentUser.role === 'designer' ? producerId : designerId,
      orderId: orderId || 'order789',
      content: newMessage,
      timestamp: Date.now(),
      isRead: false
    };
    
    // Add to local state
    setMessages([...messages, message]);
    setNewMessage('');
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Determine if a message is from the current user
  const isCurrentUserMessage = (senderId) => {
    return senderId === currentUser?.id;
  };
  
  return (
    <div className="message-center">
      {loading ? (
        <div className="loading-indicator">Loading messages...</div>
      ) : (
        <>
          <div 
            className="message-list"
            style={{
              height: '400px',
              overflowY: 'auto',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              backgroundColor: '#f9f9f9'
            }}
          >
            {messages.length === 0 ? (
              <div className="no-messages" style={{ textAlign: 'center', marginTop: '2rem', color: '#888' }}>
                <i className="fas fa-comments" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map(message => (
                <div
                  key={message.id}
                  className={`message-item ${isCurrentUserMessage(message.senderId) ? 'sent' : 'received'}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '1rem',
                    alignItems: isCurrentUserMessage(message.senderId) ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    className="message-bubble"
                    style={{
                      backgroundColor: isCurrentUserMessage(message.senderId) ? '#3a6ea5' : 'white',
                      color: isCurrentUserMessage(message.senderId) ? 'white' : '#333',
                      borderRadius: '18px',
                      padding: '0.75rem 1rem',
                      maxWidth: '80%',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      border: isCurrentUserMessage(message.senderId) ? 'none' : '1px solid #ddd',
                    }}
                  >
                    <div className="message-sender" style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {!isCurrentUserMessage(message.senderId) && message.senderName}
                    </div>
                    <div className="message-content" style={{ wordBreak: 'break-word' }}>
                      {message.content}
                    </div>
                  </div>
                  <div
                    className="message-timestamp"
                    style={{
                      fontSize: '0.75rem',
                      color: '#888',
                      marginTop: '0.25rem',
                    }}
                  >
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {!viewOnly && (
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}
              />
              <button
                type="submit"
                className="btn"
                disabled={!newMessage.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                }}
              >
                Send
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default MessageCenter;