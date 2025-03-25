import { RootLayout } from "@/components/layout/root-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, BarChart2, Search, Shield, Zap } from "lucide-react"

export default function IntroductionPage() {
  return (
    <RootLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="border-b pb-8">
          <h1 className="text-5xl font-bold tracking-tight">Introduction</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Welcome to LogTracker - Your Modern Log Management Solution
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="prose dark:prose-invert max-w-none p-8">
                <h2 className="text-3xl font-semibold tracking-tight">What is LogTracker?</h2>
                <p className="text-lg leading-7 text-muted-foreground">
                  LogTracker is a modern log visualization and analysis tool designed to help
                  developers and system administrators monitor, analyze, and understand their
                  application logs in real-time. With its intuitive interface and powerful features,
                  LogTracker makes log management simple and efficient.
                </p>

                <div className="my-8 grid gap-4 md:grid-cols-2">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Real-time Monitoring</h3>
                      <p className="text-sm text-muted-foreground">
                        Monitor your logs in real-time with instant updates and notifications
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                      <Search className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Advanced Search</h3>
                      <p className="text-sm text-muted-foreground">
                        Powerful search capabilities with filters and custom queries
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                      <BarChart2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Visual Analytics</h3>
                      <p className="text-sm text-muted-foreground">
                        Interactive charts and visualizations for better insights
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Alert System</h3>
                      <p className="text-sm text-muted-foreground">
                        Customizable alerts and notifications for critical events
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-semibold mt-8">Getting Started</h2>
                <Tabs defaultValue="install" className="mt-6">
                  <TabsList>
                    <TabsTrigger value="install">Installation</TabsTrigger>
                    <TabsTrigger value="configure">Configuration</TabsTrigger>
                    <TabsTrigger value="usage">Basic Usage</TabsTrigger>
                  </TabsList>
                  <TabsContent value="install" className="mt-4 space-y-4">
                    <p className="text-sm leading-7">
                      Get started with LogTracker by following these simple steps:
                    </p>
                    <div className="rounded-lg bg-muted p-4">
                      <code className="text-sm">npm install logtracker</code>
                    </div>
                  </TabsContent>
                  <TabsContent value="configure" className="mt-4">
                    <p className="text-sm leading-7">
                      Configure LogTracker by creating a configuration file in your project root.
                    </p>
                  </TabsContent>
                  <TabsContent value="usage" className="mt-4">
                    <p className="text-sm leading-7">
                      Start using LogTracker by importing it into your application.
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <div className="space-y-2">
                  {['Installation', 'Configuration', 'API Reference', 'Examples'].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="flex items-center text-sm text-muted-foreground hover:text-primary"
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      {item}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RootLayout>
  )
}