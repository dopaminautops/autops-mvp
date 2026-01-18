import { useEffect, useState } from 'react'
import './App.css'
import DrawerMenu from './components/DrawerMenu'
import Operations from './pages/Operations'
import Templates from './pages/Templates'
import CallAutomation from './pages/CallAutomation'
import AutomationHub from './pages/AutomationHub'
import IDConfiguration from './pages/IDConfiguration'
import WorkflowSetup from './pages/WorkflowSetup'
import ConfigureStep from './pages/ConfigureStep'
import NewOnboardingFlow from './pages/NewOnboardingFlow'
import  StrategyPlanning from './pages/StrategyPlanning'
import FinanceDashboard from './pages/FinanceDashboard'
import AnalyticsReport from './pages/AnalyticsReport';
import ClientRecordsPage from './pages/ClientRecordsPage';
import TeamManagementPage from './pages/template page/TeamManagementPage';




function App() {
  const [apiStatus, setApiStatus] = useState('checking...')
    const [currentPage, setCurrentPage] = useState('automation-hub')

      useEffect(() => {
          fetch('http://localhost:8000/api/health')
                .then(res => res.json())
                      .then(data => {
                              setApiStatus('connected ✓')
                                      console.log('API Health:', data)
                                            })
                                                  .catch(() => setApiStatus('disconnected ✗'))
                                                    }, [])

                                                      return (
                                                          <div className="App">
                                                                <div className="api-status">API: {apiStatus}</div>
                                                                      
                                                                            {/* Drawer Menu */}
                                                                                  <DrawerMenu currentPage={currentPage} onNavigate={setCurrentPage} />

                                                                                        {/* Pages */}
                                                                                              {currentPage === 'automation-hub' && <AutomationHub />}
                                                                                                    {currentPage === 'call-automation' && <CallAutomation />}
                                                                                                          {currentPage === 'operations' && <Operations />}
                                                                                                                {currentPage === 'strategy-planning' && <StrategyPlanning />}
                                                                                                                      {currentPage === 'templates' && <Templates />}
                                                                                                                            {currentPage === 'id-config' && <IDConfiguration />}
                                                                                                                                  {currentPage === 'workflow-setup' && <WorkflowSetup />}
                                                                                                                                        {currentPage === 'configure-step' && <ConfigureStep />}
                                                                                                                                              {currentPage === 'onboarding-flow' && <NewOnboardingFlow />}
                                                                                                                                              {currentPage === 'finance' && <FinanceDashboard />}
                                                                                                                                              {currentPage === 'analytics' && <AnalyticsReport />}
                                                                                                                                               {currentPage === 'client-records' && <ClientRecordsPage />}
                                                                                                                                                <Route path="/team-management" element={<TeamManagementPage />} /><Route path="/team-management" element={<TeamManagementPage />} />     </main>
                                                                                                                                                         </div>
                                                                                                                                                           );
                                                                                                                                                           }
                                                                              
                                                                                                                                                  

                                                                                                                                          
                                                                                                                                                    )
                                                                                                                                                    }

                                                                                                                                                    export default App

                                                                                                                                                                                                                                                