# 📊 StoreFront — E-Commerce Analytics & Product Dashboard

A full-stack e-commerce analytics and product management dashboard engineered for real-time inventory tracking, sales metrics visualization, state synchronization, and dynamic data filtering.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://nxt-store-ecommerce.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/muge-yilmaz/StoreFront-E-commerce-Analytics-Product-Dashboard)

---

## 🚀 Key Features

### 📈 Data Visualization & Analytics
- **Real-Time Metrics:** Interactive charts and key performance indicator (KPI) cards displaying sales trends, user acquisition, and inventory status.
- **Dynamic Filtering & Search:** Client-server hybrid data fetching for rapid product search, category categorization, and stock filtering.

### 🛍️ Product Management System
- **CRUD Operations:** Complete catalog management allowing store admins to create, update, reorder, and archive product entries.
- **State Synchronization:** Optimistic UI updates ensuring smooth user feedback during data mutation steps.

### ♿ Accessibility & UI/UX Design
- **Responsive Dashboard:** Pixel-perfect grid layout tailored for desktop and mobile viewports using Tailwind CSS.
- **WCAG 2.1 Accessibility:** Built with high contrast, keyboard navigation, and screen-reader compliant semantic elements.

---

## 🛠 Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React, Next.js (App Router), TypeScript, Tailwind CSS |
| **Backend & DB** | Node.js, RESTful APIs, MongoDB Atlas / Prisma ORM |
| **State & Analytics** | React State / Context, Charting Libraries |
| **UI/UX Standards** | Responsive Grid, WCAG 2.1 Web Accessibility |
| **Deployment** | Vercel |

---

## ⚙️ Architecture & Data Flow


```

[ Client / Dashboard ]
│
├──► Next.js App Router (SSR & Analytics Views)
│         │
│         ├──► Type-Safe REST APIs / Data Layer
│         └──► MongoDB Atlas (Inventory & Sales Persistence)
│
[ Interactive Charts ] ──► Dynamic State Filtering & Analytics Pipeline

```

---

## 💻 Local Setup & Installation

Follow these steps to run the dashboard locally:

### 1. Clone the Repository
```bash
git clone [https://github.com/muge-yilmaz/StoreFront-E-commerce-Analytics-Product-Dashboard.git](https://github.com/muge-yilmaz/StoreFront-E-commerce-Analytics-Product-Dashboard.git)
cd StoreFront-E-commerce-Analytics-Product-Dashboard

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI="your-mongodb-atlas-connection-string"
NEXT_PUBLIC_API_URL="http://localhost:3000"

```

### 4. Launch Development Server

```bash
npm run dev

```

Open `http://localhost:3000` in your browser.

---

## 👩‍💻 Author & Contact

**Müge Yılmaz** — Full-Stack AI Developer & UI/UX Engineer

* **Email:** [mugeyilmaz.web@gmail.com](https://www.google.com/search?q=mailto%3Amugeyilmaz.web%40gmail.com)
* **LinkedIn:** [linkedin.com/in/muge-yilmaz](https://linkedin.com/in/muge-yilmaz)
* **GitHub:** [github.com/muge-yilmaz](https://github.com/muge-yilmaz?)
