// ERPNext API Integration Utility
// Handles all API calls to ERPNext backend with proper authentication headers

const ERPNEXT_CONFIG = {
  baseURL: process.env.REACT_APP_ERPNEXT_BASE_URL,
  apiKey: process.env.REACT_APP_ERPNEXT_API_KEY,
  apiSecret: process.env.REACT_APP_ERPNEXT_API_SECRET,
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000
};

// Default headers for ERPNext API calls
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'X-API-KEY': ERPNEXT_CONFIG.apiKey,
  'X-API-SECRET': ERPNEXT_CONFIG.apiSecret,
  'Accept': 'application/json'
});

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${ERPNEXT_CONFIG.baseURL}${endpoint}`;
  
  const config = {
    headers: getHeaders(),
    timeout: ERPNEXT_CONFIG.timeout,
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('ERPNext API Error:', error);
    throw error;
  }
};

// Product API calls
export const productAPI = {
  getProducts: () => apiCall('/api/resource/Item'),
  getProduct: (id) => apiCall(`/api/resource/Item/${id}`),
  searchProducts: (query) => apiCall(`/api/resource/Item?filters=[["item_name","like","%${query}%"]]`)
};

// Customer API calls
export const customerAPI = {
  createCustomer: (customerData) => apiCall('/api/resource/Customer', {
    method: 'POST',
    body: JSON.stringify(customerData)
  }),
  getCustomer: (id) => apiCall(`/api/resource/Customer/${id}`)
};

// Order API calls
export const orderAPI = {
  createOrder: (orderData) => apiCall('/api/resource/Sales Order', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
  getOrder: (id) => apiCall(`/api/resource/Sales Order/${id}`)
};

export default { productAPI, customerAPI, orderAPI };