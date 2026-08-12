export function whatsappLink(rawPhone: string | null | undefined, message?: string) {
  const digits = (rawPhone ?? "").replace(/\D/g, "");
  const base = digits ? `https://wa.me/${digits}` : "https://wa.me/";
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function formatBrPhone(rawPhone: string | null | undefined) {
  const digits = (rawPhone ?? "").replace(/\D/g, "");
  // 55 11 977202948 -> (11) 97720-2948
  const local = digits.startsWith("55") ? digits.slice(2) : digits;
  if (local.length !== 10 && local.length !== 11) return rawPhone ?? "";
  const ddd = local.slice(0, 2);
  const rest = local.slice(2);
  const mid = rest.length === 9 ? rest.slice(0, 5) : rest.slice(0, 4);
  const end = rest.length === 9 ? rest.slice(5) : rest.slice(4);
  return `(${ddd}) ${mid}-${end}`;
}
