export function About() {
  return (
    <section className="border-b border-line px-6 py-[88px]" id="sobre">
      <div className="mx-auto max-w-[1120px]">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.16em] text-accent-ink">Quem somos</p>
        <h2 className="mb-3.5 max-w-[20ch] text-balance font-serif text-[28px] font-normal tracking-tight sm:text-[38px]">
          Fé vivida em comunidade, todos os dias da semana.
        </h2>
        <div className="grid gap-14 md:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="mb-[18px] text-base text-ink-soft">
              O MARN — Ministério Apostólico e Refrigério para as Nações — é uma igreja construída para ser um
              refúgio de verdade: um lugar onde famílias inteiras encontram acolhimento, ensino e propósito.
            </p>
            <p className="mb-[18px] text-base text-ink-soft">
              Coração alinhado, propósito clarificado e identidade ativada — é assim que vivemos nossa semana.
              Entre cultos, ensaios e uma noite dedicada inteiramente a levar o evangelho às ruas, buscamos viver a
              fé de forma prática, próxima e real, dentro e fora das quatro paredes da igreja.
            </p>
            <a href="#local" className="mt-2 inline-block rounded-[10px] border border-line px-[26px] py-3.5 text-[15px] font-bold text-ink transition-colors hover:border-accent hover:text-accent-ink">
              Conheça nosso endereço →
            </a>
          </div>
          <div className="grid gap-4">
            <ValueCard title="Família em primeiro lugar" text="Uma igreja pensada para acolher casais, crianças, jovens e quem chega sozinho pela primeira vez." />
            <ValueCard title="Evangelismo como estilo de vida" text="Toda terça-feira, das 20h às 22h, saímos para levar a mensagem além dos nossos muros." />
            <ValueCard title="Adoração e ensino" text="Louvor, Palavra e Santa Ceia como parte viva da nossa rotina de igreja, não só de datas especiais." />
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-line bg-bg-raised px-[22px] py-5">
      <h3 className="mb-1.5 font-serif text-[17px] font-normal">{title}</h3>
      <p className="text-sm text-ink-soft">{text}</p>
    </div>
  );
}
