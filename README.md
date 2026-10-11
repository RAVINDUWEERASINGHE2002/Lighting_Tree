# Lighting Tree POS 🍃✨

A complete, production-quality, mobile-first Point of Sale (POS) and Partner Financial Ledger web application designed specifically for **Lighting Tree**, a food and drinks shop located opposite the bus stand in Thanamalwila, Sri Lanka.

Built with **React + Vite + TypeScript**, **Tailwind CSS**, and **Firebase** (Free Spark Plan). Installable as a Progressive Web App (PWA) on phones, tablets, and desktop POS terminals.

---

## 🏬 Business Context

- **Shop Name**: Lighting Tree
- **Address**: Lighting Tree, Opposite Busstand, Thanamalwila, Sri Lanka
- **Phone**: +94 707504455
- **Currency**: Sri Lankan Rupees (`Rs` / `LKR`)
- **Timezone**: `Asia/Colombo`
- **Partners**:
  1. **Madhawa**: Cashier & Day-to-Day Shop Manager (30% share)
  2. **Sandeep**: Partner & Financial Investor (30% share)
  3. **Fab**: Foreign Partner & Financial Investor (30% share)
- **Business Account**: 10% retained reserve fund

---

## 📸 Screenshots & UI Preview

```
┌────────────────────────────────────────────────────────────────────────┐
│  🍃 Lighting Tree POS   [Thanamalwila Landscape Banner]   [Madhawa ▼] │
├────────────────────────────────────────────────────────────────────────┤
│ [Billing] [Items] [Expenses] [Advances] [Reports] [Settings]           │
├─────────────────────────────────────┬──────────────────────────────────┤
│ ITEM MENU (Category Filter & Search)│ CURRENT BILL (Live Order)        │
│ ┌───────────────┐ ┌───────────────┐ │ • Kithul Hakuru (x2)   Rs  300   │
│ │ Kithul Hakuru │ │ Veg Egg Toast │ │ • Egg Sandwich (x1)    Rs  350   │
│ │    Rs 150     │ │    Rs 350     │ │   [@Rs 350 - Override]       │
│ └───────────────┘ └───────────────┘ │ • Woodapple Juice (x2) Rs  500   │
│ ┌───────────────┐ ┌───────────────┐ ├──────────────────────────────────┤
│ │ Woodapple Jce │ │ Ceylon Tea    │ │ Payment: [Cash] [Card] [Transfer]│
│ │    Rs 250     │ │    Rs 90      │ │ GRAND TOTAL:          Rs 1,150   │
│ └───────────────┘ └───────────────┘ │ [  🖨️ SAVE & PRINT RECEIPT   ]   │
└─────────────────────────────────────┴──────────────────────────────────┘
```

---

## 🚀 Key Features

### 1. 💳 Fast Cashier Billing & Touch POS
- Large touch-friendly grid with category filters (*Food*, *Beverages*, *Sweets*, *Snacks*, *Specials*) and instant search.
- Active bill builder with quantity `+` / `-` buttons, item removal, and full bill clear.
- **Line Price Override**: Cashier can override the price of any line item for the current bill with a single tap.
- **Save & Print**: Saves sale record to Firestore and opens print dialog automatically.
- **Today's Bills History**: View all sales generated today, reprint thermal receipts, and delete/void bills with confirmation.

### 2. 🖨️ Thermal Receipt Printing (58mm & 80mm)
- Dedicated `@media print` CSS formatted for standard thermal receipt printers (POS-58, Xprinter, Epson TM series, Sunmi Android POS).
- Formatted with shop header, Thanamalwila address, telephone number, bill number, timestamp, cashier name, itemized table, grand total, and *"Thank you! Come again"*.

### 3. 📋 Real-time Item Management
- Add, edit name/price, delete items with confirmation dialogs.
- **Instant In-List Price Changes**: Tap any price directly in the table, type the new price, and press Enter or blur to save immediately without modal popups.
- Hide/Show toggle to temporarily take out-of-stock items off the POS screen.

### 4. 💸 Expenses & Reimbursable Investments
- Record all shop purchases (bread, fresh vegetables, gas cylinder refilling, equipment).
- **Payer Attribution**: Specify who paid: `Business` (shop cash drawer) or out-of-pocket by `Sandeep`, `Fab`, or `Madhawa`.
- Any money paid by a partner from their personal funds is **automatically credited back** to that partner in the final financial settlement.

### 5. ⚡ Partner Advances
- Record advance cash draws taken by partners (Partner, Date, Amount, Reason).
- Advances are **automatically deducted** from that partner's account balance.

### 6. 📊 Daily Profit & Partner Ledger Engine
Pure calculation engine (`src/utils/calculations.ts`) with 100% test coverage:
$$\text{Daily Profit} = \text{Total Sales} - \text{Daily Expenses} - \text{Daily Utilities (Rs 250)} - \text{Daily Rent (Monthly Rent} / 30)$$
- **Business Account**: 10% of profit retained for shop reserves.
- **Partners Share**: Remaining 90% split equally (30% each to Sandeep, Fab, and Madhawa).
- **Partner Account Balance**:
  $$\text{Balance} = \sum(\text{Profit Shares}) + \sum(\text{Expenses Paid Out-of-Pocket}) - \sum(\text{Advances Taken})$$
- Correctly handles negative profit days (operating shortfall absorbed equally by partners).
- Mobile-friendly reports page with date range filter (*Today*, *This Month*, *Custom Range*).
- **Month-End Report Exports**:
  - Printable layout with partner verification signature lines.
  - One-click **CSV Export**.
  - One-click **PDF Export** (generated with `jspdf` & `jspdf-autotable`).

### 7. 🌓 Modern UI & Thanamalwila Branding
- Custom SVG logo for "Lighting Tree" (green canopy adorned with warm glowing lights).
- Custom illustrated landscape header of Thanamalwila (hills, trees, warm sun), with simple drop-in replacement for a real photo (`src/assets/hero.jpg` or `public/hero.jpg`).
- Dark mode & Light mode toggle with automatic preference detection.
- Installable PWA with offline caching and service worker.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS, Lucide React
- **Backend / Database**: Firebase Cloud Firestore (real-time listeners via `onSnapshot`)
- **Authentication**: Firebase Authentication (Email/Password)
- **PDF & Exports**: `jspdf`, `jspdf-autotable`
- **PWA**: `vite-plugin-pwa`
- **Testing**: Vitest (`vitest run`)
- **Code Quality**: ESLint, Prettier

---

## 📦 Local Installation & Running

### Prerequisites
- Node.js (v18, v20, or v22)
- npm (v9+)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/lighting-tree-pos.git
   cd lighting-tree-pos
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Note: The app runs in Demo Mode out of the box with realistic sample data even before you configure Firebase keys!)*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Run the Unit Test Suite**:
   ```bash
   npm test
   ```

6. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🔥 Firebase Setup Guide (Free Spark Plan)

Follow these steps to connect your live Firebase project:

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it `lighting-tree-pos`.
3. Disable Google Analytics (optional, not needed for Spark plan).
4. Click **Create project**.

### Step 2: Enable Cloud Firestore
1. In the left sidebar, click **Build > Firestore Database**.
2. Click **Create database**.
3. Choose location (e.g. `asia-south1` Mumbai for fastest Sri Lanka latency).
4. Start in **Production mode** or **Test mode**.
5. Copy the security rules from `firestore.rules` in this repo and paste them in the **Rules** tab, then click **Publish**.

### Step 3: Enable Authentication
1. In the left sidebar, click **Build > Authentication**.
2. Click **Get started**, then choose **Email/Password**.
3. Enable **Email/Password** and click **Save**.
4. In the **Users** tab, add the 3 partner accounts:
   - `sandeep@lightingtree.lk`
   - `fab@lightingtree.lk`
   - `madhawa@lightingtree.lk`
   Assign secure initial passwords and share them with the partners.

### Step 4: Register Web App & Get API Keys
1. In Project Settings (gear icon in left sidebar), scroll down to **Your apps**.
2. Click the **Web** icon (`</>`).
3. App nickname: `Lighting Tree Web POS`.
4. Click **Register app**.
5. Copy the configuration keys into your `.env` file:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=lighting-tree-pos.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=lighting-tree-pos
   VITE_FIREBASE_STORAGE_BUCKET=lighting-tree-pos.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:...
   ```
6. Restart your dev server (`npm run dev`). The top navbar will display a green **Cloud** badge, indicating live Firebase sync!

---

## 🚀 Deployment

### Option A: Deploy to Vercel (Recommended, 1-Click)
1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **New Project**.
3. Import `lighting-tree-pos`.
4. In **Environment Variables**, paste the `VITE_FIREBASE_*` variables from your `.env`.
5. Click **Deploy**. Vercel will build and serve your app globally with free SSL and automatic PWA support!

### Option B: Deploy to Firebase Hosting (Free Spark Tier)
1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in and initialize:
   ```bash
   firebase login
   firebase init hosting
   ```
   - Select your Firebase project.
   - Public directory: `dist`
   - Configure as single-page app: `Yes`
   - Set up automatic builds with GitHub: `No` (or `Yes` if desired)
3. Build and deploy:
   ```bash
   npm run build
   firebase deploy --only hosting,firestore:rules
   ```

---

## 🖨️ Thermal Receipt Printing Guide

To print receipts on 58mm or 80mm thermal printers:
1. Connect your thermal printer to your computer, phone, or tablet (USB, Bluetooth, or Network).
2. On the Cashier screen, click **Save & Print Receipt**.
3. In the browser print dialog:
   - **Destination**: Select your thermal printer (e.g. *POS-58* or *POS-80*).
   - **Paper Size**: Choose `58mm` or `80mm` (matching your printer settings in Settings tab).
   - **Margins**: Set to **None** or **Minimum**.
   - **Options**: Uncheck *Headers and footers* (removes browser URL and date headers).
4. Click **Print**.

---

## 📁 Project Architecture

```
src/
├── assets/                  # Hero illustration & brand images
├── components/
│   ├── advances/            # Advance list & modal
│   ├── billing/             # Active bill, item grid, thermal receipt, history
│   ├── common/              # SVG Logo, Modal, ConfirmModal, Toast
│   ├── expenses/            # Expense list & modal
│   ├── items/               # Item list with direct inline price edit & form
│   ├── layout/              # Navbar with Thanamalwila backdrop & tab navigation
│   ├── reports/             # Partner balance cards & daily ledger table
│   └── settings/            # Shop settings & parameters
├── config/
│   └── firebase.ts          # Firebase init with dual-mode fallback
├── context/
│   ├── AppContext.tsx       # Live items, bills, expenses, advances, settings
│   └── AuthContext.tsx      # Partner login and demo switching
├── pages/
│   ├── BillingPage.tsx
│   ├── ItemsPage.tsx
│   ├── ExpensesPage.tsx
│   ├── AdvancesPage.tsx
│   ├── ReportsPage.tsx
│   ├── SettingsPage.tsx
│   └── LoginPage.tsx
├── services/
│   ├── authService.ts       # Firebase Auth & demo authentication
│   └── dataService.ts       # Firestore real-time sync & local demo storage
├── types/
│   └── index.ts             # TypeScript definitions
└── utils/
    ├── calculations.ts      # Pure profit and partner settlement logic
    ├── calculations.test.ts # Vitest unit test suite
    ├── exportUtils.ts       # CSV & PDF generation
    └── formatters.ts        # Currency (Rs) & Asia/Colombo date formatters
```

---

## 📄 License

Proprietary — Created exclusively for **Lighting Tree**, Thanamalwila, Sri Lanka.
