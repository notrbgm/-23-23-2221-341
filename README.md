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

You can run this project either using Docker (recommended) or manual setup.

### Docker Setup (Recommended)

#### Windows Setup

1. Install WSL2:
   ```powershell
   # Run in PowerShell as Administrator
   wsl --install
   ```
   - Restart your computer when prompted
   - After restart, a Ubuntu terminal will open to set up your Ubuntu username and password
   - If it doesn't open automatically, search for "Ubuntu" in the Start menu

2. Install Docker in WSL2 (Recommended):
   ```bash
   # Update package list and install prerequisites
   sudo apt update
   sudo apt install -y ca-certificates curl gnupg lsb-release

   # Add Docker's official GPG key
   sudo mkdir -m 0755 -p /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

   # Add Docker repository
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

   # Install Docker
   sudo apt update
   sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

   # Add your user to docker group (to run docker without sudo)
   sudo usermod -aG docker $USER

   # Apply group changes (alternatively, you can log out and back in)
   newgrp docker
   ```

   Alternative: If you prefer a GUI, you can install Docker Desktop:
   - Download [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
   - Run the installer (keep all default options)
   - In Docker Desktop settings, enable WSL2 integration

3. Set up Git (in Ubuntu terminal):
   ```bash
   git config --global core.autocrlf false
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

4. Clone and Set up the Project:
   ```bash
   # Go to your home directory in WSL
   cd ~

   # Clone the repository
   git clone https://github.com/gmonarque/streamium.git
   cd streamium

   # Copy environment file
   cp .env.example .env
   ```

5. Configure Environment:
   - Get your TMDB API key from https://www.themoviedb.org/settings/api
   - Open .env in a text editor:
   ```bash
   nano .env
   ```
   - Update the TMDB_API_KEY value
   - Save the file (Ctrl+X, then Y, then Enter)

6. Start the Application:
   ```bash
   # Build and start containers
   docker compose up -d

   # Wait about 30 seconds for MySQL to initialize, then run:
   docker compose exec web npx prisma migrate dev
   ```

7. Access the Application:
   - Open http://localhost:5173 in your browser
   - The application should now be running

8. Useful Commands:
   ```bash
   # View logs
   docker compose logs -f

   # Stop the application
   docker compose down

   # Completely reset (including database)
   docker compose down -v
   ```

#### Linux/macOS Setup

1. Install Docker and Docker Compose on your system

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Update the .env file with your TMDB API key (get from https://www.themoviedb.org/settings/api)

4. Build and start the containers:
```bash
docker compose build
docker compose up (-d for detached)
```

5. Wait for the services to fully start (you should see "ready for connections" in the MySQL logs), then in a new terminal, run the database migrations:
```bash
docker compose exec web npx prisma migrate dev
```

The application will be available at `http://localhost:5173`

Note: If you encounter any migration issues:
1. Clean up the environment completely:
```bash
# Stop and remove containers, volumes, and networks
docker compose down -v
# Remove any Docker volumes that might persist
docker volume rm streamium_mysql_data
```

2. Start the services again:
```bash
docker compose up
```

3. Wait for MySQL to initialize (you should see "MySQL Server - ready for connections" in the logs), then run migrations:
```bash
docker compose exec web npx prisma migrate dev
```

If you still encounter issues, you can check the MySQL logs:
```bash
docker compose logs db
```

To stop the services:
```bash
docker compose down
```

To completely reset (including database):
```bash
docker compose down -v
```

### Manual Setup

#### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MySQL

(Setting up a database is not necessary if you only want to launch streamium locally and watch content)

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

#### Windows-specific Issues

1. If Docker commands fail with "permission denied":
   - Check that you're using WSL2 (not WSL1):
   ```bash
   wsl --status
   ```
   - Verify Docker service is running:
   ```bash
   sudo service docker status
   # If not running, start it:
   sudo service docker start
   ```
   - Ensure your user is in the docker group:
   ```bash
   groups
   # If docker group is missing:
   sudo usermod -aG docker $USER
   newgrp docker
   ```

2. If you experience slow performance:
   - Store the project in WSL filesystem instead of Windows filesystem
   - Avoid running Docker commands from Windows CMD/PowerShell
   - Use WSL terminal for all Docker operations

3. If port conflicts occur:
   - Check if Windows services are using the ports:
   ```powershell
   # Run in PowerShell as Administrator
   netstat -ano | findstr "3306"
   netstat -ano | findstr "5173"
   ```
   - Stop conflicting services or change ports in docker-compose.yml

4. If line endings cause issues:
   - Configure Git to use LF instead of CRLF:
   ```bash
   git config --global core.autocrlf false
   ```
   - Re-clone the repository if needed

#### General Issues

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
