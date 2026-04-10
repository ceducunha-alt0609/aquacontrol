# 💧 HidroSmart v2.0

Controle de consumo de água para condomínios — PWA + Desktop.

## 🌐 Acesso Web (GitHub Pages)

Após subir no GitHub e habilitar Pages:
```
https://<seu-usuario>.github.io/<nome-do-repo>/
```

- Funciona em qualquer navegador moderno
- Instalável como PWA no Android, iOS e Chrome Desktop
- Funciona offline (Service Worker incluso)

---

## 📱 Instalação Mobile

### Android
1. Acesse a URL pelo Chrome
2. Toque em **"Adicionar à tela inicial"** (banner ou menu ⋮)
3. O app abre em tela cheia como app nativo

### iOS (Safari)
1. Acesse a URL pelo Safari
2. Toque em **Compartilhar** → **Adicionar à Tela de Início**
3. O app abre standalone

---

## 💻 Desktop (Electron)

### Pré-requisitos
- Node.js 18+ → https://nodejs.org
- Python 3 + Pillow (para gerar ícones)

### Instalar e rodar localmente
```bash
# Gerar ícones
pip install Pillow
python generate_icons.py

# Instalar dependências
npm install

# Rodar em modo dev
npm start
```

### Gerar instaladores

```bash
# Windows (.exe instalador + portable)
npm run build:win

# Linux (.AppImage + .deb)
npm run build:linux

# macOS (.dmg)
npm run build:mac

# Todos de uma vez (precisa de macOS para o .dmg)
npm run build:all
```

Os instaladores ficam em `./dist/`.

---

## 🚀 Deploy automático (GitHub Actions)

O workflow `.github/workflows/deploy.yml` faz:

1. **Push para `main`** → deploya automaticamente no GitHub Pages
2. **Tag `v*`** (ex: `v2.1.0`) → gera instaladores para Windows, Linux e macOS e cria um GitHub Release

```bash
# Criar release com instaladores
git tag v2.1.0
git push origin v2.1.0
```

---

## 📁 Estrutura de arquivos

```
├── index.html          ← App principal (PWA single-file)
├── sw.js               ← Service Worker externo
├── manifest.json       ← PWA Manifest
├── browserconfig.xml   ← Windows/Edge tile
├── favicon.ico         ← Favicon (gerado)
├── apple-touch-icon.png← iOS icon (gerado)
├── main.js             ← Electron entry point
├── package.json        ← Configuração Electron + builder
├── generate_icons.py   ← Gerador de ícones e splash screens
├── icons/              ← Ícones gerados (72px → 512px)
├── splash/             ← Splash screens iOS (gerados)
└── .github/
    └── workflows/
        └── deploy.yml  ← CI/CD GitHub Actions
```

---

## ⚙️ Habilitar GitHub Pages

1. Vá em **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Salvar

---

## 📄 Licença

MIT
