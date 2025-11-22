# StockMaster

A full-stack inventory management system built with Node.js, Express, MongoDB, React, and Tailwind CSS. It features role-based access control (RBAC) for managers and staff, enabling efficient inventory operations across multiple warehouses.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based permissions.
- **Inventory Management**: Manage products, receipts, deliveries, transfers, and stock adjustments.
- **Warehouse Management**: Create and manage multiple warehouses with capacity tracking.
- **Audit History**: Track all inventory movements with a detailed timeline.
- **User Dashboards**: Separate interfaces for managers and staff with guided workflows.
- **Demo Data**: Pre-seeded demo data for testing and development.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, JWT, bcrypt
- **Frontend**: React 18, Vite, Tailwind CSS
- **Database**: MongoDB

## Prerequisites

- Node.js >= 18
- MongoDB >= 6 (local or cloud)

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your database and JWT secrets.

4. Seed the database with demo data:
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   The backend will run on http://localhost:5000.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:5173.

## Usage

- Access the application at http://localhost:5173.
- Use the demo credentials to log in:
  - **Manager**: demo@stockmaster.com / demo123
  - **Staff**: staff@stockmaster.com / staff123

## Project Structure

```
StockMaster/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and constants configuration
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Authentication, validation, error handling
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   └── server.js        # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   └── utils/           # Utility functions
│   └── package.json
└── README.md
```

## API Documentation

- Health check: `GET /api/health`
- Refer to individual route files in `backend/src/routes/` for detailed API endpoints.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature.
3. Make your changes and ensure tests pass.
4. Submit a pull request.

## License

This project is licensed under the MIT License.

## Team

- **Team Lead**: Vrund Patel
- **Team Members**: Hemil Hansora, Kaustav Das, Meet Soni
