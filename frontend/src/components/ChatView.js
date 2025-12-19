import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const socket = io('https://system-design-npf2.onrender.com');

const ChatView = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user, token } = useAuth();

  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(`https://system-design-npf2.onrender.com/api/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch messages');
    }
  }, [token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    const handleConnect = () => {
      socket.emit('join', user.id);
    };
    socket.on('connect', handleConnect);
    socket.emit('join', user.id); 
    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.off('connect', handleConnect);
      socket.off('receiveMessage');
    };
  }, [user.id]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await axios.post('https://system-design-npf2.onrender.com/api/messages', {
        content: newMessage,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      socket.emit('sendMessage', {
        senderId: user.id,
        content: newMessage,
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message');
    }
  };

  return (
    <div className="chat-view">
      <h2>Group Chat</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender._id === user.id ? 'sent' : 'received'}`}>
            <strong>{msg.sender.username}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatView;
