import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ChatList from './components/ChatList';
import ChatView from './components/ChatView';
import './App.css';

function AppContent() {
  const { user, logout } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  if (!user) {
    return (
      <div className="App">
        <h1>Group Chat App</h1>
        {isRegistering ? (
          <Register onRegister={() => setIsRegistering(false)} />
        ) : (
          <Login />
        )}
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Back to Login' : 'Register'}
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-list">
          <ChatList />
          <button onClick={logout}>Logout</button>
        </div>
        <div className="chat-view">
          <ChatView />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
