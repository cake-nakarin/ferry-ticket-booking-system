# Technical Requirements

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| State Management | Pinia (Setup Store style) |
| Build Tool | Vite (dev port 5175) |
| HTTP / Data | Mock data only (`src/services/api.js`, `USE_MOCK=true`) |
| Styling | Plain CSS (CSS custom properties, scoped per component) |
| i18n | Custom (`src/i18n.js`) — Thai / English |
| Navigation | `App.vue` view switcher (`currentView: 'home' | 'cart'`) — ไม่ใช้ Vue Router ในทางปฏิบัติ |

ไม่มี WordPress, PHP, Axios, Vuex, หรือ backend server

---

## Dependencies (`package.json`)

```json
{
  "dependencies": {
    "vue": "^3.x",
    "pinia": "^2.x"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^x.x",
    "vite": "^x.x",
    "eslint": "^x.x"
  }
}
```

---

## Components

### Layout Components

| Component | File | หน้าที่ |
|-----------|------|---------|
| `TopHeader` | `src/components/TopHeader.vue` | Info bar บนสุด — ซ่อนบน mobile (≤640px) |
| `MainHeader` | `src/components/MainHeader.vue` | Navigation bar — hamburger menu บน mobile (≤640px) |

### Feature Components

| Component | File | หน้าที่ |
|-----------|------|---------|
| `SearchSection` | `src/components/SearchSection.vue` | Search form — one-way/round-trip, ผู้โดยสาร, วันที่ |
| `TicketCard` | `src/components/TicketCard.vue` | แสดงข้อมูลตั๋ว — 4 tabs, photo carousel |
| `FilterSidebar` | `src/components/FilterSidebar.vue` | Filter panel — ซ่อนบน mobile (≤1024px) |
| `MobileBookingBar` | `src/components/MobileBookingBar.vue` | Fixed bottom bar สำหรับ mobile booking flow |

### Views

| View | File | หน้าที่ |
|------|------|---------|
| `Home` | `src/views/Home.vue` | Main page — search + results + booking flow |
| `Cart` | `src/views/Cart.vue` | Cart page — รายการตั๋วที่เลือก + ราคา |

---

## Mobile Breakpoints

| Breakpoint | ผลลัพธ์ |
|------------|---------|
| ≤640px | TopHeader ซ่อน, MainHeader แสดง hamburger |
| ≤768px | SearchSection แสดงเป็น summary card หลัง search; TicketCard layout เปลี่ยนเป็น 2 rows |
| ≤480px | TicketCard ลด padding, amenities แสดงเป็น pill |
| ≤1024px | FilterSidebar ซ่อน (Home.vue ใช้ `v-if`) |

---

## URL State Sync

`Home.vue` จัดการ URL ด้วย `window.history.pushState` + `popstate` listener

- `buildQueryFromSearch(params)` — สร้าง URLSearchParams จาก search state
- `pushSearchToUrl(params)` — เรียก `history.pushState` อัปเดต URL ไม่ reload หน้า
- `parseSearchFromUrl()` — อ่าน `location.search` และ map location ID → label
- `popstate` listener — sync URL กลับมายัง form เมื่อกด back/forward

---

## CSS Design System

Custom properties ใน `src/style.css`:

| Variable | Value | ใช้ที่ |
|----------|-------|--------|
| `--primary` | `#1976D2` | ปุ่มหลัก, สี accent |
| `--accent` | `#FF6F00` | CTA buttons, ไฮไลต์ |
| `--text` | `#212121` | ข้อความหลัก |
| `--text-secondary` | `#757575` | ข้อความรอง |
| `--border` | `#E0E0E0` | เส้นขอบ |
| `--bg` | `#F5F5F5` | พื้นหลัง |
| `--card-bg` | `#FFFFFF` | พื้นหลัง card |
| `--shadow` | box-shadow value | เงา card |

Font: Roboto (Google Fonts, โหลดใน `index.html`)  
Icons: Font Awesome 6.4.0 (CDN ใน `index.html`)

---

## i18n

`src/i18n.js` export:
- `t(key)` — คืน string ตาม locale ปัจจุบัน
- `setLang(lang)` — เปลี่ยน locale (`'th'` | `'en'`)
- `i18nState` — reactive state ของ locale ปัจจุบัน

---

## Data Flow

```
URL query string
    ↓ parseSearchFromUrl()
Home.vue (searchFilters, currentStep)
    ↓ props/events
SearchSection.vue → emit('search', params)
    ↓
Home.vue handleSearch()
    ↓ pushSearchToUrl() + loadTickets()
ticketService.searchTickets() → mockData.js
    ↓
tickets[] → TicketCard[] → emit('ticket-select')
    ↓
Home.vue handleTicketSelect() → selectedOneway / selectedOutbound / selectedReturn
    ↓
MobileBookingBar (mobile) → emit('proceed')
    ↓
booking.addToCart() → Cart.vue
```
