import { z } from 'zod';

export const locationSchema = z.object({
  name: z.string().min(2, 'Informe o nome da localização'),
  document_number: z.string().min(2, 'Informe CPF ou CNPJ'),
  category: z.string().min(1, 'Selecione uma categoria'),
  address: z.string().min(2, 'Informe o endereço'),
  address_number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().min(1, 'Informe a cidade'),
  state: z.string().min(2, 'Informe o estado'),
  zip_code: z.string().min(5, 'Informe o CEP'),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  contact_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha mínima de 6 caracteres'),
});
