"use client";
import React, { useState } from "react";
import { Briefcase, Clock, DollarSign, BarChart2, Users } from "lucide-react";

const Features = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const features = [
    {
      icon: <Briefcase className="h-10 w-10" />,
      color: "indigo",
      title: "No Skills Required",
      description:
        "Our platform offers easy access to local job opportunities, no experience needed.",
      stats: "5,000+ Entry Level Jobs",
    },
    {
      icon: <Clock className="h-10 w-10" />,
      color: "teal",
      title: "Flexible Hours",
      description:
        "Find jobs that fit your schedule and lifestyle, from part-time to full-time positions.",
      stats: "70% Flexible Schedule",
    },
    {
      icon: <DollarSign className="h-10 w-10" />,
      color: "amber",
      title: "Competitive Pay",
      description:
        "Earn competitive wages with various job opportunities across multiple industries.",
      stats: "Above Market Average",
    },
    {
      icon: <BarChart2 className="h-10 w-10" />,
      color: "blue",
      title: "Skill Development",
      description:
        "Improve your skills with on-the-job training and experience to advance your career.",
      stats: "92% Report Skill Growth",
    },
    {
      icon: <Users className="h-10 w-10" />,
      color: "purple",
      title: "Community Support",
      description:
        "Join a community of job seekers and employers to connect and collaborate effortlessly.",
      stats: "24/7 Support Available",
    },
  ];

  // Color mapping for tailwind classes
  const colorMap = {
    indigo: "from-indigo-500 to-indigo-600 text-indigo-600 border-indigo-200",
    teal: "from-teal-500 to-teal-600 text-teal-600 border-teal-200",
    amber: "from-amber-500 to-amber-600 text-amber-600 border-amber-200",
    blue: "from-blue-500 to-blue-600 text-blue-600 border-blue-200",
    purple: "from-purple-500 to-purple-600 text-purple-600 border-purple-200",
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-100 rounded-full opacity-20 blur-3xl"></div>

          <span className="inline-block py-1 px-4 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-4 animate-pulse">
            For Everyone, Everywhere
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 relative">
            Platform Features
          </h2>

          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full mb-6 transition-all duration-500 hover:w-32"></div>

          <p className="text-gray-600 max-w-2xl mx-auto text-lg relative">
            Our platform connects job seekers and employers in a seamless
            ecosystem where anyone can participate on either side of the
            marketplace
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 border border-gray-100 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background decoration */}
              <div
                className={`absolute -right-12 -top-12 w-24 h-24 rounded-full bg-gradient-to-br ${
                  colorMap[feature.color].split(" ")[0]
                } opacity-10 group-hover:scale-150 transition-all duration-700`}
              ></div>

              <div className={`relative z-10 flex flex-col h-full`}>
                <div
                  className={`flex-shrink-0 mb-4 p-3 rounded-lg bg-${
                    feature.color
                  }-50 ${
                    hoveredIndex === index ? "scale-110" : "scale-100"
                  } transition-all duration-300 w-fit`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <span
                    className={`text-${feature.color}-600 font-medium text-sm`}
                  >
                    {feature.stats}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
