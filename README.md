# TaskMaster Pro — Premium MERN SaaS Boilerplate

TaskMaster Pro is a production-ready, full-stack MERN (MongoDB, Express, React, Node.js) application boilerplate. It features a high-end SaaS UI/UX design, robust security protocols, and a comprehensive user management system.

## ✨ Features

### 🔐 Security & Authentication
- **JWT-Based Auth**: Secure authentication flow with main and temporary tokens.
- **Two-Factor Authentication (2FA)**: TOTP-based 2FA using `Speakeasy` and `QRCode` generation.
- **Request Validation**: Centralized input validation using `Joi` schemas.
- **Password Security**: Password hashing with `Bcrypt` and secure password recovery flow via `Crypto` tokens.
- **Security Middlewares**: Implementation of `Helmet`, `CORS`, `Rate-Limiting`, and `Cookie-Parser`.

### 📧 User Management & Services
- **Profile Management**: Update user profile, change password, and secure account deletion.
- **Email Service**: Automated transactional emails (Welcome, Password Reset) using `Nodemailer`.
- **Global Error Handling**: Centralized `appError` and `asyncHandler` logic for clean, consistent API responses.
- **Logging**: System-wide event logging with `Winston`.

### 🎨 Frontend UI/UX
- **Premium Design**: Modern, light-themed SaaS dashboard inspired by top products like Linear and Stripe.
- **Responsive Layout**: Fully responsive split-screen authentication and sidebar-based dashboard.
- **Real-time Feedback**: Interactive loaders, toast-style messages, and hover-state micro-interactions.
- **Tech Stack**: Built with `React 19`, `Vite`, `Tailwind CSS v4`, `Lucide React`, and `Axios`.

---

## 📂 Project Structure

```text
NewApp/
├── client/                # React Frontend
│   ├── src/
│   │   ├── api/          # Axios instance & API services
│   │   ├── pages/        # Dashboard, Login, Settings, Auth flows
│   │   └── App.jsx       # Router & Protected routes
│   └── vite.config.js    # Tailwind v4 configuration
└── server/                # Node.js Backend
    ├── src/
    │   ├── configs/      # DB & Nodemailer configurations
    │   ├── controllers/  # Auth & User logic
    │   ├── middlewares/  # Auth & Error middlewares
    │   ├── models/       # Mongoose Schemas (User)
    │   ├── services/     # Email service
    │   ├── template/     # HTML Email templates
    │   ├── utils/        # AppError, Response, Logger, AsyncHandler
    │   └── validators/   # Joi Validation schemas
    └── Dockerfile        # Production container config
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v20+)
- MongoDB (Running locally or on Atlas)
- SMTP Credentials (for emails - e.g., Mailtrap, Gmail, SendGrid)

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env # Fill in your MongoDB and SMTP credentials
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

---

## 📡 API Endpoints

### Auth & User
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Sign in & check 2FA status |
| POST | `/api/auth/logout` | Log out and clear session |
| GET | `/api/auth/me` | Get current user profile |
| PATCH | `/api/auth/update-profile` | Update user name |
| PATCH | `/api/auth/change-password` | Change existing password |
| DELETE | `/api/auth/delete-account` | Permanently delete account |

### 2FA & Password Reset
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/setup-2fa` | Generate 2FA QR code |
| POST | `/api/auth/verify-2fa` | Activate 2FA with OTP |
| POST | `/api/auth/disable-2fa` | Disable 2FA with OTP |
| POST | `/api/auth/login/verify-2fa` | Step 2 of 2FA Login |
| POST | `/api/auth/forgot-password` | Send reset link via email |
| POST | `/api/auth/reset-password/:token` | Reset password using token |

---

## 🛠 Deployment

For a step-by-step walkthrough on deploying to **Render**, **Vercel**, or **Docker**, please refer to our detailed **[Deployment Guide (DEPLOYMENT.md)](./DEPLOYMENT.md)**.

### Quick Build
- **Frontend**: Run `npm run build` in `client/`.
- **Backend**: Ensure `NODE_ENV=production` is set on your server.

---

## 📝 License
This project is licensed under the ISC License.
# DekNek
