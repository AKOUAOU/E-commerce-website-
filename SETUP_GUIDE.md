# 🚀 Local Development Setup Guide

This guide will walk you through setting up the e-commerce platform on your local machine for development.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB** (v5.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)

### Optional (Recommended)
- **Docker** and **Docker Compose** - [Download here](https://www.docker.com/products/docker-desktop/)
- **MongoDB Compass** (GUI for MongoDB) - [Download here](https://www.mongodb.com/products/compass)
- **Postman** or **Insomnia** (for API testing) - [Download here](https://www.postman.com/)

## ⚡ Quick Start (5 minutes)

### Option 1: Using Docker (Recommended for beginners)

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ecommerce-showcase.git
cd ecommerce-showcase
```

2. **Start with Docker**
```bash
# Build and start all services (MongoDB, API, Client, Nginx)
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

3. **Access the application**
- Frontend: http://localhost:3000
- API: http://localhost:5000
- Admin Panel: http://localhost:3000/admin

4. **Default admin credentials**
- Email: `admin@example.com`
- Password: `Admin123!@#`

### Option 2: Manual Setup (For developers)

Continue reading the detailed setup below.

## 🔧 Detailed Manual Setup

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/yourusername/ecommerce-showcase.git
cd ecommerce-showcase

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Return to root directory
cd ..
```

### Step 2: Database Setup

#### Option A: Local MongoDB Installation

1. **Install MongoDB** following the [official guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB service**
```bash
# On Windows (if installed as service)
net start MongoDB

# On macOS (with Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

3. **Verify MongoDB is running**
```bash
# Connect to MongoDB shell
mongosh

# You should see a MongoDB prompt
# Type 'exit' to quit
```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Use this connection string in your `.env` file

### Step 3: Environment Configuration

#### Server Environment (.env)

```bash
# Copy the example environment file
cd server
cp .env.example .env
```

Edit `server/.env` with your preferred editor:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database (choose one)
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/ecommerce
# OR MongoDB Atlas
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/ecommerce?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-make-it-long-and-random
JWT_EXPIRE=30d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Encryption (generate a random 32-character string)
ENCRYPTION_KEY=your-32-character-encryption-key

# Admin Account (will be created automatically)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!@#

# reCAPTCHA (optional - get from Google reCAPTCHA)
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp
```

#### Client Environment (.env)

```bash
# Copy the example environment file
cd ../client
cp .env.example .env
```

Edit `client/.env`:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# reCAPTCHA (optional)
REACT_APP_RECAPTCHA_SITE_KEY=your-recaptcha-site-key

# Build Configuration
GENERATE_SOURCEMAP=true
REACT_APP_VERSION=$npm_package_version
```

### Step 4: Generate Required Keys

#### JWT Secret
```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Encryption Key
```bash
# Generate a 32-character encryption key
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### Step 5: Set up reCAPTCHA (Optional but Recommended)

1. Go to [Google reCAPTCHA](https://www.google.com/recaptcha/admin/)
2. Create a new site with reCAPTCHA v3
3. Add `localhost` to your domains
4. Copy the Site Key to `REACT_APP_RECAPTCHA_SITE_KEY`
5. Copy the Secret Key to `RECAPTCHA_SECRET_KEY`

### Step 6: Start the Development Servers

#### Option A: Start both servers with one command
```bash
# From the root directory
npm run dev
```

#### Option B: Start servers separately
```bash
# Terminal 1: Start the API server
cd server
npm run dev

# Terminal 2: Start the React client
cd client
npm start
```

### Step 7: Verify Installation

1. **Check API Health**
```bash
curl http://localhost:5000/health
# Should return: {"status":"OK","timestamp":"...","uptime":...}
```

2. **Access Frontend**
   - Open http://localhost:3000 in your browser
   - You should see the e-commerce homepage

3. **Access Admin Panel**
   - Go to http://localhost:3000/admin
   - Login with: `admin@example.com` / `Admin123!@#`

## 🗂️ Project Structure Overview

```
ecommerce-showcase/
├── 📁 client/                  # React frontend
│   ├── 📁 public/              # Static files
│   ├── 📁 src/
│   │   ├── 📁 components/      # React components
│   │   ├── 📁 contexts/        # React contexts
│   │   ├── 📁 hooks/           # Custom hooks
│   │   ├── 📁 i18n/            # Translations
│   │   ├── 📁 pages/           # Page components
│   │   ├── 📁 services/        # API calls
│   │   └── 📁 utils/           # Utilities
│   └── 📄 package.json
├── 📁 server/                  # Node.js backend
│   ├── 📁 config/              # Configuration
│   ├── 📁 controllers/         # Route handlers
│   ├── 📁 middleware/          # Express middleware
│   ├── 📁 models/              # MongoDB models
│   ├── 📁 routes/              # API routes
│   ├── 📁 utils/               # Server utilities
│   └── 📄 server.js            # Entry point
└── 📄 docker-compose.yml       # Docker configuration
```

## 🛠️ Development Commands

### Root Directory Commands
```bash
npm run dev              # Start both client and server
npm run install:all      # Install all dependencies
npm run docker:up        # Start with Docker
npm run docker:down      # Stop Docker containers
```

### Server Commands
```bash
cd server
npm run dev              # Start server in development mode
npm start                # Start server in production mode
npm test                 # Run tests
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
```

### Client Commands
```bash
cd client
npm start                # Start development server
npm run build            # Build for production
npm test                 # Run tests
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
```

## 📊 Seeding Sample Data

To add sample products and categories for testing:

```bash
# Run the seed script
cd server
npm run seed

# Or seed specific data
npm run seed:products    # Add sample products
npm run seed:categories  # Add sample categories
npm run seed:users       # Add sample users
```

## 🔍 Testing the Application

### Manual Testing Checklist

**Frontend:**
- [ ] Homepage loads correctly
- [ ] Product grid displays
- [ ] Language switching works (EN/FR/AR)
- [ ] Product modals open with image carousel
- [ ] Cart functionality works
- [ ] Checkout process completes

**Admin Panel:**
- [ ] Admin login works
- [ ] Dashboard displays analytics
- [ ] Product CRUD operations work
- [ ] Order management functions
- [ ] File upload works

**API Endpoints:**
```bash
# Test API endpoints
curl http://localhost:5000/api/products
curl http://localhost:5000/api/categories
curl http://localhost:5000/health
```

### Running Automated Tests

```bash
# Run all tests
npm test

# Run server tests only
cd server && npm test

# Run client tests only
cd client && npm test

# Run tests with coverage
npm run test:coverage
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. MongoDB Connection Issues
```bash
# Error: "MongoNetworkError: failed to connect to server"
# Solutions:
# - Check if MongoDB is running: mongosh
# - Verify connection string in .env
# - For Atlas: check IP whitelist and credentials
```

#### 2. Port Already in Use
```bash
# Error: "EADDRINUSE: address already in use :::5000"
# Solutions:
# - Kill process using port: npx kill-port 5000
# - Change port in .env file
# - Use different port: PORT=5001 npm run dev
```

#### 3. Node Modules Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Do this for both client and server if needed
```

#### 4. Environment Variables Not Loading
```bash
# Make sure .env files exist and are properly formatted
# No spaces around = sign: KEY=value (not KEY = value)
# Check file path: should be in server/ and client/ directories
```

#### 5. CORS Errors
```bash
# Make sure client is running on http://localhost:3000
# Check CORS configuration in server/server.js
# Verify API URL in client/.env matches server port
```

### Getting Help

#### Check Logs
```bash
# Server logs
cd server && npm run dev

# Client logs (in browser)
# Open Developer Tools > Console

# Docker logs
docker-compose logs -f
```

#### Debug Mode
```bash
# Run server in debug mode
cd server
DEBUG=* npm run dev

# Run with specific debug namespace
DEBUG=app:* npm run dev
```

## 🔧 Advanced Configuration

### Custom Ports
```bash
# Change default ports
# Server: edit PORT in server/.env
# Client: edit package.json script or use PORT=3001 npm start
```

### Database Configuration
```bash
# For production or advanced use
# Edit server/config/database.js
# Modify connection options, timeouts, etc.
```

### Adding Custom Environment
```bash
# Create server/.env.local for local overrides
# This file should be in .gitignore
```

## 🚀 Next Steps

After successful setup:

1. **Explore the Admin Panel**
   - Add your own products
   - Configure categories
   - Test order management

2. **Customize the Frontend**
   - Update branding and colors
   - Modify product layouts
   - Add custom pages

3. **Configure Integrations**
   - Set up email notifications
   - Add payment gateways
   - Configure analytics

4. **Deploy to Production**
   - Follow the deployment guide in README.md
   - Set up domain and SSL
   - Configure production database

## 📞 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review the main README.md
3. Search existing GitHub issues
4. Create a new issue with:
   - Your OS and Node.js version
   - Error messages and logs
   - Steps to reproduce

---

**Happy coding! 🎉**