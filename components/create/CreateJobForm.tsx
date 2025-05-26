"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Briefcase,
  MapPin,
  Clock,
  Tag,
  Info,
  LucideIndianRupee,
  Image as ImageIcon,
  Calendar,
  ChevronDown,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
}

interface LocationData {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string;
}

export default function CreateJobForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pay, setPay] = useState("");
  const [location, setLocation] = useState<LocationData>({
    address: "",
    coordinates: undefined,
    placeId: "",
  });
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [startDate, setStartDate] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    category?: string;
    duration?: string;
    startDate?: string;
  }>({});
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // Debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchLocationSuggestions = async (query: string) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1`
      );
      const data = await response.json();
      setLocationSuggestions(data);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setLocationSuggestions([]);
    }
  };

  const debouncedLocationSearch = useCallback(
    debounce(fetchLocationSuggestions, 300),
    []
  );

  const handleLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setLocation((prev) => ({
      ...prev,
      address: value,
    }));
    debouncedLocationSearch(value);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

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

    const jobData = {
      title,
      description,
      pay,
      location,
      duration,
      category,
      imageLink,
      startDate,
    };

    try {
      // First, create/update the employer record
      const employerResponse = await fetch("/api/employer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!employerResponse.ok) {
        throw new Error("Failed to update employer record");
      }

      // Then create the job
      const jobResponse = await fetch("/api/gigs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (jobResponse.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        console.error("Error creating job");
      }
    } catch (error) {
      console.error("Request failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidImageUrl = (url: string): boolean => {
    return url.startsWith("https://");
  };

  return (
    <div className="mt-8 w-full px-4 sm:px-6 md:px-8 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
      >
        {submitSuccess ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 px-4 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle size={64} className="text-green-500 mb-4" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Job Posted Successfully!
            </h2>
            <p className="text-gray-600">
              Your job has been created and is now visible to potential
              applicants.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-cyan-600 to-green-500 p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
                  <Briefcase className="mr-2" size={28} />
                  Post a New Opportunity
                </h2>
                <p className="text-white/90 mt-2 text-sm sm:text-base">
                  Fill out the form below to create a new job listing. Be
                  detailed to attract the right candidates.
                </p>
              </motion.div>
            </div>

            <div className="p-4 sm:p-6">
              <motion.form
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-6"
              >
                <motion.div variants={itemVariants} className="space-y-4">
                  {/* Title Field */}
                  <motion.div variants={itemVariants}>
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Briefcase className="mr-2 text-cyan-600" size={16} />
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
                      placeholder="e.g., Cleaning Staff for XYZ event"
                      required
                    />
                  </motion.div>

                  {/* Description Field */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
                      rows={4}
                      placeholder="Describe the job responsibilities, requirements, and benefits"
                      required
                    ></textarea>
                  </motion.div>

                  {/* Image Link Field */}
                  <motion.div variants={itemVariants}>
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <ImageIcon className="mr-2 text-cyan-600" size={16} />
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
                        className="w-full pl-10 sm:px-4 py-2 sm:py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (imageLink.trim() === "") return;
                          setImagePreview(!imagePreview);
                        }}
                        className="absolute inset-y-12 h-10 right-0 px-3 flex items-center text-sm text-cyan-600 hover:text-cyan-700 focus:outline-none z-10"
                      >
                        {imageLink.trim() !== "" &&
                          (imagePreview ? "Hide" : "Preview")}
                      </button>
                    </div>

                    <AnimatePresence>
                      {imagePreview && imageLink && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
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
                    </AnimatePresence>
                    <p className="mt-1 text-xs text-gray-500">
                      Add an image to better showcase the job opportunity (JPEG,
                      PNG, GIF formats)
                    </p>
                  </motion.div>

                  {/* Pay Rate and Location Fields */}
                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <div>
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
                          placeholder="e.g. 250"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <MapPin className="mr-2 text-cyan-600" size={16} />
                        Location
                      </label>
                      <input
                        type="text"
                        value={location.address}
                        onChange={handleLocationInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
                        placeholder="Search for a location..."
                        required
                      />
                      <AnimatePresence>
                        {locationSuggestions.length > 0 && (
                          <motion.ul
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                          >
                            {locationSuggestions.map((suggestion, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                                onClick={() => {
                                  setLocation({
                                    address: suggestion.display_name,
                                    coordinates: {
                                      lat: parseFloat(suggestion.lat),
                                      lng: parseFloat(suggestion.lon),
                                    },
                                    placeId: suggestion.place_id,
                                  });
                                  setLocationSuggestions([]);
                                }}
                              >
                                {suggestion.display_name}
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                      <p className="mt-1 text-xs text-gray-500">
                        Data by OpenStreetMap
                      </p>
                    </div>
                  </motion.div>

                  {/* Start Date and Duration Fields */}
                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <div>
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
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-red-500"
                        >
                          {formErrors.startDate}
                        </motion.p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        When will this gig start?
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Clock className="mr-2 text-green-600" size={16} />
                        Duration
                      </label>
                      <div className="relative">
                        <select
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 bg-white text-sm sm:text-base appearance-none"
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
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      {formErrors.duration && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-red-500"
                        >
                          {formErrors.duration}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  {/* Category Field */}
                  <motion.div variants={itemVariants}>
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Tag className="mr-2 text-cyan-600" size={16} />
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200 bg-white text-sm sm:text-base appearance-none"
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
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    {formErrors.category && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500"
                      >
                        {formErrors.category}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Tips Section */}
                  <motion.div
                    variants={itemVariants}
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

                    {/* Simplified tips list without conflicting animations/classes */}
                    <div className="hidden md:block">
                      <ul className="text-xs text-gray-600 space-y-1">
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
                          <span>
                            Highlight growth opportunities and benefits
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle
                            className="mr-1 text-green-500 flex-shrink-0 mt-0.5"
                            size={12}
                          />
                          <span>
                            Add an image to make your listing stand out
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Mobile version with animation */}
                    <AnimatePresence>
                      {showTips && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="text-xs text-gray-600 space-y-1 overflow-hidden md:hidden"
                        >
                          <li className="flex items-start pt-2">
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
                            <span>
                              Highlight growth opportunities and benefits
                            </span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle
                              className="mr-1 text-green-500 flex-shrink-0 mt-0.5"
                              size={12}
                            />
                            <span>
                              Add an image to make your listing stand out
                            </span>
                          </li>
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  variants={itemVariants}
                  className="pt-2 sm:pt-4 border-t border-gray-200"
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center items-center px-4 sm:px-6 py-2 sm:py-3 rounded-md text-white font-medium transition duration-200 text-sm sm:text-base ${
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
                        Processing...
                      </>
                    ) : (
                      <motion.span
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Post Job
                      </motion.span>
                    )}
                  </button>
                </motion.div>
              </motion.form>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
