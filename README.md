# 📚 StudyShare - MERN + S3 App to Share Study Resources ✨

StudyShare is a full-stack web application that allows students to upload, share, and discover academic resources. Built with the MERN stack (MongoDB, Express, React, Node.js) and integrated with AWS S3 for file storage, it provides a centralized platform for educational content sharing.

## ✨ Features

- **🔐 User Authentication**
  - 📝 Register with email, password, department, and semester
  - 🚪 Login/Logout functionality
  - 🔑 Password reset via email verification
  - 🛡️ Protected routes and JWT-based authentication

- **📁 Resource Management**
  - 📤 Upload various file types (PDF, DOCX, PPTX, images, etc.)
  - 📋 Add metadata (title, description, subject, department, semester)
  - 🏷️ Tag resources for better discoverability
  - 🔍 View detailed resource information

- **👥 Social Features**
  - 👍 Upvote/remove upvote on resources
  - 💬 Comment on resources
  - 👤 User profiles and dashboards

- **🔎 Search & Discovery**
  - 🔍 Search resources by text, department, semester, or file type
  - 📊 Sort by recency, popularity (upvotes), or comment count
  - 🔢 Filter resources by various criteria

- **📊 User Dashboard**
  - 👤 View and manage personal profile
  - 📚 Track uploaded resources
  - ✏️ Update profile information

## 🛠️ Tech Stack

### 🖥️ Backend
- **📦 Node.js** with **🚂 Express.js** framework
- **📘 TypeScript** for type safety
- **🍃 MongoDB** with **🔌 Mongoose** for database
- **🔑 JWT** for authentication
- **📤 Multer** & **☁️ multer-s3** for file uploads
- **🌐 AWS SDK** for S3 integration
- **🔒 Bcrypt** for password hashing
- **📧 Nodemailer** for email services

### 🎨 Frontend
- **⚛️ React** with **📘 TypeScript**
- **⚡ Vite** for build tooling
- **🧭 React Router** for navigation
- **💅 TailwindCSS** for styling
- **🧩 shadcn-ui** components
- **🔄 Axios** for API requests
- **📝 React Hook Form** for form handling
- **✅ Zod** for validation
- **✨ Framer Motion** for animations
- **🍞 React Hot Toast** for notifications

## 🔌 API Endpoints

### 🔐 Authentication Routes
- `🔑 POST /api/auth/register` - Register a new user
- `🔓 POST /api/auth/login` - Login and get JWT token
- `📧 POST /api/auth/forgot-password` - Request password reset
- `🔏 POST /api/auth/reset-password` - Reset password with code

### 👤 User Routes
- `👀 GET /api/users/me` - Get current user profile
- `✏️ PATCH /api/users/me` - Update current user profile

### 📚 Resource Routes
- `📤 POST /api/resources` - Upload a new resource
- `📋 GET /api/resources` - Get all resources
- `🔍 GET /api/resources/search` - Search resources with filters
- `👤 GET /api/resources/user` - Get resources uploaded by authenticated user
- `📄 GET /api/resources/:id` - Get a specific resource by ID
- `👍 POST /api/resources/:id/upvote` - Upvote/remove upvote on a resource
- `💬 POST /api/resources/:id/comment` - Comment on a resource
- `✏️ PUT /api/resources/:id` - Update a resource's metadata
- `🗑️ DELETE /api/resources/:id` - Delete a resource

## 🚀 Setup Instructions

### 📋 Prerequisites
- 📦 Node.js (v16+ recommended)
- 🍃 MongoDB (local or Atlas)
- ☁️ AWS account with S3 bucket

### 🖥️ Backend Setup

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd STUDY-SHARE/Backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create .env file (copy from .env.example)
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in .env
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRY=7d
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET=your_bucket_name
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   EMAIL_FROM=noreply@studyshare.com
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

### 🎨 Frontend Setup

1. Navigate to the frontend directory
   ```bash
   cd ../Frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create .env file (copy from .env.example)
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in .env
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_ENV=development
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

## ☁️ AWS S3 Setup

1. 📦 Create an S3 bucket in your AWS account
2. 🔄 Configure CORS policy for your bucket to allow uploads from your frontend
3. 👤 Create an IAM user with S3 permissions
4. 🔑 Add your AWS credentials to the backend .env file

Example S3 bucket policy (from `s3-bucket-policy.json`):
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket-name/*"
            ]
        }
    ]
}
```

## 📁 Project Structure

### 🖥️ Backend
- `📄 src/app.ts` - Express app configuration
- `🚀 src/server.ts` - Application entry point
- `🎮 src/controllers/` - API endpoint handlers
- `🏗️ src/models/` - MongoDB schema definitions
- `🛣️ src/routes/` - API route definitions
- `⚙️ src/middlewares/` - Custom middleware (auth, validation, file upload)
- `⚙️ src/config/` - Configuration files (AWS, etc.)
- `🔧 src/utils/` - Utility functions (JWT, email)

### 🎨 Frontend
- `🧩 src/components/` - Reusable UI components
- `📄 src/pages/` - Application pages and routes
- `🔄 src/context/` - React context providers
- `🪝 src/hooks/` - Custom React hooks
- `🔌 src/services/` - API service integrations
- `🔧 src/utils/` - Utility functions

## 📸 Screenshots

### 🏠 Home Page
![Home Page](/Frontend/src/assets/homepage)

### 📊 Dashboard
![Dashboard](/Frontend/src/assets/Dashboard.png)

### 📤 Upload Resources
![Upload Resources](/Frontend/src/assets/Uploadpage.png)

### 🔍 Resources Page
![Resources Page](/Frontend/src/assets/Resourcepage.png)

### 📄 Resource Details
![Resource Details](/Frontend/src/assets/singleResourcepage.png)

## 📝 License

```
MIT License

Copyright (c) 2025 Viraj Gavade

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Author

Viraj Gavade

---


