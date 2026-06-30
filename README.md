# ShopEase — Full-Stack E-Commerce

## Quick Start

### 1. Database Setup (WAMP)
- Open phpMyAdmin → run `backend/database/migrations/schema.sql`
- Then run `backend/database/seeders/seed.sql`

### 2. Create WAMP Upload Folder
Create folder: `C:/wamp64/www/uploads/ecommerce_web/products/`
Create folder: `C:/wamp64/www/uploads/ecommerce_web/users/`

### 3. Backend
```bash
cd backend
npm install
npm run dev
```
Runs on: http://localhost:5000

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on: http://localhost:5173

---

## Default Accounts
| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@ecommerce.com    | Admin@123 |
| User  | user@ecommerce.com     | User@123  |

---

## Image Upload
- Multer saves images to: `C:/wamp64/www/uploads/ecommerce_web/`
- Images served via WAMP at: `http://localhost:8080/uploads/ecommerce_web/`
- To change path → edit `backend/.env` → `WAMP_UPLOAD_PATH` and `IMAGE_BASE_URL`

---

## API Base URL
`http://localhost:5000/api`

## Key Endpoints
| Method | Endpoint                   | Description        |
|--------|----------------------------|--------------------|
| POST   | /api/auth/register         | Register           |
| POST   | /api/auth/login            | Login              |
| GET    | /api/products              | List products      |
| GET    | /api/products/:slug        | Product detail     |
| GET    | /api/categories            | List categories    |
| GET    | /api/cart                  | Get cart           |
| POST   | /api/orders                | Place order        |
| GET    | /api/reports/dashboard     | Admin dashboard    |

---

## Tech Stack
- **Frontend**: React 18, Vite, Ant Design, React Router, Axios, Recharts
- **Backend**: Node.js, Express, MySQL2, JWT, Multer, Helmet
- **Database**: MySQL (via WAMP)
- **Images**: WAMP static server
