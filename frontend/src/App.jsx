import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/ui/Layout';
import HomePage from './pages/HomePage';
import DemoPage from './pages/DemoPage';
import ShowcasePage from './pages/ShowcasePage';
import FastTrackPage from './pages/FastTrackPage';
import QueueDashboard from './pages/QueueDashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="/fasttrack" element={<FastTrackPage />} />
          <Route path="/queue" element={<QueueDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;