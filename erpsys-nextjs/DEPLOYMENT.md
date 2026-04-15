# ERP System - Next.js + MongoDB Setup & Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier available)
- Git

### Installation

**1. Clone the repository**
```bash
cd erpsys-nextjs
npm install
```

**2. Configure MongoDB**
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/studentdb`

**3. Set environment variables** (`.env`)
```bash
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/studentdb?appName=Cluster0"
JWT_SECRET="your-production-secret-key"
JWT_EXPIRATION="7d"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

**4. Initialize database**
```bash
npm run db:push      # Create collections
npm run db:seed      # Add sample data
```

**5. Run development server**
```bash
npm run dev
```
Visit **http://localhost:3000** (or 3001 if 3000 is in use)

---

## 📝 Default Login Credentials

### Admin Portal
- **URL:** `http://localhost:3000/admin/login`
- **Username:** `admin`
- **Password:** `admin123`

### Student Portal
- **URL:** `http://localhost:3000/student/login`
- **Username:** `student001`
- **Password:** `student123`

---

## 🏗️ Architecture

### Database Models (MongoDB)
- **User** - Authentication (Admin, Student, Instructor)
- **Department** - Academic departments
- **Student** - Student records
- **Instructor** - Faculty members
- **Course** - Course catalog
- **Class** - Course sections/batches
- **Semester** - Academic periods
- **Enrollment** - Student course registrations
- **Assessment** - Exams/assignments
- **StudentMark** - Grade records

### API Routes

#### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/student/login` - Student login
- `POST /api/student/register` - Student registration
- `POST /api/auth/logout` - Logout

#### Student APIs
- `GET /api/student/profile` - Student profile
- `GET /api/student/courses` - Enrolled courses
- `GET /api/student/grades` - Course grades

#### Admin APIs
- `GET /api/admin/students` - List students
- `POST /api/admin/students` - Create student
- `GET /api/admin/departments` - List departments
- `POST /api/admin/departments` - Create department
- Similar endpoints for: courses, classes, instructors, semesters

---

## 📂 Project Structure

```
erpsys-nextjs/
├── app/
│   ├── api/                    # API routes
│   │   ├── admin/             # Admin endpoints
│   │   ├── student/           # Student endpoints
│   │   └── auth/              # Auth endpoints
│   ├── admin/                 # Admin pages
│   │   ├── dashboard/
│   │   ├── login/
│   │   └── students/
│   ├── student/               # Student pages
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── courses/
│   │   └── grades/
│   ├── layout.tsx
│   └── page.tsx              # Home page
├── components/               # Reusable React components
├── lib/
│   ├── auth.ts              # JWT & auth utilities
│   ├── db.ts                # Prisma client singleton
│   └── types.ts             # TypeScript types
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Sample data seeding
├── .env                     # Environment variables
├── package.json
└── tsconfig.json
```

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev

# Build for production
npm build

# Start production server
npm start

# Database operations
npm run db:push              # Sync schema to database
npm run db:seed              # Seed sample data
npx prisma studio           # GUI for database

# Type checking
npx tsc --noEmit

# Generate Prisma client
npx prisma generate
```

---

## 📦 Production Deployment

### Deploy to Vercel (Recommended)

**1. Push code to GitHub**
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

**2. Deploy via Vercel**
- Go to [vercel.com/new](https://vercel.com/new)
- Import your repository
- Add environment variables (same as `.env`)
- Click Deploy

**3. Set up MongoDB connection**
- Ensure MongoDB Atlas allows Vercel IP (IP Whitelist)
- Or use MongoDB Atlas "Allow access from anywhere" (less secure)

### Deploy via Docker

**1. Build Docker image**
```bash
docker build -t erpsys-nextjs .
```

**2. Run container**
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="mongodb+srv://..." \
  -e JWT_SECRET="your-secret" \
  erpsys-nextjs
```

### Deploy via Render, Railway, or Fly.io
- Connect GitHub repository
- Set environment variables in dashboard
- Deploy with one click

---

## 🔒 Security Checklist

- [ ] Change `JWT_SECRET` in production
- [ ] Use strong passwords
- [ ] Enable HTTPS only in production
- [ ] Set secure MongoDB Atlas IP whitelist
- [ ] Use environment variables for secrets (never commit `.env`)
- [ ] Enable rate limiting on API endpoints
- [ ] Implement CSRF protection
- [ ] Enable CORS properly

---

## 🐛 Troubleshooting

### "Can't reach database"
- Verify MongoDB Atlas cluster is running
- Check IP whitelist in MongoDB Atlas (allow your IP)
- Confirm DATABASE_URL is correct

### "Port 3000 already in use"
- Find process: `lsof -i :3000` (Mac/Linux) or `netstat -ano | findstr :3000` (Windows)
- Kill it: `kill -9 PID` or `taskkill /PID PID /F`
- Or use different port: `PORT=3001 npm run dev`

### Login not working
- Clear browser cookies
- Check browser console for errors
- Verify JWT_SECRET matches between .env and auth.ts
- Ensure database is seeded with users

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Tailwind CSS](https://tailwindcss.com)
