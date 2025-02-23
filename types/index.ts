export type Task = {
    id: string
    title: string
    description: string
    status: "Pendente" | "Em Progresso" | "Feita"
    priority: "Baixa" | "Média" | "Alta"
    category: string
    importance: "Baixa" | "Média" | "Alta"
    createdAt: string
    startDate: string
    dueDate: string
    assignedTo: string
    estimatedHours: number
  }