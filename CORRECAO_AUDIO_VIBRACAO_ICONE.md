# Correção aplicada

- `playHidroAlert()` agora só toca áudio/vibra depois do primeiro gesto do usuário (`pointerdown`, `touchstart`, `keydown` ou `click`).
- Isso remove os avisos do Chrome: `Blocked call to navigator.vibrate` e `AudioContext was not allowed to start`.
- `icon-144.png` foi mantido/incluído no pacote com nome exato, pois o manifest e o iOS apontam para `/aquacontrol/icon-144.png`.
- `sw.js` versionado para `hidrosmart-v14-gesture-icon-fix`.

Suba todos os arquivos na raiz do repositório `aquacontrol`, sem renomear arquivos.
