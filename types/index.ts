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

export type SessionType = "pomodoro" | "shortBreak" | "longBreak";

export interface SessionData {
  id?: string;
  type: SessionType;
  startTime: Date;
  endTime?: Date;
  isCompleted: boolean;
  duration: number;
  extraTime?: number;
  pauseCount?: number;
  totalPauseTime?: number;
}

export interface SessionUpdateData {
  id: string;
  isCompleted: boolean;
  endTime: Date;
  extraTime?: number;
  pauseCount?: number;
  totalPauseTime?: number;
}

export interface AnalyticsData {
  completedSessions: number;
  incompleteSessions: number;
  sessionsPerTimeframe: number;
  completionRate: number;
  breaksTaken: number;
  totalFocusTime: number;
  totalBreakTime: number;
  totalIncompleteFocusTime: number;
  completedVsIncompleteRatio: number;
  timeCompletedVsIncompleteRatio: number;
  avgExtraTime: number;
  totalPauseCount: number;
  avgPausesPerSession: number;
  totalPauseTime: number;
  shortBreakCount: number;
  longBreakCount: number;
}

export interface Subject {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  professorId?: string | null;
  professor?: Professor | null;
  createdAt: string;
  updatedAt: string;
}

export interface Professor {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudyResource {
  id: string;
  name: string;
  description?: string | null;
  fileUrl: string;
  fileKey: string;
  fileType: string;
  subjectId: string;
  subject: Subject;
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  subjectId: string;
  subject: Subject;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
