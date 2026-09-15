/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SCHEDULE_API_BASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}