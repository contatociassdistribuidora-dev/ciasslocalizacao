"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { AppShell } from '@/components/app-shell';
import { locationSchema } from '@/lib/schemas';
import { createLocation } from '@/src/services/locations';
import type { z } from 'zod';

type LocationFormValues = z.infer<typeof locationSchema>;

export default function NewLocationPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LocationFormValues>({ resolver: zodResolver(locationSchema), defaultValues: { status: 'active' } });

  const onSubmit: SubmitHandler<LocationFormValues> = async (values) => {
    try {
      setMessage('');
      setError('');
      const payload = {
        ...values,
        latitude: values.latitude ? Number(values.latitude) : null,
        longitude: values.longitude ? Number(values.longitude) : null,
      };
      await createLocation(payload);
      setMessage('Localização cadastrada com sucesso.');
      router.push('/locations');
    } catch (err) {
      console.error(err);
      setError('Não foi possível salvar a localização.');
    }
  };

  return (
    <AppShell>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Cadastro de localização</h1>
        <p className="mt-1 text-sm text-slate-500">Formulário completo com validação e campos principais.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Nome da localização</label>
            <input {...register('name')} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" />
            {errors.name && <p className="mt-1 text-sm text-rose-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">CPF/CNPJ</label>
            <input {...register('document_number')} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </div>
          <div>
            <label className="text-sm font-medium">Categoria</label>
            <input {...register('category')} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </div>
          <div>
            <label className="text-sm font-medium">CEP</label>
            <input {...register('zip_code')} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </div>
          <div>
            <label className="text-sm font-medium">Endereço</label>
            <input {...register('address')} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </div>
          <div>
            <label className="text-sm font-medium">Número</label>
            <input {...register('address_number')} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </div>
          <div>
            <label className="text-sm font-medium">Bairro</label>
            <input {...register('neighborhood')} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </div>
          <div>
            <label className="text-sm font-medium">Cidade</label>
            <input {...register('city')} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </div>
          <div>
            <label className="text-sm font-medium">Estado</label>
            <input {...register('state')} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </div>
          <div>
            <label className="text-sm font-medium">Latitude</label>
            <input {...register('latitude')} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </div>
          <div>
            <label className="text-sm font-medium">Longitude</label>
            <input {...register('longitude')} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </div>
          <div>
            <label className="text-sm font-medium">Nome do contato</label>
            <input {...register('contact_name')} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </div>
          <div>
            <label className="text-sm font-medium">Telefone</label>
            <input {...register('phone')} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </div>
          <div>
            <label className="text-sm font-medium">E-mail</label>
            <input {...register('email')} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <select {...register('status')} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3">
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Observações</label>
            <textarea {...register('notes')} className="mt-2 min-h-28 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button type="button" className="rounded-full border border-slate-300 px-4 py-3 font-medium">Usar minha localização</button>
            <button type="submit" disabled={isSubmitting} className="rounded-full bg-sky-500 px-4 py-3 font-medium text-white disabled:opacity-70">
              {isSubmitting ? 'Salvando...' : 'Salvar localização'}
            </button>
          </div>
          {message ? <p className="md:col-span-2 text-sm text-emerald-600">{message}</p> : null}
          {error ? <p className="md:col-span-2 text-sm text-rose-500">{error}</p> : null}
        </form>
      </div>
    </AppShell>
  );
}
