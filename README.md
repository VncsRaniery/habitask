<h1 align="start">
  HabiTask - Organização e produtividade em um só lugar
</h1>

<img width="1280" alt="HabiTask Thumbnail" src="/public/assets/Banner.png">

## Introdução

**HabiTask** é uma plataforma moderna e responsiva que centraliza o gerenciamento do seu dia a dia em um único lugar. Projetado para proporcionar alto desempenho, segurança e uma experiência intuitiva, ele utiliza tecnologias de ponta para otimizar sua produtividade.

Destaques do projeto: 
- **Design moderno e responsivo** desenvolvido com TailwindCSS e Shadcn UI.
- **Gerenciamento completo** das suas tarefas, rotinas e estudos.  
- **Análises detalhadas** do seu desempenho e hábitos diários.
- **Autenticação segura e simplificada** com Auth.js V5.
- **Armazenamento eficiente e escalável** utilizando NeonDB e Prisma ORM.

## Tecnologias utilizadas

- **[Next.js](https://nextjs.org/):** Framework React para SSR, rotas dinâmicas e otimização de desempenho.
- **[TailwindCSS](https://tailwindcss.com/):** CSS utilitário para estilização rápida e responsiva.
- **[Shadcn UI](https://ui.shadcn.dev/):** Conjunto de componentes acessíveis e personalizáveis.
- **[Authjs V5](https://authjs.dev/):** Solução robusta para autenticação e gerenciamento de usuários.
- **[Prisma ORM](https://www.prisma.io/):** Ferramenta moderna para interação eficiente com o banco de dados.
- **[NeonDB](https://console.neon.tech/):** Banco de dados escalável e otimizado para aplicações modernas. .

## Início rápido

### Pré-requisitos

Certifique-se de ter instalado

- Node.js
- Git
- npm / yarn / pnpm / bun

1. Clonar este repositório:

   ```bash
   git clone https://github.com/VncsRaniery/habitask
   cd habitask
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configurar variáveis de ​ambientes:

   ```bash
   # DATABASE ENVIRONMENT VARIABLES 
   DATABASE_URL=""

   # AUTH JS AUTENTIFICAÇÃO
   AUTH_SECRET=""

   # GOOGLE PROVIDER AUTH ENVIRONMENT VARIABLES (TESTE)
   AUTH_GOOGLE_ID=
   AUTH_GOOGLE_SECRET=

   # GITHUB PROVIDER AUTH ENVIRONMENT VARIABLES
   AUTH_GITHUB_ID=
   AUTH_GITHUB_SECRET=

   ```

4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Abra seu navegador e navegue até http://localhost:3000 para ver o site em ação.

---