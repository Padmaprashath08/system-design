import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const socket = io('https://system-design-npf2.onrender.com');

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('https://system-design-npf2.onrender.com/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (error) {
        console.error('Failed to fetch users');
      }
    };
    if (token) {
      fetchUsers();
      socket.emit('join', user.id);
    }
  }, [token, user.id]);

  return (
    <div>
      <h2>All Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
