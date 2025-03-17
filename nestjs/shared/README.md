# 🏗️ Shared Module (`nestjs/shared`)

This folder contains **reusable code** for **NestJS microservices**, designed to be **copied and used** in both **isolated services** and **monorepo-based microservices**.

## 📌 Contents:

- `src/common/`
  - `app-factory-config.ts` → Centralized configuration for microservices, CORS, ports, and connections.
  - `constants/`
    - `jwtConstant.ts` → Contains the JWT secret key from environment variables.
  - `dead-letter/`
    - `dead-letter.module.ts` → Module for handling dead-letter messages.
    - `dead-letter.service.ts` → Service for storing failed request logs using Prisma.
  - `decorators/`
    - `file-upload.ts` → Decorators for handling file uploads.
    - `profileValidator.ts` → Role-based validation metadata.
    - `public.ts` → Marks routes as public (no authentication required).
    - `user.ts` → Retrieves authenticated user data from the request.
  - `dto/`
    - `query-pagination.ts` → DTO for handling pagination in queries.
    - `response.ts` → Standard response DTO structure, including paginated responses.
  - `exceptions/`
    - `appError.ts` → Custom application error handling.
    - `global-exception.filter.ts` → Global exception filter for standardizing API error responses.
  - `guards/`
    - `auth.guard.ts` → JWT-based authentication guard with role validation.
  - `interceptors/`
    - `dead-letter.ts` → Captures and logs unhandled exceptions using the Dead Letter Service.
  - `prisma/`
    - `prisma.module.ts` → Global module providing Prisma service.
    - `prisma.service.ts` → Prisma client with optional `$extend` for custom query features.
  - `types/`
    - `global-exception-filter.ts` → Interfaces for handling global exception responses.
  - `uploads/`
    - `file-interceptor.ts` → Interceptor for handling file uploads in microservices.
    - `multer-config.ts` → Multer configuration for memory storage.
    - `multiple-file-interceptor.ts` → Handles multiple file uploads with storage container selection.
  - `utils/`
    - `date.ts` → Utility functions for formatting dates.
    - `format.ts` → String formatting utilities.
    - `mask.ts` → Masking utilities for CPF, CNPJ, phone numbers, and currency formatting.
- `tsconfig.lib.json` → TypeScript configuration for the shared module.

---

## 🔹 How to Use This Folder

### 🛠 For Isolated Services

If you only need specific functionality, feel free to **copy individual files** from `common/` or other subfolders.

### 🏗 For Monorepo-Based Microservices

If you are setting up a **shared module** in a **NestJS monorepo**, follow the steps below to properly structure and configure the shared folder.

#### 1️⃣ Create a `shared` Library

In a NestJS monorepo (managed via `@nestjs/cli`), the **shared module** should be placed outside `apps/` inside `libs/`:

📂 **Project Structure:**

```
apps/
  ├── service-a/
  ├── service-b/
libs/
  ├── shared/
```

#### 2️⃣ Making It Visible to NestJS CLI

Modify `nest-cli.json` to include `shared` as a **library**:

```json
"projects": {
  "shared": {
    "type": "library",
    "root": "libs/shared",
    "entryFile": "index",
    "sourceRoot": "libs/shared/src",
    "compilerOptions": {
      "tsConfigPath": "libs/shared/tsconfig.lib.json"
    }
  }
}
```

#### 3️⃣ Configure TypeScript Paths

Modify `tsconfig.json` to allow imports using `@shared/` alias:

```json
"paths": {
  "@shared": ["libs/shared/src"],
  "@shared/*": ["libs/shared/src/*"]
}
```

#### 4️⃣ Import `SharedModule`

Ensure `SharedModule` is imported into the microservices that will use it:

```typescript
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [SharedModule.register()],
})
export class AppModule {}
```

### 🔹 Prisma `$extend` in NestJS

Inside `/shared/src/common/prisma/`, there is an **example service** demonstrating how to use Prisma’s `$extend` method in a NestJS application.

---

## 🏗️ Use Cases

- **Reusable services and utilities** → Share common functionality across multiple microservices.
- **Consistent data handling** → Standardize Prisma configurations, exception handling, and utility functions.
- **Modular and scalable architecture** → Keep services clean while centralizing shared logic.

This shared module **simplifies development and improves maintainability** in both **monorepos** and **standalone NestJS services**. 🚀

---

## 🌎 Versão em Português

### 📌 Conteúdo:

- `src/common/`
  - `app-factory-config.ts` → Configuração centralizada para microservices, CORS, portas e conexões.
  - `constants/`
    - `jwtConstant.ts` → Contém a chave secreta do JWT vinda das variáveis de ambiente.
  - `dead-letter/`
    - `dead-letter.module.ts` → Módulo para manipulação de mensagens dead-letter.
    - `dead-letter.service.ts` → Serviço para armazenar logs de requisições com falha usando Prisma.
  - `decorators/` → Decoradores customizados para upload de arquivos, autenticação e manipulação de usuários.
  - `dto/` → DTOs para paginação e estrutura de resposta padrão.
  - `exceptions/` → Classes para erros globais e filtro de exceções.
  - `guards/` → Guard de autenticação baseado em JWT.
  - `interceptors/` → Interceptores para logging e tratamento de exceções com Dead Letter.
  - `prisma/` → Módulo Prisma e serviço para extensões customizadas.
  - `types/` → Tipos TypeScript para manipulação de erros globais.
  - `uploads/` → Interceptores e configurações para upload de arquivos.
  - `utils/` → Funções utilitárias para formatação de datas, máscaras e manipulação de strings.
- `tsconfig.lib.json` → Configuração do TypeScript para o módulo compartilhado.

### 🔹 Como Usar

#### Serviços Isolados

Se precisar apenas de uma funcionalidade específica, copie os arquivos necessários da pasta `common/` ou outras subpastas.

#### Para Microservices em Monorepos

Se estiver configurando um **módulo compartilhado** em um **monorepo NestJS**, siga os passos acima para estruturar e configurar corretamente a pasta `shared`.

---

Este módulo compartilhado **facilita o desenvolvimento** e melhora a **manutenibilidade** tanto em **monorepos** quanto em **serviços NestJS isolados**. 🚀
