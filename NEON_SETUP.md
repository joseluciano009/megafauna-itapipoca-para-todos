# Login + banco de dados Neon.tech

## 1. Criar o banco na Neon
1. Acesse https://neon.tech e crie um projeto (região `aws-sa-east-1` para o Brasil).
2. Copie a connection string: `postgresql://usuario:senha@ep-xxx.neon.tech/neondb?sslmode=require`.

A tabela `usuarios` é criada automaticamente na primeira chamada da API (`CREATE TABLE IF NOT EXISTS`).

## 2. Variáveis de ambiente
| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | Connection string da Neon |
| `AUTH_SECRET` | Segredo aleatório (ex.: `openssl rand -base64 32`) |

## 3. Vercel
- Importe o repositório (framework Vite é detectado automaticamente).
- Adicione as duas variáveis em *Settings → Environment Variables*.
- A função `api/auth.ts` roda no Edge Runtime e é servida em `/api/auth`.

## 4. StackBlitz
O front-end (`/login`) roda normalmente no StackBlitz via `npm run dev`.
Como o StackBlitz não executa Vercel Functions, aponte o `fetch` para a URL
publicada na Vercel ou defina as variáveis em um proxy local — sem isso a tela
exibe a mensagem "Serviço de autenticação indisponível".

## Segurança
- Senhas com PBKDF2-SHA256 (120k iterações) + salt aleatório.
- Sessão em cookie `HttpOnly; Secure; SameSite=Lax` assinado com HMAC.
- Validação de entrada com zod no cliente e revalidação no servidor.