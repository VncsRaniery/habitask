import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
  await prisma.task.deleteMany({})
  console.log('Banco de dados limpo! Inserindo novas tarefas...')

  const userId = 'UserID do usuário'

  await prisma.task.createMany({
    data: [
      {
        title: 'Task 1',
        description: 'Description for Task 1',
        category: 'Development',
        startDate: new Date('2025-02-20T09:00:00Z'),
        dueDate: new Date('2025-02-22T17:00:00Z'),
        status: 'Todo',
        priority: 'Alta',
        importance: 'Alta',
        assignedTo: 'John Doe',
        estimatedHours: 8,
        userId,
      },
      {
        title: 'Task 2',
        description: 'Description for Task 2',
        category: 'Design',
        startDate: new Date('2025-02-21T09:00:00Z'),
        dueDate: new Date('2025-02-23T17:00:00Z'),
        status: 'Em Progresso',
        priority: 'Média',
        importance: 'Média',
        assignedTo: 'Jane Smith',
        estimatedHours: 10,
        userId,
      },
      {
        title: 'Task 3',
        description: 'Description for Task 3',
        category: 'Marketing',
        startDate: new Date('2025-02-22T09:00:00Z'),
        dueDate: new Date('2025-02-25T17:00:00Z'),
        status: 'Feita',
        priority: 'Baixa',
        importance: 'Baixa',
        assignedTo: 'Emily Davis',
        estimatedHours: 5,
        userId,
      },
      {
        title: "Criar plano do projeto",
        description: "Desenvolver um plano de projeto abrangente, incluindo cronogramas, marcos e alocação de recursos.",
        status: "Pendente",
        priority: "Alta",
        category: "Planejamento",
        importance: "Alta",
        startDate: new Date('2025-02-22T09:00:00Z'),
        dueDate: new Date('2025-02-25T17:00:00Z'),
        assignedTo: "João Silva",
        estimatedHours: 8,
        userId,
      },
      {
        title: "Projetar interface do usuário",
        description: "Criar wireframes e mockups para as principais telas do aplicativo.",
        status: "Em Progresso",
        priority: "Média",
        category: "Design",
        importance: "Média",
        startDate: new Date('2025-02-22T09:00:00Z'),
        dueDate: new Date('2025-02-25T17:00:00Z'),
        assignedTo: "Maria Santos",
        estimatedHours: 16,
        userId,
      },
      {
        title: "Implementar autenticação",
        description: "Configurar sistema de autenticação de usuário, incluindo login, registro e redefinição de senha.",
        status: "Pendente",
        priority: "Alta",
        category: "Desenvolvimento",
        importance: "Alta",
        startDate: new Date('2025-02-22T09:00:00Z'),
        dueDate: new Date('2025-02-25T17:00:00Z'),
        assignedTo: "Pedro Oliveira",
        estimatedHours: 24,
        userId,
      },
      {
        title: "Configurar banco de dados",
        description:
          "Configurar e preparar o banco de dados do projeto, incluindo design de schema e migração inicial de dados.",
        status: "Feita",
        priority: "Média",
        category: "Desenvolvimento",
        importance: "Alta",
        startDate: new Date('2025-02-22T09:00:00Z'),
        dueDate: new Date('2025-02-25T17:00:00Z'),
        assignedTo: "Ana Rodrigues",
        estimatedHours: 12,
        userId,
      },
      {
        title: "Escrever documentação da API",
        description:
          "Criar documentação abrangente para todos os endpoints da API, incluindo formatos de solicitação/resposta e exemplos.",
        status: "Em Progresso",
        priority: "Baixa",
        category: "Documentação",
        importance: "Média",
        startDate: new Date('2025-02-22T09:00:00Z'),
        dueDate: new Date('2025-02-25T17:00:00Z'),
        assignedTo: "Carlos Ferreira",
        estimatedHours: 8,
        userId,
      },
      {
        title: "Testar design responsivo",
        description:
          "Realizar testes completos do design responsivo da aplicação em vários dispositivos e tamanhos de tela.",
        status: "Pendente",
        priority: "Baixa",
        category: "Testes",
        importance: "Média",
        startDate: new Date('2025-02-22T09:00:00Z'),
        dueDate: new Date('2025-02-25T17:00:00Z'),
        assignedTo: "Lúcia Mendes",
        estimatedHours: 4,
        userId,
      },
    ],
  })

  console.log('Novas tarefas inseridas com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro durante a execução da seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
