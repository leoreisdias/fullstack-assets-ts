#### 📄 `nestjs/README.md`

# 🚀 NestJS Utilities (`nestjs/`)

This folder contains **NestJS-specific utilities** for both **standalone services** and **monorepos**. The structure includes a shared module for microservices (`nestjs/shared/`) and deployment configurations (`nestjs/infra/`).

## 📌 Contents:

- **[`shared/`](./shared/README.md)** → Shared utilities for NestJS microservices, including Prisma, decorators, guards, interceptors, DTOs, and utilities.
- **[`infra/`](./infra/README.md)** → Infrastructure-related files, such as a **Dockerfile** optimized for deploying NestJS microservices in a monorepo setup.

---

## 🔹 How to Use This Folder

### 🛠 For Standalone Services

- You can **copy and use** individual utilities from `shared/` without requiring a monorepo setup.

### 🏗 For Monorepo-Based Microservices

- The `shared/` folder is designed to be a **centralized module** for reusable logic across NestJS microservices.
- The `infra/` folder provides deployment configurations optimized for microservices in a **NestJS monorepo**.

For more details, refer to the individual READMEs:

🔹 [Shared Module Documentation](./shared/README.md)
🔹 [Infrastructure (Docker) Documentation](./infra/README.md)

---

## 🏗️ Use Cases

- **Microservices architecture** → Centralize common logic in a `shared` module.
- **Standalone services** → Copy reusable utilities without requiring a monorepo.
- **Optimized deployments** → Use the `infra/` Docker setup to containerize NestJS services efficiently.

This module **streamlines NestJS development**, providing a structured approach for both **monorepos** and **standalone projects**. 🚀

---

## 🌎 Versão em Português

# 🚀 Utilitários NestJS (`nestjs/`)

Esta pasta contém **utilitários específicos do NestJS** para **serviços independentes** e **monorepos**. A estrutura inclui um módulo compartilhado para microsserviços (`nestjs/shared/`) e configurações de implantação (`nestjs/infra/`).

## 📌 Conteúdo:

- **[`shared/`](./shared/README.md)** → Módulo compartilhado para microsserviços NestJS, incluindo Prisma, decoradores, guards, interceptors, DTOs e utilitários.
- **[`infra/`](./infra/README.md)** → Arquivos de infraestrutura, como um **Dockerfile** otimizado para implantação de microsserviços NestJS em um monorepo.

---

## 🔹 Como Usar Esta Pasta

### 🛠 Para Serviços Independentes

- Você pode **copiar e usar** utilitários individuais da pasta `shared/` sem precisar de um monorepo.

### 🏗 Para Microsserviços em Monorepos

- A pasta `shared/` foi projetada para ser um **módulo centralizado** de lógica reutilizável entre microsserviços NestJS.
- A pasta `infra/` fornece configurações de implantação otimizadas para microsserviços em um **monorepo NestJS**.

Para mais detalhes, consulte os READMEs individuais:

🔹 [Documentação do Módulo Compartilhado](./shared/README.md)
🔹 [Documentação de Infraestrutura (Docker)](./infra/README.md)

---

## 🏗️ Casos de Uso

- **Arquitetura de microsserviços** → Centralizar lógica comum em um módulo `shared`.
- **Serviços independentes** → Copiar utilitários reutilizáveis sem necessidade de monorepo.
- **Implantações otimizadas** → Usar a configuração `infra/` do Docker para containerizar serviços NestJS de forma eficiente.

Este módulo **simplifica o desenvolvimento no NestJS**, fornecendo uma abordagem estruturada tanto para **monorepos** quanto para **projetos independentes**. 🚀
