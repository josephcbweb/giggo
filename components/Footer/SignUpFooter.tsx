// components/login/SignUpFooter.tsx
"use client";

import { useState } from "react";
import TermsOfService from "../TermsOfService/Terms";
import PrivacyPolicy from "../privacyPolicy/PrivacyPolicy";

export default function SignUpFooter() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <p className="text-center text-[0.7rem] text-gray-500 ">
        By continuing, you agree to our{" "}
        <button
          onClick={() => setShowTerms(true)}
          className="underline hover:text-gray-700"
        >
          Terms of Service
        </button>{" "}
        and{" "}
        <button
          onClick={() => setShowPrivacy(true)}
          className="underline hover:text-gray-700"
        >
          Privacy Policy
        </button>
      </p>

      {/* Modals */}
      {showTerms && <TermsOfService onAccept={() => setShowTerms(false)} />}
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
    </>
  );
}
