# Tender Management System (TMS)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A modern web application for managing tender processes and procurement activities. Built with React, Node.js, and modern web technologies.

## Features

- 🔐 **Secure Authentication**
  - Email/Password authentication
  - OAuth integration (Google, GitHub)
  - Role-based access control

- 📑 **Tender Management**
  - Create and manage tenders
  - Track tender status
  - Document management

- 📊 **Dashboard & Analytics**
  - Real-time tender metrics
  - Status tracking
  - Activity monitoring

- 🎨 **Modern UI/UX**
  - Responsive design
  - Tailwind CSS styling
  - Clean and intuitive interface

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Tailwind CSS
- React Hot Toast
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js 16.x or later
- npm or yarn
- MongoDB (for backend)

### Frontend Setup

1. Clone the repository
```bash
git clone [repository-url]
cd tms-frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the frontend root directory
```env
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development server
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory
```bash
cd tms-backend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the backend root directory
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tms
JWT_SECRET=your_jwt_secret
```

4. Start the backend server
```bash
npm start
# or
yarn start
```

The backend API will be available at `http://localhost:5000`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.