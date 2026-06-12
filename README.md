# nodejs-voting-app

# 🗳️ Voting Application

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js) ![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey?logo=express) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%2FLocal-green?logo=mongodb) ![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens) ![License](https://img.shields.io/badge/License-MIT-blue)

A secure, role-based **REST API** for conducting digital elections built with **Node.js**, **Express.js**, and **MongoDB**. Voters authenticate using their government-issued **Aadhar card number**, cast a single vote, and can track live results in real time. A dedicated admin account manages candidates without the ability to vote, ensuring a clean separation of responsibilities.

---

## 🔍 Overview

This application simulates a real-world electronic voting system with the following constraints:

- Every registered voter has a **unique Aadhar card number** as their identity
- A voter can log in and cast **exactly one vote** — the system prevents double voting
- Anyone (even unauthenticated users) can view the candidate list and live vote counts
- There is **exactly one admin** in the system who manages candidates but is blocked from voting
- All sensitive operations are protected by **JWT-based authentication**

---

## ✅ Features

| Feature | Description |
|---------|-------------|
| 🔐 Aadhar-based Login | Users log in using their 12-digit Aadhar number + password |
| 🗳️ One-time Voting | Each voter can vote only once; enforced at the database level |
| 📊 Live Vote Counts | Candidates listed in real time, sorted by vote count (descending) |
| 🛡️ Role-based Access | Two roles: `voter` and `admin` with separate permissions |
| 👤 Profile Management | Voters can view their profile and change their password |
| 🧑‍💼 Admin Panel (API) | Admin can create, update, and delete candidates |
| 🚫 Admin Cannot Vote | Admin role is strictly blocked from casting votes |
| 🔒 Password Hashing | Passwords stored securely using bcrypt |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js v18+ |
| Framework | Express.js |
| Database | MongoDB with Mongoose ODM |
| Authentication | JSON Web Tokens (JWT) |
| Password Security | bcryptjs |
| Environment Config | dotenv |
| Dev Server | nodemon |

---

## 🏗️ System Architecture

```
Client (Postman / Frontend)
        │
        ▼
   Express Router
        │
        ├──► Auth Middleware (JWT Verification + Role Check)
        │
        ├──► Auth Routes        → /signup, /login
        ├──► User Routes        → /profile, /profile/password
        ├──► Vote Routes        → /candidates (GET), /vote/:id, /vote/count
        └──► Candidate Routes   → /candidates (POST/PUT/DELETE) [Admin only]
                │
                ▼
          MongoDB (Mongoose)
          ┌──────────────┐
          │  User Model  │
          │  Candidate   │
          │    Model     │
          └──────────────┘
```

**Request Lifecycle:**
1. Client sends request with `Authorization: Bearer <token>` header
2. Auth middleware verifies JWT and attaches user info to `req.user`
3. Role middleware checks if the user's role permits the action
4. Controller logic executes and responds with JSON

---

## 📁 Project Structure

```
voting-app/
│
├── models/
│   ├── User.js              # User schema: aadhar, password, role, isVoted
│   └── Candidate.js         # Candidate schema: name, party, voteCount
│
├── routes/
│   ├── authRoutes.js        # POST /signup, POST /login
│   ├── userRoutes.js        # GET /profile, PUT /profile/password
│   ├── voteRoutes.js        # GET /candidates, POST /vote/:id, GET /vote/count
│   └── candidateRoutes.js   # Admin CRUD for candidates
│
├── middleware/
│   ├── authMiddleware.js    # Verifies JWT token from Authorization header
│   └── roleMiddleware.js    # Checks user role (voter / admin)
│
├── .env                     # Environment variables (never commit this)
├── .gitignore
├── server.js                # Entry point — connects DB, mounts routes
└── package.json
```

---

## 🔐 Authentication & Authorization

This app uses **stateless JWT authentication**.

### How it works:

1. On successful login, the server signs a JWT using `JWT_SECRET` and returns it
2. The client stores the token and sends it with every protected request in the header:
   ```
   Authorization: Bearer <your_token_here>
   ```
3. The `authMiddleware` decodes and verifies the token on each request
4. The `roleMiddleware` checks `req.user.role` and blocks unauthorized access

### Role Permissions Summary:

| Action | Voter | Admin |
|--------|-------|-------|
| Signup / Login | ✅ | ✅ |
| View candidates | ✅ | ✅ |
| View vote counts | ✅ | ✅ |
| Cast a vote | ✅ | ❌ Blocked |
| View profile | ✅ | ❌ |
| Change password | ✅ | ❌ |
| Add candidate | ❌ | ✅ |
| Update candidate | ❌ | ✅ |
| Delete candidate | ❌ | ✅ |


---
## Conclusion:

This project successfully implements a secure digital voting system using Node.js, Express.js, and MongoDB. Key features like Aadhar-based authentication, one-time voting enforcement, live vote counts, and role-based access control for voters and admin were achieved using JWT, bcrypt, and Mongoose. The project provided practical experience in building RESTful APIs, handling authentication, and designing a real-world backend application from scratch.
