# StockMaster Backend API

Complete Express.js REST API for the StockMaster Inventory Management System with JWT authentication, role-based access control, and MongoDB integration.

## 🚀 Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control**: Manager and Staff roles with granular permissions
- **Multi-Warehouse Support**: Track inventory across multiple locations
- **Automatic Stock Management**: Stock updates on receipt validation and delivery processing
- **Activity Logging**: Complete audit trail with automatic 90-day retention
- **Input Validation**: Comprehensive request validation using express-validator
- **Security**: Helmet, CORS, compression, and rate limiting
- **Error Handling**: Centralized error handling with detailed error responses

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm or yarn

## 🛠️ Installation

1. **Clone the repository** (if not already done)

2. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   # Server
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:5173

   # Database
   MONGODB_URI=mongodb://localhost:27017/stockmaster

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=30d

   # Optional: MongoDB Atlas
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockmaster
   ```

4. **Seed Database**:
   ```bash
   npm run seed
   ```

## 🎯 Usage

### Development
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### Production
```bash
npm start
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

## 👥 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Manager | demo@stockmaster.com | demo123 |
| Staff | staff@stockmaster.com | staff123 |

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Get current user |
| PUT | `/api/auth/profile` | Private | Update profile |
| PUT | `/api/auth/password` | Private | Change password |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Private | Get all products (filters: category, location, search, lowStock) |
| POST | `/api/products` | Manager | Create product |
| GET | `/api/products/:id` | Private | Get product by ID |
| PUT | `/api/products/:id` | Manager | Update product |
| DELETE | `/api/products/:id` | Manager | Delete product |
| PUT | `/api/products/:id/stock` | Private | Update stock (add/subtract/set) |

### Warehouses
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/warehouses` | Private | Get all warehouses (filters: type, isActive) |
| POST | `/api/warehouses` | Manager | Create warehouse |
| GET | `/api/warehouses/:id` | Private | Get warehouse by ID |
| PUT | `/api/warehouses/:id` | Manager | Update warehouse |
| DELETE | `/api/warehouses/:id` | Manager | Delete warehouse |

### Receipts
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/receipts` | Private | Get all receipts (filters: status, warehouse) |
| POST | `/api/receipts` | Manager | Create receipt |
| GET | `/api/receipts/:id` | Private | Get receipt by ID |
| PUT | `/api/receipts/:id/status` | Private | Update receipt status (auto-updates stock when done) |
| DELETE | `/api/receipts/:id` | Manager | Delete receipt |

### Deliveries
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/deliveries` | Private | Get all deliveries (filters: status, warehouse) |
| POST | `/api/deliveries` | Manager | Create delivery (validates stock) |
| GET | `/api/deliveries/:id` | Private | Get delivery by ID |
| PUT | `/api/deliveries/:id/status` | Private | Update delivery status (auto-decreases stock when done) |
| DELETE | `/api/deliveries/:id` | Manager | Delete delivery |

### Transfers
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/transfers` | Private | Get all transfers |
| POST | `/api/transfers` | Private | Create transfer |
| PUT | `/api/transfers/:id/status` | Private | Update transfer status (updates location when done) |
| DELETE | `/api/transfers/:id` | Manager | Delete transfer |

### Adjustments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/adjustments` | Private | Get all adjustments |
| POST | `/api/adjustments` | Manager | Create adjustment (immediately updates stock) |
| DELETE | `/api/adjustments/:id` | Manager | Delete adjustment |

### History & Analytics
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/history` | Private | Get activity history (filters: type, action, userId) |
| GET | `/api/history/dashboard/stats` | Private | Get dashboard statistics |

## 🔐 Authentication

### Login Request
```json
POST /api/auth/login
{
  "email": "demo@stockmaster.com",
  "password": "demo123"
}
```

### Response
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Demo Manager",
    "email": "demo@stockmaster.com",
    "role": "manager"
  }
}
```

### Using Token
Include in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🎭 Roles & Permissions

### Manager Role
Full access to all operations:
- ✅ Create/Update/Delete Products
- ✅ Create/Update/Delete Warehouses
- ✅ Create/Delete Receipts & Deliveries
- ✅ Process all operations
- ✅ Create/Delete Adjustments
- ✅ View all history and analytics

### Staff Role
Operational access:
- ✅ View Products (update stock only)
- ✅ View Warehouses
- ✅ Process Receipts & Deliveries
- ✅ Create/Process Transfers
- ✅ View history and analytics
- ❌ Cannot create Products/Warehouses
- ❌ Cannot create Receipts/Deliveries
- ❌ Cannot create Adjustments

## 📊 Data Models

### Product
```javascript
{
  name: String,
  sku: String (unique),
  category: Enum ['raw', 'finished', 'consumables', 'spare-parts'],
  stock: Number,
  minStock: Number,
  location: String,
  unitOfMeasure: String,
  price: Number,
  description: String
}
```

### Receipt
```javascript
{
  receiptId: String (auto: RCP-timestamp),
  supplier: String,
  warehouse: String,
  items: [{
    productId: ObjectId,
    productName: String,
    quantity: Number,
    unit: String
  }],
  status: Enum ['draft', 'waiting', 'ready', 'done', 'canceled'],
  date: Date,
  createdBy: ObjectId,
  processedBy: ObjectId,
  notes: String
}
```

### Delivery
```javascript
{
  deliveryId: String (auto: DEL-timestamp),
  customer: String,
  warehouse: String,
  items: [{ productId, productName, quantity, unit }],
  status: Enum ['draft', 'waiting', 'ready', 'done', 'canceled'],
  date: Date,
  shippingAddress: String,
  createdBy: ObjectId,
  processedBy: ObjectId
}
```

### Transfer
```javascript
{
  transferId: String (auto: TRF-timestamp),
  productId: ObjectId,
  productName: String,
  quantity: Number,
  fromLocation: String,
  toLocation: String,
  status: Enum ['waiting', 'ready', 'done', 'canceled'],
  date: Date,
  createdBy: ObjectId,
  processedBy: ObjectId
}
```

### Adjustment
```javascript
{
  adjustmentId: String (auto: ADJ-timestamp),
  productId: ObjectId,
  productName: String,
  location: String,
  oldQuantity: Number,
  newQuantity: Number,
  difference: Number (virtual),
  reason: String,
  status: 'done',
  date: Date,
  createdBy: ObjectId,
  approvedBy: ObjectId
}
```

## 🔄 Business Logic

### Stock Management
1. **Receipt Validation**: When receipt status changes to 'done', stock automatically increases
2. **Delivery Validation**: When delivery status changes to 'done', stock automatically decreases (validates sufficient stock)
3. **Transfer Completion**: When transfer status changes to 'done', product location updates
4. **Adjustments**: Immediately update stock to newQuantity on creation

### History Tracking
All operations automatically create history entries:
- Create/Update/Delete for all entities
- Stock movements (receipts, deliveries, transfers, adjustments)
- User actions with timestamps
- Automatic cleanup after 90 days

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: express-validator on all inputs
- **CORS**: Configurable cross-origin access
- **Helmet**: Security headers
- **Rate Limiting**: Prevent brute force attacks
- **Error Sanitization**: No sensitive data in error responses

## 🐛 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

### Common Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## 🧪 Testing Examples

### Create Product (Manager only)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "sku": "PRD-001",
    "category": "raw",
    "stock": 100,
    "minStock": 20,
    "location": "Main Warehouse",
    "unitOfMeasure": "kg",
    "price": 50.00
  }'
```

### Update Stock (Both roles)
```bash
curl -X PUT http://localhost:5000/api/products/:id/stock \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "add",
    "quantity": 50
  }'
```

### Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/history/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── constants.js         # App constants & permissions
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Warehouse.js
│   │   ├── Receipt.js
│   │   ├── Delivery.js
│   │   ├── Transfer.js
│   │   ├── Adjustment.js
│   │   └── History.js
│   ├── middleware/
│   │   ├── auth.js              # JWT & authorization
│   │   ├── error.js             # Error handling
│   │   └── validation.js        # Input validation
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── warehouseController.js
│   │   ├── receiptController.js
│   │   ├── deliveryController.js
│   │   ├── transferController.js
│   │   ├── adjustmentController.js
│   │   └── historyController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── warehouseRoutes.js
│   │   ├── receiptRoutes.js
│   │   ├── deliveryRoutes.js
│   │   ├── transferRoutes.js
│   │   ├── adjustmentRoutes.js
│   │   └── historyRoutes.js
│   ├── scripts/
│   │   └── seed.js              # Database seeding
│   └── server.js                # Main entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🚢 Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/stockmaster
JWT_SECRET=strong-random-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=https://yourdomain.com
```

### MongoDB Atlas Setup
1. Create cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Add database user
3. Whitelist IP addresses
4. Get connection string
5. Update `MONGODB_URI` in `.env`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙋 Support

For issues or questions:
- Create an issue in the repository
- Contact: support@stockmaster.com

## 🔄 Version History

- **v1.0.0** (2025-01-01)
  - Initial release
  - JWT authentication
  - Role-based access control
  - Multi-warehouse support
  - Complete CRUD operations
  - Automatic stock management
  - Activity history tracking
