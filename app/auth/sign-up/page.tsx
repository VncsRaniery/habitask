import { RegisterForm } from "@/components/auth/RegisterForm"
import { GalleryVerticalEnd } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span className="text-lg tracking-tight">HabiTask App.</span>
        </a>
        <RegisterForm />
      </div>
    </div>
  )
}

