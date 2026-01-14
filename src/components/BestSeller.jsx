import React, { useEffect, useState } from 'react';
import { API_CONFIG } from '../config/apiConfig';
import './BestSeller.css';

const BestSeller = ({ addToCart, navigateTo, user, products = [], userDetails, fetchCartCount }) => {
  const [apiProducts, setApiProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedItems, setAddedItems] = useState(new Set());

  // Check which items are in cart
  const checkCartItems = async () => {
    if (!user || !userDetails?.token) return;
    
    try {
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.cart.cart.get_cart`, {
        method: 'GET',
        headers: {
          'Authorization': userDetails.token,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (response.ok && data.message && data.message.status) {
        const cartItemCodes = new Set(data.message.data.items.map(item => item.item));
        setAddedItems(cartItemCodes);
      }
    } catch (error) {
      console.error('Error checking cart items:', error);
    }
  };

  // Add to cart via API
  const handleAddToCart = async (product) => {
    if (user && userDetails?.token) {
      try {
        const requestData = {
          items: [{
            item: product.item_code,
            quantity: 1,
            is_moq_applicable: 0
          }]
        };
        
        const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.cart.cart.add_cart`, {
          method: 'POST',
          headers: {
            'Authorization': userDetails.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });
        
        if (response.ok) {
          const addData = await response.json();
          if (addData.message && addData.message.status) {
            setAddedItems(prev => new Set([...prev, product.item_code]));
          }
          if (fetchCartCount) {
            fetchCartCount();
          }
          await checkCartItems();
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      addToCart(product);
    }
  };
  // Handle view details - fetch item details from API
  const handleViewDetails = async (product) => {
    const itemCode = product.item_code || product.id;
    if (!user || !itemCode) {
      navigateTo('products', null, product.category);
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.erp_api.Item_details.get_item_details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-API-KEY': API_CONFIG.API_KEY,
          'X-API-SECRET': API_CONFIG.API_SECRET
        },
        body: JSON.stringify({
          page: 1,
          page_size: 20,
          mobile_no: parseInt(user.phone),
          item_code: itemCode
        })
      });
      
      const data = await response.json();
      
      // Navigate to product details with the fetched data
      navigateTo('productDetails', { product, details: data });
    } catch (error) {
      navigateTo('products', null, product.category);
    }
  };

  const fetchBestSellers = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('page', '1');
      formData.append('page_size', '100');
      formData.append('mobile_no', user.phone);

      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.erp_api.deals.trending_best_seller.get_trending_best_seller`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-API-KEY': API_CONFIG.API_KEY,
          'X-API-SECRET': API_CONFIG.API_SECRET
        },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        const formattedProducts = (data.message.data.data || []).map((item, index) => ({
          id: item.item_code || index,
          item_code: item.item_code,
          name: item.item_name || 'Product Name',
          price: parseFloat(item.price || item.actual_rate) || 0,
          originalPrice: parseFloat(item.mrp) || parseFloat(item.price || item.actual_rate),
          discount: parseFloat(item.discount) || 0,
          image: item.custom_image_1 || item.item_image || 'https://via.placeholder.com/300x200',
          category: item.item_group || 'General',
          rating: 4.5,
          reviews: Math.floor(Math.random() * 100) + 10,
          mrp: item.mrp,
          actual_rate: item.actual_rate
        }));
        setApiProducts(formattedProducts);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBestSellers();
    }
    checkCartItems();
  }, [user, userDetails]);

  const displayProducts = user ? apiProducts : products.filter(p => p.bestSeller);

  return (
    <section className="bestsellers-section-dt">
      <div className="container">
        <div className="section-header-dt">
          <h2 className="section-title-dt">Best Sellers</h2>
          <button className="view-all-link-dt" onClick={() => navigateTo('products', null, null, 'bestsellers')}>View All →</button>
        </div>
        {user && loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading best sellers...</div>
        ) : displayProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>No best sellers available</div>
        ) : (
        <div className="products-scroll-dt">
          {displayProducts.map((product, index) => (
            <div key={`${product.id || product.item_code || 'product'}-${index}`} className="product-card-dt">
              <div className="product-image-dt" onClick={() => handleViewDetails(product)}>
                <img 
                  src={product.image || product.item_image || 'https://via.placeholder.com/300x200'} 
                  alt={product.name || product.item_name || 'Product'} 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200'; }}
                />
                {user ? (
                  product.originalPrice && product.originalPrice > product.price && (
                    <div className="discount-badge-dt">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )
                ) : (
                  product.originalPrice > product.price && (
                    <div className="discount-badge-dt">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )
                )}
              </div>
              <div className="product-info-dt">
                <h3 className="product-name-dt">{product.name || product.item_name || 'Product Name'}</h3>
                <div className="product-rating-dt">
                  <span className="stars-dt">{'★'.repeat(Math.floor(product.rating || 4))}</span>
                  <span className="rating-text-dt">({product.reviews || 0})</span>
                </div>
                <div className="product-price-dt">
                  <span className="current-price-dt">₹{product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="original-price-dt">₹{product.originalPrice}</span>
                  )}
                </div>
                <button className="btn-dt btn-primary-dt" onClick={() => user ? handleAddToCart(product) : navigateTo('auth')}>
                  {addedItems.has(product.item_code) ? 'Added' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};

export default BestSeller;