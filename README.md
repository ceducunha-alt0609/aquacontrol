# 💧 HidroSmart v2.0

**Gestão inteligente de água para condomínios**  
PWA (Progressive Web App) — funciona no navegador, pode ser instalado no celular e computador, e roda offline.

---

## 📁 Estrutura de Arquivos

```
hidrosmart/
├── index.html          ← App completo (single-file PWA)
├── sw.js               ← Service Worker (cache offline)
├── manifest.json       ← Manifesto PWA (ícones, nome, cores)
├── robots.txt          ← Instrução para buscadores
├── generate-icons.js   ← Script para gerar ícones PNG
│
├── icons/              ← Ícones PWA (gerar com generate-icons.js)
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   ├── icon-384.png
│   └── icon-512.png
│
├── screenshots/        ← Capturas de tela (opcional, para stores)
│   ├── desktop.png     (1280x800)
│   └── mobile.png      (390x844)
│
│   ── Configuração de servidor (use um dos abaixo) ──
├── .htaccess           ← Apache / cPanel / Hostinger
├── nginx.conf          ← Nginx
├── netlify.toml        ← Netlify
├── vercel.json         ← Vercel
├── _headers            ← Cloudflare Pages
└── _redirects          ← Netlify / Cloudflare Pages
```

---

## 🚀 Como Hospedar

### Opção 1 — Netlify (recomendado, gratuito)

1. Acesse [netlify.com](https://netlify.com) e crie uma conta
2. Clique em **"Add new site" → "Deploy manually"**
3. Arraste a **pasta `hidrosmart/`** inteira para a área de upload
4. Pronto! Você receberá um link `*.netlify.app`

**Ou via CLI:**
```bash
npm install -g netlify-cli
cd hidrosmart
netlify deploy --prod --dir .
```

---

### Opção 2 — Vercel (gratuito)

```bash
npm install -g vercel
cd hidrosmart
vercel --prod
```

---

### Opção 3 — GitHub Pages (gratuito)

1. Crie um repositório no GitHub
2. Suba todos os arquivos da pasta `hidrosmart/`
3. Vá em **Settings → Pages → Source: main branch / root**
4. Acesse em `https://SEU_USUARIO.github.io/REPOSITORIO/`

> ⚠️ O GitHub Pages não suporta `.htaccess`. O SPA fallback pode não funcionar com sub-rotas, mas como o HidroSmart é single-page, funciona normalmente.

---

### Opção 4 — Cloudflare Pages (gratuito)

1. Acesse [pages.cloudflare.com](https://pages.cloudflare.com)
2. Conecte seu repositório GitHub ou faça upload direto
3. Build command: **vazio** (nenhum)
4. Build output directory: **`.`** (raiz)

---

### Opção 5 — Apache / cPanel / Hostinger

1. Acesse o **Gerenciador de Arquivos** do cPanel
2. Navegue até `public_html/` (ou subpasta)
3. Faça upload de **todos os arquivos** da pasta `hidrosmart/`
4. O arquivo `.htaccess` já cuida do resto

> 💡 No Hostinger, o arquivo `.htaccess` às vezes fica oculto — certifique-se de marcar "Mostrar arquivos ocultos" no gerenciador.

---

### Opção 6 — Nginx (VPS)

```bash
# Copie os arquivos para o servidor
scp -r hidrosmart/ usuario@seu-servidor:/var/www/hidrosmart/

# Configure o Nginx
sudo cp hidrosmart/nginx.conf /etc/nginx/sites-available/hidrosmart
sudo ln -s /etc/nginx/sites-available/hidrosmart /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Edite `nginx.conf` e substitua `SEU_DOMINIO.com` pelo seu domínio real.

---

### Opção 7 — Testar localmente (sem servidor)

```bash
# Python 3
cd hidrosmart
python3 -m http.server 8080

# Node.js (npx)
npx serve .

# Acesse: http://localhost:8080
```

> ⚠️ O Service Worker só funciona em `localhost` ou em HTTPS. Em `file://` o app funciona, mas sem modo offline.

---

## 📱 Instalar no Celular (Android / iOS)

**Android (Chrome):**
1. Abra o app no Chrome
2. Aguarde o banner "Adicionar à tela inicial" aparecer, **ou**
3. Toque no menu ⋮ → "Adicionar à tela inicial"
4. Confirme — o app abrirá como app nativo (sem barra do navegador)

**iPhone/iPad (Safari):**
1. Abra o app no **Safari** (obrigatório)
2. Toque no botão de compartilhar ⎙
3. Role para baixo e toque **"Adicionar à Tela de Início"**
4. Confirme

---

## 💻 Instalar no Computador (Chrome/Edge)

1. Abra o app no navegador
2. Clique no ícone de instalar (📥) na barra de endereços, **ou**
3. Menu ⋮ → "Instalar HidroSmart..."
4. O app abrirá em janela separada, como um programa desktop

---

## 🖼️ Gerar Ícones

O `manifest.json` referencia ícones na pasta `icons/`. Para gerá-los:

```bash
# Instale a dependência (opcional, melhora a qualidade)
npm install sharp

# Gere os ícones
node generate-icons.js
```

Sem `sharp`, o script copia o ícone original para todos os tamanhos.  
Para melhor resultado, use ferramentas como:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net)

---

## 🔧 Configurações do Service Worker

O `sw.js` implementa:

- **Cache-First** para assets locais (HTML, JS, CSS, imagens)
- **Network-Only** para APIs externas (Anthropic, GitHub)
- **Stale-While-Revalidate** — serve do cache enquanto atualiza em background
- **Fallback offline** — se sem internet, serve o `index.html` do cache

Para forçar atualização do SW (quando fizer deploy):
1. Incremente a versão em `sw.js`: `const CACHE_NAME = 'hidrosmart-v2.2'`
2. O SW antigo será descartado automaticamente na próxima visita

---

## 🔒 Segurança

Os arquivos de configuração já incluem:

| Header | Proteção |
|--------|----------|
| `X-Content-Type-Options: nosniff` | Bloqueia MIME sniffing |
| `X-Frame-Options: SAMEORIGIN` | Bloqueia clickjacking |
| `X-XSS-Protection: 1; mode=block` | Proteção XSS legado |
| `Referrer-Policy` | Controla dados do referrer |
| `Permissions-Policy` | Bloqueia câmera/microfone/GPS |

Para HTTPS (recomendado), descomente o bloco HSTS no `.htaccess` ou `nginx.conf`.

---

## 📊 Dados & Privacidade

Os dados do app ficam **100% no navegador** (`localStorage`).  
Nada é enviado para servidores externos, exceto:
- Integração voluntária com GitHub (backup/sync) — configurada pelo usuário
- Integração opcional com IA (Anthropic) — requer chave API do usuário

Para backup manual: **Configurações → Exportar dados**.

---

## 🛠️ Desenvolvimento

Para modificar o app, edite diretamente o `index.html` — é um único arquivo auto-contido com HTML, CSS e JavaScript embutidos.

Após modificar:
1. Atualize a versão do cache em `sw.js`: `hidrosmart-v2.X`
2. Faça novo deploy

---

## 📄 Licença

Uso interno — todos os direitos reservados.
