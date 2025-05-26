"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { RiSendPlaneLine, RiArrowRightLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";

const HeroFirst = ({ username }: { username: string | undefined }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const backgrounds = [
    { img: "workers.jpg", highlight: "text-amber-400" },
    { img: "cater.jpg", highlight: "text-emerald-400" },
    { img: "event.jpg", highlight: "text-purple-400" },
    { img: "manager.jpg", highlight: "text-rose-400" },
    { img: "construction.jpg", highlight: "text-orange-400" },
  ];

  const benefits = [
    { icon: <FiClock className="w-5 h-5" />, text: "Flexible schedules" },
    { icon: <FiDollarSign className="w-5 h-5" />, text: "Competitive pay" },
    { icon: <FiMapPin className="w-5 h-5" />, text: "Local opportunities" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen max-h-[900px] w-full overflow-hidden bg-black">
      {/* Background with black transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(/hero/${backgrounds[currentIndex].img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content remains the same */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            <span className={backgrounds[currentIndex].highlight}>
              {username
                ? `Welcome ${username.split(" ")[0]}`
                : "Find your next"}
            </span>{" "}
            <br className="hidden sm:block" />
            {username ? "Ready to work?" : "opportunity today"}
          </h1>

          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Connect with local businesses and workers in real-time
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href={username ? `/dashboard` : "/signup"}>
              <Button
                size="lg"
                className="px-8 py-6 text-lg bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {username ? "Browse Jobs" : "Get Started"}
                <motion.span
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ type: "spring" }}
                  className="ml-2"
                >
                  <RiArrowRightLine className="w-5 h-5" />
                </motion.span>
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Benefits - simpler presentation */}
        <div className="absolute bottom-20 left-0 right-0 px-6">
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            {benefits.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.5 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20"
              >
                <div className="text-white">{item.icon}</div>
                <span className="text-white font-medium text-sm sm:text-base">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Background indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {backgrounds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroFirst;
