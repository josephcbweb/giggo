"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin } from "lucide-react";
import { IoIosClose } from "react-icons/io";
import { motion } from "framer-motion";
import { useDebounce } from "use-debounce";

interface Gig {
  _id: string;
  title: string;
  description: string;
  category: { name: string; _id: string };
  pay: number;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  duration: string;
  imageLink?: string;
  isActive: boolean;
  distance?: number;
}

interface LocationSuggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

interface ListingsProps {
  filters: {
    payMin: number;
    payMax: number;
    duration: string;
    radius: number;
    categories: { [key: string]: boolean };
  };
  selectedLocation: {
    address: string;
    coordinates?: { lat: number; lng: number };
  } | null;
  setSelectedLocation: React.Dispatch<
    React.SetStateAction<{
      address: string;
      coordinates?: { lat: number; lng: number };
    } | null>
  >;
  userLocation?: {
    address?: string;
    coordinates?: { lat: number; lng: number };
  };
  initialData?: Gig[];
}

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const deg2rad = (deg: number): number => deg * (Math.PI / 180);

const Listings: React.FC<ListingsProps> = ({
  filters,
  selectedLocation,
  setSelectedLocation,
  userLocation,
  initialData,
}) => {
  const [allGigs, setAllGigs] = useState<Gig[]>(initialData || []);
  const [gigs, setGigs] = useState<Gig[]>(initialData || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [locationQuery, setLocationQuery] = useState("");
  const [debouncedLocationQuery] = useDebounce(locationQuery, 500);
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);

  // Fetch all gigs
  useEffect(() => {
    setLoading(true);
    const fetchGigs = async () => {
      try {
        const response = await fetch("/api/gigs");
        if (!response.ok) throw new Error("Failed to fetch gigs.");
        let data = await response.json();
        data = data.filter((gig: Gig) => gig.isActive);
        setAllGigs(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching gigs:", err);
        setLoading(false);
      }
    };
    fetchGigs();
  }, [initialData]);

  // Set initial location from user profile
  useEffect(() => {
    if (userLocation?.address && !selectedLocation) {
      setSelectedLocation({
        address: userLocation.address,
        coordinates: userLocation.coordinates,
      });
      setLocationQuery(userLocation.address);
    }
  }, [userLocation, selectedLocation, setSelectedLocation]);

  // Fetch location suggestions
  useEffect(() => {
    if (debouncedLocationQuery.length > 2) {
      fetchLocationSuggestions(debouncedLocationQuery);
    } else {
      setLocationSuggestions([]);
    }
  }, [debouncedLocationQuery]);

  const fetchLocationSuggestions = async (query: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`
      );
      const data = await response.json();
      setLocationSuggestions(data);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setSelectedLocation({
      address: suggestion.display_name,
      coordinates: {
        lat: parseFloat(suggestion.lat),
        lng: parseFloat(suggestion.lon),
      },
    });
    setLocationQuery(suggestion.display_name);
    setShowLocationSuggestions(false);
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...allGigs];

    // Calculate distances if location is selected
    if (selectedLocation?.coordinates) {
      filtered = filtered.map((gig) => {
        if (gig.location.coordinates) {
          const distance = calculateDistance(
            selectedLocation?.coordinates?.lat ?? 0,
            selectedLocation?.coordinates?.lng ?? 0,
            gig.location.coordinates.lat,
            gig.location.coordinates.lng
          );
          return { ...gig, distance };
        }
        return gig;
      });
    }

    // Apply filters
    filtered = filtered.filter((gig) => {
      // Pay range filter
      const minPay = filters.payMin || 0;
      const maxPay = filters.payMax || Number.MAX_VALUE;
      if (gig.pay < minPay || gig.pay > maxPay) return false;

      // Category filter
      const selectedCategories = Object.entries(filters.categories)
        .filter(([_, isSelected]) => isSelected)
        .map(([cat]) => cat);

      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(gig.category._id)
      ) {
        return false;
      }

      // Duration filter
      if (filters.duration && gig.duration !== filters.duration) return false;

      // Radius filter (only if location is selected)
      if (selectedLocation?.coordinates && gig.location.coordinates) {
        if (gig.distance && gig.distance > filters.radius) return false;
      }

      // Search term filter
      if (
        searchTerm &&
        !gig.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !gig.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !gig.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

    // Sort by distance if location is selected
    if (selectedLocation?.coordinates) {
      filtered.sort((a, b) => {
        if (a.distance !== undefined && b.distance === undefined) return -1;
        if (a.distance === undefined && b.distance !== undefined) return 1;
        if (a.distance === undefined && b.distance === undefined) return 0;
        return (a.distance || 0) - (b.distance || 0);
      });
    }

    setGigs(filtered);
  }, [filters, searchTerm, allGigs, selectedLocation]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="flex space-x-2"
            animate={{
              scale: [1, 1.1, 1],
              transition: {
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              },
            }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-4 h-4 bg-green-500 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
          <motion.p
            className="mt-4 text-gray-600 font-medium"
            initial={{ y: 10, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { delay: 0.3 },
            }}
          >
            Loading gigs...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="sticky top-0 bg-white mb-4 p-4 border-b-2 border-green-400">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search gigs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search
                className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
              {searchTerm && (
                <button
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 text-background-white"
                  onClick={() => setSearchTerm("")}
                >
                  <IoIosClose size={20} />
                </button>
              )}
            </div>

            <div className="relative flex-1">
              <div className="relative">
                <input
                  ref={locationInputRef}
                  type="text"
                  placeholder={userLocation?.address || "Search location..."}
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setShowLocationSuggestions(true);
                  }}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowLocationSuggestions(false), 200)
                  }
                  className="w-full py-2 pl-10 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <MapPin
                  className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500"
                  size={20}
                />
                {locationQuery && (
                  <button
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 "
                    onClick={() => {
                      setLocationQuery("");
                      setSelectedLocation(null);
                    }}
                  >
                    <IoIosClose size={20} />
                  </button>
                )}
              </div>

              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {locationSuggestions.map((suggestion) => (
                    <motion.li
                      key={suggestion.place_id}
                      whileHover={{ backgroundColor: "#f0fdf4" }}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-green-50 z-50"
                      onMouseDown={() => handleLocationSelect(suggestion)}
                    >
                      {suggestion.display_name}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>
          </div>
        </div>

        {selectedLocation && (
          <div className="mt-2 text-sm text-gray-600">
            Showing results near:{" "}
            <span className="font-medium">
              {selectedLocation.address.split(" ")[0].replace(",", "")}
            </span>
          </div>
        )}
        {!selectedLocation && (
          <div className="mt-2 text-sm text-slate-600">
            No location selected - showing all results
          </div>
        )}
      </div>

      {gigs.length > 0 ? (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {gigs.map((gig) => (
            <Link key={gig._id} href={`/gigs/${gig._id}`}>
              <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-[330px] flex flex-col justify-between relative -z-20">
                <div className="relative h-[120px] w-full">
                  <Image
                    src={gig.imageLink || "/logo-white-bg.png"}
                    alt={gig.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-xl mb-1 truncate">
                    {gig.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {gig.description.slice(0, 80)}...
                  </p>
                </div>
                <div className="flex justify-between items-center p-4">
                  <div className="flex flex-col">
                    <span className="text-gray-500 truncate">
                      {gig.category.name}
                    </span>
                    {gig.distance !== undefined && (
                      <span className="text-xs text-gray-400">
                        {gig.distance.toFixed(1)} km away
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-green-600">
                    {gig.pay}₹/hr
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60%] px-6">
          <Image
            src="/dashboard/no-search.gif"
            alt="No Results"
            width={380}
            height={380}
            className=""
          />
          <p className="text-lg text-gray-500 text-center">
            {selectedLocation
              ? `No gigs found near ${selectedLocation.address
                  .split(" ")[0]
                  .replace(",", "")}. Try adjusting your filters.`
              : "No gigs match your search or filters. Try adjusting them to explore more!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Listings;
