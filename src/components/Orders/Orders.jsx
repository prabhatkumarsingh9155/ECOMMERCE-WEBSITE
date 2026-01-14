import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../../config/apiConfig';
import './Orders.css';

const Orders = ({ navigateTo, userDetails }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Payment token builder function
  const buildPaymentToken = ({
    productInfo = "Shoption Order",
    firstName,
    email,
    amount,
    phone,
    userId,
    orderId,
  }) => {
    const CALLBACK_URL = `${window.location.origin}/order-success`;
    
    const qs = [
      `ProductInfo=${productInfo}`,
      `FirstName=${firstName}`,
      `Email=${email}`,
      `Amount=${amount}`,
      `Phone=${phone}`,
      `UserId=${userId}`,
      `Order_id=${orderId}`,
      `Call_Back_URL=${CALLBACK_URL}`,
    ].join("&");

    return btoa(unescape(encodeURIComponent(qs)));
  };

  // Handle pay now button click
  const handlePayNow = (order) => {
    // Use pending amount, not payupreferedamount
    const amountToPay = order.pending_amount > 0 ? order.pending_amount : order.payupreferedamount;
    
    const paymentToken = buildPaymentToken({
      firstName: userDetails?.Customer_name || 'Customer',
      email: "utkarsh.rathore@shoption.in",
      amount: amountToPay.toFixed(2),
      phone: userDetails?.username || '',
      userId: order.order_id,
      orderId: order.order_id
    });
    
    const url = new URL(window.location);
    url.pathname = '/payment';
    url.searchParams.set('orderId', order.order_id);
    url.searchParams.set('token', paymentToken);
    url.searchParams.set('paymentMode', order.payupreferedmode === 'Full Payment' ? 'full' : 'cod');
    
    // Update URL and navigate to payment gateway
    window.history.pushState({}, '', url);
    navigateTo('payment');
  };

  // Handle view details button click
  const handleViewDetails = (orderId) => {
    console.log('🔍 View Details clicked for order:', orderId);
    navigateTo('viewDetails', orderId);
  };

  const fetchOrders = async () => {
    if (!userDetails?.token) return;
    
    try {
      setLoading(true);
      
      // Get current date and 30 days ago for date range
      const toDate = new Date().toISOString().split('T')[0];
      const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.cart.cart.get_order_from_list?from_date=${fromDate}&to_date=${toDate}&page_size=20&page=1`, {
        method: 'GET',
        headers: {
          'Authorization': userDetails.token,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (response.ok && data.message && data.message.status) {
        setOrders(data.message.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userDetails]);

  return (
    <div className="ord-orders-page-gt">
      <div className="ord-container">
        <div className="ord-orders-header-gt">
          <button className="ord-back-btn-gt" onClick={() => navigateTo('account')}>← Back</button>
          <h1>My Orders</h1>
        </div>
        
        {loading ? (
          <div className="ord-loading-container-gt">
            <div className="ord-loading-spinner-gt"></div>
            <p>Loading orders...</p>
          </div>
        ) : (
          <div className="ord-orders-list-gt">
            {orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              orders.map((order, index) => (
                <div key={order.id || index} className="ord-order-card-gt">
                  <div className="ord-order-header-gt">
                    <div className="ord-order-id-gt">
                      <strong>Order Id: #{order.order_id || order.name}</strong>
                      <span className="ord-order-date-gt">{order.date || order.creation}</span>
                      <button className="ord-view-details-btn-gbru-gt" onClick={() => handleViewDetails(order.order_id)}>View Details</button>
                    </div>
                    <button className="ord-help-btn-gt">Help?</button>
                  </div>
                  
                  <div className="ord-order-amounts-gt">
                    <div className="ord-amount-row-gt">
                      <span>Total Amount</span>
                      <span className="ord-amount-gt">₹{order.total_amount || order.grand_total}</span>
                    </div>
                    <div className="ord-amount-row-gt">
                      <span>Received Amount</span>
                      <span className="ord-amount-gt ord-received">₹{order.received_amount || '0.00'}</span>
                    </div>
                    <div className="ord-amount-row-gt">
                      <span>Unsettled Amount</span>
                      <span className="ord-amount-gt ord-unsettled">₹{order.unsettled_amount || '0.00'}</span>
                    </div>
                    <div className="ord-amount-row-gt">
                      <span>Pending Amount</span>
                      <span className="ord-amount-gt ord-pending">₹{order.pending_amount}</span>
                    </div>
                  </div>
                  
                  <div className="ord-order-footer-gt">
                    {order.status === 'Partially Paid' && <span className="ord-status-badge-gt">● Partially Paid</span>}
                    {order.pending_amount > 0 ? (
                      <>
                        <button className="ord-pay-now-btn-gt" onClick={() => handlePayNow(order)}>PAY NOW</button>
                        <div className="ord-payment-info-gt">
                          <span>Preferred Mode: {order.payupreferedmode}</span>
                          <span>Amount: ₹{order.payupreferedamount}</span>
                        </div>
                      </>
                    ) : (
                      <div className="ord-order-placed-gt">
                        <span className="ord-order-placed-text-gt">✓ Order Placed</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;