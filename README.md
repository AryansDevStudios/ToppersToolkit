# 🧰 Topper's Toolkit

> Modern educational notes marketplace, custom print-on-demand platform, and academic resource management portal.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9.1-orange?style=flat&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Genkit](https://img.shields.io/badge/Genkit_AI-1.14.1-purple?style=flat&logo=google)](https://firebase.google.com/docs/genkit)
[![Status](https://img.shields.io/badge/Status-Active_Production-success)](#)

---

## Description

Topper's Toolkit is an end-to-end educational web platform engineered to provide students with high-quality school notes, structured curriculum materials, and seamless document printing services. Built with Next.js 15 (App Router and Server Actions) and powered by Firebase Firestore and Authentication, the platform bridges the gap between digital study guides and physical learning materials.

Students can browse comprehensive subject notes, bundle chapter materials into an interactive cart, choose between instant digital PDF access or physical printed deliveries, and checkout using Cash on Delivery (COD) or UPI. Educators and administrators manage curriculum uploads, track live orders, fulfill printing requests, and configure platform settings through a secure, passphrase-protected administration workspace.

---

## Key Features

- **Academic Curriculum Organization**: Browse study materials categorized by subject, subcategory, chapter, and document type (Handwritten Notes, Chapter Summaries, Question Banks, and Formula Sheets).
- **Dual Delivery Formats (PDF & Print)**: Flexibility for students to purchase immediate digital PDF access or order physical spiral-bound printed copies delivered directly to their doorstep.
- **Cart & Order Processing Pipeline**: Client-side cart state management (`useCart`) allowing students to aggregate study materials across subjects and place orders with custom instructions, student grade/class info, and WhatsApp contact details.
- **Payment & Checkout Modes**: Support for Cash on Delivery (COD) and UPI payment verification directly integrated into Server Action checkout routines.
- **Custom Document Print Service**: Dedicated on-demand printing request pipeline allowing learners to submit external documents or custom notes for physical printing with dynamic per-page cost calculations.
- **Secure Admin Command Center**: Passphrase-guarded `/admin` portal featuring dual-layer authentication (environment variable fallback with dynamic Firestore `settings/admin` override).
- **Administrative Operations Tabs**:
  - **Note Orders**: Real-time review and status tracking (`new` / `completed`) for customer note orders.
  - **Print Requests**: Queue management for incoming custom printing jobs.
  - **Note Uploader**: Structured publishing form to upload notes, assign subject hierarchies, and set pricing.
  - **Note Manager**: Instant catalog editor with publication visibility toggling (`published` vs `hidden`) and deletion confirmations.
  - **Platform Settings**: Dynamic admin passphrase rotation and per-page print rate configuration.
- **PWA & Offline Resilience**: Integrated offline detection view (`/fallback`) informing users when network connectivity is lost.
- **Modern Adaptive Interface**: Full light and dark mode theming (`next-themes`), Radix UI accessible primitives, Framer Motion transitions, and Lucide icons following a rigorous design system.

---

## Tech Stack

### Frontend & UI
- **Framework**: [Next.js 15.3.3](https://nextjs.org/) (App Router, Server Actions)
- **Library**: [React 18.3.1](https://react.dev/) & [React DOM](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4.1](https://tailwindcss.com/) & `tailwindcss-animate`
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (Tabs, Dialog, Collapsible, Accordion, Dropdown Menu, Slider, Switch, Toast)
- **Icons & Motion**: [Lucide React 0.475.0](https://lucide.dev/), [Framer Motion 11.5.1](https://www.framer.com/motion/)
- **Data Visualization**: [Recharts 2.15.1](https://recharts.org/), [Embla Carousel](https://www.embla-carousel.com/)

### Backend & Cloud
- **Database & Auth**: [Firebase 11.9.1](https://firebase.google.com/) (Firestore NoSQL, Firebase Authentication)
- **AI Engine**: [Google Genkit 1.14.1](https://firebase.google.com/docs/genkit) (`@genkit-ai/googleai`, `@genkit-ai/next`)
- **Hosting**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting) (`apphosting.yaml`)

### Validation & Forms
- **Forms**: [React Hook Form 7.54.2](https://react-hook-form.com/)
- **Schema Validation**: [Zod 3.24.2](https://zod.dev/) via `@hookform/resolvers`

---

## Getting Started

### Prerequisites
- **Node.js**: v18.18.0 or newer (v20+ recommended)
- **Package Manager**: `npm` (or `pnpm` / `bun`)
- **Firebase Project**: An active Firebase project with Firestore Database enabled.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AryansDevStudios/ToppersToolkit.git
   cd ToppersToolkit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file by copying the provided example:
   ```bash
   cp .env.example .env
   ```

   Populate your Firebase configuration and admin passphrase:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-firebase-auth-domain"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-firebase-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-firebase-storage-bucket"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-firebase-messaging-sender-id"
   NEXT_PUBLIC_FIREBASE_APP_ID="your-firebase-app-id"
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-firebase-measurement-id"
   ADMIN_PASSPHRASE="your-secure-admin-passphrase"
   ```

### Running the Application

- **Start Development Server** (Turbopack enabled):
  ```bash
  npm run dev
  ```
  The application will be live at `http://localhost:3000`.

- **Start Genkit AI Developer UI** (optional):
  ```bash
  npm run genkit:dev
  ```

- **Build for Production**:
  ```bash
  npm run build
  ```

- **Start Production Server**:
  ```bash
  npm run start
  ```

- **Run Linting & Type Checking**:
  ```bash
  npm run lint
  npm run typecheck
  ```

---

## Usage

### 1. User & Student Workflow
- Navigate to the home page to view subject cards or mobile application download options.
- Browse chapters and select desired material items (e.g. Science > Physics > Motion).
- Select between **PDF** (digital download) and **Printed** (spiral-bound physical delivery).
- Open the Cart (`/cart`), provide WhatsApp delivery details and preferred payment mode (COD or UPI), and confirm order submission.

### 2. Setting Up the Admin Portal
The admin portal is accessible at `/admin`. Authentication can be managed via:
1. **Environment Variable**: Set `ADMIN_PASSPHRASE` in your `.env` file.
2. **Dynamic Firestore Override**:
   - In the Firebase Console, navigate to **Firestore Database**.
   - Create a collection named `settings`.
   - Create a document with ID `admin`.
   - Add a string field `passphrase` with your desired secret key.
   - The application dynamically prioritizes the Firestore passphrase over the environment fallback.

---

## Project Structure

```
ToppersToolkit/
├── .env.example              # Sample environment configuration
├── apphosting.yaml           # Firebase App Hosting deployment specs
├── DESIGN_SPEC.md            # Component and design system specifications
├── next.config.ts            # Next.js configuration (caching, images)
├── package.json              # Scripts and project dependencies
├── tailwind.config.ts        # Tailwind CSS styling and theme setup
├── tsconfig.json             # TypeScript configuration
├── docs/
│   └── blueprint.md          # Architectural blueprints and style guides
└── src/
    ├── app/                  # Next.js App Router pages
    │   ├── admin/page.tsx    # Admin portal entry point
    │   ├── auth/page.tsx     # Admin passphrase login interface
    │   ├── fallback/page.tsx # Offline PWA fallback view
    │   ├── layout.tsx        # Global root layout with theme providers
    │   ├── page.tsx          # Homepage / app portal
    │   └── terms/page.tsx    # Terms & conditions view
    ├── components/           # Reusable application components
    │   ├── AdminTabs.tsx     # 5-tab admin management dashboard
    │   ├── NoteManager.tsx   # Study note CRUD editor & visibility toggle
    │   ├── NoteUploader.tsx  # Curriculum publishing form
    │   ├── OrderList.tsx     # Order fulfillment management
    │   ├── PrintForm.tsx     # On-demand custom printing request form
    │   ├── SubjectCard.tsx   # Academic subject visual card
    │   └── ui/               # Radix UI + Tailwind primitive components
    ├── context/
    │   └── cart-context.tsx  # React context for shopping cart state
    ├── hooks/
    │   ├── use-cart.ts       # Hook for managing cart items and formats
    │   └── use-toast.ts      # Toast notification trigger hook
    ├── lib/
    │   ├── actions.ts        # Server Actions (order placement, updates)
    │   ├── auth.ts           # Admin authentication verification
    │   ├── auth-actions.ts   # Login and session termination actions
    │   ├── data.ts           # Firestore queries & mutation helpers
    │   └── firebase.ts       # Client Firebase SDK initialization
    └── types/
        └── index.ts          # Core data models (Subject, NoteItem, Order)
```

---

## Contributing

Contributions, bug reports, and suggestions are welcome!
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## License

This project is maintained by [Aryan Gupta](https://github.com/AryansDevStudios). All rights reserved. Educational materials and notes are curated for student study use.
