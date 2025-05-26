"use client";
import React, { useState } from "react";

interface PrivacyPolicyProps {
  onClose?: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Giggo Privacy Policy
            </h1>
            <button
              onClick={handleClose}
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
            Last Updated: January 1, 2023
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              1. Information We Collect
            </h2>
            <p className="text-gray-600">
              We collect information you provide directly, including name,
              email, payment details, and any content you post. We also
              automatically collect usage data through cookies and similar
              technologies.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              2. How We Use Information
            </h2>
            <p className="text-gray-600">
              We use your information to provide and improve our services,
              communicate with you, prevent fraud, and comply with legal
              obligations.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              3. Information Sharing
            </h2>
            <p className="text-gray-600">
              We may share information with service providers, for legal
              compliance, or during business transfers. We do not sell your
              personal information to third parties.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              4. Data Security
            </h2>
            <p className="text-gray-600">
              We implement appropriate security measures to protect your
              information, but no system is 100% secure. You are responsible for
              maintaining the confidentiality of your account credentials.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              5. Your Rights
            </h2>
            <p className="text-gray-600">
              You may access, correct, or delete your personal information
              through your account settings or by contacting us.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
