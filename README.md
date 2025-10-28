# Gestão de Conteúdo e Promoções (Rede de Farmácias Mariano)

## Visão Geral do Projeto

Solução Full-Stack para centralizar e automatizar a distribuição de materiais de marketing (promoções e etiquetas) para toda a rede de filiais, eliminando a dependência de métodos de comunicação caóticos e inseguros (como grupos de WhatsApp).

Este sistema garante que cada filial acesse **apenas o conteúdo promocional relevante** para sua respectiva área de marketing e concorrência.

---

## Stack Tecnológico Atual

| Categoria | Tecnologia | Por que foi escolhida |
| :--- | :--- | :--- |
| **Frontend** | TypeScript, React, Tailwind CSS | Garante **escalabilidade**, tipagem forte e um layout moderno e responsivo. |
| **Backend** | TypeScript, Node.js (Express) | Potência e velocidade na manipulação de APIs e uso de *streams* de dados. |
| **Banco de Dados** | Turso (SQLite Edge) | Alta performance e baixa latência para consultas rápidas do catálogo de promoções. |
| **Infraestrutura** | Koyeb (Serverless) | Deploy gratuito e gerenciável, garantindo a disponibilidade 24/7. |

---

## O Desafio de Negócio (A Dor do WhatsApp)

Anteriormente, todo o material de marketing (promoções, etiquetas, arquivos para telões) era enviado através de **grupos de WhatsApp**, resultando em:

* **Desorganização:** Dificuldade de encontrar arquivos antigos e recentes no meio de outras mensagens.
* **Acesso Incorreto:** Filiais acessando conteúdo de promoções erradas ou que não se aplicavam à sua região.
* **Ineficiência:** Tempo desperdiçado para o marketing na distribuição e para as filiais na busca/download.

---

## Evolução da Arquitetura (Jornada de 5 Refatorações)

Este repositório representa a **quinta iteração de uma solução full-stack**, que priorizou a robustez em detrimento da velocidade de entrega. As refatorações foram motivadas pela busca de **qualidade e performance em ambiente de produção**.

| Etapa | O Desafio Técnico Encontrado | A Solução Implementada |
| :--- | :--- | :--- |
| **1-3 (Iniciais)** | Autenticação no Google Drive API, lógica de regras de acesso complexas (Feed, Stories, Impressão, Telões). | Uso de **Conta de Serviço Google** para acessar o repositório organizado do Drive e lógica de permissão de pastas no Backend. |
| **4 (Performance)** | Lentidão extrema: O Backend percorria **todas as pastas e arquivos** a cada requisição do Frontend, sobrecarregando o sistema. | Implementação de um **banco de dados SQLite** local para cachear metadados, reduzindo a latência e a carga na API do Google. |
| **5 (Performance e UI/UX)** | Código desorganizado (`10 arquivos CSS`) e falta de tipagem segura. | **Refatoração completa** do *stack* para **TypeScript, React, e Tailwind CSS**, garantindo manutenibilidade e UI/UX responsivo. |

---

## Otimização Crítica (Próximo Passo)

A versão funcional anterior encontrou um **débito técnico crítico** ao tentar exibir miniaturas (`thumbs`):

* **Problema:** O link direto do Google Drive para as miniaturas era bloqueado por falta de autenticação no lado do cliente (navegador), forçando o uso de **Base64** para exibir a imagem.
* **Gargalo:** O armazenamento de **`thumb_base64`** no banco de dados (Turso) estava inchando o DB e prejudicando a performance na nuvem.

### A Solução de Engenharia (Em Implementação)

Em vez de armazenar o Base64, o sistema será refatorado para:

1.  **DB Leve:** O Turso armazenará apenas o **`fileId`** do Google Drive.
2.  **Proxy de Imagens:** O Backend (Node.js) atuará como um **Proxy de *Stream***: ele usará o Token de Serviço para buscar a miniatura otimizada (`s150`) no Google e transmitirá o *stream* diretamente para o navegador, resolvendo a autenticação e mantendo o frontend rápido.

---

**Em desenvolvimento por Luan S. Sachetti**

----
