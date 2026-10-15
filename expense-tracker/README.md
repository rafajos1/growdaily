# Spendwise — Expense Tracker

A modern, responsive personal expense tracker built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. Data is stored in your browser's `localStorage`. There is no backend and no account.

## Features

- **Add, edit and delete expenses** with date, amount, category and description
  - Validation on blur and on submit (required fields, valid amounts with ≤ 2 decimals, no future dates, max length)
  - Native date picker and a category picker with icons
  - Delete confirmation plus an **Undo** toast
- **Dashboard**
  - Summary cards: total spending, this month (with % change vs. last month), daily average, top category
  - Monthly spending bar chart (last 6 months), category donut chart, daily spending chart for this month
  - Recent expenses
- **Expense list**
  - Search the description text, filter by category and date range, with quick ranges (This month, Last month, Last 30 days, This year)
  - Sort by date or amount; running count and total of filtered results
  - "Show more" pagination
- **CSV export** of the currently filtered list. The file is Excel-friendly, with UTF-8 BOM, RFC 4180 escaping and protection against formula injection
- **Loading skeletons, empty states, toasts, error boundary**, and a banner if browser storage is unavailable or corrupt
- **Mobile-first layout** with bottom navigation and a floating "add" button; the dialogs work with the keyboard and screen readers
- Open tabs stay in sync with each other; you can load sample data to try it out quickly

## Getting started

Requirements: Node.js 18.17+ (Node 20+ recommended).

```bash
cd expense-tracker
npm install
npm run dev          # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

Quality checks:

```bash
npm run typecheck    # TypeScript
npm run lint         # ESLint (next/core-web-vitals)
npm test             # Vitest unit tests for validation, filters, analytics, CSV, storage
```

## Manual test walkthrough

1. **Empty state.** Open the dashboard. You'll see a welcome card with *Add your first expense* and *Load sample data*.
2. **Validation.** Click **Add expense** and submit the empty form. Each field shows an error. Type `abc` or `1.234` in Amount, or pick a future date, to see the specific messages.
3. **Add.** Enter `42.50`, pick **Food**, type "Team lunch", and submit. A success toast appears and the dashboard updates.
4. **Persistence.** Refresh the page. The expense is still there.
5. **Sample data.** Go to **Expenses** → *Delete all data* (bottom), then *Load sample data* to get about 70 expenses spread over 6 months.
6. **Search and filter.** Type "internet", choose a category, click **Last 30 days**, or set custom From/To dates. If From is after To, you get an inline error. Use **Clear filters** to reset.
7. **Sort.** Switch between newest, oldest, highest and lowest.
8. **Edit.** Hover a row (or tap on mobile) → pencil icon → change values → **Save changes**.
9. **Delete and undo.** Trash icon → confirm → click **Undo** in the toast.
10. **Export.** Click **Export CSV**. The file contains only the currently filtered expenses.
11. **Dashboard.** Check the summary cards and charts, and hover the charts for tooltips.
12. **Mobile.** Resize to phone width or use device emulation. Navigation moves to the bottom bar and the form opens as a bottom sheet.

## Project structure

```
src/
  app/
    layout.tsx            Root layout, font, providers
    page.tsx              Dashboard
    expenses/             Expense list page (server wrapper + client view)
    error.tsx, not-found.tsx
  components/             UI: AppShell, ExpenseForm, Modal, Charts, FiltersBar, Toasts, …
  hooks/useExpenses.tsx   Expense state (React context + hooks) and localStorage persistence
  lib/                    Framework-free domain logic (unit-tested)
    types.ts              Expense model and categories
    validation.ts         Form validation
    money.ts, dates.ts    Currency parsing/formatting; time-zone-safe date helpers
    filters.ts            Search / filter / sort
    analytics.ts          Summaries, monthly and category totals
    csv.ts                CSV generation and download
    storage.ts            Versioned localStorage I/O with record validation
```

### Design notes

- **Amounts are stored as integer cents**, which avoids floating-point rounding errors in totals.
- **Dates are stored as `YYYY-MM-DD` strings** and handled as local calendar dates, which avoids the UTC off-by-one-day bug.
- **Writes go to storage before state updates.** If saving fails (for example, storage is full), the UI doesn't show the change as saved and an error toast appears.
- **Stored data is versioned and validated on load.** Corrupt records are skipped instead of breaking the app.
- The currency (USD) is set in `src/lib/money.ts`.
