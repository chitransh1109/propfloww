# PropFloww

A full-stack real estate platform where property owners can list properties and buyers can browse, search, and save listings. Built as an end-to-end personal project covering authentication, role-based access, image uploads, and a complete buyer/owner dashboard experience.

**Live demo:** _[add your deployed link here once live]_

---

## Features

- **JWT authentication** with email-based OTP verification
- **Role-based access** — users can act as a buyer or a property owner, and switch between roles, with different dashboard views and permissions for each
- **Property CRUD** — owners can create, edit, and delete listings with image uploads
- **Property browsing & search** — buyers can browse and filter available listings
- **Saved/favorited properties** for buyers
- **Image uploads** via Multer
- **Protected routes** on the frontend, enforced both client-side and via backend middleware
- **Responsive React UI** with a custom dark/gold themed design system (styled-components)

## Tech Stack

**Frontend:** React 19, Vite, React Router, styled-components, Axios
**Backend:** Node.js, Express 5, MongoDB with Mongoose, JWT, Multer, Nodemailer
**Auth:** JSON Web Tokens + bcrypt password hashing + email OTP verification

## Project Structure

```
propfloww/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── pages/          # Landing, Dashboard, PropertiesListing, PropertyDetail, Login, Settings
│       ├── components/     # Layout, Sidebar, ProtectedRoutes
│       ├── context/        # AuthContext
│       └── api/            # Axios instance/config
└── server/                 # Express + MongoDB backend
    └── src/
        ├── controllers/    # authController, propertyController
        ├── models/         # User, Property, OTP
        ├── routes/         # authRoutes, propertyRoutes, UploadRoutes
        ├── middleware/      # authMiddleware (JWT protect), errorMiddleware
        └── utils/          # generateToken
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- A MongoDB instance (local or MongoDB Atlas)
- An email account/app password for OTP emails (e.g. Gmail with an App Password)

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd propfloww
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env
# fill in your MongoDB URI, JWT secret, and email credentials in .env
npm run dev
```
The server runs on `http://localhost:8002` by default (configurable via `PORT` in `.env`).

### 3. Frontend setup
```bash
cd client
npm install
npm run dev
```
The frontend runs on Vite's default dev server (typically `http://localhost:5173`).

### Environment Variables
See `server/.env.example` for the full list. You'll need:

| Variable | Description |
|---|---|
| `PORT` | Port the Express server runs on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `NODE_ENV` | `development` or `production` |
| `EMAIL_USER` | Email address used to send OTP emails |
| `EMAIL_PASS` | App password for the email account |

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in and receive a JWT |
| `POST` | `/api/auth/send-otp` | Send an email OTP for verification |
| `POST` | `/api/auth/verify-otp` | Verify an email OTP |
| `GET` | `/api/auth/profile` | Get the logged-in user's profile (protected) |
| `POST` / `PUT` | `/api/auth/save/:id` | Save/unsave a property to the buyer's favorites (protected) |
| `POST` / `PUT` | `/api/auth/switch-role` | Switch between buyer and owner roles (protected) |
| `GET` | `/api/properties` | List/browse properties |
| `POST` | `/api/properties` | Create a property listing (owner only) |
| `PUT` | `/api/properties/:id` | Update a listing (owner only) |
| `DELETE` | `/api/properties/:id` | Delete a listing (owner only) |
| `POST` | `/api/upload` | Upload a property image |

_(See `server/src/routes/` for the complete, up-to-date route definitions.)_

## Notes

- `socket.io` / `socket.io-client` remain as dependencies from an earlier real-time notifications feature that was since removed from the codebase; they're not currently wired into the server and can be removed from `package.json` if not reintroduced.
- Property images are currently stored on local disk via Multer for development. See the project roadmap below for the cloud storage migration plan.

## Roadmap

- [ ] Migrate image uploads from local disk to Cloudinary/S3
- [ ] Map-based property search using stored lat/long
- [ ] Saved search alerts via scheduled background jobs
- [ ] Owner analytics dashboard
- [ ] Automated tests (Jest/Supertest) + CI

## License

MIT
