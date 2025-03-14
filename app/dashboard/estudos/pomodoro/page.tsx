import PomodoroPage from "@/components/estudos/PomodoroPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pomodoro - Dashboard",
  description: "Generated by create next app",
};

export default function TasksPage() {
  return <PomodoroPage />;
}
