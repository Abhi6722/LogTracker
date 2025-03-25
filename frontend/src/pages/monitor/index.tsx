import { useState } from "react"
import { RootLayout } from "@/components/layout/root-layout"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetLogFilesQuery } from "@/store/api/logApi"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Download, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function MonitorPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null })
  const [useRegex, setUseRegex] = useState(false)
  const [expandedLogs, setExpandedLogs] = useState<number[]>([])
  const { data: logFiles = [], error, isLoading } = useGetLogFilesQuery()

  const logs = logFiles
    .filter(file => file.enabled)
    .flatMap(file => file.logs);

  const availableSources = Array.from(new Set(logs.map(log => log.source || 'unknown').filter(Boolean))).sort()

  const filteredLogs = logs.filter((log) => {
    let matchesSearch = true
    if (searchQuery) {
      try {
        if (useRegex) {
          const regex = new RegExp(searchQuery, 'i')
          matchesSearch = regex.test(log.message)
        } else {
          matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase())
        }
      } catch {
        matchesSearch = false
      }
    }

    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel
    const matchesSource = selectedSources.length === 0 || (log.source && selectedSources.includes(log.source))
    const matchesDate = (!dateRange.from || new Date(log.timestamp) >= dateRange.from) &&
                     (!dateRange.to || new Date(log.timestamp) <= dateRange.to)

    return matchesSearch && matchesLevel && matchesSource && matchesDate
  })

  const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === 'object' && 'data' in error) {
      const errData = error as { data: { message?: string } }
      return errData.data.message || 'An error occurred'
    }
    return 'An error occurred'
  }

  const toggleLogExpansion = (index: number) => {
    setExpandedLogs(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  const exportLogs = () => {
    const exportData = filteredLogs.map(log => ({
      timestamp: log.timestamp,
      level: log.level,
      message: log.message,
      source: log.source
    }))

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-export-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <RootLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Monitor</h1>
          <Button onClick={exportLogs} className="flex items-center gap-2">
            <Download className="size-4" />
            Export Logs
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant={useRegex ? "default" : "outline"}
                      size="icon"
                      onClick={() => setUseRegex(!useRegex)}
                      title={useRegex ? "Using Regex" : "Plain Text Search"}
                    >
                      <Filter className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="w-[200px] space-y-2">
                  <label className="text-sm font-medium">Log Level</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
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

                <div className="w-[300px] space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange.from && !dateRange.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from ?? undefined}
                        selected={{ from: dateRange.from ?? undefined, to: dateRange.to ?? undefined }}
                        onSelect={(range) =>
                          setDateRange({
                            from: range?.from ?? null,
                            to: range?.to ?? null,
                          })
                        }
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Log Sources</label>
                <div className="flex flex-wrap gap-2">
                  {availableSources.map((source) => (
                    <label
                      key={source}
                      className="flex items-center space-x-2 rounded-lg border p-2"
                    >
                      <Checkbox
                        checked={selectedSources.includes(source)}
                        onCheckedChange={(checked: boolean) => {
                          setSelectedSources(prev =>
                            checked
                              ? [...prev, source]
                              : prev.filter(s => s !== source)
                          )
                        }}
                      />
                      <span className="text-sm">{source}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <div className="space-x-2">
            {Object.entries({
              Level: selectedLevel !== "all" && selectedLevel,
              "Date Range": dateRange.from && "Active",
              Sources: selectedSources.length > 0 && `${selectedSources.length} selected`,
              Regex: useRegex && "Enabled"
            }).map(([label, value]) => value && (
              <Badge key={label} variant="secondary" className="gap-1">
                {label}: {value}
                <X
                  className="size-3 cursor-pointer"
                  onClick={() => {
                    switch(label) {
                      case "Level": setSelectedLevel("all"); break;
                      case "Date Range": setDateRange({ from: null, to: null }); break;
                      case "Sources": setSelectedSources([]); break;
                      case "Regex": setUseRegex(false); break;
                    }
                  }}
                />
              </Badge>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredLogs.length} logs found
          </div>
        </div>

        <Card>
          <ScrollArea className="h-[600px]">
            <CardContent className="p-0">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <p>Loading logs...</p>
                </div>
              )}
              {error && (
                <div className="flex items-center justify-center p-4">
                  <p className="text-destructive">Error loading logs: {getErrorMessage(error)}</p>
                </div>
              )}
              {filteredLogs.map((log, index) => {
                const isExpanded = expandedLogs.includes(index)
                return (
                  <div
                    key={index}
                    className={cn(
                      "border-b p-4 transition-colors hover:bg-muted/50",
                      isExpanded && "bg-muted/50"
                    )}
                    onClick={() => toggleLogExpansion(index)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs">
                            {format(new Date(log.timestamp), "MMM dd, yyyy HH:mm:ss")}
                          </span>
                          <Badge
                            variant={log.level === "error" ? "destructive" : "outline"}
                            className={cn(
                              "font-medium",
                              log.level === "warning" && "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20",
                              log.level === "debug" && "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20",
                              log.level === "info" && "bg-green-500/10 text-green-700 hover:bg-green-500/20"
                            )}
                          >
                            {log.level.toUpperCase()}
                          </Badge>
                          <Badge variant="secondary" className="font-normal">
                            {log.source}
                          </Badge>
                        </div>
                        <p className="text-sm">{log.message}</p>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-4 space-y-3 border-t pt-4 max-w-4xl mx-auto">
                        <div className="grid grid-cols-2 gap-6 bg-muted/30 rounded-lg p-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                            <p className="font-mono text-sm bg-background rounded p-2 overflow-x-auto">{format(new Date(log.timestamp), "PPpp")}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Source</p>
                            <p className="font-mono text-sm bg-background rounded p-2 overflow-x-auto">{log.source}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Full Message</p>
                          <pre className="whitespace-pre-wrap break-words rounded-lg bg-background p-4 font-mono text-sm border overflow-x-auto">
                            {log.message}
                          </pre>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Raw Data</p>
                          <pre className="rounded-lg bg-background p-4 font-mono text-sm border overflow-x-auto">
                            {JSON.stringify(log, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </RootLayout>
  )
}