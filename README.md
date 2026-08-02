# sancart Frontend

A premium, responsive, and high-conversion e-commerce web application front-end interface. Optimized for smooth user experiences, responsive layouts, and interactive animations.

---

## Folder Structure & Meaning

A quick guide to the directory layout for new developers:

```
frontend/
├── public/                 # Static assets (images, logos, icons)
├── src/
│   ├── components/         # Reusable UI widgets & layout sections
│   │   ├── Header.jsx      # Navigation bar (Glassmorphism & Drawer layout)
│   │   ├── AddProduct.jsx  # Admin form to add new products with uploads
│   │   └── ...
│   ├── pages/              # Main router page views
│   │   ├── Home.jsx        # Landing page with collections
│   │   ├── Shop.jsx        # Product catalog grid with filters
│   │   ├── CartPage.jsx    # User shopping cart and item quantity controls
│   │   ├── ProductPage.jsx # Individual product details and reviews
│   │   ├── LoginPage.jsx   # Auth login page with validation checks
│   │   ├── RegisterPage.jsx# Auth registration page with validation checks
│   │   ├── UserOrders.jsx  # Purchase history display
│   │   └── AdminOrders.jsx # Admin dashboard for managing all orders
│   ├── utils/              # Client utility functions & helpers
│   │   ├── toast.js        # Centralized toast notification system
│   │   └── saveOrder.js    # Utility to request order creation post-checkout
│   ├── validators/         # Schemas matching backend payload requirements
│   │   └── authValidator.js# Auth form validation schemas
│   ├── App.jsx             # Router and global layout bindings
│   └── main.jsx            # Entrypoint binding React to index.html
├── index.html              # Main HTML frame
├── tailwind.config.js      # Custom theme grids, fonts, and colors
└── package.json            # Frontend dependency manifest
```

---

## Client-Side Validation

To prevent unnecessary API requests and provide instant feedback, we run data validations directly on the frontend before submitting any requests to the server:

1. **Schemas:** Located in `src/validators/`.
2. **Display:** Validation errors are mapped to local states, displaying red indicator styles and descriptions directly under the affected form inputs.

---

## Technologies Used

* **Framework:** React (Vite-powered)
* **Styling:** Tailwind CSS (curated palettes, custom borders, transitions)
* **Icons:** React Icons (`Fi`, `Fa`, `Ai`, `Bs`)
* **Animations:** Framer Motion (micro-interactions & page transitions)
* **API Fetching:** Axios

---

## Getting Started

### 1. Environment Variables Configuration
Configure a `.env` file in the root of the frontend directory pointing to the server API URL.

### 2. Installation
Install project dependencies:
```bash
npm install
```

### 3. Run Locally
Start the local development server:
```bash
npm run dev
```
