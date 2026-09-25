import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Accessibility,
  Baby,
  Eye,
  UserRound,
  Moon,
  Sun,
  MapPin,
  Download,
  Share2,
} from "lucide-react";
import {
  calculate,
  edges,
  explain,
  nodes,
  places,
  profiles,
  weights,
  works,
  type Profile,
  type RouteId,
  type NodeId,
  type Work,
} from "@/lib/campus";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cidade Invisível | PIXEL" },
      { name: "description", content: "Simulador de rotas acessíveis do PIXEL" },
      { property: "og:image", content: "/share.svg" },
    ],
  }),
  component: Dashboard,
});
const icons = { ana: Accessibility, roberto: Eye, maria: UserRound, carlos: Baby };
const routeNames: Record<RouteId, string> = {
  convencional: "1 · Convencional",
  alternativa: "2 · Alternativa",
  inclusiva: "3 · Recomendada",
};
const routeClass: Record<RouteId, string> = {
  convencional: "conventional",
  alternativa: "alternative",
  inclusiva: "recommended",
};
const ids: RouteId[] = ["convencional", "alternativa", "inclusiva"];
function initialState() {
  if (typeof window === "undefined")
    return {
      profile: "ana" as Profile,
      active: [] as Work[],
      start: "portao" as NodeId,
      end: "biblioteca" as NodeId,
    };
  const query = new URLSearchParams(window.location.search);
  const profile = profiles.find((p) => p.id === query.get("perfil"))?.id ?? "ana";
  const active = works
    .filter((w) => query.get("obras")?.split(",").includes(w.id))
    .map((w) => w.id);
  const start = places.find((p) => p.id === query.get("origem"))?.id ?? "portao";
  const chosenEnd = places.find((p) => p.id === query.get("destino"))?.id ?? "biblioteca";
  const end = chosenEnd === start ? (start === "biblioteca" ? "portao" : "biblioteca") : chosenEnd;
  return { profile, active, start, end };
}
function Dashboard() {
  useEffect(() => {
    const saved = initialState();
    setProfile(saved.profile);
    setActive(saved.active);
    setStart(saved.start);
    setEnd(saved.end);
    if (window.location.search) setCalculated(true);
    try {
      setPhotos(JSON.parse(localStorage.getItem("cidade-fotos-v1") ?? "{}"));
    } catch {
      /* armazenamento indisponível */
    }
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  const [profile, setProfile] = useState<Profile>("ana");
  const [active, setActive] = useState<Work[]>([]);
  const [dark, setDark] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [large, setLarge] = useState(false);
  const [mode, setMode] = useState<"cidadao" | "gestor">("cidadao");
  const [view, setView] = useState<RouteId | "all">("all");
  const [selected, setSelected] = useState<Work | null>(null);
  const [notice, setNotice] = useState("");
  const [photos, setPhotos] = useState<Partial<Record<Work, string>>>({});
  const [calculated, setCalculated] = useState(false);
  const [before, setBefore] = useState(false);
  const [start, setStart] = useState<NodeId>("portao");
  const [end, setEnd] = useState<NodeId>("biblioteca");
  const [animate, setAnimate] = useState(false);
  const [realMap, setRealMap] = useState(false);
  const [tour, setTour] = useState(0);
  const applied = useMemo(() => (before ? [] : active), [before, active]);
  const results = useMemo(
    () => calculate(profile, applied, start, end),
    [profile, applied, start, end],
  );
  const baseline = useMemo(() => calculate(profile, [], start, end), [profile, start, end]);
  const current = results.inclusiva;
  const previous = baseline.inclusiva;
  const toggle = (id: Work) => {
    const enabled = !active.includes(id);
    setActive((items) => (enabled ? [...items, id] : items.filter((x) => x !== id)));
    const work = works.find((w) => w.id === id)!;
    setNotice(
      `${work.label}: ${work.segment} ${enabled ? "resolvido" : "com barreira ativa"} (peso ${weights[profile][id]} para este perfil).`,
    );
  };
  function share() {
    const url = new URL(window.location.href);
    url.searchParams.set("perfil", profile);
    url.searchParams.set("obras", active.join(","));
    url.searchParams.set("origem", start);
    url.searchParams.set("destino", end);
    navigator.clipboard
      .writeText(url.toString())
      .then(() => window.alert("Link do cenário copiado."));
  }
  function exportReport() {
    window.print();
  }
  function attachPhoto(id: Work, file?: File) {
    if (!file || !file.type.startsWith("image/") || file.size > 2_000_000) {
      setNotice("Use uma imagem de até 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      const next = { ...photos, [id]: reader.result };
      try {
        localStorage.setItem("cidade-fotos-v1", JSON.stringify(next));
        setPhotos(next);
        setNotice("Foto armazenada neste navegador; pendente de verificação no campus.");
      } catch {
        setNotice("Não foi possível armazenar a foto neste navegador.");
      }
    };
    reader.readAsDataURL(file);
  }
  return (
    <div
      className={`${dark ? "dark " : ""}${contrast ? "high-contrast " : ""}${large ? "large-text " : ""}app-theme`}
    >
      <main className="app-layout">
        <header className="app-header">
          <div className="brand">
            <img src="/logo.svg" alt="PIXEL" width="44" height="44" />
            <div>
              <h1>
                Cidade Invisível <span>| PIXEL</span>
              </h1>
              <p>Roteador inclusivo e simulador de acessibilidade</p>
            </div>
          </div>
          <div className="header-actions">
            <button
              onClick={() => setMode(mode === "cidadao" ? "gestor" : "cidadao")}
              aria-label="Alternar modo"
            >
              Modo {mode === "cidadao" ? "Cidadão" : "Gestor"}
            </button>
            <button onClick={() => setLarge(!large)} aria-pressed={large}>
              A+
            </button>
            <button onClick={() => setContrast(!contrast)} aria-pressed={contrast}>
              Contraste
            </button>
            <button onClick={() => setDark(!dark)} aria-label={dark ? "Tema claro" : "Tema escuro"}>
              {dark ? <Sun /> : <Moon />}
            </button>
            <button onClick={() => setTour(1)}>Tour</button>
          </div>
        </header>
        <div className="workspace">
          <section className="map-column" aria-label="Mapa e rotas">
            <div className="map-toolbar">
              <span>
                <MapPin size={18} /> {places.find((p) => p.id === start)?.name} →{" "}
                {places.find((p) => p.id === end)?.name}
              </span>
              <button onClick={() => setBefore(!before)} aria-pressed={before}>
                {before ? "Ver depois" : "Ver antes"}
              </button>
              <button onClick={() => setAnimate(!animate)} aria-pressed={animate}>
                {animate ? "Parar agente" : "Percorrer rota"}
              </button>
              <button onClick={() => setRealMap(!realMap)} aria-pressed={realMap}>
                {realMap ? "Ver simulação" : "Ver OpenStreetMap"}
              </button>
            </div>
            <div className="map-container">
              {realMap ? (
                <div className="osm-frame">
                  <iframe
                    title="Mapa OpenStreetMap do entorno do campus Maracanã"
                    loading="lazy"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-43.2262%2C-22.9138%2C-43.2226%2C-22.9106&layer=mapnik&marker=-22.91188%2C-43.2242"
                  />
                  <a
                    href="https://www.openstreetmap.org/#map=18/-22.91188/-43.2242"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir no OpenStreetMap
                  </a>
                  <p>
                    Base cartográfica real do entorno. As rotas e barreiras da simulação ainda
                    aguardam levantamento georreferenciado.
                  </p>
                </div>
              ) : (
                <CampusMap
                  profile={profile}
                  active={applied}
                  view={view}
                  start={start}
                  end={end}
                  animate={animate}
                  calculated={calculated}
                  selected={selected}
                  onSelect={setSelected}
                />
              )}
              <div className="map-legend">
                <strong>Legenda · esquema demonstrativo</strong>
                <span>① Contínua: convencional</span>
                <span>② Tracejada: alternativa</span>
                <span>③ Grossa: recomendada</span>
                <span>! Barreira · ✓ resolvida · ● origem · ◆ destino</span>
              </div>
            </div>
            <div className="route-buttons" aria-label="Exibir rotas">
              {ids.map((id) => (
                <button
                  key={id}
                  className={routeClass[id]}
                  aria-pressed={view === id}
                  onClick={() => setView(id)}
                >
                  {routeNames[id]}
                </button>
              ))}
              <button aria-pressed={view === "all"} onClick={() => setView("all")}>
                Ver todas
              </button>
            </div>
            {selected && (
              <div className="selection" role="status">
                <strong>
                  {works.find((w) => w.id === selected)!.barrier} ·{" "}
                  {works.find((w) => w.id === selected)!.segment}
                </strong>
                <span>
                  {applied.includes(selected)
                    ? "Intervenção aplicada: barreira resolvida."
                    : `Impacto para ${profiles.find((p) => p.id === profile)!.name}: peso ${weights[profile][selected]}.`}
                </span>
                {photos[selected] && (
                  <img
                    className="barrier-photo"
                    src={photos[selected]}
                    alt={`Foto enviada para ${works.find((w) => w.id === selected)!.barrier}; ainda não verificada`}
                  />
                )}
                {mode === "gestor" && (
                  <label className="photo-upload">
                    Anexar foto da barreira (até 2 MB)
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => attachPhoto(selected, event.target.files?.[0])}
                    />
                  </label>
                )}
                <button onClick={() => setSelected(null)}>Fechar</button>
              </div>
            )}
            <p className="intervention-notice" aria-live="polite">
              {notice}
            </p>
            <details className="text-map">
              <summary>Descrição textual do mapa e das barreiras</summary>
              <p>
                Origem: {places.find((p) => p.id === start)?.name}. Destino:{" "}
                {places.find((p) => p.id === end)?.name}. Os trajetos usam caminhos conectados entre
                estes pontos. A geometria é demonstrativa e requer levantamento do campus.
              </p>
              <ol>
                {ids.map((id) => (
                  <li key={id}>
                    {routeNames[id]}: {results[id].distance} m, {results[id].time} min,{" "}
                    {results[id].barriers.length} barreira(s).
                  </li>
                ))}
              </ol>
              <ul>
                {works.map((w) => (
                  <li key={w.id}>
                    {w.segment}: {w.barrier} — {applied.includes(w.id) ? "resolvida" : "ativa"}.
                  </li>
                ))}
              </ul>
            </details>
          </section>
          <aside className="controls">
            <section className="panel">
              <h2>Perfil de mobilidade</h2>
              <div className="trip-selectors">
                <label>
                  Origem
                  <select value={start} onChange={(e) => setStart(e.target.value as NodeId)}>
                    {places
                      .filter((p) => p.id !== end)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </label>
                <label>
                  Destino
                  <select value={end} onChange={(e) => setEnd(e.target.value as NodeId)}>
                    {places
                      .filter((p) => p.id !== start)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </label>
              </div>
              <div className="profile-grid">
                {profiles.map((item) => {
                  const Person = icons[item.id];
                  return (
                    <button
                      key={item.id}
                      className={profile === item.id ? "selected" : ""}
                      aria-pressed={profile === item.id}
                      onClick={() => setProfile(item.id)}
                    >
                      <Person />
                      <span>
                        <strong>{item.name}</strong>
                        <small>{item.detail}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                className="primary"
                onClick={() => {
                  setCalculated(true);
                  setView("all");
                }}
              >
                Calcular rotas
              </button>
              {calculated && (
                <p role="status">
                  Três rotas calculadas para {profiles.find((p) => p.id === profile)!.name}.
                </p>
              )}
            </section>
            {mode === "gestor" && (
              <section className="panel">
                <h2>Simular intervenções</h2>
                <p>Custos ilustrativos; confirmar com orçamento e vistoria.</p>
                {works.map((w) => (
                  <label className="work-row" key={w.id}>
                    <input
                      type="checkbox"
                      checked={active.includes(w.id)}
                      onChange={() => toggle(w.id)}
                    />
                    <span>
                      {w.label}
                      <small>
                        {w.segment} · R$ {w.cost.toLocaleString("pt-BR")}
                      </small>
                    </span>
                  </label>
                ))}
                <button onClick={() => setActive(works.map((w) => w.id))}>
                  Aplicar todas as intervenções
                </button>
                <button onClick={() => setActive([])}>Limpar obras</button>
                <p role="status" aria-live="polite">
                  {active.length} obra(s) aplicadas. Investimento estimado: R${" "}
                  {works
                    .filter((w) => active.includes(w.id))
                    .reduce((n, w) => n + w.cost, 0)
                    .toLocaleString("pt-BR")}
                  .
                </p>
              </section>
            )}
            {calculated ? (
              <section className="panel results">
                <h2>Comparação das três rotas</h2>
                <div className="table-wrap">
                  <table>
                    <caption>Distância, tempo, barreiras e score por rota</caption>
                    <thead>
                      <tr>
                        <th>Rota</th>
                        <th>Dist.</th>
                        <th>Tempo</th>
                        <th>Barreiras</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ids.map((id) => (
                        <tr key={id} className={id === "inclusiva" ? "best" : ""}>
                          <th>{routeNames[id]}</th>
                          <td>{results[id].distance} m</td>
                          <td>{results[id].time} min</td>
                          <td>{results[id].barriers.length}</td>
                          <td>{results[id].score}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="metrics">
                  <div>
                    <strong>{current.accessible}%</strong>
                    <span>% de trechos acessíveis contínuos</span>
                  </div>
                  <div>
                    <strong>{Math.max(0, previous.penalty - current.penalty)}</strong>
                    <span>Redução de esforço adicional (pontos)</span>
                  </div>
                  <div>
                    <strong>
                      {current.score}%{" "}
                      <small>
                        {current.score - previous.score >= 0 ? "+" : ""}
                        {current.score - previous.score}
                      </small>
                    </strong>
                    <span>Score (antes: {previous.score}%)</span>
                  </div>
                </div>
                <p className="explanation" aria-live="polite">
                  {explain(profile, applied, start, end)}
                </p>
                <div className="before-after">
                  <div>
                    <strong>Antes</strong>
                    <span>
                      {previous.score}% · {previous.time} min · {previous.barriers.length}{" "}
                      barreira(s)
                    </span>
                  </div>
                  <div>
                    <strong>Depois</strong>
                    <span>
                      {calculate(profile, active, start, end).inclusiva.score}% ·{" "}
                      {calculate(profile, active, start, end).inclusiva.time} min ·{" "}
                      {calculate(profile, active, start, end).inclusiva.barriers.length} barreira(s)
                    </span>
                  </div>
                </div>
                {mode === "gestor" && (
                  <div>
                    <h3>Impacto por R$ 1.000</h3>
                    <ol className="impact-list">
                      {works
                        .map((w) => ({
                          ...w,
                          gain: profiles.reduce(
                            (sum, p) =>
                              sum +
                              calculate(p.id, [w.id]).convencional.score -
                              calculate(p.id, []).convencional.score,
                            0,
                          ),
                        }))
                        .sort((a, b) => b.gain / b.cost - a.gain / a.cost)
                        .map((w) => (
                          <li key={w.id}>
                            {w.label}: {((w.gain * 1000) / w.cost).toFixed(1)} pontos somados nos
                            quatro perfis / R$ 1.000
                          </li>
                        ))}
                    </ol>
                    <small>Estimativas sintéticas; não equivalem a orçamento de obra.</small>
                  </div>
                )}
                <div className="actions">
                  <button onClick={share}>
                    <Share2 size={16} /> Compartilhar
                  </button>
                  <button onClick={exportReport}>
                    <Download size={16} /> Salvar relatório em PDF
                  </button>
                </div>
              </section>
            ) : (
              <section className="panel">
                <h2>Resultado</h2>
                <p>Escolha o perfil e clique em “Calcular rotas” para comparar os percursos.</p>
              </section>
            )}
          </aside>
        </div>
        <footer>
          Protótipo demonstrativo · Caminhos, obstáculos e custos sintéticos; não usar para
          navegação real. A Biblioteca Central fica no bloco E, 4º andar, segundo o{" "}
          <a
            href="https://www.cefet-rj.br/biblioteca-campus-maracana"
            target="_blank"
            rel="noreferrer"
          >
            CEFET/RJ
          </a>
          . Fonte de dados de campo ainda pendente. © OpenStreetMap contributors no mapa externo.
        </footer>
        {tour > 0 && (
          <div
            className="tour-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-title"
          >
            <div className="tour-card">
              <h2 id="tour-title">Passo {tour} de 3</h2>
              <p>
                {
                  [
                    "Escolha um perfil de mobilidade e os pontos de origem e destino.",
                    "Calcule e compare as três rotas; leia as barreiras no mapa ou na descrição textual.",
                    "No modo Gestor, aplique uma obra e compare score, esforço, tempo e custo.",
                  ][tour - 1]
                }
              </p>
              <button onClick={() => setTour(0)}>Fechar</button>
              {tour < 3 && (
                <button className="primary" onClick={() => setTour(tour + 1)}>
                  Próximo
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
function CampusMap({
  profile,
  active,
  view,
  start,
  end,
  animate,
  calculated,
  selected,
  onSelect,
}: {
  profile: Profile;
  active: Work[];
  view: RouteId | "all";
  start: NodeId;
  end: NodeId;
  animate: boolean;
  calculated: boolean;
  selected: Work | null;
  onSelect: (id: Work) => void;
}) {
  const results = calculate(profile, active, start, end);
  const Icon = icons[profile];
  const [sx, sy] = nodes[start];
  const [ex, ey] = nodes[end];
  const motionPath = results.inclusiva.path
    .map((node, i) => `${i ? "L" : "M"}${nodes[node].join(" ")}`)
    .join(" ");
  const draw = (id: RouteId) => {
    const result = results[id];
    const points = result.path.map((n) => nodes[n].join(",")).join(" ");
    return (
      <g key={id} className={routeClass[id]}>
        <polyline
          points={points}
          fill="none"
          stroke="var(--card)"
          strokeWidth={id === "inclusiva" ? 19 : 15}
          strokeLinejoin="round"
        />
        <polyline
          points={points}
          fill="none"
          className="route-path"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={id === "inclusiva" ? 11 : 7}
        />
        <text
          x={
            nodes[result.path[Math.floor(result.path.length / 2)]!][0] +
            (id === "inclusiva" ? 30 : -30)
          }
          y={nodes[result.path[Math.floor(result.path.length / 2)]!][1] - 24}
          className="route-number"
        >
          {id === "convencional" ? "1" : id === "alternativa" ? "2" : "3"}
        </text>
      </g>
    );
  };
  return (
    <svg
      viewBox="0 0 1000 720"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Mapa esquemático com ${view === "all" ? "três rotas" : routeNames[view]} para ${profiles.find((p) => p.id === profile)!.name}`}
    >
      <rect width="1000" height="720" fill="var(--map)" />
      <g fill="var(--building)" stroke="var(--border)" strokeWidth="2">
        <rect x="160" y="100" width="175" height="170" rx="10" />
        <rect x="405" y="100" width="160" height="170" rx="10" />
        <rect x="650" y="100" width="135" height="170" rx="10" />
        <rect x="175" y="395" width="110" height="70" rx="8" />
        <rect x="405" y="395" width="160" height="70" rx="8" />
        <rect x="720" y="395" width="120" height="70" rx="8" />
      </g>
      <g className="campus-paths">
        {[350, 500, 620].map((y) => (
          <line key={y} x1="95" y1={y} x2="865" y2={y} />
        ))}
        {[100, 340, 500, 660, 860].map((x) => (
          <line key={x} x1={x} y1="120" x2={x} y2="625" />
        ))}
      </g>
      <g aria-hidden="true" className="accessibility-features">
        <path d="M308 334v32m8-32v32m8-32v32" stroke="var(--foreground)" strokeWidth="3" />
        <path d="M635 480v40m12-40v40m12-40v40m12-40v40" stroke="var(--card)" strokeWidth="7" />
        <path d="M415 500h140" stroke="var(--route-yellow)" strokeWidth="5" strokeDasharray="3 9" />
        <text x="285" y="315" className="map-text">
          guia
        </text>
        <text x="630" y="550" className="map-text">
          faixa
        </text>
      </g>
      <g className="map-labels">
        <text x="172" y="190">
          Bloco A
        </text>
        <text x="420" y="190">
          Bloco C
        </text>
        <text x="660" y="190">
          Biblioteca · Bloco E
        </text>
        <text x="175" y="440">
          Cantina
        </text>
        <text x="720" y="440">
          Pátio
        </text>
      </g>
      {calculated &&
        ids.filter((id) => id !== "inclusiva" && (view === "all" || view === id)).map(draw)}
      {calculated && (view === "all" || view === "inclusiva") && draw("inclusiva")}
      {edges
        .filter((edge) => edge.barrier && active.includes(edge.barrier))
        .map((edge) => (
          <line
            key={`${edge.a}-${edge.b}`}
            x1={nodes[edge.a][0]}
            y1={nodes[edge.a][1]}
            x2={nodes[edge.b][0]}
            y2={nodes[edge.b][1]}
            stroke="var(--route-green)"
            strokeWidth="5"
            strokeDasharray="6 6"
            aria-hidden="true"
          />
        ))}
      {works.map((w) => (
        <g
          key={w.id}
          className="barrier"
          role="button"
          tabIndex={0}
          aria-label={`${w.segment}: ${w.barrier}, ${active.includes(w.id) ? "resolvida" : "ativa"}`}
          onClick={() => onSelect(w.id)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelect(w.id);
            }
          }}
        >
          <line
            x1={w.x}
            y1={w.y + 15}
            x2={w.x}
            y2={w.y + 45}
            stroke="var(--foreground)"
            strokeWidth="2"
            strokeDasharray="3 3"
            aria-hidden="true"
          />
          <circle
            cx={w.x}
            cy={w.y}
            r="19"
            className={active.includes(w.id) ? "resolved" : "unresolved"}
            stroke="var(--card)"
            strokeWidth="4"
          />
          <text
            x={w.x}
            y={w.y + 6}
            textAnchor="middle"
            fill="white"
            fontSize="21"
            fontWeight="bold"
          >
            {active.includes(w.id) ? "✓" : "!"}
          </text>
          <text x={w.x - 18} y={w.y - 28} className="segment-label">
            {w.segment}
          </text>
          {selected === w.id && (
            <circle
              cx={w.x}
              cy={w.y}
              r="25"
              fill="none"
              stroke="var(--foreground)"
              strokeWidth="2"
            />
          )}
        </g>
      ))}
      <circle cx={sx} cy={sy} r="13" fill="var(--primary)" stroke="var(--card)" strokeWidth="5" />
      <text x={sx + 15} y={sy + 40} className="map-text">
        ORIGEM
      </text>
      <rect
        x={ex - 11}
        y={ey - 11}
        width="22"
        height="22"
        transform={`rotate(45 ${ex} ${ey})`}
        fill="var(--destructive)"
        stroke="var(--card)"
        strokeWidth="4"
      />
      <text x={ex - 50} y={ey - 30} className="map-text">
        DESTINO
      </text>
      <g transform={animate ? undefined : `translate(${sx} ${sy})`}>
        {animate && <animateMotion dur="18s" repeatCount="indefinite" path={motionPath} />}
        <circle r="24" fill="var(--primary)" />
        <foreignObject x="-12" y="-12" width="24" height="24">
          <Icon xmlns="http://www.w3.org/1999/xhtml" size={24} color="white" />
        </foreignObject>
        <text x="30" y="6" className="map-text">
          {profiles.find((p) => p.id === profile)!.name}
        </text>
      </g>
      <text x="925" y="58" className="map-text">
        N ↑
      </text>
      <line x1="790" y1="677" x2="890" y2="677" stroke="var(--foreground)" strokeWidth="3" />
      <text x="810" y="668" className="map-text">
        Escala ilustrativa
      </text>
    </svg>
  );
}
