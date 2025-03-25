import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Activity, BarChart3, FileText, LogOut, Settings, Shield, BookOpen } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useLogoutMutation } from "@/store/api/authApi"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [logout] = useLogoutMutation()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-2 flex items-center px-2">
            <span className="text-lg font-bold">LogTracker</span>
          </div>
          <div className="space-y-1">
            <Link to="/dashboard">
              <Button
                variant={location.pathname === "/dashboard" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <BarChart3 className="mr-2 size-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/monitor">
              <Button
                variant={location.pathname === "/monitor" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <Activity className="mr-2 size-4" />
                Monitor
              </Button>
            </Link>
            <Link to="/logs">
              <Button
                variant={location.pathname === "/logs" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <FileText className="mr-2 size-4" />
                Logs
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight">
            Library
          </h2>
          <div className="space-y-1">
            <Link to="/docs">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <BookOpen className="mr-2 size-4" />
                Documentation
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight">
            Settings
          </h2>
          <div className="space-y-1">
            <Link to="/security">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Shield className="mr-2 size-4" />
                Security
              </Button>
            </Link>
            <Link to="/preferences">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="mr-2 size-4" />
                Preferences
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={async () => {
            try {
              await logout().unwrap()
              navigate("/login")
            } catch (error) {
              console.error("Logout failed:", error)
            }
          }}
        >
          <LogOut className="mr-2 size-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}