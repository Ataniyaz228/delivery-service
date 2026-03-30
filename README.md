<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/zap.svg" width="60" alt="JetDelivery Logo"/>
  <h1>JetDelivery</h1>
  <p>Modern, High-Performance Food Delivery Web Application</p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  </div>
</div>

<br/>

JetDelivery is a premium, full-stack food delivery service built specifically for fast performance, robust order tracking, and a seamless administrative experience.

## System Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19 | Server-side rendering, UI components, caching |
| **Styling** | Vanilla CSS, Lucide Icons | Custom design system (`Amber & Charcoal`), zero-runtime CSS |
| **Backend** | Next.js API Routes | RESTful API for auth, orders, and products |
| **Database** | Neon (Serverless Postgres) | ACID-compliant persistent storage |
| **ORM** | Drizzle ORM | Type-safe schema definition and querying |
| **Auth** | NextAuth.js (Credentials Provider) | Secure user authentication and role management |

## Key Features

### For Customers
*   **Global Cart System:** LocalStorage-persisted cart accessible from a sliding drawer across all pages.
*   **Live Order Tracking:** 4-step progressive tracker (`Pending` -> `Confirmed` -> `Delivering` -> `Delivered`).
*   **Optimized Catalog:** Sticky sidebar with real-time filtering (categories, price sliders, stock availability) and sorting.
*   **One-Click Checkout:** Streamlined 3-step checkout process with integrated order summary.
*   **Toast Notifications:** Real-time feedback for all user actions without interrupting the flow.

### For Administrators
*   **Multi-Tab CRM Dashboard:** Dedicated admin panel with KPI metrics (Gross Revenue, Daily Orders).
*   **Order Management:** Searchable table with detail modals and instant status updates.
*   **Inventory Control:** Inline editing for product stock, pricing, and image URLs.
*   **User Management:** Modify user roles directly from the interface.

## Database Schema

| Table | Description | Relations |
| :--- | :--- | :--- |
| `users` | Accounts, roles (`admin`, `customer`), and auth | 1:N with `orders` |
| `categories`| Product categorizations and UI settings | 1:N with `products` |
| `products` | Inventory details, pricing, and images | 1:N with `categories`, 1:N with `orderItems` |
| `orders` | Order state, delivery address, and total amount | 1:N with `users`, 1:N with `orderItems` |
| `orderItems`| Snapshot of product quantity and price at purchase | 1:1 with `products`, 1:1 with `orders` |

## Getting Started

Follow these steps to set up the project locally.

### 1. Requirements

Ensure you have the following installed on your local machine:
*   [Node.js](https://nodejs.org/en/) (v18.17 or newer)
*   [pnpm](https://pnpm.io/) (v9 or newer)
*   A running PostgreSQL database instance (or a Neon DB URL)

### 2. Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```bash
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secure_random_string_here
```

### 3. Installation & Setup

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm db:push

# Seed the database with initial categories and products (optional)
pnpm db:seed
```

### 4. Running the Development Server

```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Deployment

This project is optimized for deployment on Vercel. Connect your repository to Vercel and ensure the following environment variables are mapped in your project settings:
*   `DATABASE_URL`
*   `NEXTAUTH_URL`
*   `NEXTAUTH_SECRET`

---
*Built with modern web standards for speed and reliability.*
