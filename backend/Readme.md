# 💱 Currency Exchange & Wallet System (Backend)

## What the App is About
This application is a currency exchange and wallet management system that allows users to create accounts, manage multi-currency wallets, perform currency conversions, send money to other users with automatic conversion, and view transaction history. It includes analytics for user transaction summaries.

## Assumptions Made
- Currency exchange rates are stored in the database and updated manually via admin panel (no real-time API integration).
- Profile photos are stored locally for development; in production, use cloud storage.
- Top-up is simulated; integrate real payment gateway for production.
- Users can only send money if they have sufficient balance in the sending currency.
- Supported currencies are predefined; admins can add more.

## How a Junior Developer Should Pull, Build, Deploy and Test the API
1. **Pull**: Clone the repo using `git clone <repo-url>`.
2. **Build**: Follow the setup instructions above to install dependencies, set up DB, run migrations.
3. **Deploy**: For local, run `python manage.py runserver`. For production, use services like Heroku/AWS with proper env vars.
4. **Test**: Use Postman collection in root dir to test APIs. Run unit tests with `python manage.py test`.

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
git clone https://github.com/khushnawaj/currency_exchange.git
cd currency_exchange
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
- `DELETE /api/wallets/<id>/`

### 💱 Currency
- `GET /api/currencies/`
- `POST /api/convert/`

### 🔁 Transfer
- `POST /api/send-money/`

### 📜 Transactions
- `GET /api/transactions/`
- `GET /api/analytics/`

### 👤 Profile
- `GET /api/profile/`
- `PATCH /api/profile/`
- `PATCH /api/profile-photo/`

---

## 🧪 Testing

- APIs tested using **Postman**
- Import `CurrencyXchange.postman_collection.json` from root directory for testing
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

