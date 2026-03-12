# JN Medical Suppliers

A modern e-commerce website for medical supplies built with Next.js 16, Firebase, and Tailwind CSS.

## Features

- **Product Catalog**: Browse and search medical supplies
- **Shopping Cart**: Add products, manage quantities
- **User Authentication**: Sign up, login with Firebase Auth
- **Order Management**: Place orders, track order history
- **Admin Panel**: Manage products and orders (admin only)
- **Indian Rupee Pricing**: All prices displayed in ₹ INR

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Email/Password)
- **State Management**: Zustand
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Firebase account with a project set up

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Create a `.env` file with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment on Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add the environment variables in Vercel dashboard
4. Deploy!

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── admin/          # Admin panel
│   ├── cart/           # Shopping cart
│   ├── checkout/       # Checkout flow
│   ├── login/          # Login page
│   ├── orders/         # Order history
│   ├── product/        # Product details
│   ├── profile/        # User profile
│   ├── settings/       # User settings
│   └── signup/         # Sign up page
├── components/
│   ├── layout/         # Header, Footer, Providers
│   ├── products/       # Product components
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and Firebase config
└── store/              # Zustand store (cart)
```

## Contact

- **Phone**: +91 8840989780
- **Email**: jnmedicalsuppliers@gmail.com
- **Address**: Padari Bazar, Mohanapur, Gorakhpur, 274701, India

## License

Private - All rights reserved.
