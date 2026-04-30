# Ferry Ticket Booking System Plugin

ระบบการจองตั๋วเรือสมัยใหม่สำหรับ WordPress

## คำบรรยาย
Plugin นี้เป็นระบบการจองตั๋วเรือที่ใช้ Vue.js ในการสร้างหน้าเดียว (Single Page Application) ภายใน WordPress สำหรับจองตั๋วเรือได้สะดวกและรวดเร็ว

## ฟีเจอร์หลัก
- ✅ ค้นหาตั๋วเรือ (Search Form)
- ✅ แสดงผลการค้นหา (Search Results)
- ✅ ตะกร้าเดินทาง (Shopping Cart)
- ✅ หน้าเดียว (Single Page)
- ✅ ตัวเลือกการโหลดแบบ Modern
- ✅ รองรับการตอบสนอง (Responsive Design)

## โครงสร้าง Plugin

```
ferry-ticket-booking-system/
├── docs/                    # เอกสารระบบ
├── assets/                  # ไฟล์ CSS, JS, รูปภาพ
│   ├── js/
│   │   ├── app.js          # Vue.js application
│   │   ├── components/     # Vue components
│   │   └── store/          # Vuex store
│   └── css/
│       └── style.css       # Styling
├── includes/               # PHP backend
│   ├── api/                # REST API endpoints
│   ├── models/             # Data models
│   └── class-plugin.php    # Main plugin class
├── templates/              # HTML templates
│   └── booking-page.php    # Main booking page
├── ferry-ticket-booking-system.php  # Plugin main file
└── package.json            # Dependencies

```

## วิธีการติดตั้ง
1. ไปยัง `/wp-content/plugins/`
2. สร้างโฟลเดอร์ `ferry-ticket-booking-system`
3. คัดลอกไฟล์และโฟลเดอร์ทั้งหมดเข้าไป
4. เปิดใช้งาน Plugin จาก WordPress Admin

## เอกสารเพิ่มเติม
- [System Blueprint](./docs/system-blueprint.md)
- [Technical Requirements](./docs/technical-requirements.md)
- [API Documentation](./docs/api-documentation.md)
- [Design System Guide](./docs/design-system-guide.md)
