# Online Voting System – Backend

A secure and scalable voting application backend built with **Node.js**, **Express.js**, and **MongoDB**.

## Features

- **JWT Authentication** with email verification
- **Role-Based Access Control (RBAC)**
- **Rate limiting** and protected routes
- **Election management** with time-based lifecycle
- **Vote integrity**: one user → one vote per election
- **Party and candidate tracking**
- **RESTful API** with clean architecture

## Tech Stack

**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose  
**Auth:** JWT  
**Email:** Nodemailer  
**Security:** Rate limiting, RBAC

## Project Structure

```
backend/
├── controllers/
├── routes/
├── models/
├── services/
├── middlewares/
├── utils/
├── config/
└── app.js
```

## Quick Start

```bash
# Clone repository
git clone https://github.com/your-username/online-voting-backend.git
cd online-voting-backend

# Install dependencies
npm install

# Create .env file (see below)

# Run development server
npm run dev
```

Server runs at `http://localhost:5000`

## Environment Variables

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

AUTH_JWT_SECRET=your_auth_secret
AUTH_JWT_EXPIRES_IN=1d

EMAIL_VERIFY_JWT_SECRET=your_email_verify_secret
EMAIL_VERIFY_EXPIRES_IN=15m

EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM="Online Voting <your_email@gmail.com>"

FRONTEND_URL=http://localhost:3000
```

## API Endpoints

**Authentication**
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/user/resend-email`

**Election & Voting**
- `POST /api/v1/election/create`
- `POST /api/v1/candidate/register`
- `POST /api/v1/vote/:candidateId`

**Data Retrieval**
- `GET /api/v1/party`
- `GET /api/v1/candidate/votes`

## Key Learnings

- Secure JWT authentication
- MongoDB relational data modeling
- Business logic enforcement
- API security with middleware
- Scalable backend architecture

## License

MIT License

---
