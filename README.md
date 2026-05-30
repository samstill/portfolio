# Portfolio & Event Booking Platform

Welcome to the **Portfolio & Event Booking Platform**—a sleek, modern React + Vite application designed for showcasing professional work, discovering events, making real-time ticket bookings, and verifying scanned codes. It features a complete Clean Architecture client design with a rich UI, powered by Firebase and Razorpay.

For deep technical details about the Clean Architecture implementation, database schemas, and workflows, please refer to the [ARCHITECTURE.md](file:///C:/Users/harsh/Documents/antigravity/proud-faraday/ARCHITECTURE.md).

---

## 🚀 Key Features

*   **Custom Portfolio Landing**: Interactive home screen featuring smooth parallax scrolling effects and dynamic mesh gradients.
*   **Anonymous Messaging**: An interactive submission form on the landing page footer allowing users to send anonymous messages to the administrator.
*   **Event Exploration**: Clean event grid with custom filtering, search functionality, and real-time remaining seat subscriptions.
*   **Secure Ticket Booking**: Real-time payments integration using **Razorpay Checkout** and seat reservation mechanisms.
*   **Digital Tickets**: Generates printable PDF tickets using client-side HTML canvas rendering, equipped with secure base64 QR codes.
*   **Admin QR Validation**: Administrative scanning screen powered by `html5-qrcode` to scan tickets at physical checkpoints and run validation transactions on database.
*   **Real-time Messenger**: Fully functional direct messaging chat UI supporting end-to-end user lookups, active typing indicators, and message status tags.
*   **AI Event Assistant**: Event copywriter tool that allows admins to generate optimized description text using Deepseek and Google Gemini models.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Core Framework** | React v18, TypeScript, Vite v6 | Fast compilation, static typing, and HMR module systems. |
| **Styling & Animation** | Styled Components, Framer Motion, react-spring | Dynamic layouts, mesh gradients, and complex parallax physics. |
| **Database & Auth** | Firebase (Auth, Firestore, Cloud Functions, Storage) | Offline persistence cache, role management, and admin SDK calls. |
| **Payment Gateway** | Razorpay Client SDK | Secure, fast checkout workflows mapped in Indian Rupees (₹). |
| **Utilities** | html5-qrcode, jsPDF, html2canvas | Scanner cameras, QR image encoding, and PDF exports. |

---

## ⚙️ Environment Configuration

To run the application, create a `.env` file in the root directory (or use `.env.production` for production builds) with the following environment variables:

```ini
# Firebase Configs
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Emulator controls (for offline/dev environments)
VITE_USE_FIREBASE_EMULATOR=false

# Razorpay credentials
VITE_RAZORPAY_KEY=your_razorpay_key_id
VITE_RAZORPAY_SECRET=your_razorpay_key_secret

# AI Integration APIs
VITE_GOOGLE_API_KEY=your_google_gemini_api_key
```

---

## 💻 Available Scripts

Run the following npm scripts in your workspace folder:

### Development Server
Starts the Vite dev server locally on port 3000.
```bash
npm run dev
```

### Production Build
Compiles TypeScript code and packages assets into the `dist/` directory.
```bash
npm run build
```

### Lint Checks
Audits source code formatting and potential code issues using ESLint.
```bash
npm run lint
```

### Preview Build
Serves the local production build built in `dist/` for manual testing.
```bash
npm run preview
```

### Deploy to GitHub Pages
Builds the website and deploys the build artifacts to `gh-pages` branch.
```bash
npm run deploy
```

---

## 🌐 Deployment Details

### Frontend Deployment
*   **Vercel**: Deploy the client directory directly by adding Firebase env settings in Vercel settings panel (controlled by [vercel.json](file:///C:/Users/harsh/Documents/antigravity/proud-faraday/vercel.json)).
*   **Firebase App Hosting / Firebase Hosting**: Control redirects and rewrite rules using [firebase.json](file:///C:/Users/harsh/Documents/antigravity/proud-faraday/firebase.json).
*   **GitHub Pages**: Deployed via the gh-pages module using `npm run deploy` (requires setting up [CNAME](file:///C:/Users/harsh/Documents/antigravity/proud-faraday/public/CNAME) for your domain).

### Cloud Functions
To deploy the administrative Cloud Functions (e.g. `deleteUser`), run:
```bash
cd functions
npm run deploy
```
Make sure you have authorized access with your Firebase CLI project credentials.
