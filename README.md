<div align="center">
  <img src="./ecommerce-client/public/logo.png" alt="NexuSmart Logo" width="200" height="200"/>
  
  # 🛍️ NexuSmart - Modern Ecommerce Platform
  
  <p align="center">
    <strong>A full-stack ecommerce platform with Next.js frontend and Spring Boot backend</strong>
  </p>
  
  <p align="center">
    <a href="https://nexusmart-varuvijays-projects.vercel.app/">View Demo</a> •
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#contributing">Contributing</a>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
    <img src="https://img.shields.io/badge/React-18.0-blue?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
    <img src="https://img.shields.io/badge/Spring_Boot-3.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot"/>
    <img src="https://img.shields.io/badge/PostgreSQL-15.0-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  </p>
</div>

---

## 🌟 Overview

NexuSmart is a modern, responsive ecommerce frontend application that provides an exceptional shopping experience. Built with performance, accessibility, and user experience in mind, it offers a comprehensive solution for online retail businesses.

## ✨ Features

### 🎨 **Modern UI/UX**
- Clean, intuitive interface with smooth animations
- Fully responsive design for all devices
- Accessibility-first approach

### 🛒 **Shopping Experience**
- Advanced product search and filtering
- Interactive product galleries
- Real-time cart updates
- Recently viewed products tracking

### 🔐 **User Management**
- Secure user authentication
- Profile management
- Order history tracking
- Address book management

### 💳 **Checkout & Payments**
- Streamlined checkout process
- Multiple payment gateway integration
- Guest checkout option
- Order confirmation and tracking

### 📱 **Mobile Optimized**
- Progressive Web App (PWA) ready
- Touch-friendly interface
- Offline functionality
- Fast loading times

## 🚀 Demo



### 📱 Live Demo
> **[Visit Live Demo](https://nexusmart-varuvijays-projects.vercel.app) <img src="./public/1.png" alt="Homepage Screenshot" width="100%"/>**

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React Framework | 14.0+ |
| **React** | UI Library | 18.0+ |
| **Tailwind CSS** | Styling | 3.0+ |
| **JavaScript** | Programming Language | ES6+ |
| **Vercel** | Frontend Deployment | Latest |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Spring Boot** | Java Framework | 3.0+ |
| **Spring Data JPA** | Database Access | 3.0+ |
| **Spring Validation** | Input Validation | 3.0+ |
| **PostgreSQL** | Database | 15.0+ |
| **Lombok** | Code Generation | Latest |
| **Docker** | Containerization | Latest |
| **Render** | Backend Deployment | Latest |

## 📦 Installation

### Prerequisites
- Node.js (v18.0 or higher)
- Java 17 or higher
- PostgreSQL 15.0 or higher
- Docker (optional)
- npm or yarn package manager
- Git

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nexusmart-frontend.git
   ```

2. **Navigate to project directory**
   ```bash
   cd nexusmart-frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the `.env.local` file with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url
   NEXT_PUBLIC_STRIPE_KEY=your_stripe_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Backend Setup

1. **Clone the backend repository**
   ```bash
   git clone https://github.com/yourusername/nexusmart-backend.git
   ```

2. **Navigate to backend directory**
   ```bash
   cd nexusmart-backend
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   SPRING_DATASOURCE_URL=jdbc:postgresql://your-neon-db-url
   SPRING_DATASOURCE_USERNAME=your-username
   SPRING_DATASOURCE_PASSWORD=your-password
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   ```

4. **Run with Docker**
   ```bash
   docker build -t nexusmart-backend .
   docker run -p 8080:8080 nexusmart-backend
   ```

   Or run directly with Maven:
   ```bash
   ./mvnw spring-boot:run
   ```

## 🚀 Deployment

### Frontend Deployment
- Deployed on Vercel
- Automatic deployments on push to main branch
- Environment variables configured in Vercel dashboard

### Backend Deployment
- Deployed on Render.com
- Docker container deployment
- PostgreSQL database hosted on Neon.com
- Environment variables configured in Render dashboard

### Database
- PostgreSQL hosted on Neon.com
- Connection pooling enabled
- Automated backups configured

## 🎯 Usage

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run tests
npm test
```

### Project Structure

```
nexusmart-frontend/
├── 📁 app/                    # Next.js 13+ App Router
│   ├── 📁 (auth)/            # Authentication routes
│   ├── 📁 products/          # Product pages
│   ├── 📁 cart/              # Shopping cart
│   └── 📄 layout.js          # Root layout
├── 📁 components/            # Reusable components
│   ├── 📁 ui/                # UI components
│   ├── 📁 forms/             # Form components
│   └── 📁 layout/            # Layout components
├── 📁 lib/                   # Utility functions
├── 📁 hooks/                 # Custom React hooks
├── 📁 styles/                # Global styles
└── 📁 public/                # Static assets
```

## 🎨 Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="./public/6.png" alt="User Profile" width="300"/>
        <br/><em>OTP Verification</em>
      </td>
      <td align="center">
        <img src="./public/2.png" alt="Product Page" width="300"/>
        <br/><em>Product Detail Page</em>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="./public/7.png" alt="Shopping Cart" width="300"/>
        <br/><em>Shopping Cart</em>
      </td>
      <td align="center">
        <img src="./public/8.png" alt="Checkout" width="300"/>
        <br/><em>Checkout Process</em>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="./public/3.png" alt="User Profile" width="300"/>
        <br/><em>Merchant dashboard</em>
      </td>
      <td align="center">
        <img src="./public/5.png" alt="Checkout" width="300"/>
        <br/><em>Checkout Process</em>
      </td>
    </tr>
  </table>
</div>

## 🔧 Configuration

### Frontend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | ✅ |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe publishable key | ✅ |
| `NEXT_PUBLIC_APP_URL` | Application URL | ✅ |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS` | Google Analytics ID | ❌ |

### Backend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SPRING_DATASOURCE_URL` | Neon PostgreSQL URL | ✅ |
| `SPRING_DATASOURCE_USERNAME` | Database username | ✅ |
| `SPRING_DATASOURCE_PASSWORD` | Database password | ✅ |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Database schema update mode | ✅ |
| `SERVER_PORT` | Application port | ❌ |

### Customization

1. **Colors & Theming**: Modify `tailwind.config.js`
2. **Components**: Update components in `/components` directory
3. **Layouts**: Customize layouts in `/app/layout.js`
