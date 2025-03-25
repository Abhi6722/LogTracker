import { RootLayout } from "@/components/layout/root-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Shield, Key, History } from "lucide-react"

export default function SecurityPage() {
  return (
    <RootLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Security Settings</h1>
          <p className="text-lg text-muted-foreground">
            Manage your account security and authentication settings
          </p>
        </div>

        <div className="grid gap-6">
          {/* Password Section */}
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <CardTitle>Password</CardTitle>
              </div>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter your current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter your new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your new password"
                />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <CardTitle>Two-Factor Authentication</CardTitle>
              </div>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Switch id="2fa" />
                <Label htmlFor="2fa">Enable two-factor authentication</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                When enabled, you'll be required to enter a security code in addition
                to your password when signing in.
              </p>
            </CardContent>
          </Card>

          {/* Login History */}
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center space-x-2">
                <History className="h-4 w-4" />
                <CardTitle>Login History</CardTitle>
              </div>
              <CardDescription>
                Review your recent login activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    device: "Chrome on MacOS",
                    location: "San Francisco, US",
                    time: "2 minutes ago",
                    status: "Current session",
                  },
                  {
                    device: "Firefox on Windows",
                    location: "London, UK",
                    time: "2 days ago",
                    status: "Successful",
                  },
                ].map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{session.device}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.location} • {session.time}
                      </p>
                    </div>
                    <span
                      className={`text-sm ${session.status === "Current session" ? "text-green-500" : "text-muted-foreground"}`}
                    >
                      {session.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RootLayout>
  )
}