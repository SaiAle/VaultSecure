# VaultSecure

**Enterprise-grade secrets management platform** — zero-knowledge, AES-256-GCM encrypted, with TOTP 2FA and immutable audit logging.

![VaultSecure](https://img.shields.io/badge/Spring_Boot-3.2-green?style=flat-square)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square)
![Redis](https://img.shields.io/badge/Redis-7-red?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## Features

- **AES-256-GCM encryption** — secrets encrypted at rest; master key never stored
- **PBKDF2 key derivation** — per-secret salt, 310,000 iterations
- **JWT authentication** with automatic token refresh
- **TOTP 2FA** — time-based one-time passwords (Google Authenticator compatible)
- **Secret versioning** — full history, rotation tracking
- **Secret expiry** — automatic expiry with scheduled cleanup
- **Immutable audit log** — every read/write/delete event recorded
- **Categories** — organize by password, API key, certificate, token, note
- **Dark mode UI** — React 18 + Tailwind CSS
- **Kubernetes ready** — manifests included

---

## Architecture

```
Browser (React 18 + Vite)
        |
        | HTTPS
        v
Spring Boot 3.2 (Java 21)
        |
   +----+----+
   |         |
PostgreSQL   Redis
(encrypted   (session
 secrets)    cache)
```

**Security model:**
1. User authenticates → receives JWT (1h) + refresh token
2. On secret creation: unique salt generated → PBKDF2 derives 256-bit key → AES-GCM encrypts value
3. Salt stored alongside ciphertext; master password is the only way to derive the key
4. Every access event is logged to the immutable audit table

---

## Quick Start

**Prerequisites:** Docker, Docker Compose

```bash
git clone https://github.com/SaiAle/VaultSecure
cd VaultSecure
docker compose up -d
```

Frontend → http://localhost:3000  
Backend API → http://localhost:8080  
API Docs → http://localhost:8080/actuator

**Default credentials** (change immediately in production):
- Username: `demo` | Password: `Demo@1234`

---

## API Reference

| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | /api/auth/register    | Create account      |
| POST   | /api/auth/login       | Sign in → JWT       |
| POST   | /api/auth/refresh     | Refresh JWT         |
| POST   | /api/auth/totp/setup  | Generate TOTP QR    |
| POST   | /api/auth/totp/verify | Enable 2FA          |
| GET    | /api/secrets          | List secrets        |
| POST   | /api/secrets          | Create secret       |
| GET    | /api/secrets/{id}     | Reveal secret value |
| PUT    | /api/secrets/{id}     | Rotate secret       |
| DELETE | /api/secrets/{id}     | Soft-delete         |
| GET    | /api/audit            | Audit log (paged)   |

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Spring Boot 3.2, Java 21            |
| Security   | Spring Security, JWT, Argon2        |
| Encryption | AES-256-GCM, PBKDF2-SHA256          |
| 2FA        | TOTP (RFC 6238)                     |
| Database   | PostgreSQL 16 + Flyway migrations   |
| Cache      | Redis 7                             |
| Frontend   | React 18, TypeScript, Vite          |
| Styling    | Tailwind CSS (dark mode)            |
| Charts     | Recharts                            |
| Container  | Docker, Docker Compose              |
| Orchestration | Kubernetes                       |

---

## Production Checklist

- [ ] Change `JWT_SECRET` (min 32 chars, random)
- [ ] Change `MASTER_PASSWORD` (use a strong passphrase)
- [ ] Enable TLS on the nginx proxy
- [ ] Configure PostgreSQL SSL
- [ ] Set Redis password
- [ ] Enable TOTP 2FA for all admin accounts
- [ ] Review and rotate the demo seed user

---

## License

MIT © 2025 Sai Kumar
