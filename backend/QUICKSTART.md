# Quick Start Guide - StockMaster Backend

## 🚀 5-Minute Setup

### 1️⃣ Install Dependencies
```bash
cd backend
npm install
```

### 2️⃣ Configure Environment
```bash
# Copy the example environment file
cp .env.example .env
```

**Important**: Edit `.env` and set:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A strong random secret (change from default!)
- `FRONTEND_URL` - Your frontend URL (default: http://localhost:5173)

### 3️⃣ Seed Database
```bash
npm run seed
```

This creates:
- ✅ 2 demo users (Manager & Staff)
- ✅ 6 products
- ✅ 3 warehouses
- ✅ Sample receipts, deliveries, transfers, and adjustments

### 4️⃣ Start Server
```bash
npm run dev
```

Server runs on: **http://localhost:5000**

---

## 🧪 Quick Test

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Login as Manager
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@stockmaster.com","password":"demo123"}'
```

### Get Products (use token from login)
```bash
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 👥 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Manager** | demo@stockmaster.com | demo123 |
| **Staff** | staff@stockmaster.com | staff123 |

---

## 🔧 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection
- Verify `MONGODB_URI` in `.env` is correct

### Port Already in Use
- Change `PORT` in `.env` to another port (e.g., 5001)

### JWT Error
- Make sure `JWT_SECRET` is set in `.env`

---

## 📚 Next Steps

1. **Frontend Integration**: Update frontend API base URL to `http://localhost:5000/api`
2. **Documentation**: See `README.md` for complete API documentation
3. **Customize**: Modify models, add features, or adjust permissions

---

## 🎯 API Endpoints Summary

- **Auth**: `/api/auth/*` - Login, register, profile
- **Products**: `/api/products` - Product management
- **Warehouses**: `/api/warehouses` - Warehouse management
- **Receipts**: `/api/receipts` - Incoming stock
- **Deliveries**: `/api/deliveries` - Outgoing stock
- **Transfers**: `/api/transfers` - Inter-warehouse transfers
- **Adjustments**: `/api/adjustments` - Stock adjustments
- **History**: `/api/history` - Activity logs & stats

Full documentation: **README.md**
