export const GUIDE_SPECIALIZATIONS = [
  "All Specializations",
  "Historical & Architecture",
  "Gastronomy & Wine Tasting",
  "Art & Museum VIP Access",
  "Secret Hidden Gems & Walking",
  "Adventure & Photography",
  "Nightlife & Cultural Stories"
];

export const GUIDE_LANGUAGES = [
  "All Languages",
  "English",
  "French",
  "Spanish",
  "Italian",
  "Japanese",
  "German",
  "Hindi",
  "Arabic"
];

export const TOUR_GUIDES_DATA = [
  // Paris
  {
    id: "guide-paris-1",
    cityId: "dest-paris",
    cityName: "Paris",
    name: "Éléonore Dupont",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    languages: ["English", "French", "Italian"],
    specialization: "Art & Museum VIP Access",
    experienceYears: 9,
    rating: 4.98,
    reviewsCount: 312,
    pricePerDay: 180,
    pricePerHour: 28,
    badges: ["Official National Louvre Curator", "SuperGuide 2026", "Art Historian PhD"],
    bio: "Former assistant curator at Musée d'Orsay. I reveal the hidden symbols inside the Louvre, Versailles, and private Montmartre artist lofts with zero queue waiting.",
    highlights: ["Skip-the-line VIP at Louvre", "Curated Impressionist Masterclass", "Private Marais Courtyards"],
    availableDurations: ["Half Day (4h)", "Full Day (8h)", "Sunset Special (3h)"]
  },
  {
    id: "guide-paris-2",
    cityId: "dest-paris",
    cityName: "Paris",
    name: "Chef Antoine Laurent",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    languages: ["English", "French", "Spanish"],
    specialization: "Gastronomy & Wine Tasting",
    experienceYears: 12,
    rating: 4.95,
    reviewsCount: 420,
    pricePerDay: 195,
    pricePerHour: 32,
    badges: ["Michelin-Trained Sommelier", "Top Foodie Choice", "Culinary Writer"],
    bio: "Passionate pastry chef and certified master sommelier. Join me for morning bakery secrets, artisan cheese cellars, and hidden natural wine bistros tourists never find.",
    highlights: ["Secret 17th-century Wine Cellar", "Artisan Fromagerie Pairings", "Hands-on Macaron Workshop"],
    availableDurations: ["Half Day (4h)", "Full Day (8h)"]
  },

  // Rome
  {
    id: "guide-rome-1",
    cityId: "dest-rome",
    cityName: "Rome",
    name: "Marco Bellini",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    languages: ["English", "Italian", "Spanish", "German"],
    specialization: "Historical & Architecture",
    experienceYears: 14,
    rating: 4.99,
    reviewsCount: 540,
    pricePerDay: 175,
    pricePerHour: 26,
    badges: ["Vatican & Colosseum Gold Badge", "Classical Archaeologist", "500+ 5-Star Reviews"],
    bio: "Born steps from the Roman Forum. I bring ancient gladiators, emperor conspiracies, and Renaissance architects vividly to life with exclusive underground Colosseum access.",
    highlights: ["Underground Colosseum Dungeon", "Private Sistine Chapel Dawn Tour", "Pantheon Engineering Secrets"],
    availableDurations: ["Half Day (4h)", "Full Day (8h)", "Sunset Special (3h)"]
  },
  {
    id: "guide-rome-2",
    cityId: "dest-rome",
    cityName: "Rome",
    name: "Giulia Romani",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    languages: ["English", "Italian"],
    specialization: "Secret Hidden Gems & Walking",
    experienceYears: 7,
    rating: 4.93,
    reviewsCount: 220,
    pricePerDay: 145,
    pricePerHour: 22,
    badges: ["Local Neighborhood Native", "Street Art Specialist"],
    bio: "Discover the authentic heartbeat of Rome: hidden courtyards in Trastevere, secret rooftop vistas, historic espresso bars, and cobblestone alleyway legends.",
    highlights: ["Trastevere Twilight Walk", "Keyhole of the Knights of Malta", "Historic Jewish Ghetto Recipes"],
    availableDurations: ["Half Day (4h)", "Sunset Special (3h)"]
  },

  // Barcelona
  {
    id: "guide-bcn-1",
    cityId: "dest-barcelona",
    cityName: "Barcelona",
    name: "Jordi Pujol & Clara",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    languages: ["English", "Spanish", "French", "Catalan"],
    specialization: "Historical & Architecture",
    experienceYears: 10,
    rating: 4.96,
    reviewsCount: 380,
    pricePerDay: 160,
    pricePerHour: 25,
    badges: ["Gaudí Foundation Certified", "Catalan Heritage Guide"],
    bio: "Architecture professors decoding Antoni Gaudí’s mind at Sagrada Família, Park Güell, and Casa Batlló, plus secret Gothic Quarter rooftop tapas.",
    highlights: ["Sagrada Família Fast-Pass", "Private Gaudí Rooftops", "Boqueria Market Private Chef Tour"],
    availableDurations: ["Half Day (4h)", "Full Day (8h)"]
  },

  // Tokyo
  {
    id: "guide-tokyo-1",
    cityId: "dest-tokyo",
    cityName: "Tokyo",
    name: "Kenji Takahashi",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
    languages: ["English", "Japanese"],
    specialization: "Nightlife & Cultural Stories",
    experienceYears: 8,
    rating: 4.97,
    reviewsCount: 460,
    pricePerDay: 190,
    pricePerHour: 30,
    badges: ["National Licensed Guide-Interpreter", "Shibuya & Shinjuku Insider"],
    bio: "Deep dive into Tokyo’s neon back-alleys, izakaya culture, hidden vinyl listening bars in Shibuya, and ancient Edo history in Yanaka.",
    highlights: ["Golden Gai Speakeasy Access", "Yanaka Edo Retro Walk", "TeamLab & Futuristic Akihabara"],
    availableDurations: ["Half Day (4h)", "Full Day (8h)", "Sunset Special (3h)"]
  },
  {
    id: "guide-tokyo-2",
    cityId: "dest-tokyo",
    cityName: "Tokyo",
    name: "Aoi Suzuki",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    languages: ["English", "Japanese", "French"],
    specialization: "Adventure & Photography",
    experienceYears: 6,
    rating: 4.94,
    reviewsCount: 290,
    pricePerDay: 165,
    pricePerHour: 25,
    badges: ["Professional Travel Photographer", "Instagram Spot Guru"],
    bio: "I guide you to Tokyo’s most breathtaking photogenic spots at the exact right lighting hours, capturing high-res portraits for your memories.",
    highlights: ["Photographer Escort", "Hidden Shibuya Crossing Rooftop", "Senso-ji Dawn Lantern Photos"],
    availableDurations: ["Half Day (4h)", "Sunset Special (3h)"]
  },

  // Dubai
  {
    id: "guide-dubai-1",
    cityId: "dest-dubai",
    cityName: "Dubai",
    name: "Ahmed Khan",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    languages: ["English", "Hindi", "Arabic", "Urdu"],
    specialization: "Historical & Architecture",
    experienceYears: 8,
    rating: 4.88,
    reviewsCount: 350,
    pricePerDay: 110,
    pricePerHour: 18,
    badges: ["DTCM Licensed Safari & City Guide", "Desert Master"],
    bio: "From historic Al Fahidi wind towers and gold souks to VIP Burj Khalifa views and private desert dune storytelling beneath the starlit Arabian sky.",
    highlights: ["Old Dubai Abra Boat & Spice Souk", "Private 4x4 Desert Camp", "Burj Khalifa VIP Secrets"],
    availableDurations: ["Half Day (4h)", "Full Day (8h)", "Sunset Special (3h)"]
  },

  // Bali
  {
    id: "guide-bali-1",
    cityId: "dest-bali",
    cityName: "Bali",
    name: "Wayan Sudarta",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80",
    languages: ["English", "Indonesian"],
    specialization: "Adventure & Photography",
    experienceYears: 11,
    rating: 4.98,
    reviewsCount: 680,
    pricePerDay: 55,
    pricePerHour: 10,
    badges: ["Native Ubud Cultural Elder", "Mount Batur Rescue Leader"],
    bio: "Born in a traditional Balinese temple compound. I take you to secret jungle waterfalls with no tourists, sunrise volcano ridges, and holy water cleansing ceremonies.",
    highlights: ["Hidden Tibumana Waterfall Trek", "Private Water Blessing Ceremony", "Jatiluwih UNESCO Rice Terrace Hike"],
    availableDurations: ["Half Day (4h)", "Full Day (8h)"]
  }
];
