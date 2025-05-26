"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Listings from "./Listings";

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

const DashMain = ({ userInfo }: { userInfo: UserInfo }) => {
  const [filters, setFilters] = useState({
    payMin: 0,
    payMax: 0,
    duration: "",
    radius: 10,
    categories: {} as { [key: string]: boolean },
  });
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates?: { lat: number; lng: number };
  } | null>(null);

  useEffect(() => {
    if (userInfo.location?.address) {
      setSelectedLocation({
        address: userInfo.location.address,
        coordinates: userInfo.location.coordinates,
      });
    }
  }, [userInfo]);

  return (
    <div className="flex flex-col">
      <div className="flex h-screen">
        <Sidebar
          userInfo={userInfo}
          filters={filters}
          setFilters={setFilters}
          selectedLocation={selectedLocation}
        />
        <div className="flex-1 overflow-y-auto border-slate-400 rounded-t-lg border-t-2 border-l-2 ml-1">
          <Listings
            filters={filters}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            userLocation={userInfo.location}
          />
        </div>
      </div>
    </div>
  );
};

export default DashMain;
