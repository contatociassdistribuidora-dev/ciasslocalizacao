# Configuração do Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor.
3. Execute o arquivo `supabase/full_setup.sql`.
4. Confirme que as tabelas foram criadas: `public.profiles`, `public.locations`, `public.location_photos`, `public.visits` e `public.audit_logs`.
5. Confirme o trigger de profiles e as políticas RLS.
6. Crie o bucket `location-photos` no Storage (o script tenta criar o bucket automaticamente).
7. Copie `.env.example` para `.env.local` e preencha as chaves.
8. Crie um usuário em Authentication.
9. Promova o usuário para administrador com:

```sql
update public.profiles
set role = 'admin', active = true, updated_at = now()
where lower(email) = lower('EMAIL_DO_USUARIO');
```

10. Teste o login e confira as políticas RLS.

## Consultas de verificação

```sql
select * from public.profiles;
select * from public.locations;
select * from public.location_photos;
select * from public.visits;
select * from public.audit_logs;
```
