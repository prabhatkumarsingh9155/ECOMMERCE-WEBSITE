import React from 'react';
import './MaintenanceMode.css';

const MaintenanceMode = () => {
  return (
    <div className="maintenance-container">
      <div className="maintenance-content">
        {/* Running Man Animation */}
        <div className="running-man">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="20" r="8" fill="currentColor" className="head" />
            <line x1="50" y1="28" x2="50" y2="55" stroke="currentColor" strokeWidth="3" className="body" />
            <line x1="50" y1="35" x2="35" y2="45" stroke="currentColor" strokeWidth="3" className="arm-left" />
            <line x1="50" y1="35" x2="65" y2="25" stroke="currentColor" strokeWidth="3" className="arm-right" />
            <line x1="50" y1="55" x2="35" y2="75" stroke="currentColor" strokeWidth="3" className="leg-left" />
            <line x1="50" y1="55" x2="65" y2="70" stroke="currentColor" strokeWidth="3" className="leg-right" />
          </svg>
        </div>
        
        <h1 className="maintenance-title">Under Maintenance</h1>
        
        <p className="maintenance-description">
          We're making things better for you. We'll be back shortly!
        </p>
        
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
        
        <p className="maintenance-footer">
          Thank you for your patience
        </p>
      </div>
    </div>
  );
};

export default MaintenanceMode;