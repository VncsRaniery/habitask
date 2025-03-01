"use client";

import * as React from "react";
import {
  ClipboardList,
  Cog,
  Command,
  CircleCheck,
  ChartLine,
  House,
  PieChart,
  Send,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavTasks } from "@/components/sidebar/nav-tasks";
import { NavRoutines } from "@/components/sidebar/nav-routine";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Início",
      url: "/dashboard",
      icon: House,
    },
  ],
  navSecondary: [
    {
      title: "Configurações",
      url: "#",
      icon: Cog,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  tasks: [
    {
      name: "Gerenciar tarefas",
      url: "/dashboard/tarefas",
      icon: ClipboardList,
    },
    {
      name: "Análises e estatísitcas",
      url: "/dashboard/tarefas/analises",
      icon: PieChart,
    },
  ],
  routines: [
    {
      name: "Gerenciar rotina",
      url: "/dashboard/rotinas",
      icon: CircleCheck,
    },
    {
      name: "Análises das rotinas",
      url: "/dashboard/rotinas/analises",
      icon: ChartLine,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">HabiTask App</span>
                  <span className="truncate text-xs">Projeto</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavTasks tasks={data.tasks} />
        <NavRoutines routines={data.routines} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
