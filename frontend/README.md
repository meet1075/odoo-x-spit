# 🏭 StockMaster - Inventory Management System

A modern, full-featured Inventory Management System built with **React 18**, **Vite**, **Tailwind CSS**, and **ES6+**. StockMaster digitizes and streamlines all stock-related operations, replacing manual registers and Excel sheets with a centralized, real-time application.

![React](https://img.shields.io/badge/React-18.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Features

### Core Functionality
- ✅ **Product Management** - Create, update, and track products with SKU, categories, and stock levels
- ✅ **Receipts (Incoming Stock)** - Manage vendor deliveries with automated stock increases
- ✅ **Delivery Orders** - Pick, pack, and ship to customers with stock decreases
- ✅ **Internal Transfers** - Move stock between warehouses and locations
- ✅ **Stock Adjustments** - Fix discrepancies and log physical counts
- ✅ **Move History** - Complete audit trail of all inventory operations
- ✅ **Multi-Warehouse Support** - Manage multiple locations simultaneously

### Dashboard & Analytics
- 📊 Real-time KPI cards showing:
  - Total Products in Stock
  - Low Stock / Out of Stock Items
  - Pending Receipts
  - Pending Deliveries
  - Internal Transfers Scheduled
- 🔍 Dynamic filters by document type, status, warehouse, and category
- ⚠️ Low stock alerts with automated notifications
- 📈 Recent operations timeline

### User Experience
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔐 Secure authentication system (login/signup)
- 👤 **Role-Based Access Control (RBAC)**
  - **Managers:** Full admin access, all CRUD operations, warehouse management
  - **Staff:** Task-focused dashboard, operational access only
  - Separate dashboards and permissions per role
- 📱 Mobile-friendly design
- 💾 Local storage persistence
- ⚡ Fast performance with Vite

> 🔐 **NEW:** Comprehensive RBAC system! See [RBAC_GUIDE.md](RBAC_GUIDE.md) for details.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn installed

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Open browser:**
Navigate to `http://localhost:3000`

### Demo Login Credentials

**👨‍💼 Manager Account** (Full Access)
- **Email:** demo@stockmaster.com
- **Password:** demo123
- **Features:** Full admin access, all CRUD operations

**🧑‍🏭 Staff Account** (Task-Focused)
- **Email:** staff@stockmaster.com
- **Password:** staff123
- **Features:** Operational tasks only (receive, pick & pack, transfers)

> 📖 For detailed role information, see [RBAC_GUIDE.md](RBAC_GUIDE.md)

## 📁 Project Structure

```
stockmaster-ims/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout with sidebar
│   │   ├── Modal.jsx            # Reusable modal component
│   │   └── ProtectedRoute.jsx  # Route protection
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state
│   │   └── DataContext.jsx     # Inventory data management
│   ├── pages/
│   │   ├── Login.jsx           # Authentication page
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── Products.jsx        # Product management
│   │   ├── Receipts.jsx        # Incoming stock
│   │   ├── Deliveries.jsx      # Outgoing stock
│   │   ├── Transfers.jsx       # Internal transfers
│   │   ├── Adjustments.jsx     # Stock adjustments
│   │   ├── History.jsx         # Move history
│   │   └── Settings.jsx        # Settings & warehouses
│   ├── utils/
│   │   └── storage.js          # LocalStorage & demo data
│   ├── App.jsx                 # App router
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 💡 Usage Examples

### Example Flow: Receive Goods from Vendor

1. **Create Receipt**
   - Navigate to "Receipts"
   - Click "New Receipt"
   - Add supplier: "Steel Suppliers Inc."
   - Select product: "Steel Rods"
   - Enter quantity: 100 kg
   - Click "Create Receipt"

2. **Process Receipt**
   - Status: Draft → Waiting → Ready
   - Click "Validate" to confirm
   - ✅ Stock automatically increases by +100 kg

### Example Flow: Deliver to Customer

1. **Create Delivery Order**
   - Navigate to "Deliveries"
   - Click "New Delivery"
   - Add customer: "ABC Manufacturing"
   - Select products and quantities
   - Click "Create Delivery"

2. **Process Delivery**
   - Pick items (Draft → Waiting)
   - Pack items (Waiting → Ready)
   - Validate (Ready → Done)
   - ✅ Stock automatically decreases

### Example Flow: Internal Transfer

1. **Create Transfer**
   - Navigate to "Internal Transfers"
   - Select product: "Steel Rods"
   - Quantity: 50 kg
   - From: Main Warehouse → To: Production Floor
   - Click "Create Transfer"

2. **Complete Transfer**
   - Status: Draft → Waiting → Ready → Done
   - ✅ Location updated (total stock unchanged)

### Example Flow: Stock Adjustment

1. **Physical Count Mismatch**
   - Navigate to "Stock Adjustments"
   - Click "New Adjustment"
   - Select product: "Steel Rods"
   - Current stock: 53 kg
   - Counted quantity: 50 kg
   - Reason: "3 kg damaged"
   - Click "Create Adjustment"
   - ✅ Stock adjusted to 50 kg immediately

## 🎨 Technologies Used

- **React 18** - UI library with hooks and functional components
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS 3** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Lucide React** - Beautiful icon set
- **LocalStorage** - Client-side data persistence
- **ES6+** - Modern JavaScript features

## 📊 Demo Data

The application comes pre-loaded with demo data including:
- 8 sample products (Steel Rods, Office Chairs, Plastic Sheets, etc.)
- 3 receipt orders
- 3 delivery orders
- 2 internal transfers
- 2 stock adjustments
- 3 warehouse locations
- Complete operation history

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Target Users

- **Inventory Managers** - Manage incoming & outgoing stock, generate reports
- **Warehouse Staff** - Perform transfers, picking, shelving, and counting

## 📝 Key Concepts

### Document Status Flow
- **Draft** - Initial creation
- **Waiting** - Processing started
- **Ready** - Ready for completion
- **Done** - Completed (triggers stock changes)
- **Canceled** - Canceled operation

### Product Categories
- **Raw Materials** - Input materials for production
- **Finished Goods** - Completed products ready for sale
- **Consumables** - Items consumed during operations

### Stock Operations
1. **Receipts** - Stock +
2. **Deliveries** - Stock -
3. **Transfers** - Location change (stock unchanged)
4. **Adjustments** - Stock correction

## 🔐 Security Notes

This is a frontend demo application using LocalStorage. For production use:
- Implement backend API
- Add proper authentication (JWT, OAuth)
- Use database for data persistence
- Add input validation and sanitization
- Implement proper error handling
- Add user permissions and roles

## 🚀 Future Enhancements

- [ ] Backend API integration
- [ ] Real database (PostgreSQL/MongoDB)
- [ ] Barcode scanning support
- [ ] PDF report generation
- [ ] Email notifications
- [ ] Advanced analytics and charts
- [ ] Multi-currency support
- [ ] Batch operations
- [ ] CSV import/export
- [ ] Mobile app (React Native)

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Developer

Built with ❤️ using React, Vite, and Tailwind CSS

---

**Need Help?** Check the demo data or reset to defaults in Settings → Data Management
