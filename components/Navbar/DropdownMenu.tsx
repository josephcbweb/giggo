"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
interface DropdownMenuProps {
  name: string;
  image: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ name, image }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".profile-dropdown")) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="">
      <div onClick={toggleDropdown} className="cursor-pointer">
        <Button variant={"ghost"}>
          <Image
            src={image || "/user/avatar.jpg"}
            alt="Profile"
            width={30}
            height={30}
            className="rounded-full"
          />
          <span className="hidden">{name}</span>
          {dropdownOpen ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
        </Button>
      </div>
      {dropdownOpen && (
        <div className="profile-dropdown absolute z-50 mt-4 bg-black shadow-lg rounded-lg py-2 flex flex-col items-center w-40 justify-center animate-dropdown text-white right-2 ">
          <Link
            href="/profile"
            className="dropdown-item px-2 w-[90%] py-2 hover:bg-gray-100 hover:text-slate-800 hover:font-medium rounded-md"
          >
            Account
          </Link>
          <Link
            href="/listings"
            className="dropdown-item px-2 w-[90%] py-2 hover:bg-gray-100 hover:text-slate-800 hover:font-medium rounded-md"
          >
            Listed Jobs
          </Link>
          <Link
            href="/applied"
            className="dropdown-item px-2 w-[90%] py-2 hover:bg-gray-100 hover:text-slate-800 hover:font-medium rounded-md"
          >
            Applied Jobs
          </Link>
          <Link
            href="/create"
            className="dropdown-item px-2 w-[90%] py-2 hover:bg-gray-100 hover:text-slate-800 hover:font-medium rounded-md"
          >
            Create
          </Link>
          <button
            className="dropdown-item px-2 w-[90%] py-2 hover:bg-gray-100 hover:text-slate-800 hover:font-medium rounded-md text-left"
            onClick={async () => {
              await signOut();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
