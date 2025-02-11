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
git clone https://github.com/realgusto/sisv_erp.git
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

## 👥 Contributing
1. Fork the project
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support
For support, email support@4easy.com.br or join our Slack channel.

## ✨ Acknowledgments
- 4easy Tecnologia team
- All contributors who helped with the project

Made with ❤️ by 4easy Tecnologia