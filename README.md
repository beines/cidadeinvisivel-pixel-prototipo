# Cidade Invisível | PIXEL

Protótipo de roteamento inclusivo para quatro perfis de mobilidade. O motor em `src/lib/campus.ts` usa um grafo e Dijkstra com pesos por tipo de barreira; a interface compara três trajetos e permite simular cinco intervenções. O mapa, as distâncias, as barreiras e os custos são **sintéticos**. Não use os resultados para se orientar no campus ou definir obras.

A Biblioteca Central do campus Maracanã fica no bloco E, 4º andar, conforme [o CEFET/RJ](https://www.cefet-rj.br/biblioteca-campus-maracana). O mapa externo OpenStreetMap mostra o entorno real, mas não recebe as rotas sintéticas como se fossem dados georreferenciados.

## Executar

```sh
npm install
npm run dev
```

## Verificar

```sh
npm run build
npx tsc --noEmit
npm test
npm run lint
```

O [checklist](CHECKLIST.md) mostra cada requisito, o que foi implementado e os dados que ainda faltam para o piloto real. A logo original hospedada no Lovable estava indisponível; o SVG local é um substituto.
