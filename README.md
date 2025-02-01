# 🎓 NEET Preparation Backend Service

A powerful and comprehensive backend service for NEET (National Eligibility cum Entrance Test) preparation, offering advanced analytics, predictions, and performance tracking.

## ✨ Key Features

### 📝 Quiz Management
- 🆕 Create and manage comprehensive quizzes
- ✅ Track quiz submissions in real-time
- 📊 Detailed user quiz history

### 📈 Performance Analytics
- 📊 Subject-wise performance breakdown
- 🎯 Personalized insights and recommendations
- 📱 Real-time progress tracking

### 🎯 Rank Prediction
- 🤖 AI-powered prediction system
- 🏆 Category-wise analysis (General, OBC, SC, ST)
- 📊 Confidence scoring system

### 🏫 College Prediction
- 🎯 Smart college recommendations
- 📚 Historical data analysis
- 🏢 Coverage of government & private institutions

### 📚 Historical Data
- 📊 Comprehensive NEET data analysis
- 📈 Year-wise performance trends
- 🎯 College cutoff tracking

## 🛠️ Tech Stack

- ⚡ Node.js with TypeScript
- 🚀 Express.js framework
- 🍃 MongoDB with Mongoose
- 🔄 RESTful API architecture
- 🔒 CORS enabled
- ⚙️ Environment configuration

## 📋 Prerequisites

- ✅ Node.js (v14 or higher)
- ✅ MongoDB (v4.4 or higher)
- ✅ npm or yarn package manager

## 🚀 Getting Started

### 1️⃣ Clone & Install
```bash
# Clone the repository
git clone <repository-url>
cd neet-preparation-backend

# Install dependencies
npm install
```

### 2️⃣ Configuration
Create `.env` file in root:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/mydatabase
```

### 3️⃣ Launch
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## 🔌 API Endpoints

### 📝 Quiz Management
```
POST /api/quiz          → Create quiz
POST /api/submission    → Submit answers
GET  /api/history/:userId → Get history
```

### 📊 Analytics
```
GET /api/analytics/:userId → Performance analytics
GET /api/insights/:userId  → Performance insights
```

### 🎯 Predictions
```
GET  /api/rank-prediction/:userId → Rank prediction
POST /api/predict                → College predictions
```

### 🏫 College Management
```
POST /api/college      → Add college
POST /api/college/bulk → Bulk add colleges
```

### 📚 Historical Data
```
POST /api/historical-data → Add NEET data
```

### 🏥 Health Check
```
GET /health → System status
```

## ⚙️ Server Features

- 📦 JSON body parser (50mb limit)
- 🔄 URL-encoded parser (50mb limit)
- 🌐 CORS enabled
- ⚠️ Global error handling

## 🛡️ Error Handling

- ✅ Request validation
- 🔄 Database operation safeguards
- 📝 Custom error types
- 🎯 Standardized responses

## 🚀 Development

```bash
# Start development server
npm run dev
```

## 🏭 Production

```bash
# Build and start production server
npm run build
npm start
```

## 🔍 Health Monitoring

Check system status at `/health`:
- ✅ Server status
- 🔄 MongoDB connection

## 👥 Contributing

1. 🍴 Fork the repository
2. 🌿 Create feature branch
3. ✏️ Make changes
4. 🚀 Push changes
5. 📬 Create Pull Request


## 🌟 Star Us!
If you find this project helpful, give us a star! ⭐

---
Made with ❤️ for NEET aspirants
