import { useEffect, useMemo, useState } from 'react'
import './App.css'
import DrawerMenu from './components/drawermenu'
import BottomNav from './components/BottomNav'
import ProfilePage from './pages/profilepage'
import SettingsPage from './pages/settingspage'
import AutomationLibraryPage from './pages/automationlibrarypage'
import ReportInsightPage from './pages/reportinsightpage'
import TeamManagementPage from './pages/teamanagementpage'
import ClientRecordPage from './pages/clientrecordpage'
import StrategyAnalysisPage from './pages/strategyanalysispage'
import DashboardPage from './pages/dashboardpage'
import OperationsPage from './pages/operationspage'
import TemplatesPage from './pages/templatespage'
import HealthPage from './pages/healthpage'
import HubPage from './pages/hubpage'
import ClinicIntakeTriageAgentPage from './pages/clinicintaketriageagentpage'
import { appApi } from './services/api'

const menuItems = [
  { id: 'profile', label: 'Profile', icon: '👤', category: 'Pages' },
  { id: 'automation-library', label: 'Automation Library', icon: '🧩', category: 'Pages' },
  { id: 'report-insight', label: 'Report & Insight', icon: '📈', category: 'Pages' },
  { id: 'team-management', label: 'Team Management', icon: '👥', category: 'Pages' },
  { id: 'client-record', label: 'Client Record', icon: '🗂️', category: 'Pages' },
  { id: 'strategy-analysis', label: 'Strategy Analysis', icon: '🎯', category: 'Pages' },
  { id: 'settings', label: 'Settings', icon: '⚙️', category: 'Pages' },
  { id: 'clinic-intake-triage-agent', label: 'Clinic Intake + Triage Agent', icon: '🩺', category: 'Agents' },
]

function App() {
  const [apiStatus, setApiStatus] = useState('checking...')
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [templates, setTemplates] = useState([])
  const [workflowCount, setWorkflowCount] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  useEffect(() => {
    Promise.all([appApi.health(), appApi.getTemplates(), appApi.getWorkflows()])
      .then(([health, templatesResponse, workflows]) => {
        setApiStatus(`${health.status} • db ${health.database}`)
        setTemplates(templatesResponse.templates || [])
        setWorkflowCount(workflows.workflows?.length || 0)
      })
      .catch(() => setApiStatus('disconnected'))
  }, [])

  const handleUseTemplate = (template) => {
    setSelectedTemplate(template)
    setCurrentPage('automation-library')
  }

  const currentPageNode = useMemo(() => {
    switch (currentPage) {
      case 'automation-library':
        return <AutomationLibraryPage workflowCount={workflowCount} selectedTemplate={selectedTemplate} />
      case 'report-insight':
        return <ReportInsightPage templateCount={templates.length} workflowCount={workflowCount} />
      case 'team-management':
        return <TeamManagementPage />
      case 'client-record':
        return <ClientRecordPage />
      case 'strategy-analysis':
        return <StrategyAnalysisPage />
      case 'clinic-intake-triage-agent':
        return <ClinicIntakeTriageAgentPage />
      case 'settings':
        return <SettingsPage />
      case 'profile':
        return <ProfilePage />
      case 'operations':
        return <OperationsPage workflowCount={workflowCount} />
      case 'templates':
        return <TemplatesPage templates={templates} onUseTemplate={handleUseTemplate} />
      case 'health':
        return <HealthPage apiStatus={apiStatus} />
      case 'hub':
        return <HubPage />
      default:
        return <DashboardPage workflowCount={workflowCount} />
    }
  }, [currentPage, templates, workflowCount, apiStatus, selectedTemplate])

  const bottomItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '🏠', onClick: () => setCurrentPage('dashboard') },
    { key: 'operations', label: 'Operations', icon: '📈', onClick: () => setCurrentPage('operations') },
    { key: 'templates', label: 'Templates', icon: '🧾', onClick: () => setCurrentPage('templates') },
    { key: 'health', label: 'Health', icon: '🛡️', onClick: () => setCurrentPage('health') },
    { key: 'hub', label: 'Hub', icon: '🕸️', onClick: () => setCurrentPage('hub') },
  ]

  return (
    <main className="App">
      <DrawerMenu currentPage={currentPage} menuItems={menuItems} onNavigate={setCurrentPage} />

      <header className="top-strip">
        <h1>autops-mvp</h1>
        <p className="api-status">API: {apiStatus}</p>
      </header>

      <div className="content">{currentPageNode}</div>
      <BottomNav items={bottomItems} currentKey={currentPage} />
    </main>
  )
}

export default App
