"use client";
import React, { useState, useEffect } from "react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import {
  FaMoneyBill,
  FaClock,
  FaMapMarker,
  FaTags,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { Input } from "../ui/input";

interface UserInfo {
  name: string;
  email: string;
  image?: string;
  location?: {
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

interface Filters {
  payMin: number;
  payMax: number;
  duration: string;
  radius: number;
  categories: { [key: string]: boolean };
}

interface SidebarProps {
  userInfo: UserInfo;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  selectedLocation: {
    address: string;
    coordinates?: { lat: number; lng: number };
  } | null;
}

interface Category {
  _id: string;
  name: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  userInfo,
  filters,
  setFilters,
  selectedLocation,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const user = {
    name: userInfo?.name,
    email: userInfo?.email,
    image: userInfo?.image || "/user/avatar.jpg",
  };

  const handleCategoryChange = (catId: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: { ...prev.categories, [catId]: !prev.categories[catId] },
    }));
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleIconClick = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setCategories(data);

        const initialCategories = data.reduce(
          (acc: { [key: string]: boolean }, cat: Category) => {
            acc[cat._id] = false;
            return acc;
          },
          {}
        );

        setFilters((prev) => ({
          ...prev,
          categories: initialCategories,
        }));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const radiusOptions = [1, 5, 10, 20, 50];

  return (
    <div
      className={`flex flex-col transition-all duration-300 ease-in-out bg-white text-black border-r-2 border-t-2 rounded-tr-lg border-slate-500 shadow-lg ${
        isOpen ? "w-full md:w-72" : "w-16"
      }`}
    >
      <button
        className="p-3 hover:bg-gray-800 hover:text-white text-black transition-colors duration-200 rounded-lg m-2"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? (
          <GoSidebarCollapse size={25} />
        ) : (
          <GoSidebarExpand size={25} />
        )}
      </button>
      {isOpen ? (
        <div className="flex flex-col gap-4 p-4 h-full">
          <div className="border-b border-gray-200 pb-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleDropdown("payRange")}
            >
              <h4 className="text-sm font-semibold text-slate-800">
                Pay Range
              </h4>
              <span className="text-slate-800">
                {activeDropdown === "payRange" ? (
                  <FaChevronUp size={16} />
                ) : (
                  <FaChevronDown size={16} />
                )}
              </span>
            </div>
            {activeDropdown === "payRange" && (
              <div className="mt-2 space-y-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                  value={filters.payMin === 0 ? "" : filters.payMin}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      payMin: Number(e.target.value),
                    }))
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                  value={filters.payMax === 0 ? "" : filters.payMax}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      payMax: Number(e.target.value),
                    }))
                  }
                />
              </div>
            )}
          </div>
          <div className="border-b border-gray-200 pb-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleDropdown("jobDuration")}
            >
              <h4 className="text-sm font-semibold text-slate-800">
                Job Duration
              </h4>
              <span className="text-slate-800">
                {activeDropdown === "jobDuration" ? (
                  <FaChevronUp size={16} />
                ) : (
                  <FaChevronDown size={16} />
                )}
              </span>
            </div>
            {activeDropdown === "jobDuration" && (
              <div className="mt-2">
                <select
                  className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                  value={filters.duration}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                >
                  <option value="">Any</option>
                  <option value="1 Day">1 Day</option>
                  <option value="2 Days">2 Days</option>
                  <option value="3 Days">3 Days</option>
                  <option value="1 Week">1 Week</option>
                  <option value="2 Weeks">2 Weeks</option>
                  <option value="1 Month">1 Month</option>
                  <option value="More than 1 Month">More than 1 Month</option>
                </select>
              </div>
            )}
          </div>
          <div className="border-b border-gray-200 pb-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleDropdown("radius")}
            >
              <h4 className="text-sm font-semibold text-slate-800">
                Within Radius (km)
              </h4>
              <span className="text-slate-800">
                {activeDropdown === "radius" ? (
                  <FaChevronUp size={16} />
                ) : (
                  <FaChevronDown size={16} />
                )}
              </span>
            </div>
            {activeDropdown === "radius" && (
              <div className="mt-2 flex flex-col space-y-2">
                {radiusOptions.map((radius) => (
                  <button
                    key={radius}
                    className={`px-3 py-2 text-sm rounded-lg text-left ${
                      filters.radius === radius
                        ? "bg-green-100 text-green-800"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setFilters((prev) => ({ ...prev, radius }))}
                  >
                    Up to {radius} km
                  </button>
                ))}
                {!selectedLocation && (
                  <p className="text-xs text-yellow-600 mt-1">
                    No location selected - radius filter won't be applied
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="border-b border-gray-200 pb-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleDropdown("categories")}
            >
              <h4 className="text-sm font-semibold text-slate-800">
                Categories
              </h4>
              <span className="text-slate-800">
                {activeDropdown === "categories" ? (
                  <FaChevronUp size={16} />
                ) : (
                  <FaChevronDown size={16} />
                )}
              </span>
            </div>
            {activeDropdown === "categories" && (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {categories.map((cat) => (
                  <div key={cat._id} className="flex items-center">
                    <Input
                      type="checkbox"
                      checked={!!filters.categories[cat._id]}
                      onChange={() => handleCategoryChange(cat._id)}
                      className="w-4 h-4 text-black bg-white border-gray-300 rounded focus:ring-black accent-cyan-100"
                    />
                    <span className="ml-2 text-sm text-slate-800">
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-12 space-y-12 p-2">
          <div className="group relative" onClick={handleIconClick}>
            <FaMoneyBill
              size={20}
              className="text-slate-800 cursor-pointer hover:text-gray-300 transition-colors duration-200"
            />
            <div className="absolute left-10 top-0 bg-white text-black text-sm p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {filters.payMin || filters.payMax
                ? `₹${filters.payMin} - ₹${filters.payMax}`
                : "Pay Range"}
            </div>
          </div>
          <div className="group relative" onClick={handleIconClick}>
            <FaClock
              size={20}
              className="text-slate-800 cursor-pointer hover:text-gray-300 transition-colors duration-200"
            />
            <div className="absolute left-10 top-0 bg-white text-black text-sm p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {filters.duration || "Job Duration"}
            </div>
          </div>
          <div className="group relative" onClick={handleIconClick}>
            <FaMapMarker
              size={20}
              className="text-slate-800 cursor-pointer hover:text-gray-300 transition-colors duration-200"
            />
            <div className="absolute left-10 top-0 bg-white text-black text-sm p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {filters.radius ? `${filters.radius} km` : "Radius"}
            </div>
          </div>
          <div className="group relative" onClick={handleIconClick}>
            <FaTags
              size={20}
              className="text-slate-800 cursor-pointer hover:text-gray-300 transition-colors duration-200"
            />
            <div className="absolute left-10 top-0 bg-white text-black text-sm p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {Object.keys(filters.categories).filter(
                (cat) => filters.categories[cat]
              ).length > 0
                ? Object.keys(filters.categories)
                    .filter((cat) => filters.categories[cat])
                    .join(", ")
                : "Categories"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
