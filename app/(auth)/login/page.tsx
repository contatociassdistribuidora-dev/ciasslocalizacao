"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { loginSchema } from '@/lib/schemas';
import { signIn } from '@/lib/auth';
import { getCurrentProfile } from '@/src/services/profiles';

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      const signInResult = await signIn(values.email, values.password);
      console.info('signInWithPassword ok', Boolean(signInResult.session));

      const profile = await getCurrentProfile();
      console.info('profile loaded', profile?.role, profile?.active);

      if (!profile) {
        setError('Perfil não encontrado para este usuário.');
        return;
      }

      if (!profile.active) {
        setError('Seu usuário está inativo.');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao fazer login. Verifique as credenciais.';
      console.error('login failed', message);
      setError(message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <h1 className="text-3xl font-semibold">Entrar</h1>
        <p className="mt-2 text-sm text-slate-400">Acesse o painel do Cadastro de Localizações.</p>

        <label className="mt-6 block text-sm font-medium">E-mail</label>
        <input {...register('email')} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" />
        {errors.email && <p className="mt-1 text-sm text-rose-400">{errors.email.message?.toString()}</p>}

        <label className="mt-4 block text-sm font-medium">Senha</label>
        <input type="password" {...register('password')} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" />
        {errors.password && <p className="mt-1 text-sm text-rose-400">{errors.password.message?.toString()}</p>}

        <button type="submit" disabled={isSubmitting} className="mt-6 w-full rounded-full bg-sky-500 px-4 py-3 font-medium text-white disabled:opacity-70">
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>

        <div className="mt-4 text-sm text-slate-400">
          <Link href="/forgot-password" className="text-sky-400">Esqueci minha senha</Link>
        </div>
      </form>
    </main>
  );
}
