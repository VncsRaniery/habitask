export type Task = {
  id: string;
  title: string;
  description: string;
  status: "Pendente" | "Em Progresso" | "Feita";
  priority: "Baixa" | "Média" | "Alta";
  category: string;
  importance: "Baixa" | "Média" | "Alta";
  createdAt: string;
  startDate: string;
  dueDate: string;
  assignedTo: string;
  estimatedHours: number;
};

export interface RoutineHistory {
  id: string;
  routineId: string;
  completed: boolean;
  date: string;
  dayOfWeek: number;
  createdAt: string;
  routine: {
    id: string;
    title: string;
    dayOfWeek: number;
    time: string;
  };
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  averageCompletionRate: number;
}

export interface DayStats {
  dayOfWeek: number;
  completions: number;
  total: number;
  rate: number;
}

export interface TimeDistribution {
  hour: number;
  completions: number;
  total: number;
  rate: number;
}
