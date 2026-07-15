"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/src/lib/supabase/client';
import { getAuthErrorMessage } from '@/src/lib/supabase/env';
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
        const supabase = getSupabaseBrowserClient();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!active) return;
        if (!session) {
          router.replace('/login');
          return;
        }

        const profile = await getCurrentProfile();
        if (!active) return;

        if (!profile) {
          setError('Perfil não encontrado para este usuário.');
          return;
        }

        if (!profile.active) {
          await supabase.auth.signOut();
          setError('Seu usuário está inativo. Entre em contato com o administrador.');
          router.replace('/login');
          return;
        }

        if (!canAccessRoute(pathname, profile.role)) {
          router.replace('/dashboard');
          return;
        }

        setReady(true);
      } catch (err) {
        if (!active) return;
        setError(getAuthErrorMessage(err));
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
