# CurrencyXchange - Multi-Currency Wallet & Exchange Platform

A full-stack web application for managing multi-currency wallets, performing currency exchanges, and secure money transfers between users.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure signup/login with JWT tokens
- **Multi-Currency Wallets**: Create and manage wallets in different currencies
- **Live Currency Rates**: Real-time exchange rates from external APIs
- **Currency Conversion**: Convert between currencies with live rates
- **Money Transfers**: Send money to other users with automatic conversion
- **Wallet Top-up**: Simulated top-up functionality
- **Transaction History**: Complete transaction tracking and export
- **Analytics Dashboard**: Financial overview and insights
- **Favorite Currencies**: Mark and manage preferred currencies
- **Profile Management**: User profiles with photo upload

### Technical Features
- **Responsive Design**: Mobile-first approach with modern UI
- **Real-time Updates**: Live currency rate updates
- **Export Functionality**: CSV export for transactions
- **Admin Panel**: Django admin for system management
- **API Documentation**: Postman collection included

## 🏗️ Architecture

### Backend (Django REST Framework)
- **Framework**: Django 5.1.4 with DRF
- **Authentication**: JWT with custom email backend
- **Database**: SQLite (development) / PostgreSQL (production)
- **External APIs**: ExchangeRate-API for live rates
- **File Storage**: Local media storage (configurable for cloud)

### Frontend (React + Vite)
- **Framework**: React 19 with Vite
- **Routing**: React Router for SPA navigation
- **State Management**: React hooks and context
- **UI Components**: Custom CSS with responsive design
- **Icons**: React Icons library
- **Notifications**: React Hot Toast

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd currency_exchange
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your settings
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py update_rates  # Fetch live currency rates
   python manage.py runserver
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd currency-frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

## 📁 Project Structure

```
currency_exchange/
├── backend/                 # Django REST API
│   ├── accounts/           # User authentication & profiles
│   ├── currency/           # Currency management & rates
│   ├── wallet/             # Wallet operations
│   ├── transactions/       # Transaction handling
│   ├── config/             # Django settings
│   └── manage.py
├── currency-frontend/       # React SPA
│   ├── src/
│   │   ├── pages/          # Main application pages
│   │   ├── components/     # Reusable components
│   │   ├── api/            # API configuration
│   │   └── utils/          # Utility functions
│   └── public/
├── .gitignore
├── README.md
└── CurrencyXchange.postman_collection.json
```

## 🔧 Configuration

### Environment Variables (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
EXCHANGE_RATE_API_KEY=your-api-key
```

### API Endpoints

#### Authentication
- `POST /api/auth/signup/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout

#### Wallets
- `GET /api/wallets/` - List user wallets
- `POST /api/wallets/` - Create new wallet
- `POST /api/wallets/topup/` - Top up wallet

#### Transactions
- `GET /api/transactions/` - List transactions
- `POST /api/send-money/` - Send money to user
- `GET /api/transactions/export/` - Export transactions

#### Currencies
- `GET /api/currencies/` - List available currencies
- `POST /api/convert/` - Convert currency amounts

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### API Testing
Import `CurrencyXchange.postman_collection.json` into Postman for comprehensive API testing.

## 🚢 Deployment

### Option 1: Vercel (Frontend) + Render (Backend) - Recommended

#### Backend Deployment on Render
1. **Create Render Account**: Sign up at [render.com](https://render.com)
2. **Connect GitHub**: Link your GitHub repository
3. **Create PostgreSQL Database**:
   - Go to Render Dashboard → New → PostgreSQL
   - Create database and copy the connection string
4. **Deploy Django Backend**:
   - New → Web Service → Connect your repo
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
   - Add environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `SECRET_KEY`: Generate a secure secret key
     - `DEBUG`: False
     - `EXCHANGE_RATE_API_KEY`: Your API key from exchangerate-api.com
     - `DJANGO_SETTINGS_MODULE`: config.settings

#### Frontend Deployment on Vercel
1. **Create Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Connect GitHub**: Import your repository
3. **Configure Build Settings**:
   - Root Directory: `currency-frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Add Environment Variables**:
   - `VITE_API_BASE_URL`: Your Render backend URL + `/api`

#### Update CORS Settings
After deployment, update your backend's `config/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Development
    "https://your-frontend.vercel.app",  # Production frontend
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",  # Development
    "https://your-frontend.vercel.app",  # Production frontend
]
```

### Option 2: Render Only (Both Services)

#### Deploy Backend
Follow the same steps as above for the backend.

#### Deploy Frontend on Render
1. **Create Static Site**:
   - New → Static Site → Connect your repo
   - Root Directory: `currency-frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
2. **Add Environment Variables**:
   - `VITE_API_BASE_URL`: Your Render backend URL + `/api`

### Post-Deployment Steps
1. **Update Currency Rates**: Run the management command on your deployed backend
2. **Create Superuser**: Use Render's shell to run `python manage.py createsuperuser`
3. **Test the Application**: Verify all features work in production
4. **Set up Monitoring**: Consider adding error tracking (Sentry) and analytics

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
SECRET_KEY=your-production-secret-key
DEBUG=False
DATABASE_URL=postgresql://user:password@host:port/database
EXCHANGE_RATE_API_KEY=your-api-key
DJANGO_SETTINGS_MODULE=config.settings
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using Django & React**