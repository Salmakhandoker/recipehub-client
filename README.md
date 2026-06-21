# 🍽️ RecipeHub — Recipe Sharing Platform

A full-stack recipe sharing platform where food enthusiasts can create, discover, share, and manage recipes. Users can publish their own recipes, browse recipes shared by the community, save favorites, and unlock premium features via Stripe payments.

---

## 🌐 Live Site

🔗 [RecipeHub Live](https://your-live-site-link.com)

---

## 🔑 Admin Credentials

| Field    | Value                    |
|----------|--------------------------|
| Email    | admin@gmail.com    |
| Password | Admin ......               |

---

## 📁 GitHub Repositories

- 🖥️ **Client:** [GitHub - RecipeHub Client](https://github.com/your-username/recipehub-client)
- 🛠️ **Server:** [GitHub - RecipeHub Server](https://github.com/your-username/recipehub-server)

---

## ✨ Features

### 👤 User Features
- Register & login with email/password or Google OAuth
- Browse all recipes with category filter
- View full recipe details
- Like, report, and favorite recipes
- Purchase individual recipes via Stripe
- Add up to **2 recipes** (free) or **unlimited** (premium)
- Manage own recipes (create, update, delete)
- View purchased and favorited recipes
- Update profile (name & image)
- Premium membership via Stripe Checkout

### 🛡️ Admin Features
- Dashboard overview (users, recipes, reports, premium members)
- Manage users (block/unblock)
- Manage all recipes (edit, delete, feature)
- Feature recipes shown on the home page
- View and act on recipe reports (remove or dismiss)
- View all payment transactions

---

## 🏠 Pages

### Public Pages
- **Home** — Banner, Featured Recipes, Popular Recipes (most liked), 2 extra sections, Framer Motion animations
- **Browse Recipes** — All recipes in card format with category filter
- **Recipe Details** — Full info, like, favorite, purchase, and report buttons
- **Login / Register** — Credential & Google login, form validation

### Private Pages (Authenticated)
- **User Dashboard** — Overview stats, Add Recipe, My Recipes, My Favorites, My Purchased Recipes, Profile
- **Admin Dashboard** — Overview, Manage Users, Manage Recipes, Reports, Transactions

---

## 🔐 Authentication

- **Better Auth** with Google OAuth
- JWT stored in **HTTPOnly Cookies**
- Token verification middleware on all protected APIs
- Auth state persists on page refresh
- Redirects to intended route after login

**Password Rules:**
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter

---

## 💳 Payment System

- **Stripe Checkout** for premium membership and individual recipe purchase
- Payment success page with confirmation
- Transactions saved to `payments` collection
- Premium badge shown on dashboard after payment

---

## 🗄️ Database Collections

| Collection  | Purpose                          |
|-------------|----------------------------------|
| `users`     | User accounts and roles          |
| `recipes`   | All recipe data                  |
| `favorites` | User's saved favorite recipes    |
| `reports`   | Recipe reports submitted by users|
| `payments`  | Stripe payment records           |

---

## 🛠️ Tech Stack

### Frontend
- React.js
- next.js
- React Router DOM
- Tailwind CSS
- Framer Motion (animations)
- Stripe.js
- Axios
- TanStack Query (React Query)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Better Auth
- JWT (HTTPOnly Cookie)
- Stripe API
- imgbb (image hosting)

---

## 📦 NPM Packages Used

### Client
```
react, react-dom, react-router-dom, axios, @tanstack/react-query,
framer-motion, @stripe/stripe-js, @stripe/react-stripe-js,
tailwindcss, react-hot-toast, react-icons
```

### Server
```
express, mongoose, dotenv, cors, cookie-parser,
jsonwebtoken, stripe, better-auth, imgbb-uploader
```

---

## ⚙️ Environment Variables

### Client `.env`
```env
VITE_API_URL=https://your-server-url.com
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_IMGBB_API_KEY=your_imgbb_api_key
```

### Server `.env`
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
BETTER_AUTH_SECRET=your_better_auth_secret
CLIENT_URL=https://your-live-site-link.com
```

> ⚠️ Never expose `.env` files. All credentials are secured via environment variables.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Stripe account
- imgbb API key

### Clone & Setup

```bash
# Clone client
git clone https://github.com/your-username/recipehub-client.git
cd recipehub-client
npm install
npm run dev

# Clone server
git clone https://github.com/your-username/recipehub-server.git
cd recipehub-server
npm install
node index.js
```

> Create `.env` files in both folders using the variables listed above before running.

---

## 📄 API Endpoints (Key Routes)

| Method | Endpoint                  | Access   | Description                    |
|--------|---------------------------|----------|-------------------------------|
| GET    | `/recipes`                | Public   | Get all recipes (paginated)    |
| GET    | `/recipes/:id`            | Public   | Get single recipe details      |
| POST   | `/recipes`                | Private  | Add a new recipe               |
| PATCH  | `/recipes/:id`            | Private  | Update a recipe                |
| DELETE | `/recipes/:id`            | Private  | Delete a recipe                |
| POST   | `/favorites`              | Private  | Add recipe to favorites        |
| DELETE | `/favorites/:id`          | Private  | Remove from favorites          |
| POST   | `/reports`                | Private  | Report a recipe                |
| POST   | `/payments/create-intent` | Private  | Create Stripe payment intent   |
| GET    | `/admin/users`            | Admin    | Get all users                  |
| PATCH  | `/admin/users/:id/block`  | Admin    | Block/unblock a user           |
| PATCH  | `/recipes/:id/feature`    | Admin    | Mark recipe as featured        |

---

## 📱 Responsive Design

Fully responsive across:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

---

## 🌗 Theme

- Dark / Light mode toggle supported across all pages

---

## 📊 Challenge Features Implemented

- ✅ Dark/Light theme toggle
- ✅ Recipe filter by category (MongoDB `$in`)
- ✅ JWT with HTTPOnly Cookie
- ✅ Server-side pagination
- ✅ Framer Motion animations
- ✅ Stripe payment integration
- ✅ imgbb image upload
- ✅ Google OAuth

---

## 🤝 Contributing

This project was built as part of a selection assessment. Contributions are not open at this time.

---

## 📜 License

This project is for educational and assessment purposes only.

---

<p align="center">Made with ❤️ for RecipeHub Assessment</p>