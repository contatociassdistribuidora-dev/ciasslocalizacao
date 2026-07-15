"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { getCurrentProfile } from '@/src/services/profiles';

function canAccessRoute(pathname: string, role?: string | null) {
  if (pathname.startsWith('/settings')) {
    return role === 'admin';
  }

  return Boolean(role);
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        if (!data.session) {
          router.replace('/login');
          return;
        }

        const profile = await getCurrentProfile();
        if (!active) return;

        if (!profile?.active) {
          setError('Seu usuário está inativo. Entre em contato com o administrador.');
          return;
        }

        if (!canAccessRoute(pathname, profile.role)) {
          router.replace('/dashboard');
          return;
        }

        setReady(true);
      } catch (err) {
        if (!active) return;
        console.error(err);
        setError('Não foi possível validar sua sessão.');
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        {error ? <span className="text-rose-500">{error}</span> : 'Validando sessão...'}
      </div>
    );
  }

  return <>{children}</>;
}
