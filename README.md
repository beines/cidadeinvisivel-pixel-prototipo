# City Connect AI

Crie uma aplicação web dashboard interativa e moderna chamada "Cidade Invisível — Roteador Inclusivo &amp; Simulador de Acessibilidade", desenvolvida pela Equipe PIXEL para o programa Jump Start 2026 (Missão 4: Mobilidade para Pessoas).

O design deve ser acessível, limpo, moderno, com bom contraste (tema claro/escuro) e totalmente responsivo.

ESTRUTURA DA PÁGINA (DASHBOARD)

1. HEADER / CABEÇALHO:
- Título: "Cidade Invisível | PIXEL"
- Subtítulo: "IA para Identificação e Redução de Desigualdades na Mobilidade Urbana"
- Badges no topo: "MVP Jump Start 2026", "Missão 4 — Mobilidade para Pessoas", "Protótipo Fase 1".

2. PAINEL ESQUERDO (Configuração &amp; Perfis de Mobilidade):
- Seletor de Perfis (Cards clicáveis com avatar/ícone e descrição curta):
  a) Ana (38 anos) — Usuária de Cadeira de Rodas (Selecionado por padrão)
  b) Roberto — Deficiente Visual / Baixa Visão
  c) Dona Maria — Idosa com Mobilidade Reduzida
  d) Carlos — Responsável com Carrinho de Bebê
- Campos de Entrada:
  - Origem: "Portão Principal — Campus CEFET/RJ"
  - Destino: "Biblioteca Central / Bloco E"
- Botão de Ação: "Calcular Rotas Inclusivas via IA"

3. ÁREA CENTRAL (Visualizador do Mapa &amp; Agentes Sintéticos):
- Um card grande simulando o mapa de microterritório do campus (estilo mapa estilizado com ruas/alamedas em SVG/Canvas com pins coloridos).
- Mostrar 3 Rotas desenhadas no mapa:
  - Rota 1 (Vermelha - Convencional): Mais curta no papel, mas com 3 barreiras críticas (degrau, calçada esburacada, falta de iluminação).
  - Rota 2 (Amarela - Alternativa Longa): Evita degraus, mas aumenta o percurso em 800m.
  - Rota 3 (Verde - IA Inclusiva Otimizada): Rota recomendada pela IA com melhor equilíbrio de esforço e segurança.
- Ícone de Agente Sintético (avatar da Ana) posicionado no mapa indicando a simulação do percurso.
- Marcadores de Barreiras clicáveis no mapa (ícones de alerta ⚠️) mostrando detalhes do obstáculo ao passar o mouse.

4. PAINEL DIREITO (Simulador de Intervenções — Jogo de Planejamento Inclusivo):
- Título: "🛠️ Simulador de Intervenções de Infraestrutura"
- Instrução: "Aplique melhorias no microterritório para transformar a rota:"
- 5 Botões de Intervenção (com estado Ativo/Inativo):
  1. ♿ "Instalar Rampa de Acessibilidade"
  2. 🧱 "Nivelar Calçada Esburacada"
  3. 💡 "Adicionar Iluminação Pública"
  4. 🦮 "Implantar Piso Tátil Direcionável"
  5. 🚶 "Criar Travessia Elevada / Faixa Acessível"

5. PAINEL INFERIOR (Métricas Antes vs. Depois &amp; Explicabilidade da IA):
- Card Comparativo de Desempenho:
  - Métrica 1: Score de Acessibilidade da Rota (Ex: 35% -&gt; 95% após intervenção).
  - Métrica 2: Nível de Esforço Físico (Ex: Alto / Crítico -&gt; Baixo / Totalmente Transitável).
  - Métrica 3: Tempo de Deslocamento estimado.
- Card de Explicabilidade da IA:
  - Caixas de texto dinâmicas: "Por que a IA recomendou esta rota? 'A IA descartou o trecho 2 devido a uma guia não rebaixada de 18cm, incompatível com o perfil de Cadeira de Rodas de Ana. Após a simulação da rampa, o trecho tornou-se 100% acessível.'"

REQUISITOS INTERATIVOS:
- Quando o usuário clica nos botões de intervenção, o mapa deve atualizar visualmente os indicadores e a barra de Score de Acessibilidade deve aumentar com animação fluida.
- Alternar entre os perfis deve mudar as recomendações de rota e os alertas do mapa.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://cidadeinvisivel-pixel-prototipo.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6b06989e-0a48-483c-ba6d-2e39b63a0182).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
