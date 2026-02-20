# Ejecutar en desarrollo

1. Clonar el repositorio

2. Ejecutar e instalar modulos de node

```
npm install
```

3. Ejecutar la aplicacion en dev

```
npm run dev
```

4. Configurar Prettier como formateador por defecto
   Abre VS Code.

-   Presiona Ctrl + Shift + P (o Cmd + Shift + P en Mac).

-   Escribe Preferences: Open Settings (JSON) y selecciónalo.

-   Pega la siguiente configuración en el archivo settings.json:

```
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "notebook.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "diffEditor.ignoreTrimWhitespace": false,
  "prettier.arrowParens": "avoid",
  "prettier.trailingComma": "all",
  "editor.wordWrap": "on"
}
```

5. Instalar extensiones (obligatorio)

-   Instala las siguientes extensiones en VS Code:

## ESLint (Microsoft)

## Prettier - Code formatter (Esben Petersen)
# operations-frontend
