import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "@/pages/auth/login"
import DashboardPage from "@/pages/dashboard"
import MonitorPage from "./pages/monitor"
import LogsPage from "@/pages/logs"
import DocsPage from "@/pages/docs"
import IntroductionPage from "./pages/docs/introduction"
import SecurityPage from "./pages/settings/security"
import PreferencesPage from "./pages/settings/preferences"
import RegisterPage from "./pages/auth/register"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/monitor" element={<MonitorPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path ="/security" element={<SecurityPage />} />
        <Route path ="/preferences" element={<PreferencesPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/docs/introduction" element={<IntroductionPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
