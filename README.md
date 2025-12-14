# Deploy su Vercel passando da GitHub (da telefono)

## 1) Carica su GitHub
1. Apri GitHub (app o browser) → **New repository**
2. Nome: `protocollo-del-diavolo-bet` (o come vuoi) → **Create**
3. Nel repo, premi **Add file → Upload files**
4. Carica **tutti i file** di questa cartella (non lo zip dentro lo zip)
5. **Commit changes**

## 2) Deploy su Vercel
1. Apri Vercel → **Add New → Project**
2. Seleziona il repo GitHub appena creato
3. Framework: **Other** (Static)
4. Build command: **None**
5. Output directory: **.** (root)
6. Deploy

## Note rapide
- Tema scuro, menu hamburger, home con SOLO Protocollo (min 3 giocate)
- Guabirá esclusa ovunque
- Per cambiare link Telegram: `assets/app.js` (variabile `telegramLink`)
