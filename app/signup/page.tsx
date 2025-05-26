// pages/signup.tsx
import { auth } from "@/auth";
import SignUpFooter from "@/components/Footer/SignUpFooter";
import SignUpButtons from "@/components/signup/SignUpButtons";
import SignUpForm from "@/components/signup/SignUpForm";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await auth();
  if (session) redirect("/dashboard");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="md:w-2/3 lg:w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Image section */}
            <div className="hidden lg:block w-1/2 relative bg-[#EAEBFF] transition-transform">
              <div className="h-full">
                <Image
                  src="/signup/signup.jpg" // Make sure to add a relevant image
                  alt="Join our community"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2 p-8 md:p-12">
              <div className="max-w-sm mx-auto">
                <Link
                  href="/"
                  className="flex items-center gap-3 mb-12 hover:opacity-80 transition-opacity"
                >
                  <div className="relative h-8 w-8">
                    <Image
                      src="/logo-color.png"
                      alt="logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xl font-semibold text-gray-900">
                    Giggo
                  </span>
                </Link>

                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                      Create an account
                    </h1>
                    <p className="text-sm text-gray-600 mt-2">
                      Join our community and start finding opportunities
                    </p>
                  </div>

                  <div className="space-y-6">
                    <SignUpButtons />

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                          or sign up with email
                        </span>
                      </div>
                    </div>

                    <SignUpForm />

                    <p className="text-sm text-center text-gray-600">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Log in
                      </Link>
                    </p>
                  </div>
                  <div className="">
                    <SignUpFooter />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
