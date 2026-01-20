import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import useStore from './store/useStore';

// Layout
import Layout from './components/Layout/Layout';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Loans from './pages/Loans/Loans';
import Documents from './pages/Documents/Documents';
import Payments from './pages/Payments/Payments';
import Profile from './pages/Profile/Profile';

// Component that reads customer ID from URL and loads data
const AppContent = () => {
  const [searchParams] = useSearchParams();
  const { loadCustomerData, dataLoaded, isLoading, error, setCustomerId, customerId } = useStore();

  useEffect(() => {
    // Get customer ID from URL query param
    const urlCustomerId = searchParams.get('customer_id') || searchParams.get('customerId');

    if (urlCustomerId && urlCustomerId !== customerId) {
      setCustomerId(urlCustomerId);
    }
  }, [searchParams, customerId, setCustomerId]);

  useEffect(() => {
    if (!dataLoaded && customerId) {
      loadCustomerData();
    }
  }, [dataLoaded, customerId, loadCustomerData]);

  // No customer ID provided in URL
  if (!customerId) {
    return (
      <div className="app-error">
        <h2>Customer ID Required</h2>
        <p>Please provide a customer_id in the URL query parameter.</p>
        <code>?customer_id=your_customer_id</code>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Loading your account...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <h2>Unable to load your account</h2>
        <p>{error}</p>
        <button onClick={() => loadCustomerData()}>Try Again</button>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="loans" element={<Loans />} />
        <Route path="documents" element={<Documents />} />
        <Route path="payments" element={<Payments />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Dashboard />} />
        <Route path="support" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
