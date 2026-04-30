# Design System Guide - Ferry Ticket Booking

เอกสารนี้ใช้เป็นคู่มือหลักสำหรับดูและแก้ไขงานดีไซน์ในอนาคต โดยอ้างอิงหน้าต้นแบบปัจจุบันที่อยู่ใน templates

## 1) Source of Truth

- Mockup หลัก: `templates/gother-inspired-design-material-ui.html`
- เอกสารระบบ: `docs/system-blueprint.md`
- เอกสารเทคนิค: `docs/technical-requirements.md`

ถ้ามีการปรับ UI ใหม่ ให้ปรับไฟล์ mockup หลักก่อน แล้วค่อยย้ายเข้าสู่ Vue components

## 2) Design Direction

- สไตล์: Material UI inspired + Gother-like layout
- Mood: สะอาด อ่านง่าย เน้นข้อมูลเที่ยวเดินทาง
- Priority: ผลการค้นหาอ่านเร็ว, กดเลือกได้เร็ว, ดูรายละเอียดได้ลึก

## 3) Global Design Tokens

ตัวแปรหลักอยู่ใน `:root` ของไฟล์ mockup

### Colors

- Primary: `#1976D2`
- Primary Dark: `#1565C0`
- Accent: `#FF6F00`
- Text: `#212121`
- Border Base: `rgb(227, 228, 232)`

### Border + Shadow Policy (Current)

- Card/Input/Panel border: `0.5px solid rgb(227, 228, 232)`
- Default shadow: `0 1px 3px rgba(0, 0, 0, 0.06)`
- Hover shadow: `0 2px 4px rgba(0, 0, 0, 0.08)`

### Radius + Motion

- Border radius: `4px`
- Transition: `200ms cubic-bezier(0.4, 0, 0.2, 1)`

## 4) Layout Structure

### Desktop

- Header top + main header
- Search section (tabs + form)
- Promo banner
- Main content 2 คอลัมน์:
- ซ้าย: filter sidebar
- ขวา: result list + cards

### Responsive Breakpoints

- `max-width: 1024px`: ซ่อนบางเมนู, ปรับ search layout
- `max-width: 768px`: card เรียงแนวตั้ง, sidebar ซ่อน
- `max-width: 480px`: ปรับ spacing และ typography

## 5) Component Map (CSS Selectors)

แก้จุดไหน ให้เริ่มจาก selector กลุ่มนี้

- Header: `.top-header`, `.main-header`
- Search: `.search-form`, `.form-group`, `.swap-icon`, `.search-btn`
- Filters: `.filter-panel`, `.filter-item`
- Results Header: `.results-header`, `.sort-btn`
- Trip Card หลัก: `.trip-card`, `.trip-card-main`, `.trip-action`
- Expand/Collapse: `.trip-expand-btn`, `.trip-details-expanded`, `.trip-card.expanded`
- Journey Timeline: `.journey-timeline`, `.timeline-segment`, `.timeline-dot`
- CTA: `.book-btn`

## 6) Trip Card Interaction Spec

### Expandable Card

- คลิกที่ `.trip-expand-btn` เพื่อสลับ expanded state
- คลิกที่ `.trip-card-main` เพื่อสลับ expanded state ได้เช่นกัน
- เมื่อ expanded:
- เพิ่มเส้นคั่นใต้หัวการ์ด
- แสดง `.trip-details-expanded`
- หมุนไอคอน chevron ใน `.trip-expand-btn`

### Expanded Content Order

1. เส้นทางการเดินทาง (`.journey-timeline`)
2. รายละเอียดบริการ
3. สรุปราคา
4. เงื่อนไขการจอง

## 7) Editing Rules For Future Changes

### ถ้าจะปรับ Theme สี

แก้เฉพาะตัวแปรใน `:root` ก่อน แล้วเช็กผลกับ component ทั้งหมด

### ถ้าจะปรับความบางของเส้น

คงมาตรฐานเดียวกันทั้งระบบ:

- panel
- card
- input
- button outline

อย่าปรับเฉพาะจุดจนเกิดความไม่สม่ำเสมอ

### ถ้าจะเพิ่ม section ใหม่ใน Card

- เพิ่มใน `.trip-details-expanded`
- ใช้โครงเดียวกับ `.expanded-section`
- เว้นระยะตาม spacing เดิม (8, 12, 16)

### ถ้าจะย้ายไป Vue Components

แนะนำแยกเป็น:

- `SearchForm.vue`
- `ResultsHeader.vue`
- `TripCard.vue`
- `TripCardExpanded.vue`
- `JourneyTimeline.vue`

และย้าย interaction จาก script ท้ายไฟล์เป็น event/props ใน Vue

## 8) QA Checklist ก่อน Commit ดีไซน์

- สีหลักและสี accent ถูกต้องตาม token
- border และ shadow ตรง policy
- hover/focus มี state ชัดเจน
- กด expand/collapse card ได้ทั้งปุ่มและพื้นที่ card
- responsive ผ่าน 1024, 768, 480
- ไม่มีข้อความล้น card บนมือถือ
- ปุ่มเลือก (`.book-btn`) ทำงานไม่ชนกับ click expand

## 9) Change Log (Design)

ใช้รูปแบบนี้เวลาแก้ UI เพื่อย้อนดูง่าย:

```
Date: YYYY-MM-DD
File: templates/gother-inspired-design-material-ui.html
Scope: (เช่น Trip Card / Timeline / Border & Shadow)
Changes:
- ...
- ...
Reason:
- ...
```
