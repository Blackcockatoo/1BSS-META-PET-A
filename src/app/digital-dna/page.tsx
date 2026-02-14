'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const DigitalDNAHub = dynamic(() => import('@/components/DigitalDNAHub'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-amber-300 text-2xl animate-pulse">Loading Digital DNA...</div>
    </div>
  ),
});

export default function DigitalDNAPage() {
  return (
    <div className="relative">
      <Link
        href="/"
        className="fixed left-3 top-[calc(0.75rem+env(safe-area-inset-top))] z-50 rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-medium text-zinc-200 backdrop-blur-sm transition-colors hover:border-amber-500/50 hover:text-white"
      >
        &larr; Back to Pet
      </Link>
      <DigitalDNAHub />
    </div>
  );
}
