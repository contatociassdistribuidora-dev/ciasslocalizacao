"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setMessage('Enviamos um e-mail para redefinir sua senha.');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="text-3xl font-semibold">Recuperar senha</h1>
        <p className="mt-2 text-sm text-slate-400">Informe o e-mail cadastrado para receber instruções.</p>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-6 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
          placeholder="seu@email.com"
        />
        <button type="submit" className="mt-6 w-full rounded-full bg-sky-500 px-4 py-3 font-medium text-white">
          Enviar link
        </button>
        {message ? <p className="mt-4 text-sm text-emerald-400">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
      </form>
    </main>
  );
}
