## Antes de Continuar...

**Sinta-se a vontade de olhar e copiar qualquer coisa que você achar útil, talvez voce precise somente de uma parte, um decorator, um interceptor, e por ai vai...**

Mas para aqueles que querem o codigo completo, com intuito de aplicar um modulo compartilhado entre servicos de um **monorepo**, basta seguir os passos abaixo:

---

## Para Serviços Isolados

Recomendo olhar e copiar o que for necessário, ou talvez a pasta `common` dentro de `shared/src` que contém arquivos que podem ser úteis para qualquer serviço.

## Como ter uma pasta Shared para Microservices ou Monorepo no Nest.js

### Introdução

Neste artigo, vamos falar sobre como criar uma pasta `shared` para microservices no Nest.js. A pasta `shared` é uma pasta que contém arquivos que são compartilhados entre os microservices. Isso pode incluir arquivos de configuração, arquivos de utilitários, arquivos de middleware, etc.

### Criando a pasta `shared`

Fora da pasta `apps`, crie uma pasta chamada `shared`. Dentro da pasta `shared`, você pode criar arquivos que serão compartilhados entre os microservices.

### Tornando-o visivel

Se houver um arquivo `nest-cli.json` na raiz do seu projeto, você pode adicionar a pasta `shared` ao `collection` para que o Nest CLI possa gerar automaticamente arquivos dentro da pasta `shared`, deste modo acrescente seu caminho na parte de "projects":

`nest-cli.json`:

```json
"shared": {'
  "type": "library",
  "root": "libs/shared",
  "entryFile": "index",
  "sourceRoot": "libs/shared/src",
  "compilerOptions": {
    "tsConfigPath": "libs/shared/tsconfig.lib.json"
  },
}
```

No seu `tsconfig.json` adicione o caminho da pasta `shared` no `paths`:

```json
"paths": {
  "@shared": ["libs/shared/src"],
  "@shared/*": ["libs/shared/src/*"]
}
```

### O arquivo Main.ts

- Certifique-se de arrumar o arquivo `main.ts` para que tenha as importacoes corretas

### O arquivo Shared.module.ts

- Certifique-se de arrumar o arquivo `shared.module.ts` para que tenha as importacoes corretas
- Somente adicione os modulos que serao compartilhados entre os microservices ou servicos
- Ele existe somente para isso, para injetar modules comuns de forma unificada

### O arquivo `tsconfig.lib.json`

- Essencial para que o Nest CLI possa gerar os arquivos corretamente e na pasta correta

### Injete o SharedModule

Certifique-se de que o `SharedModule.register()` esteja importado corretamente nos microservices que irão usá-lo. Basta importar o `SharedModule` no `AppModule` (ou equivalente) do microservice, nos imports:

```typescript
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [SharedModule.register()],
})
export class AppModule {}
```

## Prisma $extend em Nest.js

Na pasta `/shared/src/common/prisma`, há uma _service_ exemplificando como utilizar do **$extend** do Prisma no Nest.js.

---

---

## 🌏 ENGLISH VERSION

## For Isolated Services

I recommend looking at and copying what is necessary, or perhaps the `common` folder inside `shared/src` which contains files that may be useful for any service.

## How to have a Shared folder for Microservices or Monorepo in Nest.js

### Introduction

In this article, we will talk about how to create a `shared` folder for microservices in Nest.js. The `shared` folder is a folder that contains files that are shared between microservices. This can include configuration files, utility files, middleware files, etc.

### Creating the `shared` folder

Outside the `apps` folder, create a folder called `shared`. Inside the `shared` folder, you can create files that will be shared between microservices.

### Making it visible

If there is a `nest-cli.json` file at the root of your project, you can add the `shared` folder to the `collection` so that the Nest CLI can automatically generate files within the `shared` folder, thus add your path in the "projects" part:

```json
"shared": {
  "type": "library",
  "root": "libs/shared",
  "entryFile": "index",
  "sourceRoot": "libs/shared/src",
  "compilerOptions": {
    "tsConfigPath": "libs/shared/tsconfig.lib.json"
  },
}
```

In your `tsconfig.json` add the path of the `shared` folder in `paths`:

```json
"paths": {
  "@shared": ["libs/shared/src"],
  "@shared/*": ["libs/shared/src/*"]
}
```

### The Main.ts file

- Make sure to fix the `main.ts` file to have the correct imports

### The Shared.module.ts file

- Make sure to fix the `shared.module.ts` file to have the correct imports
- Only add the modules that will be shared between microservices or services
- It exists only for that, to inject common modules in a unified way

### The `tsconfig.lib.json` file

- Essential for the Nest CLI to be able to generate the files correctly and in the correct folder

### Injecting the SharedModule

Make sure that `SharedModule.register()` is correctly imported in the microservices that will use it. Simply import the `SharedModule` in the `AppModule` (or equivalent) of the microservice, in the imports:

```typescript
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [SharedModule.register()],
})
export class AppModule {}
```

## Prisma $extend em Nest.js

In the `/shared/src/common/prisma` folder, there is a service exemplifying how to use Prisma's **$extend** in Nest.js.

---

---
