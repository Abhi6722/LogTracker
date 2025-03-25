import { useState } from "react"
import { RootLayout } from "@/components/layout/root-layout"
import { Button } from "@/components/ui/button"
import { Upload, Eye, EyeOff } from "lucide-react" // Import Eye and EyeOff icons
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetLogFilesQuery, useUploadLogFileMutation, useToggleLogFileMutation, useDeleteLogFileMutation } from "@/store/api/logApi"

export default function LogsPage() {
  const { data: logFiles = [] } = useGetLogFilesQuery()
  const [uploadLogFile] = useUploadLogFileMutation()
  const [toggleLogFile] = useToggleLogFileMutation()
  const [deleteLogFile] = useDeleteLogFileMutation()
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files)
    const filePromises = newFiles.map(async (file) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = async (e) => {
          try {
            const content = e.target?.result as string
            const logs = content
              .split("\n")
              .filter(Boolean)
              .map((line) => ({
                ...JSON.parse(line),
                source: file.name,
              }))

            await uploadLogFile({
              name: file.name,
              size: file.size,
              logs,
            })
            resolve()
          } catch (error) {
            console.error(`Error parsing log file ${file.name}:`, error)
            reject(error)
          }
        }
        reader.readAsText(file)
      })
    })

    try {
      await Promise.all(filePromises)
    } catch (error) {
      console.error("Error uploading files:", error)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const toggleFile = async (id: string) => {
    try {
      await toggleLogFile(id)
    } catch (error) {
      console.error("Error toggling file:", error)
    }
  }

  const removeFile = async (id: string) => {
    try {
      await deleteLogFile(id)
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }

  const formatFileSize = (bytes: number) => {
    const units = ["B", "KB", "MB", "GB"]
    let size = bytes
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  return (
    <RootLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Logs</h1>
          <div className="flex items-center gap-4">
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <input
                type="file"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="log-file"
                accept=".log,.txt,.json"
                multiple
              />
              <Button asChild>
                <label htmlFor="log-file" className="cursor-pointer">
                  <Upload className="mr-2 size-4" />
                  Upload Logs
                </label>
              </Button>
            </div>
          </div>
        </div>

        {/* Drag-and-Drop Section */}
        <div
          className={`rounded-lg border-2 border-dashed p-8 transition-colors ${isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Upload className="size-8 text-muted-foreground" />
            <p className="text-lg font-medium">Drag and drop log files here</p>
            <p className="text-sm text-muted-foreground">
              or click the Upload button above to select files
            </p>
          </div>
        </div>

        {/* Uploaded Files Section */}
        {logFiles.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {logFiles.map((file) => (
              <div
                key={file._id}
                className={`rounded-lg border bg-card p-6 shadow-lg transition-transform transform hover:scale-105 ${file.enabled ? "" : "opacity-60"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2 truncate">
                    <p className="text-xl font-semibold">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(file.size)} • {file.logs.length} entries
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={!file.enabled ? "outline" : "default"}
                      size="icon"
                      onClick={() => toggleFile(file._id)}
                    >
                      {file.enabled ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFile(file._id)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RootLayout>
  )
}