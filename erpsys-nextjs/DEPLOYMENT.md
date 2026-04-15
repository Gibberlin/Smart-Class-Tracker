# ERP System - Deployment Guide

Complete setup and deployment instructions for the Smart Class Tracker ERP System.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Deployment to Production](#deployment-to-production)
7. [API Documentation](#api-documentation)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- **Node.js** v16+ ([Download](https://nodejs.org))
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (free tier available)
- **Groq API Key** ([Get API Key](https://console.groq.com))
- **Git** for version control

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd erpsys-nextjs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment Variables

Create `.env.local` file:

```bash
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/studentdb"
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRATION="7d"
NEXT_PUBLIC_API_URL="http://localhost:3000"
GROQ_API_KEY="your-groq-api-key"
GROQ_MODEL="mixtral-8x7b-32768"
```

---

## Database Setup

### Initialize Prisma

```bash
npm run db:push
npx prisma generate
```

### Seed Database

```bash
npm run db:seed
```

**Default Credentials:**
- Admin: `username: admin` | `password: admin123`
- Student: `username: student001` | `password: student123`

---

## Running the Application

### Development

```bash
npm run dev
```

Access at: http://localhost:3000

### Production Build

```bash
npm run build
npm run start
```

---

## Deployment Options

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Docker

```bash
docker build -t erpsys:latest .
docker run -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e GROQ_API_KEY="your-key" \
  erpsys:latest
```

### Railway

1. Connect GitHub to Railway
2. Add environment variables
3. Deploy automatically

---

## Features

- ✅ MongoDB Atlas integration with Prisma ORM
- ✅ JWT-based authentication
- ✅ Admin management system
- ✅ Student dashboard
- ✅ Groq AI-powered chatbot
- ✅ Responsive UI with Tailwind CSS

---

## Support

For issues, check the GitHub repository or documentation.
