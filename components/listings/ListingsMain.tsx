"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface Gig {
  _id: string;
  title: string;
  description: string;
  category: { name: string; _id: string };
  pay: number;
  location: {
    address: string;
  };
  imageLink?: string;
  isActive: boolean;
  startDate: string;
  createdBy: string;
}

interface ListingsProps {
  userId: string;
  initialData?: Gig[];
}

const Listings: React.FC<ListingsProps> = ({ userId, initialData }) => {
  const [gigs, setGigs] = useState<Gig[]>(initialData || []);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch user's gigs
  useEffect(() => {
    setLoading(true);
    const fetchGigs = async () => {
      try {
        const response = await fetch(`/api/gigs?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch gigs.");
        let data = await response.json();

        // Filter for active gigs with future start dates
        const now = new Date();
        data = data.filter((gig: Gig) => {
          const gigDate = new Date(gig.startDate);
          return gig.isActive && gigDate >= now;
        });

        // Sort by date (soonest first)
        data.sort(
          (a: Gig, b: Gig) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );

        setGigs(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching gigs:", err);
        setLoading(false);
      }
    };
    fetchGigs();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
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
            Loading your gigs...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="sticky top-0 bg-white mb-4 p-4 border-b-2 border-green-400">
        <h2 className="text-2xl font-bold">Your Active Gigs</h2>
      </div>

      {gigs.length > 0 ? (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {gigs.map((gig) => (
            <Link key={gig._id} href={`/gigs/${gig._id}`}>
              <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-[330px] flex flex-col justify-between">
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
                  <p className="text-sm text-gray-500">
                    Starts: {new Date(gig.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-between items-center p-4">
                  <div className="flex flex-col">
                    <span className="text-gray-500 truncate">
                      {gig.category.name}
                    </span>
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
          <p className="text-lg text-gray-500 text-center">
            You don't have any active gigs. Create one to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default Listings;
