import { reactive } from 'vue'

const messages = {
  en: {
    top: {
      home: 'Home',
      help: 'Help',
      login: 'Sign In'
    },
    menu: {
      ferry: 'Ferry Tickets',
      hotel: 'Hotels',
      car: 'Car Rental'
    },
    search: {
      roundTrip: 'Round Trip',
      oneWay: 'One Way',
      from: 'From',
      to: 'To',
      departDate: 'Departure Date',
      returnDate: 'Return Date',
      passengers: 'Passengers',
      person: 'person',
      search: 'Search',
      selectFrom: 'Select departure',
      selectTo: 'Select destination',
      swapDirection: 'Swap direction'
    },
    promo: {
      label: 'Pick your ferry and plan your trip',
      title: 'Best fares on ferryticket.com',
      details: 'View details',
      confirm: 'Confirm booking'
    },
    filters: {
      price: 'Price',
      ferryType: 'Ferry Type',
      departTime: 'Departure Time',
      amenities: 'Amenities',
      morning: 'Morning (06:00 - 12:00)',
      afternoon: 'Afternoon (12:00 - 18:00)',
      evening: 'Evening (18:00 - 23:59)',
      food: 'Food and drinks',
      vipRestroom: 'VIP restroom'
    },
    results: {
      title: 'Search Results',
      tickets: 'tickets',
      sortBy: 'Sort by:',
      fastest: 'Fastest',
      cheapest: 'Cheapest',
      longest: 'Longest'
    },
    ticket: {
      seatsLeft: 'seats left',
      pricePerPerson: 'Price per person',
      selected: 'Selected',
      select: 'Select',
      route: 'Route details',
      service: 'Service details',
      pricing: 'Price summary',
      ticketPrice: 'Ticket price',
      fee: 'Service fee',
      terms: 'Booking terms',
      travel: 'Travel',
      gate: 'Gate',
      checkin: 'Check-in',
      checkout: 'Check-out'
    },
    cart: {
      backToSearch: 'Back to search',
      bookingList: 'Booking List',
      remove: 'Remove',
      summary: 'Booking Summary',
      ticketCount: 'Ticket count',
      items: 'items',
      total: 'Subtotal',
      grandTotal: 'Total',
      pay: 'Proceed to Payment',
      continue: 'Find more tickets',
      emptyTitle: 'No bookings yet',
      emptyDesc: 'Select a ferry ticket and click "Select" to add it to cart',
      searchTicket: 'Search ferry tickets',
      checkoutAlert: 'Proceeding payment for'
    }
  },
  th: {
    top: {
      home: 'หน้าแรก',
      help: 'ช่วยเหลือ',
      login: 'เข้าสู่ระบบ'
    },
    menu: {
      ferry: 'ตั๋วเรือ',
      hotel: 'ที่พัก',
      car: 'เช่ารถ'
    },
    search: {
      roundTrip: 'ไป-กลับ',
      oneWay: 'เที่ยวเดียว',
      from: 'ต้นทาง',
      to: 'ปลายทาง',
      departDate: 'วันไปเดินทาง',
      returnDate: 'วันกลับเดินทาง',
      passengers: 'ผู้โดยสาร',
      person: 'คน',
      search: 'ค้นหา',
      selectFrom: 'เลือกต้นทาง',
      selectTo: 'เลือกปลายทาง',
      swapDirection: 'สลับทิศทาง'
    },
    promo: {
      label: 'เลือกเรือที่ชอบ วางแผนการเดินทาง',
      title: 'ราคาดีที่สุด บน ferryticket.com',
      details: 'ดูรายละเอียด',
      confirm: 'ยืนยันการจอง'
    },
    filters: {
      price: 'ราคา',
      ferryType: 'ประเภทเรือ',
      departTime: 'เวลาออกเดินทาง',
      amenities: 'สิ่งอำนวยความสะดวก',
      morning: 'เช้า (06:00 - 12:00)',
      afternoon: 'บ่าย (12:00 - 18:00)',
      evening: 'เย็น (18:00 - 23:59)',
      food: 'อาหารและเครื่องดื่ม',
      vipRestroom: 'ห้องน้ำ VIP'
    },
    results: {
      title: 'ผลการค้นหา',
      tickets: 'ตั๋ว',
      sortBy: 'เรียงตาม:',
      fastest: 'เร็วสุด',
      cheapest: 'ราคาน้อย',
      longest: 'เที่ยวนานสุด'
    },
    ticket: {
      seatsLeft: 'ที่ว่าง',
      pricePerPerson: 'ราคาต่อคน',
      selected: 'เลือกแล้ว',
      select: 'เลือก',
      route: 'เส้นทางการเดินทาง',
      service: 'รายละเอียดบริการ',
      pricing: 'สรุปราคา',
      ticketPrice: 'ราคาตั๋วต่อคน',
      fee: 'ค่าธรรมเนียม',
      terms: 'เงื่อนไขการจอง',
      travel: 'เดินทาง',
      gate: 'Gate',
      checkin: 'Check-in',
      checkout: 'Check-out'
    },
    cart: {
      backToSearch: 'กลับไปค้นหา',
      bookingList: 'รายการจอง',
      remove: 'ลบ',
      summary: 'สรุปการจอง',
      ticketCount: 'จำนวนตั๋ว',
      items: 'ใบ',
      total: 'ราคารวม',
      grandTotal: 'ยอดชำระ',
      pay: 'ดำเนินการชำระเงิน',
      continue: 'ค้นหาเพิ่มเติม',
      emptyTitle: 'ยังไม่มีรายการจอง',
      emptyDesc: 'เลือกตั๋วเรือที่ต้องการแล้วกด "เลือก" เพื่อเพิ่มลงตะกร้า',
      searchTicket: 'ค้นหาตั๋วเรือ',
      checkoutAlert: 'ดำเนินการชำระเงิน'
    }
  }
}

export const i18nState = reactive({
  lang: 'en'
})

const getMessage = (obj, path) => {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj)
}

export const t = (key) => {
  const selected = messages[i18nState.lang] || messages.en
  return getMessage(selected, key) ?? getMessage(messages.en, key) ?? key
}

export const setLang = (lang) => {
  if (lang === 'en' || lang === 'th') {
    i18nState.lang = lang
  }
}
