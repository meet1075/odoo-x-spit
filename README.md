<h1 align="center">🚀 StockMaster — Full‑Stack Inventory Management</h1>

<p align="center">A role-aware inventory platform pairing a secure Express / MongoDB backend with a responsive React + Tailwind frontend. Managers orchestrate products & warehouses; staff focus on task execution through streamlined workflows.</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-stable-success" alt="status" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="license" />
  <img src="https://img.shields.io/badge/node-%3E=_18-brightgreen?logo=node.js&logoColor=white" alt="node" />
  <img src="https://img.shields.io/badge/mongodb-%3E=_6-47A248?logo=mongodb&logoColor=white" alt="mongodb" />
  <img src="https://img.shields.io/badge/react-18-61DBFB?logo=react&logoColor=black" alt="react" />
  <img src="https://img.shields.io/badge/tailwind-css-06B6D4?logo=tailwind-css&logoColor=white" alt="tailwind" />
</p>

---

## ✨ Quick Links

* *Live (local)*: http://localhost:5173 (frontend) + http://localhost:5000 (backend)
* *Server entry*: backend/src/server.js
* *API docs / health*: GET /api/health

---

## 🧑‍🤝‍🧑 Team

<table>
  <tr>
    <td align="center"><strong>Team Lead</strong></td>
    <td align="center"><strong>Team Members</strong></td>
  </tr>
  <tr>
    <td align="center">Vrund Patel</td>
    <td align="center">Hemil Hansora · Kaustav Das · Meet Soni</td>
  </tr>
</table>

---

## ✨ Features

* *Authentication & RBAC* – JWT auth with granular permissions defined in backend/src/config/constants.js and enforced via backend/src/middleware/auth.js.
* *Inventory Ops* – Products, receipts, deliveries, transfers, adjustments, history.
* *Multi‑Warehouse Insights* – Warehouse CRUD + capacity tracking.
* *Auditable History* – Time‑ordered timeline (backend/src/models/History.js) + frontend visualization.
* *Task‑Focused UI* – Manager & Staff dashboards with guided workflows.
* *Demo Data* – LocalStorage seeding/reset via frontend/src/utils/storage.js and Settings UI.

---

## 🎨 Visual / UI in README

To make the README more UI-friendly and scannable:

* Each major section above is framed with a clear header and a short one-line summary.
* Important hints and quick commands are shown in inline code blocks for copy-paste.
* The Tech Stack section below displays compact logos using shields.io badges and small images for fast visual recognition.
* Use of <details> blocks to hide longer code snippets and keep the file lean.

---

## 🗂 Project Layout


odoo-x-spit/
├── backend/            # Express API, MongoDB models, seed scripts
│   ├── src/
│   │   ├── config/     # DB connection, constants
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── QUICKSTART.md
│   └── README.md
├── frontend/           # React 18 + Vite client
│   ├── src/
│   │   ├── components/ # Layout, Modal, ProtectedRoute, etc.
│   │   ├── context/    # Auth & Data providers
│   │   ├── pages/      # Dashboard, Receipts, Deliveries, ...
│   │   ├── services/   # API wrappers
│   │   └── utils/
│   ├── README.md
│   └── RESET_DATA.md
└── README.md           # (this file)


---

## 🧰 Tech Stack

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" alt="node" height="24"/>
  <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" alt="express" height="24"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" alt="mongodb" height="24"/>
  <img src="https://img.shields.io/badge/React-61DBFB?logo=react&logoColor=black" alt="react" height="24"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" alt="vite" height="24"/>
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwind-css&logoColor=white" alt="tailwind" height="24"/>
  <img src="https://img.shields.io/badge/JWT-000000?logo=JSON%20web%20tokens&logoColor=white" alt="jwt" height="24"/>
  <img src="https://img.shields.io/badge/Bcrypt-4285F4?logo=bcrypt&logoColor=white" alt="bcrypt" height="24"/>
</p>

> Tip: badges above are shields.io images — swap or add more by editing the markdown image URLs.

---

## 🚀 Getting Started

### Prerequisites

* Node.js ≥ 18
* MongoDB ≥ 6 (local or Atlas)

### Backend Setup

<details>
<summary>Quick commands</summary>

bash
cd backend
npm install
cp .env.example .env   # then edit .env with DB + JWT secrets
npm run seed            # seed demo data
npm run dev             # start server (default http://localhost:5000)


</details>

### Frontend Setup

bash
cd frontend
npm install
npm run dev             # Vite dev server (default http://localhost:5173)
# If backend on different host: update frontend/src/services/api.js base URL


---

## 🔑 Demo Credentials

| Role    | Email                   | Password   |
| ------- | ----------------------- | ---------- |
| Manager | demo@stockmaster.com  | demo123  |
| Staff   | staff@stockmaster.com | staff123 |

Authentication flows handled via frontend/src/context/AuthContext.jsx and backend/src/controllers/authController.js.

---

## 🧭 Core Workflows

| Flow               | UI Page                              | API Highlights                           |
| ------------------ | ------------------------------------ | ---------------------------------------- |
| Receive goods      | frontend/src/pages/Receipts.jsx    | backend/src/routes/receiptRoutes.js    |
| Deliver orders     | frontend/src/pages/Deliveries.jsx  | backend/src/routes/deliveryRoutes.js   |
| Internal transfers | frontend/src/pages/Transfers.jsx   | backend/src/routes/transferRoutes.js   |
| Stock adjustments  | frontend/src/pages/Adjustments.jsx | backend/src/routes/adjustmentRoutes.js |
| Move history       | frontend/src/pages/History.jsx     | backend/src/routes/historyRoutes.js    |

---

## 🛡 Security & Validation

* JWT protection with role authorization middleware.
* Input validation via backend/src/middleware/validation.js.
* Helmet, CORS, compression, and rate limiting configured in backend/src/server.js.

---

## 🧪 Testing & Utilities

* Health check: GET /api/health
* History dashboards: GET /api/history/dashboard/stats
* API examples documented in backend/README.md and quick snippets in backend/QUICKSTART.md.

---

## 🤝 Contributing

1. Fork repo & create a branch.
2. Ensure linting/tests pass.
3. Submit PR describing changes & affected modules.

> Suggested PR checklist: lint, unit tests (if any), manual smoke test for core flows.

---

## 📄 License

MIT. See repository headers for details.

---

<footer>
  <p align="center">Made with ❤ by the StockMaster Team — lead: <strong>Vrund Patel</strong></p>
</footer>
