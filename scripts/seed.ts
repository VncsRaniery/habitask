import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  const userId = "UserID do usuário";

  await prisma.task.deleteMany({
    where: {
      userId: userId,
    },
  });

  console.log(
    "Banco de dados limpo para o usuário! Inserindo novas tarefas..."
  );

  await prisma.task.createMany({
    data: [
      {
        title: "Planejamento de Sprint",
        description:
          "Organizar e definir tarefas para o próximo sprint de desenvolvimento.",
        category: "Gestão",
        startDate: new Date("2025-03-01T09:00:00Z"),
        dueDate: new Date("2025-03-02T17:00:00Z"),
        status: "Pendente",
        priority: "Alta",
        importance: "Média",
        assignedTo: "Usuário",
        estimatedHours: 12,
        userId,
      },
      {
        title: "Desenvolvimento da API",
        description:
          "Desenvolver a API RESTful com autenticação e endpoints para usuários.",
        category: "Desenvolvimento",
        startDate: new Date("2025-03-02T10:00:00Z"),
        dueDate: new Date("2025-03-05T18:00:00Z"),
        status: "Em Progresso",
        priority: "Baixa",
        importance: "Alta",
        assignedTo: "Usuário",
        estimatedHours: 30,
        userId,
      },
      {
        title: "Design de Interface",
        description:
          "Criar o design de interfaces do usuário para o módulo de login.",
        category: "Design",
        startDate: new Date("2025-03-01T08:00:00Z"),
        dueDate: new Date("2025-03-04T17:00:00Z"),
        status: "Feita",
        priority: "Média",
        importance: "Média",
        assignedTo: "Usuário",
        estimatedHours: 10,
        userId,
      },
      {
        title: "Teste de Funcionalidade",
        description: "Testar funcionalidades do sistema e reportar erros.",
        category: "Testes",
        startDate: new Date("2025-03-03T09:00:00Z"),
        dueDate: new Date("2025-03-06T17:00:00Z"),
        status: "Pendente",
        priority: "Baixa",
        importance: "Baixa",
        assignedTo: "Usuário",
        estimatedHours: 15,
        userId,
      },
      {
        title: "Documentação da API",
        description:
          "Documentar todos os endpoints da API, incluindo exemplos e formatos.",
        category: "Documentação",
        startDate: new Date("2025-03-02T09:00:00Z"),
        dueDate: new Date("2025-03-07T17:00:00Z"),
        status: "Em Progresso",
        priority: "Média",
        importance: "Baixa",
        assignedTo: "Usuário",
        estimatedHours: 20,
        userId,
      },
      {
        title: "Refatoração do código",
        description:
          "Melhorar a legibilidade e performance do código existente.",
        category: "Desenvolvimento",
        startDate: new Date("2025-03-04T09:00:00Z"),
        dueDate: new Date("2025-03-08T18:00:00Z"),
        status: "Em Progresso",
        priority: "Alta",
        importance: "Baixa",
        assignedTo: "Usuário",
        estimatedHours: 25,
        userId,
      },
      {
        title: "Reunião de feedback",
        description:
          "Reunir a equipe para avaliar o progresso e discutir melhorias.",
        category: "Gestão",
        startDate: new Date("2025-03-05T10:00:00Z"),
        dueDate: new Date("2025-03-05T11:30:00Z"),
        status: "Feita",
        priority: "Média",
        importance: "Média",
        assignedTo: "Usuário",
        estimatedHours: 2,
        userId,
      },
      {
        title: "Análise de Segurança",
        description:
          "Revisar vulnerabilidades no sistema e corrigir falhas de segurança.",
        category: "Segurança",
        startDate: new Date("2025-03-06T09:00:00Z"),
        dueDate: new Date("2025-03-08T17:00:00Z"),
        status: "Em Progresso",
        priority: "Alta",
        importance: "Alta",
        assignedTo: "Usuário",
        estimatedHours: 18,
        userId,
      },
      {
        title: "Testes de Performance",
        description:
          "Realizar testes de carga e stress para avaliar a performance do sistema sob pressão.",
        category: "Testes",
        startDate: new Date("2025-03-07T10:00:00Z"),
        dueDate: new Date("2025-03-09T18:00:00Z"),
        status: "Em Progresso",
        priority: "Baixa",
        importance: "Alta",
        assignedTo: "Usuário",
        estimatedHours: 20,
        userId,
      },
      {
        title: "Criar Estrutura de Banco de Dados",
        description:
          "Definir as tabelas e relacionamentos do banco de dados para o novo módulo de pedidos.",
        category: "Desenvolvimento",
        startDate: new Date("2025-03-06T10:00:00Z"),
        dueDate: new Date("2025-03-09T17:00:00Z"),
        status: "Em Progresso",
        priority: "Baixa",
        importance: "Média",
        assignedTo: "Usuário",
        estimatedHours: 25,
        userId,
      },
      {
        title: "Estudo de Usabilidade",
        description:
          "Conduzir testes de usabilidade para melhorar a experiência do usuário no site.",
        category: "Design",
        startDate: new Date("2025-03-04T09:00:00Z"),
        dueDate: new Date("2025-03-07T17:00:00Z"),
        status: "Pendente",
        priority: "Média",
        importance: "Alta",
        assignedTo: "Usuário",
        estimatedHours: 15,
        userId,
      },
      {
        title: "Criação de Mockups",
        description:
          "Desenvolver mockups interativos para a nova página de checkout do e-commerce.",
        category: "Design",
        startDate: new Date("2025-03-07T08:00:00Z"),
        dueDate: new Date("2025-03-10T17:00:00Z"),
        status: "Pendente",
        priority: "Média",
        importance: "Média",
        assignedTo: "Usuário",
        estimatedHours: 10,
        userId,
      },
      {
        title: "Treinamento da Equipe",
        description:
          "Realizar sessão de treinamento sobre boas práticas de desenvolvimento ágil e SCRUM.",
        category: "Gestão",
        startDate: new Date("2025-03-09T14:00:00Z"),
        dueDate: new Date("2025-03-09T16:00:00Z"),
        status: "Pendente",
        priority: "Baixa",
        importance: "Alta",
        assignedTo: "Usuário",
        estimatedHours: 3,
        userId,
      },
    ],
  });

  console.log("Novas tarefas inseridas com sucesso!");
  await createRoutineItems(userId);
}

async function createRoutineItems(userId: string) {
  console.log("Limpeza dos dados antigos de rotina...");

  // Limpeza dos dados de rotina do usuário
  await prisma.routineItem.deleteMany({
    where: {
      userId: userId,
    },
  });

  console.log("Dados antigos de rotina limpos! Inserindo novas rotinas...");

  // Adiciona novos itens de rotina
  await prisma.routineItem.createMany({
    data: [
      /*============================ Domingo =============================*/
      {
        title: "Leitura e estudos",
        dayOfWeek: 0, // Domingo
        time: "07:00",
        completed: false,
        userId,
      },
      {
        title: "Leitura e estudos",
        dayOfWeek: 0, // Domingo
        time: "07:00",
        completed: false,
        userId,
      },
      {
        title: "Leitura e estudos",
        dayOfWeek: 0, // Domingo
        time: "07:00",
        completed: false,
        userId,
      },
      {
        title: "Leitura e estudos",
        dayOfWeek: 0, // Domingo
        time: "07:00",
        completed: false,
        userId,
      },
      /*============================ Segunda-feira =============================*/
      {
        title: "Exercício Matinal",
        dayOfWeek: 1, // Segunda-feira
        time: "07:00",
        completed: false,
        userId,
      },
      {
        title: "Exercício Matinal",
        dayOfWeek: 1, // Segunda-feira
        time: "07:00",
        completed: false,
        userId,
      },
      {
        title: "Exercício Matinal",
        dayOfWeek: 1, // Segunda-feira
        time: "07:00",
        completed: false,
        userId,
      },
      {
        title: "Exercício Matinal",
        dayOfWeek: 1, // Segunda-feira
        time: "07:00",
        completed: false,
        userId,
      },
      /*============================ Terça-feira =============================*/
      {
        title: "Reunião de Planejamento",
        dayOfWeek: 2, // Terça-feira
        time: "10:00",
        completed: false,
        userId,
      },
      {
        title: "Reunião de Planejamento",
        dayOfWeek: 2, // Terça-feira
        time: "11:30",
        completed: false,
        userId,
      },
      {
        title: "Almoço",
        dayOfWeek: 2, // Terça-feira
        time: "12:30",
        completed: false,
        userId,
      },
      {
        title: "Leitura e estudos",
        dayOfWeek: 2, // Terça-feira
        time: "14:30",
        completed: false,
        userId,
      },
      {
        title: "Exercício Matinal",
        dayOfWeek: 2, // Terça-feira
        time: "15:30",
        completed: false,
        userId,
      },
      /*============================ Quarta-feira =============================*/
      {
        title: "Reunião de Equipe",
        dayOfWeek: 3, // Quarta-feira
        time: "14:00",
        completed: false,
        userId,
      },
      {
        title: "Reunião de Equipe",
        dayOfWeek: 3, // Quarta-feira
        time: "14:00",
        completed: false,
        userId,
      },
      {
        title: "Reunião de Equipe",
        dayOfWeek: 3, // Quarta-feira
        time: "14:00",
        completed: false,
        userId,
      },
      {
        title: "Reunião de Equipe",
        dayOfWeek: 3, // Quarta-feira
        time: "14:00",
        completed: false,
        userId,
      },
      /*============================ Quinta-feira =============================*/
      {
        title: "Estudo de Inglês",
        dayOfWeek: 4, // Quinta-feira
        time: "19:00",
        completed: false,
        userId,
      },
      {
        title: "Estudo de Inglês",
        dayOfWeek: 4, // Quinta-feira
        time: "19:00",
        completed: false,
        userId,
      },
      {
        title: "Estudo de Inglês",
        dayOfWeek: 4, // Quinta-feira
        time: "19:00",
        completed: false,
        userId,
      },
      {
        title: "Estudo de Inglês",
        dayOfWeek: 4, // Quinta-feira
        time: "19:00",
        completed: false,
        userId,
      },
      /*============================ Sexta-feira =============================*/
      {
        title: "Exercício Noturno",
        dayOfWeek: 5, // Sexta-feira
        time: "18:00",
        completed: false,
        userId,
      },
      {
        title: "Exercício Noturno",
        dayOfWeek: 5, // Sexta-feira
        time: "18:00",
        completed: false,
        userId,
      },
      {
        title: "Exercício Noturno",
        dayOfWeek: 5, // Sexta-feira
        time: "18:00",
        completed: false,
        userId,
      },
      {
        title: "Exercício Noturno",
        dayOfWeek: 5, // Sexta-feira
        time: "18:00",
        completed: false,
        userId,
      },
      /*============================ Sábado =============================*/
      {
        title: "Estudo de Tecnologias",
        dayOfWeek: 6, // Sábado
        time: "09:00",
        completed: false,
        userId,
      },
      {
        title: "Estudo de Tecnologias",
        dayOfWeek: 6, // Sábado
        time: "09:00",
        completed: false,
        userId,
      },
      {
        title: "Estudo de Tecnologias",
        dayOfWeek: 6, // Sábado
        time: "09:00",
        completed: false,
        userId,
      },
      {
        title: "Estudo de Tecnologias",
        dayOfWeek: 6, // Sábado
        time: "09:00",
        completed: false,
        userId,
      },
    ],
  });

  console.log("Novas rotinas inseridas com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro durante a execução da seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
