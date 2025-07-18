import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/ios-design-system.css';

// Components
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import ListingPage from './pages/ListingPage';
import AdminLogin from './pages/AdminLogin';

// Admin Dashboard
import DashboardLayout from './components/admin/DashboardLayout';
import Dashboard from './pages/admin/Dashboard';
import Communities from './pages/admin/Communities';
import Properties from './pages/admin/Properties';
import Listings from './pages/admin/Listings';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <div>
              <Navigation />
              <main>
                <HomePage />
              </main>
            </div>
          } />
          <Route path="/community/:id" element={
            <div>
              <Navigation />
              <main>
                <CommunityPage />
              </main>
            </div>
          } />
          <Route path="/listing/:id" element={
            <div>
              <Navigation />
              <main>
                <ListingPage />
              </main>
            </div>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/*" element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="communities" element={<Communities />} />
            <Route path="properties" element={<Properties />} />
            <Route path="listings" element={<Listings />} />
            <Route path="settings" element={<Settings />} />
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
