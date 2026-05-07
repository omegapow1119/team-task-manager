# Team Task Manager 🚀

A full-stack Web Application built using the **MERN stack** (MongoDB, Express, React, Node.js) and **Tailwind CSS**. This application allows teams to seamlessly manage projects, assign tasks, and track their progress with Role-Based Access Control (RBAC).

![Live Status](https://img.shields.io/badge/Status-Live-success)
![Railway](https://img.shields.io/badge/Deployed_on-Railway-purple)
![React](https://img.shields.io/badge/Frontend-React_Vite-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)

---

## 🌐 Live Demo
**[View Live Application on Railway](https://team-task-manager-production-467b8.up.railway.app/)**

---

## ✨ Key Features
- **User Authentication:** Secure Signup/Login using JSON Web Tokens (JWT) and HTTP-only cookies. Passwords are encrypted via Bcrypt.
- **Project Management:** Users can create custom projects. The creator automatically becomes the "Admin" of that project.
- **Team Collaboration:** Admins can invite registered users to their projects via email.
- **Task Assignment & Tracking:** Admins can create tasks with descriptions, due dates, and assign them to specific team members.
- **Dashboard Overview:** A centralized dashboard where users can see all their assigned tasks across different projects and quickly update task status (`TODO`, `IN PROGRESS`, `DONE`).
- **Role-Based Access Control (RBAC):** 
  - **Admins** have full control over the project (add members, edit/delete tasks, delete project).
  - **Members** can view the project and only update the progress/status of tasks assigned to them.

---

## 🛠️ Technology Stack
- **Frontend:** React.js (Vite), Tailwind CSS, React Router DOM, Zustand (State Management), Axios, Lucide Icons.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose ORM).
- **Deployment:** Railway (Monolithic structure - Express serves the static React build).

---

## 📂 Project Structure (Monorepo)
```text
team-task-manager/
├── backend/               # Node.js backend
│   ├── config/            # DB Configuration
│   ├── controllers/       # Route Logic
│   ├── middlewares/       # JWT Auth verification
│   ├── models/            # Mongoose Schemas
│   ├── routes/            # Express endpoints
│   └── server.js          # Entry Point (also serves frontend)
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI (Layout, etc.)
│   │   ├── pages/         # Dashboard, Login, Register, ProjectDetails
│   │   ├── store/         # Zustand global state
│   │   └── utils/         # Axios API interceptors
├── package.json           # Root package (Build/Deployment scripts)
└── README.md
```

---

## 💻 Running Locally

### 1. Prerequisites
- Node.js installed
- MongoDB installed locally OR a MongoDB Atlas URI.

### 2. Installation
Clone the repository:
```bash
git clone https://github.com/omegapow1119/team-task-manager.git
cd team-task-manager
```

Install all dependencies (Root, Backend, and Frontend):
```bash
npm run build
# The root build script installs dependencies for both frontend and backend automatically.
```

### 3. Environment Variables
Create a `.env` file inside the `backend/` directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/teamtaskmanager
JWT_SECRET=your_super_secret_key_here
```

### 4. Start the Application
Run both the Backend and Frontend concurrently:
```bash
npm run dev
```
- The frontend will start at `http://localhost:5173`
- The backend API will start at `http://localhost:5000`

---

## 🚀 Deployment (Railway)
This project is configured as a Monorepo for 1-click deployment on Railway.
1. Link your GitHub repository to a new Railway project.
2. Railway will automatically detect the root `package.json` and build the application.
3. Add the required Environment Variables in the Railway Dashboard.
4. Railway will start the Node.js server, which will statically serve the optimized React frontend.
