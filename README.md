# 🧠 Social Media Microservices API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

**A production-ready, containerized microservices architecture for a social media platform**

[🚀 Live Demo](https://api-gateway-nbpw.onrender.com) • [📖 API Docs](https://api-gateway-nbpw.onrender.com/docs) • [🐛 Report Bug](https://github.com/lenlo121500/social-media-ms/issues) • [💡 Request Feature](https://github.com/lenlo121500/social-media-ms/issues)

</div>

---

## 🌟 Features

<table>
<tr>
<td width="50%">

### 🔐 **Authentication & Security**

- JWT-based authentication
- Refresh token mechanism
- Rate limiting with Redis
- Input validation & sanitization
- CORS protection

### 📊 **Performance & Scalability**

- Redis caching layer
- Event-driven architecture
- Horizontal scaling ready
- Load balancing via API Gateway
- Database connection pooling

</td>
<td width="50%">

### 📸 **Media Management**

- File upload with Multer
- Cloud storage integration (Cloudinary)
- Image optimization
- Multiple format support

### 🔍 **Search & Discovery**

- Real-time search functionality
- Keyword-based filtering
- Pagination support
- Future: ElasticSearch integration

</td>
</tr>
</table>

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    Client[Client Applications] --> Gateway[API Gateway :3000]
    Gateway --> Identity[Identity Service :3001]
    Gateway --> Post[Post Service :3002]
    Gateway --> Media[Media Service :3003]
    Gateway --> Search[Search Service :3004]

    Identity --> MongoDB1[(MongoDB)]
    Post --> MongoDB2[(MongoDB)]
    Media --> S3[AWS S3/ Cloudinary]
    Search --> MongoDB3[(MongoDB)]

    Identity --> Redis[(Redis Cache)]
    Post --> Redis
    Media --> Redis
    Search --> Redis

    Identity --> RabbitMQ[RabbitMQ Queue]
    Post --> RabbitMQ
    Media --> RabbitMQ
    Search --> RabbitMQ
```

---

## 📦 Services Overview

<table>
<thead>
<tr>
<th>Service</th>
<th>Port</th>
<th>Description</th>
<th>Live URL</th>
<th>Status</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>🌐 API Gateway</strong></td>
<td>3000</td>
<td>Central routing, load balancing, rate limiting</td>
<td><a href="https://api-gateway-nbpw.onrender.com">🔗 Gateway</a></td>
<td>🟢 Live</td>
</tr>
<tr>
<td><strong>👤 Identity Service</strong></td>
<td>3001</td>
<td>User auth, registration, JWT management</td>
<td><a href="https://identity-service-g93t.onrender.com">🔗 Identity</a></td>
<td>🟢 Live</td>
</tr>
<tr>
<td><strong>📝 Post Service</strong></td>
<td>3002</td>
<td>Posts, likes, comments, social features</td>
<td><a href="https://post-service-lcws.onrender.com">🔗 Posts</a></td>
<td>🟢 Live</td>
</tr>
<tr>
<td><strong>📸 Media Service</strong></td>
<td>3003</td>
<td>File uploads, image processing, storage</td>
<td><a href="https://media-service-z2nr.onrender.com">🔗 Media</a></td>
<td>🟢 Live</td>
</tr>
<tr>
<td><strong>🔍 Search Service</strong></td>
<td>3004</td>
<td>Content search, filtering, recommendations</td>
<td><a href="https://search-service-2bg8.onrender.com">🔗 Search</a></td>
<td>🟢 Live</td>
</tr>
</tbody>
</table>

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- MongoDB (local or cloud)
- Redis (local or cloud)

### 1. Clone the Repository

```bash
git clone https://github.com/lenlo121500/microservices-social-media.git
cd microservices-social-media
```

### 2. Environment Setup

Create `.env` files in each service directory:

```bash
# Copy example environment files
cp identity-service/.env.example identity-service/.env
cp post-service/.env.example post-service/.env
cp media-service/.env.example media-service/.env
cp search-service/.env.example search-service/.env
cp api-gateway/.env.example api-gateway/.env
```

### 3. Run with Docker Compose

```bash
# Start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Manual Installation (Alternative)

```bash
# Install dependencies for all services
npm run install:all

# Start all services in development mode
npm run dev

# Or start services individually
cd identity-service && npm run dev
cd post-service && npm run dev
cd media-service && npm run dev
cd search-service && npm run dev
cd api-gateway && npm run dev
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td><strong>Backend</strong></td>
<td>Node.js, Express.js, JavaScript</td>
</tr>
<tr>
<td><strong>Database</strong></td>
<td>MongoDB with Mongoose ODM</td>
</tr>
<tr>
<td><strong>Cache</strong></td>
<td>Redis for caching and rate limiting</td>
</tr>
<tr>
<td><strong>Message Queue</strong></td>
<td>RabbitMQ for event-driven communication</td>
</tr>
<tr>
<td><strong>Authentication</strong></td>
<td>JWT with refresh tokens</td>
</tr>
<tr>
<td><strong>File Storage</strong></td>
<td>Cloudinary integration</td>
</tr>
<tr>
<td><strong>Containerization</strong></td>
<td>Docker & Docker Compose</td>
</tr>
<tr>
<td><strong>Cloud Platform</strong></td>
<td>Render.com with automated deployments</td>
</tr>
<tr>
<td><strong>CI/CD</strong></td>
<td>GitHub Actions</td>
</tr>
<tr>
<td><strong>Documentation</strong></td>
<td>OpenAPI 3.0 (Swagger)</td>
</tr>
<tr>
<td><strong>Monitoring</strong></td>
<td>Winston logging, Health checks</td>
</tr>
</table>

---

## 📁 Project Structure

```
social-media-ms/
├── 📂 api-gateway/              # API Gateway service
│   ├── 📂 src/
│   │   ├── 📂 routes/          # Route definitions
│   │   ├── 📂 middleware/      # Custom middleware
│   │   ├── 📂 utils/           # Utility functions
│   │   └── 📄 app.js           # Express app setup
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   └── 📄 .env.example
├── 📂 identity-service/         # Authentication service
│   ├── 📂 src/
│   │   ├── 📂 controllers/     # Route controllers
│   │   ├── 📂 models/          # MongoDB models
│   │   ├── 📂 routes/          # Express routes
│   │   ├── 📂 middleware/      # Auth middleware
│   │   └── 📄 app.js
│   ├── 📄 Dockerfile
│   └── 📄 package.json
├── 📂 post-service/             # Post management service
├── 📂 media-service/            # Media upload service
├── 📂 search-service/           # Search functionality
├── 📂 .github/workflows/        # CI/CD pipelines
├── 📄 docker-compose.yml        # Local orchestration
├── 📄 docker-compose.prod.yml   # Production setup
└── 📄 README.md
```

---

## 🔧 Configuration

### Environment Variables

<details>
<summary><strong>🌐 API Gateway</strong></summary>

```env
PORT=8000
NODE_ENV=production
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost:5672

# Service URLs
IDENTITY_SERVICE_URL=http://localhost:3001
POST_SERVICE_URL=http://localhost:3002
MEDIA_SERVICE_URL=http://localhost:3003
SEARCH_SERVICE_URL=http://localhost:3004

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

</details>

<details>
<summary><strong>👤 Identity Service</strong></summary>

```env
PORT=3001
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/identity
JWT_SECRET=your_super_secure_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost:5672

# Email configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

</details>

<details>
<summary><strong>📝 Post Service</strong></summary>

```env
PORT=3002
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/posts
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost:5672

# Pagination
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=100
```

</details>

<details>
<summary><strong>📸 Media Service</strong></summary>

```env
PORT=3003
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/media
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost:5672

# File upload limits
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx

# Cloud storage (choose one)
# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=us-east-1

# OR Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

</details>

<details>
<summary><strong>🔍 Search Service</strong></summary>

```env
PORT=3004
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/search
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost:5672

# Search configuration
SEARCH_CACHE_TTL=3600  # 1 hour
MAX_SEARCH_RESULTS=50
```

</details>

---

## 📖 API Documentation

### Interactive Documentation

All services provide interactive Swagger documentation:

- **🌐 Consolidated Docs**: [https://api-gateway-nbpw.onrender.com/docs](https://api-gateway-nbpw.onrender.com/docs)
- **👤 Identity API**: [https://identity-service-g93t.onrender.com/api-docs](https://identity-service-g93t.onrender.com/api-docs)
- **📝 Post API**: [https://post-service-lcws.onrender.com/api-docs](https://post-service-lcws.onrender.com/api-docs)
- **📸 Media API**: [https://media-service-z2nr.onrender.com/api-docs](https://media-service-z2nr.onrender.com/api-docs)
- **🔍 Search API**: [https://search-service-2bg8.onrender.com/api-docs](https://search-service-2bg8.onrender.com/api-docs)

### Key Endpoints

<details>
<summary><strong>🔐 Authentication Endpoints</strong></summary>

```http
POST /auth/register          # User registration
POST /auth/login             # User login
POST /auth/refresh           # Refresh JWT token
POST /auth/logout            # User logout
GET  /auth/profile           # Get user profile
PUT  /auth/profile           # Update user profile
POST /auth/forgot-password   # Password reset request
POST /auth/reset-password    # Password reset
```

</details>

<details>
<summary><strong>📝 Post Endpoints</strong></summary>

```http
GET    /posts                # Get all posts (paginated)
POST   /posts                # Create new post
GET    /posts/:id            # Get specific post
PUT    /posts/:id            # Update post
DELETE /posts/:id            # Delete post
POST   /posts/:id/like       # Like/unlike post
GET    /posts/:id/comments   # Get post comments
POST   /posts/:id/comments   # Add comment
```

</details>

<details>
<summary><strong>📸 Media Endpoints</strong></summary>

```http
POST   /media/upload         # Upload file
GET    /media/:id            # Get file metadata
DELETE /media/:id            # Delete file
GET    /media/user/:userId   # Get user's media
```

</details>

<details>
<summary><strong>🔍 Search Endpoints</strong></summary>

```http
GET /search                  # Search posts
GET /search/users            # Search users
GET /search/suggestions      # Get search suggestions
```

</details>

---

## 🚀 Deployment

### Render.com Deployment

This project uses Render.com for hosting with automated deployments:

1. **Fork this repository**
2. **Connect to Render**: Link your GitHub repository
3. **Configure services**: Each service deploys independently
4. **Set environment variables**: Configure secrets in Render dashboard
5. **Deploy**: Push to `main` branch triggers automatic deployment

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Render
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run linting
        run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_GATEWAY }}
          curl -X POST ${{ secrets.RENDER_DEPLOY_IDENTITY }}
          curl -X POST ${{ secrets.RENDER_DEPLOY_POST }}
          curl -X POST ${{ secrets.RENDER_DEPLOY_MEDIA }}
          curl -X POST ${{ secrets.RENDER_DEPLOY_SEARCH }}
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific service
cd identity-service && npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

### Test Structure

```
tests/
├── 📂 unit/                 # Unit tests
├── 📂 integration/          # Integration tests
├── 📂 e2e/                  # End-to-end tests
└── 📂 fixtures/             # Test data
```

---

## 📊 Monitoring & Logging

### Health Checks

Each service exposes health check endpoints:

```http
GET /health                  # Basic health check
GET /health/detailed         # Detailed system status
```

### Logging

Structured logging with Winston:

```javascript
// Log levels: error, warn, info, debug
logger.info("User logged in", {
  userId: user.id,
  ip: req.ip,
  userAgent: req.headers["user-agent"],
});
```

### Metrics (Future Enhancement)

- **Prometheus**: Metrics collection
- **Grafana**: Dashboards and monitoring
- **Error tracking**: Sentry integration

---

## 🔮 Roadmap

### Phase 1: Core Features ✅

- [x] User authentication system
- [x] Post creation and management
- [x] Media upload functionality
- [x] Basic search capabilities
- [x] API Gateway implementation

### Phase 2: Enhanced Features 🚧

- [ ] **Real-time messaging** (WebSocket integration)
- [ ] **Advanced search** (ElasticSearch integration)
- [ ] **User relationships** (follow/unfollow system)
- [ ] **Feed algorithm** (personalized content)
- [ ] **Push notifications** (Firebase/OneSignal)

### Phase 3: Advanced Features 🔄

- [ ] **OAuth integration** (Google, GitHub, Twitter)
- [ ] **Two-factor authentication** (2FA)
- [ ] **Role-based access control** (RBAC)
- [ ] **Content moderation** (AI-powered filtering)
- [ ] **Analytics dashboard** (user engagement metrics)

### Phase 4: Scale & Performance 📈

- [ ] **Kubernetes deployment** (container orchestration)
- [ ] **GraphQL API** (efficient data fetching)
- [ ] **CDN integration** (global content delivery)
- [ ] **Database sharding** (horizontal scaling)
- [ ] **Circuit breaker pattern** (fault tolerance)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style

- Use ESLint and Prettier for code formatting
- Follow conventional commit messages
- Write tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Raul Castillo**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lenlo121500)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/raulc8808)

_Building scalable microservices architecture for modern applications_

</div>

---

## 🙏 Acknowledgments

- Thanks to the Node.js and Express.js communities
- Inspired by modern microservices patterns
- Built with passion for scalable architecture

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

</div>
