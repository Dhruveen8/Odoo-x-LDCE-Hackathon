import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp, AppProvider } from './context/AppContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Notification from './components/common/Notification';
import CreateTripModal from './views/CreateTripModal';

// Views
import AuthView from './views/AuthView';
import DashboardView from './views/DashboardView';
import MyTripsView from './views/MyTripsView';
import ItineraryBuilderView from './views/ItineraryBuilderView';
import ItineraryDetailView from './views/ItineraryDetailView';
import CitySearchView from './views/CitySearchView';
import ActivitySearchView from './views/ActivitySearchView';
import VehicleRentalView from './views/VehicleRentalView';
import TourGuideView from './views/TourGuideView';
import BudgetView from './views/BudgetView';
import CalendarView from './views/CalendarView';
import PublicTripView from './views/PublicTripView';
import ProfileView from './views/ProfileView';
import AdminDashboardView from './views/AdminDashboardView';

function AppContent() {
  const { currentView, isAuthenticated } = useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // If on dedicated auth view or unauthenticated
  if (currentView === 'auth' || !isAuthenticated) {
    return <AuthView />;
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onOpenCreateModal={() => setIsCreateModalOpen(true)} />;
      case 'my-trips':
        return <MyTripsView onOpenCreateModal={() => setIsCreateModalOpen(true)} />;
      case 'itinerary-builder':
        return <ItineraryBuilderView />;
      case 'itinerary-view':
        return <ItineraryDetailView />;
      case 'city-search':
        return <CitySearchView />;
      case 'activity-search':
        return <ActivitySearchView />;
      case 'vehicles':
        return <VehicleRentalView />;
      case 'guides':
        return <TourGuideView />;
      case 'budget':
        return <BudgetView />;
      case 'calendar':
        return <CalendarView />;
      case 'public-trip':
        return <PublicTripView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminDashboardView />;
      default:
        return <DashboardView onOpenCreateModal={() => setIsCreateModalOpen(true)} />;
    }
  };

  const isDashboard = currentView === 'dashboard';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Fixed slim sidebar — 64px */}
      <Sidebar onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      {/* Minimal navbar */}
      <Navbar onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      {/* Main content */}
      <main
        style={{
          marginLeft:  'var(--sidebar-w)',
          paddingTop:  isDashboard ? 0 : 'var(--navbar-h)',
          minHeight:   '100vh',
          paddingLeft: isDashboard ? 0 : 'clamp(20px, 4vw, 48px)',
          paddingRight: isDashboard ? 0 : 'clamp(20px, 4vw, 48px)',
          paddingBottom: '80px'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.22,1,0.36,1] }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <Notification />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
