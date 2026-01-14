import React, { useEffect } from 'react';
import './PaymentScreen.css';

const BASE_URL = 'https://pg.shoption.in';

const PaymentScreen = ({ navigateTo }) => {
  // Gets token from URL parameters
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const token = params.get("token"); // ← Receives the Base64 encoded token

  useEffect(() => {
    if (token) {
      // Create a form, inject the token, auto-submit to Shoption PG
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `${BASE_URL}/Payment/StartPayment`;

      const hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = "token";
      hidden.value = token;
      form.appendChild(hidden);

      document.body.appendChild(form);
      form.submit();
    }
  }, [token]);

  return (
    <div className="payment-screen">
      <div className="payment-container">
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>Redirecting to secure payment...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;