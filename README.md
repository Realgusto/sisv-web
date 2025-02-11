# SISV ERP System

A modern Enterprise Resource Planning (ERP) system built with Next.js, featuring a secure authentication system and company management capabilities.

## 🚀 Features

- Secure user authentication
- Multi-company support
- Dashboard analytics
- Purchase management (Orders and Budgets)
- Service management
- Sales tracking with charts
- Modern and responsive UI
- Dark/Light theme support

## 🛠️ Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Prisma ORM
- Tailwind CSS
- Lucide Icons
- MD5 encryption
- Context API for state management

## 📋 Prerequisites

- Node.js 16.8.0 or later
- npm or yarn
- PostgreSQL database

## 🔧 Installation

1. Clone the repository
```bash
git clone https://github.com/realgusto/sisv.git
```

2. Install dependencies
```bash
cd sisv_erp
npm install
```
3. Set up environment variables
```bash
DATABASE_URL="your-database-connection-string"
```
4. Run database migrations
```bash
npx prisma migrate dev
```
5. Start the development server
```bash
npm run dev
```

## 📦 Project Structure
```bash
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   └── api/
├── components/
├── contexts/
└── utils/
```

## 🔐 Authentication
The system uses a token-based authentication system with protected routes. Non-authenticated users are redirected to the login page.

## 🎨 UI Components
- Custom Button component
- FourEasy Icon
- Charts for sales visualization
- Responsive cards and forms
- Loading states
- Error handling

## 🌐 API Routes
- /api/users/login
- /api/companies
- /api/purchases
- /api/services

## 🤝 Support
For support, email 4easy.ti@gmail.com

## ✨ Acknowledgments
- 4easy Tecnologia team

Made with ❤️ by 4easy Tecnologia