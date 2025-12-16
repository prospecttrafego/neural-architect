import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from './app/providers';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { SoftwareHubPage } from './pages/SoftwareHubPage';
import { AgentsHubPage } from './pages/AgentsHubPage';
import { AutomationHubPage } from './pages/AutomationHubPage';

/**
 * Main App component with routing
 */
function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/software" element={<SoftwareHubPage />} />
            <Route path="/agents" element={<AgentsHubPage />} />
            <Route path="/automation" element={<AutomationHubPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}

export default App;
