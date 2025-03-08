"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckIcon, MinusIcon } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useId, useState } from "react"

const items = [
  { value: "light", label: "Claro", image: "/ui-light.png" },
  { value: "dark", label: "Escuro", image: "/ui-dark.png" },
  { value: "system", label: "Sistema", image: "/ui-system.png" },
]

export default function ThemeCard() {
  const id = useId()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <fieldset className="space-y-4">
      <legend className="text-foreground text-sm leading-none font-medium">Escolha um tema</legend>
      <RadioGroup className="flex gap-3" value={theme || "system"} onValueChange={(value) => setTheme(value)}>
        {items.map((item) => (
          <label key={`${id}-${item.value}`}>
            <RadioGroupItem
              id={`${id}-${item.value}`}
              value={item.value}
              className="peer sr-only after:absolute after:inset-0"
            />
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.label}
              width={88}
              height={70}
              className="border-input peer-focus-visible:ring-ring/50 peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent relative cursor-pointer overflow-hidden rounded-md border shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px] peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50"
            />
            <span className="group peer-data-[state=unchecked]:text-muted-foreground/70 mt-2 flex items-center gap-1">
              <CheckIcon size={16} className="hidden group-peer-data-[state=checked]:block" aria-hidden="true" />
              <MinusIcon size={16} className="block group-peer-data-[state=checked]:hidden" aria-hidden="true" />
              <span className="text-xs font-medium">{item.label}</span>
            </span>
          </label>
        ))}
      </RadioGroup>
    </fieldset>
  )
}

