import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Accessibility,
  Baby,
  BrainCircuit,
  BrickWall,
  Check,
  Eye,
  Footprints,
  Lightbulb,
  MapPin,
  Moon,
  Navigation,
  RouteIcon,
  Sparkles,
  Sun,
  UserRound,
  WandSparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import logoAsset from "@/assets/logo-pixel.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cidade Invisível | PIXEL" },
      { name: "description", content: "Roteador inclusivo e simulador de acessibilidade urbana da Equipe PIXEL." },
      { property: "og:title", content: "Cidade Invisível | PIXEL" },
      { property: "og:description", content: "IA para identificação e redução de desigualdades na mobilidade urbana." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

type Profile = "ana" | "roberto" | "maria" | "carlos";

const profiles = [
  { id: "ana" as const, name: "Ana", detail: "38 anos · Cadeira de rodas", icon: Accessibility },
  { id: "roberto" as const, name: "Roberto", detail: "Deficiência visual", icon: Eye },
  { id: "maria" as const, name: "Dona Maria", detail: "Mobilidade reduzida", icon: UserRound },
  { id: "carlos" as const, name: "Carlos", detail: "Carrinho de bebê", icon: Baby },
];

const interventions = [
  { id: "rampa", label: "Instalar rampa", icon: Accessibility, gain: 16 },
  { id: "calcada", label: "Nivelar calçada", icon: BrickWall, gain: 14 },
  { id: "luz", label: "Adicionar iluminação", icon: Lightbulb, gain: 10 },
  { id: "tatil", label: "Implantar piso tátil", icon: Footprints, gain: 12 },
  { id: "travessia", label: "Travessia elevada", icon: Navigation, gain: 8 },
];

const profileCopy: Record<Profile, { score: number; time: string; effort: string; reason: string; position: string }> = {
  ana: { score: 35, time: "8 min", effort: "Alto / crítico", position: "32%,67%", reason: "A IA descartou o trecho 2 por uma guia não rebaixada de 18 cm, incompatível com a cadeira de rodas de Ana." },
  roberto: { score: 42, time: "10 min", effort: "Atenção alta", position: "43%,57%", reason: "A rota prioriza piso tátil, travessias sinalizadas e iluminação uniforme para Roberto." },
  maria: { score: 48, time: "11 min", effort: "Moderado", position: "53%,48%", reason: "A IA reduziu aclives e incluiu pontos de descanso para preservar o ritmo de Dona Maria." },
  carlos: { score: 52, time: "9 min", effort: "Moderado", position: "61%,41%", reason: "A rota de Carlos evita degraus e passagens estreitas para manter o carrinho em circulação contínua." },
};

function Dashboard() {
  const [profile, setProfile] = useState<Profile>("ana");
  const [active, setActive] = useState<string[]>([]);
  const [dark, setDark] = useState(false);
  const current = profileCopy[profile];
  const score = Math.min(95, current.score + interventions.filter((item) => active.includes(item.id)).reduce((sum, item) => sum + item.gain, 0));
  const selectedName = profiles.find((item) => item.id === profile)?.name ?? "Ana";
  const explanation = useMemo(() => {
    if (!active.length) return current.reason;
    const names = interventions.filter((item) => active.includes(item.id)).map((item) => item.label.toLowerCase()).join(", ");
    return `${current.reason} Após simular ${names}, o percurso alcançou ${score}% de acessibilidade.`;
  }, [active, current.reason, score]);

  function toggleIntervention(id: string) {
    setActive((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className={dark ? "dark" : ""}>
        <main className="min-h-dvh bg-background p-3 text-foreground transition-colors sm:p-5 lg:p-6">
          <div className="mx-auto max-w-[1540px] overflow-hidden rounded-[24px] border border-border bg-card shadow-dashboard lg:min-h-[calc(100dvh-3rem)]">
            <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border px-4 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <img src={logoAsset.url} alt="Cubo colorido da Equipe PIXEL" className="size-11 shrink-0 object-contain" />
                <div className="min-w-0">
                  <h1 className="truncate font-display text-lg font-bold sm:text-xl">Cidade Invisível <span className="text-primary">| PIXEL</span></h1>
                  <p className="hidden text-xs text-muted-foreground md:block">IA para Identificação e Redução de Desigualdades na Mobilidade Urbana</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <div className="hidden items-center gap-2 xl:flex">
                  <span className="badge-brand">MVP Jump Start 2026</span><span className="badge-neutral">Missão 4 — Mobilidade</span><span className="badge-neutral">Protótipo Fase 1</span>
                </div>
                <Button variant="ghost" size="icon" className="min-h-11 min-w-11" aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"} onClick={() => setDark((value) => !value)}>
                  {dark ? <Sun /> : <Moon />}
                </Button>
              </div>
            </header>

            <div className="grid lg:grid-cols-[360px_minmax(0,1fr)]">
              <aside className="border-b border-border bg-card lg:border-r lg:border-b-0">
                <div className="border-b border-border p-4 sm:p-5">
                  <p className="section-label">Trajeto microterritorial</p>
                  <div className="mt-3 space-y-2">
                    <label className="route-input"><span className="origin-dot" /><span><small>Origem</small>Portão Principal — Campus CEFET/RJ</span></label>
                    <label className="route-input"><MapPin className="size-4 text-primary" /><span><small>Destino</small>Biblioteca Central / Bloco E</span></label>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <p className="section-label">Perfil de mobilidade</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {profiles.map((item) => {
                      const Icon = item.icon;
                      const selected = item.id === profile;
                      return <Button key={item.id} variant={selected ? "profileActive" : "profile"} className="h-auto min-h-20 whitespace-normal p-3" onClick={() => { setProfile(item.id); setActive([]); }} aria-pressed={selected}>
                        <Icon className="size-5" /><span className="text-left"><strong className="block text-xs">{item.name}</strong><small className="block text-[10px] leading-tight opacity-75">{item.detail}</small></span>
                      </Button>;
                    })}
                  </div>
                </div>

                <div className="border-t border-border p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2"><p className="section-label">Intervenções</p><span className="text-[10px] font-bold text-primary">{active.length} ATIVAS</span></div>
                  <p className="mt-1 text-xs text-muted-foreground">Aplique melhorias para transformar a rota.</p>
                  <div className="mt-3 space-y-2">
                    {interventions.map((item) => {
                      const Icon = item.icon;
                      const checked = active.includes(item.id);
                      return <div key={item.id} className="intervention-row">
                        <Icon className="size-4 shrink-0 text-primary" /><label htmlFor={item.id} className="min-w-0 flex-1 cursor-pointer text-xs font-semibold">{item.label}</label>
                        <Switch id={item.id} checked={checked} onCheckedChange={() => toggleIntervention(item.id)} aria-label={item.label} />
                      </div>;
                    })}
                  </div>
                  <Button className="mt-4 h-12 w-full rounded-xl text-sm font-bold" onClick={() => setActive(interventions.map((item) => item.id))}><WandSparkles />Calcular Rotas Inclusivas via IA</Button>
                </div>
              </aside>

              <section className="min-w-0 bg-map-surface p-3 sm:p-5">
                <div className="map-shell relative min-h-[540px] overflow-hidden rounded-[18px] border border-border lg:min-h-[600px]">
                  <CampusMap profile={profile} active={active} position={current.position} />
                  <div className="absolute left-3 top-3 z-10 max-w-[calc(100%-1.5rem)] rounded-xl border border-border bg-card/95 p-3 shadow-panel backdrop-blur sm:left-5 sm:top-5">
                    <div className="flex items-center gap-2 text-xs font-bold"><span className="status-dot" />Simulação ativa · {selectedName}</div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-semibold">
                      <span className="legend"><i className="bg-route-red" />Convencional · 3 barreiras</span>
                      <span className="legend"><i className="bg-route-yellow" />Alternativa · +800 m</span>
                      <span className="legend text-route-green"><i className="bg-route-green" />IA otimizada</span>
                    </div>
                  </div>

                  <div className="absolute inset-x-3 bottom-3 z-10 grid gap-3 sm:inset-x-5 sm:bottom-5 xl:grid-cols-[1.15fr_.85fr]">
                    <div className="rounded-2xl border border-border bg-card/96 p-4 shadow-panel backdrop-blur">
                      <div className="grid grid-cols-3 gap-3">
                        <Metric label="Acessibilidade" value={`${score}%`} before={`${current.score}% antes`} accent />
                        <Metric label="Esforço físico" value={score >= 75 ? "Baixo" : current.effort} before={score >= 75 ? "Transitável" : "Requer atenção"} />
                        <Metric label="Tempo estimado" value={active.length ? `${Math.max(5, parseInt(current.time) - Math.min(3, active.length))} min` : current.time} before="Rota otimizada" />
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted" aria-label={`Score de acessibilidade: ${score}%`}><div className="h-full rounded-full bg-route-green transition-[width] duration-700" style={{ width: `${score}%` }} /></div>
                    </div>
                    <div className="rounded-2xl border border-border bg-card/96 p-4 shadow-panel backdrop-blur">
                      <div className="flex items-center gap-2 text-xs font-bold"><BrainCircuit className="size-4 text-primary" />Por que a IA recomendou esta rota?</div>
                      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground" aria-live="polite">“{explanation}”</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}

function Metric({ label, value, before, accent = false }: { label: string; value: string; before: string; accent?: boolean }) {
  return <div className="min-w-0"><p className="truncate text-[9px] font-bold uppercase text-muted-foreground">{label}</p><p className={`mt-1 truncate font-display text-lg font-bold sm:text-xl ${accent ? "text-route-green" : ""}`}>{value}</p><p className="truncate text-[9px] text-muted-foreground">{before}</p></div>;
}

function CampusMap({ profile, active, position }: { profile: Profile; active: string[]; position: string }) {
  const [x, y] = position.split(",");
  const barriers = [
    { id: "rampa", x: "46%", y: "30%", label: "Guia não rebaixada · 18 cm" },
    { id: "calcada", x: "59%", y: "47%", label: "Calçada esburacada" },
    { id: "luz", x: "70%", y: "31%", label: "Iluminação insuficiente" },
  ];
  return <div className="absolute inset-0">
    <svg className="size-full" viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Mapa estilizado do Campus CEFET/RJ com três opções de rota">
      <rect width="1000" height="720" className="fill-map" />
      <g className="fill-building stroke-building" strokeWidth="2">
        <path d="M70 90h210v115H70z" /><path d="M350 65h170v150H350z" /><path d="M665 70h245v125H665z" />
        <path d="M90 330h175v130H90z" /><path d="M380 365h180v120H380z" /><path d="M705 345h210v135H705z" />
      </g>
      <g className="stroke-road" strokeWidth="42" fill="none" strokeLinecap="round"><path d="M45 275H945"/><path d="M305 35v620"/><path d="M625 20v640"/></g>
      <g className="stroke-road-line" strokeWidth="2" fill="none" strokeDasharray="9 12"><path d="M45 275H945"/><path d="M305 35v620"/><path d="M625 20v640"/></g>
      <g className="fill-greenery"><circle cx="160" cy="555" r="62"/><circle cx="790" cy="590" r="72"/><circle cx="510" cy="580" r="34"/></g>
      <path d="M95 620 C180 570 235 455 310 390 S420 245 545 280 S720 260 865 150" className="stroke-route-red route-line" />
      <path d="M95 620 C160 660 350 650 470 590 S740 550 865 150" className="stroke-route-yellow route-line" />
      <path d="M95 620 C225 555 260 520 315 430 S470 360 555 350 S715 285 865 150" className="stroke-route-green route-line route-recommended" />
      <circle cx="95" cy="620" r="12" className="fill-primary stroke-card" strokeWidth="6"/><circle cx="865" cy="150" r="12" className="fill-destructive stroke-card" strokeWidth="6"/>
      <text x="82" y="657" className="map-label">PORTÃO PRINCIPAL</text><text x="805" y="119" className="map-label">BIBLIOTECA · BLOCO E</text>
    </svg>
    {barriers.map((item) => !active.includes(item.id) && <Tooltip key={item.id}><TooltipTrigger asChild><button type="button" className="barrier-marker" style={{ left: item.x, top: item.y }} aria-label={item.label}>!</button></TooltipTrigger><TooltipContent>{item.label}</TooltipContent></Tooltip>)}
    <div className="agent-marker" style={{ left: x, top: y }} aria-label={`Agente sintético: ${profile}`}><Accessibility className="size-5" /><span>{profile === "ana" ? "ANA" : profile.toUpperCase()}</span></div>
    {active.length > 0 && <div className="improvement-note"><Sparkles className="size-4" />{active.length} melhoria{active.length > 1 ? "s" : ""} simulada{active.length > 1 ? "s" : ""}</div>}
  </div>;
}