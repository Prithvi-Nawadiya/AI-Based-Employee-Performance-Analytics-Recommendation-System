<<<<<<< HEAD
# AI-Based-Employee-Performance-Analytics-Recommendation-System
=======
# 🚀 EmpAnalytica — AI-Based Employee Performance Analytics System

> **AI308B ESE Project | B.Tech 4th Semester | Even Semester 2025-26**

A full-stack **MERN** application that analyzes employee performance and provides **AI-powered recommendations** using OpenRouter API.

---

## 📁 Project Structure

```
ESE/
├── backend/                  # Node.js + Express API
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect
│   │   └── errorHandler.js   # Global errors
│   ├── models/
│   │   ├── User.js           # HR/Admin schema
│   │   └── Employee.js       # Employee schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── aiRoutes.js
│   ├── .env                  # ⚠️ Fill in your credentials
│   └── server.js
│
└── frontend/                 # React + Vite
    └── src/
        ├── components/       # Reusable components
        ├── context/          # AuthContext
        ├── pages/            # Full pages
        └── utils/            # Axios instance
```

---

## ⚙️ Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Edit `.env`:
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/employee_analytics
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_key
PORT=5000
```

```bash
npm run dev     # Start with nodemon
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev     # Starts on http://localhost:5173
```

---

## 🔌 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register HR/Admin |
| POST | `/api/auth/login` | Login & get JWT |
| GET  | `/api/auth/me` | Current user (protected) |

### Employees
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/employees` | Add employee |
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/search?department=Development` | Search/filter |
| GET | `/api/employees/:id` | Get by ID |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

### AI
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/ai/recommend` | AI recommendation |
| POST | `/api/ai/rank` | Rank all employees |
| POST | `/api/ai/training` | Training suggestions |
| POST | `/api/ai/department-analysis` | Department analysis |

---

## ✨ Features

- 🔐 **JWT Authentication** with bcrypt password hashing
- 👥 **Employee CRUD** with validation
- 🔍 **Search & Filter** by name, department, score range
- 🤖 **AI Recommendations** via OpenRouter (GPT-3.5-turbo)
- 🏆 **Employee Rankings** with podium display
- 📚 **Training Plans** with career roadmaps
- 🏢 **Department Analytics** with insights
- 📊 **Dashboard** with live stats

---

## 🚀 Deployment

- **Backend**: Render Web Service
- **Frontend**: Render Static Site  
- **Database**: MongoDB Atlas

---

## 📝 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| AI | OpenRouter API |
| HTTP | Axios |
| Routing | React Router v6 |
>>>>>>> f835610 (Initial commit: Full-stack MERN AI Employee Analytics System)
