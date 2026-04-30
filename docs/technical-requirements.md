# Technical Requirements - ข้อกำหนดทางเทคนิค

## 📋 Project Overview

ระบบจองตั๋วเรือสมัยใหม่ที่ใช้ Vue.js 3 สำหรับ WordPress เป็น Single Page Application

---

## 🛠️ Technology Stack

### Frontend
- **Vue.js 3**: Framework UI
- **Axios**: HTTP client สำหรับ API calls
- **Vuex 4**: State management (optional, สำหรับ complex state)
- **Vue Router**: Navigation (if needed for multiple pages)

### Backend
- **WordPress**: CMS & Plugin framework
- **PHP 7.4+**: Server-side programming
- **WordPress REST API**: API endpoints
- **MySQL**: Database

### Build Tools (Optional)
- **Node.js & npm**: Package management
- **Webpack/Vite**: Module bundler
- **Babel**: JavaScript transpiler
- **SASS**: CSS preprocessor

---

## 📦 Project Dependencies

### PHP Libraries (WordPress)
- WordPress 5.0+ (for REST API support)
- WooCommerce (optional, สำหรับ payment processing)

### JavaScript Libraries
```json
{
  "dependencies": {
    "vue": "^3.3.0",
    "axios": "^1.4.0",
    "vuex": "^4.1.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.0.0",
    "vite": "^4.3.0",
    "sass": "^1.62.0"
  }
}
```

---

## 🎯 Core Features

### 1. Search Form
- [ ] Dropdown สำหรับเลือก From/To Port
- [ ] Date picker สำหรับเลือกวันที่
- [ ] Number input สำหรับจำนวนผู้โดยสาร
- [ ] Real-time form validation
- [ ] Search button with loading state

### 2. Search Results
- [ ] Display trip cards in responsive grid
- [ ] Sort options (by time, price, duration)
- [ ] Filter options (price range, time range)
- [ ] Pagination (if many results)
- [ ] Loading skeleton
- [ ] Empty state handling
- [ ] Add to cart button on each card

### 3. Shopping Cart
- [ ] Display selected items
- [ ] Update quantity (±)
- [ ] Remove item
- [ ] Calculate subtotal & total
- [ ] Persist cart data (localStorage)
- [ ] Proceed to checkout

### 4. Payment Integration
- [ ] Integrate with WooCommerce or custom payment gateway
- [ ] Order creation
- [ ] Payment confirmation

---

## 🗄️ Database Schema

### New Tables to Create

#### `wp_ferry_trips`
```sql
CREATE TABLE wp_ferry_trips (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ferry_name VARCHAR(255) NOT NULL,
  from_port VARCHAR(100) NOT NULL,
  to_port VARCHAR(100) NOT NULL,
  departure_time DATETIME NOT NULL,
  arrival_time DATETIME NOT NULL,
  available_seats INT NOT NULL,
  total_seats INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  trip_type ENUM('oneway', 'roundtrip') DEFAULT 'oneway',
  status ENUM('active', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### `wp_ferry_bookings`
```sql
CREATE TABLE wp_ferry_bookings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT,
  trip_id BIGINT NOT NULL,
  passenger_name VARCHAR(255) NOT NULL,
  passenger_email VARCHAR(255) NOT NULL,
  passenger_phone VARCHAR(20),
  number_of_passengers INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  booking_ref VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES wp_ferry_trips(id)
);
```

#### `wp_ferry_ports`
```sql
CREATE TABLE wp_ferry_ports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  port_code VARCHAR(10) UNIQUE NOT NULL,
  port_name VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  country VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 REST API Endpoints

### GET Endpoints

#### 1. Search Trips
```
GET /wp-json/ftbs/v1/trips/search
Parameters:
  - from_port: string (required)
  - to_port: string (required)
  - departure_date: YYYY-MM-DD (required)
  - number_of_passengers: number (required)
  - sort_by: 'price|time|duration' (optional)
  - page: number (optional)
  
Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ferry_name": "Speed Ferry",
      "from_port": "Bangkok",
      "to_port": "Phuket",
      "departure_time": "2024-04-29T08:00:00",
      "arrival_time": "2024-04-29T12:30:00",
      "duration": "4h 30m",
      "available_seats": 45,
      "total_seats": 100,
      "price": 850,
      "status": "Available"
    }
  ],
  "total": 10,
  "page": 1,
  "per_page": 10
}
```

#### 2. Get Ports
```
GET /wp-json/ftbs/v1/ports
Parameters: none

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "port_code": "BKK",
      "port_name": "Bangkok",
      "city": "Bangkok",
      "country": "Thailand"
    }
  ]
}
```

### POST Endpoints

#### 1. Create Booking
```
POST /wp-json/ftbs/v1/bookings
Body: {
  "trip_id": 1,
  "passenger_name": "John Doe",
  "passenger_email": "john@example.com",
  "passenger_phone": "08xxxxxxxx",
  "number_of_passengers": 2,
  "total_price": 1700
}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "booking_ref": "FTB-20240429-0001",
    "status": "pending",
    "order_id": null
  }
}
```

---

## 🗂️ File Structure

```
ferry-ticket-booking-system/
├── ferry-ticket-booking-system.php   # Main plugin file
├── README.md
├── package.json
├── docs/
│   ├── system-blueprint.md
│   ├── technical-requirements.md
│   └── api-documentation.md
├── assets/
│   ├── js/
│   │   ├── app.js
│   │   ├── main.js (entry point for Vue)
│   │   ├── components/
│   │   │   ├── SearchForm.vue
│   │   │   ├── SearchResults.vue
│   │   │   ├── CartSidebar.vue
│   │   │   └── TripCard.vue
│   │   ├── store/
│   │   │   └── index.js (Vuex store)
│   │   ├── services/
│   │   │   └── api.js (API calls)
│   │   └── utils/
│   │       └── helpers.js
│   └── css/
│       ├── main.css
│       ├── variables.css
│       └── responsive.css
├── includes/
│   ├── class-plugin.php
│   ├── api/
│   │   ├── class-api.php
│   │   ├── class-trips-controller.php
│   │   ├── class-bookings-controller.php
│   │   └── class-ports-controller.php
│   ├── models/
│   │   ├── class-trip.php
│   │   ├── class-booking.php
│   │   └── class-port.php
│   ├── class-database.php
│   └── class-activator.php
├── templates/
│   └── booking-page.php
└── vendor/ (if using Composer)
```

---

## 🚀 Development Workflow

### Phase 1: Setup
- [ ] Create main plugin file
- [ ] Enqueue Vue.js and dependencies
- [ ] Create database tables

### Phase 2: Backend API
- [ ] Create REST API controllers
- [ ] Implement search endpoint
- [ ] Implement booking endpoint

### Phase 3: Frontend Components
- [ ] Build SearchForm component
- [ ] Build SearchResults component
- [ ] Build CartSidebar component
- [ ] Build TripCard component

### Phase 4: Styling & Responsive
- [ ] Add CSS styling
- [ ] Make responsive for mobile
- [ ] Add animations

### Phase 5: Testing & Deployment
- [ ] Unit tests
- [ ] Integration tests
- [ ] User acceptance testing
- [ ] Production deployment

---

## 📊 Performance Considerations

- [ ] Lazy load images
- [ ] Minify CSS/JS
- [ ] Cache API responses (client-side)
- [ ] Pagination for large result sets
- [ ] Debounce search input
- [ ] Code splitting (if using webpack)

---

## 🔒 Security Checklist

- [ ] CSRF token validation
- [ ] Input sanitization
- [ ] Output escaping
- [ ] User authentication check
- [ ] Rate limiting on API
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CORS headers

---

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📝 Documentation

- [ ] API documentation
- [ ] Component documentation
- [ ] Installation guide
- [ ] User guide
- [ ] Developer guide
