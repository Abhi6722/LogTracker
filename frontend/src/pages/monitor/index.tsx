import { useState } from "react"

import { RootLayout } from "@/components/layout/root-layout"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetLogFilesQuery } from "@/store/api/logApi"

export default function MonitorPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const { data: logFiles = [], error, isLoading } = useGetLogFilesQuery()

  const logs = logFiles.flatMap(file => file.logs);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.message
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel
    return matchesSearch && matchesLevel
  })

  const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === 'object' && 'data' in error) {
      const errData = error as { data: { message?: string } }
      return errData.data.message || 'An error occurred'
    }
    return 'An error occurred'
  }

  return (
    <RootLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Monitor</h1>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px]"
            />
            <Select
              value={selectedLevel}
              onValueChange={(value) => setSelectedLevel(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredLogs.length} logs found
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="font-mono">
            {isLoading && <p>Loading logs...</p>}
            {error && <p>Error loading logs: {getErrorMessage(error)}</p>}
            {filteredLogs.map((log, index) => (
              <div
                key={index}
                className={`border-b px-4 py-2 ${index === filteredLogs.length - 1 ? "rounded-b-lg" : ""}`}
              >
                <span className="text-muted-foreground text-xs">{log.timestamp}</span>{" "}
                <span
                  className={`ml-2 font-bold text-sm ${log.level === "error" ? "text-red-600" : log.level === "warning" ? "text-yellow-600" : log.level === "debug" ? "text-blue-600" : "text-green-600"}`}
                >
                  {log.level.toUpperCase()}
                </span>{" "}
                <span className="text-sm">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RootLayout>
  )
}