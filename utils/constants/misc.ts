import { ChartArea, MonitorCog, Fingerprint } from "lucide-react";

export const PROCESS = [
    {
        title: "Autentificação",
        description: "Crie uma conta e acesse a plataforma com segurança e praticidade.",
        icon: Fingerprint,
    },
    {
        title: "Gerenciamento",
        description: "Gerencie suas atividades, tarefas, rotinas e estudos com facilidade e eficiência.",
        icon: MonitorCog,
    },
    {
        title: "Analise seu desempenho",
        description: "Obtenha insights detalhados sobre suas atividades e tome decisões estratégicas com base em dados precisos.",
        icon: ChartArea,
    },
] as const;