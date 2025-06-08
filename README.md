# 🔐 PrivGuard

PrivGuard is a modern password manager built with privacy and security at its core. It supports passkey (WebAuthn) and TOTP-based passwordless authentication, allowing users to securely manage credentials across multiple services.

## 🚀 Live Demo

🌐 [https://privguard.netlify.app](https://privguard.netlify.app)

---

## 🧠 Features

* 🔐 **Passwordless Login** via WebAuthn (Passkeys)
* 📱 **TOTP Authentication** (Google Authenticator compatible)
* 🧩 **Grouped Vault Entries** by domain
* 🧠 **Password Strength Meter** with average security insights
* ➕ **Add Passwords** with generator, notes, and service preview
* 🎨 Clean, minimal UI built with **shadcn/ui** and **Framer Motion**
* ☁️ Cloud-deployed backend using **Docker**, **PostgreSQL**, **PgBouncer**, **Redis**

---

## 🛠 Tech Stack

### Frontend

* **React 18**
* **TypeScript**
* **TailwindCSS**
* **shadcn/ui**
* **Framer Motion**
* **Clerk** for authentication

### Backend

* **Go (Fiber)**
* **PostgreSQL** + **PgBouncer**
* **Redis** (session/cache store)
* **WebAuthn** (via `go-webauthn`)
* **TOTP** (via `go-otp`)
* **Docker** (multi-stage builds)
* **AWS EC2 / RDS / Secrets Manager** (optional)

---

## 📂 Project Structure

```
privguard/
├── frontend/               # React + shadcn-based UI
├── backend/                
│   ├── cmd/                # Entry point for Go app
│   ├── config/             # Environment setup
│   ├── internal/           # Middleware, routes, services
│   ├── api/handlers/       # API logic
│   ├── db/                 # Migrations
│   └── pkg/                # Utilities
├── docker-compose.yml
├── Dockerfile
└── .env
```

---

## 🧪 Run Locally

1. **Clone the repo**

   ```bash
   git clone https://github.com/SAURABH-CHOUDHARI/privguard.git
   cd privguard
   ```

2. **Setup `.env` files** in `backend/` and `frontend/` directories

3. **Start with Docker**

   ```bash
   docker-compose up --build
   ```

4. Open [localhost:3000](http://localhost:3000) to view the frontend.

---

## 📸 Screenshots
![PrivGuard Dashboard](https://saurabhrofl.netlify.app/project_privguard.png)
## 🙏 Acknowledgements

* [Clerk.dev](https://clerk.dev) for seamless auth integration
* [go-webauthn](https://github.com/duo-labs/webauthn) for FIDO2 support
* [shadcn/ui](https://ui.shadcn.com) for UI components
* Open-source favicon and logos via [favicon.io](https://favicon.io)

---

## 📜 License

MIT License

