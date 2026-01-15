# Gestão de Marketing (Rede de Farmácias Mariano)

## Visão Geral do Projeto

Solução Full-Stack para centralizar e automatizar a distribuição de materiais de marketing para toda a rede de filiais, eliminando a dependência de métodos de comunicação caóticos e inseguros (como grupos de WhatsApp).

O sistema se adapta **automaticamente** à estrutura de pastas do Google Drive, permitindo que o departamento de Marketing organize os materiais livremente sem necessidade de alterações no código.

---

## Stack Tecnológico

| Categoria | Tecnologia | Por que foi escolhida |
| :--- | :--- | :--- |
| **Frontend** | TypeScript, React, Tailwind CSS | Garante **escalabilidade**, tipagem forte e um layout moderno e responsivo. |
| **Backend** | TypeScript, Node.js (Express) | Potência e velocidade na manipulação de APIs e uso de *streams* de dados. |
| **Banco de Dados** | Turso (SQLite Edge) | Alta performance e baixa latência. Armazena snapshots da estrutura do Drive. |
| **Storage** | Google Drive API | Repositório central dos materiais. Service Account para autenticação. |
| **Infraestrutura** | Koyeb (Backend) + Vercel (Frontend) | Deploy automático via GitHub, garantindo disponibilidade 24/7. |

---

## O Problema de Negócio

Anteriormente, todo o material de marketing era distribuído através de **grupos de WhatsApp**, resultando em:

* **Desorganização:** Dificuldade de encontrar arquivos no meio de mensagens.
* **Acesso Incorreto:** Filiais baixando materiais que não se aplicavam à sua região.
* **Ineficiência:** Tempo desperdiçado na busca e distribuição manual.

---

## Funcionalidades Atuais

### Sistema de Autenticação
- Login diferenciado para **Admin** e **Filiais**
- Controle de acesso baseado em tipo de usuário

### Gestão Dinâmica de Categorias
- Sistema lê automaticamente a estrutura de pastas do Google Drive
- Marketing pode criar/remover categorias sem alterar código
- Suporte a **subpastas recursivas** (pastas dentro de pastas)

### Sincronização Inteligente
- **Automática:** A cada 10 minutos e ao iniciar o servidor
- **Manual:** Botão exclusivo para administradores com logs em tempo real
- Armazena snapshot completo no Turso para performance

### Proxy de Imagens e Downloads
- Thumbnails otimizadas via proxy do backend
- Downloads diretos através de stream (sem armazenar no servidor)
- Autenticação transparente com Google Drive Service Account

### Interface Responsiva
- Design mobile-first
- Layout adaptativo (2 colunas mobile, 3 no desktop)
- Feedback visual em todas as ações

---

## Arquitetura do Sistema

### Fluxo de Dados

```
Google Drive (Source of Truth)
        ↓
   [Sincronização]
        ↓
  Turso DB (Cache)
        ↓
   Backend API
        ↓
  Frontend (React)
```

### Como Funciona

1. **Marketing organiza materiais** no Google Drive dentro da pasta raiz "Marketing"
2. **Backend sincroniza** automaticamente (ou via botão admin)
3. **Estrutura completa** é salva no Turso como JSON
4. **Frontend consome** dados do banco (não do Drive diretamente)
5. **Thumbnails e downloads** passam pelo proxy do backend

---

## Estrutura do Projeto

```
repositorio-marketing/
├── repositorio-backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── admin/
│   │   │   │   └── syncController.ts          # Sincronização manual
│   │   │   └── public/
│   │   │       ├── marketingController.ts     # API de categorias
│   │   │       ├── publicAuthController.ts    # Autenticação
│   │   │       ├── thumbProxyController.ts    # Proxy de thumbnails
│   │   │       └── downloadProxyController.ts # Proxy de downloads
│   │   ├── routes/
│   │   │   ├── admin/
│   │   │   │   └── adminUserRoutes.ts
│   │   │   └── public/
│   │   │       └── publicAuthRoutes.ts
│   │   ├── utils/
│   │   │   ├── db.ts                          # Conexão Turso/SQLite
│   │   │   ├── driveUtils.ts                  # Autenticação Google Drive
│   │   │   ├── readMarketingDrive.ts          # Leitura recursiva do Drive
│   │   │   ├── syncMarketingToDB.ts           # Sincronização Drive → DB
│   │   │   └── query.ts                       # Helpers de query
│   │   └── server.ts                          # Servidor principal
│   ├── config/
│   │   └── service-account.json               # Credenciais Google (gitignored)
│   ├── data/
│   │   └── repo.db                            # SQLite local (dev)
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   └── .env.example                           # Template de variáveis
│
├── repositorio-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Button.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx                # Gerenciamento de auth
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Menu.tsx                       # Menu principal
│   │   │   ├── Marketing.tsx                  # Lista de categorias
│   │   │   └── CategoriaDetalhe.tsx           # Arquivos da categoria
│   │   ├── utils/
│   │   │   └── api.tsx                        # Funções de API
│   │   ├── App.tsx                            # Componente raiz
│   │   ├── main.tsx                           # Entry point
│   │   └── index.css                          # Estilos globais
│   ├── public/
│   │   └── img/
│   │       ├── logo.svg
│   │       └── logo.png
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── index.html
│
├── .gitignore
├── .gitattributes
├── vercel.json                                # Config do Vercel
├── package.json                               # Scripts do monorepo
└── README.md
```

---

## Como Executar

### Pré-requisitos
- Node.js 18+
- Conta Google Cloud com Service Account configurada
- Conta Turso (ou SQLite local para dev)

### Backend

```bash
cd repositorio-backend
npm install
npm run dev  # Desenvolvimento
npm run build && npm start  # Produção
```

### Frontend

```bash
cd repositorio-frontend
npm install
npm run dev  # Desenvolvimento
npm run build  # Produção
```

### Sincronização Manual

```bash
cd repositorio-backend
npm run sync:marketing
```

---

## Schema do Banco de Dados

### Tabela: `usuarios`
```sql
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario TEXT UNIQUE NOT NULL,
  nome_exibicao TEXT NOT NULL,
  senha TEXT NOT NULL,
  tipo TEXT CHECK(tipo IN ('admin','filial')) NOT NULL,
  ativo INTEGER DEFAULT 1
);
```

### Tabela: `materiais_marketing`
```sql
CREATE TABLE materiais_marketing (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tree_json TEXT NOT NULL,  -- Estrutura completa em JSON
  data_sync DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Evolução da Arquitetura

| Versão | Desafio | Solução |
| :--- | :--- | :--- |
| **v1-v3** | Autenticação e regras de acesso complexas | Service Account do Google + lógica de permissões |
| **v4** | Performance ruim (varredura completa a cada request) | Cache em SQLite local |
| **v5** | Código desorganizado, falta de tipagem | Refatoração completa para TypeScript + React + Tailwind |
| **v6 (Atual)** | Sistema rígido, dependente de categorias fixas | Sistema dinâmico que lê estrutura do Drive automaticamente |

---

## Licença

Este projeto é de uso interno da Rede de Farmácias Mariano.

---

**Desenvolvido por Luan S. Sachetti**  