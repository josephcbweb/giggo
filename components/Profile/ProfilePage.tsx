"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IUser } from "@/models/User";

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

const ProfilePage = ({ user_id }: { user_id: string }) => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    imageFile: null as File | null,
    imagePreview: "",
    description: "",
    location: {
      address: "",
      coordinates: null as { lat: number; lng: number } | null,
      placeId: "",
    },
    availability: "Flexible",
    preferredJobTypes: [] as string[],
    skills: [] as string[],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Debounce function to limit API calls
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${user_id}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user");
        }

        setUser(data);
        const initialData = {
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          imageFile: null,
          imagePreview: data.imageUrl || "",
          description: data.description || "",
          location: data.location || {
            address: "",
            coordinates: null,
            placeId: "",
          },
          availability: data.availability || "Flexible",
          preferredJobTypes: data.preferredJobTypes || [],
          skills: data.skills || [],
        };

        if (data.imageId) {
          initialData.imagePreview = `/api/images/${data.imageId}`;
        }

        setFormData(initialData);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsFetching(false);
      }
    };

    fetchUser();
  }, [user_id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        setCategories(data);
      } catch (err: any) {
        console.error("Error fetching categories:", err.message);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryClick = (categoryName: string) => {
    setFormData((prev) => {
      const isSelected = prev.preferredJobTypes.includes(categoryName);
      const updatedCategories = isSelected
        ? prev.preferredJobTypes.filter((cat) => cat !== categoryName)
        : [...prev.preferredJobTypes, categoryName];
      return {
        ...prev,
        preferredJobTypes: updatedCategories,
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({
            ...prev,
            imageFile: file,
            imagePreview: event?.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        address: value,
      },
    }));
    debouncedLocationSearch(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("location", JSON.stringify(formData.location));
      formDataToSend.append("availability", formData.availability);
      formDataToSend.append(
        "preferredJobTypes",
        JSON.stringify(formData.preferredJobTypes)
      );
      formDataToSend.append("skills", JSON.stringify(formData.skills));
      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
      }

      const response = await fetch(`/api/users/${user_id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      setIsSaved(true);
      setLocationSuggestions([]);

      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-green-600 mx-auto"
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
          <p className="mt-4 text-lg text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-cyan-600 p-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
            <button
              onClick={() => router.back()}
              className="bg-white text-green-600 hover:bg-green-50 font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {success && (
              <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {formData.imagePreview ? (
                      <>
                        <Image
                          src={formData.imagePreview}
                          alt={formData.name || "Profile Picture"}
                          fill
                          style={{ objectFit: "cover" }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "";
                            target
                              .parentElement!.querySelector(".placeholder")
                              ?.classList.remove("hidden");
                          }}
                        />
                        <div className="hidden placeholder w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-4xl text-gray-400">
                            {formData.name?.charAt(0)?.toUpperCase() || ""}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-4xl text-gray-400">
                          {formData.name?.charAt(0)?.toUpperCase() || ""}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture
                      <span className="text-xs text-gray-500 ml-1">
                        (Recommended: 500x500px, JPG/PNG)
                      </span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-medium
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Upload a professional headshot (Max 5MB)
                    </p>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="md:w-2/3 space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your full name as per ID"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Contact support if you need to change your email
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        +91
                      </span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="focus:ring-green-500 focus:border-green-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 px-3 py-2 border"
                        placeholder="9876543210"
                        pattern="[0-9]{10}"
                        title="Please enter a 10-digit Indian phone number"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Enter 10-digit Indian mobile number (without country code)
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Professional Summary
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      rows={4}
                      placeholder="Example: Hardworking individual with experience in manual labor or assisting teams. Reliable, physically fit, and eager to learn and grow in construction, catering, or similar industries."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Write 3-5 sentences highlighting your experience, skills,
                      and what you're looking for
                    </p>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Location
                    </label>
                    <input
                      type="text"
                      placeholder="Search for your location..."
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      value={formData.location.address}
                      onChange={handleLocationInputChange}
                    />
                    {locationSuggestions.length > 0 && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {locationSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                location: {
                                  address: suggestion.display_name,
                                  coordinates: {
                                    lat: parseFloat(suggestion.lat),
                                    lng: parseFloat(suggestion.lon),
                                  },
                                  placeId: suggestion.place_id,
                                },
                              }));
                              setLocationSuggestions([]);
                            }}
                          >
                            {suggestion.display_name}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Helps us find gigs near you. Data by OpenStreetMap
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="availability"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Availability
                    </label>
                    <select
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="Full-time">Full-time (9am-6pm)</option>
                      <option value="Part-time">
                        Part-time (Flexible hours)
                      </option>
                      <option value="Weekdays">Weekdays only</option>
                      <option value="Weekends">Weekends only</option>
                      <option value="Flexible">Flexible schedule</option>
                      <option value="Immediate">Immediately available</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      When are you available to start working?
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Job Types
                      <span className="text-xs text-gray-500 ml-1">
                        (Select up to 3)
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category._id}
                          type="button"
                          onClick={() => handleCategoryClick(category.name)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            formData.preferredJobTypes.includes(category.name)
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Select the types of jobs you're most interested in
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="skills"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Skills & Expertise
                    </label>
                    <input
                      type="text"
                      id="skills"
                      name="skills"
                      value={formData.skills.join(", ")}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          skills: e.target.value.split(", "),
                        }))
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Hardworking, Dependable, Physically Fit, Team Player"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Separate skills with commas (Top 5-10 skills recommended)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
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
                      Saving...
                    </>
                  ) : isSaved ? (
                    "Saved!"
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
