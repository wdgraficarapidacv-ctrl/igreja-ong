import type { Metadata } from "next";
import "./globals.css";

const DOVE_FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='48' fill='%230A0E16'/%3E%3Cpath d='M50 58C34 50 20 38 14 24C26 30 38 40 46 52Z' fill='%234FC7E8'/%3E%3Cpath d='M50 58C62 46 78 38 88 26C80 44 66 56 54 62Z' fill='%234FC7E8'/%3E%3Cpath d='M50 58C46 66 44 74 46 82C52 76 56 68 54 60Z' fill='%234FC7E8'/%3E%3Ccircle cx='56' cy='52' r='5.5' fill='%234FC7E8'/%3E%3Cpath d='M60 51 67 49 61 55Z' fill='%234FC7E8'/%3E%3C/svg%3E";

export const metadata: Metadata = {
  title: {
    default: "MARN — Ministério Apostólico e Refrigério para as Nações",
    template: "%s · MARN Church",
  },
  description: "Uma igreja para a sua família.",
  icons: { icon: DOVE_FAVICON },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-ink">
        {children}
      </body>
    </html>
  );
}
