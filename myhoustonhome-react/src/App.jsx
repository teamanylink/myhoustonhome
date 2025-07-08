import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import './styles/ios-design-system.css';
import { DataService } from './services/dataService';

// Components
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import ListingPage from './pages/ListingPage';
import AdminPage from './pages/AdminPage';

function App() {
  useEffect(() => {
    // Initialize example data on first load
    DataService.initializeExampleData();
  }, []);

  return (
    <Router>
      <div className="App">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/community/:id" element={<CommunityPage />} />
            <Route path="/listing/:id" element={<ListingPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
