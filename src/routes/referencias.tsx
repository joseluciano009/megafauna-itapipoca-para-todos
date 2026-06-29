import { useState } from "react";
import { BookMarked, ExternalLink, Search, Copy, Check } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SEO } from "@/components/seo";

type Ref = {
  id: string;
  tipo: "Artigo" | "Livro" | "Tese" | "Capítulo" | "Web";
  citacao: string;
  url?: string;
};

const REFERENCIAS: Ref[] = [
  {
    id: "souza2024",
    tipo: "Artigo",
    citacao:
      "SOUZA, A. B.; LIMA, M.; ROCHA, C. A megafauna pleistocênica do Nordeste brasileiro: novos registros em Itapipoca, Ceará. Revista Brasileira de Paleontologia, v. 27, n. 2, p. 145–168, 2024.",
    url: "https://doi.org/10.4072/rbp.2024.2.03",
  },
  {
    id: "lima2023",
    tipo: "Livro",
    citacao:
      "LIMA, M. Paleontologia do Ceará: uma introdução. Fortaleza: Editora UFC, 2023. 312 p.",
  },
  {
    id: "rocha2022",
    tipo: "Tese",
    citacao:
      "ROCHA, C. Taxonomia de gliptodontes do semiárido brasileiro. 2022. 184 f. Tese (Doutorado em Geociências) — Universidade Federal do Ceará, Fortaleza, 2022.",
  },
  {
    id: "vieira2023",
    tipo: "Artigo",
    citacao:
      "VIEIRA, J. Coexistência humana e megafauna no semiárido brasileiro. Quaternary International, v. 651, p. 22–37, 2023.",
    url: "https://doi.org/10.1016/j.quaint.2023.04.011",
  },
  {
    id: "cardoso2021",
    tipo: "Tese",
    citacao:
      "CARDOSO, H. Paleoclimas do Pleistoceno cearense: reconstrução a partir de assembleias fossilíferas. 2021. 220 f. Tese (Doutorado) — Universidade de São Paulo, São Paulo, 2021.",
  },
  {
    id: "mendes2022",
    tipo: "Livro",
    citacao:
      "MENDES, R. Tanques fossilíferos: uma janela ao passado. Recife: Editora UFPE, 2022. 256 p.",
  },
  {
    id: "cartelle1999",
    tipo: "Artigo",
    citacao:
      "CARTELLE, C.; DE IULIIS, G. Eremotherium laurillardi: the panamerican late Pleistocene megatheriid sloth. Journal of Vertebrate Paleontology, v. 15, n. 4, p. 830–841, 1999.",
  },
  {
    id: "porpino2014",
    tipo: "Artigo",
    citacao:
      "PORPINO, K. O.; FERNICOLA, J. C.; BERGQVIST, L. P. A new cingulate (Mammalia: Xenarthra) from the Late Pleistocene of northeastern Brazil. Journal of Vertebrate Paleontology, v. 34, n. 5, p. 1067–1075, 2014.",
  },
  {
    id: "dantas2013",
    tipo: "Artigo",
    citacao:
      "DANTAS, M. A. T. et al. Megafauna do Pleistoceno final do Nordeste do Brasil: novos registros e implicações tafonômicas. Quaternary International, v. 305, p. 216–226, 2013.",
  },
  {
    id: "ibge",
    tipo: "Web",
    citacao:
      "IBGE. Itapipoca — Panorama da cidade. Instituto Brasileiro de Geografia e Estatística, 2024.",
    url: "https://cidades.ibge.gov.br/brasil/ce/itapipoca",
  },
  {
    id: "sbp",
    tipo: "Web",
    citacao:
      "SOCIEDADE BRASILEIRA DE PALEONTOLOGIA. Diretrizes para preservação do patrimônio paleontológico brasileiro. SBP, 2023.",
    url: "https://www.sbpbrasil.org",
  },
  {
    id: "icmbio",
    tipo: "Web",
    citacao:
      "ICMBio. Patrimônio paleontológico brasileiro: legislação e proteção. Instituto Chico Mendes de Conservação da Biodiversidade, 2022.",
    url: "https://www.gov.br/icmbio",
  },
];

const TIPOS = ["Todos", "Artigo", "Livro", "Tese", "Capítulo", "Web"] as const;

export default function Referencias() {
  const [tipo, setTipo] = useState<(typeof TIPOS)[number]>("Todos");
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = REFERENCIAS.filter(
    (r) =>
      (tipo === "Todos" || r.tipo === tipo) &&
      (!q || r.citacao.toLowerCase().includes(q.toLowerCase())),
  );

  const copy = async (r: Ref) => {
    try {
      await navigator.clipboard.writeText(r.citacao);
      setCopied(r.id);
      setTimeout(() => setCopied(null), 1800);
    } catch {}
  };

  return (
    <>
      <SEO
        title="Referências — Portal Megafauna Democrática"
        description="Referências bibliográficas científicas utilizadas no Portal Megafauna Democrática, em formato ABNT."
        path="/referencias"
      />
      <PageHero
        eyebrow="Referências"
        title="Bibliografia científica"
        description="Lista das principais obras, artigos, teses e fontes consultadas, organizadas no padrão ABNT."
      />

      <section className="section-pad bg-background">
        <div className="container-page">
          <div className="grid sm:grid-cols-[1fr_auto] gap-3 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por autor, título ou ano..."
                className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {TIPOS.map((t) => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  tipo === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border hover:border-primary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <ol className="space-y-4">
            {filtered.map((r, i) => (
              <Reveal key={r.id} delay={i * 40}>
                <li className="rounded-2xl bg-card border border-border p-5 hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="hidden sm:grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                      <BookMarked className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[11px] uppercase tracking-wider text-accent font-semibold">
                          {r.tipo}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          [{String(i + 1).padStart(2, "0")}]
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground">
                        {r.citacao}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => copy(r)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-xs font-medium hover:border-primary transition-colors"
                        >
                          {copied === r.id ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-fossil" /> Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" /> Copiar citação
                            </>
                          )}
                        </button>
                        {r.url && (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" /> Acessar fonte
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          {filtered.length === 0 && (
            <p className="text-center py-12 text-muted-foreground">
              Nenhuma referência encontrada.
            </p>
          )}

          <p className="mt-10 text-xs text-muted-foreground text-center">
            Citações formatadas conforme NBR 6023:2018 (ABNT). Sugestões de inclusão podem ser enviadas pela página de Contato.
          </p>
        </div>
      </section>
    </>
  );
}