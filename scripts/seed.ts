import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  const userId = "UserID do usuário";

  // Clean up existing data
  await prisma.task.deleteMany({
    where: {
      userId: userId,
    },
  });

  await prisma.routineItem.deleteMany({
    where: {
      userId: userId,
    },
  });

  await prisma.sessionPomodoro.deleteMany({
    where: {
      userId: userId,
    },
  });

  await prisma.studySession.deleteMany({
    where: {
      userId: userId,
    },
  });

  await prisma.studyResource.deleteMany({
    where: {
      userId: userId,
    },
  });

  await prisma.subject.deleteMany({
    where: {
      userId: userId,
    },
  });

  await prisma.professor.deleteMany({
    where: {
      userId: userId,
    },
  });

  console.log("Banco de dados limpo! Inserindo novos dados...");

  // Create tasks
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

  // Create routine items
  await prisma.routineItem.createMany({
    data: [
      /*============================ Domingo =============================*/
      {
        title: "Leitura e estudos",
        dayOfWeek: 0, // Domingo
        time: "07:00",
        completed: true,
        userId,
      },
      {
        title: "Exercícios físicos",
        dayOfWeek: 0,
        time: "08:30",
        completed: true,
        userId,
      },
      {
        title: "Planejamento da semana",
        dayOfWeek: 0,
        time: "10:00",
        completed: true,
        userId,
      },
      {
        title: "Tempo com família",
        dayOfWeek: 0,
        time: "14:00",
        completed: false,
        userId,
      },
      /*============================ Segunda-feira =============================*/
      {
        title: "Exercício Matinal",
        dayOfWeek: 1,
        time: "06:30",
        completed: true,
        userId,
      },
      {
        title: "Revisão de tarefas",
        dayOfWeek: 1,
        time: "08:00",
        completed: true,
        userId,
      },
      {
        title: "Estudo de programação",
        dayOfWeek: 1,
        time: "14:00",
        completed: false,
        userId,
      },
      {
        title: "Leitura noturna",
        dayOfWeek: 1,
        time: "21:00",
        completed: false,
        userId,
      },
      /*============================ Terça-feira =============================*/
      {
        title: "Meditação",
        dayOfWeek: 2,
        time: "06:00",
        completed: true,
        userId,
      },
      {
        title: "Reunião de Planejamento",
        dayOfWeek: 2,
        time: "10:00",
        completed: true,
        userId,
      },
      {
        title: "Almoço",
        dayOfWeek: 2,
        time: "12:30",
        completed: true,
        userId,
      },
      {
        title: "Estudo de inglês",
        dayOfWeek: 2,
        time: "19:00",
        completed: false,
        userId,
      },
      /*============================ Quarta-feira =============================*/
      {
        title: "Exercícios físicos",
        dayOfWeek: 3,
        time: "06:30",
        completed: true,
        userId,
      },
      {
        title: "Reunião de Equipe",
        dayOfWeek: 3,
        time: "14:00",
        completed: false,
        userId,
      },
      {
        title: "Estudo de matemática",
        dayOfWeek: 3,
        time: "16:00",
        completed: false,
        userId,
      },
      {
        title: "Tempo livre",
        dayOfWeek: 3,
        time: "20:00",
        completed: false,
        userId,
      },
      /*============================ Quinta-feira =============================*/
      {
        title: "Leitura matinal",
        dayOfWeek: 4,
        time: "06:00",
        completed: true,
        userId,
      },
      {
        title: "Estudo de Inglês",
        dayOfWeek: 4,
        time: "19:00",
        completed: false,
        userId,
      },
      {
        title: "Exercícios físicos",
        dayOfWeek: 4,
        time: "20:30",
        completed: false,
        userId,
      },
      {
        title: "Planejamento do dia seguinte",
        dayOfWeek: 4,
        time: "21:30",
        completed: false,
        userId,
      },
      /*============================ Sexta-feira =============================*/
      {
        title: "Exercício Matinal",
        dayOfWeek: 5,
        time: "06:30",
        completed: false,
        userId,
      },
      {
        title: "Revisão semanal",
        dayOfWeek: 5,
        time: "10:00",
        completed: false,
        userId,
      },
      {
        title: "Exercício Noturno",
        dayOfWeek: 5,
        time: "18:00",
        completed: false,
        userId,
      },
      {
        title: "Tempo com amigos",
        dayOfWeek: 5,
        time: "20:00",
        completed: false,
        userId,
      },
      /*============================ Sábado =============================*/
      {
        title: "Descanso",
        dayOfWeek: 6,
        time: "07:00",
        completed: false,
        userId,
      },
      {
        title: "Estudo de Tecnologias",
        dayOfWeek: 6,
        time: "09:00",
        completed: false,
        userId,
      },
      {
        title: "Atividades ao ar livre",
        dayOfWeek: 6,
        time: "14:00",
        completed: false,
        userId,
      },
      {
        title: "Reflexão semanal",
        dayOfWeek: 6,
        time: "20:00",
        completed: false,
        userId,
      },
    ],
  });

  // Create professors
  const professor1 = await prisma.professor.create({
    data: {
      name: "Dr. Silva",
      email: "silva@universidade.edu",
      phone: "(11) 99999-9999",
      userId,
    },
  });

  const professor2 = await prisma.professor.create({
    data: {
      name: "Prof. Santos",
      email: "santos@universidade.edu",
      phone: "(11) 88888-8888",
      userId,
    },
  });

  // Create subjects
  const subject1 = await prisma.subject.create({
    data: {
      name: "Programação Web",
      description: "Desenvolvimento de aplicações web modernas",
      color: "#4f46e5",
      professorId: professor1.id,
      userId,
    },
  });

  const subject2 = await prisma.subject.create({
    data: {
      name: "Banco de Dados",
      description: "Fundamentos e práticas de banco de dados",
      color: "#10b981",
      professorId: professor2.id,
      userId,
    },
  });

  // Create study resources
  await prisma.studyResource.createMany({
    data: [
      {
        name: "Apresentação React",
        description: "Slides sobre fundamentos do React",
        fileType: "pdf",
        subjectId: subject1.id,
        fileContent: Buffer.from("Sample PDF content"),
        userId,
      },
      {
        name: "Exercícios SQL",
        description: "Lista de exercícios práticos de SQL",
        fileType: "pdf",
        subjectId: subject2.id,
        fileContent: Buffer.from("Sample PDF content"),
        userId,
      },
    ],
  });

  // Create study sessions
  await prisma.studySession.createMany({
    data: [
      {
        title: "Introdução ao React",
        description: "Estudo dos fundamentos do React",
        startTime: new Date("2025-03-01T09:00:00Z"),
        endTime: new Date("2025-03-01T11:00:00Z"),
        subjectId: subject1.id,
        completed: false,
        userId,
      },
      {
        title: "Normalização de Dados",
        description: "Estudo sobre normalização de banco de dados",
        startTime: new Date("2025-03-02T14:00:00Z"),
        endTime: new Date("2025-03-02T16:00:00Z"),
        subjectId: subject2.id,
        completed: false,
        userId,
      },
    ],
  });

  // Create pomodoro sessions
  await prisma.sessionPomodoro.createMany({
    data: [
      {
        type: "pomodoro",
        startTime: new Date("2025-03-01T09:00:00Z"),
        endTime: new Date("2025-03-01T09:25:00Z"),
        isCompleted: true,
        duration: 25,
        extraTime: 0,
        pauseCount: 0,
        totalPauseTime: 0,
        userId,
      },
      {
        type: "shortBreak",
        startTime: new Date("2025-03-01T09:25:00Z"),
        endTime: new Date("2025-03-01T09:30:00Z"),
        isCompleted: true,
        duration: 5,
        extraTime: 0,
        pauseCount: 0,
        totalPauseTime: 0,
        userId,
      },
      {
        type: "pomodoro",
        startTime: new Date("2025-03-01T09:30:00Z"),
        endTime: new Date("2025-03-01T09:55:00Z"),
        isCompleted: true,
        duration: 25,
        extraTime: 0,
        pauseCount: 1,
        totalPauseTime: 2,
        userId,
      },
      {
        type: "longBreak",
        startTime: new Date("2025-03-01T09:55:00Z"),
        endTime: new Date("2025-03-01T10:10:00Z"),
        isCompleted: true,
        duration: 15,
        extraTime: 0,
        pauseCount: 0,
        totalPauseTime: 0,
        userId,
      },
    ],
  });

  console.log("Dados inseridos com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro durante a execução da seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
