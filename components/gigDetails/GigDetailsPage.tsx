"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { UserInfo as OriginalUserInfo } from "@/types";
import {
  MapPin,
  Calendar,
  Tag,
  DollarSign,
  Clock,
  Check,
  Edit,
  Star,
  User,
  Phone,
  Mail,
  ArrowLeft,
  Share2,
  AlertCircle,
  X,
  Info,
  Users,
  Archive,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Session } from "next-auth";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface UserInfo extends OriginalUserInfo {
  _id: string;
  phone?: string;
  availability?: string;
  skills?: string[];
  description?: string;
  image?: string;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  pay: string;
  startDate?: string;
  location: { address: string; coordinates?: { lat: number; lng: number } };
  duration: string;
  category: { name: string; _id: string };
  imageLink: string;
  createdBy: UserInfo;
  applicants: UserInfo[];
  createdAt?: string;
  isActive: boolean;
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

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
}

interface Application {
  _id: string;
  job: Job;
  user: UserInfo;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const GigDetailsPage = ({ session }: { session: Session }) => {
  const { id: jobId } = useParams();
  const router = useRouter();
  const [gig, setGig] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyingStatus, setApplyingStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [hasApplied, setHasApplied] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showProfileError, setShowProfileError] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<UserInfo | null>(
    null
  );
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [employerImage, setEmployerImage] = useState<string | null>(null);
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  // Check if job has started (current date >= start date)
  const hasJobStarted = gig?.startDate
    ? new Date() >= new Date(gig.startDate)
    : false;

  // Fetch gig details
  useEffect(() => {
    const fetchGig = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/gigs/${jobId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch gig: ${response.statusText}`);
        }

        const data = await response.json();
        setGig(data);

        if (session?.user?.id) {
          const applicationResponse = await fetch(
            `/api/applications/?userId=${session.user.id}&jobId=${jobId}`
          );

          if (applicationResponse.ok) {
            const applicationData = await applicationResponse.json();
            setHasApplied(applicationData.length > 0);
          }
        }
      } catch (error) {
        console.error("Error fetching gig:", error);
        setError("Failed to fetch gig details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [jobId, session]);

  // Fetch applications for this job
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`/api/applications/?jobId=${jobId}`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch applications: ${response.statusText}`
          );
        }
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    if (gig && session?.user?.email === gig.createdBy.email) {
      fetchApplications();
    }
  }, [jobId, gig, session]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!gig?.createdBy?._id) return;

      try {
        setLoadingReviews(true);
        const response = await fetch(
          `/api/reviews?employerId=${gig.createdBy._id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews");
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [gig]);

  // Fetch current user details
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/users/${session.user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const userData = await response.json();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchCurrentUser();
  }, [session]);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/gigs/${jobId}`);
        if (!response.ok) throw new Error(`Failed to fetch gig`);

        const data = await response.json();
        setGig(data);

        // Fetch employer image if available
        if (data.createdBy?.imageId) {
          const imageUrl = `/api/images/${data.createdBy.imageId}`;
          setEmployerImage(imageUrl);
        } else if (data.createdBy?.image) {
          setEmployerImage(data.createdBy.image);
        }
      } catch (error) {
        // ... error handling
      }
    };

    fetchGig();
  }, []);

  const isCreator = session?.user?.email === gig?.createdBy?.email;

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} className="fill-yellow-400 text-yellow-400 w-5 h-5" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-5 h-5">
            <Star className="absolute text-gray-300 w-5 h-5" />
            <div className="absolute w-1/2 overflow-hidden">
              <Star className="fill-yellow-400 text-yellow-400 w-5 h-5" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="text-gray-300 w-5 h-5" />);
      }
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="ml-1 text-sm text-gray-600">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  const handleApplyClick = () => {
    if (!session) {
      toast.error("Please log in to apply for this job");
      return;
    }

    if (hasJobStarted) {
      toast.error(
        "This job has already started and is no longer accepting applications"
      );
      return;
    }

    if (!gig?.isActive) {
      toast.error("This job is no longer available");
      return;
    }

    setShowConfirmation(true);
  };

  const confirmApplication = async () => {
    try {
      setApplyingStatus("loading");

      if (!currentUser?.phone) {
        setApplyingStatus("idle");
        setShowConfirmation(false);
        setShowProfileError(true);
        return;
      }

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job: jobId,
          user: currentUser._id,
          status: "pending",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      setApplyingStatus("success");
      setHasApplied(true);
      toast.success("Application submitted successfully!");

      if (gig && currentUser) {
        setGig({
          ...gig,
          applicants: [...gig.applicants, currentUser as unknown as UserInfo],
        });
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      setApplyingStatus("error");
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setShowConfirmation(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: gig?.title,
          text: `Check out this gig: ${gig?.title}`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const handleUpdateApplication = async (
    userId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const response = await fetch(`/api/applications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userId,
          job: jobId,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update application");
      }

      const updatedApplication = await response.json();

      setApplications((prev) =>
        prev.map((app) =>
          app.user._id === userId && app.job._id === jobId
            ? { ...app, status: updatedApplication.status }
            : app
        )
      );

      toast.success(`Application ${status} successfully`);
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error("Failed to update application");
    }
  };

  const handleDeactivateJob = async () => {
    if (!gig) return;

    try {
      setIsDeactivating(true);
      const response = await fetch(`/api/gigs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to deactivate job");
      }

      const updatedGig = await response.json();
      setGig(updatedGig);
      toast.success("Job marked as inactive");
    } catch (error) {
      console.error("Error deactivating job:", error);
      toast.error("Failed to deactivate job");
    } finally {
      setIsDeactivating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mb-4"></div>
          <p className="text-cyan-700 font-medium">Loading gig details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <Card className="max-w-lg w-full shadow-lg border-red-200">
          <CardContent className="p-8 flex flex-col items-center">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error Loading Gig
            </h2>
            <p className="text-red-500 text-center">{error}</p>
            <Button
              className="mt-6 bg-cyan-600 hover:bg-cyan-700"
              onClick={() => router.push("/gigs")}
            >
              Back to Gigs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <Card className="max-w-lg w-full shadow-lg">
          <CardContent className="p-8 flex flex-col items-center">
            <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Gig Not Found
            </h2>
            <p className="text-gray-600 text-center">
              The gig you're looking for doesn't exist or has been removed.
            </p>
            <Button
              className="mt-6 bg-cyan-600 hover:bg-cyan-700"
              onClick={() => router.push("/gigs")}
            >
              Browse Available Gigs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-cyan-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="p-2 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50 transition-all"
                title="Share job"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Status banner for inactive jobs */}
        {!gig.isActive && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-amber-100 p-2 rounded-full mr-4">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-amber-800">
                  Job No Longer Available
                </h3>
                <p className="text-amber-700 text-sm">
                  This job has been marked as inactive by the employer.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status banner for applicants */}
        {hasApplied && !isCreator && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">
                  Application Submitted
                </h3>
                <p className="text-green-700 text-sm">
                  The employer will contact you if they're interested.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={() => router.push("/applied")}
            >
              View Applications
            </Button>
          </div>
        )}

        {/* Job Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Job Image */}
          <div className="lg:col-span-1 h-80 sm:h-96 rounded-2xl overflow-hidden relative bg-gray-200 shadow-md">
            {gig.imageLink ? (
              <Image
                src={gig.imageLink}
                alt={gig.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600">
                <span className="text-white text-6xl font-bold">
                  {gig.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Job Info */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-cyan-100 text-cyan-800 hover:bg-cyan-200 px-3 py-1">
                  {gig.category?.name}
                </Badge>
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-3 py-1">
                  {gig.duration}
                </Badge>
                {!gig.isActive && (
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 px-3 py-1">
                    Inactive
                  </Badge>
                )}
                {hasJobStarted && (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1">
                    Started
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {gig.title}
              </h1>

              <div className="mb-6 text-lg font-medium">
                <span className="text-cyan-600 text-2xl">{gig.pay}₹</span>
                <span className="text-gray-600">/hr</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center text-gray-700">
                  <div className="bg-blue-50 p-2 rounded-full mr-3">
                    <MapPin className="text-blue-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{gig.location.address}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <div className="bg-amber-50 p-2 rounded-full mr-3">
                    <Calendar className="text-amber-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{gig.duration}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <div className="bg-emerald-50 p-2 rounded-full mr-3">
                    <Calendar className="text-emerald-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Starting Date</p>
                    <p className="font-medium">
                      {gig.startDate
                        ? new Date(gig.startDate).toLocaleDateString()
                        : "Flexible"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <div className="bg-purple-50 p-2 rounded-full mr-3">
                    <Tag className="text-purple-600 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{gig.category?.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isCreator ? (
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Button
                    onClick={() => router.push(`/gigs/edit/${jobId}`)}
                    className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 transition-all py-6 text-lg flex-1"
                  >
                    <Edit className="h-5 w-5" /> Edit Listing
                  </Button>
                  <Button
                    onClick={handleDeactivateJob}
                    disabled={isDeactivating || !gig.isActive}
                    variant="outline"
                    className="flex items-center justify-center gap-2 py-6 text-lg border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-all flex-1"
                  >
                    {isDeactivating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Archive className="h-5 w-5" /> Mark as Inactive
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleApplyClick}
                  disabled={
                    hasApplied ||
                    applyingStatus === "loading" ||
                    !gig.isActive ||
                    hasJobStarted
                  }
                  className={`flex items-center justify-center gap-2 py-6 text-lg ${
                    hasApplied
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                  } transition-all shadow-md hover:shadow-xl w-full sm:w-auto`}
                >
                  {hasApplied ? (
                    <>
                      <Check className="h-5 w-5" /> Applied Successfully
                    </>
                  ) : applyingStatus === "loading" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Applying...
                    </>
                  ) : !gig.isActive ? (
                    "Job Not Available"
                  ) : hasJobStarted ? (
                    "Job Already Started"
                  ) : (
                    "Apply for this Gig"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Description */}
          <div className="lg:col-span-2">
            <Card className="mb-8 border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-700 to-blue-700 py-4 px-8">
                <h2 className="text-xl font-bold text-white">
                  Job Description
                </h2>
              </div>
              <CardContent className="p-8">
                <div className="prose max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                  {gig.description}
                </div>

                {/* Additional Content Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    What to expect
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-cyan-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Immediate response
                        </p>
                        <p className="text-gray-600">
                          Most employers respond within 24 hours
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Verified employer
                        </p>
                        <p className="text-gray-600">
                          This employer has been verified by our team
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applicants Section (only visible to creator) */}
            {isCreator && applications.length > 0 && (
              <Card className="mb-8 border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-700 to-purple-700 py-4 px-8">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5" /> Applicants (
                    {applications.length})
                  </h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div
                        key={application._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                              {application.user.image ? (
                                <Image
                                  src={application.user.image}
                                  alt={application.user.name}
                                  width={48}
                                  height={48}
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white">
                                  <User className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {application.user.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant={
                                    application.status === "approved"
                                      ? "secondary"
                                      : application.status === "rejected"
                                      ? "destructive"
                                      : "default"
                                  }
                                >
                                  {application.status}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  Applied on{" "}
                                  {new Date(
                                    application.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setSelectedApplicant(application.user)
                              }
                            >
                              <Info className="w-4 h-4 mr-2" /> Details
                            </Button>
                            {application.status === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateApplication(
                                      application.user._id,
                                      "approved"
                                    )
                                  }
                                >
                                  <Check className="w-4 h-4 mr-1" /> Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateApplication(
                                      application.user._id,
                                      "rejected"
                                    )
                                  }
                                >
                                  <X className="w-4 h-4 mr-1" /> Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Application Stats */}
            <Card className="mb-8 border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 p-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Job Activity</h3>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Applied</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {applications.length || 0}
                    </p>
                    <p className="text-xs text-gray-500">applicants so far</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Posted</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {gig.createdAt
                        ? new Date(gig.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "Recently"}
                    </p>
                    {!isCreator ? (
                      <p className="text-xs text-gray-500">
                        be among the first to apply
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Employer Details */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-700 to-purple-700 py-4 px-6">
                <h2 className="text-xl font-bold text-white">
                  About the Employer
                </h2>
              </div>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-md mb-4">
                    {employerImage ? (
                      <Image
                        src={employerImage}
                        alt={gig.createdBy.name}
                        width={96}
                        height={96}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="text-white h-12 w-12" />
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900">
                    {gig.createdBy.name}
                  </h3>

                  <div className="mt-8 pt-4 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-4">Reviews</h3>

                    {loadingReviews ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                      </div>
                    ) : reviews.length === 0 ? (
                      <p className="text-gray-500 text-sm">No reviews yet</p>
                    ) : (
                      <div className="space-y-4">
                        {reviews.slice(0, 3).map((review) => (
                          <div
                            key={review._id}
                            className="border-b border-gray-100 pb-4 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {review.user.image ? (
                                  <Image
                                    src={review.user.image}
                                    alt={review.user.name}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                  />
                                ) : (
                                  <User className="text-gray-500 w-5 h-5" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-sm">
                                    {review.user.name}
                                  </h4>
                                  <span className="text-xs text-gray-500">
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="mt-1">
                                  {renderStars(review.rating)}
                                </div>
                                {review.text && (
                                  <p className="text-gray-700 text-sm mt-2">
                                    {review.text}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {reviews.length > 3 && (
                          <Button
                            variant="ghost"
                            className="w-full text-indigo-600 hover:text-indigo-700"
                            onClick={() =>
                              router.push(
                                `/profile?user_id=${gig.createdBy._id}`
                              )
                            }
                          >
                            View all reviews
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-gray-600 break-all">
                        {gig.createdBy.email}
                      </p>
                    </div>
                  </div>
                  {gig.createdBy.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Phone
                        </p>
                        <p className="text-gray-600">{gig.createdBy.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-gray-200">
                  <p className="text-gray-700 mb-4 text-sm">
                    Looking for trustworthy, reliable individuals who can
                    deliver quality work. I maintain a friendly and respectful
                    work environment.
                  </p>
                  <Link href={`/profile?user_id=${gig.createdBy._id}`}>
                    <Button
                      variant="outline"
                      className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                    >
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate-fade-in">
            <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Confirm Application
            </h3>
            <p className="mb-6 text-gray-600 text-center">
              Are you sure you want to apply for{" "}
              <span className="font-semibold">{gig.title}</span>? Your contact
              details will be shared with the employer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-center">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-300"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmApplication}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transition-colors duration-300"
                disabled={applyingStatus === "loading"}
              >
                {applyingStatus === "loading" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Applying...
                  </>
                ) : (
                  "Confirm Application"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Prompt user for adding phone number to the profile */}
      {showProfileError && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate-fade-in">
            <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Add Phone Number
            </h3>
            <p className="mb-6 text-gray-600 text-center">
              You have to add phone number in your profile for applying for the
              job
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-center">
              <Button
                variant="outline"
                onClick={() => setShowProfileError(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-300"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  router.push(`/profile?user_id=${session?.user?.id}`);
                }}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transition-colors duration-300"
                disabled={applyingStatus === "loading"}
              >
                Go to Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Applicant Details Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Applicant Details
              </h3>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4">
                {selectedApplicant.image ? (
                  <Image
                    src={selectedApplicant.image}
                    alt={selectedApplicant.name}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>
              <h4 className="text-xl font-semibold">
                {selectedApplicant.name}
              </h4>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-gray-600 break-all">
                    {selectedApplicant.email}
                  </p>
                </div>
              </div>

              {selectedApplicant.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-gray-600">{selectedApplicant.phone}</p>
                  </div>
                </div>
              )}

              {selectedApplicant.availability && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Availability
                    </p>
                    <p className="text-gray-600">
                      {selectedApplicant.availability}
                    </p>
                  </div>
                </div>
              )}

              {selectedApplicant.skills &&
                selectedApplicant.skills.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedApplicant.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              {selectedApplicant.description && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">About</p>
                    <p className="text-gray-600 whitespace-pre-line">
                      {selectedApplicant.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GigDetailsPage;
