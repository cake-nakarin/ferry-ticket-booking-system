# Vue 3 with Node.js Development Setup

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Create `.env` file

Copy `.env.example` to `.env` and configure if needed:

```bash
cp .env.example .env
```

### 3. Development Server

Run both Vue 3 and Node.js server:

```bash
# Terminal 1 - Vue development server (Vite)
npm run dev

# Terminal 2 - Node.js API server
node server.js
```

- Vue 3 app: http://localhost:5173
- API Server: http://localhost:8000

### 4. Build for Production

```bash
npm run build
```

This creates optimized build in `dist/` folder.

### 5. Production Server

```bash
# Serve built app with Node.js
node server.js
```

## 📁 Project Structure

```
ferry-ticket-booking-system/
├── src/                      # Vue 3 source code
│   ├── components/          # Vue components
│   ├── views/              # Page views (Home, Search, Cart)
│   ├── stores/             # Pinia state management
│   ├── router/             # Vue Router configuration
│   ├── services/           # API services
│   ├── App.vue             # Root component
│   ├── main.js             # Application entry point
│   └── style.css           # Global styles
├── dist/                    # Production build output
├── server.js               # Node.js Express server
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
├── index.html              # HTML template
└── .env.example            # Environment variables template
```

## 🎯 Key Features

### Frontend (Vue 3)
- **Components**: Reusable UI components
- **Views**: Home, Search Tickets, Shopping Cart
- **State Management**: Pinia for global state
- **Routing**: Vue Router for navigation
- **API Integration**: Axios for HTTP requests

### Backend (Node.js)
- **Express Server**: RESTful API
- **CORS Support**: Cross-origin requests
- **Mock Database**: Sample ticket data
- **Booking System**: Endpoint for creating bookings

## 📚 API Endpoints

### Search Tickets
```
GET /api/tickets/search?departure=Bangkok&destination=Phuket&date=2026-04-30
```

### Get All Tickets
```
GET /api/tickets
```

### Get Single Ticket
```
GET /api/tickets/:id
```

### Create Booking
```
POST /api/bookings
Content-Type: application/json

{
  "tickets": [...],
  "passenger": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Health Check
```
GET /api/health
```

## 🛠️ Available Scripts

```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## 🎨 Vue 3 Features Used

- **Composition API**: Modern Vue 3 syntax with `<script setup>`
- **Reactive State**: `ref()` and `reactive()` for state management
- **Computed Properties**: Derived state with `computed()`
- **Pinia Store**: Global state management
- **Vue Router**: Client-side routing
- **Async/Await**: Modern async operations

## 🌍 Environment Variables

Create `.env` file:

```
VITE_API_URL=http://localhost:8000/api
```

Access in Vue: `import.meta.env.VITE_API_URL`

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Troubleshooting

### Port already in use
```bash
# Change Vite port in vite.config.js
# Change Node server port: PORT=3000 node server.js
```

### CORS errors
```bash
# Make sure server.js is running with cors middleware
```

### Module not found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Dependencies

### Production
- **vue**: Vue 3 framework
- **vue-router**: Routing library
- **pinia**: State management
- **axios**: HTTP client

### Development
- **vite**: Build tool and dev server
- **@vitejs/plugin-vue**: Vue 3 support for Vite
- **eslint**: Code linting
- **eslint-plugin-vue**: Vue linting rules

## 🚢 Deployment

### Vercel / Netlify
1. Run `npm run build`
2. Deploy `dist/` folder

### Traditional Server
1. Build: `npm run build`
2. Serve with Node.js: `node server.js`

## 📞 Support

For issues or questions, check:
- Vue 3 Docs: https://vuejs.org/
- Vite Docs: https://vitejs.dev/
- Pinia Docs: https://pinia.vuejs.org/
- Vue Router Docs: https://router.vuejs.org/
