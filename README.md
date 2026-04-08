# 💧 HidroSmart

**Controle de consumo de água para condomínios** — PWA (Progressive Web App) completa, instalável em mobile, desktop e web, sem servidor backend.

---

## 🚀 Deploy rápido

### GitHub Pages (gratuito)

```bash
# 1. Clone ou faça upload dos arquivos para um repositório público
git init
git add .
git commit -m "HidroSmart v2.0"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/hidrosmart.git
git push -u origin main

# 2. No GitHub: Settings → Pages → Source: "Deploy from a branch" → main → / (root)
```

A URL ficará: `https://SEU_USUARIO.github.io/hidrosmart/`

### Vercel (gratuito, recomendado para domínio customizado)

```bash
npm i -g vercel
vercel --prod
```

Ou conecte o repositório em [vercel.com](https://vercel.com) e o deploy é automático.

---

## 📁 Estrutura de arquivos

```
hidrosmart/
├── index.html          # App completa (single-file PWA)
├── manifest.json       # Manifesto PWA (nome, ícones, cores)
├── sw.js               # Service Worker (cache offline)
├── icon-192.png        # Ícone 192×192 px
├── icon-512.png        # Ícone 512×512 px
├── browserconfig.xml   # Configuração para Windows/Edge
├── vercel.json         # Config de deploy Vercel
├── .nojekyll           # Desativa Jekyll no GitHub Pages
└── README.md           # Este arquivo
```

---

## 📱 Instalação como app (PWA)

### Android / Chrome
1. Abra a URL no Chrome
2. Toque nos **⋮** (três pontos) → **"Adicionar à tela inicial"**
3. O app aparece na tela inicial como app nativo

### iPhone / Safari
1. Abra a URL no Safari
2. Toque em **Compartilhar** (ícone de caixa com seta) → **"Adicionar à Tela de Início"**
3. Confirme o nome e toque em **Adicionar**

### Desktop (Chrome / Edge)
1. Abra a URL no navegador
2. Clique no ícone de **instalação** (⊕) na barra de endereço
3. Ou: menu ⋮ → **"Instalar HidroSmart"**

---

## ✨ Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| 🏠 Dashboard | Visão geral com KPIs, tanques, histórico e alertas |
| 💧 Ciclos de leitura | Registro e acompanhamento por período |
| 📊 Análise mensal | Gráficos de consumo, tendências e projeções |
| 🔧 Manutenção | Controle de equipamentos e histórico de serviços |
| 📋 Ocorrências | Registro e acompanhamento de problemas |
| 💰 Faturamento | Cálculo de tarifas e geração de boletos |
| 🛡️ Saúde do sistema | Score geral e alertas inteligentes |
| 🌐 IoT | Monitoramento de sensores em tempo real |
| 🧮 Calculadoras | Hidráulica, vazão, HMT, bomba, tubulação |
| ⚙️ Configurações | Multi-instalação, tarifas, dark mode |

---

## 🔧 Tecnologias

- **HTML5 / CSS3 / JavaScript** — zero dependências externas
- **PWA** — instalável, funciona offline via Service Worker
- **LocalStorage** — dados persistidos localmente no dispositivo
- **Canvas API** — gráficos renderizados nativamente
- **Web Fonts** — Outfit, Inter, JetBrains Mono (Google Fonts)

---

## 🌙 Dark Mode

O app detecta automaticamente o tema do sistema (claro/escuro) e também permite alternar manualmente pelo botão na barra superior.

---

## 📦 Atualização do app

Quando uma nova versão for publicada, o Service Worker detecta automaticamente e atualiza o cache na próxima visita. Nenhuma ação manual necessária.

---

## 📄 Licença

Uso interno / privado. Todos os direitos reservados.
