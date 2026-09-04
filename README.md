# TrainTrack Sri Lanka
> *"Plan. Travel. Improve."*

A modern, TRAIN-ONLY public transportation web application specifically engineered for Sri Lankan railway passengers, built with the MERN stack (MongoDB, Express.js, React, Node.js).

---

## 🌐 Live Deployed Application

- **Frontend Application**: [https://sef-hackathon-23-1.onrender.com](https://sef-hackathon-23-1.onrender.com)
- **Backend API Service**: [https://sef-hackathon-23.onrender.com](https://sef-hackathon-23.onrender.com)
- **API Health Check**: [https://sef-hackathon-23.onrender.com/api/health](https://sef-hackathon-23.onrender.com/api/health)

---

## Project Overview

Sri Lanka Railways is one of the most vital national public transit networks, carrying hundreds of thousands of commuters, regional travelers, and tourists daily. **TrainTrack Sri Lanka** is a unified digital railway passenger platform that provides accurate schedule searching, transparent ticket fare estimation across coach classes, crowd-sourced incident and delay reporting, and passenger journey feedback.

## Problem

Passengers utilizing Sri Lanka's railway system frequently encounter challenges such as:
1. Difficulty locating up-to-date departure and arrival timings across lines (Coast line, Main line, Northern line).
2. Unclear multi-tier coach fare structures (First Class AC, Second Class, Third Class, adult vs. child fares).
3. Lack of an official, transparent channel to report delays, overcrowding, sanitation issues, or broken infrastructure.
4. Absence of aggregated community passenger feedback to evaluate train comfort, punctuality, and service quality.

## Solution

TrainTrack Sri Lanka solves these challenges by providing:
- A responsive, intuitive portal tailored exclusively to trains.
- High-efficiency schedule lookups with intermediate station halt timelines.
- Real-time journey fare computation based on Sri Lanka Railways distance tariffs.
- A trackable incident reporting workflow with report IDs (`TT-XXXX`) and lifecycle status tracking (`UNDER_REVIEW` → `IN_PROGRESS` → `RESOLVED`).
- Multi-metric passenger rating aggregation (punctuality, comfort, cleanliness, and staff service).

## Main Features

- **Direct & Connecting Train Search**: Find trains connecting major Sri Lankan terminals (Colombo Fort, Kandy, Galle, Jaffna, etc.).
- **Visual Station Timelines**: View stop orders, scheduled arrivals, and distance milestones.
- **Dynamic Fare Breakdown**: Calculate per-passenger and group trip expenses by class and passenger age.
- **Incident Lifecycle Management**: Report service breakdowns with trackable tickets and severity tags.
- **Passenger Review Dashboard**: Submit travel reviews and view 5-star ratings across 4 operational criteria.
- **Modular MERN Architecture**: Clear separation of concerns designed for independent team component development.

---

## Four Main Components

The system architecture is strictly organized into four independent functional components:

### Component 1: Route & Schedule Management
- **Purpose**: Allow passengers to search railway routes and view operational train timetables.
- **Key Capabilities**: Station selection, travel date filtering, train type filtering (Express, Intercity, Normal), departure sorting, train status indicators, and intermediate stop timelines.
- **Recommended Branch**: `feature/routes-schedules`

### Component 2: Fare Calculator & Trip Cost
- **Purpose**: Calculate estimated railway journey ticket expenses before traveling.
- **Key Capabilities**: Origin and destination station selection, train class selection (`FIRST`, `SECOND`, `THIRD`), passenger type (`ADULT`, `CHILD`), quantity multiplier, and strict input validation.
- **Recommended Branch**: `feature/fare-calculator`

### Component 3: Transport Issue Reporting
- **Purpose**: Allow passengers to log railway service issues and monitor remediation.
- **Key Capabilities**: Incident logging (Delays, Overcrowding, Unsafe Conditions, Cleanliness, Broken Facilities, Staff Service), automated unique tracking ID generation (`TT-XXXX`), status workflow (`UNDER_REVIEW` → `IN_PROGRESS` → `RESOLVED`), and status filtering.
- **Recommended Branch**: `feature/issue-reporting`

### Component 4: Passenger Feedback & Rating
- **Purpose**: Allow passengers to rate travel experiences and view community ratings.
- **Key Capabilities**: 5-point rating submission across 5 dimensions (Overall, Punctuality, Cleanliness, Comfort, Staff Service), review comments, and real-time MongoDB aggregation metrics per train.
- **Recommended Branch**: `feature/feedback-rating`

---

## Technology Stack

### Frontend
- **Framework**: React 18
- **Tooling & Bundler**: Vite
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios
- **Iconography**: Lucide React
- **Target Deployment**: Vercel

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database ODM**: Mongoose
- **CORS Management**: cors
- **Environment Management**: dotenv
- **Development Monitor**: nodemon
- **Target Deployment**: Render

### Database
- **Database**: MongoDB Atlas

---

## Project Structure

```text
TrainTrack-SriLanka/
│
├── frontend/                     # React + Vite client
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── assets/               # Media and logos
│   │   ├── components/           # Reusable placeholder components
│   │   ├── context/              # Application state contexts
│   │   ├── hooks/                # Custom React hooks
│   │   ├── layouts/              # MainLayout, Navbar, Footer
│   │   ├── pages/                # Pages for the 4 core components
│   │   ├── services/             # Centralized Axios API services
│   │   ├── utils/                # Helper utilities
│   │   ├── App.jsx               # Client routes definition
│   │   ├── index.css             # Tailwind base & styles
│   │   └── main.jsx              # DOM entry point
│   ├── .env.example              # Frontend environment template
│   ├── package.json              # Frontend dependencies and scripts
│   ├── vite.config.js            # Vite configuration
│   └── README.md
│
├── backend/                      # Node.js + Express API server
│   ├── src/
│   │   ├── config/               # Database connection (db.js)
│   │   ├── controllers/          # HTTP request handlers
│   │   ├── middleware/           # Error handler & validation middleware
│   │   ├── models/               # Mongoose data models
│   │   ├── routes/               # Modular Express routes
│   │   ├── seed/                 # Realistic Sri Lankan railway seed data & script
│   │   ├── services/             # Business & data service logic
│   │   ├── utils/                # Standardized API response & constants
│   │   └── server.js             # Express server entry point
│   ├── .env.example              # Backend environment template
│   ├── package.json              # Backend dependencies and scripts
│   └── README.md
│
├── .gitignore                    # Git ignore file
└── README.md                     # Root project documentation
```

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/traintrack_db?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Installation

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm (v9+)
- MongoDB Atlas cluster URI (or local MongoDB)

### Clone Repository
```bash
git clone <repository-url>
cd TrainTrack-SriLanka
```

### Install Backend Dependencies
```bash
cd backend
npm install
```

### Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## Database Setup

1. Configure `backend/.env` with your MongoDB Atlas connection string.
2. Run the seed script to populate realistic Sri Lankan railway demo data (stations, trains, routes, schedules, fares, issues, feedback):
   ```bash
   cd backend
   npm run seed
   ```

---

## Running Backend

```bash
cd backend
# Development mode with auto-reload:
npm run dev

# Production start:
npm start
```

Backend will be accessible at `http://localhost:5000`. Verify health with `http://localhost:5000/api/health`.

---

## Running Frontend

```bash
cd frontend
# Start Vite development server:
npm run dev

# Build for production:
npm run build

# Preview production build:
npm run preview
```

Frontend will run at `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/health` | Service health status check |
| **GET** | `/api/stations` | List all operational railway stations |
| **GET** | `/api/stations/:id` | Get station details by ID or code |
| **GET** | `/api/trains` | List all trains |
| **GET** | `/api/trains/:id` | Get train details by ID or number |
| **GET** | `/api/routes` | List all train routes |
| **GET** | `/api/routes/:id` | Get route stop timeline and details |
| **GET** | `/api/schedules` | List operational schedules |
| **GET** | `/api/schedules/search?from=Colombo%20Fort&to=Kandy` | Search matching schedules by stations and date |
| **GET** | `/api/fares` | List fare table records |
| **POST** | `/api/fares/calculate` | Calculate trip cost for passengers & class |
| **GET** | `/api/issues` | List reported transport issues |
| **POST** | `/api/issues` | Submit a new transport issue report |
| **GET** | `/api/issues/:id` | Get issue details by ID or report ID |
| **PUT** | `/api/issues/:id/status` | Update issue status (`UNDER_REVIEW` / `IN_PROGRESS` / `RESOLVED`) |
| **DELETE** | `/api/issues/:id` | Withdraw / delete an incident report |
| **GET** | `/api/feedback` | List passenger feedback |
| **POST** | `/api/feedback` | Submit passenger feedback and ratings |
| **GET** | `/api/feedback/train/:trainId` | List feedback for a specific train |
| **GET** | `/api/feedback/summary/:trainId` | Get aggregated rating metrics for a train |

---

## Booking

The online train booking portal allows commuters to reserve seats on Sri Lanka Railways intercity and express network:
- **Train Selection**: Choose from verified operational train schedules directly from the timetable or journey search results. Cancelled trains are automatically blocked from booking.
- **Booking Process**: Select carriage class (`First`, `Second`, `Third`), specify passenger count (up to 10), and enter primary passenger contact details.
- **Fare Calculation**: Fare calculation is handled authoritatively by the backend server reusing the existing `fareService`. Client-side fare manipulation is strictly ignored.
- **Booking Confirmation**: Generates a unique customer-facing booking reference (`TL-2026-XXXXXX`) with initial state `PENDING_PAYMENT` awaiting settlement.

### Booking API

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/bookings` | Create a new train booking (`PENDING_PAYMENT`) |
| **GET** | `/api/bookings` | List all passenger bookings (supports status filtering) |
| **GET** | `/api/bookings/:id` | Get booking details by ID or reference code |
| **PUT** | `/api/bookings/:id/cancel` | Cancel an active booking record |

---

## Payment

The payment portal supports secure, simulated checkout for Sri Lanka Railways bookings:
- **Demo / Sandbox Payment**: Designed for safe educational demonstration. Clear disclaimers state: *"Demo Payment — No real money will be charged."*
- **Tamper-Proof Authorization**: Payable amounts are pulled directly from the authoritative database booking record, not from the browser client.
- **Simulated Scenarios**:
  - **Success Test Card**: `4242 4242 4242 4242` → Generates unique payment reference (`PAY-2026-XXXXXX`), sets payment `PAID`, and marks booking `CONFIRMED`.
  - **Decline Test Card**: `4000 0000 0000 0002` → Sets payment `FAILED`, maintains booking in `PENDING_PAYMENT` without creating duplicates.
- **Duplicate Payment Safeguard**: Re-attempting payment on an already confirmed booking is strictly prevented.
- **Zero Sensitive Data Stored**: In full compliance with PCI-DSS guidelines, no raw card numbers, CVVs, expiry dates, or PINs are ever saved in MongoDB.

### Payment API

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/payments/create` | Process payment for a booking using demo/sandbox card |
| **GET** | `/api/payments/:id` | Retrieve payment audit record by ID or reference |
| **GET** | `/api/payments/booking/:bookingId` | Get payment audit record for a given booking |

---

## Project Links & Deployment

- **GitHub Repository**: [https://github.com/hirunipraboda/SEF-Hackathon-23.git](https://github.com/hirunipraboda/SEF-Hackathon-23.git)
- **Deployed Frontend (Render)**: [https://sef-hackathon-23-1.onrender.com](https://sef-hackathon-23-1.onrender.com)
- **Deployed Backend (Render)**: [https://sef-hackathon-23.onrender.com](https://sef-hackathon-23.onrender.com)
- **Backend API Health Check**: [https://sef-hackathon-23.onrender.com/api/health](https://sef-hackathon-23.onrender.com/api/health)
- **Demonstration Video**: `[Link to Demonstration Video]` *(Placeholder)*

---

## Team Members

| Name | Student ID | Role / Functional Component Ownership |
| :--- | :--- | :--- |
| `[Member 1 Name]` | `[Student ID 1]` | **Component 1**: Route & Schedule Management |
| `[Member 2 Name]` | `[Student ID 2]` | **Component 2**: Fare Calculator & Trip Cost |
| `[Member 3 Name]` | `[Student ID 3]` | **Component 3**: Transport Issue Reporting |
| `[Member 4 Name]` | `[Student ID 4]` | **Component 4**: Passenger Feedback & Rating |

---

## Individual Contributions

### Member 1: Route & Schedule Management
- `[Contribution details to be filled]`

### Member 2: Fare Calculator & Trip Cost
- `[Contribution details to be filled]`

### Member 3: Transport Issue Reporting
- `[Contribution details to be filled]`

### Member 4: Passenger Feedback & Rating
- `[Contribution details to be filled]`
