# TrainTrack Sri Lanka - Backend API

Modular Node.js and Express RESTful API service for the TrainTrack Sri Lanka railway web application.

## Tech Stack
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB & Mongoose**: Object Data Modeling (ODM) library
- **dotenv**: Environment variable management
- **cors**: Cross-Origin Resource Sharing middleware
- **nodemon**: Development auto-reloading

## Architecture
```text
backend/
├── src/
│   ├── config/          # Database configuration (db.js)
│   ├── controllers/     # HTTP request handlers for 4 functional components
│   ├── middleware/      # Error handling and validation middlewares
│   ├── models/          # Mongoose schemas (Train, Station, Route, Schedule, Fare, TransportIssue, Feedback)
│   ├── routes/          # Express route definitions
│   ├── seed/            # Seed data and database seeder script
│   ├── services/        # Business logic and database operations
│   ├── utils/           # Response helpers, constants, and validators
│   └── server.js        # Server entry point
├── .env.example
├── package.json
└── README.md
```

## Setup & Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Configure your `MONGODB_URI` with your MongoDB Atlas connection string.

4. Seed the database with realistic Sri Lankan railway demo data:
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   Or production:
   ```bash
   npm start
   ```

## API Endpoints

### Health Check
- `GET /api/health` - Verify API server status

### Component 1: Route & Schedule Management
- `GET /api/stations` - Get all active stations
- `GET /api/stations/:id` - Get station details
- `GET /api/trains` - Get all trains
- `GET /api/trains/:id` - Get train details
- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get route details and stop timeline
- `GET /api/schedules` - Get all train schedules
- `GET /api/schedules/search?from=Colombo%20Fort&to=Kandy&date=2026-09-04` - Search schedules by stations and date

### Component 2: Fare Calculator & Trip Cost
- `GET /api/fares` - Get fare table
- `POST /api/fares/calculate` - Calculate trip cost for passengers, class, and stations

### Component 3: Transport Issue Reporting
- `GET /api/issues` - Get all reported issues (optional query: `?status=...&issueType=...`)
- `GET /api/issues/:id` - Get issue details by ID or reportId
- `POST /api/issues` - Report a railway issue
- `PUT /api/issues/:id/status` - Update issue lifecycle status (`UNDER_REVIEW` -> `IN_PROGRESS` -> `RESOLVED`)

### Component 4: Passenger Feedback & Rating
- `GET /api/feedback` - Get all feedback
- `POST /api/feedback` - Submit train review and rating
- `GET /api/feedback/train/:trainId` - Get feedback for a specific train
- `GET /api/feedback/summary/:trainId` - Get calculated rating summary and category averages
