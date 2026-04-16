import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import WealthAnalysis from './pages/WealthAnalysis';
import WealthPlanner from './pages/WealthPlanner';
import SecurityAuditLogs from './pages/SecurityAuditLogs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analysis" element={<WealthAnalysis />} />
          <Route path="/planner" element={<WealthPlanner />} />
          <Route path="/logs" element={<SecurityAuditLogs />} />
        </Routes>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;

