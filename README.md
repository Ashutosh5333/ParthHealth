# RAGA Healthcare Platform
### B2B Healthcare SaaS Frontend — React + TypeScript + Redux Toolkit

A production-grade healthcare management platform with authentication, analytics, patient management, and real-time notifications.

---

## 🚀 Quick Start

```bash
npm install
npm run dev        # Start dev server at localhost:3000
npm run build      # Production build
npm run preview    # Preview production build
```

## 🔑 Demo Login Credentials

| Role   | Email                   | Password     |
|--------|-------------------------|--------------|
| Admin  | admin@raga.health       | Admin@123    |
| Doctor | doctor@raga.health      | Doctor@123   |
| Nurse  | nurse@raga.health       | Nurse@123    |

---

## 🏗 Architecture

```
src/
├── store/                    # Redux Toolkit state management
│   ├── index.ts              # Store configuration
│   └── slices/
│       ├── authSlice.ts      # Auth state + async thunks
│       ├── patientsSlice.ts  # Patient data, view mode, filters
│       └── notificationsSlice.ts
├── pages/
│   ├── LoginPage.tsx         # Authentication with role quick-fill
│   ├── DashboardPage.tsx     # KPIs, critical patients, activity feed
│   ├── AnalyticsPage.tsx     # Recharts: Area, Bar, Pie, Line charts
│   ├── PatientsPage.tsx      # Grid/List toggle, search, filter
│   └── PatientDetailPage.tsx # Full patient record with vitals
├── components/layout/
│   ├── AppLayout.tsx         # Protected route wrapper + Outlet
│   ├── Sidebar.tsx           # Navigation + user card
│   └── Header.tsx            # Notifications panel + test alert
├── hooks/
│   └── redux.ts              # Typed useAppDispatch / useAppSelector
├── types/index.ts            # TypeScript interfaces
├── utils/
│   ├── mockData.ts           # 8 patients + analytics data
│   └── notificationService.ts # SW + browser push notifications
└── styles/globals.css        # Design system CSS variables
public/
└── sw.js                     # Service Worker (install/fetch/push/click)
```

---

## ✅ Features Implemented

### 1. Authentication
- Firebase Auth simulation via Redux AsyncThunk
- Session persistence via `localStorage`
- Auto-restore on page reload (`restoreSession` action)
- Validation, error states, loading spinner
- Role-based access: admin / doctor / nurse

### 2. Pages
| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Secure auth with demo quick-fill |
| Dashboard | `/dashboard` | Live KPIs, critical patients, doctors on duty |
| Analytics | `/analytics` | 5 chart types, KPIs, bed utilization |
| Patients | `/patients` | Searchable grid/list with status filters |
| Patient Detail | `/patients/:id` | Full record: vitals, meds, allergies, timeline |

### 3. Patient Module
- **Grid View**: Card layout with vitals, status badges, condition
- **List View**: Compact table with all key fields
- **Toggle**: Redux-persisted view preference (`setViewMode`)
- **Search**: Real-time filter by name, ID, or condition
- **Filter Pills**: All / Critical / Stable / Recovering / Discharged

### 4. Notifications (Service Worker)
- `sw.js` handles: install, activate, fetch (cache), push events, notification click
- `NotificationService` class: permission request, local + push notifications
- **Test Alert** button in header triggers OS-level browser notification
- Redux notification panel with unread count badge and mark-all-read
- Auto-dispatch of a critical alert 3s after dashboard loads (simulating real-time)

### 5. State Management (Redux Toolkit)
```
authSlice      → user, isAuthenticated, loading, error
patientsSlice  → patients[], viewMode, searchQuery, statusFilter, selectedPatient
notificationsSlice → notifications[], panelOpen
```

---

## 🎨 Design System

- **Color Palette**: Dark navy base (`#050b14`) with teal accent (`#00d4aa`)
- **Typography**: Syne (display/headings) + DM Sans (body)
- **Status Colors**: Critical=red, Stable=blue, Recovering=yellow, Discharged=purple
- **CSS Variables**: All tokens in `globals.css` for easy theming
- **Responsive**: Works on desktop and tablet

---

## 🌐 Deploy to Vercel

```bash
# Option 1: CLI
npm install -g vercel
vercel --prod

# Option 2: GitHub
# Push to GitHub → Import project in vercel.com → Auto-detects Vite
```

Add `vercel.json` for SPA routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 🧩 Bonus Features Implemented

- ✅ **Reusable components**: `StatusBadge`, `VitalCard`, `StatCard`, `PatientGridCard`, `PatientListRow`
- ✅ **Clean folder structure**: Scalable with clear separation of concerns
- ✅ **Performance**: `useMemo` for patient filtering, CSS-only animations
- ✅ **TypeScript**: Fully typed — interfaces, generics, typed hooks, enums
- ✅ **UX polish**: Hover states, smooth transitions, loading states, empty states

---

## Tech Stack

- **React 18** + **TypeScript**
- **Redux Toolkit** (state management)
- **React Router v6** (routing + protected routes)
- **Recharts** (data visualization)
- **Vite** (bundler)
- **Service Worker API** (push notifications)
- **CSS Variables** (design tokens)
