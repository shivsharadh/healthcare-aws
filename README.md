# Healthcare AWS Platform 🏥☁️

A production-grade, full-stack Healthcare Claims Management platform built with Next.js 14, FastAPI, PostgreSQL, and deployed automatically to AWS Fargate via GitHub Actions CI/CD.

## 🚀 Features
- **Role-Based Access Control (RBAC)**: Secure multi-tenant dashboard tailored for `Patient`, `Hospital`, and `Insurance` roles.
- **Real-Time Claims Management**: Hospitals and Patients can submit claims, and Insurance Providers can approve/deny them instantly.
- **Advanced Security**: JWT authentication strictly managed via Server-Side Next.js API Routes and stored in `httpOnly` secure cookies to prevent XSS attacks. Rate limiting and CORS enabled.

## 🏗️ Architecture Stack
* **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Axios.
* **Backend API**: FastAPI (Python 3.11), SQLAlchemy ORM, Pydantic, Passlib (Bcrypt).
* **Database**: PostgreSQL 15.
* **Containerization**: Docker & Docker Compose (Full Stack hot-reloading).
* **Cloud Infrastructure (AWS)**: Elastic Container Service (Fargate), Elastic Container Registry (ECR), Relational Database Service (RDS), Application Load Balancer (ALB), Secrets Manager, IAM.
* **CI/CD**: GitHub Actions (Automated build & push to AWS).

---

## 💻 Local Development Setup

### 1. Prerequisites
- Docker and Docker Compose installed.
- Node.js >= 20.x

### 2. Start the Full Stack (Docker Compose)
From the root directory, spin up the entire isolated stack (Database, API, Frontend):
```bash
docker-compose up -d --build
```

### 3. Access Services
- **Next.js Web App**: `http://localhost:3000`
- **FastAPI Swagger Docs**: `http://localhost:8000/docs`
- **Local PostgreSQL**: `localhost:5432` (User: `admin`, Pass: `admin`, DB: `healthcare`)

*Note: Changes made inside the `frontend/` directory will automatically hot-reload.*

---

## ☁️ AWS Production Deployment

The `main` branch is connected to a GitHub Actions CI/CD pipeline (`.github/workflows/deploy.yml`).

### CI/CD Workflow
1. **Push**: A push to the `main` branch triggers the Action.
2. **Build & Push**: The backend Docker image is built and pushed to AWS ECR.
3. **Deploy**: AWS ECS Fargate performs a rolling update to launch the new tasks securely behind the Application Load Balancer without downtime.

### Security Hardening
- **Secrets Manager**: The PostgreSQL Database URL and FastAPI `SECRET_KEY` are safely injected at runtime via AWS Parameter Store. 
- **IAM Least Privilege**: AWS Roles are strictly scoped to only allow reading necessary secrets and writing specific CloudWatch logs.
