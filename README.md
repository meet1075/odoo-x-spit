# StockMaster

A full-stack inventory management system built with Node.js, Express, MongoDB, React, and Tailwind CSS. It features role-based access control (RBAC) for managers and staff, enabling efficient inventory operations across multiple warehouses.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)
- [Team](#team)
- [Acknowledgments](#acknowledgments)
- [Changelog](#changelog)

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based permissions.
- **Inventory Management**: Manage products, receipts, deliveries, transfers, and stock adjustments.
- **Warehouse Management**: Create and manage multiple warehouses with capacity tracking.
- **Audit History**: Track all inventory movements with a detailed timeline.
- **User Dashboards**: Separate interfaces for managers and staff with guided workflows.
- **Demo Data**: Pre-seeded demo data for testing and development.

### Detailed Features

#### Authentication & Authorization
The system implements secure JWT (JSON Web Tokens) for user authentication. Users can log in with email and password, and tokens are used to authorize subsequent requests. Role-based access control ensures that managers have full access to all features, while staff members are limited to operational tasks. Permissions are defined in the backend configuration and enforced through middleware.

#### Inventory Management
- **Products**: Add, update, and delete product information including name, description, SKU, and current stock levels.
- **Receipts**: Record incoming goods with details like supplier, quantity, and warehouse destination.
- **Deliveries**: Manage outgoing shipments, tracking customer orders and reducing stock accordingly.
- **Transfers**: Move inventory between warehouses internally.
- **Adjustments**: Correct stock discrepancies with reasons and audit trails.

#### Warehouse Management
Users can create multiple warehouses, each with defined capacity limits. The system tracks current utilization and prevents overstocking. Warehouses can be assigned to specific regions or purposes.

#### Audit History
Every inventory movement is logged with timestamps, user information, and details of the change. This provides a complete audit trail for compliance and troubleshooting. The history can be viewed in chronological order or filtered by various criteria.

#### User Dashboards
- **Manager Dashboard**: Overview of all warehouses, inventory levels, recent activities, and analytics.
- **Staff Dashboard**: Focused on daily tasks like processing receipts, deliveries, and transfers.

#### Demo Data
The application comes with pre-seeded demo data including sample users, products, warehouses, and transactions. This allows for immediate testing and demonstration of features.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, JWT, bcrypt
- **Frontend**: React 18, Vite, Tailwind CSS
- **Database**: MongoDB

### Backend Technologies
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database for flexible data storage
- **JWT**: For secure token-based authentication
- **bcrypt**: For password hashing

### Frontend Technologies
- **React 18**: JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling

## Prerequisites

- Node.js >= 18
- MongoDB >= 6 (local or cloud)
- npm or yarn package manager

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
   Example `.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/stockmaster
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   ```

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

### Environment Variables

The backend requires several environment variables to be set:

- `PORT`: The port on which the server will run (default: 5000)
- `MONGODB_URI`: Connection string for MongoDB database
- `JWT_SECRET`: Secret key for JWT token signing
- `JWT_EXPIRE`: Expiration time for JWT tokens (e.g., 7d for 7 days)

## Usage

- Access the application at http://localhost:5173.
- Use the demo credentials to log in:
  - **Manager**: demo@stockmaster.com / demo123
  - **Staff**: staff@stockmaster.com / staff123

### Getting Started Guide

1. Log in with manager credentials to explore all features.
2. Create additional warehouses if needed.
3. Add products to your inventory.
4. Process receipts to increase stock.
5. Create deliveries to decrease stock.
6. View history to track all changes.

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

### Main API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (manager only)
- `GET /api/auth/me` - Get current user info

#### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Warehouses
- `GET /api/warehouses` - Get all warehouses
- `POST /api/warehouses` - Create new warehouse
- `PUT /api/warehouses/:id` - Update warehouse
- `DELETE /api/warehouses/:id` - Delete warehouse

#### Receipts
- `GET /api/receipts` - Get all receipts
- `POST /api/receipts` - Create new receipt

#### Deliveries
- `GET /api/deliveries` - Get all deliveries
- `POST /api/deliveries` - Create new delivery

#### Transfers
- `GET /api/transfers` - Get all transfers
- `POST /api/transfers` - Create new transfer

#### Adjustments
- `GET /api/adjustments` - Get all adjustments
- `POST /api/adjustments` - Create new adjustment

#### History
- `GET /api/history` - Get inventory history
- `GET /api/history/dashboard/stats` - Get dashboard statistics

## Screenshots

### Login Page
![Login Page](https://via.placeholder.com/800x600?text=Login+Page)

### Manager Dashboard
![Manager Dashboard](https://via.placeholder.com/800x600?text=Manager+Dashboard)

### Inventory Management
![Inventory Management](https://via.placeholder.com/800x600?text=Inventory+Management)

### Warehouse Overview
![Warehouse Overview](https://via.placeholder.com/800x600?text=Warehouse+Overview)

*Note: Screenshots are placeholders. Replace with actual images once available.*

## Roadmap

- [ ] Mobile responsive design improvements
- [ ] Advanced reporting and analytics
- [ ] Barcode scanning integration
- [ ] Multi-language support
- [ ] API rate limiting and caching
- [ ] Automated backups
- [ ] Integration with external ERP systems
- [ ] Real-time notifications
- [ ] Bulk import/export functionality

## FAQ

### How do I reset the demo data?
Navigate to the Settings page in the frontend and click "Reset Data".

### Can I use this in production?
This is a demo project. For production use, ensure proper security measures, database backups, and testing.

### How do I add new users?
Only managers can register new users through the application interface.

### What if I forget my password?
Password reset functionality is not implemented in this demo. Use the demo credentials or contact an administrator.

### Can I have multiple warehouses?
Yes, the system supports multiple warehouses with capacity tracking.

### How is data secured?
Passwords are hashed using bcrypt, and authentication uses JWT tokens. Ensure your JWT secret is strong and kept secure.

### What are the system requirements?
Node.js >= 18 and MongoDB >= 6. See Prerequisites section for details.

### How do I contribute?
See the Contributing section below.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature.
3. Make your changes and ensure tests pass.
4. Submit a pull request.

### Development Guidelines

- Follow the existing code style
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed

## License

This project is licensed under the MIT License.

## Team

- **Team Lead**: Vrund Patel
- **Team Members**: Hemil Hansora, Kaustav Das, Meet Soni

## Acknowledgments

- Thanks to the Node.js and React communities for excellent documentation
- MongoDB for providing a powerful NoSQL database
- All contributors and users of this project

## Changelog

### Version 1.0.0 (Initial Release)
- Basic inventory management features
- User authentication and authorization
- Warehouse management
- Audit history tracking
- Demo data seeding
- Responsive UI with React and Tailwind CSS

### Future Versions
- Planned features as listed in Roadmap
