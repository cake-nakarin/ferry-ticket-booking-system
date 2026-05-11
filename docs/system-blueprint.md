# System Blueprint

## ภาพรวมระบบ

Single Page Application สำหรับจองตั๋วเรือ — ไม่มี backend จริง ใช้ mock data ทั้งหมด

---

## Layout หลัก

```
┌─────────────────────────────────────────────┐
│  TopHeader (ซ่อนบน mobile ≤640px)           │
├─────────────────────────────────────────────┤
│  MainHeader — Navigation + Logo             │
│  (hamburger menu บน mobile ≤640px)          │
├─────────────────────────────────────────────┤
│  SearchSection                              │
│  - tripType: oneway / roundtrip             │
│  - from / to (dropdown location)            │
│  - departDate / returnDate (date picker)    │
│  - adults + children + childAges            │
│  (หลัง search บน mobile: แสดง summary card) │
├─────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────────┐  │
│  │FilterSidebar│  │  Ticket Results     │  │
│  │(ซ่อน ≤1024)│  │  [TicketCard] ...   │  │
│  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────┤
│  MobileBookingBar (fixed bottom, mobile)    │
│  - แสดงตั๋วที่เลือก + ราคา + ปุ่มดำเนินการ  │
└─────────────────────────────────────────────┘
```

---

## Component Architecture

### `App.vue`

- Root component
- `currentView: ref('home' | 'cart')` — สลับระหว่าง Home และ Cart
- ฟัง `@go-cart` event จาก `Home.vue` เพื่อเปลี่ยนไป Cart

---

### `Home.vue`

Component หลักที่ควบคุม logic ทั้งหมด

**State หลัก**:
| Ref | Type | หน้าที่ |
|-----|------|---------|
| `tickets` | `ref([])` | ผลการค้นหา outbound |
| `returnTickets` | `ref([])` | ผลการค้นหา return (round-trip) |
| `currentStep` | `ref('outbound' \| 'return')` | ขั้นตอน round-trip |
| `selectedOneway` | `ref(null)` | ตั๋วที่เลือก (one-way) |
| `selectedOutbound` | `ref(null)` | ตั๋ว outbound (round-trip) |
| `selectedReturn` | `ref(null)` | ตั๋ว return (round-trip) |
| `searchFilters` | `ref({...})` | state การค้นหาปัจจุบัน |
| `searchFormInitial` | `ref({...})` | ค่าเริ่มต้นส่งให้ SearchSection |

**URL Functions**:
- `getLocationId(label)` — แยก ID จาก label เช่น `'Bangkok (BKK)'` → `'BKK'`
- `buildQueryFromSearch(params)` — สร้าง URLSearchParams
- `pushSearchToUrl(params)` — `history.pushState` อัปเดต URL
- `parseSearchFromUrl()` — อ่านและ parse URL query → search state
- `onMounted`: parse URL → ถ้ามี query → auto-search ทันที
- `onBeforeUnmount`: ลบ `popstate` listener

**Event Handlers**:
- `handleSearch(params)` — อัปเดต state + URL + โหลด tickets
- `handleTicketSelect(ticket)` — set selectedOneway / selectedOutbound; ถ้า round-trip และ outbound ถูกเลือกแล้ว → เปลี่ยนไป step return
- `handleProceed()` — `addToCart()` + emit `go-cart`

---

### `SearchSection.vue`

**Props**:
- `initialValues` (Object) — ค่าเริ่มต้นจาก URL สำหรับ prefill form

**State**:
- `tripType` — `'oneway'` | `'roundtrip'`
- `form` — `{ from, to, departDate, returnDate }`
- `adults`, `children`, `childAges`
- `hasSearched` — ใช้ toggle mobile summary view
- `showSearchSummary` (computed) — `hasSearched && isMobileView`

**Emits**:
- `search` — `{ from, to, departDate, returnDate, tripType, adults, children, childAges }`

---

### `TicketCard.vue`

**Props**:
| Prop | Type | หน้าที่ |
|------|------|---------|
| `ticket` | Object (required) | ข้อมูลตั๋ว |
| `searchParams` | Object | `{ adults, childAges }` — ใช้คำนวณราคา |
| `managed` | Boolean | เปิด selection mode (ใช้ใน Home.vue) |
| `forceSelected` | Boolean | แสดงสถานะ selected จากภายนอก |

**Tabs**: route, photos, service, price

**Photo carousel**: aspect ratio 4:3, sliding track, dot controls ด้านล่าง

**Emits**: `ticket-select` (ใน managed mode)

**Mobile layout**:
- ≤768px: แถวบน (logo + details), แถวล่าง (action)
- ≤480px: ลด padding, amenities เป็น pill

---

### `MobileBookingBar.vue`

Fixed bottom bar แสดงบน mobile เท่านั้น (Home.vue ใช้ `v-if`)

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| `tripType` | string | `'oneway'` \| `'roundtrip'` |
| `currentStep` | string | `'outbound'` \| `'return'` |
| `selectedOneway` | Object\|null | ตั๋วที่เลือก (one-way) |
| `selectedOutbound` | Object\|null | ตั๋ว outbound |
| `selectedReturn` | Object\|null | ตั๋ว return |
| `totalPrice` | number | ราคารวม |
| `outboundPrice` | number | ราคา outbound |
| `returnPrice` | number | ราคา return |
| `canProceed` | boolean | เปิด/ปิดปุ่มดำเนินการ |

**Emits**: `change-oneway`, `change-outbound`, `change-return`, `proceed`

**Layout**: Fixed bottom, width 100%, overflow-x hidden (ป้องกัน horizontal scroll)  
One-way: แสดง 1 leg row; Round-trip: แสดง 2 leg rows

---

### `FilterSidebar.vue`

Filter options:
- `maxPrice` — ราคาสูงสุด (slider)
- `ferryTypes` — ประเภทเรือ (checkbox)
- `timeSlots` — ช่วงเวลาออกเดินทาง (checkbox)
- `amenityFilters` — สิ่งอำนวยความสะดวก (checkbox)
- `operatorFilters` — ผู้ประกอบการ (checkbox)

ซ่อนบน mobile ≤1024px ด้วย `v-if` ใน Home.vue

---

## Booking Flow

### One-way

```
SearchSection → emit('search')
Home.vue → loadTickets() → tickets[]
User เลือก TicketCard → selectedOneway set
MobileBookingBar canProceed=true → emit('proceed')
Home.vue → addToCart() → emit('go-cart')
App.vue → currentView = 'cart'
```

### Round-trip

```
SearchSection → emit('search', { tripType: 'roundtrip' })
Home.vue → loadTickets() → tickets[] (outbound)
         currentStep = 'outbound'

User เลือก TicketCard → selectedOutbound set
         currentStep = 'return'
Home.vue → loadReturnTickets() → returnTickets[] (from/to สลับ)

User เลือก TicketCard → selectedReturn set
MobileBookingBar canProceed=true → emit('proceed')
Home.vue → addToCart(outbound) + addToCart(return) → emit('go-cart')
```

---

## Pinia Store (`src/stores/booking.js`)

Setup Store style:

```js
const cartItems = ref([])
const cartTotal = computed(...)
const cartCount = computed(...)

function addToCart(item) { ... }
function removeFromCartById(id) { ... }
```

ไม่เรียก API โดยตรง — logic อยู่ใน Home.vue, service functions อยู่ใน `src/services/`
