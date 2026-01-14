# Files Updated with API_CONFIG

## ✅ Already Updated:
1. useUserAuthentication.js
2. useShoppingCart.js
3. useProductsCatalog.js
4. useProductCategories.js
5. FeaturedProducts.jsx
6. Account.jsx

## 📝 Need to Update:
Apply these changes to each file:

### Step 1: Add import at the top
```javascript
import { API_CONFIG } from '../config/apiConfig'; // or '../../config/apiConfig' depending on folder depth
```

### Step 2: Replace all occurrences:
- `'https://uaterp.gbru.in'` → `${API_CONFIG.Prabhat_URL}`
- `'SHOPTION_XYZ_9834SDJKS'` → `API_CONFIG.API_KEY`
- `'SHOPTION_SECRET_99ASD9A8S9D'` → `API_CONFIG.API_SECRET`

### Files to update:
1. components/AddNewAddress/AddNewAddress.jsx
2. components/BestSeller.jsx
3. components/Cart/Cart.jsx
4. components/Checkout/Checkout.jsx
5. components/Orders/Orders.jsx
6. components/PaymentPage/PaymentPage.jsx
7. components/ProductDetails/ProductDetails.jsx
8. components/SignIn/SignIn.jsx
9. components/TrustGallery/TrustGallery.jsx
10. components/ViewDetails/ViewDetails.jsx

### Import path by folder depth:
- Root components (BestSeller.jsx): `'../config/apiConfig'`
- Nested components (Cart/Cart.jsx): `'../../config/apiConfig'`
