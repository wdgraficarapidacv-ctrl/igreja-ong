import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";

/**
 * Guarda o (único) administrador local em um arquivo JSON fora do banco —
 * só existe enquanto o Supabase não está configurado. Nunca use isso em
 * produção: em serverless (Vercel) o filesystem não persiste entre deploys.
 */

const DATA_DIR = path.join(process.cwd(), ".local-data");
const FILE = path.join(DATA_DIR, "admin.json");

type StoredAdmin = {
  email: string;
  fullName: string;
  passwordHash: string;
};

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuffer = Buffer.from(hash, "hex");
  const testBuffer = scryptSync(password, salt, 64);
  return hashBuffer.length === testBuffer.length && timingSafeEqual(hashBuffer, testBuffer);
}

export async function getLocalAdmin(): Promise<StoredAdmin | null> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as StoredAdmin;
  } catch {
    return null;
  }
}

export async function localAdminExists() {
  return (await getLocalAdmin()) !== null;
}

export async function createLocalAdmin(email: string, password: string, fullName: string) {
  const existing = await getLocalAdmin();
  if (existing) {
    throw new Error("Já existe um administrador local cadastrado. Faça login normalmente.");
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  const record: StoredAdmin = {
    email: email.toLowerCase().trim(),
    fullName: fullName.trim(),
    passwordHash: hashPassword(password),
  };
  await fs.writeFile(FILE, JSON.stringify(record, null, 2), "utf-8");
  return record;
}

export async function verifyLocalAdminCredentials(email: string, password: string) {
  const admin = await getLocalAdmin();
  if (!admin) return null;
  if (admin.email !== email.toLowerCase().trim()) return null;
  if (!verifyPassword(password, admin.passwordHash)) return null;
  return admin;
}
