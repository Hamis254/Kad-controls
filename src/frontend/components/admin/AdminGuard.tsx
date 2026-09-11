


'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

/**
 * Wrapper for every /admin/* page's content. The actual access control happens
 * server-side in src/middleware.ts — by the time this component renders, the
 * request has already been verified as an authenticated admin session, so this
 * is just chrome (a log-out control), not an auth check.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div>
      <div className="bg-black text-white text-xs px-4 py-2 flex items-center justify-between">
        <span>Kad Controls — Admin</span>
        <button onClick={handleLogout} className="underline hover:no-underline">
          Log out
        </button>
      </div>
      {children}
    </div>
  );
}
