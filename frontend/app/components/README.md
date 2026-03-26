# Frontend Refactoring: Component-Based Architecture

This document summarizes the refactoring process performed on the Finastriva dashboard (`frontend/app/page.tsx`). The previously monolithic file has been divided into smaller, reusable components within the `app/components/` directory.

## Table of Contents
1. [Overview](#overview)
2. [Component Breakdown](#component-breakdown)
3. [State and Prop Management](#state-and-prop-management)
4. [Key Improvements](#key-improvements)
5. [TypeScript Integration](#typescript-integration)

---

## Overview
The main goal of this refactoring was to improve code **readability**, **maintainability**, and **scalability**. By moving UI sections into separate files, we've made the code easier to navigate and reduced the risk of regression when updating specific features.

## Component Breakdown

### 1. `Header.tsx`
- **Purpose**: Displays the top navigation/header bar.
- **Features**: Includes the logo, app name, tagline, and current date in Indonesian format.
- **Location**: `frontend/app/components/Header.tsx`

### 2. `BalanceCard.tsx`
- **Purpose**: Visualizes the financial status.
- **Props**:
  - `total`: Current net balance.
  - `income`: Total income sum.
  - `expense`: Total expense sum.
- **Styling**: Dynamically changes color to red if the balance is negative.

### 3. `AnalyticsCard.tsx`
- **Purpose**: Provides a visual representation of income vs. expenses.
- **Integration**: Uses `recharts` for the PieChart visualization.
- **Props**:
  - `income`: Used for empty state check.
  - `expense`: Used for empty state check.
  - `chartData`: Formatted data for the chart.

### 4. `TransactionForm.tsx`
- **Purpose**: Manages user input for creating and updating transactions.
- **Features**:
  - Toggle between "Income" and "Expense".
  - Dynamic button labeling (Save vs. Update).
  - Cancel edit button.
- **Props**: Controlled inputs (`desc`, `amount`, `type`) and action handlers (`onSubmit`, `onCancel`).

### 5. `TransactionList.tsx`
- **Purpose**: Displays the recent history of transactions.
- **Features**:
  - Reverse chronological sorting (latest first).
  - Hover actions for editing and deleting.
  - Custom scrollbar styling.
- **Props**: `transactions` array and action handlers (`onEdit`, `onDelete`).

---

## State and Prop Management
State management remains centralized in `page.tsx` (the "Smart Component") to facilitate communication between the form and the list. Data fetching (`fetchTransactions`) and CRUD logic are kept in the parent to ensure a single source of truth.

```tsx
// Excerpt from page.tsx showing component usage
<BalanceCard total={totalBalance} income={incomeTotal} expense={expenseTotal} />
<TransactionForm 
  editingId={editingId}
  desc={desc}
  setDesc={setDesc}
  // ... other props
  onSubmit={tambahTransaksi}
  onCancel={resetForm}
/>
```

## Key Improvements
- **Separation of Concerns**: Each component has one responsibility.
- **Styling Consistency**: Retained the futuristic "black and blue" theme with Tailwind CSS and custom global CSS for scrollbars.
- **Developer Experience**: Smaller files make it easier to debug specific UI sections.

## TypeScript Integration
To resolve the `ts(2306)` error ("is not a module"), `import React from "react";` was explicitly added to components to ensure the TypeScript compiler correctly identifies them as ES modules. All props are strictly typed using interfaces.

---
*Created on: Thursday, March 26, 2026*
