import React, { useState, useEffect } from 'react';
import './Account.css';
import { API_CONFIG } from '../../config/apiConfig';

const Account = ({ user, navigateTo }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.phone) {
      fetchUserDetails();
    }
  }, [user]);

  const fetchUserDetails = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.erp_api.utility.get_user_details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_CONFIG.API_KEY,
          'X-API-SECRET': API_CONFIG.API_SECRET
        },
        body: JSON.stringify({ mobile_no: parseInt(user.phone) })
      });
      
      const data = await response.json();
      
      if (response.ok && data.message && data.message.status) {
        console.log('User Details Data:', data.message.data);
        const userData = data.message.data;
        
        // Create token from key_details if available
        if (userData.key_details && userData.key_details.api_key && userData.key_details.api_secret) {
          const userToken = `token ${userData.key_details.api_key}:${userData.key_details.api_secret}`;
          userData.token = userToken;
          console.log('User token created:', userToken);
        }
        
        setUserDetails(userData);
      } else if (response.status === 417 && retryCount < 2) {
        // Retry on 417 error up to 2 times
        setTimeout(() => fetchUserDetails(retryCount + 1), 1000);
        return;
      } else {
        setError('Failed to fetch user details');
      }
    } catch (error) {
      if (retryCount < 2) {
        // Retry on network error up to 2 times
        setTimeout(() => fetchUserDetails(retryCount + 1), 1000);
        return;
      }
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="account-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading account details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-page">
        <div className="container">
          <div className="error-container">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchUserDetails}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="container">
        {userDetails && (
          <div className="account-content">
            <div className="profile-card">
              <div className="profile-back-btn" onClick={() => navigateTo('home')}>
                ← Back
              </div>
              <div className="profile-header">
                <div className="profile-avatar">
                  <div className="avatar-placeholder">
                    {userDetails.Customer_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="profile-info">
                  <h2>{userDetails.Customer_name || 'User'}</h2>
                </div>
              </div>
              
              <div className="account-menu">
                <button className="menu-item" onClick={() => navigateTo('home')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                  Home
                </button>
                <button className="menu-item" onClick={() => navigateTo('contact')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Contact Us
                </button>
                <button className="menu-item" onClick={() => navigateTo('orders')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                  </svg>
                  Orders
                </button>
                <button className="menu-item logout" onClick={() => {
                  localStorage.removeItem('user');
                  navigateTo('home');
                  window.location.reload();
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16,17 21,12 16,7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;