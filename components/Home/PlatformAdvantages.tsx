"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Star,
  Users,
  Briefcase,
  Clock,
  Check,
  ExternalLink,
  Building,
  UserCheck,
} from "lucide-react";

const LocalAdvantage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section with visual enhancement */}
        <div
          className={`text-center mb-16 max-w-3xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
            <Briefcase className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium text-sm">
              Local Workforce Platform
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Your Neighborhood,{" "}
            <span className="text-indigo-600">Your Opportunity</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Connecting local businesses with immediate staffing solutions and
            community members with flexible work opportunities.
          </p>
        </div>

        {/* Stats section with hover effects */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 text-center transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {[
            { value: "2,500+", label: "Local Businesses", color: "indigo" },
            { value: "10,000+", label: "Active Workers", color: "green" },
            { value: "15 min", label: "Avg. Response Time", color: "orange" },
            { value: "98%", label: "Satisfaction Rate", color: "purple" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`
                bg-white p-4 md:p-6 rounded-xl shadow-sm 
                transition-all duration-300 
                hover:shadow-lg hover:scale-105 
                hover:bg-gray-50
                transform transition-all duration-700
                ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }
              `}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <p
                className={`text-2xl md:text-3xl font-bold text-${stat.color}-600`}
              >
                {stat.value}
              </p>
              <p className="text-sm md:text-base text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Enhanced Grid Layout */}
        <div
          className={`grid md:grid-cols-2 gap-8 lg:gap-12 mb-16 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Business Benefits */}
          <div
            className={`
            bg-white p-8 md:p-10 rounded-xl 
            shadow-md hover:shadow-xl 
            transition-all duration-300 
            border border-gray-100
            hover:scale-[1.02]
            transform transition-all duration-700
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-x-8"
            }
          `}
          >
            <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-6">
              <Building className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              For Businesses
            </h3>
            <ul className="space-y-6">
              {[
                {
                  icon: MapPin,
                  iconBg: "blue",
                  title: "Local Talent Matching",
                  description:
                    "Access a pre-vetted pool of local workers ready to step in when you need them most.",
                },
                {
                  icon: Calendar,
                  iconBg: "purple",
                  title: "On-Demand Staffing",
                  description:
                    "Fill last-minute shifts and seasonal demands with qualified local talent within hours.",
                },
                {
                  icon: Check,
                  iconBg: "teal",
                  title: "Reduced Overhead",
                  description:
                    "Pay only for the hours you need, eliminating costs associated with full-time hiring.",
                },
              ].map((item, index) => (
                <li
                  key={item.title}
                  className={`
                    flex items-start 
                    transform transition-all duration-700
                    ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-8"
                    }
                    hover:translate-x-2 
                    transition-transform duration-300
                  `}
                  style={{ transitionDelay: `${index * 150 + 500}ms` }}
                >
                  <div
                    className={`bg-${item.iconBg}-100 p-2 rounded-full mt-1 mr-4 flex-shrink-0`}
                  >
                    <item.icon className={`h-5 w-5 text-${item.iconBg}-600`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Worker Benefits - Similar structure */}
          <div
            className={`
            bg-white p-8 md:p-10 rounded-xl 
            shadow-md hover:shadow-xl 
            transition-all duration-300 
            border border-gray-100
            hover:scale-[1.02]
            transform transition-all duration-700
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-x-8"
            }
          `}
          >
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-6">
              <UserCheck className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              For Workers
            </h3>
            <ul className="space-y-6">
              {[
                {
                  icon: Clock,
                  iconBg: "orange",
                  title: "Flexible Hours",
                  description:
                    "Work when it fits your schedule — pick up shifts that accommodate your lifestyle.",
                },
                {
                  icon: Star,
                  iconBg: "yellow",
                  title: "Same-Day Pay",
                  description:
                    "Get paid instantly after completing your shift — no more waiting for payday.",
                },
                {
                  icon: Users,
                  iconBg: "red",
                  title: "Career Development",
                  description:
                    "Build your reputation with ratings and unlock higher-paying opportunities.",
                },
              ].map((item, index) => (
                <li
                  key={item.title}
                  className={`
                    flex items-start 
                    transform transition-all duration-700
                    ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-8"
                    }
                    hover:translate-x-2 
                    transition-transform duration-300
                  `}
                  style={{ transitionDelay: `${index * 150 + 500}ms` }}
                >
                  <div
                    className={`bg-${item.iconBg}-100 p-2 rounded-full mt-1 mr-4 flex-shrink-0`}
                  >
                    <item.icon className={`h-5 w-5 text-${item.iconBg}-600`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Testimonial section */}
        <div
          className={`
          bg-indigo-50 rounded-2xl p-8 mb-16
          transform transition-all duration-1000 delay-700
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-6 w-6 text-yellow-500 fill-current"
                />
              ))}
            </div>
            <p className="text-lg md:text-xl text-gray-800 italic mb-6">
              "As a local cafe owner, finding reliable staff during peak seasons
              was always a challenge. This platform connected me with qualified
              workers in my neighborhood within hours of posting. It's been a
              game-changer for our business."
            </p>
            <div>
              <p className="font-semibold text-gray-900">Sarah Johnson</p>
              <p className="text-gray-600 text-sm">Owner, Riverside Cafe</p>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div
          className={`
          bg-gradient-to-r from-indigo-600 to-blue-600 
          rounded-2xl p-8 md:p-12 
          text-center text-white
          transform transition-all duration-1000 delay-900
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          hover:scale-[1.02] 
          transition-transform duration-300
        `}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Ready to transform your local workforce?
          </h3>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of businesses and workers already connecting in your
            community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <button
                className={`
                bg-white text-indigo-600 
                px-8 py-4 rounded-lg 
                hover:bg-gray-100 
                transition-colors 
                font-semibold text-lg 
                w-full sm:w-auto
                hover:scale-105
                active:scale-95
                transform duration-300
                ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }
              `}
              >
                Post a Job
              </button>
            </Link>
            <Link href="/dashboard">
              <button
                className={`
                bg-indigo-800 text-white 
                px-8 py-4 rounded-lg 
                hover:bg-indigo-900 
                transition-colors 
                font-semibold text-lg 
                w-full sm:w-auto 
                border border-indigo-500
                hover:scale-105
                active:scale-95
                transform duration-300
                ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }
              `}
              >
                Find Work Nearby
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalAdvantage;
