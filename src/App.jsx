import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/ios-design-system.css';

// Components
import Navigation from './components/Navigation.jsx';
import CommunityNavigation from './components/CommunityNavigation.jsx';
import Footer from './components/Footer.jsx';
import CommunityFooter from './components/CommunityFooter.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import ListingPage from './pages/ListingPage.jsx';
import CommunitiesPage from './pages/CommunitiesPage.jsx';
import AdminLogin from './pages/AdminLogin.jsx';

// Admin Dashboard
import DashboardLayout from './components/admin/DashboardLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Communities from './pages/admin/Communities.jsx';
import Properties from './pages/admin/Properties.jsx';
import Listings from './pages/admin/Listings.jsx';
import Settings from './pages/admin/Settings.jsx';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <div className="site-wrapper">
              <Navigation />
              <main className="main-content">
                <HomePage />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/communities" element={
            <div className="site-wrapper">
              <Navigation />
              <main className="main-content">
                <CommunitiesPage />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/community/:id" element={
            <div className="site-wrapper">
              <CommunityPage />
              <CommunityFooter />
            </div>
          } />
          <Route path="/contact" element={
            <div className="site-wrapper">
              <Navigation />
              <main className="main-content">
                <ContactPage />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/listing/:id" element={
            <div className="site-wrapper">
              <Navigation />
              <main className="main-content">
                <ListingPage />
              </main>
              <Footer />
            </div>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="communities" element={<Communities />} />
            <Route path="properties" element={<Properties />} />
            <Route path="listings" element={<Listings />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
