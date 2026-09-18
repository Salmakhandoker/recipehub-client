# 🍽️ RecipeHub — Recipe Sharing Platform

RecipeHub is a premium, full-stack recipe sharing platform where food enthusiasts can create, discover, share, and manage culinary recipes. Users can publish their own creations, browse community uploads, save favorites, and unlock premium features or purchase individual recipes via Stripe integrations.

---

## 🌐 Live URL & Repositories
- 👉 **Live Deployment:** [RecipeHub Live](https://github.com/Salmakhandoker/recipehub-client)
- 🖥️ **Client Repository:** [GitHub - RecipeHub Client](https://github.com/Salmakhandoker/recipehub-client)
- 🛠️ **Server Repository:** [GitHub - RecipeHub Server](https://github.com/Salmakhandoker/recipehub-server)

---

## 🔑 Admin Credentials (Demo)

| Field    | Value                    |
|----------|--------------------------|
| Email    | `admin@gmail.com`        |
| Password | `Admin123!` (or matching) |

---

## ✨ Features

### 🤖 AI-Powered Features (Google Gemini 3.6 Flash)
- **AI Recipe Generator & Smart Auto-Fill ("Magic Chef"):** Create complete, structured recipes from an idea or prompt with 1-click auto-fill in the Add Recipe form.
- **Interactive AI Sous-Chef Assistant:** Contextual culinary assistant on each recipe page answering questions about ingredient substitutions, serving scaling, dietary swaps (vegan/gluten-free), and cooking techniques.
- **AI Pantry Chef ("What's In My Fridge?"):** Dedicated `/ai-chef` page where users input available fridge and pantry ingredients to generate personalized, delicious meals with zero food waste.

### 👤 User Features
- **Authentication:** Secure credential sign-up/log-in and Google OAuth via Better Auth.
- **Catalog Navigation:** Browse recipes by categories with server-side pagination.
- **Interactions:** Like, report, and save recipes to a personal favorites list.
- **Stripe Payments:** Buy premium recipes individually or purchase premium memberships.
- **User Limits:** Free users can add up to **2 recipes**, while premium members enjoy unlimited publishing.
- **Personal Dashboard:** Manage custom recipes (create, update, delete) and view bookmarks, purchases, and profile updates.

### 🛡️ Admin Features
- **Dashboard Stats:** Overview charts of users, recipes, reports, and membership transactions.
- **User Moderation:** Block or unblock user accounts.
- **Content Moderation:** Feature popular recipes on the home banner or delete/dismiss reported items.
- **Transaction Logs:** Complete tracking of Stripe payments.

---

## 🏠 Project Structure & Pages

### Public Pages
- **Home:** Hero section, Featured and Popular recipes grids with Framer Motion animations.
- **Browse Recipes:** All recipes displayed in card formats with category filters.
- **Recipe Details:** Detail views with buttons for booking, favoriting, purchasing, or reporting.

### Private Pages
- **User Dashboard:** Analytics cards, Add Recipe forms, My Listings, Favorites, and Profile Settings.
- **Admin Dashboard:** Admin stats overview, User Manager, Recipe Manager, Report logs, and Transactions list.

---

## 🛠️ Tech Stack

### Frontend & Rendering
- **Next.js 16 (App Router):** High-performance server and client rendering.
- **Tailwind CSS v4:** Clean, utility-first styling.
- **Framer Motion:** Smooth micro-animations.
- **Stripe.js:** Secure subscription checkout.
- **Axios & TanStack Query:** State management and server fetching.

### Backend & Database
- **Express.js / Node.js:** Robust server-side REST API.
- **MongoDB & Mongoose:** NoSQL database storing user profiles, recipes, favorites, reports, and payments.
- **Better Auth:** JWT sessions saved to HttpOnly Cookies.
- **imgbb-uploader:** Cloud image hosting.

---

## ⚙️ Environment Variables

### Client `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

### Server `.env`
```env
PORT=5001
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
BETTER_AUTH_SECRET=your_better_auth_secret_key
CLIENT_URL=http://localhost:3000
```

---

## 🚀 Step-by-Step Local Setup

### 1. Clone & Setup Client
```bash
git clone https://github.com/Salmakhandoker/recipehub-client.git
cd recipehub-client
npm install
npm run dev
```

### 2. Clone & Setup Server
```bash
git clone https://github.com/Salmakhandoker/recipehub-server.git
cd recipehub-server
npm install
node index.js
```

---

## 🧑‍💻 Author
**Salma Khandoker**  
*MERN Stack Web Developer*  
- GitHub: [@Salmakhandoker](https://github.com/Salmakhandoker)  
- LinkedIn: [Salma Khandoker](https://www.linkedin.com/in/salma-khandoker/)