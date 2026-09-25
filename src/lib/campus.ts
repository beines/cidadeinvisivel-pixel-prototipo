export type Profile = "ana" | "roberto" | "maria" | "carlos";
export type Work = "rampa" | "calcada" | "luz" | "tatil" | "travessia";
export type RouteId = "convencional" | "alternativa" | "inclusiva";
export const profiles = [
  { id: "ana", name: "Ana", detail: "Cadeira de rodas", speed: 48 },
  { id: "roberto", name: "Roberto", detail: "Deficiência visual", speed: 65 },
  { id: "maria", name: "Dona Maria", detail: "Mobilidade reduzida", speed: 43 },
  { id: "carlos", name: "Carlos", detail: "Carrinho de bebê", speed: 60 },
] as const;
export const works: {
  id: Work;
  label: string;
  barrier: string;
  cost: number;
  x: number;
  y: number;
  segment: string;
}[] = [
  {
    id: "rampa",
    label: "Instalar rampa",
    barrier: "Guia sem rebaixamento",
    cost: 12000,
    x: 220,
    y: 305,
    segment: "T2",
  },
  {
    id: "calcada",
    label: "Nivelar calçada",
    barrier: "Piso irregular",
    cost: 18000,
    x: 420,
    y: 305,
    segment: "T3",
  },
  {
    id: "luz",
    label: "Adicionar iluminação",
    barrier: "Iluminação insuficiente",
    cost: 8000,
    x: 580,
    y: 305,
    segment: "T4",
  },
  {
    id: "tatil",
    label: "Implantar piso tátil",
    barrier: "Sem piso tátil",
    cost: 26000,
    x: 420,
    y: 455,
    segment: "T6",
  },
  {
    id: "travessia",
    label: "Travessia elevada",
    barrier: "Travessia sem proteção",
    cost: 35000,
    x: 580,
    y: 455,
    segment: "T7",
  },
];
export const weights: Record<Profile, Record<Work, number>> = {
  ana: { rampa: 100, calcada: 70, luz: 8, tatil: 2, travessia: 35 },
  roberto: { rampa: 8, calcada: 25, luz: 35, tatil: 100, travessia: 85 },
  maria: { rampa: 55, calcada: 90, luz: 25, tatil: 12, travessia: 65 },
  carlos: { rampa: 75, calcada: 75, luz: 12, tatil: 3, travessia: 60 },
};
export const nodes = {
  portao: [100, 620],
  a: [100, 350],
  b: [340, 350],
  c: [500, 350],
  d: [660, 350],
  e: [860, 350],
  biblioteca: [860, 120],
  f: [100, 500],
  g: [340, 500],
  h: [500, 500],
  i: [660, 500],
  j: [860, 500],
  k: [340, 620],
  l: [660, 620],
  m: [860, 620],
} as const;
export type NodeId = keyof typeof nodes;
export const places = [
  { id: "portao", name: "Portão principal" },
  { id: "f", name: "Pátio central" },
  { id: "j", name: "Pátio do bloco E" },
  { id: "biblioteca", name: "Biblioteca / Bloco E" },
] as const;
type Edge = { a: NodeId; b: NodeId; metres: number; barrier?: Work; segment: string };
export const edges: Edge[] = [
  { a: "portao", b: "a", metres: 120, segment: "T1" },
  { a: "a", b: "b", metres: 145, barrier: "rampa", segment: "T2" },
  { a: "b", b: "c", metres: 100, barrier: "calcada", segment: "T3" },
  { a: "c", b: "d", metres: 100, barrier: "luz", segment: "T4" },
  { a: "d", b: "e", metres: 120, segment: "T5" },
  { a: "e", b: "biblioteca", metres: 115, segment: "T8" },
  { a: "portao", b: "f", metres: 65, segment: "T1" },
  { a: "f", b: "g", metres: 145, segment: "T2" },
  { a: "g", b: "h", metres: 100, barrier: "tatil", segment: "T6" },
  { a: "h", b: "i", metres: 100, barrier: "travessia", segment: "T7" },
  { a: "i", b: "j", metres: 120, segment: "T5" },
  { a: "j", b: "e", metres: 75, segment: "T8" },
  { a: "portao", b: "k", metres: 220, segment: "T1" },
  { a: "k", b: "l", metres: 330, segment: "T9" },
  { a: "l", b: "m", metres: 200, segment: "T10" },
  { a: "m", b: "j", metres: 125, segment: "T11" },
  { a: "b", b: "g", metres: 75, segment: "T12" },
  { a: "c", b: "h", metres: 75, segment: "T13" },
  { a: "d", b: "i", metres: 75, segment: "T14" },
];
const paths: Record<RouteId, NodeId[]> = {
  convencional: ["portao", "a", "b", "c", "d", "e", "biblioteca"],
  alternativa: ["portao", "k", "l", "m", "j", "e", "biblioteca"],
  inclusiva: [],
};
function edgeBetween(a: NodeId, b: NodeId) {
  return edges.find((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a))!;
}
export function routeFor(path: NodeId[], profile: Profile, active: Work[]) {
  const parts = path.slice(1).map((node, i) => edgeBetween(path[i]!, node));
  const barriers = parts.filter((e) => e.barrier && !active.includes(e.barrier));
  const distance = parts.reduce((n, e) => n + e.metres, 0);
  const penalty = barriers.reduce((n, e) => n + weights[profile][e.barrier!], 0);
  const time = Math.ceil(distance / profiles.find((p) => p.id === profile)!.speed + penalty / 20);
  return {
    path,
    parts,
    distance,
    barriers,
    penalty,
    time,
    score: Math.max(0, Math.round(100 - penalty / 3)),
    accessible: Math.round(
      (100 * (parts.length - barriers.filter((e) => weights[profile][e.barrier!] >= 50).length)) /
        Math.max(1, parts.length),
    ),
  };
}
export function shortestRoute(
  profile: Profile,
  active: Work[],
  start: NodeId = "portao",
  end: NodeId = "biblioteca",
  mode: "weighted" | "distance" | "detour" = "weighted",
) {
  if (start === end) return routeFor([start], profile, active);
  const best = new Map<NodeId, number>([[start, 0]]);
  const prev = new Map<NodeId, NodeId>();
  const seen = new Set<NodeId>();
  while (seen.size < Object.keys(nodes).length) {
    const current = (Object.keys(nodes) as NodeId[])
      .filter((n) => !seen.has(n))
      .sort((a, b) => (best.get(a) ?? Infinity) - (best.get(b) ?? Infinity))[0];
    if (!current || !Number.isFinite(best.get(current) ?? Infinity) || current === end) break;
    seen.add(current);
    for (const e of edges.filter((e) => e.a === current || e.b === current)) {
      const next = e.a === current ? e.b : e.a;
      const cost =
        e.metres +
        (mode === "detour"
          ? e.barrier
            ? 2000
            : 0
          : mode === "distance"
            ? 0
            : e.barrier && !active.includes(e.barrier)
              ? weights[profile][e.barrier] * 4
              : 0);
      const candidate = best.get(current)! + cost;
      if (candidate < (best.get(next) ?? Infinity)) {
        best.set(next, candidate);
        prev.set(next, current);
      }
    }
  }
  const path: NodeId[] = [end];
  while (path[0] !== start && prev.has(path[0]!)) path.unshift(prev.get(path[0]!)!);
  if (path[0] !== start) throw new Error("Pontos sem conexão no grafo");
  return routeFor(path, profile, active);
}
export function calculate(
  profile: Profile,
  active: Work[],
  start: NodeId = "portao",
  end: NodeId = "biblioteca",
) {
  const recommended = shortestRoute(profile, active, start, end);
  return {
    convencional:
      start === "portao" && end === "biblioteca"
        ? routeFor(paths.convencional, profile, active)
        : shortestRoute(profile, active, start, end, "distance"),
    alternativa:
      start === "portao" && end === "biblioteca"
        ? routeFor(paths.alternativa, profile, active)
        : shortestRoute(profile, active, start, end, "detour"),
    inclusiva: recommended,
  };
}
export function explain(
  profile: Profile,
  active: Work[],
  start: NodeId = "portao",
  end: NodeId = "biblioteca",
) {
  const results = calculate(profile, active, start, end);
  const chosen = results.inclusiva;
  const rejected = results.convencional.barriers.sort(
    (a, b) => weights[profile][b.barrier!] - weights[profile][a.barrier!],
  )[0];
  const why = rejected
    ? `${works.find((w) => w.id === rejected.barrier)!.barrier} em ${rejected.segment} pesa ${weights[profile][rejected.barrier!]} para ${profiles.find((p) => p.id === profile)!.name}.`
    : "O trajeto convencional não tem barreiras ativas para este perfil.";
  return `Rota 3 calculada por menor custo no grafo: ${chosen.distance} m, ${chosen.time} min e ${chosen.barriers.length} barreira(s). ${why} ${active.length ? `${active.length} obra(s) simulada(s) alteram os custos das arestas.` : ""}`;
}
