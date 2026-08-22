export const INITIAL_USER = {
  id: "user-1",
  name: "Alex Morgan",
  email: "alex.morgan@globetrotter.io",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  bio: "Architect & slow traveler. Obsessed with coffee shops, train journeys, and brutalist architecture.",
  homeCurrency: "USD",
  travelStyle: "Experiential & Cultural",
  budgetPreference: "Balanced ($$)",
  language: "English (US)",
  tripsCount: 3,
  visitedCountries: 14,
  daysPlanned: 24,
  wishlistDestinations: ["dest-kyoto", "dest-reykjavik", "dest-capetown"]
};

export const INITIAL_TRIPS = [
  {
    id: "trip-grand-europe",
    title: "Grand Mediterranean Odyssey",
    description: "A 10-day scenic journey through ancient ruins, romantic boulevards, and coastal tapas in Paris, Rome, and Barcelona.",
    coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    startDate: "2026-09-12",
    endDate: "2026-09-22",
    status: "Upcoming",
    targetBudget: 3200,
    transportBudget: 750,
    lodgingBudget: 1200,
    foodBudget: 650,
    activitiesBudget: 600,
    isPublic: true,
    shareSlug: "grand-mediterranean-odyssey-2026",
    likesCount: 142,
    stops: [
      {
        id: "stop-paris",
        cityId: "dest-paris",
        cityName: "Paris",
        country: "France",
        arrivalDate: "2026-09-12",
        departureDate: "2026-09-15",
        stayDays: 3,
        lodgingName: "Le Marais Boutique Suites",
        lodgingCost: 450,
        transitMode: "Flight / Metro",
        transitCost: 280,
        order: 1,
        activities: [
          {
            id: "act-1",
            title: "Eiffel Tower Summit & Champagne",
            category: "Sightseeing",
            cost: 42,
            day: 1,
            time: "17:30",
            durationHours: 2.5,
            notes: "Sunset tickets booked! Bring jacket."
          },
          {
            id: "act-2",
            title: "Louvre Museum Masterpieces",
            category: "Culture & Art",
            cost: 55,
            day: 2,
            time: "09:30",
            durationHours: 3,
            notes: "Meet guide at Pyramide du Louvre."
          },
          {
            id: "act-3",
            title: "Montmartre Pastry & Coffee Walk",
            category: "Food & Dining",
            cost: 48,
            day: 3,
            time: "14:00",
            durationHours: 2.5,
            notes: "Try the pistachio choux!"
          }
        ]
      },
      {
        id: "stop-rome",
        cityId: "dest-rome",
        cityName: "Rome",
        country: "Italy",
        arrivalDate: "2026-09-15",
        departureDate: "2026-09-18",
        stayDays: 3,
        lodgingName: "Navona Heritage Loft",
        lodgingCost: 390,
        transitMode: "High Speed Rail / Flight",
        transitCost: 190,
        order: 2,
        activities: [
          {
            id: "act-4",
            title: "Colosseum & Roman Forum Tour",
            category: "Sightseeing",
            cost: 50,
            day: 4,
            time: "10:00",
            durationHours: 3.5,
            notes: "Gladiator floor access confirmed."
          },
          {
            id: "act-5",
            title: "Trastevere Pasta Making & Wine",
            category: "Food & Dining",
            cost: 58,
            day: 5,
            time: "18:30",
            durationHours: 3,
            notes: "Chef Luca's private rooftop studio."
          }
        ]
      },
      {
        id: "stop-bcn",
        cityId: "dest-barcelona",
        cityName: "Barcelona",
        country: "Spain",
        arrivalDate: "2026-09-18",
        departureDate: "2026-09-22",
        stayDays: 4,
        lodgingName: "Eixample Modernist Hotel",
        lodgingCost: 480,
        transitMode: "Short Flight",
        transitCost: 140,
        order: 3,
        activities: [
          {
            id: "act-6",
            title: "Sagrada Família & Park Güell",
            category: "Culture & Art",
            cost: 40,
            day: 7,
            time: "11:00",
            durationHours: 3,
            notes: "Audio guide included."
          },
          {
            id: "act-7",
            title: "Barceloneta Sunset Paddleboarding",
            category: "Adventure & Nature",
            cost: 35,
            day: 8,
            time: "17:00",
            durationHours: 2,
            notes: "Rental at Surf House Barcelona."
          },
          {
            id: "act-8",
            title: "Gothic Quarter Tapas & Flamenco",
            category: "Food & Dining",
            cost: 52,
            day: 9,
            time: "20:00",
            durationHours: 3,
            notes: "Live flamenco in historic patio."
          }
        ]
      }
    ]
  },
  {
    id: "trip-japan-neon",
    title: "Japan: Neon Lights & Zen Temples",
    description: "Contrasting the high-energy cyber streets of Tokyo with the timeless bamboo groves and golden shrines of Kyoto.",
    coverImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    startDate: "2026-11-04",
    endDate: "2026-11-12",
    status: "Upcoming",
    targetBudget: 2800,
    transportBudget: 600,
    lodgingBudget: 950,
    foodBudget: 600,
    activitiesBudget: 500,
    isPublic: true,
    shareSlug: "japan-neon-zen-2026",
    likesCount: 89,
    stops: [
      {
        id: "stop-tok",
        cityId: "dest-tokyo",
        cityName: "Tokyo",
        country: "Japan",
        arrivalDate: "2026-11-04",
        departureDate: "2026-11-08",
        stayDays: 4,
        lodgingName: "Shinjuku Granbell Designer Hotel",
        lodgingCost: 520,
        transitMode: "Flight + Narita Express",
        transitCost: 350,
        order: 1,
        activities: [
          {
            id: "act-tok-1",
            title: "Tsukiji Food Market Tasting",
            category: "Food & Dining",
            cost: 45,
            day: 1,
            time: "08:30",
            durationHours: 3,
            notes: "Fresh sashimi breakfast."
          },
          {
            id: "act-tok-2",
            title: "Shibuya Sky Sunset Vista",
            category: "Sightseeing",
            cost: 25,
            day: 2,
            time: "17:00",
            durationHours: 2,
            notes: "Arrive 30 mins early for golden hour."
          },
          {
            id: "act-tok-4",
            title: "teamLab Borderless Interactive Art",
            category: "Culture & Art",
            cost: 38,
            day: 3,
            time: "13:00",
            durationHours: 3,
            notes: "Wear comfortable dark clothing for reflections."
          }
        ]
      },
      {
        id: "stop-kyo",
        cityId: "dest-kyoto",
        cityName: "Kyoto",
        country: "Japan",
        arrivalDate: "2026-11-08",
        departureDate: "2026-11-12",
        stayDays: 4,
        lodgingName: "Gion Machiya Traditional Ryokan",
        lodgingCost: 480,
        transitMode: "Shinkansen Bullet Train",
        transitCost: 110,
        order: 2,
        activities: [
          {
            id: "act-kyo-1",
            title: "Fushimi Inari Early Morning Hike",
            category: "Adventure & Nature",
            cost: 0,
            day: 5,
            time: "06:30",
            durationHours: 3,
            notes: "Hike past the summit to avoid tourist crowds."
          },
          {
            id: "act-kyo-2",
            title: "Traditional Matcha Tea Ceremony in Gion",
            category: "Culture & Art",
            cost: 35,
            day: 6,
            time: "15:00",
            durationHours: 1.5,
            notes: "Kimono rental optional."
          }
        ]
      }
    ]
  },
  {
    id: "trip-bali-retreat",
    title: "Bali Tropical Wellness & Surf Escape",
    description: "Yoga retreats in Ubud's lush jungles followed by ocean sunset sessions and cliffside temple ceremonies in Uluwatu.",
    coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    startDate: "2026-06-15",
    endDate: "2026-06-22",
    status: "Completed",
    targetBudget: 1400,
    transportBudget: 350,
    lodgingBudget: 450,
    foodBudget: 300,
    activitiesBudget: 250,
    isPublic: true,
    shareSlug: "bali-tropical-wellness-2026",
    likesCount: 215,
    stops: [
      {
        id: "stop-bali-ubud",
        cityId: "dest-bali",
        cityName: "Bali",
        country: "Indonesia",
        arrivalDate: "2026-06-15",
        departureDate: "2026-06-22",
        stayDays: 7,
        lodgingName: "Ubud Bamboo Eco Sanctuary",
        lodgingCost: 420,
        transitMode: "Private Driver",
        transitCost: 80,
        order: 1,
        activities: [
          {
            id: "act-bal-1",
            title: "Mount Batur Sunrise Volcano Trek",
            category: "Adventure & Nature",
            cost: 45,
            day: 2,
            time: "03:30",
            durationHours: 6,
            notes: "Hotel pickup at 3:00 AM."
          },
          {
            id: "act-bal-2",
            title: "Uluwatu Cliffside Kecak Fire Dance",
            category: "Culture & Art",
            cost: 22,
            day: 4,
            time: "18:00",
            durationHours: 2.5,
            notes: "Watch sunset over Indian Ocean."
          }
        ]
      }
    ]
  }
];

export const ADMIN_STATS = {
  totalTrips: 18420,
  activeUsers: 8930,
  destinationsCovered: 148,
  averageBudgetSaved: "$340",
  monthlyTripsGrowth: [
    { month: "Jan", count: 850 },
    { month: "Feb", count: 980 },
    { month: "Mar", count: 1240 },
    { month: "Apr", count: 1560 },
    { month: "May", count: 2100 },
    { month: "Jun", count: 2680 },
    { month: "Jul", count: 3150 },
    { month: "Aug", count: 3420 }
  ],
  popularCities: [
    { city: "Tokyo", count: 4230, percentage: 88, color: "#6366f1" },
    { city: "Paris", count: 3950, percentage: 82, color: "#ec4899" },
    { city: "Rome", count: 3410, percentage: 74, color: "#f59e0b" },
    { city: "Bali", count: 3120, percentage: 69, color: "#10b981" },
    { city: "Barcelona", count: 2890, percentage: 64, color: "#8b5cf6" },
    { city: "Kyoto", count: 2450, percentage: 55, color: "#06b6d4" }
  ],
  categoryBreakdown: [
    { name: "Culture & Art", value: 34, color: "#6366f1" },
    { name: "Sightseeing", value: 28, color: "#06b6d4" },
    { name: "Food & Dining", value: 22, color: "#10b981" },
    { name: "Adventure & Nature", value: 16, color: "#f59e0b" }
  ]
};
