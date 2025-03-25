import { RootLayout } from "@/components/layout/root-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Palette, Bell, Monitor } from "lucide-react"

export default function PreferencesPage() {
  return (
    <RootLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Preferences</h1>
          <p className="text-lg text-muted-foreground">
            Customize your LogTracker experience
          </p>
        </div>

        <div className="grid gap-6">
          {/* Theme Settings */}
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <CardTitle>Theme Settings</CardTitle>
              </div>
              <CardDescription>
                Customize the appearance of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Color Theme</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-4">
                <Switch id="animations" />
                <Label htmlFor="animations">Enable animations</Label>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <CardTitle>Notification Settings</CardTitle>
              </div>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Switch id="email-notifications" />
                <Label htmlFor="email-notifications">Email notifications</Label>
              </div>
              <div className="flex items-center space-x-4">
                <Switch id="desktop-notifications" />
                <Label htmlFor="desktop-notifications">Desktop notifications</Label>
              </div>
              <div className="flex items-center space-x-4">
                <Switch id="alert-sounds" />
                <Label htmlFor="alert-sounds">Alert sounds</Label>
              </div>
            </CardContent>
          </Card>

          {/* Display Options */}
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4" />
                <CardTitle>Display Options</CardTitle>
              </div>
              <CardDescription>
                Customize how information is displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="density">Display Density</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select density" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="local">Local Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-4">
                <Switch id="24h-time" />
                <Label htmlFor="24h-time">Use 24-hour time format</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button variant="outline">Reset to Defaults</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}