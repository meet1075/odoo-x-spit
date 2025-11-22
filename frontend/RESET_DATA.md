# Reset Data Instructions

## The Problem
The app uses browser localStorage, so different data might be cached from previous sessions.

## The Solution
I've created a centralized `src/data/demoData.json` file that contains ALL the demo data. Both manager and staff will now see the exact same data.

## How to Reset and See the Same Data

### Method 1: Using the App (Recommended)
1. Open your browser and go to `http://localhost:5173` (or your dev server URL)
2. Login as **Manager**: `demo@stockmaster.com` / `demo123`
3. Click on **Settings** (gear icon in sidebar)
4. Scroll down to the "Data Management" section
5. Click **"Reset Demo Data"** button
6. Click it **again** to confirm (the page will reload automatically)
7. Now logout and login as **Staff**: `staff@stockmaster.com` / `staff123`
8. ✅ Both accounts now show identical data!

### Method 2: Clear Browser Storage Manually
1. Open browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **Local Storage** in the left sidebar
4. Click on your app's URL
5. Click **"Clear All"** button
6. Refresh the page (F5)
7. The app will automatically load fresh data from `demoData.json`

### Method 3: Using Browser Console
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Run this command:
```javascript
localStorage.clear(); location.reload();
```

## What Data You'll See

### Receipts (3 items - All need staff processing)
- **RCP-1000**: Steel Rods (100 kg) - Status: **Draft** → Staff needs to Mark Waiting
- **RCP-1001**: Office Chairs (30 units) - Status: **Waiting** → Staff needs to Mark Ready
- **RCP-1002**: Plastic Sheets (150 sheets) - Status: **Ready** → Staff needs to Validate

### Deliveries (3 items - All need staff processing)
- **DEL-2000**: Office Chairs to ABC Manufacturing - Status: **Draft** → Staff needs to Pick
- **DEL-2001**: Steel Rods & Wooden Planks to XYZ Corp - Status: **Waiting** → Staff needs to Pack
- **DEL-2002**: Computers to Tech Solutions - Status: **Ready** → Staff needs to Validate

### Transfers (2 items)
- **TRF-3000**: Steel Rods from Main Warehouse to Production - Status: **Waiting**
- **TRF-3001**: Plastic Sheets from Production to Main Warehouse - Status: **Ready**

### Products (6 items)
- Steel Rods, Office Chairs, Plastic Sheets, Wooden Planks, Desktop Computers, Cleaning Supplies

### Warehouses (3 items)
- Main Warehouse (NYC)
- Distribution Center East (Boston)
- Production Floor (Newark)

## Verification Checklist

After reset, verify both accounts see:

**Manager View** (`demo@stockmaster.com`):
- ✅ Can see all 3 receipts
- ✅ Can see all 3 deliveries
- ✅ Sees "Staff will process" in Actions column
- ✅ Cannot click workflow buttons
- ✅ Can create new receipts/deliveries

**Staff View** (`staff@stockmaster.com`):
- ✅ Can see all 3 receipts (same IDs as manager)
- ✅ Can see all 3 deliveries (same IDs as manager)
- ✅ Sees workflow buttons: Mark Waiting, Mark Ready, Validate, Cancel
- ✅ All tasks appear in Staff Dashboard
- ✅ Cannot create new receipts/deliveries

## Technical Details

- **Data Source**: `src/data/demoData.json` (single source of truth)
- **Storage**: Browser localStorage with `stockmaster_*` prefix
- **Key**: Data is shared across all users on the same browser
- **Reset Function**: Clears localStorage and reloads from JSON file
