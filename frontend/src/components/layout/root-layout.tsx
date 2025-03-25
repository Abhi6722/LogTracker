import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="relative flex min-h-screen">
      <div className="hidden border-r bg-gray-100/40 lg:block lg:w-72">
        <Sidebar />
      </div>
      <div className="flex-1">
        <Header />
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}