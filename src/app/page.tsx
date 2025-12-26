// src/app/page.tsx
// This file re-exports the Index page from src/pages/Index
// Next.js App Router will use this as the home page

import Index from '@/pages/Index';

export default function HomePage() {
  return <Index />;
}