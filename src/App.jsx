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
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
      {/* Fixed liquid glass sidebar — 220px */}
      <Sidebar onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      {/* Fixed liquid glass navbar — spans right of sidebar to edge */}
      <Navbar onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      {/* Main content — push right past sidebar, down past navbar */}
      <main
        style={{
          marginLeft:  'var(--sidebar-w)',
          paddingTop:  isDashboard ? 0 : 'var(--navbar-h)',
          minHeight:   '100vh',
          paddingLeft: isDashboard ? 0 : '28px',
          paddingRight: isDashboard ? 0 : '28px',
          paddingBottom: '60px'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: [0.22,1,0.36,1] }}
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
