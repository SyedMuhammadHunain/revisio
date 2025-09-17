# Revisio App

This is a full-stack app in which students can revise their Object Oriented Programming (OOP), Data Structures & Algorithm (DSA), and Programming Fundamentals (PF) concepts by giving tests, track their each and overall test performance analytics, and can interact with a Chatbot built on the RAG system.


## Tech Stack

**Frontend:**
- Angular 19

**Backend:**
- NestJS 11

**Database**
- MongoDB with Mongoose

## Folder Structure

```

├── frontend/                # Angular application
│   ├── src/app/
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Main dashboard with sidebar
│   │   │   ├── overview/    # Statistics and charts
│   │   │   ├── assessment/  # Test creation     
│   │   │   ├── chatbot/     # Basic chatbot integration
│   │   │   ├── test-result/ # Results and analytics
│   │   │   │   ├── chart/   
│   │   │   └── test-taking/ # Test environment
│   │   │       ├── test-completion/
│   │   │       ├── test-environment/
│   │   │       ├── test-instructions/
│   │   │       ├── test-instructions-route/
│   │   ├── services/        # API services
│   │   ├── models/          # TypeScript interfaces
│   │   └── shared/          # Reusable components
│   └── environments/        # Environment configuration
│
└── backend/                # NestJS application
    ├── src/
        ├── auth/           # Authentication module
        ├── questions/      # Question management
        ├── test-config/    # Test configuration
        ├── test-results/   # Results processing
        ├── email/          # Email services
        ├── schemas/        # MongoDB schemas
        └── dtos/           # Data transfer objects

```

## Key Features

### Authentication System
- User registration with email verification
- Two-factor authentication using OTP
- JWT token-based session management
- Password reset functionality

### Assessment Management
- Create tests with specific categories (DSA, OOP, PF)
- Random question selection from question bank

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

## Demo Video

Demo video will be available on the LinkedIn post and the project section.

## Notes

- The chatbot is basic and limited to Programming Fundamentals questions
- It uses an external API from corpusai-api.vercel.app of a friend's RAG-based chatbot system
- Cheating detection is basic and can be improved
- Question bank needs to be populated manually using the seed endpoint
- Email service requires proper SMTP configuration for OTP delivery

## Learning Outcomes

This project demonstrates:
- Full-stack development with Angular and NestJS
- JWT authentication and security practices
- Real-time features and state management
- Data visualization with charts
- External API integration
- MongoDB database design
- Form validation and error handling

---

**Thank you for taking the time to explore this project!** 

This was a learning journey in full-stack development, and I'm grateful for the opportunity to share it. Feel free to reach out if you have any questions or suggestions for improvement.

*Happy coding! 🚀*
