import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { auth } from "@/auth";
import dynamic from "next/dynamic";
import LogOutButton from "./LogOutButton";

const DropdownMenu = dynamic(() => import("./DropdownMenu"));

const DashNav = async () => {
  const session = await auth();
  const name = session?.user?.name;
  const image = session?.user?.image;
  return (
    <nav className=" text-black flex justify-center items-center w-full">
      <div className="w-screen bg-white p-2">
        <div className="flex justify-between mx-4">
          <div className="flex items-center">
            <Link className="flex gap-3 items-center h-full" href={"/"}>
              <Image src="/logo-color.png" width={45} height={45} alt="logo" />
              <p className="text-2xl text-black font-semibold relative bottom-1">
                giggo
              </p>
            </Link>
          </div>
          <div className="flex gap-4 text-black items-center">
            {session ? (
              <div className="profile">
                <div className="md:hidden ">
                  <DropdownMenu name={name ?? ""} image={image ?? ""} />
                </div>
                <div className=" gap-6 items-center hidden md:inline-flex">
                  <Link href={"/applied"} className="hover:text-teal-400">
                    Applied Jobs
                  </Link>
                  <Link href={"/listings"} className="hover:text-teal-400">
                    Listings
                  </Link>
                  <Link href={"/create"} className="hover:text-teal-400">
                    Create
                  </Link>
                  <div className="flex items-center justify-center">
                    <Link
                      href={"/profile"}
                      className="flex gap-2 items-center hover:bg-stone-200 p-2 rounded-lg hover:text-black"
                    >
                      <Image
                        src={image || "/user/avatar.jpg"}
                        alt="Profile"
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      <span>{name}</span>
                    </Link>
                    <LogOutButton />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="hidden md:block">
                  <Button variant={"secondary"}>Login</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="ghost">Signup</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashNav;
