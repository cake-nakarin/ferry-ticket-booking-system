# Ferry Ticket Booking System

ระบบจองตั๋วเรือแบบ Single Page Application สร้างด้วย Vue 3 + Vite

## Tech Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Pinia** — State management
- **Vite** — Dev server & build tool
- **i18n** — ภาษาไทย/อังกฤษ (`src/i18n.js`)
- **CSS Variables** — Design system (ไม่ใช้ UI framework ภายนอก)

ไม่มี WordPress, PHP, หรือ backend จริง — ระบบใช้ mock data ทั้งหมด

## คำสั่ง

```bash
npm install          # ติดตั้ง dependencies
npm run dev          # เริ่ม Vite dev server (port 5175)
npm run build        # Production build
npm run lint         # ESLint
```

## โครงสร้างโปรเจกต์

```
src/
  App.vue              # Root component — view switcher (home/cart)
  main.js              # createApp + createPinia
  i18n.js              # i18n config (th/en)
  style.css            # Global CSS variables & base styles
  components/
    MainHeader.vue     # Top navigation bar (mobile: hamburger menu)
    TopHeader.vue      # Secondary info bar (hidden on mobile ≤640px)
    SearchSection.vue  # Search form (one-way / round-trip)
    TicketCard.vue     # Ticket result card (4 tabs, photo carousel)
    FilterSidebar.vue  # Filter panel (hidden on mobile ≤1024px)
    MobileBookingBar.vue # Fixed bottom bar for mobile booking flow
  views/
    Home.vue           # Main page — search + results + booking flow
    Cart.vue           # Cart page — selected tickets + price breakdown
  stores/
    booking.js         # Pinia store — cartItems, addToCart, removeFromCartById
  services/
    api.js             # HTTP service layer (USE_MOCK=true)
    mockData.js        # LOCATIONS, OPERATORS, MOCK_TICKETS
  router/
    index.js           # Route definitions (unused — navigation via App.vue)
```

## ฟีเจอร์หลัก

- **ค้นหาตั๋ว** — One-way หรือ Round-trip, เลือกจุดเริ่มต้น/ปลายทาง, วันที่, ผู้โดยสาร (ผู้ใหญ่ + เด็ก)
- **URL sync** — state การค้นหาถูก encode ใน URL query string; reload หน้าแล้ว state ยังอยู่
- **Round-trip flow** — เลือก outbound ก่อน แล้วจึงเลือก return; แสดงใน MobileBookingBar
- **Filter sidebar** — กรองราคา, ประเภทเรือ, เวลาออก, สิ่งอำนวยความสะดวก, ผู้ประกอบการ
- **Cart** — เพิ่ม/ลบตั๋ว, แสดง price breakdown (ผู้ใหญ่ + เด็กแต่ละคน)
- **Responsive** — มี mobile layout แยกต่างหาก (≤768px)

## URL Search Contract

ดูรายละเอียดใน [docs/api-documentation.md](./docs/api-documentation.md)

## เอกสารเพิ่มเติม

- [System Blueprint](./docs/system-blueprint.md)
- [Technical Requirements](./docs/technical-requirements.md)
- [API Documentation](./docs/api-documentation.md)
- [Design System Guide](./docs/design-system-guide.md)
