import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../../config/apiConfig';
import './ProductDetails.css';

const ProductDetails = ({ product, productDetails, addToCart, navigateTo, user, previousPage, userDetails, fetchCartCount }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  
  // Use API data if available, otherwise fallback to product data
  const details = productDetails?.message?.data;
  const images = details?.images ? Object.values(details.images).filter(img => img && img.trim() !== '') : [];
  
  const displayProduct = details ? {
    id: details.item_code,
    name: details.item_name,
    price: details.price,
    originalPrice: details.mrp,
    image: images[0] || details.images?.image_1,
    images: images,
    description: details.description,
    rating: 4.5,
    reviews: 100,
    brand: details.brand,
    unit: details.measurement_unit,
    minOrderQty: details.min_order_qty
  } : product;
  
  // Set initial quantity to minOrderQty if available
  useEffect(() => {
    if (displayProduct?.minOrderQty) {
      setQuantity(displayProduct.minOrderQty);
    }
  }, [displayProduct?.minOrderQty]);
  
  if (!displayProduct) {
    return <div className="container">Product not found</div>;
  }

  // Check if item is already in cart
  const checkCartStatus = async () => {
    if (!user || !userDetails?.token) return;
    
    try {
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.cart.cart.cart_item_details?item=${displayProduct.id || displayProduct.item_code}`, {
        method: 'GET',
        headers: {
          'Authorization': userDetails.token,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (response.ok && data.message && data.message.status) {
        setIsAdded(true);
      }
    } catch (error) {
      console.error('Error checking cart status:', error);
    }
  };

  // Check cart status when component mounts
  useEffect(() => {
    checkCartStatus();
  }, [user, userDetails?.token, displayProduct]);

  // Handle scroll for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = async () => {
    console.log('ProductDetails - Add to cart clicked');
    console.log('ProductDetails - User:', !!user, 'Token:', !!userDetails?.token);
    console.log('ProductDetails - Product ID:', displayProduct.id || displayProduct.item_code);
    
    if (user && userDetails?.token) {
      try {
        // Directly add item to cart using API
        const requestData = {
          items: [{
            item: displayProduct.id || displayProduct.item_code,
            quantity: quantity,
            is_moq_applicable: 0
          }]
        };
        
        console.log('ProductDetails - API Request:', requestData);
        
        const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.cart.cart.add_cart`, {
          method: 'POST',
          headers: {
            'Authorization': userDetails.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });
        
        console.log('ProductDetails - API Response Status:', response.status);
        
        if (response.ok) {
          const addData = await response.json();
          console.log('✅ ProductDetails - SUCCESS: Item added to cart');
          console.log('ProductDetails - Response:', addData);
          
          // Mark item as added
          setIsAdded(true);
          
          // Refresh cart count
          if (fetchCartCount) {
            fetchCartCount();
          }
        } else {
          console.error('❌ ProductDetails - Failed to add item to cart');
        }
      } catch (error) {
        console.error('❌ ProductDetails - Error adding to cart:', error);
      }
    } else {
      console.log('ProductDetails - Using local cart (no user or token)');
      addToCart(displayProduct, quantity);
      setIsAdded(true);
    }
  };

  return (
    <div className="product-details">
      <div className="container">
        <button className="back-btn" onClick={() => navigateTo(previousPage || 'home')}>
          ← Back
        </button>
        
        <div className="product-content">
          <div className="product-images">
            <div className="main-image">
              <img src={displayProduct.images?.[selectedImage] || displayProduct.image} alt={displayProduct.name} />
            </div>
            {displayProduct.images && displayProduct.images.length > 1 && (
              <div className="image-thumbnails">
                {displayProduct.images.map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt={`${displayProduct.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="product-info">
            <h1>{displayProduct.name}</h1>
            
            <div className="price-section">
              <div className="price-row">
                <span className="current-price">₹{displayProduct.price.toLocaleString()}/-</span>
                {displayProduct.originalPrice > displayProduct.price && (
                  <>
                    <span className="original-price">MRP: ₹{displayProduct.originalPrice.toLocaleString()}</span>
                    <span className="discount-badge">{Math.round(((displayProduct.originalPrice - displayProduct.price) / displayProduct.originalPrice) * 100)}% Off</span>
                  </>
                )}
              </div>
              <div className="per-unit-text">(₹{displayProduct.price.toLocaleString()} per {displayProduct.unit || 'unit'})</div>
            </div>
            
            <div className="product-rating">
              <span className="stars">{'★'.repeat(Math.floor(displayProduct.rating || 4))}</span>
              <span className="rating-text">({displayProduct.rating || 4.1} out of 5)</span>
              <span className="reviews-text">({displayProduct.reviews || 6082} ratings)</span>
            </div>
            
            <div className="tax-info">
              <span>📋 Inclusive of all taxes</span>
            </div>
            
            <div className="quality-badge">
              <span>🏆 Farmer Approved Quality</span>
            </div>
            
            <div className="delivery-info">
              <div className="info-box">
                <div className="info-icon">📦</div>
                <div className="info-content">
                  <div className="info-label">MINIMUM ORDER</div>
                  <div className="info-value">{displayProduct.minOrderQty || 1}.0 Units</div>
                </div>
              </div>
              <div className="info-box">
                <div className="info-icon">🚚</div>
                <div className="info-content">
                  <div className="info-label">FAST DELIVERY</div>
                  <div className="info-value">2-3 Days</div>
                </div>
              </div>
            </div>
            
            {/* Payment Options */}
            {details && (
              <div className="payment-options">
                <div className="payment-option">
                  <h4>Full Payment</h4>
                  <div className="payment-details">
                    <div className="payment-row">
                      <span>Pay Now:</span>
                      <span className="price">₹{details.full_payment_amount.toFixed(2)}</span>
                    </div>
                    <div className="payment-row per-unit-row">
                      <span>(₹{details.full_payment_amount.toFixed(2)} per {displayProduct.unit || 'unit'})</span>
                    </div>
                    <div className="payment-row">
                      <span>Actual Price:</span>
                      <span>₹{displayProduct.price.toFixed(2)}</span>
                    </div>
                    <div className="payment-row">
                      <span>You Save:</span>
                      <span className="discount">₹{details.full_payment_discount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                </div>
                <div className="payment-option">
                  <h4>Booking Amount</h4>
                  <div className="payment-details">
                    <div className="payment-row">
                      <span>Booking Amount:</span>
                      <span className="price">₹{details.COD_Display.toFixed(2)}</span>
                    </div>
                    <div className="payment-row">
                      <span>Actual Price:</span>
                      <span>₹{displayProduct.price.toFixed(2)}</span>
                    </div>
                    <div className="payment-row">
                      <span>Remaining Amount on Delivery:</span>
                      <span>₹{(details.COD_value - details.COD_Display).toFixed(2)}</span>
                    </div>
                  </div>
                  
                </div>
              </div>
            )}
            
            {displayProduct.unit && (
              <div className="product-unit">
                <span>Unit: {displayProduct.unit}</span>
              </div>
            )}
            
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(displayProduct.minOrderQty || 1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              {displayProduct.minOrderQty && (
                <small>Minimum order: {displayProduct.minOrderQty}</small>
              )}
            </div>
            
            <div className="product-actions">
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                {isAdded ? 'Added' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="product-tabs">
          <div className="tab-buttons">
            <button 
              className={activeTab === 'description' ? 'active' : ''}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={activeTab === 'specifications' ? 'active' : ''}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-panel">
                <p>{displayProduct.description}</p>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="tab-panel">
                <ul>
                  <li>Brand: {displayProduct.brand}</li>
                  <li>Unit: {displayProduct.unit}</li>
                  <li>Price: ₹{displayProduct.price}</li>
                  <li>MRP: ₹{displayProduct.originalPrice}</li>
                  {displayProduct.minOrderQty && <li>Minimum Order Quantity: {displayProduct.minOrderQty}</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className={`sticky-bottom-bar ${showStickyBar ? 'visible' : ''}`}>
        <div className="sticky-content">
          <div className="sticky-price">
            <div className="sticky-price-main">₹{details?.full_payment_amount ? details.full_payment_amount.toLocaleString() : displayProduct.price.toLocaleString()}</div>
            <div className="sticky-price-details">
              <span className="sticky-mrp">MRP: ₹{displayProduct.originalPrice.toLocaleString()}</span>
              <span className="sticky-save">Save ₹{details?.full_payment_discount ? details.full_payment_discount.toLocaleString() : (displayProduct.originalPrice - displayProduct.price).toLocaleString()}</span>
            </div>
          </div>
          <div className="sticky-actions">
            <button className="btn-sticky-cart" onClick={handleAddToCart}>
              {isAdded ? 'Added' : '🛒 Add To Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;