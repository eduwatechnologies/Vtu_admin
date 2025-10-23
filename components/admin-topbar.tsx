"use client"

import { Search, Bell, ShoppingCart, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AdminTopbarProps {
  onMenuClick?: () => void
}

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden h-10 w-10 hover:bg-accent"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-xl hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Type to search"
            className="w-full pl-9 bg-background border-border focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-accent">
          <ShoppingCart className="h-5 w-5 text-foreground" />
          <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            2
          </span>
        </Button>

        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-accent">
          <Bell className="h-5 w-5 text-foreground" />
        </Button>

        <Avatar className="h-8 w-8 md:h-10 md:w-10 cursor-pointer border-2 border-border">
          <AvatarImage src="/professional-admin-avatar.png" alt="Admin" />
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs md:text-sm">
            DU
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
