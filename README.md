# Support Management System

A full-stack Support & Service Management System built with **React + Tailwind CSS (v4)** on the frontend and **FastAPI + MySQL** on the backend.  
This system provides role-based access for **Super Admin, Admin, Engineer, and Customer** to manage customers, projects, sites, and support tickets.


---

## 🚀 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS v4
- React Router
- Axios
- Lucide Icons

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- MySQL
- JWT Authentication
- Role-Based Access Control (RBAC)

### Database
- MySQL
- Relational schema with:
  - Users
  - Customers
  - Projects
  - Sites
  - Tickets
  - Ticket Logs

---

## 👥 User Roles

| Role        | Capabilities                                                                           |
|-------------|----------------------------------------------------------------------------------------|
| Super Admin | Full system acces,  Manage users, Admin, customers, projects, sites, assign engineerss |
| Admin       | Manage users, customers, projects, sites, assign engineers                             |
| Engineer    | View assigned tickets, update status, add comments                                     |
| Customer    | Create tickets, view own tickets                                                       |



---

## ✨ Key Features

### 🔐 Authentication
- JWT-based login
- Role-protected routes (frontend + backend)

### 🏢 Admin Panel
- Manage Users & Roles  
- Manage Customers  
- Create Projects & Sites  
- Assign Engineers to Tickets  
- View All Tickets  

- Bulk Upload (CSV / XLSX)   

### 👨‍🔧 Engineer Dashboard
- View only **assigned tickets**
- Ticket details with:
  - Issue
  - Equipment
  - Project & Site info
  - Status
- Update Ticket Status:
  - IN_PROGRESS
  - RESOLVED
- Add comments
- Full lifecycle tracking via logs

### 👤 Customer Portal
- Raise new tickets
- View own tickets
- Dashboard stats:
  - Open
  - In Progress
  - Resolved

### 📜 Audit Logging
Every ticket action is logged:
- CREATED
- ASSIGNED
- STATUS_CHANGE

Each log stores:
- Action
- Message
- User ID
- Timestamp

---


Backend ke root folder me `.env` file create karo:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/support_app_system      //--------- ( password == your mysql password)
SECRET_KEY=supersecretkey123
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

Setup & Run

1️⃣ Backend Setup

cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload



2️⃣ Frontend Setup
cd frontend
npm install
npm run dev


###  Create a MySQL database,

 --    CREATE DATABASE support_app_system;

## 🔑  Login Credentials


| Role        | Email                      | Password   |
|-------------|----------------------------|------------|
| Super Admin | superadmin@support.com     | admin123   |
| Admin       | admin@gmail.com            | 123456     |
| Engineer    | ekta@gmail.com             | vs     |
| Customer    | niya@gmail.com             | 123456     |


