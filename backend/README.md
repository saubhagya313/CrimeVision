# 🛡️ CrimeVision Backend API (Node.js, Express & MongoDB)

A dedicated, modular REST API backend for the CrimeVision Cybercrime Investigation & Forensics platform.

---

## 📁 Directory Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB Mongoose connection handler
├── controllers/
│   ├── authController.js     # User registration, login, and profile management
│   ├── caseController.js     # Case creation, search, status, and filtering
│   ├── evidenceController.js # File uploads, SHA-256 integrity hashing & entity extraction
│   ├── analysisController.js # Forensic IOC extractor & Python AI FastAPI bridge
│   ├── timelineController.js # Chronological sequence tracking
│   ├── reportController.js   # Automated court-ready report generation
│   ├── statsController.js    # Executive dashboard KPIs and alerts
│   └── auditController.js    # Chain of custody & forensic action auditing
├── middleware/
│   ├── authMiddleware.js     # JWT Bearer token authentication & role checks
│   ├── uploadMiddleware.js   # Multer file storage config for evidence
│   └── errorMiddleware.js    # Centralized HTTP error handler
├── models/
│   ├── User.js               # Mongoose schema for investigators (bcrypt hashed)
│   ├── Case.js               # Mongoose schema for cybercrime cases
│   ├── Evidence.js           # Mongoose schema for evidence & extracted IOCs
│   ├── TimelineEvent.js      # Mongoose schema for crime timeline events
│   ├── Report.js             # Mongoose schema for court reports
│   └── AuditLog.js           # Mongoose schema for immutable audit trails
├── routes/
│   ├── authRoutes.js         # /api/auth
│   ├── caseRoutes.js         # /api/cases
│   ├── evidenceRoutes.js     # /api/evidence
│   ├── analysisRoutes.js     # /api/analysis
│   ├── timelineRoutes.js     # /api/timeline
│   ├── reportRoutes.js       # /api/reports
│   ├── statsRoutes.js        # /api/stats
│   └── auditRoutes.js        # /api/audit-logs
├── utils/
│   ├── iocExtractor.js       # Pattern regex for UPI VPAs, phone numbers, URLs, amounts
│   └── seeder.js             # Database pre-population script
├── uploads/                  # Ingested evidence file attachments
├── .env.example              # Environment variables template
├── .env                      # Local environment configuration
├── package.json              # Express dependencies and scripts
└── server.js                 # Main server entry point
```

---

## ⚙️ Setup & Quickstart

### 1. Install Node Dependencies
Open your terminal inside the `backend` folder:
```bash
cd backend
npm install
```

### 2. Configure MongoDB Atlas
Open [`backend/.env`](file:///c:/Users/saubh/OneDrive/Documents/project_folder/backend/.env) and replace `<username>` and `<password>` with your Atlas database credentials:

```env
PORT=5000
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/crimevision?retryWrites=true&w=majority
JWT_SECRET=crimevision_secret_jwt_key_super_secure_2026
JWT_EXPIRES_IN=7d
AI_SERVICE_URL=http://localhost:8000
```

> **Atlas Tip:** Ensure your IP address is allowed in **Network Access** (`0.0.0.0/0` or your current IP) in your MongoDB Atlas dashboard.

### 3. (Optional) Seed Sample Cases & Evidence
To populate your MongoDB Atlas cluster with demo cases, evidence, and an investigator account:
```bash
npm run seed
```
**Demo Login Credentials:**
- **Email:** `officer@cybercrime.gov.in`
- **Password:** `Password@123`

### 4. Start the Backend Server
```bash
npm run dev
```
Server runs at: `http://localhost:5000`

---

## 📡 REST API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new investigator | No |
| `POST` | `/api/auth/login` | Login and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | Yes (Bearer Token) |
| `PUT` | `/api/auth/profile` | Update profile information | Yes |
| `GET` | `/api/cases` | List cases with search & filters | Yes |
| `POST` | `/api/cases` | Create new cybercrime case | Yes |
| `GET` | `/api/cases/:id` | Get case details and linked evidence | Yes |
| `PUT` | `/api/cases/:id` | Update case status or priority | Yes |
| `DELETE` | `/api/cases/:id` | Delete case and linked items | Yes |
| `GET` | `/api/evidence` | List evidence items | Yes |
| `POST` | `/api/evidence/upload` | Ingest file / text, compute SHA-256 hash | Yes (Multer) |
| `GET` | `/api/evidence/:id` | Get evidence details and IOCs | Yes |
| `POST` | `/api/analysis/scan` | Run AI threat classification on text | Yes |
| `GET` | `/api/timeline/:caseId`| Chronological crime sequence | Yes |
| `POST` | `/api/timeline` | Add timeline event | Yes |
| `GET` | `/api/reports` | List generated forensic reports | Yes |
| `POST` | `/api/reports/generate`| Generate court-ready report | Yes |
| `GET` | `/api/stats/dashboard` | Dashboard KPIs & charts data | Yes |
| `GET` | `/api/audit-logs` | Query chain of custody audit trail | Yes (Lead/Admin) |
| `GET` | `/api/health` | Backend service health check | No |

---

## 🔒 Forensic Features Included
1. **Cryptographic Evidence Hashing**: Every ingested file or text artifact receives an automatic **SHA-256 hash** for tamper-proof courtroom evidence chain of custody.
2. **Automated IOC Extraction**: RegEx pattern parsing for Indian mobile numbers, UPI VPAs (`@okhdfcbank`, `@paytm`, `@ybl`), crypto wallets, and phishing URLs.
3. **Python AI Bridge**: Seamless fallback between the standalone Python FastAPI model and built-in heuristic NLP inference.
4. **Audit Logging**: Every investigator action (case creation, analysis, report generation) is recorded into immutable audit logs.
