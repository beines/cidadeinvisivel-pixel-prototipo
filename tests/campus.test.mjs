import test from "node:test";
import assert from "node:assert/strict";
import { calculate, shortestRoute, works, places, edges } from "../src/lib/campus.ts";

test("a rota recomendada conecta origem e destino por arestas existentes", () => {
  for (const profile of ["ana", "roberto", "maria", "carlos"]) {
    for (const active of [[], works.map((w) => w.id)]) {
      const route = shortestRoute(profile, active);
      assert.equal(route.path[0], "portao");
      assert.equal(route.path.at(-1), "biblioteca");
      assert.equal(route.parts.length, route.path.length - 1);
      assert.ok(route.distance > 0 && route.time > 0);
    }
  }
});

test("obras resolvem suas barreiras e mudam os custos por perfil", () => {
  const before = calculate("roberto", []);
  const after = calculate(
    "roberto",
    works.map((w) => w.id),
  );
  assert.equal(before.convencional.barriers.length, 3);
  assert.equal(after.convencional.barriers.length, 0);
  assert.ok(after.convencional.score > before.convencional.score);
  assert.ok(after.convencional.time < before.convencional.time);
  assert.notEqual(calculate("ana", []).convencional.penalty, before.convencional.penalty);
});

test("todos os pares selecionáveis geram caminhos conectados", () => {
  for (const start of places)
    for (const end of places) {
      if (start.id === end.id) continue;
      const route = calculate("ana", [], start.id, end.id).inclusiva;
      assert.equal(route.path[0], start.id);
      assert.equal(route.path.at(-1), end.id);
      for (let index = 1; index < route.path.length; index++) {
        assert.ok(
          edges.some(
            (edge) =>
              [edge.a, edge.b].includes(route.path[index - 1]) &&
              [edge.a, edge.b].includes(route.path[index]),
          ),
        );
      }
    }
});

test("aplicar todas as obras não piora score ou tempo de nenhuma combinação", () => {
  for (const profile of ["ana", "roberto", "maria", "carlos"])
    for (const start of places)
      for (const end of places) {
        if (start.id === end.id) continue;
        const before = calculate(profile, [], start.id, end.id).inclusiva;
        const after = calculate(
          profile,
          works.map((w) => w.id),
          start.id,
          end.id,
        ).inclusiva;
        assert.ok(after.score >= before.score);
        assert.ok(after.time <= before.time);
      }
});
