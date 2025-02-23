"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Task } from "@/types"

type Notification = {
  id: string
  message: string
  type: "warning" | "danger"
  taskId: string
  read: boolean
}

type NotificationSheetProps = {
  tasks: Task[]
}

export function NotificationSheet({ tasks }: NotificationSheetProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const newNotifications: Notification[] = []
    const now = new Date()

    tasks.forEach((task) => {
      const dueDate = new Date(task.dueDate)
      const timeDiff = dueDate.getTime() - now.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

      if (daysDiff < 0 && task.status !== "Feita") {
        newNotifications.push({
          id: `${task.id}-overdue`,
          message: `Task "${task.title}" is overdue by ${Math.abs(daysDiff)} days`,
          type: "danger",
          taskId: task.id,
          read: false,
        })
      } else if (daysDiff <= 3 && daysDiff >= 0 && task.status !== "Feita") {
        newNotifications.push({
          id: `${task.id}-upcoming`,
          message: `Task "${task.title}" is due in ${daysDiff} days`,
          type: "warning",
          taskId: task.id,
          read: false,
        })
      }
    })

    setNotifications(newNotifications)
  }, [tasks])

  const getEmojiForType = (type: "warning" | "danger") => {
    return type === "warning" ? "⚠️" : "🚨"
  }

  const getColorForType = (type: "warning" | "danger") => {
    return type === "warning" ? "bg-yellow-500" : "bg-red-500"
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 px-2 py-1 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Notifications</SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bell className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-600">Sem notificações</p>
              <p className="text-sm text-gray-500">Vocês estão todos atualizados!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Card key={notification.id} className={`mb-4 ${notification.read ? "opacity-60" : ""}`}>
                <CardContent className="p-4 flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${getColorForType(notification.type)}`}
                  >
                    <span
                      role="img"
                      aria-label={notification.type === "warning" ? "Warning" : "Danger"}
                      className="text-white text-lg"
                    >
                      {getEmojiForType(notification.type)}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </ScrollArea>
        <SheetFooter className="mt-4">
          <Button onClick={markAllAsRead} className="w-full" disabled={unreadCount === 0}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}