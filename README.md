# 📖 DeepBible – API de Exploração e Estudo Bíblico com IA

DeepBible é uma API REST que oferece recursos inteligentes para estudo das Escrituras, combinando IA (OpenAI), PostgreSQL com `pgvector`, e uma estrutura robusta com NestJS + Prisma. É capaz de responder perguntas com base em versículos, sugerir passagens correlatas e listar tópicos populares de estudo.

---

## 🚀 Tecnologias Utilizadas
- **Node.js** + **TypeScript**
- **NestJS** (estrutura modular e escalável)
- **Prisma** (ORM com PostgreSQL)
- **PostgreSQL** com extensão **pgvector** (busca semântica)
- **OpenAI** (embeddings e respostas com IA)
- **Swagger** (documentação interativa da API)

---

## 📚 Funcionalidades Principais

### ✅ Leitura da Bíblia NVI
- `GET /bible/books` – Lista os livros da Bíblia
- `GET /bible/:book/:chapter/:verse?` – Retorna versículo ou capítulo completo

### ✅ Busca Semântica
- `GET /search?query=...` – Busca versículos com base em similaridade semântica usando embeddings vetoriais

### ✅ Tópicos Temáticos
- `GET /topics/popular` – Lista os tópicos mais buscados com descrições
- `GET /topics?limit=xx&offset=yy` – Lista paginada de todos os tópicos

### ✅ IA Bíblica
- `POST /ai/ask-to-bible` – Envia uma pergunta e um versículo base, retorna resposta baseada na Palavra, com sugestões de estudo

---

## 🧠 Como a IA está sendo usada
- **Embeddings** são gerados com OpenAI e armazenados no banco via `pgvector`
- A busca semântica utiliza o operador `<#>` para similaridade
- A IA é usada também para:
  - gerar tópicos para cada capítulo
  - escrever descrições para os tópicos mais relevantes
  - responder perguntas dos usuários com base na Bíblia

---

## 🛠️ Como rodar localmente
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/deepbible.git
cd deepbible

# Instale as dependências
npm install

# Crie o arquivo .env
touch .env
# (adicione as variáveis: DATABASE_URL, OPENAI_API_KEY)

# Rode as migrações e popule a Bíblia
npx prisma migrate dev
npx ts-node prisma/seed/import-bible.ts

# Rode o servidor
npm run start:dev

# Acesse o Swagger
http://localhost:3000/api
```

---

## 🧪 Testes (opcional)
*Em desenvolvimento...*

---

## 📝 Observações
- Todos os versículos estão em versão NVI
- IA utilizada com moderação e foco em fidelidade ao texto bíblico

---

## 🤝 Licença
Projeto desenvolvido como parte do desafio técnico da **Zion Church**. Para uso educacional e experimental.

