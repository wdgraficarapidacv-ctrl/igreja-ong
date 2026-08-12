import { SignJWT, jwtVerify } from "jose";

/**
 * Sessão local assinada (JWT), usada apenas enquanto o Supabase não está
 * configurado (ver lib/supabase/env.ts → isSupabaseConfigured). Funciona
 * tanto no runtime Node (Server Actions) quanto no Edge (proxy.ts), porque
 * `jose` usa Web Crypto em vez do módulo `crypto` do Node.
 *
 * IMPORTANTE: isso é um modo de desenvolvimento/teste local. Em produção
 * (Vercel), o filesystem é somente leitura entre deploys — configure o
 * Supabase antes de publicar o site (ver SETUP.md).
 */

export const LOCAL_SESSION_COOKIE = "marn_local_session";

const secretString =
  process.env.LOCAL_AUTH_SECRET ||
  "dev-only-troque-isto-definindo-LOCAL_AUTH_SECRET-no-.env.local";

const secret = new TextEncoder().encode(secretString);

export type LocalSessionPayload = {
  email: string;
  fullName: string;
};

export async function createLocalSessionToken(payload: LocalSessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyLocalSessionToken(
  token: string
): Promise<LocalSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.email !== "string" || typeof payload.fullName !== "string") return null;
    return { email: payload.email, fullName: payload.fullName };
  } catch {
    return null;
  }
}
