import React, { useState } from 'react';
import { API_CONFIG } from '../../config/apiConfig';
import './PaymentPage.css';
import { buildPaymentToken } from '../../utils/paymentUtils';

const PaymentPage = ({ checkoutData, navigateTo, user, userDetails, clearCart }) => {
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user || !userDetails?.token) {
      alert('Please login to place order');
      return;
    }
    
    setLoading(true);
    
    try {
      const cartResponse = await fetch('${API_CONFIG.Prabhat_URL}/api/method/shoption_api.cart.cart.get_cart', {
        method: 'GET',
        headers: {
          'Authorization': userDetails.token,
          'Content-Type': 'application/json'
        }
      });
      
      const cartData = await cartResponse.json();
      if (!cartResponse.ok || !cartData.message?.status) {
        throw new Error('Failed to get cart items');
      }
      
      const orderData = {
        items: cartData.message.data.items.map(item => ({
          item: parseInt(item.item),
          quantity: item.quantity
        })),
        delivery_date: null,
        warehouse: checkoutData?.warehouse || '',
        transporter: checkoutData?.transporter || '',
        coupon_code: '',
        payment_type: selectedPayment === 'full' ? 'Full Payment' : 'Cash On Delivery',
        transaction_amount: selectedPayment === 'full' 
          ? parseFloat(checkoutData?.payment_summary?.full_payment?.payable_amount || checkoutData?.grand_total)
          : parseFloat(checkoutData?.payment_summary?.cash_on_delivery?.pay_now || checkoutData?.grand_total)
      };
      
      const orderResponse = await fetch('${API_CONFIG.Prabhat_URL}/api/method/shoption_api.cart.cart.place_order', {
        method: 'POST',
        headers: {
          'Authorization': userDetails.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      const orderResult = await orderResponse.json();
      
      if (orderResponse.ok && orderResult.message?.status === true && orderResult.message?.data?.sales_order) {
        const salesOrder = orderResult.message.data.sales_order;
        const transactionAmount = orderResult.message.data.transaction_amount;
        
        if (selectedPayment === 'full') {
          const token = buildPaymentToken({
            firstName: userDetails?.Customer_name || 'Customer',
            email: "utkarsh.rathore@shoption.in",
            amount: transactionAmount.toFixed(2),
            phone: userDetails?.user_id || '',
            userId: userDetails?.shoption_customer_id || userDetails?.username || '',
            orderId: salesOrder
          });
          
          // Navigate with URL parameters like the example
          window.location.href = `/payment?orderId=${salesOrder}&token=${token}&paymentMode=full`;
          return;
        }
        
        alert(`Order placed successfully! Order ID: ${salesOrder}`);
        clearCart();
        navigateTo('home');
      } else {
        throw new Error(orderResult.message?.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="container">
        <h1>💳 Payment</h1>
        
        <div className="payment-content">
          <div className="payment-section">
            <h3>Select Payment Method</h3>
            
            {checkoutData?.payment_summary?.full_payment && (
              <div 
                className={`payment-option ${selectedPayment === 'full' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment('full')}
              >
                <div className="payment-header">
                  <h4>💳 Full Payment</h4>
                  <span className="payment-badge">Best Deal</span>
                </div>
                <div className="payment-details">
                  <div className="payment-amount">₹{checkoutData.payment_summary.full_payment.payable_amount}</div>
                  <div className="payment-savings">{checkoutData.payment_summary.full_payment.label}</div>
                  <div className="payment-discount">Discount: ₹{checkoutData.payment_summary.full_payment.discount_amount}</div>
                </div>
              </div>
            )}
            
            {checkoutData?.payment_summary?.cash_on_delivery && (
              <div 
                className={`payment-option ${selectedPayment === 'cod' ? 'selected' : ''}`}
                onClick={() => setSelectedPayment('cod')}
              >
                <div className="payment-header">
                  <h4>🚚 Cash on Delivery</h4>
                </div>
                <div className="payment-details">
                  <div className="payment-amount">₹{checkoutData.payment_summary.cash_on_delivery.pay_now}</div>
                  <div className="payment-savings">{checkoutData.payment_summary.cash_on_delivery.label}</div>
                  <div className="payment-discount">Discount: ₹{checkoutData.payment_summary.cash_on_delivery.discount_amount}</div>
                  <div className="cod-balance">Pay ₹{checkoutData.payment_summary.cash_on_delivery.pay_on_delivery} on delivery</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="order-summary">
            <h3>📋 Order Summary</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{checkoutData?.sub_total || 0}</span>
              </div>
              <div className="summary-row">
                <span>Taxes:</span>
                <span>₹{checkoutData?.total_taxes_and_charges || 0}</span>
              </div>
              <div className="summary-row">
                <span>Discount:</span>
                <span>-₹{checkoutData?.discount_amount || 0}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{checkoutData?.grand_total || 0}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="payment-actions">
          <button 
            className="btn btn-back" 
            onClick={() => navigateTo('checkout')}
          >
            ← Back to Checkout
          </button>
          <button 
            className="btn btn-primary place-order-btn" 
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? 'Placing Order...' : '🛒 Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;