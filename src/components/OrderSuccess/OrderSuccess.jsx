import React, { useState } from 'react';
import './OrderSuccess.css';

const OrderSuccess = ({ navigateTo }) => {
  const [copiedField, setCopiedField] = useState(null);
  
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');
  const txnid = urlParams.get('txnid');
  const amount = urlParams.get('amount');
  const orderId = urlParams.get('orderId');

  // Copy to clipboard function
  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Check if it's COD order
  const isCOD = txnid && txnid.startsWith('COD-');

  if (status !== 'success') {
    return (
      <div className="order-container">
        <div className="order-card">
          <div className="order-icon failed-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" fill="#fef2f2"/>
              <path d="M15 9l-6 6M9 9l6 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="order-title failed-title">Payment Failed</h1>
          <p className="order-description failed-description">
            We couldn't process your payment. Please try again or contact support if the issue persists.
          </p>
          <div className="order-actions">
            <button className="order-btn primary-btn" onClick={() => navigateTo('home')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Simplified UI for COD orders
  if (isCOD) {
    return (
      <div className="order-container">
        <div className="order-card">
          <div className="order-icon success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" fill="#f0fdf4"/>
              <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="order-title success-title">Order Placed Successfully!</h1>
          <p className="order-description success-description">
            Thank you for choosing us! Your order has been confirmed and will be delivered soon.
          </p>

          <div className="order-details">
            <h3 className="details-title">Order Summary</h3>

            <div className="detail-row">
              <span className="detail-label">Order ID</span>
              <span className="detail-value">{orderId}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Amount (Cash on Delivery)</span>
              <span className="detail-value amount">₹{amount}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Payment Method</span>
              <span className="detail-value">Cash on Delivery</span>
            </div>

            <div className="detail-row status-row">
              <span className="detail-label">Status</span>
              <span className="status-badge confirmed">Confirmed</span>
            </div>
          </div>

          <div className="order-actions">
            <button className="order-btn primary-btn" onClick={() => navigateTo('home')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-container">
      <div className="order-card">
        <div className="order-icon success-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" fill="#f0fdf4"/>
            <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="order-title success-title">Payment Successful!</h1>
        <p className="order-description success-description">
          Thank you for your purchase! Your payment has been processed successfully.
        </p>

        <div className="order-details">
          <h3 className="details-title">Transaction Details</h3>
          
          <div className="detail-row">
            <div className="detail-content">
              <span className="detail-label">Transaction ID</span>
              <span className="detail-value">{txnid}</span>
            </div>
            <button
              onClick={() => copyToClipboard(txnid, 'txn')}
              className="copy-btn"
              title="Copy Transaction ID"
            >
              {copiedField === 'txn' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="#6b7280" strokeWidth="2" fill="none"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="#6b7280" strokeWidth="2" fill="none"/>
                </svg>
              )}
            </button>
          </div>

          <div className="detail-row">
            <div className="detail-content">
              <span className="detail-label">Order ID</span>
              <span className="detail-value">{orderId}</span>
            </div>
            <button
              onClick={() => copyToClipboard(orderId, 'order')}
              className="copy-btn"
              title="Copy Order ID"
            >
              {copiedField === 'order' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="#6b7280" strokeWidth="2" fill="none"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="#6b7280" strokeWidth="2" fill="none"/>
                </svg>
              )}
            </button>
          </div>

          <div className="detail-row">
            <span className="detail-label">Amount Paid</span>
            <span className="detail-value amount">₹{amount}</span>
          </div>

          <div className="detail-row status-row">
            <span className="detail-label">Status</span>
            <span className="status-badge success">Success</span>
          </div>
        </div>

        <div className="order-actions">
          <button className="order-btn primary-btn" onClick={() => navigateTo('home')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;