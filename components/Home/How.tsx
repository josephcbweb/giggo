"use client";

import React, { useState, useEffect, useRef, JSX } from "react";

// Using Lucide icons
import {
  UserCircle,
  MapPin,
  Wallet,
  FileText,
  Users,
  CreditCard,
  ChevronRight,
  CheckCircle,
  Star,
  Award,
  ArrowDown,
  PhoneCall,
  Calendar,
  Shield,
} from "lucide-react";
import { FaBell, FaBolt } from "react-icons/fa";
import Link from "next/link";

const How = () => {
  const [activeTab, setActiveTab] = useState("workers");
  const [animateCards, setAnimateCards] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Trigger animation after tab change
    setAnimateCards(false);
    setTimeout(() => setAnimateCards(true), 100);
  }, [activeTab]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const tabs = [
    { id: "workers", label: "For Workers" },
    { id: "employers", label: "For Employers" },
  ];

  const workerSteps = [
    {
      icon: <UserCircle strokeWidth={1.5} />,
      title: "Create Profile",
      description: "Set up your profile in minutes with no resume required",
      color: "from-green-400 to-green-500",
      stats: "5 min average setup time",
    },
    {
      icon: <MapPin strokeWidth={1.5} />,
      title: "Browse Jobs",
      description: "Find local opportunities that match your availability",
      color: "from-green-500 to-teal-400",
      stats: "1000+ new jobs daily",
    },
    {
      icon: <Wallet strokeWidth={1.5} />,
      title: "Get Paid",
      description: "Earn competitive wages with quick payment processing",
      color: "from-teal-400 to-teal-500",
      stats: "98% same-day payment",
    },
  ];

  const employerSteps = [
    {
      icon: <FileText strokeWidth={1.5} />,
      title: "Post Job",
      description:
        "Create a job listing in under 2 minutes with simple details",
      color: "from-teal-400 to-blue-400",
      stats: "2 min average posting time",
    },
    {
      icon: <Users strokeWidth={1.5} />,
      title: "Find Workers",
      description: "Connect with available workers in your local area",
      color: "from-blue-400 to-blue-500",
      stats: "87% match rate",
    },
    {
      icon: <CreditCard strokeWidth={1.5} />,
      title: "Easy Payment",
      description:
        "Secure, hassle-free payment processing built into the platform",
      color: "from-blue-500 to-indigo-400",
      stats: "100% secure transactions",
    },
  ];

  const testimonials = [
    {
      name: "Sarah J.",
      role: "Worker",
      quote:
        "I found my first gig within 24 hours of signing up. The process was incredibly simple.",
      avatar: "/api/placeholder/64/64",
    },
    {
      name: "Michael T.",
      role: "Employer",
      quote:
        "As a business owner, this platform has been a game-changer for finding reliable help.",
      avatar: "/api/placeholder/64/64",
    },
  ];

  const stats = [
    {
      value: "10K+",
      label: "Active Workers",
      icon: <Users className="w-5 h-5" />,
    },
    {
      value: "5K+",
      label: "Businesses",
      icon: <FileText className="w-5 h-5" />,
    },
    { value: "98%", label: "Satisfaction", icon: <Star className="w-5 h-5" /> },
  ];

  interface Step {
    icon: JSX.Element;
    title: string;
    description: string;
    color: string;
    stats: string;
  }

  interface RenderStepsProps {
    steps: Step[];
  }

  const renderSteps = (steps: RenderStepsProps["steps"]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`transform transition-all duration-700 ${
              animateCards
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            } relative`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="bg-white rounded-xl p-6 lg:p-8 shadow-lg border border-gray-100 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
              {/* Background decoration */}
              <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-gray-50 opacity-70 group-hover:scale-150 transition-all duration-700"></div>

              <div className="relative z-10">
                <div
                  className={`w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md`}
                >
                  <div className="w-6 h-6">{step.icon}</div>
                </div>

                <h3 className="text-lg lg:text-xl font-bold mb-2 text-gray-800">
                  {step.title}
                </h3>
                <p className="text-sm lg:text-base text-gray-600">
                  {step.description}
                </p>

                <div className="mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span
                    className={`text-xs lg:text-sm font-medium ${
                      activeTab === "workers"
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}
                  >
                    Step {index + 1}
                  </span>
                  <span className="text-xs lg:text-sm text-gray-500 font-medium flex items-center">
                    <CheckCircle
                      className="w-3 h-3 mr-1 lg:w-4 lg:h-4"
                      strokeWidth={2}
                    />
                    {step.stats}
                  </span>
                </div>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="hidden md:flex absolute top-1/2 -mt-4 right-0 translate-x-1/2 z-10 opacity-70">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                    activeTab === "workers"
                      ? "from-green-400 to-teal-500"
                      : "from-teal-400 to-blue-500"
                  } flex items-center justify-center text-white`}
                >
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden relative"
    >
      {/* Floating background elements */}
      <div className="absolute w-64 h-64 rounded-full bg-green-50 -top-32 -left-32 blur-3xl opacity-40"></div>
      <div className="absolute w-64 h-64 rounded-full bg-blue-50 -bottom-32 -right-32 blur-3xl opacity-40"></div>
      <div className="absolute w-48 h-48 rounded-full bg-teal-50 top-1/3 right-0 blur-3xl opacity-30"></div>
      <div className="absolute w-48 h-48 rounded-full bg-purple-50 bottom-1/3 left-0 blur-3xl opacity-30"></div>

      <div
        className={`text-center mb-12 lg:mb-16 relative transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <span className="inline-block py-1 px-4 rounded-full bg-gray-100 text-gray-800 text-xs lg:text-sm font-medium mb-4">
          Simple Process
        </span>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          How it{" "}
          <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
            works
          </span>
        </h2>

        <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full mb-4 lg:mb-6 transition-all duration-500 hover:w-32"></div>

        <p className="text-gray-600 max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
          A seamless experience for both workers and employers, with no
          complicated processes
        </p>

        <div className="animate-bounce absolute left-1/2 -translate-x-1/2 mt-6 opacity-50">
          <ArrowDown className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      {/* Stats Section */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mb-12 lg:mb-16 transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 flex items-center hover:shadow-xl transition-all duration-300"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                index === 0
                  ? "bg-green-100 text-green-600"
                  : index === 1
                  ? "bg-blue-100 text-blue-600"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-gray-800">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div
        className={`flex justify-center mb-8 lg:mb-12 transition-all duration-1000 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="inline-flex p-1.5 rounded-lg bg-gray-100 shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                activeTab === tab.id
                  ? tab.id === "workers"
                    ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md"
                    : "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div
        className={`bg-white rounded-2xl p-6 md:p-8 lg:p-12 shadow-xl border border-gray-100 relative overflow-hidden transition-all duration-1000 delay-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Background decoration */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 opacity-5 bg-gradient-to-br ${
            activeTab === "workers"
              ? "from-green-500 to-teal-500"
              : "from-teal-500 to-blue-500"
          }`}
        ></div>

        <div
          className={`transition-all duration-500 ${
            activeTab === "workers" ? "block opacity-100" : "hidden opacity-0"
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-gray-900">
              Find Work Without Experience
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
              Looking for work but don't have formal experience or skills? No
              problem! Our platform makes it easy for anyone to find local gigs
              in just three simple steps.
            </p>
          </div>
          {renderSteps(workerSteps)}
        </div>

        <div
          className={`transition-all duration-500 ${
            activeTab === "employers" ? "block opacity-100" : "hidden opacity-0"
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-gray-900">
              Hire Reliable Help Quickly
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
              Need reliable help for short-term tasks? We've got you covered!
              Our platform lets you quickly find workers for a variety of jobs
              with a simple three-step process.
            </p>
          </div>
          {renderSteps(employerSteps)}
        </div>
      </div>

      {/* Testimonials */}
      <div
        className={`mt-16 transition-all duration-1000 delay-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-gray-900">
            What People Are{" "}
            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Saying
            </span>
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full mb-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start mb-4">
                <div>
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 italic">{item.quote}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div
        className={`mt-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl p-8 md:p-12 shadow-xl text-white text-center transition-all duration-1000 delay-1200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-white text-opacity-90 mb-8 text-sm sm:text-base">
            Join thousands of workers and employers who have already discovered
            the easiest way to connect.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <button className="bg-white text-teal-600 py-3 px-8 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                <Calendar className="w-5 h-5 mr-2" />
                Sign Up Now
              </button>
            </Link>

            <Link href="#contact">
              <button className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                <PhoneCall className="w-5 h-5 mr-2" />
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div
        className={`mt-16 flex justify-center space-x-8 md:space-x-16 transition-all duration-1000 delay-1300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center text-gray-400">
          <Award className="w-6 h-6 mr-2" />
          <span className="text-sm font-medium">Trusted Service</span>
        </div>
        <div className="flex items-center text-gray-400">
          <FaBolt className="w-6 h-6 mr-2" />
          <span className="text-sm font-medium">Quick Connections</span>
        </div>
        <div className="hidden md:flex items-center text-gray-400">
          <FaBell className="w-6 h-6 mr-2" />
          <span className="text-sm font-medium">Instant Updates</span>
        </div>
      </div>
    </section>
  );
};

export default How;
