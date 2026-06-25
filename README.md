# AI Developer Portfolio

A modern, premium developer portfolio application comprising a React + TypeScript + Vite frontend and a Spring Boot backend. 

Features an interactive AI avatar chat room with Speech-to-Text and Text-to-Speech proxy integration.

## Project Structure

- `frontend/`: React + TypeScript frontend powered by Vite and styled with Tailwind CSS.
- `backend/`: Spring Boot (Java 17) web application containing JPA models, REST APIs, and integrations.
- `.github/workflows/deploy.yml`: CI/CD automation pipeline for building and releasing.

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Homebrew (macOS)
- Node.js (v20+) & npm
- Java OpenJDK 17
- Maven

You can run the provided helper setup script to check and install all dependencies:
```bash
./setup_env.sh
```

### Running Locally

#### 1. Start Backend
```bash
cd backend
mvn spring-boot:run
```

#### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

## Release & Deployment

The release process is fully automated via GitHub Actions. On every push to the `main` branch, the pipeline will:
1. Build and lint the React frontend.
2. Deploy the static assets to Hostinger via SFTP.
3. Build and run unit tests for the Spring Boot backend.
