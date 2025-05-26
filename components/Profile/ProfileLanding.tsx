"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Settings,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Calendar,
  Award,
  Users,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { auth } from "@/auth";
import Image from "next/image";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  imageUrl?: string;
  imageId?: string;
  location?: { address?: string; coordinates?: { lat: number; lng: number } };
  bio?: string;
  skills?: string[];
  rating?: number;
  joinedDate?: string;
  completedJobs?: number;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  pay: string;
  location: { address: string };
  duration: string;
  category: { name: string; _id: string };
  imageLink?: string;
  imageId?: string;
  user: UserInfo;
  applicants?: UserInfo[] | string[];
  isActive?: boolean;
}

interface Review {
  _id: string;
  employer: string;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
  rating: number;
  text?: string;
  createdAt: string;
}

interface ProfilePageProps {
  user_id: string | undefined;
  session: any;
}

const ProfileLanding: React.FC<ProfilePageProps> = ({ user_id, session }) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "gigs" | "applications" | "reviews"
  >("gigs");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [jobImages, setJobImages] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const isCurrentUser = session?.user?.id === user_id;

  const getImageUrl = (imageId?: string, imageUrl?: string): string | null => {
    if (imageId) {
      return `/api/images/${imageId}`;
    }
    return imageUrl || null;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [userResponse, jobsResponse] = await Promise.all([
          fetch(`/api/users/${user_id}`),
          fetch(`/api/gigs?userId=${user_id}&isActive=false`),
        ]);

        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user (${userResponse.status})`);
        }

        const userData = await userResponse.json();
        setUserInfo(userData);
        setProfileImage(getImageUrl(userData.imageId, userData.imageUrl));

        if (!jobsResponse.ok) {
          throw new Error(`Failed to fetch gigs (${jobsResponse.status})`);
        }

        const jobsData = await jobsResponse.json();
        setUserJobs(Array.isArray(jobsData) ? jobsData : []);

        const images: Record<string, string> = {};
        jobsData.forEach((job: Job) => {
          if (job.imageId || job.imageLink) {
            images[job._id] = getImageUrl(job.imageId, job.imageLink) || "";
          }
        });
        setJobImages(images);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const response = await fetch(`/api/reviews?employerId=${user_id}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch reviews:", response.status);
          setReviews([]);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchUserData();
    fetchReviews();
  }, [user_id, isCurrentUser]);
  interface Rating {
    rating: number;
  }

  const calculateAverageRating = (ratingsList: Rating[]): number => {
    if (ratingsList.length === 0) return 0; // Handle empty list

    const totalRating = ratingsList.reduce((sum, obj) => sum + obj.rating, 0);
    const averageRating = totalRating / ratingsList.length;

    return Number(averageRating.toFixed(1)); // Format to 2 decimal places (optional)
  };
  const renderStars = (rating: number | undefined) => {
    // Handle undefined or invalid ratings
    if (typeof rating !== "number" || isNaN(rating)) {
      console.error("Invalid rating value:", rating);
      return <div className="text-gray-400 text-sm">No rating</div>;
    }
    const clampedRating = Math.min(5, Math.max(1, Math.round(rating)));

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= clampedRating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-t-2 border-b-2 border-cyan-500 border-r-2"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen px-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md text-center border border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-500 w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Profile
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-green-500 text-white rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const displayProfileImage = profileImage || userInfo?.imageUrl;
  const activeJobsCount = userJobs.filter((job) => job.isActive).length;
  const totalJobsCount = userJobs.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-64 w-full bg-gradient-to-r from-cyan-500 to-green-500"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="flex flex-col md:flex-row gap-6 -mt-16"
          >
            {/* Profile Picture */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white shadow-xl bg-white overflow-hidden">
              {displayProfileImage ? (
                <img
                  src={displayProfileImage}
                  alt={userInfo?.name || "Profile"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "";
                    target
                      .parentElement!.querySelector(".placeholder")
                      ?.classList.remove("hidden");
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-100 to-green-100 ${
                  displayProfileImage ? "hidden" : ""
                } placeholder`}
              >
                <User size={48} className="text-cyan-600" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 backdrop-blur-sm bg-opacity-90">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {userInfo?.name || "User"}
                  </h1>
                  {userInfo?.location?.address && (
                    <div className="flex items-center mt-2 text-gray-600">
                      <MapPin className="w-5 h-5 mr-2 text-cyan-500" />
                      <span>{userInfo.location.address}</span>
                    </div>
                  )}
                </div>

                {isCurrentUser && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/profile/${user_id}`)}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-green-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Settings className="w-5 h-5" />
                    Edit Profile
                  </motion.button>
                )}
              </div>

              <p className="mt-4 text-gray-700 leading-relaxed">
                {userInfo?.bio || "No bio provided yet."}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Member Since
                </p>
                <p className="text-2xl font-bold mt-1 text-gray-900">
                  {userInfo?.joinedDate
                    ? new Date(userInfo.joinedDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "--"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center">
                <Calendar className="text-cyan-500 w-6 h-6" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Jobs Posted</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">
                  {totalJobsCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <Briefcase className="text-green-500 w-6 h-6" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Rating</p>
                <div className="flex items-center mt-1">
                  {renderStars(calculateAverageRating(reviews))}
                  <span className="ml-2 text-gray-900 font-bold">
                    {calculateAverageRating(reviews) || "0.0"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {reviews.length} reviews
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                <Award className="text-yellow-500 w-6 h-6" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Skills Section */}
        {userInfo?.skills && userInfo.skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-3">
              {userInfo.skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-50 to-green-50 text-cyan-700 rounded-full text-sm font-medium border border-cyan-100 shadow-sm hover:shadow-md transition-all"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        {isCurrentUser && (
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("gigs")}
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "gigs"
                    ? "text-cyan-600 border-b-2 border-cyan-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Posted Gigs
              </button>
              <button
                onClick={() => setActiveTab("applications")}
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "applications"
                    ? "text-cyan-600 border-b-2 border-cyan-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Users className="w-4 h-4" />
                Applications
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "reviews"
                    ? "text-cyan-600 border-b-2 border-cyan-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Star className="w-4 h-4" />
                Reviews
              </button>
            </div>
          </div>
        )}

        {/* Gigs Grid */}
        {(activeTab === "gigs" || !isCurrentUser) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {userJobs.length === 0 ? (
              <div className="col-span-full bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
                <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No gigs posted yet
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {userInfo?.name
                    ? `${
                        userInfo.name.split(" ")[0]
                      } hasn't posted any gigs yet.`
                    : "No gigs found."}
                </p>
              </div>
            ) : (
              userJobs.map((job) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden border ${
                    job.isActive ? "border-gray-100" : "border-amber-100"
                  } hover:shadow-md transition-all`}
                >
                  {!job.isActive && (
                    <div className="bg-amber-50 text-amber-800 text-sm py-1 px-4 text-center">
                      Inactive
                    </div>
                  )}
                  <div className="relative h-48 bg-gray-100">
                    {job.imageLink ? (
                      <img
                        src={job.imageLink}
                        alt={job.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-50 to-green-50">
                        <Briefcase className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                      {job.category?.name || "Uncategorized"}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                        <span>{job.pay}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-cyan-500" />
                        <span>
                          {job.location?.address || "Location not specified"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-amber-500" />
                        <span>{job.duration}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-2.5 ${
                        job.isActive
                          ? "bg-gradient-to-r from-cyan-500 to-green-500"
                          : "bg-gray-300 cursor-not-allowed"
                      } text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all`}
                      onClick={() =>
                        job.isActive && router.push(`/gigs/${job._id}`)
                      }
                      disabled={!job.isActive}
                    >
                      {job.isActive ? "View Details" : "Job Inactive"}
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Applications Tab */}
        {isCurrentUser && activeTab === "applications" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {userInfo?.name
                  ? `When you apply to gigs, they'll appear here.`
                  : "Applications will appear here."}
              </p>
            </div>
          </motion.div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            {loadingReviews ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="text-gray-400 w-8 h-8" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {isCurrentUser
                    ? "Your reviews will appear here when clients leave feedback."
                    : "This user hasn't received any reviews yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-gray-100 pb-6 last:border-0"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {review.user?.image ? (
                          <img
                            src={review.user.image}
                            alt={review.user.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = "";
                              target.style.display = "none";
                            }}
                          />
                        ) : (
                          <User className="text-gray-400 w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            {review.user?.name || "Anonymous User"}
                          </h4>
                          <div className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                        <div className="mt-1 mb-2">
                          {renderStars(review.rating)}
                        </div>
                        {review.text ? (
                          <p className="text-gray-700 mt-2">{review.text}</p>
                        ) : (
                          <p className="text-gray-500 italic mt-2">
                            No additional comments
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfileLanding;
