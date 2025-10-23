/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  // se quiser, adicione outras variáveis .env aqui
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
