import { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/apiConfig';

export const useUserAuthentication = () => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserDetails = async (userPhone) => {
    try {
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.erp_api.utility.get_user_details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_CONFIG.API_KEY,
          'X-API-SECRET': API_CONFIG.API_SECRET
        },
        body: JSON.stringify({ mobile_no: parseInt(userPhone) })
      });
      
      const data = await response.json();
      
      if (response.ok && data.message && data.message.status) {
        const userData = data.message.data;
        
        if (userData.key_details && userData.key_details.api_key && userData.key_details.api_secret) {
          const userToken = `token ${userData.key_details.api_key}:${userData.key_details.api_secret}`;
          userData.token = userToken;
        }
        
        setUserDetails(userData);
        return userData;
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
    return null;
  };

  useEffect(() => {
    if (user && user.phone && !userDetails) {
      fetchUserDetails(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {}
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return { user, setUser, userDetails, logout };
};
