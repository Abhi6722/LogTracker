import { Button } from "@/components/ui/button"
import { LogOut, Menu } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <div className="mr-4 flex">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="size-5" />
            </Button>
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold">LogTracker</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2">
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
              <Button variant="ghost" size="sm">
                Logs
              </Button>
              <Button variant="ghost" size="sm">
                Settings
              </Button>
            </nav>
            <Button variant="ghost" size="icon">
              <LogOut className="size-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="py-6 px-4">{children}</main>
    </div>
  )
}