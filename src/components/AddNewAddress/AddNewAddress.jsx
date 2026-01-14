import React, { useState, useEffect } from 'react';
import './AddNewAddress.css';
import { API_CONFIG } from '../../config/apiConfig';

const AddNewAddress = ({ navigateTo, userDetails, user, previousPage }) => {
  const [formData, setFormData] = useState({
    address_title: '',
    address_line1: '',
    address_line2: '',
    marketplace: '',
    tahsil: '',
    district: '',
    state: '',
    pincode: '',
    country: 'India',
    email_id: '',
    phone: ''
  });
  
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tahsils, setTahsils] = useState([]);
  const [marketplaces, setMarketplaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const [existingAddresses, setExistingAddresses] = useState([]);
  const [newlyAddedAddress, setNewlyAddedAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchCountries = async () => {
    try {
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.area.api.get_countries`, {
        method: 'GET',
        headers: {
          'X-API-KEY': API_CONFIG.API_KEY,
          'X-API-SECRET': API_CONFIG.API_SECRET
        }
      });
      const data = await response.json();
      if (response.ok && data.message && data.message.data && Array.isArray(data.message.data)) {
        setCountries(data.message.data.sort((a, b) => a.name === 'India' ? -1 : b.name === 'India' ? 1 : a.name.localeCompare(b.name)));
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStates = async (country) => {
    try {
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.area.api.get_states`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_CONFIG.API_KEY,
          'X-API-SECRET': API_CONFIG.API_SECRET
        },
        body: JSON.stringify({ name: country })
      });
      const data = await response.json();
      if (response.ok && data.message && data.message.data && Array.isArray(data.message.data)) {
        setStates(data.message.data);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchDistricts = async (state) => {
    try {
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.area.api.get_districts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_CONFIG.API_KEY,
          'X-API-SECRET': API_CONFIG.API_SECRET
        },
        body: JSON.stringify({ state_id: state })
      });
      const data = await response.json();
      if (response.ok && data.message && data.message.data && Array.isArray(data.message.data)) {
        setDistricts(data.message.data);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchTahsils = async (district) => {
    try {
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.area.api.get_tahsils`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_CONFIG.API_KEY,
          'X-API-SECRET': API_CONFIG.API_SECRET
        },
        body: JSON.stringify({ district_id: district })
      });
      const data = await response.json();
      if (response.ok && data.message && data.message.data && Array.isArray(data.message.data)) {
        setTahsils(data.message.data);
      }
    } catch (error) {
      console.error('Error fetching tahsils:', error);
    }
  };

  const fetchMarketplaces = async (tahsil) => {
    try {
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.area.api.get_marketplaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_CONFIG.API_KEY,
          'X-API-SECRET': API_CONFIG.API_SECRET
        },
        body: JSON.stringify({ tehsil_id: tahsil })
      });
      const data = await response.json();
      if (response.ok && data.message && data.message.data && Array.isArray(data.message.data)) {
        setMarketplaces(data.message.data);
      }
    } catch (error) {
      console.error('Error fetching marketplaces:', error);
    }
  };

  const fetchExistingAddresses = async () => {
    if (!user || !userDetails?.token) return;

    try {
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.cart.cart.get_customer_shipping_address`, {
        method: 'GET',
        headers: {
          'Authorization': userDetails.token,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok && data.message && data.message.status) {
        setExistingAddresses(data.message.data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  useEffect(() => {
    fetchCountries();
    // Auto-load states for India since it's the default country
    fetchStates('India');
    fetchExistingAddresses();
    if (userDetails?.email_id || user?.email) {
      setFormData(prev => ({
        ...prev,
        email_id: userDetails?.email_id || user?.email || '',
        phone: user?.phone || ''
      }));
    }
  }, [userDetails, user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const updateAddress = async () => {
    if (!user || !userDetails?.token || !editingAddress) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.cart.cart.update_customer_shipping_address`, {
        method: 'PUT',
        headers: {
          'Authorization': userDetails.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editingAddress.name,
          ...formData
        })
      });

      const data = await response.json();
      if (response.ok && data.message && data.message.status) {
        console.log('✅ Address updated successfully');
        setShowEditForm(false);
        setEditingAddress(null);
        fetchExistingAddresses();
      }
    } catch (error) {
      console.error('❌ Error updating address:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditAddress = (address) => {
    setEditingAddress(address);
    setFormData({
      address_title: address.address_title,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      marketplace: address.marketplace,
      tahsil: address.tahsil,
      district: address.district,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      email_id: address.email_id || userDetails?.email_id || user?.email || '',
      phone: address.phone || user?.phone || ''
    });
    setShowEditForm(true);
  };

  const deleteAddress = async (addressName) => {
    if (!user || !userDetails?.token) return;
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.cart.cart.delete_customer_shipping_address`, {
        method: 'DELETE',
        headers: {
          'Authorization': userDetails.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: addressName })
      });

      const data = await response.json();
      if (response.ok && data.message && data.message.status) {
        console.log('✅ Address deleted successfully');
        fetchExistingAddresses();
      }
    } catch (error) {
      console.error('❌ Error deleting address:', error);
    }
  };

  const makePrimaryAddress = async (addressName) => {
    if (!user || !userDetails?.token) return;

    try {
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.cart.cart.make_primary_shipping_address`, {
        method: 'PUT',
        headers: {
          'Authorization': userDetails.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: addressName })
      });

      const data = await response.json();
      if (response.ok && data.message && data.message.status) {
        console.log('✅ Primary address updated');
        // Navigate to checkout page immediately
        navigateTo('checkout');
      }
    } catch (error) {
      console.error('❌ Error making address primary:', error);
    }
  };

  const handleAddNewAddress = async () => {
    if (!user || !userDetails?.token) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.Prabhat_URL}/api/method/shoption_api.cart.cart.add_customer_shipping_address`, {
        method: 'POST',
        headers: {
          'Authorization': userDetails.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Add Address API Response:', data);
      if (response.ok && data.message && data.message.status) {
        console.log('✅ Address added successfully');
        setNewlyAddedAddress(data.message.data);
        setResponseMessage(`Address added successfully!\n\nAddress Name: ${data.message.data.name}\nTitle: ${data.message.data.address_title}\nLocation: ${data.message.data.marketplace}\nPincode: ${data.message.data.pincode}`);
        setShowResponse(true);
        setTimeout(() => {
          navigateTo('checkout');
        }, 3000);
      } else {
        console.error('❌ Failed to add address');
        setResponseMessage('Failed to add address. Please try again.');
        setShowResponse(true);
      }
    } catch (error) {
      console.error('❌ Error adding address:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-address-page-g">
      <div className="container">
        <div className="add-address-header-g">
          <button className="back-btn-g" onClick={() => navigateTo(previousPage || 'account')}>
            ← Back
          </button>
          <h1>Add New Address</h1>
        </div>
        
        <div className="add-address-form-g">
          {showResponse && (
            <div className="response-message-g">
              <pre>{responseMessage}</pre>
            </div>
          )}
          <div className="form-row-g">
            <input type="text" name="address_title" placeholder="Address Title" value={formData.address_title} onChange={handleInputChange} required />
            <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required />
          </div>
          <div className="form-group-g">
            <input type="email" name="email_id" placeholder="Email" value={formData.email_id} onChange={handleInputChange} required />
          </div>
          <div className="form-row-g">
            <input type="text" name="address_line1" placeholder="Address Line 1" value={formData.address_line1} onChange={handleInputChange} required />
            <input type="text" name="address_line2" placeholder="Address Line 2" value={formData.address_line2} onChange={handleInputChange} />
          </div>
          <div className="form-row-g">
            <select name="country" value={formData.country} onChange={(e) => { const country = e.target.value; setFormData(prev => ({ ...prev, country, state: '', district: '', tahsil: '', marketplace: '' })); if (country) fetchStates(country); }} required>
              <option value="">Select Country</option>
              {countries.map((country) => (<option key={country.id} value={country.name}>{country.name}</option>))}
            </select>
            <select name="state" value={formData.state} onChange={(e) => { const state = e.target.value; setFormData(prev => ({ ...prev, state, district: '', tahsil: '', marketplace: '' })); if (state) fetchDistricts(state); }} required disabled={!formData.country}>
              <option value="">Select State</option>
              {states.map((state) => (<option key={state.id} value={state.id}>{state.name}</option>))}
            </select>
          </div>
          <div className="form-row-g">
            <select name="district" value={formData.district} onChange={(e) => { const district = e.target.value; setFormData(prev => ({ ...prev, district, tahsil: '', marketplace: '' })); if (district) fetchTahsils(district); }} required disabled={!formData.state}>
              <option value="">Select District</option>
              {districts.map((district) => (<option key={district.id} value={district.id}>{district.name}</option>))}
            </select>
            <select name="tahsil" value={formData.tahsil} onChange={(e) => { const tahsil = e.target.value; setFormData(prev => ({ ...prev, tahsil, marketplace: '' })); if (tahsil) fetchMarketplaces(tahsil); }} required disabled={!formData.district}>
              <option value="">Select Tahsil</option>
              {tahsils.map((tahsil) => (<option key={tahsil.id} value={tahsil.id}>{tahsil.name}</option>))}
            </select>
          </div>
          <div className="form-row-g">
            <select name="marketplace" value={formData.marketplace} onChange={handleInputChange} required disabled={!formData.tahsil}>
              <option value="">Select Marketplace</option>
              {marketplaces.map((marketplace) => (<option key={marketplace.id} value={marketplace.id}>{marketplace.name}</option>))}
            </select>
            <input type="text" name="pincode" placeholder="PIN Code" value={formData.pincode} onChange={handleInputChange} required />
          </div>
          <div className="form-actions-g">
            <button type="button" className="btn-g btn-primary-g" onClick={handleAddNewAddress} disabled={loading}>
              {loading ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </div>
        
        {/* Edit Address Form */}
        {showEditForm && editingAddress && (
          <div className="edit-form-overlay-g">
            <div className="edit-form-g">
              <h2>Edit Address</h2>
              <div className="form-row-g">
                <input type="text" name="address_title" placeholder="Address Title" value={formData.address_title} onChange={handleInputChange} required />
                <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required readOnly />
              </div>
              <div className="form-group-g">
                <input type="email" name="email_id" placeholder="Email" value={formData.email_id} onChange={handleInputChange} required readOnly />
              </div>
              <div className="form-row-g">
                <input type="text" name="address_line1" placeholder="Address Line 1" value={formData.address_line1} onChange={handleInputChange} required />
                <input type="text" name="address_line2" placeholder="Address Line 2" value={formData.address_line2} onChange={handleInputChange} />
              </div>
              <div className="form-row-g">
                <input type="text" name="marketplace" placeholder="Marketplace" value={formData.marketplace} onChange={handleInputChange} required />
                <input type="text" name="tahsil" placeholder="Tahsil" value={formData.tahsil} onChange={handleInputChange} required />
              </div>
              <div className="form-row-g">
                <input type="text" name="district" placeholder="District" value={formData.district} onChange={handleInputChange} required />
                <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleInputChange} required />
              </div>
              <div className="form-row-g">
                <input type="text" name="pincode" placeholder="PIN Code" value={formData.pincode} onChange={handleInputChange} required />
                <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleInputChange} required />
              </div>
              <div className="form-actions-g">
                <button type="button" className="btn-g btn-primary-g" onClick={updateAddress} disabled={loading}>
                  {loading ? 'Updating...' : 'Update Address'}
                </button>
                <button type="button" className="btn-g btn-outline-g" onClick={() => setShowEditForm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Existing Addresses Section */}
        {existingAddresses.length > 0 && (
          <div className="existing-addresses-g">
            <h2>Your Existing Addresses</h2>
            <div className="addresses-list-g">
              {existingAddresses.map((address, index) => (
                <div key={address.name || index} className="address-item-g">
                  <div className="address-header-item-g">
                    <h3>{address.address_title}</h3>
                    <div className="address-actions-item-g">
                      {address.is_primary === 1 ? (
                        <span className="primary-badge-g">Primary</span>
                      ) : (
                        <button 
                          className="make-primary-btn-g" 
                          onClick={() => makePrimaryAddress(address.name)}
                        >
                          Make Primary
                        </button>
                      )}
                      <button 
                        className="edit-btn-g" 
                        onClick={() => startEditAddress(address)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn-g" 
                        onClick={() => deleteAddress(address.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="address-content-g" dangerouslySetInnerHTML={{ __html: address.html.replace(/<br>/g, '<br/>') }} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Newly Added Address */}
        {newlyAddedAddress && (
          <div className="new-address-g">
            <h2>Newly Added Address</h2>
            <div className="address-item-g new">
              <div className="address-header-item-g">
                <h3>{newlyAddedAddress.address_title}</h3>
                <div className="address-actions-item-g">
                  <span className="new-badge-g">New</span>
                  <button 
                    className="make-primary-btn-g" 
                    onClick={() => makePrimaryAddress(newlyAddedAddress.name)}
                  >
                    Make Primary
                  </button>
                </div>
              </div>
              <div className="address-details-g">
                <p><strong>Address:</strong> {newlyAddedAddress.address_line1} {newlyAddedAddress.address_line2}</p>
                <p><strong>Location:</strong> {newlyAddedAddress.marketplace}</p>
                <p><strong>District:</strong> {newlyAddedAddress.district}</p>
                <p><strong>State:</strong> {newlyAddedAddress.state}</p>
                <p><strong>Pincode:</strong> {newlyAddedAddress.pincode}</p>
                <p><strong>Phone:</strong> {newlyAddedAddress.phone}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNewAddress;
