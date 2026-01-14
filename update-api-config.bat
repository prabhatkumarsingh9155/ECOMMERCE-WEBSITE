@echo off
setlocal enabledelayedexpansion

set "FILES=Account\Account.jsx AddNewAddress\AddNewAddress.jsx BestSeller.jsx Cart\Cart.jsx Checkout\Checkout.jsx Orders\Orders.jsx PaymentPage\PaymentPage.jsx ProductDetails\ProductDetails.jsx SignIn\SignIn.jsx TrustGallery\TrustGallery.jsx ViewDetails\ViewDetails.jsx"

cd "c:\Users\GoldiEsports\Documents\REACT SHOPTION\new-Gbru\components"

for %%f in (%FILES%) do (
    echo Processing %%f...
    
    REM Replace hardcoded URLs with API_CONFIG
    powershell -Command "(Get-Content '%%f') -replace 'https://uaterp\.gbru\.in', '${API_CONFIG.Prabhat_URL}' -replace \"'SHOPTION_XYZ_9834SDJKS'\", 'API_CONFIG.API_KEY' -replace \"'SHOPTION_SECRET_99ASD9A8S9D'\", 'API_CONFIG.API_SECRET' | Set-Content '%%f'"
    
    REM Add import if not exists
    powershell -Command "$content = Get-Content '%%f' -Raw; if ($content -notmatch 'API_CONFIG') { $content = $content -replace \"(import React.*?;)\", \"`$1`nimport { API_CONFIG } from '../config/apiConfig';\"; Set-Content '%%f' -Value $content -NoNewline }"
)

echo Done!
