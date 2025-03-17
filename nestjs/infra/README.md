#### 📄 `nestjs/infra/README.md`

# 🏗️ NestJS Infrastructure (`nestjs/infra`)

This folder contains infrastructure-related configurations for deploying **NestJS microservices** within a **monorepo controlled by NestJS apps**.

## 📌 Contents:

- `Dockerfile` → A Docker configuration optimized for deploying NestJS microservices in a monorepo setup.

## 🐳 Dockerfile for NestJS Monorepos

This **Dockerfile** provides a structured approach to **containerizing NestJS microservices** while ensuring compatibility with monorepo environments.

### 🔹 Features:

- **Multi-stage build** → Optimizes image size by separating dependencies installation and runtime execution.
- **Efficient caching** → Reduces build time by leveraging Docker layer caching.
- **Support for NestJS monorepos** → Works seamlessly with the `@nestjs/cli` apps structure.
- **Production-ready** → Configured for running optimized NestJS services in a containerized environment.

### 🛠️ Example Usage:

```sh
# Build the Docker image
docker build -t my-nestjs-service .

# Run the container
docker run -p 3000:3000 my-nestjs-service
```

## 🏗️ Use Cases

- **Deploy NestJS microservices** in a **monorepo-controlled** environment.
- **Optimize build processes** with multi-stage builds and caching.
- **Ensure consistency** across different NestJS apps running in Docker.

This module **streamlines the deployment process** for NestJS microservices, making it easier to integrate with containerized environments. 🚀
