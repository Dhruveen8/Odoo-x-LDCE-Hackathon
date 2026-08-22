import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USER, INITIAL_TRIPS, ADMIN_STATS } from '../data/initialData';
import { DESTINATIONS, PRESET_ACTIVITIES } from '../data/destinations';

const AppContext = createContext();

const CURRENCY_RATES = {
  USD: { symbol: '$', rate: 1.0 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
  INR: { symbol: '₹', rate: 83.5 },
  JPY: { symbol: '¥', rate: 155.0 }
};

export function AppProvider({ children }) {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('gt_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('gt_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('gt_auth') === 'true' || true;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gt_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  useEffect(() => {
    localStorage.setItem('gt_user', JSON.stringify(user));
  }, [user]);

  // Trips state
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('gt_trips');
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });

  useEffect(() => {
    localStorage.setItem('gt_trips', JSON.stringify(trips));
  }, [trips]);

  // Active view navigation
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeTripId, setActiveTripId] = useState('trip-grand-europe');

  // Notifications toast
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Currency helper
  const formatCurrency = (amountInUSD) => {
    const cur = user.homeCurrency || 'USD';
    const rateInfo = CURRENCY_RATES[cur] || CURRENCY_RATES.USD;
    const converted = (amountInUSD * rateInfo.rate).toLocaleString(undefined, {
      maximumFractionDigits: cur === 'JPY' ? 0 : 0
    });
    return `${rateInfo.symbol}${converted}`;
  };

  // Trips CRUD
  const createTrip = (newTripData) => {
    const id = `trip-${Date.now()}`;
    const newTrip = {
      id,
      title: newTripData.title || "My New Adventure",
      description: newTripData.description || "Exciting travel itinerary created with GlobeTrotter.",
      coverImage: newTripData.coverImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      startDate: newTripData.startDate || new Date().toISOString().split('T')[0],
      endDate: newTripData.endDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: "Upcoming",
      targetBudget: Number(newTripData.targetBudget) || 2000,
      transportBudget: Number(newTripData.transportBudget) || 500,
      lodgingBudget: Number(newTripData.lodgingBudget) || 800,
      foodBudget: Number(newTripData.foodBudget) || 400,
      activitiesBudget: Number(newTripData.activitiesBudget) || 300,
      isPublic: true,
      shareSlug: `${newTripData.title?.toLowerCase().replace(/\s+/g, '-') || 'trip'}-${Date.now().toString().slice(-4)}`,
      likesCount: 0,
      stops: newTripData.stops || []
    };

    setTrips(prev => [newTrip, ...prev]);
    setActiveTripId(id);
    addToast("Trip Created! ✈️", `"${newTrip.title}" is ready to be customized.`, "success");
    return newTrip;
  };

  const updateTrip = (tripId, updatedFields) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, ...updatedFields } : t));
    addToast("Trip Updated", "All itinerary changes have been saved.", "info");
  };

  const deleteTrip = (tripId) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
    addToast("Trip Deleted", "The trip has been removed.", "warning");
    if (activeTripId === tripId && trips.length > 1) {
      const remaining = trips.filter(t => t.id !== tripId);
      setActiveTripId(remaining[0]?.id || null);
    }
  };

  const cloneTrip = (tripToClone) => {
    const cloned = {
      ...tripToClone,
      id: `trip-clone-${Date.now()}`,
      title: `${tripToClone.title} (My Copy)`,
      shareSlug: `${tripToClone.shareSlug}-copy-${Date.now().toString().slice(-4)}`,
      likesCount: 0,
      status: "Upcoming"
    };
    setTrips(prev => [cloned, ...prev]);
    setActiveTripId(cloned.id);
    addToast("Trip Cloned! 🎉", `Copied "${cloned.title}" to your trips.`, "success");
    return cloned;
  };

  // Stops & Activities Management
  const addStopToTrip = (tripId, cityData) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const newStop = {
      id: `stop-${Date.now()}`,
      cityId: cityData.id,
      cityName: cityData.city,
      country: cityData.country,
      arrivalDate: trip.startDate,
      departureDate: trip.endDate,
      stayDays: 3,
      lodgingName: `${cityData.city} Grand Hotel`,
      lodgingCost: 350,
      transitMode: "Train / Flight",
      transitCost: 120,
      order: (trip.stops?.length || 0) + 1,
      activities: []
    };

    const updatedStops = [...(trip.stops || []), newStop];
    updateTrip(tripId, { stops: updatedStops });
    addToast("Stop Added", `Added ${cityData.city} to your itinerary.`, "success");
  };

  const removeStopFromTrip = (tripId, stopId) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    const updatedStops = trip.stops.filter(s => s.id !== stopId);
    updateTrip(tripId, { stops: updatedStops });
    addToast("Stop Removed", "Stop removed from itinerary.", "info");
  };

  const addActivityToStop = (tripId, stopId, activityData) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const newActivity = {
      id: `act-${Date.now()}`,
      title: activityData.title || "New Experience",
      category: activityData.category || "Sightseeing",
      cost: Number(activityData.cost) || 0,
      day: Number(activityData.day) || 1,
      time: activityData.time || "12:00",
      durationHours: Number(activityData.durationHours) || 2,
      notes: activityData.notes || ""
    };

    const updatedStops = trip.stops.map(stop => {
      if (stop.id === stopId) {
        return {
          ...stop,
          activities: [...(stop.activities || []), newActivity]
        };
      }
      return stop;
    });

    updateTrip(tripId, { stops: updatedStops });
    addToast("Activity Added! 📍", `Added "${newActivity.title}"`, "success");
  };

  const removeActivityFromStop = (tripId, stopId, activityId) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const updatedStops = trip.stops.map(stop => {
      if (stop.id === stopId) {
        return {
          ...stop,
          activities: (stop.activities || []).filter(a => a.id !== activityId)
        };
      }
      return stop;
    });

    updateTrip(tripId, { stops: updatedStops });
    addToast("Activity Removed", "Activity removed from day plan.", "info");
  };

  const reorderStops = (tripId, sourceIndex, destIndex) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const newStops = Array.from(trip.stops);
    const [moved] = newStops.splice(sourceIndex, 1);
    newStops.splice(destIndex, 0, moved);

    // Update order key
    const reindexed = newStops.map((s, idx) => ({ ...s, order: idx + 1 }));
    updateTrip(tripId, { stops: reindexed });
  };

  // Wishlist toggle
  const toggleWishlist = (destId) => {
    setUser(prev => {
      const currentWish = prev.wishlistDestinations || [];
      const exists = currentWish.includes(destId);
      const updated = exists ? currentWish.filter(id => id !== destId) : [...currentWish, destId];
      return { ...prev, wishlistDestinations: updated };
    });
  };

  // Active Trip Helper
  const activeTrip = trips.find(t => t.id === activeTripId) || trips[0];

  // Trip Budget Computed stats
  const computeTripFinances = (trip) => {
    if (!trip) return { totalEstimated: 0, lodging: 0, transit: 0, activities: 0, isOverBudget: false, remaining: 0 };
    
    let lodging = 0;
    let transit = 0;
    let activities = 0;

    trip.stops?.forEach(s => {
      lodging += Number(s.lodgingCost) || 0;
      transit += Number(s.transitCost) || 0;
      s.activities?.forEach(a => {
        activities += Number(a.cost) || 0;
      });
    });

    const food = (trip.foodBudget || 400);
    const totalEstimated = lodging + transit + activities + food;
    const target = trip.targetBudget || 2000;
    const isOverBudget = totalEstimated > target;
    const remaining = target - totalEstimated;

    return {
      totalEstimated,
      lodging,
      transit,
      activities,
      food,
      target,
      isOverBudget,
      remaining
    };
  };

  return (
    <AppContext.Provider value={{
      theme,
      setTheme,
      isAuthenticated,
      setIsAuthenticated,
      user,
      setUser,
      trips,
      activeTripId,
      setActiveTripId,
      activeTrip,
      currentView,
      setCurrentView,
      destinations: DESTINATIONS,
      presetActivities: PRESET_ACTIVITIES,
      adminStats: ADMIN_STATS,
      toasts,
      addToast,
      removeToast,
      formatCurrency,
      createTrip,
      updateTrip,
      deleteTrip,
      cloneTrip,
      addStopToTrip,
      removeStopFromTrip,
      addActivityToStop,
      removeActivityFromStop,
      reorderStops,
      toggleWishlist,
      computeTripFinances
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
