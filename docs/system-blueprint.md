# System Blueprint - ระบบจองตั๋วเรือ

## 📋 ภาพรวมระบบ

### หน้าเดียว (Single Page) ประกอบด้วย 3 ส่วนหลัก:

```
┌─────────────────────────────────────────────┐
│           Header / Navigation               │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────────┐  ┌────────────────┐   │
│  │ SEARCH FORM      │  │  SHOPPING CART │   │
│  │                  │  │                │   │
│  │ - From Port      │  │ Selected Items │   │
│  │ - To Port        │  │ - Trip 1       │   │
│  │ - Date           │  │ - Trip 2       │   │
│  │ - Passengers     │  │ - Prices       │   │
│  │ - [Search]       │  │ - [Checkout]   │   │
│  └──────────────────┘  └────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │     SEARCH RESULTS                  │   │
│  │                                     │   │
│  │  [Trip Card 1] [Trip Card 2] ...   │   │
│  │  - Route                            │   │
│  │  - Departure & Arrival Time         │   │
│  │  - Available Seats                  │   │
│  │  - Price                            │   │
│  │  - [Select] button                  │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎯 ส่วนที่ 1: Search Form

**จุดประสงค์**: ให้ผู้ใช้ค้นหาตั๋วเรือตามเงื่อนไข

### Input Fields:
- **From Port** (dropdown) - ท่าเรือต้นทาง
- **To Port** (dropdown) - ท่าเรือปลายทาง
- **Departure Date** (date picker) - วันที่ออกเดินทาง
- **Return Date** (date picker, optional) - วันที่กลับ (ถ้าเป็น Round Trip)
- **Number of Passengers** (number input) - จำนวนผู้โดยสาร
- **Search Button** - ปุ่มค้นหา

### ลักษณะการแสดงผล:
- ใช้ Flexbox/Grid สำหรับการจัดวาง
- ตอบสนองต่อหน้าจอ (Mobile-friendly)
- Icon สื่อสาร (ท่าเรือ, วันที่, คน)

---

## 📊 ส่วนที่ 2: Search Results

**จุดประสงค์**: แสดงรายการตั๋วเรือที่พบการค้นหา

### ข้อมูลการแสดงผล (Trip Card):
- **Route**: "Bangkok → Phuket"
- **Ferry Name**: "Speed Ferry Premium"
- **Departure Time**: "08:00" & **Arrival Time**: "12:30"
- **Duration**: "4 hours 30 min"
- **Available Seats**: 45 seats
- **Price**: ฿850 per person
- **Status Badge**: "Available" / "Sold Out" / "Limited"
- **Select Button**: เลือกตั๋วนี้

### ฟีเจอร์:
- Sort by: Departure Time, Price, Duration
- Filter by: Price Range, Departure Time, Ferry Type
- Pagination (if many results)
- Loading Skeleton while fetching
- Empty State message (if no results)

---

## 🛒 ส่วนที่ 3: Shopping Cart

**จุดประสงค์**: แสดงตั๋วที่เลือกไว้ และสำเร็จการชำระเงิน

### ส่วนประกอบ:
1. **Cart Header**: "Your Booking" + Item Count
2. **Item List**:
   - Trip Info (Route, Date, Time)
   - Passenger Count
   - Price per person
   - Subtotal
   - Remove button (X icon)
3. **Summary**:
   - Subtotal: ฿X,XXX
   - Tax (if any): ฿X,XXX
   - **Total**: ฿X,XXX
4. **CTA Buttons**:
   - Continue Shopping (return to results)
   - Proceed to Checkout (via WooCommerce or custom payment)

### Features:
- Update quantity (±)
- Remove items
- Persistent cart (localStorage / Session)
- Real-time total calculation

---

## 🏗️ Data Flow

```
User Input (Search Form)
       ↓
   Vue.js triggers Search
       ↓
   WordPress REST API (GET /api/search-trips)
       ↓
   Backend Query Database (Trips table)
       ↓
   Return JSON Results
       ↓
   Vue.js renders Search Results
       ↓
   User clicks "Select"
       ↓
   Add to Cart (Vuex Store + localStorage)
       ↓
   Update Cart Display
       ↓
   User clicks "Checkout"
       ↓
   Redirect to Payment / Order Page
```

---

## 💾 Database Schema (Planned)

### Table: ferry_trips
```
- id (PK)
- ferry_name
- from_port
- to_port
- departure_time
- arrival_time
- available_seats
- total_seats
- price
- trip_type (oneway/roundtrip)
- status (active/cancelled)
- created_at
- updated_at
```

### Table: ferry_bookings
```
- id (PK)
- order_id (FK to WooCommerce orders)
- trip_id (FK to ferry_trips)
- passenger_name
- passenger_email
- passenger_phone
- number_of_passengers
- total_price
- status (pending/confirmed/cancelled)
- created_at
- updated_at
```

---

## 🎨 UI/UX Considerations

### Color Scheme:
- Primary: Ocean Blue (#0066CC or similar)
- Accent: Coral/Orange (#FF6B35)
- Neutral: Light Gray (#F5F5F5)
- Text: Dark Gray (#333333)

### Typography:
- Headings: Bold, larger size (24px-32px)
- Body: Regular, readable size (14px-16px)
- Small text: 12px-13px

### Components Style:
- Rounded corners (4px-8px)
- Subtle shadows for depth
- Smooth animations/transitions
- Icons from Font Awesome or Material Icons

---

## 📱 Responsive Design

### Breakpoints:
- **Mobile**: < 640px (Stack vertically)
- **Tablet**: 640px - 1024px (2-column layout)
- **Desktop**: > 1024px (Full 3-section layout)

**Mobile Layout**:
- Search Form on top (full width)
- Search Results in middle (scrollable)
- Cart on bottom or via modal/drawer

---

## 🔐 Security Considerations

- ✅ CSRF token validation for POST requests
- ✅ Input validation on both client & server
- ✅ User authentication check
- ✅ Rate limiting for API calls
- ✅ SQL injection prevention (prepared statements)
- ✅ XSS prevention (sanitize output)

---

## 📌 Next Steps

1. ✅ Create folder structure and docs
2. ⏳ Setup plugin main file and enqueue Vue.js
3. ⏳ Create Vue.js components (SearchForm, SearchResults, Cart)
4. ⏳ Setup WordPress REST API endpoints
5. ⏳ Create database tables
6. ⏳ Add styling and make responsive
7. ⏳ Testing and optimization
