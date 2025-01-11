# Streamium - Open-source online streaming web app

A modern streaming platform built with SvelteKit that offers a seamless experience for watching embedded content. Features a rich user interface, comprehensive media management, and social features.

![screenshot1](./screenshots/screenshot1.png)
![screenshot2](./screenshots/screenshot2.png)
![screenshot3](./screenshots/screenshot3.png)

## Features

### Media & Streaming
- TMDB API integration for extensive movie and TV show data
- Multiple provider support (VidSrc, VidSrc Pro, Embed.su)
- Advanced search with genre, year, and rating filters

### User Experience
- User authentication
- Watchlist
- Rich comment system with replies, mentions, and emoji support
- Comment moderation and reporting

### Technical Features
- Server-side rendering (SSR)
- Image optimization and caching
- Rate limiting and Captcha protection
- Password reset functionality (WIP)

## Tech Stack

### Frontend
- SvelteKit 2.0 with TypeScript
- TailwindCSS
- Tiptap (Rich text editor)
- Emoji Mart

### Backend
- Prisma ORM with MySQL
- JWT Authentication
- Sharp for image optimization

## Project Structure
```
streamium/
├── src/
│   ├── lib/          # Components, services, stores
│   ├── routes/       # SvelteKit routes and API
│   └── app.html      # App template
├── prisma/
│   └── schema.prisma # Database schema
└── static/           # Static assets
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MySQL

1. Install MySQL if not already installed:
```bash
# Ubuntu/Debian
sudo apt install mysql-server

# macOS with Homebrew
brew install mysql
```

2. Start MySQL service:
```bash
# Ubuntu/Debian
sudo systemctl start mysql

# macOS
brew services start mysql
```

3. Create database and user:
```bash
# Log into MySQL as root
sudo mysql

# Create database and user (in MySQL prompt)
CREATE DATABASE streamium;
CREATE USER 'streamium'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON streamium.* TO 'streamium'@'localhost';
FLUSH PRIVILEGES;
exit;
```

### 3. Configure Environment

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the .env file with your settings:
```env
# Database - update with your MySQL credentials
DATABASE_URL="mysql://user:password@localhost:port/db"

# Authentication - generate a secure random string
JWT_SECRET="your-jwt-secret"

# TMDB API - get from https://www.themoviedb.org/settings/api
TMDB_API_KEY="your-tmdb-api-key"
TMDB_API_URL="https://api.themoviedb.org/3"

# Streaming Providers
VIDSRC_BASE_URL="https://vidsrc.cc/v2/embed"
VIDSRC_PRO_BASE_URL="https://vidsrc.pro/embed"
EMBEDSU_BASE_URL="https://embed.su/embed"
```

### 4. Initialize Database with Prisma

1. Generate Prisma Client:
```bash
npx prisma generate
```

2. Run migrations to create database tables:
```bash
npx prisma migrate dev
```

3. (Optional) Create an admin user:
```bash
# Log into MySQL
mysql -u streamium -pstreamium123 streamium

# Create admin user (in MySQL prompt)
INSERT INTO users (username, email, passwordHash, isAdmin, createdAt, updatedAt)
VALUES ('admin', 'admin@example.com', '$2b$10$BK2yg8osv06HgfAiUoKQhu4zHNY5svt.uBuovXWBuM5JyPYkYZxlO', true, NOW(), NOW());
exit;

# Default admin password is 'admin123', generate a new one with bcrypt.
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Troubleshooting

1. If you get MySQL connection errors:
   - Verify MySQL is running: `sudo systemctl status mysql`
   - Check credentials in .env file
   - Ensure database exists: `mysql -u user -ppassword -e "SHOW DATABASES;"`

2. If Prisma migration fails:
   - Check DATABASE_URL in .env
   - Try resetting database: `npx prisma migrate reset`
   - Check Prisma logs: `npx prisma migrate status`

## License

This project is licensed under the MIT License.

## ⚠️ Legal Disclaimer

This project is provided strictly for research and educational purposes only. By using this software:

- You acknowledge that this is a research project and agree to use it in compliance with all applicable local, state, and federal laws.
- You understand that the author(s) provide this code "as is" without warranty of any kind, express or implied.
- You accept full responsibility for any use, misuse, or illegal use of this software.
- You agree that the author(s) cannot be held liable for any damages, legal issues, or consequences arising from the use of this software.
- You acknowledge that this project does not include, distribute, or promote any copyrighted or unlawful material.
- You understand that streaming copyrighted content without proper authorization may be illegal in your jurisdiction.
- You agree to use this software only with properly licensed and authorized content in accordance with your local laws.

The purpose of this project is to demonstrate modern web development techniques and architectures. Any actions and/or activities related to the material contained within this project is solely your responsibility.

---
