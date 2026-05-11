import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 8000

// Middleware
app.use(cors())
app.use(express.json())

// Mock database for tickets
const mockTickets = [
  {
    id: 1,
    from: 'Bangkok',
    to: 'Phuket',
    departDate: '2026-05-11',
    departTime: '09:00',
    arriveTime: '17:00',
    price: 500,
    operator: 'Lomprayah',
    available: 50
  },
  {
    id: 2,
    from: 'Bangkok',
    to: 'Phuket',
    departDate: '2026-05-11',
    departTime: '14:00',
    arriveTime: '22:00',
    price: 450,
    operator: 'Seatran Ferry',
    available: 30
  },
  {
    id: 3,
    from: 'Phuket',
    to: 'Krabi',
    departDate: '2026-05-12',
    departTime: '10:00',
    arriveTime: '14:00',
    price: 350,
    operator: 'Raja Ferry',
    available: 25
  }
]

// Routes

// Get all tickets
app.get('/api/tickets', (req, res) => {
  res.json(mockTickets)
})

// Search tickets
app.get('/api/tickets/search', (req, res) => {
  const { from, to, departDate } = req.query
  
  let results = mockTickets
  
  if (from) {
    results = results.filter(t => 
      t.from.toLowerCase().includes(from.toLowerCase())
    )
  }
  
  if (to) {
    results = results.filter(t => 
      t.to.toLowerCase().includes(to.toLowerCase())
    )
  }
  
  if (departDate) {
    results = results.filter(t => t.departDate === departDate)
  }
  
  res.json(results)
})

// Get single ticket
app.get('/api/tickets/:id', (req, res) => {
  const ticket = mockTickets.find(t => t.id === parseInt(req.params.id))
  
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' })
  }
  
  res.json(ticket)
})

// Create booking
app.post('/api/bookings', (req, res) => {
  const { tickets, passenger } = req.body
  
  if (!tickets || tickets.length === 0) {
    return res.status(400).json({ error: 'No tickets provided' })
  }
  
  const booking = {
    id: Math.random().toString(36).substr(2, 9),
    status: 'confirmed',
    tickets,
    passenger,
    bookingDate: new Date().toISOString(),
    totalPrice: tickets.reduce((sum, ticket) => sum + ticket.price, 0)
  }
  
  res.json(booking)
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() })
})

// Serve static files from dist folder (for production)
app.use(express.static(path.join(__dirname, 'dist')))

// SPA fallback
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Ferry Ticket Booking API Server running on http://localhost:${PORT}`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`)
})
