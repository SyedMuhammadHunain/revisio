<div align="center">

 <img src="./github-header-banner.png" alt="Revisio Banner" width="100%" />

  <br/>
  <br/>

 <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=28&pause=1000&color=ffffff&center=true&vCenter=true&width=600&lines=Master+OOP,+DSA+%26+PF;Powered+by+Angular+19+%26+NestJS;AI+RAG+Chatbot+Integration;Smart+Anti-Cheat+Proctoring;Developed+by+Hunain" alt="Typing SVG" />
</a>

  <br/>

  <p>
    <img src="https://img.shields.io/github/repo-size/SyedMuhammadHunain/revisio?style=for-the-badge&color=2563EB" alt="Repo Size" />
    <img src="https://img.shields.io/github/last-commit/SyedMuhammadHunain/revisio?style=for-the-badge&color=2563EB" alt="Last Commit" />
    <img src="https://img.shields.io/badge/Status-Active_Development-success?style=for-the-badge" alt="Status" />
  </p>

</div>

---

<div align="center"> 

## 🛠️ The Tech Stack

</div>

<div align="center">
	<code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/angular.png" alt="Angular" title="Angular"/></code>
	<code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/nest_js.png" alt="Nest.js" title="Nest.js"/></code>
	<code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/mongodb.png" alt="mongoDB" title="mongoDB"/></code>
	<code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/typescript.png" alt="TypeScript" title="TypeScript"/></code>
	<code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/html.png" alt="HTML" title="HTML"/></code>
	<code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/css.png" alt="CSS" title="CSS"/></code>
	<code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/postman.png" alt="Postman" title="Postman"/></code>
	<code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/git.png" alt="Git" title="Git"/></code>
	<code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/github.png" alt="GitHub" title="GitHub"/></code>
	<code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/rest.png" alt="REST" title="REST"/></code>
	<code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/http.png" alt="HTTP" title="HTTP"/></code>
	<code><img width="50" src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/visual_studio_code.png" alt="Visual Studio Code" title="Visual Studio Code"/></code>
</div>

<br/>

## ⚡ Introduction

**Revisio** is a cutting-edge educational assessment platform designed to help Computer Science students master core concepts. It is built using the latest **Angular 19** and **NestJS 11**, ensuring blazingly fast performance and a modern architecture.

> *"More than just a quiz app—it's an intelligent study companion."*

<br/>

## 🖥️ Live Application Demo

<div align="center">
	

https://github.com/user-attachments/assets/46b5d782-17fb-47db-8cc8-2f9d30da7c36


</div>

<br/>

## Folder Structure

```

.
├── 📂 frontend                        # Angular 19 Client
│   ├── 📂 src/app
│   │   ├── 📂 auth                    # 🔐 Login, Signup, OTP & 2FA
│   │   ├── 📂 dashboard               # 📊 Main User Layout
│   │   │   ├── 📂 overview            #    ├── Stats & Progress Charts
│   │   │   ├── 📂 assessment          #    ├── Test Creation Logic
│   │   │   ├── 📂 chatbot             #    ├── 🤖 RAG AI Assistant
│   │   │   ├── 📂 test-taking         #    ├── 🛡️ Anti-Cheat & Proctoring
│   │   │   └── 📂 test-result         #    └── Performance Analytics
│   │   ├── 📂 services                # 🔌 API Communication Services
│   │   ├── 📂 models                  # 📦 TypeScript Interfaces
│   │   └── 📂 shared                  # 🧱 Reusable Components (PrimeNG)
│   └── 📂 environments                # ⚙️ API Keys & Config
│
└── 📂 backend                         # NestJS 11 Server
    ├── 📂 src
    │   ├── 📂 auth                    # 🔐 JWT Strategies & Guards
    │   ├── 📂 questions               # ❓ Question Bank Management
    │   ├── 📂 test-config             # ⚙️ Assessment Rules & Settings
    │   ├── 📂 test-results            # 📈 Scoring & Calculation Engine
    │   ├── 📂 email                   # 📧 Nodemailer Service
    │   ├── 📂 schemas                 # 🗄️ MongoDB/Mongoose Models
    │   └── 📂 dtos                    # 📨 Data Transfer Objects
    └── 📜 main.ts                     #    Entry Point

```

## Key Features

### Authentication System
- User registration with email verification
- Two-factor authentication using OTP
- JWT token-based session management
- Password reset functionality

### Assessment Management
- Create tests with specific categories (DSA, OOP, PF)
- Random question selection from the question bank
- Questions are stored in the Database and can be added

### Test Taking Environment
- Countdown timer
- Question navigation with progress tracking
- Basic cheating detection (tab switching, window focus)
- Auto-submission on time expiry or cheating detection

### Analytics Dashboard
- Performance charts using ngx-charts
- Category-wise score breakdown
- Test history and statistics
- Pass/fail rate tracking

### Chatbot Integration
- Basic chatbot for Programming Fundamentals questions
- Uses external API from corpusai-api.vercel.app of friend's RAG-based chatbot system
- Simple conversation interface with typing indicators

## Installation & Run Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running on localhost:27017)
- Email service credentials (for OTP)

### Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# EMAIL_HOST=your-smtp-host
# EMAIL_USERNAME=your-email
# EMAIL_PASSWORD=your-password
# PORT=3000
npm run start:dev
```

### Frontend Setup
```bash
cd frontend
npm install
# Update environment.development.ts with your API keys
# Create Chatbot, train it and put MODEL_API_KEY & YOUR_CHATBOT_API_KEY in environment folder
npm start
```

### Database Setup
```bash
# MongoDB should be running on localhost:27017
# Database name: concept-revise
# Collections will be created automatically
```

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - Login with OTP
- `POST /auth/resend-otp` - Resend verification code
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with code

### Test Configuration
- `POST /test-config/create` - Create new test
- `POST /test-config/start` - Start test session
- `GET /test-config/user-configs` - Get the user's tests
- `GET /test-config/:id` - Get specific test config

### Test Results
- `POST /test-results/submit` - Submit test answers
- `GET /test-results/user-results` - Get the user's results
- `GET /test-results/statistics` - Get user statistics
- `GET /test-results/:id` - Get specific result

### Questions
- `POST /questions/seed` - Add sample questions (admin)

### Email
- `POST /email/check` - Check email availability
---

**Thank you for taking the time to explore this project!** 

This was a learning journey in full-stack development, and I'm grateful for the opportunity to share it. Feel free to reach out if you have any questions or suggestions for improvement.

*Happy coding! 🚀*
