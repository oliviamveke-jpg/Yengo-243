# Yengo+243 React Marketplace - Architecture Diagram

## Technology Stack
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
├─────────────────────────────────────────────────────────────┤
│  React 18.2.0  │  Vite 5.0.0  │  Leaflet 1.9.4  │  CSS     │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         index.html                               │
│                    (Entry Point - DOM)                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         main.jsx                                 │
│                   (React Root Rendering)                         │
│  - Imports: React, ReactDOM, App, Leaflet CSS, styles.css       │
│  - Renders: <App /> into #root div                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                          App.jsx                                 │
│                   (Main Application Container)                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ STATE MANAGEMENT (20+ state hooks)                      │   │
│  │ • vendors, reviews, orders, users, currentUser          │   │
│  │ • currency, filters, searchQuery, cart                  │   │
│  │ • selectedVendorId, activeVendorShopId, activeProduct    │   │
│  │ • manageVendorId, isCartOpen, markersVisible            │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ DATA PERSISTENCE (localStorage)                         │   │
│  │ • readStorage() / writeStorage() helpers               │   │
│  │ • Auto-sync on state changes via useEffect             │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ BUSINESS LOGIC                                          │   │
│  │ • Filtering: filterVendors(), filterProducts()          │   │
│  │ • Search: productMatchesSearch(), vendorMatchesSearch() │   │
│  │ • Cart: addToCart(), removeFromCart(), checkoutCart()  │   │
│  │ • Auth: loginAs(), registerCustomer(), registerVendor() │   │
│  │ • Reviews: saveReview()                                 │   │
│  │ • Vendor Mgmt: updateVendorProducts()                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────┬──────────────────────────┬───────────────────────────┘
           │                          │
           ▼                          ▼
┌──────────────────────┐  ┌──────────────────────────────────────┐
│     MapView.jsx     │  │         Marketplace.jsx               │
│   (Map Component)   │  │     (Market Component)               │
├──────────────────────┤  ├──────────────────────────────────────┤
│ Leaflet Integration │  │ • Filter Toolbar (Province/Commune/  │
│ • OpenStreetMap     │  │   Quartier/Street/Category/Subcat)   │
│ • Vendor Markers    │  │ • Search Bar                         │
│ • Click-to-select   │  │ • Vendor List                        │
│ • Nearest vendor    │  │ • Product Grid                       │
│   detection        │  │ • Selected Vendor Card               │
│ • FlyTo animation   │  │ • Modals: Shop Detail, Product,     │
└──────────────────────┘  │   Cart, Vendor Management          │
                          │ • Review Form                       │
                          │ • VendorProductForm (sub-component) │
                          └──────────────────────────────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Data Sources                              │
├─────────────────────────────────────────────────────────────────┤
│  • locationData.js    (Kinshasa communes, quartiers, streets)   │
│  • marketplaceData.js (Seed vendors, reviews, users)            │
│  • products.json      (Additional product data)                  │
│  • vendors.json       (Additional vendor data)                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      App.jsx State                               │
│  (Initializes from localStorage or seed data)                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Computed Values (useMemo)                     │
│  • filteredVendors (based on filters + search)                  │
│  • filteredProducts (based on filters + search)                 │
│  • kinshasaCommunes, allKinshasaQuartiers                       │
│  • availableQuartiers (filtered by commune)                     │
│  • cartCount                                                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Component Props                              │
│  (Passed down to MapView and Marketplace)                       │
└─────────────────────────────────────────────────────────────────┘
```

## User Interactions Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      User Actions                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  AUTHENTICATION                                                 │
│  ┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │   Login     │───▶│  Select User    │───▶│ Set currentUser │ │
│  │   Register  │───▶│  Fill Form      │───▶│ Create User     │ │
│  │   Switch    │───▶│  Toggle Type    │───▶│ Update State    │ │
│  └─────────────┘    └─────────────────┘    └─────────────────┘ │
│                                                                  │
│  BROWSING                                                       │
│  ┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │   Filter    │───▶│ Update filters  │───▶│ Re-compute      │ │
│  │   Search    │───▶│ Update query    │───▶│ filtered lists  │ │
│  │   Click Map │───▶│ Select vendor   │───▶│ Update map view │ │
│  └─────────────┘    └─────────────────┘    └─────────────────┘ │
│                                                                  │
│  SHOPPING                                                       │
│  ┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │ Add to Cart │───▶│ Update cart     │───▶│ Persist to LS   │ │
│  │ Remove Item │───▶│ Update cart     │───▶│ Persist to LS   │ │
│  │   Checkout  │───▶│ Create orders   │───▶│ Clear cart      │ │
│  └─────────────┘    └─────────────────┘    └─────────────────┘ │
│                                                                  │
│  VENDOR MANAGEMENT                                               │
│  ┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │ Add Product │───▶│ Update vendor   │───▶│ Persist to LS   │ │
│  │ Remove Prod │───▶│ Update vendor   │───▶│ Persist to LS   │ │
│  └─────────────┘    └─────────────────┘    └─────────────────┘ │
│                                                                  │
│  REVIEWS                                                         │
│  ┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │ Submit Review│───▶│ Add to reviews  │───▶│ Persist to LS   │ │
│  └─────────────┘    └─────────────────┘    └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features

### 1. **Authentication System**
- Login as existing user (customer or vendor)
- Register new customer (with location details)
- Register new vendor (with business details)
- User type switching (customer ↔ vendor)
- Profile display with role-based information

### 2. **Interactive Map**
- Leaflet-based map centered on Kinshasa
- Vendor markers with popups
- Click-to-select vendor
- Click map to find nearest vendor (Haversine distance)
- FlyTo animation when selecting vendor
- Toggle marker visibility

### 3. **Filtering & Search**
- Multi-level location filters (Province → Commune → Quartier → Street)
- Category and subcategory filters
- Full-text search across vendors and products
- Dynamic filter options based on available data

### 4. **Shopping Cart**
- Add/remove products
- Quantity tracking
- Cart count badge
- Checkout simulation (creates orders)
- Currency conversion (USD/FC)

### 5. **Vendor Management**
- View vendor details
- Manage products (add/remove)
- Product image upload (base64)
- Owner-only access controls

### 6. **Review System**
- Submit reviews (name, stars, comment)
- View vendor reviews
- Average rating calculation
- Timestamp tracking

## Data Persistence Strategy

```
localStorage Keys:
├── yengoReactVendors      (Vendor list with products)
├── yengoReactReviews      (Customer reviews)
├── yengoReactOrders       (Order history)
├── yengoReactUsers        (User accounts)
├── yengoReactCurrentUser  (Currently logged-in user)
└── yengoReactCurrency     (Currency preference: $ or FC)

Sync Pattern:
State Change → useEffect → writeStorage() → localStorage
Component Mount → readStorage() → Initialize State
```

## File Structure

```
yengo-react-main/
├── index.html              (HTML template)
├── package.json            (Dependencies: React, Vite, Leaflet)
├── vite.config.js          (Vite configuration)
├── src/
│   ├── main.jsx           (React entry point)
│   ├── App.jsx            (Main application component - 506 lines)
│   ├── styles.css         (Global styles)
│   ├── components/
│   │   ├── MapView.jsx    (Leaflet map integration - 85 lines)
│   │   └── Marketplace.jsx (Market UI - 537 lines)
│   └── data/
│       ├── locationData.js    (Kinshasa geo data)
│       ├── marketplaceData.js (Seed vendors, reviews, users)
│       ├── products.json      (Additional products)
│       └── vendors.json       (Additional vendors)
└── dist/                   (Build output)
```

## Component Props Flow

```
App.jsx passes to MapView:
• vendors (array)
• selectedVendorId (string)
• onVendorSelect (function)
• onNearestVendorClick (function)
• markersVisible (boolean)

App.jsx passes to Marketplace (20+ props):
• vendors, currentUser, filters, searchQuery
• currency, filteredVendors, filteredProducts
• selectedVendor, cart, cartCount
• Callback functions: onFiltersChange, onSearchQueryChange,
  onCurrencyChange, addToCart, removeFromCart, onOpenCart,
  onToggleMarkers, onVendorClick, onCloseVendorShop,
  onOpenProduct, onCloseProduct, onCloseCart, onCheckout,
  onManageVendor, onCloseManage, onSaveReview,
  onUpdateVendorProducts, onSwitchUser
• Modal state: activeVendorShopId, activeProduct,
  isCartOpen, manageVendorId
• reviews, orders, markersVisible
```

## State Management Pattern

```
Centralized State in App.jsx:
├── Authentication State
│   ├── users (array)
│   ├── currentUser (object)
│   └── authMode (string: 'login' | 'register-vendor' | 'register-customer')
│
├── Business Data State
│   ├── vendors (array with nested products)
│   ├── reviews (array)
│   └── orders (array)
│
├── UI State
│   ├── filters (object: province, commune, quartier, street, category, subcategory)
│   ├── searchQuery (string)
│   ├── currency (string: '$' | 'FC')
│   ├── cart (object: { productId: { product, qty } })
│   └── markersVisible (boolean)
│
└── Selection State
    ├── selectedVendorId (string)
    ├── activeVendorShopId (string)
    ├── activeProduct (object)
    └── manageVendorId (string)

All state changes trigger:
1. State update via setState
2. useEffect hook detects change
3. writeStorage() persists to localStorage
4. Re-render cascades to child components
```

## Key Functions

### Filtering Functions (App.jsx)
- `normalizeText()` - Lowercase/trim for search
- `productMatchesSearch()` - Check product against query
- `vendorMatchesSearch()` - Check vendor against query
- `filterVendors()` - Apply filters + search to vendors
- `filterProducts()` - Apply filters + search to products

### Helper Functions (App.jsx)
- `readStorage()` - Safe localStorage read with fallback
- `writeStorage()` - Safe localStorage write with error handling

### Business Logic (App.jsx)
- `handleVendorSelection()` - Select vendor, optionally open shop
- `addToCart()` - Add product to cart or increment quantity
- `removeFromCart()` - Remove product from cart
- `checkoutCart()` - Create orders from cart, clear cart
- `saveReview()` - Add review to reviews array
- `updateVendorProducts()` - Update vendor's product list
- `loginAs()` - Set current user from users list
- `registerCustomer()` - Create new customer user
- `registerVendor()` - Create new vendor + user
- `handleSwitchUser()` - Toggle between customer/vendor

### Map Functions (MapView.jsx)
- `haversineDistance()` - Calculate distance between coordinates
- Leaflet map initialization and marker management

### UI Functions (Marketplace.jsx)
- `productImage()` - Generate SVG placeholder images
- `formatPrice()` - Format price with currency
- `showToast()` - Display temporary notification
- `handleFilterChange()` - Update filter state with cascade logic
- `handleReviewSubmit()` - Submit review form

## Build & Development

```bash
# Development
npm run dev          # Start Vite dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build
```

## Summary

This is a **client-side only** React marketplace application for Kinshasa, DRC. It features:

- **No backend**: All data stored in localStorage
- **Map integration**: Leaflet for vendor location visualization
- **Role-based access**: Customer and vendor user types
- **Full e-commerce features**: Browsing, cart, checkout, reviews
- **Location-aware**: Kinshasa-specific communes, quartiers, streets
- **Responsive filtering**: Multi-level geographic + category filters
- **State persistence**: Automatic localStorage sync on all changes

The architecture follows a **centralized state pattern** with App.jsx as the single source of truth, passing data and callbacks down to child components via props.
