/**
 * Antes do Supabase ser configurado (.env.local ainda com placeholders),
 * o site público e o /login precisam continuar funcionando — só o painel
 * fica indisponível. Isso evita que o site quebre durante a migração.
 */
export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes("SEU-PROJETO") && !key.includes("sua-anon-public-key"));
}
