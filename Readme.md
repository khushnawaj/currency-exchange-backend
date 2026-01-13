# 💱 Currency Exchange & Wallet System (Backend)

A **Django REST API backend** for a multi-currency wallet system that supports user authentication, wallet management, currency conversion, and secure user-to-user money transfers.

---

## 🚀 Features

- User Signup & Login (JWT Authentication)
- Email-based Custom User Model
- Multi-currency Wallet System
- Wallet Top-up API (Simulated)
- Currency Management with Logos
- Currency Conversion API
- Send Money (Cross-currency transfers)
- Transaction History
- Profile Photo Upload
- Admin Panel for Management

---

## 🛠 Tech Stack

- Python 3
- Django
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Pillow (Image Handling)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

---

### 2️⃣ Create & Activate Virtual Environment
```bash
python -m venv venv
```

**Activate**
```bash
# Windows
venv\Scripts\activate

# Linux / Mac
source venv/bin/activate
```

---

### 3️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```

---

### 4️⃣ Environment Variables

Create a `.env` file in the root directory and add:

```env
SECRET_KEY=your_secret_key
DEBUG=True

DB_NAME=currency_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

---

### 5️⃣ Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

---

### 6️⃣ Create Superuser
```bash
python manage.py createsuperuser
```

---

### 7️⃣ Run Development Server
```bash
python manage.py runserver
```

Server will start at:
```
http://127.0.0.1:8000/
```

---

## 🔐 Authentication Flow

### Signup
```
POST /api/signup/
```

### Login
```
POST /api/login/
```

Use JWT access token in headers:
```
Authorization: Bearer <access_token>
```

---

## 📡 API Endpoints (Summary)

### 🔑 Authentication
- `POST /api/signup/`
- `POST /api/login/`

### 💼 Wallet
- `GET /api/wallets/`
- `POST /api/wallets/`
- `POST /api/wallets/topup/`

### 💱 Currency
- `GET /api/currencies/`
- `POST /api/convert/`

### 🔁 Transfer
- `POST /api/send-money/`

### 📜 Transactions
- `GET /api/transactions/`

### 👤 Profile
- `PATCH /api/profile-photo/`

---

## 🧪 Testing

- APIs tested using **Postman**
- Admin panel available at:
```
/admin/
```

---

## 📌 Notes

- Payment gateway is **simulated** (top-up API)
- Media handling is for **development only**
- Project can be extended with:
  - React frontend
  - Real payment gateway integration
  - Cloud deployment (AWS / Render / Railway)

---

## 👤 Author

**Khushnawaj**  
Full Stack Developer  
Django | REST APIs | PostgreSQL | React/Vue

---

