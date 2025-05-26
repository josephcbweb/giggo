"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  Clock,
  X,
  ChevronRight,
  AlertCircle,
  Search,
  Frown,
  MapPin,
  DollarSign,
  Tag,
  Star,
  User,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaRupeeSign } from "react-icons/fa";
import { Session } from "next-auth";

interface Job {
  _id: string;
  title: string;
  description: string;
  location: { address: string };
  category?: { name: string };
  pay: string;
  duration: string;
  createdAt: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
  };
}

interface Application {
  _id: string;
  job: Job;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface Review {
  _id: string;
  employer: string;
  rating: number;
  text?: string;
  createdAt: string;
}

const JobApplicationTracker = ({ session }: { session: Session }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [userReviews, setUserReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchApplications();
    fetchUserReviews();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/applications?userId=${session?.user?.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?userId=${session?.user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserReviews(data);
      }
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === "all" || app.status === filter;
    const title = app.job.title?.toLowerCase() || "";
    const category = app.job.category?.name?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    const matchesSearch = title.includes(query) || category.includes(query);
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) {
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
          <CheckCircle className="h-4 w-4 mr-1" /> Completed
        </Badge>
      );
    }
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <Check className="h-4 w-4 mr-1" /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <X className="h-4 w-4 mr-1" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="h-4 w-4 mr-1" /> Pending
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleReviewClick = (job: Job) => {
    setCurrentJob(job);
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    if (!currentJob || !rating) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employerId: currentJob.createdBy,
          rating,
          text: reviewText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      toast.success("Review submitted successfully!");
      setShowReviewModal(false);
      setRating(0);
      setReviewText("");
      fetchUserReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const hasReviewedEmployer = (employerId: string) => {
    return userReviews.some((review) => review.employer === employerId);
  };

  const getUserReviewForEmployer = (employerId: string) => {
    return userReviews.find((review) => review.employer === employerId);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mb-4"></div>
          <p className="text-cyan-700 font-medium">
            Loading your applications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Applications
              </h1>
              <p className="mt-2 text-gray-600">
                Track the status of all jobs you've applied for
              </p>
            </div>
            <Link href="/dashboard">
              <Button className="mt-4 md:mt-0 bg-cyan-600 hover:bg-cyan-700">
                Browse More Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Filters and Search */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by job title or category..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-start md:justify-end">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              onClick={() => setFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={filter === "approved" ? "default" : "outline"}
              onClick={() => setFilter("approved")}
            >
              Approved
            </Button>
            <Button
              variant={filter === "rejected" ? "default" : "outline"}
              onClick={() => setFilter("rejected")}
            >
              Rejected
            </Button>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <Frown className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchQuery || filter !== "all"
                ? "No matching applications found"
                : "You haven't applied to any jobs yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Browse available jobs and apply to get started"}
            </p>
            <Link href="/dashboard">
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                Browse Jobs
              </Button>
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {filteredApplications.map((application) => {
                const hasReview = hasReviewedEmployer(
                  application.job.createdBy._id
                );
                const userReview = getUserReviewForEmployer(
                  application.job.createdBy._id
                );
                const showReviewButton =
                  !application.job.isActive &&
                  application.status === "approved" &&
                  !hasReview;

                return (
                  <motion.div
                    key={application._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {application.job.title}
                              </h3>
                              {getStatusBadge(
                                application.status,
                                application.job.isActive
                              )}
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                              {application.job.category?.name && (
                                <span className="flex items-center">
                                  <Tag className="h-4 w-4 mr-1 text-gray-400" />
                                  {application.job.category.name}
                                </span>
                              )}
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                {application.job.location.address}
                              </span>
                              <span className="flex items-center">
                                <FaRupeeSign className="h-4 w-4 mr-1 text-gray-400" />
                                {application.job.pay}/hr
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                              {application.job.description}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-sm text-gray-500">
                              Applied on {formatDate(application.createdAt)}
                            </span>
                            <div className="flex gap-2">
                              <Link
                                href={`/gigs/${application.job._id}`}
                                passHref
                              >
                                <Button
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  View Job <ChevronRight className="h-4 w-4" />
                                </Button>
                              </Link>
                              {showReviewButton && (
                                <Button
                                  onClick={() =>
                                    handleReviewClick(application.job)
                                  }
                                  className="bg-purple-600 hover:bg-purple-700"
                                >
                                  Leave Review
                                </Button>
                              )}
                              {hasReview && (
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <span className="font-medium">
                                    Your rating:
                                  </span>
                                  {renderStars(userReview?.rating || 0)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Stats Card */}
        {!loading && applications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100">
              <CardHeader>
                <CardTitle className="text-cyan-800">
                  Application Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-500">
                      Total Applications
                    </h4>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {applications.length}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-500">
                      Approved
                    </h4>
                    <p className="text-3xl font-bold text-green-600 mt-1">
                      {
                        applications.filter((a) => a.status === "approved")
                          .length
                      }
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-500">
                      Pending
                    </h4>
                    <p className="text-3xl font-bold text-yellow-600 mt-1">
                      {
                        applications.filter((a) => a.status === "pending")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={24}
                    className={
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              rows={4}
              placeholder="Share your experience working with this employer..."
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={submitReview}
                disabled={isSubmittingReview || !rating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobApplicationTracker;
