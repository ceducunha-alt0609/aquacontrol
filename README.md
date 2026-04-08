# 💧 HidroSmart

**Gestão inteligente de infraestrutura hídrica para condomínios**

> PWA mobile-first · Single-file · Offline-ready · GitHub Pages

---

## 📱 Acesso

**GitHub Pages:** `https://<usuario>.github.io/<repositorio>/`

Para instalar como app no celular: abra no Chrome → menu (⋮) → *Adicionar à tela inicial*.

---

## ✨ Funcionalidades

- 📊 Monitoramento de consumo de água por unidade
- 📈 Histórico comparativo mensal com gráficos
- 🚨 Alertas de consumo por cores
- 🔄 Sincronização automática com backup em nuvem
- 📥 Importação de dados via Excel (múltiplos arquivos)
- 🎨 Tema claro/escuro
- 📴 Funcionamento offline (Service Worker)

---

## 🗂️ Estrutura

```
├── index.html       ← App completo (HTML + CSS + JS inline)
├── manifest.json    ← Configuração PWA
├── sw.js            ← Service Worker (cache offline)
├── .nojekyll        ← Desativa processamento Jekyll no GitHub Pages
├── vercel.json      ← Headers e rewrites para deploy no Vercel
├── icons/           ← Ícones PWA (72 → 512px)
└── screenshots/     ← Screenshots para manifest (opcional)
```

---

## 🚀 Deploy

### GitHub Pages

1. Faça push do repositório para o GitHub
2. Vá em **Settings → Pages**
3. Em *Source*, selecione **Deploy from a branch**
4. Selecione a branch `main` e pasta `/ (root)`
5. Salve — o app estará disponível em instantes

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Importe o repositório no [Vercel](https://vercel.com)
2. Framework: **Other**
3. Build command: *(deixar vazio)*
4. Output directory: `.`
5. Clique em **Deploy**

---

## ⚙️ Registro do Service Worker

O `index.html` deve registrar o SW. Verifique se contém este trecho (ou adicione antes de `</body>`):

```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(r => console.log('SW registrado:', r.scope))
        .catch(e => console.error('SW falhou:', e));
    });
  }
</script>
```

---

## 📋 Versão

| Versão | Data | Notas |
|--------|------|-------|
| 2.0 | 2026-03-24 | Release atual |

---

*Desenvolvido para gestão condominial · PWA otimizado para Android*
