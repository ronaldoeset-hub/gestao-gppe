-- Migration: adiciona funcionario_escola ao enum user_role
-- Data: 2026-05-29
-- Executar no Supabase SQL Editor ou via supabase db execute

alter type public.user_role add value if not exists 'funcionario_escola';
