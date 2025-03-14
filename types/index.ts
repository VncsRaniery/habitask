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

export type SessionType = "pomodoro" | "shortBreak" | "longBreak"

export interface SessionData {
  id?: string
  type: SessionType
  startTime: Date
  endTime?: Date
  isCompleted: boolean
  duration: number
  extraTime?: number
  pauseCount?: number
  totalPauseTime?: number
}

export interface SessionUpdateData {
  id: string
  isCompleted: boolean
  endTime: Date
  extraTime?: number
  pauseCount?: number
  totalPauseTime?: number
}

export interface AnalyticsData {
  completedSessions: number
  incompleteSessions: number
  sessionsPerTimeframe: number
  completionRate: number
  breaksTaken: number
  totalFocusTime: number
  totalBreakTime: number
  totalIncompleteFocusTime: number
  completedVsIncompleteRatio: number
  timeCompletedVsIncompleteRatio: number
  avgExtraTime: number
  totalPauseCount: number
  avgPausesPerSession: number
  totalPauseTime: number
  shortBreakCount: number
  longBreakCount: number
}