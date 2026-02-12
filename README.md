# Backend Intern Assignment

##  Project Overview

This project is a scalable REST API built using **Node.js, Express, and MongoDB** with:

-  JWT Authentication
-  Role-Based Access Control (Admin/User)
-  CRUD operations for Tasks, Notes, and Products
-  Input validation
-  API Versioning (`/api/v1`)
-  Swagger API Documentation
-  Secure password hashing using bcrypt

A basic frontend is implemented to interact with all APIs including authentication, protected dashboard access, and CRUD operations.

---

# 🛠 Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Authentication:** JWT  
- **Password Hashing:** bcryptjs  
- **Validation:** express-validator  
- **Documentation:** Swagger (swagger-jsdoc + swagger-ui-express)  
- **Frontend:** (React )

---


# ⚙️ Installation & Setup

## 1️⃣ Clone the repository

```bash
git clone https://github.com/ArjunAk1234/BackendDevelopmentinternship.git
cd BackendDevelopmentinternship
```

## 2️⃣ Install dependencies

```bash
cd backend
npm install
cd ..
cd frontend-main
npm install
```

## 3️⃣ Create `.env` file

Create a `.env` file in the  backend folder :

```
PORT=3000
JWT_SECRET=your_super_secure_secret
MONGO_URI=mongodb://localhost:27017/intern_assignment
```
Create a `.env` file in the frontend folder :

```
VITE_API_URL=http://localhost:3000
```

## 4️⃣ Start the server in backend folder

```bash
node server.js
```

Server will run at:

```
http://localhost:3000
```

Swagger documentation available at:

```
http://localhost:3000/api-docs
```

## Run the frontend in frontend-main folder

```bash
cd frontend-main
npm run dev
```

---

# Authentication & Authorization

## JWT Authentication

- On login, the server returns a JWT token.
- Token must be sent in the header:

```
Authorization: Bearer <token>
```

- Token expires in 2 hours.

---

## Role-Based Access Control

### User Role:
- Create/view/update/delete own tasks
- Manage own notes
- View products

###  Admin Role:
- View all tasks
- Create/update/delete products
- Full system-level access

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login & receive JWT |

---

##  Tasks (Protected)

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/api/v1/tasks` | Get tasks (Admin: all, User: own) |
| POST | `/api/v1/tasks` | Create task |
| PUT | `/api/v1/tasks/:id` | Update task |
| DELETE | `/api/v1/tasks/:id` | Delete task |

Task status options:
- `pending`
- `in-progress`
- `completed`

---

## Notes (Protected)

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/api/v1/notes` | Get own notes |
| POST | `/api/v1/notes` | Create note |
| PUT | `/api/v1/notes/:id` | Update note |
| DELETE | `/api/v1/notes/:id` | Delete note |

---

## Products

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/api/v1/products` | View products |
| POST | `/api/v1/products` | Create product (Admin Only) |
| PUT | `/api/v1/products/:id` | Update product (Admin Only) |
| DELETE | `/api/v1/products/:id` | Delete product (Admin Only) |

---

# API Documentation

Swagger documentation available at:

```
http://localhost:3000/api-docs
```

Includes:
- Auth endpoints
- Task APIs
- Note APIs
- Product APIs
- JWT security scheme

---

#  Security Practices Implemented

- Password hashing using bcrypt (salt rounds = 10)
- JWT with expiration (2 hours)
- Protected routes using authentication middleware
- Role-based authorization middleware
- Input validation using express-validator
- MongoDB schema validation (required fields & enums)

---

#  Scalability Considerations

This system can be scaled using:

### Horizontal Scaling
Deploy multiple Node.js instances behind a load balancer (e.g., Nginx).

###  Microservices Architecture
Split into:
- Auth Service
- Task Service
- Product Service

### Caching
Use Redis for frequently accessed data (e.g., products).

###  Database Scaling
- MongoDB replica sets
- Sharding for large datasets

### Containerization
Dockerize backend and deploy using Kubernetes.

---

# Frontend Integration

Frontend supports:

- User registration & login
- JWT token storage
- Protected dashboard
- CRUD operations for tasks and notes
- Admin product management
- API success & error message handling

---

#  Testing

APIs can be tested using:

- Swagger UI
- Postman
- Frontend application

---

# Features Summary

✔ JWT Authentication  
✔ Role-Based Access Control  
✔ CRUD APIs  
✔ API Versioning  
✔ Validation & Error Handling  
✔ Swagger Documentation  
✔ Secure Password Hashing  
✔ Scalable Architecture Design  

---

# Author

Your Name  
Email: ananthakrishnans0608@gmail.com  
GitHub: https://github.com/ArjunAk1234
