# API Documentation (Frontend)

เอกสารนี้อธิบาย REST API จริงที่ frontend ต้องใช้จากปลั๊กอิน Boat Ticket บน WordPress

## Base URL และ Namespace

- Base URL: `https://<your-domain>/wp-json`
- Namespace: `custom/v1`
- รวมเป็น root: `https://<your-domain>/wp-json/custom/v1`

## Auth และ Permission

- ทุก endpoint ในเอกสารนี้เป็น public (`permission_callback = __return_true`)
- ไม่ต้องใช้ token สำหรับการอ่านข้อมูล
- Endpoint จอง (`POST /frontend/bookings`) ตอนนี้เป็น mock response ฝั่งเซิร์ฟเวอร์

## Endpoints

### 1) GET `/frontend/locations`

คืนรายการ location สำหรับใช้ใน search form

Query params: ไม่มี

Response ตัวอย่าง:

```json
[
  {
    "id": "BKK",
    "label": "Bangkok (BKK)",
    "value": "Bangkok",
    "postId": 123
  }
]
```

หมายเหตุ:
- `id` คือ location code (2-6 ตัวอักษร/ตัวเลข)
- `label` คือข้อความแสดงใน UI
- `value` คือชื่อ location ที่ใช้ match กับ route

### 2) GET `/frontend/tickets`

ค้นหารายการตั๋วตามเงื่อนไข

Query params:

| Field | Type | Required | Description |
|---|---|---|---|
| `from` | string | No | ต้นทาง (รับได้ทั้ง `Bangkok`, `Bangkok (BKK)`, หรือ `BKK`) |
| `to` | string | No | ปลายทาง (รูปแบบเดียวกับ `from`) |
| `departDate` | string (`YYYY-MM-DD`) | No | วันที่เดินทาง ถ้าไม่ถูก format จะ fallback เป็นวันปัจจุบัน + 2 วัน |
| `adults` | int | No | ส่งได้ แต่ backend ไม่ได้ใช้ในการ filter รายการ |
| `children` | int | No | ส่งได้ แต่ backend ไม่ได้ใช้ในการ filter รายการ |
| `childAges` | string (`comma-separated`) | No | ส่งได้ แต่ backend ไม่ได้ใช้ในการ filter รายการ |

Response: `Ticket[]`

### 3) GET `/frontend/tickets/{id}`

ดึงรายละเอียดตั๋วรายตัว

Path params:
- `id`: รองรับ `tk-<productId>`, `ticket-<productId>`, หรือ `<productId>`

Query params:
- `departDate` (optional, รูปแบบ `YYYY-MM-DD`)

Errors:
- `400 btk_invalid_ticket_id`
- `404 btk_ticket_not_found`

### 4) POST `/frontend/bookings`

สร้าง booking (ปัจจุบันเป็น mock)

Request body:
- JSON object รูปแบบใดก็ได้ (backend คืนกลับในฟิลด์ `data`)

Response ตัวอย่าง:

```json
{
  "success": true,
  "bookingRef": "MOCK-1715412345",
  "createdAt": "2026-05-11T08:00:00+00:00",
  "data": {
    "ticketId": "tk-101"
  }
}
```

### 5) GET `/frontend/packages`

ค้นหา package product

Query params:

| Field | Type | Required | Description |
|---|---|---|---|
| `q` | string | No | ค้นหาในชื่อ package + note |
| `location` | string | No | ค้นหาจากชื่อ location ภายใน package |

Response: `Package[]`

### 6) GET `/frontend/packages/{id}`

ดึงรายละเอียด package รายตัว

Path params:
- `id`: รองรับ `pk-<productId>`, `ticket-<productId>`, หรือ `<productId>`

Errors:
- `400 btk_invalid_package_id`
- `404 btk_package_not_found`

### 7) GET `/frontend/bootstrap`

endpoint เดียวที่คืนข้อมูลตั้งต้นทั้งหมดสำหรับหน้าแรก (แนะนำให้ frontend ใช้ endpoint นี้เป็นหลัก)

Query params:

| Field | Type | Required | Description |
|---|---|---|---|
| `from` | string | No | ค่า search override |
| `to` | string | No | ค่า search override |
| `departDate` | string (`YYYY-MM-DD`) | No | ค่า search override |
| `tripType` | `oneway` \| `roundtrip` | No | default ตาม backend |
| `adults` | int | No | default = 1 |
| `children` | int | No | default = 0 |
| `childAges` | string (`comma-separated`) | No | เช่น `5,8` |
| `packageQ` | string | No | filter packages |
| `packageLocation` | string | No | filter packages |
| `includePackages` | int (`0`/`1`) | No | default = `1` |

Response โครงสร้าง:

```json
{
  "generatedAt": "2026-05-11T08:00:00+00:00",
  "locations": [],
  "defaultSearch": {
    "tripType": "oneway",
    "from": "Bangkok (BKK)",
    "to": "Koh Samui (KSM)",
    "departDate": "2026-05-13",
    "returnDate": "2026-05-20",
    "adults": 1,
    "children": 0,
    "childAges": []
  },
  "search": {
    "tripType": "oneway",
    "from": "Bangkok (BKK)",
    "to": "Koh Samui (KSM)",
    "departDate": "2026-05-13",
    "returnDate": "2026-05-20",
    "adults": 1,
    "children": 0,
    "childAges": []
  },
  "tickets": [],
  "packages": []
}
```

## Ticket Schema (สรุป)

```json
{
  "id": "tk-101",
  "productId": 101,
  "from": "Bangkok",
  "to": "Koh Samui",
  "operator": "Lomprayah",
  "ferryType": "High Speed Catamaran",
  "departTime": "07:00",
  "arriveTime": "11:30",
  "duration": "4h 30m",
  "seats": 45,
  "pricing": {
    "adult": 850,
    "child": 600,
    "toddler": 0
  },
  "amenities": ["WiFi", "Air Conditioning"],
  "images": ["https://..."],
  "departDate": "2026-05-13",
  "routeType": "single",
  "routeConnection": [
    { "id": 201, "title": "Route A" }
  ],
  "routeDetails": {
    "checkin": {
      "minutesBefore": 30,
      "location": "Bangkok Pier",
      "locationId": 301
    },
    "pickup": {
      "location": "Hotel Pickup",
      "locationId": 302
    },
    "dropoff": {
      "location": "Nathon Pier",
      "locationId": 303
    }
  },
  "itinerary": [
    {
      "key": "before_departure",
      "minutes": 45,
      "details": "Arrive at check-in counter"
    }
  ],
  "conditions": {
    "disableRequired": false,
    "required": [
      {
        "type": "text",
        "key": "passport",
        "value": "",
        "instruction": "Enter passport number",
        "dataSource": 0
      }
    ],
    "conditionItems": [
      { "id": 401, "title": "No refund" }
    ]
  }
}
```

## Package Schema (สรุป)

```json
{
  "id": "pk-501",
  "productId": 501,
  "name": "Snorkeling Package",
  "description": "...",
  "shortDescription": "...",
  "price": 1900,
  "images": ["https://..."],
  "serviceType": "Snorkeling",
  "vehicleType": "Speedboat",
  "startTime": "08:00",
  "stopTime": "16:30",
  "locations": ["Koh Tao", "Koh Nang Yuan"],
  "note": "...",
  "included": {
    "meal": ["Lunch"],
    "equipment": ["Mask", "Life Jacket"],
    "pickupService": "Hotel Pickup",
    "guides": "English Guide"
  },
  "additionalInformation": {
    "nationalParkFee": "Not included",
    "insurance": "Included",
    "skillLevel": "Beginner",
    "groupSize": "1-20",
    "whatToBring": ["Sunscreen", "Towel"]
  },
  "termsAndConditions": {
    "cancellationPolicy": ["24 hours before departure"],
    "weatherConditions": ["Subject to sea conditions"]
  }
}
```

## Frontend Integration Notes

- แนะนำเรียก `GET /frontend/bootstrap` ตอนเข้า page ครั้งแรก เพื่อลดจำนวน request
- เวลา search ใหม่ สามารถเลือกใช้ `GET /frontend/tickets` โดยตรง
- `childAges` ฝั่ง query string ต้องส่งแบบ comma-separated เช่น `5,8`
- ถ้าส่ง `departDate` ไม่ถูกต้อง backend จะ fallback เป็นวันที่ปัจจุบัน + 2 วัน
- ฝั่ง UI ควรใช้ `id` (`tk-*`/`pk-*`) เป็น canonical id สำหรับ detail page

## Quick cURL

```bash
curl "https://<your-domain>/wp-json/custom/v1/frontend/bootstrap?from=BKK&to=KSM&departDate=2026-05-13&includePackages=1"
```

```bash
curl "https://<your-domain>/wp-json/custom/v1/frontend/tickets/tk-101?departDate=2026-05-13"
```

```bash
curl -X POST "https://<your-domain>/wp-json/custom/v1/frontend/bookings" \
  -H "Content-Type: application/json" \
  -d '{"ticketId":"tk-101","passengers":[{"name":"John"}]}'
```
