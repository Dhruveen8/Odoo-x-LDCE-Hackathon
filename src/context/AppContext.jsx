import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USER, INITIAL_TRIPS, ADMIN_STATS } from '../data/initialData';
import { DESTINATIONS, PRESET_ACTIVITIES } from '../data/destinations';
import { VEHICLES_DATA, VEHICLE_TYPES, TRANSMISSION_TYPES, FUEL_TYPES, SEAT_OPTIONS } from '../data/vehicleData';
import { TOUR_GUIDES_DATA, GUIDE_SPECIALIZATIONS, GUIDE_LANGUAGES } from '../data/tourGuideData';

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
    const saved = localStorage.getItem('gt_trips_v2');
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });

  useEffect(() => {
    localStorage.setItem('gt_trips_v2', JSON.stringify(trips));
  }, [trips]);

  // Active view navigation
  const [currentView, setCurrentView] = useState('landing');
  const [activeTripId, setActiveTripId] = useState('trip-grand-europe');

  // Selected stop context for cross-navigation to vehicle/guide explorers
  const [selectedStopContext, setSelectedStopContext] = useState(null);

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
      targetBudget: Number(newTripData.targetBudget) || 2500,
      transportBudget: Number(newTripData.transportBudget) || 500,
      lodgingBudget: Number(newTripData.lodgingBudget) || 800,
      foodBudget: Number(newTripData.foodBudget) || 400,
      activitiesBudget: Number(newTripData.activitiesBudget) || 300,
      vehiclesBudget: Number(newTripData.vehiclesBudget) || 300,
      guidesBudget: Number(newTripData.guidesBudget) || 200,
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

  // Stops Management
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
      activities: [],
      vehicleRentals: [],
      guideBookings: []
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

  const updateStopDetails = (tripId, stopId, fields) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const updatedStops = trip.stops.map(stop => {
      if (stop.id === stopId) {
        return { ...stop, ...fields };
      }
      return stop;
    });

    updateTrip(tripId, { stops: updatedStops });
  };

  // Activities Management
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

  // ═══════════════════════════════════════════════
  // Vehicle Rental Management
  // ═══════════════════════════════════════════════
  const addVehicleRentalToStop = (tripId, stopId, rentalData) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const rentalDays = Math.max(1, Number(rentalData.rentalDays) || 1);
    const dailyRate = Number(rentalData.dailyRate) || 0;
    const totalCost = Number(rentalData.totalCost) || (dailyRate * rentalDays);

    const newRental = {
      id: `v-rent-${Date.now()}`,
      vehicleId: rentalData.vehicleId || `veh-${Date.now()}`,
      name: rentalData.name || "Rental Vehicle",
      model: rentalData.model || "Standard",
      type: rentalData.type || "SUV",
      seats: Number(rentalData.seats) || 5,
      transmission: rentalData.transmission || "Automatic",
      fuelType: rentalData.fuelType || "Petrol",
      provider: rentalData.provider || "Local Rental Partner",
      rating: rentalData.rating || 4.8,
      image: rentalData.image || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
      startDate: rentalData.startDate || trip.startDate,
      endDate: rentalData.endDate || trip.endDate,
      rentalDays,
      dailyRate,
      totalCost
    };

    const updatedStops = trip.stops.map(stop => {
      if (stop.id === stopId) {
        return {
          ...stop,
          vehicleRentals: [...(stop.vehicleRentals || []), newRental]
        };
      }
      return stop;
    });

    updateTrip(tripId, { stops: updatedStops });
    addToast("Vehicle Added! 🚗", `Reserved ${newRental.name} (${formatCurrency(totalCost)})`, "success");
  };

  const removeVehicleRentalFromStop = (tripId, stopId, rentalId) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const updatedStops = trip.stops.map(stop => {
      if (stop.id === stopId) {
        return {
          ...stop,
          vehicleRentals: (stop.vehicleRentals || []).filter(v => v.id !== rentalId)
        };
      }
      return stop;
    });

    updateTrip(tripId, { stops: updatedStops });
    addToast("Rental Removed", "Vehicle rental removed from stop.", "info");
  };

  const updateVehicleRental = (tripId, stopId, rentalId, updatedData) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const updatedStops = trip.stops.map(stop => {
      if (stop.id === stopId) {
        return {
          ...stop,
          vehicleRentals: (stop.vehicleRentals || []).map(v => v.id === rentalId ? { ...v, ...updatedData } : v)
        };
      }
      return stop;
    });

    updateTrip(tripId, { stops: updatedStops });
    addToast("Rental Updated", "Vehicle reservation details updated.", "success");
  };

  // ═══════════════════════════════════════════════
  // Tour Guide Management
  // ═══════════════════════════════════════════════
  const addGuideBookingToStop = (tripId, stopId, bookingData) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const rate = Number(bookingData.rate) || 0;
    const totalCost = Number(bookingData.totalCost) || rate;

    const newBooking = {
      id: `g-book-${Date.now()}`,
      guideId: bookingData.guideId || `guide-${Date.now()}`,
      name: bookingData.name || "Local Tour Guide",
      avatar: bookingData.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      specialization: bookingData.specialization || "Historical & Architecture",
      languages: bookingData.languages || ["English"],
      rating: bookingData.rating || 4.9,
      date: bookingData.date || trip.startDate,
      duration: bookingData.duration || "Full Day (8h)",
      rate,
      totalCost,
      notes: bookingData.notes || "Private local guided experience"
    };

    const updatedStops = trip.stops.map(stop => {
      if (stop.id === stopId) {
        return {
          ...stop,
          guideBookings: [...(stop.guideBookings || []), newBooking]
        };
      }
      return stop;
    });

    updateTrip(tripId, { stops: updatedStops });
    addToast("Guide Booked! 🧭", `Booked ${newBooking.name} (${formatCurrency(totalCost)})`, "success");
  };

  const removeGuideBookingFromStop = (tripId, stopId, bookingId) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const updatedStops = trip.stops.map(stop => {
      if (stop.id === stopId) {
        return {
          ...stop,
          guideBookings: (stop.guideBookings || []).filter(g => g.id !== bookingId)
        };
      }
      return stop;
    });

    updateTrip(tripId, { stops: updatedStops });
    addToast("Guide Booking Removed", "Tour guide booking removed from stop.", "info");
  };

  const updateGuideBooking = (tripId, stopId, bookingId, updatedData) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const updatedStops = trip.stops.map(stop => {
      if (stop.id === stopId) {
        return {
          ...stop,
          guideBookings: (stop.guideBookings || []).map(g => g.id === bookingId ? { ...g, ...updatedData } : g)
        };
      }
      return stop;
    });

    updateTrip(tripId, { stops: updatedStops });
    addToast("Guide Booking Updated", "Guide appointment details updated.", "success");
  };

  const reorderStops = (tripId, sourceIndex, destIndex) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const newStops = Array.from(trip.stops);
    const [moved] = newStops.splice(sourceIndex, 1);
    newStops.splice(destIndex, 0, moved);

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

  // ═══════════════════════════════════════════════
  // 6-Category Trip Budget Engine
  // ═══════════════════════════════════════════════
  const computeTripFinances = (trip) => {
    if (!trip) {
      return {
        totalEstimated: 0,
        lodging: 0,
        transit: 0,
        activities: 0,
        food: 0,
        vehicleRentals: 0,
        tourGuides: 0,
        target: 2000,
        isOverBudget: false,
        remaining: 2000
      };
    }
    
    let lodging = 0;
    let transit = 0;
    let activities = 0;
    let vehicleRentals = 0;
    let tourGuides = 0;

    trip.stops?.forEach(s => {
      lodging += Number(s.lodgingCost) || 0;
      transit += Number(s.transitCost) || 0;
      
      s.activities?.forEach(a => {
        activities += Number(a.cost) || 0;
      });

      s.vehicleRentals?.forEach(v => {
        vehicleRentals += Number(v.totalCost) || (Number(v.dailyRate || 0) * Number(v.rentalDays || 1));
      });

      s.guideBookings?.forEach(g => {
        tourGuides += Number(g.totalCost) || Number(g.rate || 0);
      });
    });

    const food = Number(trip.foodBudget) || 400;
    const totalEstimated = lodging + transit + activities + food + vehicleRentals + tourGuides;
    const target = Number(trip.targetBudget) || 3000;
    const isOverBudget = totalEstimated > target;
    const remaining = target - totalEstimated;

    return {
      totalEstimated,
      lodging,
      transit,
      activities,
      food,
      vehicleRentals,
      tourGuides,
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
      selectedStopContext,
      setSelectedStopContext,
      currentView,
      setCurrentView,
      destinations: DESTINATIONS,
      presetActivities: PRESET_ACTIVITIES,
      vehiclesData: VEHICLES_DATA,
      vehicleTypes: VEHICLE_TYPES,
      transmissionTypes: TRANSMISSION_TYPES,
      fuelTypes: FUEL_TYPES,
      seatOptions: SEAT_OPTIONS,
      tourGuidesData: TOUR_GUIDES_DATA,
      guideSpecializations: GUIDE_SPECIALIZATIONS,
      guideLanguages: GUIDE_LANGUAGES,
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
      updateStopDetails,
      addActivityToStop,
      removeActivityFromStop,
      addVehicleRentalToStop,
      removeVehicleRentalFromStop,
      updateVehicleRental,
      addGuideBookingToStop,
      removeGuideBookingFromStop,
      updateGuideBooking,
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
