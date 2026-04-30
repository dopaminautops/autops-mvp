# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## GitHub Codespaces setup

This repository is now configured for GitHub Codespaces via `.devcontainer/devcontainer.json`.

### What runs automatically
- Installs frontend dependencies with `npm ci`
- Installs backend dependencies from `pwa-app/backend/requirements.txt`
- Forwards ports:
  - `5173` for Vite frontend
  - `8000` for FastAPI backend

### Start the app in Codespaces
1. Frontend:
   ```bash
   npm run dev -- --host 0.0.0.0 --port 5173
   ```
2. Backend:
   ```bash
   uvicorn main:app --app-dir pwa-app/backend --host 0.0.0.0 --port 8000 --reload
   ```

### Open files in Codespaces
Once the Codespace is running, you can open files in several quick ways:

1. **Explorer panel**
   - Open the left sidebar and click a file (for example `src/App.jsx` or `pwa-app/backend/main.py`).

2. **Quick Open**
   - Press `Ctrl+P` (`Cmd+P` on Mac), type the filename, and press Enter.

3. **Terminal command**
   - From the integrated terminal, run:
     ```bash
     code src/App.jsx
     code pwa-app/backend/main.py
     ```

4. **Search across repo**
   - Press `Ctrl+Shift+F` (`Cmd+Shift+F` on Mac) to find text across all files and open matching results.
