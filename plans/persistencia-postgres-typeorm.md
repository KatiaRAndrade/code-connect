# Plano: Persistir usuários em Postgres com TypeORM

## Contexto

Hoje `apps/api/src/users/users.service.ts` guarda os usuários em um array em memória
(`private users: User[] = []` + `nextId`). Todo cadastro é perdido a cada restart da API e
não escala para mais de uma instância. Precisamos persistir os dados em um Postgres real,
mantendo a API e os contratos REST intactos.

## Decisões

- **ORM: TypeORM** — integração first-party (`@nestjs/typeorm`), repository pattern via DI
  que encaixa na estrutura de serviços atual, e entidades por decorators consistentes com
  os decorators de `class-validator`/`@nestjs/swagger` já usados.

  Alternativas avaliadas e descartadas:
  - **Prisma** — DX e type-safety excelentes, mas usa schema DSL próprio + client gerado e é
    menos aderente à DI do Nest (exige um `PrismaService` envolvendo o client).
  - **MikroORM** — ótimo (Unit of Work / Identity Map), porém comunidade menor.
  - **Drizzle** — leve e SQL-first, mas sem decorators (destoa do estilo do projeto) e sem
    módulo Nest oficial.

- **Schema: `synchronize: true`** — TypeORM cria/atualiza as tabelas a partir das entidades.
  Simples para desenvolvimento (deve ser desligado em produção).

- **Postgres em Docker Compose** na raiz, com volume nomeado para persistência.

## Mudanças

### 1. `docker-compose.yml` (novo, na raiz do projeto)
Serviço único `postgres`:
- imagem `postgres:16-alpine`
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` (lidos do `.env` da raiz, com defaults
  `codeconnect` / `codeconnect` / `codeconnect`)
- porta `5432:5432`
- **volume nomeado** `postgres_data:/var/lib/postgresql/data` (persistência entre restarts)
- `healthcheck` com `pg_isready`

### 2. Variáveis de ambiente — `.env` na raiz
Acrescentar (sem remover o `GITHUB_PA` existente):
```
POSTGRES_USER=codeconnect
POSTGRES_PASSWORD=codeconnect
POSTGRES_DB=codeconnect
DATABASE_HOST=localhost
DATABASE_PORT=5432
```
Como o processo Nest roda a partir de `apps/api`, adicionar `@nestjs/config`
(`ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' })`) para carregar o
`.env` da raiz, evitando duplicar o arquivo.

### 3. Dependências (`apps/api/package.json`)
Instalar via `pnpm --filter api add`:
- `@nestjs/typeorm` `typeorm` `pg`
- `@nestjs/config` (carregar `.env` da raiz)

### 4. Entidade — `apps/api/src/users/user.entity.ts` (novo)
Converter a `interface User` em entidade TypeORM:
```ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column() name: string;
  @Column({ unique: true }) email: string;
  @Column() passwordHash: string;
}
```
Manter o `export type PublicUser = Omit<User, 'passwordHash'>` (mover para cá ou re-exportar
de `users.service.ts` para não quebrar o import de `auth.service.ts`).

### 5. `apps/api/src/users/users.service.ts`
- Injetar `@InjectRepository(User) private repo: Repository<User>`.
- `create`: trocar a busca/insert pelo repo (`repo.findOne({ where: { email } })` →
  `ConflictException`; `repo.save(repo.create({...}))`). Mantém o hash bcrypt e o `toPublic`.
  O `id` passa a ser gerado pelo banco (remover `nextId`).
- `findByEmail`: vira `async` → `repo.findOne({ where: { email } })`.
- `findById`: vira `async` → `repo.findOne({ where: { id } })` + `toPublic`.

### 6. Propagar o `async` nos consumidores
- `apps/api/src/auth/auth.service.ts:15` — `const user = await this.usersService.findByEmail(email)`.
- `apps/api/src/auth/auth.controller.ts:59-60` — `getMe` vira `async` e
  `const user = await this.usersService.findById(req.user.sub)`.

### 7. Módulos
- `apps/api/src/users/users.module.ts` — `imports: [TypeOrmModule.forFeature([User])]`.
- `apps/api/src/app.module.ts` — adicionar
  `ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' })` e
  `TypeOrmModule.forRootAsync({...})` lendo host/porta/credenciais do `ConfigService`,
  `autoLoadEntities: true`, `synchronize: true`.

### 8. Testes (`users.service.spec.ts`, `auth.service.spec.ts`)
Hoje fazem `new UsersService()` direto — vai quebrar com o repo injetado. Ajustar para
construir via `Test.createTestingModule` com um **repositório mock**
(`getRepositoryToken(User)`) ou um fake in-memory simples. Atualizar as asserções de
`findByEmail`/`findById` para `await`.

## Verificação

1. `docker compose up -d` na raiz → conferir `docker compose ps` (container saudável).
2. `pnpm api:dev` → API sobe sem erro e cria a tabela `users` (log do TypeORM).
3. `pnpm --filter api test` → specs de users e auth passam.
4. Fluxo end-to-end via Swagger (`http://localhost:3000/docs`) ou curl:
   - `POST /v1/auth/register` cria usuário (201).
   - `POST /v1/auth/register` mesmo email → 409.
   - `POST /v1/auth/login` → retorna `access_token`.
   - `GET /v1/auth/me` com Bearer → dados do usuário.
5. **Persistência**: reiniciar a API (e até `docker compose down && up`, sem `-v`) e confirmar
   que o usuário cadastrado continua existindo via login.

## Observação fora de escopo
O `.env` da raiz contém um `GITHUB_PA` (token real exposto). Recomendo rotacioná-lo e garantir
que `.env` esteja no `.gitignore`.
