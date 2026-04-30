# API Documentation - เอกสาร API

## 📌 Base URL

```
http://your-domain.com/wp-json/ftbs/v1
```

## Authentication

ทุก request อาจต้อง WordPress nonce token สำหรับ POST requests

---

## 📊 Endpoints

### 1. Search Trips (GET)

**Endpoint**: `GET /trips/search`

**Description**: ค้นหาตั๋วเรือตามเงื่อนไขที่กำหนด

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| from_port | string | Yes | รหัสท่าเรือต้นทาง (เช่น BKK) |
| to_port | string | Yes | รหัสท่าเรือปลายทาง (เช่น HKT) |
| departure_date | YYYY-MM-DD | Yes | วันที่ออกเดินทาง |
| number_of_passengers | number | Yes | จำนวนผู้โดยสาร |
| sort_by | string | No | การเรียงลำดับ: price, time, duration |
| page | number | No | หมายเลขหน้า (default: 1) |

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ferry_name": "Speed Ferry Premium",
      "from_port": "BKK",
      "to_port": "HKT",
      "departure_time": "2024-04-29T08:00:00",
      "arrival_time": "2024-04-29T12:30:00",
      "duration": "4h 30m",
      "available_seats": 45,
      "total_seats": 100,
      "price": 850,
      "status": "Available"
    },
    {
      "id": 2,
      "ferry_name": "Comfort Ferry",
      "from_port": "BKK",
      "to_port": "HKT",
      "departure_time": "2024-04-29T10:00:00",
      "arrival_time": "2024-04-29T14:45:00",
      "duration": "4h 45m",
      "available_seats": 78,
      "total_seats": 150,
      "price": 650,
      "status": "Available"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "per_page": 10,
    "total_pages": 2
  }
}
```

**Error (400 Bad Request)**:
```json
{
  "success": false,
  "message": "Missing required parameters",
  "errors": {
    "from_port": "from_port is required"
  }
}
```

---

### 2. List Ports (GET)

**Endpoint**: `GET /ports`

**Description**: ดึงรายการท่าเรือทั้งหมด

**Parameters**: None

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "port_code": "BKK",
      "port_name": "Bangkok Port",
      "city": "Bangkok",
      "country": "Thailand"
    },
    {
      "id": 2,
      "port_code": "HKT",
      "port_name": "Phuket Port",
      "city": "Phuket",
      "country": "Thailand"
    },
    {
      "id": 3,
      "port_code": "KBV",
      "port_name": "Krabi Port",
      "city": "Krabi",
      "country": "Thailand"
    }
  ]
}
```

---

### 3. Create Booking (POST)

**Endpoint**: `POST /bookings`

**Description**: สร้างการจองตั๋วเรือ

**Headers**:
```
Content-Type: application/json
X-WP-Nonce: [nonce-token]
```

**Request Body**:
```json
{
  "trip_id": 1,
  "passenger_name": "สมชาย ใหญ่ชัย",
  "passenger_email": "somchai@example.com",
  "passenger_phone": "0812345678",
  "number_of_passengers": 2,
  "total_price": 1700
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": 5,
    "trip_id": 1,
    "booking_ref": "FTBS-20240429-0005",
    "passenger_name": "สมชาย ใหญ่ชัย",
    "passenger_email": "somchai@example.com",
    "passenger_phone": "0812345678",
    "number_of_passengers": 2,
    "total_price": 1700,
    "status": "pending",
    "created_at": "2024-04-29T15:30:00",
    "order_id": null
  }
}
```

**Error (400 Bad Request)**:
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "trip_id": "Trip not found",
    "number_of_passengers": "Not enough available seats"
  }
}
```

---

### 4. Get Booking Details (GET)

**Endpoint**: `GET /bookings/{booking_id}`

**Description**: ดึงรายละเอียดการจอง

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 5,
    "trip_id": 1,
    "booking_ref": "FTBS-20240429-0005",
    "passenger_name": "สมชาย ใหญ่ชัย",
    "passenger_email": "somchai@example.com",
    "passenger_phone": "0812345678",
    "number_of_passengers": 2,
    "total_price": 1700,
    "status": "pending",
    "trip_details": {
      "id": 1,
      "ferry_name": "Speed Ferry Premium",
      "from_port": "BKK",
      "to_port": "HKT",
      "departure_time": "2024-04-29T08:00:00",
      "arrival_time": "2024-04-29T12:30:00"
    },
    "created_at": "2024-04-29T15:30:00"
  }
}
```

---

### 5. Cancel Booking (POST)

**Endpoint**: `POST /bookings/{booking_id}/cancel`

**Description**: ยกเลิกการจอง

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "id": 5,
    "status": "cancelled",
    "refund_amount": 1700
  }
}
```

---

## 🔐 Error Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## 📞 Common Error Messages

```json
{
  "success": false,
  "message": "Trip not found",
  "code": "TRIP_NOT_FOUND"
}
```

```json
{
  "success": false,
  "message": "Not enough available seats",
  "code": "INSUFFICIENT_SEATS"
}
```

```json
{
  "success": false,
  "message": "This booking has already been cancelled",
  "code": "ALREADY_CANCELLED"
}
```

---

## 🧪 Testing API with cURL

### Search Trips
```bash
curl -X GET "http://localhost:8888/tratferryticket2/wp-json/ftbs/v1/trips/search?from_port=BKK&to_port=HKT&departure_date=2024-04-29&number_of_passengers=2"
```

### Get Ports
```bash
curl -X GET "http://localhost:8888/tratferryticket2/wp-json/ftbs/v1/ports"
```

### Create Booking
```bash
curl -X POST "http://localhost:8888/tratferryticket2/wp-json/ftbs/v1/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "trip_id": 1,
    "passenger_name": "Test User",
    "passenger_email": "test@example.com",
    "passenger_phone": "0812345678",
    "number_of_passengers": 2,
    "total_price": 1700
  }'
```

---

## 💻 Vue.js Integration Example

```javascript
// services/api.js
import axios from 'axios';

const API_URL = '/wp-json/ftbs/v1';

export const tripService = {
  searchTrips(params) {
    return axios.get(`${API_URL}/trips/search`, { params });
  },
  
  getPorts() {
    return axios.get(`${API_URL}/ports`);
  },
  
  createBooking(bookingData) {
    return axios.post(`${API_URL}/bookings`, bookingData);
  },
  
  getBooking(bookingId) {
    return axios.get(`${API_URL}/bookings/${bookingId}`);
  },
  
  cancelBooking(bookingId) {
    return axios.post(`${API_URL}/bookings/${bookingId}/cancel`);
  }
};
```

---

## 📌 Rate Limiting

API requests จะถูก rate limit ที่ 100 requests ต่อ 1 hour per IP address

---

## 🔄 Pagination

ข้อมูลที่มีจำนวนมากจะใช้ pagination:
- Default page size: 10
- Max page size: 50
- Query: `?page=1&per_page=20`
