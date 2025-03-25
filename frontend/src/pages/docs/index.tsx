import { RootLayout } from "@/components/layout/root-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

const documentationSections = [
  {
    title: "Getting Started",
    description: "Learn how to get started with LogTracker",
    links: [
      { title: "Introduction", href: "/docs/introduction" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Quick Start", href: "/docs/quick-start" },
    ],
  },
  {
    title: "Features",
    description: "Explore LogTracker's core features",
    links: [
      { title: "Log Monitoring", href: "/docs/features/monitoring" },
      { title: "Log Analysis", href: "/docs/features/analysis" },
      { title: "Visualization", href: "/docs/features/visualization" },
    ],
  },
  {
    title: "Components",
    description: "UI components and building blocks",
    links: [
      { title: "Dashboard", href: "/docs/components/dashboard" },
      { title: "Log Viewer", href: "/docs/components/log-viewer" },
      { title: "Charts", href: "/docs/components/charts" },
    ],
  },
]

export default function DocsPage() {
  return (
    <RootLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about LogTracker
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documentationSections.map((section) => (
            <Card key={section.title} className="flex flex-col">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className={cn(
                          "flex items-center text-muted-foreground hover:text-foreground",
                          "rounded-md p-2 hover:bg-accent"
                        )}
                      >
                        <ChevronRight className="mr-2 h-4 w-4" />
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </RootLayout>
  )
}