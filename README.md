# 🛍️ E-Commerce Showcase Platform

A comprehensive, secure, and multilingual e-commerce platform built with the MERN stack, featuring a modern product showcase and powerful admin dashboard.

## ✨ Features

### 🌍 Multilingual Support
- **Languages**: English, French, Arabic (Darija-influenced)
- **Auto-detection**: Browser language with manual toggle
- **RTL Support**: Full right-to-left layout for Arabic
- **Localized**: Pricing, dates, and content formatting

### 🛒 Product Showcase
- **Responsive Design**: Mobile-first, minimalist grid layout
- **Interactive Cards**: Hover effects with quick actions
- **Product Modals**: High-resolution image carousels
- **Smart Filtering**: Category, price range, availability
- **Advanced Search**: Real-time product search
- **SEO Optimized**: Server-side rendering ready

### 🛡️ Security Features
- **Authentication**: JWT with 2FA support
- **Data Protection**: CNDP Law 08-09 compliance
- **Encryption**: Customer data encryption at rest
- **Rate Limiting**: API and login protection
- **Input Validation**: Comprehensive sanitization
- **HTTPS Everywhere**: Enforced SSL/TLS
- **Security Headers**: CSP, HSTS, XSS protection

### 📊 Admin Dashboard
- **Role-based Access**: Admin vs Moderator permissions
- **Real-time Analytics**: Sales, orders, customer metrics
- **Product Management**: CRUD operations with image upload
- **Order Processing**: Status tracking with notifications
- **Bulk Operations**: CSV import/export
- **Audit Logging**: Complete action tracking

### 🚀 Performance
- **Code Splitting**: Lazy-loaded React components
- **Image Optimization**: WebP with lazy loading
- **Caching**: Redis for sessions, Nginx for static files
- **Compression**: Gzip/Brotli for assets
- **CDN Ready**: Optimized for content delivery

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Nginx Proxy    │    │  Node.js API    │
│                 │◄───┤                 ├───►│                 │
│ • Product UI    │    │ • Load Balancer │    │ • Authentication│
│ • Admin Panel   │    │ • SSL/TLS       │    │ • Business Logic│
│ • Checkout      │    │ • Rate Limiting │    │ • File Upload   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Static Files  │    │    MongoDB      │
                       │                 │    │                 │
                       │ • Images        │    │ • Products      │
                       │ • CSS/JS        │    │ • Orders        │
                       │ • Fonts         │    │ • Users         │
                       └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Query** - Server state management
- **i18next** - Internationalization
- **React Hook Form** - Form handling
- **Recharts** - Analytics visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Document database
- **Mongoose** - ODM with schema validation
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Sharp** - Image processing

### DevOps
- **Docker** - Containerization
- **Nginx** - Reverse proxy & load balancer
- **GitHub Actions** - CI/CD pipeline
- **ESLint & Prettier** - Code quality
- **Jest** - Testing framework

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- MongoDB (or use Docker service)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ecommerce-showcase.git
cd ecommerce-showcase
```

### 2. Environment Setup
```bash
# Copy environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Install all dependencies
npm run install:all
```

### 3. Configure Environment Variables

**Server (.env)**:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRE=30d
ENCRYPTION_KEY=your-32-character-encryption-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SecureAdminPassword123!
```

**Client (.env)**:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

### 4. Start Development

**Option A: Docker (Recommended)**
```bash
# Build and start all services
npm run docker:up

# View logs
docker-compose logs -f
```

**Option B: Local Development**
```bash
# Start MongoDB (if not using Docker)
mongod

# Start both client and server
npm run dev
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000/api
- **Admin**: http://localhost:3000/admin
- **API Health**: http://localhost:5000/health

### 6. Default Admin Login
- **Email**: admin@example.com
- **Password**: Admin123!@# (change after first login)

## 📁 Project Structure

```
ecommerce-showcase/
├── 📁 client/                  # React frontend
│   ├── 📁 public/              # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/      # Reusable components
│   │   ├── 📁 contexts/        # React contexts
│   │   ├── 📁 hooks/           # Custom hooks
│   │   ├── 📁 i18n/            # Internationalization
│   │   ├── 📁 pages/           # Page components
│   │   ├── 📁 services/        # API services
│   │   ├── 📁 utils/           # Utility functions
│   │   └── 📄 App.js           # Main component
│   ├── 📄 Dockerfile           # Client Docker config
│   └── 📄 package.json         # Client dependencies
├── 📁 server/                  # Node.js backend
│   ├── 📁 config/              # Configuration files
│   ├── 📁 controllers/         # Route controllers
│   ├── 📁 middleware/          # Express middleware
│   ├── 📁 models/              # Mongoose models
│   ├── 📁 routes/              # API routes
│   ├── 📁 utils/               # Utility functions
│   ├── 📄 Dockerfile           # Server Docker config
│   ├── 📄 server.js            # Entry point
│   └── 📄 package.json         # Server dependencies
├── 📁 nginx/                   # Nginx configuration
├── 📁 .github/workflows/       # CI/CD pipelines
├── 📄 docker-compose.yml       # Multi-container setup
└── 📄 README.md               # This file
```

## 🔒 Security

This application implements multiple layers of security:

### Authentication & Authorization
- JWT tokens with secure HTTP-only cookies
- Password hashing with bcrypt (12+ rounds)
- Rate limiting on authentication endpoints
- Account lockout after failed attempts
- Optional 2FA with TOTP

### Data Protection
- Customer data encryption at rest
- Input sanitization and validation
- SQL injection prevention
- XSS protection with CSP headers
- CSRF protection with tokens

### Infrastructure Security
- HTTPS enforced with HSTS
- Security headers (CSP, X-Frame-Options, etc.)
- Rate limiting on API endpoints
- Nginx security configurations
- Docker security best practices

### Compliance
- CNDP Law 08-09 (Morocco) compliance
- GDPR-ready data handling
- Explicit consent collection
- Data minimization principles

## 📊 Analytics & Monitoring

### Built-in Analytics
- Real-time visitor tracking
- Product view/purchase metrics
- Cart abandonment analysis
- Revenue and order analytics
- Customer behavior insights

### Performance Monitoring
- API response time tracking
- Error rate monitoring
- Resource usage metrics
- Database performance stats

## 🌐 Deployment

### Production Environment

1. **Server Setup**:
```bash
# Clone repository
git clone https://github.com/yourusername/ecommerce-showcase.git
cd ecommerce-showcase

# Copy production environment
cp server/.env.example server/.env.production
cp client/.env.example client/.env.production

# Update production values
vim server/.env.production
```

2. **SSL Certificate**:
```bash
# Generate SSL certificate (Let's Encrypt)
certbot certonly --standalone -d your-domain.com

# Copy certificates to nginx/ssl/
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/your-domain.com/privkey.pem nginx/ssl/key.pem
```

3. **Deploy with Docker**:
```bash
# Build and start production services
docker-compose -f docker-compose.prod.yml up -d

# Monitor logs
docker-compose logs -f
```

### CI/CD with GitHub Actions

The repository includes automated CI/CD pipelines:

- **Testing**: Automated tests on pull requests
- **Security**: Vulnerability scanning with Snyk
- **Building**: Docker image creation and registry push
- **Deployment**: Automated staging and production deployments

### Environment Variables for Production

Set these secrets in your GitHub repository:

```yaml
PRODUCTION_HOST: your-server-ip
PRODUCTION_USER: deploy-user
PRODUCTION_SSH_KEY: your-ssh-private-key
SNYK_TOKEN: your-snyk-token
SLACK_WEBHOOK: your-slack-webhook-url
```

## 🧪 Testing

### Run Tests
```bash
# Server tests
cd server && npm test

# Client tests
cd client && npm test

# Coverage report
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Individual component/function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user journey testing
- **Security Tests**: Vulnerability scanning

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow ESLint and Prettier configurations
- Write tests for new features
- Update documentation for API changes
- Follow semantic commit messages

## 📝 API Documentation

### Authentication Endpoints
```
POST /api/auth/login          # Admin login
POST /api/auth/logout         # Logout
POST /api/auth/refresh        # Refresh token
GET  /api/auth/me             # Get current user
```

### Product Endpoints
```
GET    /api/products          # List products (public)
GET    /api/products/:id      # Get product details
POST   /api/products          # Create product (admin)
PUT    /api/products/:id      # Update product (admin)
DELETE /api/products/:id      # Delete product (admin)
```

### Order Endpoints
```
POST /api/orders              # Create order (public)
GET  /api/orders              # List orders (admin)
GET  /api/orders/:id          # Get order details
PUT  /api/orders/:id/status   # Update order status (admin)
```

### Analytics Endpoints
```
GET /api/analytics/overview   # Dashboard overview (admin)
GET /api/analytics/sales      # Sales analytics (admin)
GET /api/analytics/products   # Product analytics (admin)
```

## 🔧 Configuration

### Email Configuration
Configure SMTP settings for order confirmations:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Payment Integration
The platform is ready for payment gateway integration:

```javascript
// Add your payment provider configuration
const paymentConfig = {
  provider: 'stripe', // or 'paypal', 'square'
  publicKey: 'pk_your_public_key',
  secretKey: 'sk_your_secret_key'
};
```

### File Upload Configuration
Customize file upload settings:

```env
MAX_FILE_SIZE=5242880          # 5MB
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp
UPLOAD_PATH=./uploads/products
```

## 🏷️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features via GitHub Issues
- **Email**: contact@yourstore.ma
- **Community**: Join our Discord server for discussions

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core e-commerce functionality
- ✅ Multilingual support
- ✅ Admin dashboard
- ✅ Security implementation

### Phase 2 (Next)
- 🔄 Payment gateway integration
- 🔄 Email notifications
- 🔄 Inventory management
- 🔄 Customer reviews system

### Phase 3 (Future)
- 📋 Mobile app (React Native)
- 📋 Advanced analytics
- 📋 Multi-vendor support
- 📋 AI-powered recommendations

---

**Built with ❤️ for the Moroccan e-commerce ecosystem**