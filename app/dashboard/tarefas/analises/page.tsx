import TaskAnalytics from "@/components/analytics/TaskAnalytics"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarefas - Dashboard",
  description: "Generated by create next app",
};

export default function AnalyticsPage() {
  return <TaskAnalytics />
}

