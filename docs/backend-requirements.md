# Backend Requirements - Integration Checklist

เอกสารนี้บอกรายละเอียดสิ่งที่ backend ต้องปรับเพื่อให้ตรงกับการเชื่อมต่อจาก frontend

## Base URL

```
http://localhost:8000/api
```

สำหรับ production: ตั้งค่าผ่าน environment variable `VITE_API_URL`

---

## Query Parameters - ต้องใช้ชื่อเดียวกับที่ frontend ส่งมา

Frontend ส่ง parameter ในชื่อนี้:
- `from` (แทน `departure`)
- `to` (แทน `destination`)
- `departDate` (แทน `date`)

### ❌ ผิด
```
GET /api/tickets/search?departure=Bangkok&destination=Phuket&date=2026-05-11
```

### ✅ ถูก
```
GET /api/tickets/search?from=Bangkok&to=Phuket&departDate=2026-05-11
```

---

## Ticket Data Structure - ต้องส่ง fields เหล่านี้

Frontend คาดหวัง ticket object มี fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | number | ✅ | Unique ticket ID |
| `from` | string | ✅ | Origin location (e.g., "Bangkok") |
| `to` | string | ✅ | Destination location (e.g., "Phuket") |
| `departDate` | string (YYYY-MM-DD) | ✅ | Departure date |
| `departTime` | string (HH:MM) | ✅ | Departure time |
| `arriveTime` | string (HH:MM) | ✅ | Arrival time |
| `price` | number | ✅ | Price per ticket |
| `operator` | string | ✅ | Ferry operator name |
| `available` | number | ✅ | Available seats |

### ตัวอย่าง Response:

```json
[
  {
    "id": 1,
    "from": "Bangkok",
    "to": "Phuket",
    "departDate": "2026-05-11",
    "departTime": "09:00",
    "arriveTime": "17:00",
    "price": 500,
    "operator": "Lomprayah",
    "available": 50
  }
]
```

---

## Endpoints

### 1. GET `/api/tickets/search`

ค้นหาตั๋วตามเงื่อนไข

**Query Parameters:**

| Param | Type | Required |
|---|---|---|
| `from` | string | No |
| `to` | string | No |
| `departDate` | string (YYYY-MM-DD) | No |

**Response:**
```json
[
  { ticket object },
  { ticket object }
]
```

---

### 2. GET `/api/tickets/:id`

ดึงรายละเอียดตั๋วรายตัว

**Response:**
```json
{
  "id": 1,
  "from": "Bangkok",
  ...
}
```

**Errors:**
- `404` - Ticket not found

---

### 3. POST `/api/bookings`

สร้าง booking

**Request Body:**
```json
{
  "ticketIds": [1, 2, 3],
  "passengers": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+66812345678"
    }
  ]
}
```

**Response:**
```json
{
  "id": "BK-2026-05-11-12345",
  "status": "confirmed",
  "total": 1500,
  "createdAt": "2026-05-11T08:00:00Z"
}
```

---

### 4. GET `/api/locations` (Optional)

ดึงรายการ location ที่มีให้เลือก

**Response:**
```json
[
  {
    "value": "Bangkok",
    "label": "Bangkok (BKK)"
  },
  {
    "value": "Phuket",
    "label": "Phuket (HKT)"
  }
]
```

---

## CORS Configuration

✅ CORS ต้องเปิดให้ frontend เข้าถึงได้

---

## Error Handling

All errors must return proper HTTP status codes:

| Status | Use Case |
|---|---|
| `200` | Success |
| `400` | Invalid query/body parameters |
| `404` | Resource not found |
| `500` | Server error |

Response format:
```json
{
  "error": "Ticket not found"
}
```
