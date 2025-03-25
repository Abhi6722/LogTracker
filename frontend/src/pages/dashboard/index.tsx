import { Activity, ArrowUpRight, DollarSign, Users } from "lucide-react"
import { RootLayout } from "@/components/layout/root-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DistributionChart } from "@/components/dashboard/distribution-chart"
import { TimelineChart } from "@/components/dashboard/timeline-chart"

export default function DashboardPage() {
  return (
    <RootLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">Here's an overview of your logs and activity.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Logs"
            value="2,350"
            icon={<Activity className="size-4 text-muted-foreground" />}
            description="+20.1% from last month"
          />
          <StatsCard
            title="Active Users"
            value="321"
            icon={<Users className="size-4 text-muted-foreground" />}
            description="+180.1% from last month"
          />
          <StatsCard
            title="Error Rate"
            value="0.03%"
            icon={<ArrowUpRight className="size-4 text-muted-foreground" />}
            description="+19% from last month"
          />
          <StatsCard
            title="Processing Cost"
            value="$682.5"
            icon={<DollarSign className="size-4 text-muted-foreground" />}
            description="+12.45% from last month"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold tracking-tight">Activity Overview</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor your log activity and error rates over time
                  </p>
                </div>
              </div>
              <div className="h-[350px]">
                <TimelineChart />
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <div className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold tracking-tight">Log Distribution</h3>
                  <p className="text-sm text-muted-foreground">
                    Distribution of log levels across your system
                  </p>
                </div>
              </div>
              <div className="h-[350px]">
                <DistributionChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>

    //     <div className="rounded-lg border">
    //       <div className="p-4">
    //         <h2 className="text-xl font-semibold">Recent Logs</h2>
    //       </div>
    //       <div className="p-4">
    //         <div className="space-y-8">
    //           <div className="space-y-2 rounded-lg bg-accent/50 p-4">
    //             <div className="flex items-center justify-between">
    //               <p className="font-medium">Error: Connection refused</p>
    //               <p className="text-sm text-muted-foreground">2 mins ago</p>
    //             </div>
    //             <p className="text-sm text-muted-foreground">
    //               Failed to connect to database at localhost:27017
    //             </p>
    //           </div>
    //           <div className="space-y-2 rounded-lg bg-accent/50 p-4">
    //             <div className="flex items-center justify-between">
    //               <p className="font-medium">Warning: High CPU Usage</p>
    //               <p className="text-sm text-muted-foreground">5 mins ago</p>
    //             </div>
    //             <p className="text-sm text-muted-foreground">
    //               CPU usage exceeded 80% threshold
    //             </p>
    //           </div>
    //           <div className="space-y-2 rounded-lg bg-accent/50 p-4">
    //             <div className="flex items-center justify-between">
    //               <p className="font-medium">Info: Service Started</p>
    //               <p className="text-sm text-muted-foreground">10 mins ago</p>
    //             </div>
    //             <p className="text-sm text-muted-foreground">
    //               Application service started successfully
    //             </p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </DashboardLayout>
  )
}