"use client";
import { useEffect, useState, useRef } from "react";
import {
  CheckCircle,
  Briefcase,
  MapPin,
  Clock,
  Tag,
  Info,
  LucideIndianRupee,
  Image,
  Calendar,
  ArrowLeft,
  AlertCircle,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";

interface Category {
  _id: string;
  name: string;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  pay: string;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    placeId?: string;
  };
  duration: string;
  category: Category;
  imageLink: string;
  startDate: string;
}

interface LocationSuggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

export default function GigEdit({ gigId }: { gigId: string }) {
  const router = useRouter();
  const locationInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pay, setPay] = useState("");
  const [location, setLocation] = useState({
    address: "",
    coordinates: { lat: 0, lng: 0 },
    placeId: "",
  });
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [imageLink, setImageLink] = useState("");
  const [startDate, setStartDate] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    category?: string;
    duration?: string;
    startDate?: string;
  }>({});
  const [loadError, setLoadError] = useState<string | null>(null);

  // Location suggestions state
  const [locationQuery, setLocationQuery] = useState("");
  const [debouncedQuery] = useDebounce(locationQuery, 500);
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchGigDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/gigs/${gigId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch gig details");
        }
        const data: Job = await response.json();

        setTitle(data.title);
        setDescription(data.description);
        setPay(data.pay);
        setLocation({
          address: data.location.address,
          coordinates: data.location.coordinates || { lat: 0, lng: 0 },
          placeId: data.location.placeId || "",
        });
        setLocationQuery(data.location.address);
        setDuration(data.duration);
        setCategory(data.category);
        setImageLink(data.imageLink);

        // Format date to YYYY-MM-DD for input field
        if (data.startDate) {
          const formattedDate = new Date(data.startDate)
            .toISOString()
            .split("T")[0];
          setStartDate(formattedDate);
        }

        if (data.imageLink) {
          setImagePreview(true);
        }
      } catch (error) {
        console.error("Failed to fetch gig details:", error);
        setLoadError("Failed to load gig details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    Promise.all([fetchCategories(), fetchGigDetails()]);
  }, [gigId]);

  // Fetch location suggestions
  useEffect(() => {
    if (debouncedQuery.length > 2) {
      fetchLocationSuggestions(debouncedQuery);
    } else {
      setLocationSuggestions([]);
    }
  }, [debouncedQuery]);

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
    setLocation({
      address: String(suggestion.display_name),
      coordinates: {
        lat: parseFloat(String(suggestion.lat)),
        lng: parseFloat(String(suggestion.lon)),
      },
      placeId: String(suggestion.place_id),
    });
    setLocationQuery(suggestion.display_name);
    setShowSuggestions(false);
    locationInputRef.current?.focus();
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: { category?: string; duration?: string; startDate?: string } =
      {};

    if (!category) {
      errors.category = "Please select a category.";
    }
    if (!duration) {
      errors.duration = "Please select a duration.";
    }
    if (!startDate) {
      errors.startDate = "Please select a start date.";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const jobData = {
      title,
      description,
      pay,
      location,
      duration,
      category: category ? category._id : "",
      imageLink,
      startDate,
    };

    try {
      const response = await fetch(`/api/gigs/${gigId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        const errorData = await response.json();
        setSubmitError(
          errorData.message || "Failed to update gig. Please try again."
        );
      }
    } catch (error) {
      console.error("Request failed", error);
      setSubmitError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidImageUrl = (url: string): boolean => {
    return url.startsWith("https://");
  };

  if (isLoading) {
    return (
      <div
        className="mt-8 w-full px-4 sm:px-6 md:px-8 mx-auto flex justify-center items-center"
        style={{ minHeight: "60vh" }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin h-12 w-12 mb-4 border-4 border-t-cyan-600 border-r-cyan-600 border-b-green-500 border-l-green-500 rounded-full mx-auto"></div>
          <p className="text-gray-600">Loading gig details...</p>
        </motion.div>
      </div>
    );
  }

  if (loadError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 w-full px-4 sm:px-6 md:px-8 mx-auto max-w-2xl bg-red-50 rounded-lg shadow-md p-6 border border-red-200"
      >
        <div className="flex items-center text-red-600 mb-4">
          <AlertCircle className="mr-2" size={24} />
          <h2 className="text-xl font-semibold">Error</h2>
        </div>
        <p className="text-gray-700 mb-4">{loadError}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 font-medium transition duration-200 flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Go Back
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-8 w-full px-4 sm:px-6 md:px-8 mx-auto"
    >
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        {submitSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <CheckCircle size={64} className="text-green-500 mb-4" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Gig Updated Successfully!
            </h2>
            <p className="text-gray-600">
              Your changes have been saved. Redirecting to dashboard...
            </p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-cyan-600 to-green-500 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ x: -2 }}
                  type="button"
                  onClick={() => router.back()}
                  className="text-white/90 hover:text-white flex items-center transition duration-200"
                >
                  <ArrowLeft size={20} className="mr-1" />
                  <span className="text-sm">Back</span>
                </motion.button>
                <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
                  <Briefcase className="mr-2 hidden sm:inline" size={28} />
                  Edit Gig
                </h2>
                <div className="w-20"></div> {/* Spacer for centering */}
              </div>
              <p className="text-white/90 mt-2 text-sm sm:text-base text-center">
                Update your gig details to ensure you find the best candidates.
              </p>
            </div>

            <AnimatePresence>
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 my-4 mx-4 sm:mx-6"
                >
                  <div className="flex items-center">
                    <AlertCircle size={20} className="text-red-500 mr-2" />
                    <p className="text-red-700 font-medium">{submitError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Briefcase className="mr-2 text-cyan-600" size={16} />
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
                      placeholder="e.g., Cleaning Staffs for XYZ event"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full h-48 px-3 sm:px-4 py-2 sm:py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
                      rows={4}
                      placeholder="Describe the job responsibilities, requirements, and benefits"
                      required
                    ></textarea>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Image className="mr-2 text-cyan-600" size={16} />
                      Image Link
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={imageLink}
                        onChange={(e) => setImageLink(e.target.value)}
                        onBlur={() => {
                          if (imageLink && isValidImageUrl(imageLink)) {
                            setImagePreview(true);
                          }
                        }}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (imageLink.trim() === "") return;
                          setImagePreview(!imagePreview);
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs text-cyan-600 hover:text-cyan-700 bg-white hover:bg-gray-50 rounded border border-cyan-200 focus:outline-none transition duration-200"
                      >
                        {imageLink.trim() !== "" &&
                          (imagePreview ? "Hide" : "Preview")}
                      </button>
                    </div>

                    {imagePreview && imageLink && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2 rounded-md overflow-hidden border border-gray-200"
                      >
                        <div className="relative bg-gray-100 w-full aspect-video flex items-center justify-center">
                          {isValidImageUrl(imageLink) ? (
                            <img
                              src={imageLink}
                              alt="Job preview"
                              className="max-h-full max-w-full object-contain"
                              onError={() => {
                                setImagePreview(false);
                              }}
                            />
                          ) : (
                            <div className="text-gray-500 text-sm">
                              Invalid image URL format
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Add an image to better showcase the job opportunity (JPEG,
                      PNG, GIF formats)
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <LucideIndianRupee
                          className="mr-2 text-green-600"
                          size={16}
                        />
                        Pay Rate / Hr
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">₹</span>
                        </div>
                        <input
                          type="number"
                          value={pay}
                          onChange={(e) => setPay(e.target.value)}
                          className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
                          placeholder="e.g. 25"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="relative"
                    >
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <MapPin className="mr-2 text-cyan-600" size={16} />
                        Location
                      </label>
                      <div className="relative">
                        <input
                          ref={locationInputRef}
                          type="text"
                          value={locationQuery}
                          onChange={(e) => {
                            setLocationQuery(e.target.value);
                            setShowSuggestions(true);
                          }}
                          onFocus={() => setShowSuggestions(true)}
                          onBlur={() =>
                            setTimeout(() => setShowSuggestions(false), 200)
                          }
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
                          placeholder="e.g. Kochi or Remote"
                          required
                        />
                        {locationQuery && (
                          <button
                            type="button"
                            onClick={() => {
                              setLocationQuery("");
                              setLocation({
                                address: "",
                                coordinates: { lat: 0, lng: 0 },
                                placeId: "",
                              });
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {showSuggestions && locationSuggestions.length > 0 && (
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
                                className="px-3 py-2 text-sm cursor-pointer hover:bg-green-50"
                                onMouseDown={() =>
                                  handleLocationSelect(suggestion)
                                }
                              >
                                {suggestion.display_name}
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Calendar className="mr-2 text-green-600" size={16} />
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={getTomorrowDate()}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
                        required
                      />
                      {formErrors.startDate && (
                        <p className="text-xs text-red-500">
                          {formErrors.startDate}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        When will this gig start?
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Clock className="mr-2 text-green-600" size={16} />
                        Duration
                      </label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 bg-white text-sm sm:text-base"
                        required
                      >
                        <option value="" disabled>
                          Select Duration
                        </option>
                        <option value="1 Day">1 Day</option>
                        <option value="2 Days">2 Days</option>
                        <option value="3 Days">3 Days</option>
                        <option value="1 Week">1 Week</option>
                        <option value="2 Weeks">2 Weeks</option>
                        <option value="1 Month">1 Month</option>
                        <option value="More than 1 Month">
                          More than 1 Month
                        </option>
                      </select>
                      {formErrors.duration && (
                        <p className="text-xs text-red-500">
                          {formErrors.duration}
                        </p>
                      )}
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Tag className="mr-2 text-cyan-600" size={16} />
                      Category
                    </label>
                    <select
                      value={category?._id || ""}
                      onChange={(e) =>
                        setCategory(
                          categories.find(
                            (cat) => cat._id === e.target.value
                          ) || null
                        )
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 bg-white text-sm sm:text-base"
                      required
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <p className="text-xs text-red-500">
                        {formErrors.category}
                      </p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-50 p-3 sm:p-4 rounded-md border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-700 flex items-center">
                        <Info className="mr-2 text-cyan-600" size={16} />
                        Tips for a successful job post
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowTips(!showTips)}
                        className="text-xs text-cyan-600 hover:text-cyan-700 focus:outline-none md:hidden"
                      >
                        {showTips ? "Hide" : "Show"}
                      </button>
                    </div>
                    <ul
                      className={`text-xs text-gray-600 space-y-1 ${
                        showTips ? "block" : "hidden md:block"
                      }`}
                    >
                      <li className="flex items-start">
                        <CheckCircle
                          className="mr-1 text-green-500 flex-shrink-0 mt-0.5"
                          size={12}
                        />
                        <span>
                          Be specific about skills and experience required
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          className="mr-1 text-green-500 flex-shrink-0 mt-0.5"
                          size={12}
                        />
                        <span>
                          Include information about your company culture
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          className="mr-1 text-green-500 flex-shrink-0 mt-0.5"
                          size={12}
                        />
                        <span>Highlight growth opportunities and benefits</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle
                          className="mr-1 text-green-500 flex-shrink-0 mt-0.5"
                          size={12}
                        />
                        <span>Add an image to make your listing stand out</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="pt-2 sm:pt-4 border-t border-gray-200 flex items-center justify-between"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition duration-200 text-sm sm:text-base"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex justify-center items-center px-4 sm:px-6 py-2 sm:py-3 rounded-md text-white font-medium transition duration-200 text-sm sm:text-base ${
                      isSubmitting
                        ? "bg-gray-400"
                        : "bg-gradient-to-r from-cyan-600 to-green-500 hover:from-cyan-700 hover:to-green-600"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
