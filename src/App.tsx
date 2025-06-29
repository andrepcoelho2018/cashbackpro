import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Levels from './components/Levels';
import Movements from './components/Movements';
import Rewards from './components/Rewards';
import Referrals from './components/Referrals';
import Communication from './components/Communication';
import Objectives from './components/Objectives';
import Settings from './components/Settings';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <Customers />;
      case 'levels':
        return <Levels />;
      case 'movements':
        return <Movements />;
      case 'rewards':
        return <Rewards />;
      case 'referrals':
        return <Referrals />;
      case 'communication':
        return <Communication />;
      case 'objectives':
        return <Objectives />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        <LoadingScreen />
        {renderPage()}
      </Layout>
    </AppProvider>
  );
}

export default App;