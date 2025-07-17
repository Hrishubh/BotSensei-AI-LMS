# 🧠 BotSensei LMS — AI-Powered Learning Management System

> **A revolutionary AI-powered Learning Management System that transforms how students learn by generating personalized study materials, interactive content, and providing real-time AI assistance for any subject.**

![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk)

## 🚀 Live Demo
**[https://botsensei-ai-lms.vercel.app/](https://botsensei-ai-lms.vercel.app/)**

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [Contact & Support](#-contact-&-support)



## 🎯 Overview

BotSensei LMS represents the next generation of educational technology, combining the power of **Google Gemini AI** with modern web development practices to create an intelligent, adaptive learning platform. The system automatically generates comprehensive study materials tailored to individual learning preferences and provides real-time AI assistance across multiple subjects.

### 🌟 What Makes BotSensei Special

- **Instant Course Generation**: Transform any topic into a complete learning course with structured chapters, notes, and assessments
- **AI-Powered Math Assistant**: Get step-by-step solutions to complex mathematical problems with detailed explanations
- **Adaptive Content Creation**: Generate personalized flashcards, quizzes, and Q&A sessions based on your learning style
- **Gamified Learning Experience**: Interactive elements including swipeable flashcards and timed quizzes to enhance engagement
- **Real-time Progress Tracking**: Monitor learning progress with detailed analytics and performance insights

## 🚀 Key Features

### 🎓 **AI-Powered Learning Engine**
- **Smart Course Generation**: Input any topic and receive a structured course outline with chapters and learning objectives
- **Multi-Format Content**: Automatically generates notes, flashcards, quizzes, and Q&A materials
- **Difficulty Adaptation**: Choose from Easy, Medium, or Hard difficulty levels for personalized learning paths
- **Real-time Content Creation**: Generate study materials on-demand without waiting times

### 🧮 **MathAI Assistant**
- **Step-by-Step Solutions**: Solve complex mathematical problems with detailed explanations
- **Interactive Problem Solving**: Ask follow-up questions and get clarifications on mathematical concepts
- **Multi-Subject Support**: Covers algebra, calculus, geometry, statistics, and more
- **Visual Learning**: Clear formatting and mathematical notation for better understanding

### 🎮 **Gamified Learning Experience**
- **Interactive Flashcards**: Swipeable card interface with flip animations for active recall
- **Timed Quizzes**: Engaging quiz system with immediate feedback and scoring
- **Progress Tracking**: Visual progress indicators and achievement systems
- **Adaptive Difficulty**: Questions adjust based on performance and learning progress

### 💾 **Advanced Data Management**
- **Persistent Learning**: All generated content is saved and accessible across sessions
- **User Profiles**: Personalized dashboards with learning history and preferences
- **Course Organization**: Structured course management with chapter-based navigation
- **Cross-Device Sync**: Access your learning materials from any device



## 🛠️ Technology Stack

### **Frontend Architecture**
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | Full-stack React framework with App Router | 15.0.3 |
| **React** | Component-based UI library | 18.0 |
| **TypeScript** | Type-safe JavaScript development | 5.7.2 |
| **Tailwind CSS** | Utility-first CSS framework | 3.4.1 |
| **Framer Motion** | Animation and gesture library | 11.12.0 |
| **Lucide React** | Beautiful icon library | 0.461.0 |

### **Backend & Database**
| Technology | Purpose | Integration |
|------------|---------|-------------|
| **Drizzle ORM** | Type-safe database toolkit | PostgreSQL integration |
| **Neon Database** | Serverless PostgreSQL | Cloud-native scaling |
| **Clerk** | Authentication & user management | Social login, JWT tokens |
| **Google Gemini AI** | Advanced language model | Content generation, math solving |

### **UI/UX Libraries**
| Library | Purpose | Features |
|---------|---------|----------|
| **RippleUI** | Component library | Pre-built UI components |
| **DaisyUI** | Tailwind CSS components | Theme system, dark mode |
| **React Card Flip** | Interactive card animations | Flashcard functionality |
| **Swiper.js** | Touch slider component | Mobile-friendly navigation |
| **Next Themes** | Theme management | Light/dark mode switching |

### **Development Tools**
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing and optimization
- **Drizzle Kit**: Database migration and studio
- **Vercel**: Deployment and hosting platform

---

## 🏗️ Architecture

BotSensei LMS follows a modern, scalable architecture designed for performance and maintainability:

### **System Architecture**
```mermaid
graph TB
    A[Client Browser] --> B[Next.js Frontend]
    B --> C[Clerk Authentication]
    B --> D[API Routes]
    D --> E[Google Gemini AI]
    D --> F[Drizzle ORM]
    F --> G[Neon PostgreSQL]
    B --> H[Real-time UI Updates]
```

### **Project Structure**
```
📁 BotSensei-AI-LMS/
├── 📁 app/ ---------------------------------# Next.js App Router
│   ├── 📁 (auth)/ --------------------------# Authentication routes
│   │   ├── 📁 sign-in/                      # Sign-in page
│   │   └── 📁 sign-up/                      # Sign-up page
│   ├── 📁 api/ -----------------------------# API endpoints
│   │   ├── 📄 courses/                      # Course management
│   │   ├── 📄 generate-course-outline/      # AI course generation
│   │   ├── 📄 generate-study-content/       # Study material creation
│   │   ├── 📄 mathai/                       # Math AI assistant
│   │   └── 📄 study-type-content/           # Content type management
│   ├── 📁 course/[courseId]/----------------# Dynamic course pages
│   │   ├── 📁 flashcards/                   # Interactive flashcards
│   │   ├── 📁 notes/                        # Course notes
│   │   ├── 📁 quiz/                         # Gamified quizzes
│   │   └── 📁 qa/                           # Q&A sessions
│   ├── 📁 create/---------------------------# Course creation wizard
│   ├── 📁 dashboard/------------------------# User dashboard
│   │   ├── 📁 analytics/                    # Learning analytics
│   │   ├── 📁 courses/                      # Course management
│   │   ├── 📁 mathai/                       # Math AI interface
│   │   └── 📁 profile/                      # User profile
│   ├── 📄 layout.js                         # Root layout
│   ├── 📄 page.js                           # Landing page
│   └── 📄 provider.js                       # Context providers
├── 📁 configs/------------------------------# Configuration files
│   ├── 📄 AiModel.js                        # Gemini AI configuration
│   ├── 📄 db.js                             # Database connection
│   └── 📄 schema.js                         # Database schema
├── 📁 components/---------------------------# Reusable components
│   └── 📁 ui/                               # UI component library
├── 📁 hooks/--------------------------------# Custom React hooks
└── 📁 public/-------------------------------# Static assets
```

### **Data Flow Architecture**
1. **User Authentication**: Clerk handles secure user authentication and session management
2. **Course Generation**: User input → API → Google Gemini AI → Structured course content
3. **Content Storage**: Generated content → Drizzle ORM → Neon PostgreSQL
4. **Real-time Updates**: Database changes → UI updates via React state management
5. **AI Assistance**: User queries → MathAI API → Gemini processing → Formatted responses

---

## 🚀 Installation

### **Prerequisites**
- Node.js 18.0 or higher
- npm or yarn package manager
- Git for version control

### **Quick Start**

1. **Clone the Repository**
```bash
git clone https://github.com/Hrishubh/BotSensei-AI-LMS.git
cd BotSensei-AI-LMS
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret

# Database Configuration
DATABASE_CONNECTION_STRING=postgresql://username:password@host/database

# AI Integration
GEMINI_API_KEY=your_google_gemini_api_key

# Optional: Development Settings
NODE_ENV=development
```

4. **Database Setup**
```bash
# Push database schema
npm run db:push

# Open Drizzle Studio (optional)
npm run db:studio
```

5. **Start Development Server**
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application running.

---

## 📡 API Documentation

### **Core Endpoints**

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/courses` | GET/POST | Course management | `userId`, `courseId` |
| `/api/create-user` | POST | User registration | `name`, `email` |
| `/api/generate-course-outline` | POST | AI course generation | `topic`, `difficulty`, `courseType` |
| `/api/generate-study-content` | POST | Study material creation | `courseId`, `contentType` |
| `/api/mathai` | POST | Math problem solving | `question`, `context` |
| `/api/study-type-content` | GET/POST | Content type management | `courseId`, `type` |
| `/api/generation-status` | GET | Check generation progress | `courseId` |

### **Request/Response Examples**

**Generate Course Outline**
```javascript
// POST /api/generate-course-outline
{
  "courseId": "uuid-string",
  "topic": "Machine Learning Basics",
  "difficultyLevel": "Medium",
  "courseType": "Exam",
  "createdBy": "user@example.com"
}

// Response
{
  "success": true,
  "courseId": "uuid-string",
  "outline": {
    "chapters": [...],
    "objectives": [...],
    "estimatedTime": "4 hours"
  }
}
```

**MathAI Query**
```javascript
// POST /api/mathai
{
  "question": "Solve: 2x + 5 = 15",
  "showSteps": true
}

// Response
{
  "solution": "x = 5",
  "steps": [
    "2x + 5 = 15",
    "2x = 15 - 5",
    "2x = 10",
    "x = 5"
  ],
  "explanation": "..."
}
```

---

## 🗄️ Database Schema

### **Core Tables**

```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  isMember BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Study Materials Table
CREATE TABLE studyMaterial (
  id SERIAL PRIMARY KEY,
  courseId VARCHAR NOT NULL,
  courseType VARCHAR NOT NULL,
  topic VARCHAR NOT NULL,
  difficultyLevel VARCHAR DEFAULT 'Easy',
  courseLayout JSON,
  createdBy VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'Generating',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chapter Notes Table
CREATE TABLE chapterNotes (
  id SERIAL PRIMARY KEY,
  courseId VARCHAR NOT NULL,
  chapterId INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Study Type Content Table
CREATE TABLE studyTypeContent (
  id SERIAL PRIMARY KEY,
  courseId VARCHAR NOT NULL,
  content JSON,
  type VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'Generating',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Relationships**
- `studyMaterial.createdBy` → `users.email`
- `chapterNotes.courseId` → `studyMaterial.courseId`
- `studyTypeContent.courseId` → `studyMaterial.courseId`

---

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Here's how you can help:

### **Getting Started**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 🙏 Acknowledgments

- **Google Gemini AI** for providing advanced language model capabilities
- **Clerk** for seamless authentication and user management
- **Neon Database** for reliable serverless PostgreSQL hosting
- **Vercel** for excellent deployment and hosting platform
- **Next.js Team** for the amazing React framework
- **Open Source Community** for the incredible tools and libraries

---

## 📞 Contact & Support

- **Portfolio**: [https://hrishubh.github.io](https://hrishubh.github.io/)
- **LinkedIn**: [https://www.linkedin.com/in/hrishubh-bhandari/](https://www.linkedin.com/in/hrishubh-bhandari/)
- **Email**: bhandarihrishubh@gmail.com
- **GitHub**: [https://github.com/Hrishubh](https://github.com/Hrishubh)

### **Project Links**
- **Live Demo**: [https://BotSensei-AI-LMS.vercel.app](https://BotSensei-AI-LMS.vercel.app)
- **Repository**: [https://github.com/Hrishubh/BotSensei-AI-LMS](https://github.com/Hrishubh/BotSensei-AI-LMS)


---

<div align="center">

**Built with ❤️ by HRISHUBH BHANDARI**

*Transforming education through the power of AI*

[![GitHub stars](https://img.shields.io/github/stars/Hrishubh/BotSensei-AI-LMS?style=social)](https://github.com/Hrishubh/BotSensei-AI-LMS)
[![GitHub forks](https://img.shields.io/github/forks/Hrishubh/BotSensei-AI-LMS?style=social)](https://github.com/Hrishubh/BotSensei-AI-LMS)
[![GitHub issues](https://img.shields.io/github/issues/Hrishubh/BotSensei-AI-LMS)](https://github.com/Hrishubh/BotSensei-AI-LMS/issues)

</div>
