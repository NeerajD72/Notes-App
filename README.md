# 📝 Notes App

A full-stack notes application built with Node.js, Express, MongoDB, and EJS. Secure Google OAuth login, full CRUD functionality, search, and pagination — all completely free.

🔗 **Live App:** https://notes-app-pearl-zeta.vercel.app



## ✨ Features

- 🔐 Google OAuth 2.0 login — no passwords needed
- 📝 Create, edit, and delete notes
- 🔍 Full-text search across all notes
- 📄 Pagination — 12 notes per page
- 🔄 JWT access + refresh token authentication
- 📱 Fully responsive — works on mobile, tablet, desktop
- ⚡ Fast server-rendered pages with EJS
- 🛡️ Rate limiting, secure httpOnly cookies



## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Templating | EJS + express-ejs-layouts |
| Auth | Google OAuth 2.0 + JWT |
| Styling | Bootstrap 5 + Custom CSS |
| Logging | Winston |
| Deployment | Vercel |



## 📁 Project Structure
Notes-App/
├── config/
│   ├── db.js               # MongoDB connection
│   └── logger.js           # Winston logger
├── controller/
│   ├── authcontroller.js   # Google OAuth logic
│   ├── dashBoardController.js
│   └── maiControlleer.js   # Public pages
├── middleware/
│   ├── RequireAuth.js      # JWT auth + refresh
│   └── setUser.js          # Passive auth for public pages
├── model/
│   ├── user.js
│   ├── notes.js
│   └── blacklisttoken.js
├── routes/
│   ├── index.js
│   ├── dashboard.js
│   └── authroutes.js
├── lib/
│   ├── tokens.js
│   ├── hash.js
│   └── asyncHandler.js
├── views/
│   ├── layouts/
│   ├── partials/
│   └── dashboard/
├── public/
│   ├── css/
│   └── image/
├── app.js
├── server.js
└── vercel.json



## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Google Cloud Console account

### Installation
bash
# Clone the repo
git clone https://github.com/NeerajD72/Notes-App.git
cd Notes-App

# Install dependencies
npm install


### Environment Variables

Create a `.env` file in the root:
env
PORT=3000
MONGODB_URI=mongodb+srv://...

JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d

GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

NODE_ENV=development


### Run Locally
bash
npm start
# or
nodemon server.js


Open **http://localhost:3000**



## 🔐 Authentication Flow
User clicks Sign In
→ Redirected to Google
→ Google sends back code
→ App exchanges code for tokens
→ User created/found in DB
→ JWT access token (15min) + refresh token (30days) set as httpOnly cookies
→ Redirected to Dashboard

- **Access token expires** → refresh token used to generate new one silently
- **Refresh token expires** → user redirected to login
- **Logout** → token blacklisted in DB



## 📦 Deployment

Deployed on **Vercel** with `vercel.json` config.

### Environment Variables on Vercel

Set all `.env` variables in:
Vercel Dashboard → Settings → Environment Variables

### Google OAuth on Production

Add this to Google Cloud Console → Authorized Redirect URIs:https://your-app.vercel.app/auth/google/callback

## 👨‍💻 Developer

**Neeraj Kumar** 

- 🔗 [LinkedIn](https://www.linkedin.com/in/neeraj-kumar-b82a78324/)
- 💻 [GitHub](https://github.com/NeerajD72)

