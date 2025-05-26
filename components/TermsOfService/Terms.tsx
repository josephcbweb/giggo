"use client";
import React, { useState } from "react";

interface TermsOfServiceProps {
  onAccept?: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onAccept }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleAccept = () => {
    setIsOpen(false);
    if (onAccept) onAccept();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Giggo Terms of Service
            </h1>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Last Updated: April 1, 2025
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              1. Introduction
            </h2>
            <p className="text-gray-600">
              Welcome to Giggo! These Terms of Service ("Terms") govern your use
              of our platform and services. By accessing or using Giggo, you
              agree to be bound by these Terms.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              2. User Responsibilities
            </h2>
            <p className="text-gray-600">
              You agree to use Giggo only for lawful purposes and in accordance
              with these Terms. You are responsible for all content you post and
              activities you conduct through the platform.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              3. Service Modifications
            </h2>
            <p className="text-gray-600">
              Giggo reserves the right to modify or discontinue the service at
              any time without notice. We shall not be liable to you or any
              third party for any modification, suspension, or discontinuance.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              4. Termination
            </h2>
            <p className="text-gray-600">
              We may terminate or suspend your account immediately for any
              reason, including without limitation if you breach these Terms.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              5. Governing Law
            </h2>
            <p className="text-gray-600">
              These Terms shall be governed by the laws of [Your Jurisdiction]
              without regard to its conflict of law provisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
