# TrainTrack Sri Lanka - Frontend Application

React + Vite single page web application for Sri Lankan railway passengers.

## Tech Stack
- **React**: UI library
- **Vite**: Next generation frontend tooling & fast development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client with centralized interceptors
- **Lucide React**: Railway and UI iconography

## Architecture
```text
frontend/
├── src/
│   ├── assets/       # Static assets and icons
│   ├── components/   # Modular, reusable UI building blocks & placeholders
│   ├── context/      # Shared React state contexts
│   ├── hooks/        # Custom React hooks
│   ├── layouts/      # MainLayout, Navbar, Footer
│   ├── pages/        # Route page views (4 main functional components)
│   ├── services/     # Centralized Axios API services
│   ├── utils/        # Frontend utility helpers
│   ├── App.jsx       # App router and route declarations
│   ├── index.css     # Tailwind CSS entry
│   └── main.jsx      # React DOM entry
├── public/           # Static public assets
├── .env.example      # Environment variable template
├── package.json
├── vite.config.js
└── README.md
```

## Routes
- `/`: Home page & schedule search launcher
- `/routes`: Component 1 - Train schedule browser & filter
- `/routes/:id`: Component 1 - Route & stop timeline details
- `/fare-calculator`: Component 2 - Journey ticket cost calculator
- `/report-issue`: Component 3 - Incident & problem reporting form
- `/my-reports`: Component 3 - Incident status tracking & updates
- `/feedback`: Component 4 - Train rating & passenger review aggregates

## Setup & Running

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure `.env` is configured (see `.env.example`):
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```
