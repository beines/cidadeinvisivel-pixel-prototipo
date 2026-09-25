# Cidade Invisível — checklist de execução

Estado verificado em 24/09/2026. `[x]` implementado no protótipo; `[~]` parcial; `[ ]` depende de insumos ou infraestrutura ainda ausentes. **O grafo, as cinco barreiras, as distâncias e os custos são dados sintéticos. O mapa esquemático não é apropriado para orientação no campus.**

## Necessárias (primeiro)

- [x] Consertar logo quebrada — SVG local e ícones PWA substituem a URL interna do Lovable. O arquivo original da marca não estava disponível.
- [x] Fazer mapa respeitar tema escuro — cores resolvidas por variáveis CSS de tema no SVG.
- [~] Tirar barreira de cima da rota recomendada — marcadores agora são chamadas fora das linhas, com conexão ao trecho. O motor ainda pode recomendar um trecho com penalidade pequena; o alerta permanece visível e contabilizado.
- [x] Separar “Calcular rotas” de “aplicar todas as obras” — comandos distintos; cálculo revela os resultados.
- [x] Ícone do agente conforme perfil — Ana, Roberto, Maria e Carlos usam ícones e nomes distintos.
- [x] Alinhar marcadores e mapa em qualquer tela — todos os elementos em coordenadas do mesmo viewBox SVG.
- [x] Declarar idioma como português — `lang="pt-BR"`.
- [ ] Desenhar mapa a partir do campus real — falta planta/levantamento georreferenciado. O endereço do bloco E foi confirmado, mas o desenho continua sintético.
- [ ] Rotas seguindo calçadas e caminhos reais — o grafo segue caminhos conectados do esquema, sem validação em campo.
- [x] Numerar trechos citados pela explicação — T1–T14 no grafo e marcadores.
- [x] Deixar mudança visível quando obra é aplicada — marcador resolvido, trecho pontilhado e aviso textual.
- [x] Legenda fixa no mapa — linhas, números, barreiras, origem e destino.
- [x] Mostrar comparação das três rotas com números — distância, tempo, barreiras e score.
- [x] Fazer rotas e alertas mudarem com o perfil — Dijkstra usa pesos específicos por perfil.
- [x] Uma barreira no mapa para cada intervenção — cinco intervenções e cinco marcadores.
- [x] Pesos de intervenção por perfil — matriz perfil × barreira em `src/lib/campus.ts`.
- [x] Explicação gerada a partir do cálculo — distância, tempo, barreiras e motivo com maior peso.
- [x] Aumentar textos pequenos — controles e métricas com base de 14–16 px, com botão A+.
- [x] Não diferenciar rotas só pela cor — traços contínuo/tracejado/grosso, números e nomes.
- [x] Alternativa em texto para o mapa — lista de rotas e barreiras com estados.
- [x] Motor de rotas explicável — grafo de arestas e Dijkstra; **os dados de entrada ainda são sintéticos**.

## Recomendadas (segundo)

- [x] Não apagar intervenções ao trocar de perfil — cenário preservado.
- [~] Evitar sobreposições e cortes de texto — truncamentos removidos e pontos do mapa reposicionados; falta inspeção visual automatizada em dispositivos.
- [x] Trocar “modo celular” por responsividade — breakpoints CSS sem moldura de celular.
- [x] Destacar rota recomendada — mais grossa e desenhada acima das demais.
- [x] Mostrar variação do score — comparação numérica Antes/Depois.
- [~] Pontos de referência reconhecíveis — blocos A, C, E e restaurante rotulados; posições no esquema ainda sem validação.
- [x] Desenhar elementos de acessibilidade — guia, faixa e piso tátil representados esquematicamente.
- [~] Fotos reais das barreiras — o gestor pode anexar fotos locais ao marcador; faltam fotos verificadas do campus e armazenamento compartilhado.
- [x] Tempo estimado com lógica — distância/velocidade por perfil + penalidade de barreira.
- [x] Antes vs. Depois — botão do mapa e comparação numérica lado a lado.
- [x] Visão do gestor: custo e impacto — custos sintéticos, total e ranking de pontos por R$ 1.000.
- [x] Métricas com nomes do documento — trechos acessíveis contínuos e redução de esforço adicional.
- [x] Barreiras legíveis ao toque — seleção abre painel com texto e foto, quando anexada.
- [~] Auditoria automática — ESLint com regras `jsx-a11y` para a página. Axe/Lighthouse no navegador não rodaram neste ambiente.
- [~] Layout mobile com mapa protagonista — mapa vem antes dos controles e usa largura integral; não há painel inferior com abas.
- [x] Separar modo Cidadão e Gestor — intervenção e impacto só no modo Gestor.
- [x] PWA — manifesto, service worker e ícones 192/512; instalação deve ser validada em navegador com HTTPS.
- [~] Organizar código para crescer — dados e motor separados em `src/lib/campus.ts`; a interface ainda concentra vários blocos em `src/routes/index.tsx`.

## Desejáveis (terceiro)

- [~] Zerar lint e aviso de hidratação — zero erros de lint; seis avisos de Fast Refresh em componentes genéricos. O Switch que causava a divergência foi removido; console não foi auditado em navegador.
- [~] Escala e orientação — indicador de norte e aviso de escala ilustrativa; barra métrica depende de levantamento real.
- [x] Animar agente sintético — movimento SVG na rota calculada, com botão para parar.
- [x] Origem e destino selecionáveis — quatro pontos do grafo; pares distintos.
- [x] Alto contraste e tamanho de fonte — controles no cabeçalho.
- [x] Tour rápido — três passos.
- [x] Compartilhar cenário por link — perfil, obras, origem e destino na URL.
- [x] Imagem de compartilhamento — `public/share.svg` com dimensões 1200×630 e `og:image`.
- [~] Exportar relatório — impressão com CSS próprio e opção “Salvar como PDF” do navegador; ainda não há geração de arquivo PDF direta.
- [x] Testes do motor — conectividade, pesos, obras e pares de pontos.
- [ ] Explicação com LLM — falta serviço, chave e controle de custo; a explicação determinística é funcional.

## Depois do MVP (quarto)

- [~] Mapa real com Leaflet/MapLibre — visualização separada do OpenStreetMap por iframe, sem sobreposição do grafo e das barreiras georreferenciadas.
- [ ] Relato colaborativo de barreiras — foto local por marcador existe; falta conta, serviço compartilhado e moderação.
- [~] Dados do OpenStreetMap — mapa externo com atribuição; ainda não há importação de tags e caminhos para o motor.
- [ ] Detecção de barreiras em imagens — exige modelo e imagens rotuladas/validadas.
- [ ] Navegação GPS em tempo real — não é segura sem grafo georreferenciado e auditado.

## Verificação executada

- `npm run build`: passou.
- `npx tsc --noEmit`: passou.
- `npm test`: quatro testes passaram.
- `npm run lint`: zero erros, seis avisos de Fast Refresh em componentes genéricos.
- Resposta HTML no servidor local: `lang="pt-BR"`, conteúdo e logo local presentes.
- Inspeção visual/Axe/Lighthouse: indisponível. O binário de navegador não veio instalado e o download do Chromium foi truncado pelo ambiente.

Fontes para os nomes confirmados: [Biblioteca Central do CEFET/RJ](https://www.cefet-rj.br/biblioteca-campus-maracana) e [OpenStreetMap](https://www.openstreetmap.org/#map=18/-22.91188/-43.2242). As localizações de barreiras não foram obtidas dessas fontes.
