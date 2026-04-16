# 🛡️ SecureWealth Twin

> AI-powered wealth management platform with real-time cyber-risk fraud detection.

**SecureWealth Twin** is a full-stack fintech application that pairs intelligent wealth planning with a built-in cyber-risk scoring engine. Every financial action — whether it's a transfer, investment, or withdrawal — is evaluated for fraud risk in real time, producing an explainable decision (`allow`, `warn`, or `block`) before execution.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔍 **Cyber-Risk Scoring Engine** | Rule-based fraud detection that evaluates every financial action |
| 🧠 **Explainable Decisions** | Returns human-readable reasons for every risk assessment |
| 💰 **Wealth Analysis** | Analyses income vs expenses and provides savings advice |
| 📊 **Goal-Based Planner** | Simulates compound growth to check if investment goals are achievable |
| 🏦 **Investment Simulator** | Simulates investments with integrated fraud gating |
| 🔐 **JWT Authentication** | Secure user registration and login with bcrypt + JWT |
| 📋 **Audit Trail** | Full logging of every risk event (in-memory + persistent file) |
| 🖥️ **React Dashboard** | Modern UI with routing, React Query, and real-time data |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.13 · FastAPI · Pydantic v2 · Uvicorn |
| **Frontend** | React 18 · TypeScript · Vite · React Router · React Query |
| **Auth** | JWT (python-jose) · bcrypt (passlib) |
| **Data** | In-memory stores (hackathon-ready, swappable to DB) |

---

## 📁 Project Structure

```
securewealth-backend/
│
├── main.py                          # FastAPI app entry point
│
├── routes/
│   ├── risk.py                      # POST /risk-check, POST /wealth-action, GET /risk-logs
│   ├── user_routes.py               # POST /register, POST /login, GET /users
│   ├── transaction_routes.py        # POST /transaction-check, POST /simulate-investment
│   ├── wealth_routes.py             # GET  /wealth-analysis
│   ├── goal_routes.py               # POST /goal-simulation
│   └── audit_routes.py              # GET  /audit-logs
│
├── services/
│   ├── risk_engine.py               # Cyber-risk scoring engine (core)
│   ├── fraud_engine.py              # Legacy fraud checker
│   ├── wealth_engine.py             # Income vs expense analyser
│   ├── goal_engine.py               # Compound growth simulator
│   ├── auth_service.py              # JWT + bcrypt auth
│   └── audit_logger.py              # In-memory audit log
│
├── models/
│   ├── schemas.py                   # Pydantic request/response schemas
│   └── user_model.py                # User data model
│
├── utils/
│   └── logger.py                    # Thread-safe risk event logger
│
├── frontend/                        # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/                   # Dashboard, WealthAnalysis, WealthPlanner, SecurityAuditLogs
│   │   ├── components/              # Layout
│   │   ├── api/                     # React Query hooks
│   │   └── App.tsx                  # Router setup
│   └── package.json
│
├── requirements.txt                 # Python dependencies
└── .gitignore                       # Python + Node + Vite
```

---

## 🔐 Risk Engine — How It Works

The cyber-risk scoring engine evaluates every financial action against 4 fraud indicators:

| Indicator | Risk Points | Explanation |
|-----------|:-----------:|-------------|
| New / unrecognised device | **+20** | Device fingerprint mismatch |
| Amount > ₹1,00,000 | **+30** | Unusually large transaction |
| OTP retries > 2 | **+15** | Suspicious authentication pattern |
| Fast / automated action | **+10** | Bot-like behaviour detected |

### Decision Thresholds

| Score | Decision | Action Taken |
|:-----:|:--------:|--------------|
| 0 – 30 | ✅ **allow** | Transaction proceeds normally |
| 31 – 60 | ⚠️ **warn** | User gets a caution message |
| > 60 | 🚫 **block** | Transaction is rejected |

### Explainability

Every response includes a `reasons` array with plain-English explanations:

```json
{
  "risk_score": 75,
  "decision": "block",
  "reasons": [
    "New device detected",
    "High transaction amount (₹5,00,000.00)",
    "Multiple OTP retries (5 attempts)",
    "Unusually fast action — possible automation"
  ]
}
```

---

## 🚀 API Endpoints

### Risk Engine (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/risk-check` | Evaluate fraud risk for any action |
| `POST` | `/wealth-action` | Execute a financial action with risk gating |
| `GET` | `/risk-logs` | Retrieve risk event audit trail |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login and receive JWT token |

### Wealth Management (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/wealth-analysis` | Analyse income vs expenses |
| `POST` | `/simulate-investment` | Simulate investment with fraud check |
| `POST` | `/goal-simulation` | Goal-based wealth planning |
| `GET` | `/audit-logs` | View all audit log entries |

---

## 📡 Example API Calls

### Risk Check

```bash
curl -X POST http://localhost:8000/risk-check \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user001",
    "amount": 500000,
    "is_new_device": true,
    "otp_retries": 5,
    "fast_action": true
  }'
```

**Response:**
```json
{
  "risk_score": 75,
  "decision": "block",
  "reasons": [
    "New device detected",
    "High transaction amount (₹5,00,000.00)",
    "Multiple OTP retries (5 attempts)",
    "Unusually fast action — possible automation"
  ]
}
```

### Wealth Action (Risk-Gated)

```bash
curl -X POST http://localhost:8000/wealth-action \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user001",
    "action_type": "transfer",
    "amount": 10000,
    "is_new_device": false,
    "otp_retries": 0,
    "fast_action": false
  }'
```

**Response:**
```json
{
  "user_id": "user001",
  "action_type": "transfer",
  "amount": 10000.0,
  "risk_score": 0,
  "decision": "allow",
  "reasons": [],
  "status": "success",
  "message": "✅ Action APPROVED — risk score 0/100. Transfer of ₹10,000.00 simulated successfully."
}
```

---

## 🖥️ Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/securewealth-twin.git
cd securewealth-twin
```

### 2. Start the Backend

```bash
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**
Swagger docs at: **http://localhost:8000/docs**

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 📸 Interactive Docs

Once the backend is running, visit **http://localhost:8000/docs** to access the auto-generated Swagger UI where you can test all endpoints interactively.

---

## 🗺️ Roadmap

- [ ] Persistent database (PostgreSQL / MongoDB)
- [ ] ML-based anomaly detection model
- [ ] Real-time WebSocket alerts
- [ ] Device fingerprint integration
- [ ] Rate limiting and IP-based rules
- [ ] Admin dashboard for risk configuration

---

## 📄 License

This project is built for educational and hackathon purposes.

---

<p align="center">
  Built with ❤️ using <strong>FastAPI</strong> + <strong>React</strong> + <strong>Vite</strong>
</p>
