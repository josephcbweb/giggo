"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const Contact = () => {
  const [charCount, setCharCount] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [sending, setSending] = useState(false);
  const [contactButtonText, setContactButtonText] = useState("Submit");
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setSending(true);
    setContactButtonText("Sending...");
    e.preventDefault();
    const formData = {
      firstName,
      email,
      phone,
      message,
      countryCode,
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const result = await response.json();
    if (result.success) {
      setContactButtonText("Send successfully");
      setTimeout(() => setContactButtonText("Submit"), 3000);
      setFirstName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setCountryCode("");
    }
    setSending(false);
  };
  const countryCodes = [
    { value: "+62", label: "Indonesia (+62)" },
    { value: "+91", label: "India (+91)" },
    { value: "+1", label: "USA (+1)" },
    { value: "+44", label: "United Kingdom (+44)" },
    { value: "+61", label: "Australia (+61)" },
    { value: "+81", label: "Japan (+81)" },
    { value: "+49", label: "Germany (+49)" },
    { value: "+33", label: "France (+33)" },
    { value: "+39", label: "Italy (+39)" },
    { value: "+7", label: "Russia (+7)" },
    { value: "+86", label: "China (+86)" },
    { value: "+55", label: "Brazil (+55)" },
    { value: "+27", label: "South Africa (+27)" },
    { value: "+64", label: "New Zealand (+64)" },
    { value: "+971", label: "United Arab Emirates (+971)" },
    { value: "+66", label: "Thailand (+66)" },
    { value: "+34", label: "Spain (+34)" },
    { value: "+52", label: "Mexico (+52)" },
    { value: "+63", label: "Philippines (+63)" },
    { value: "+20", label: "Egypt (+20)" },
    { value: "+90", label: "Turkey (+90)" },
    { value: "+60", label: "Malaysia (+60)" },
    { value: "+82", label: "South Korea (+82)" },
    { value: "+92", label: "Pakistan (+92)" },
    { value: "+880", label: "Bangladesh (+880)" },
  ];

  return (
    <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8" id="contact">
      <div className="w-4xl mx-auto bg-gradient-to-r from-blue-200 to-blue-300 rounded-xl shadow-lg p-6 md:p-8 md:w-2/3">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <div className="space-y-2">
            <p className="text-lg text-gray-700">
              Email, call, or complete the form to learn how Giggo can reach out
              to you.
            </p>
            <p className="text-lg text-gray-700">info@giggo.io</p>
            <p className="text-lg text-gray-700">+91 987 645 32 19</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Customer Support */}
          <div className="bg-white/30 p-4 rounded-lg backdrop-blur-sm">
            <h5 className="font-semibold text-gray-900 mb-2">
              Customer Support
            </h5>
            <p className="text-sm text-gray-700">
              Our support team is available 24/7 to address any concerns.
            </p>
          </div>

          {/* Feedback and Suggestions */}
          <div className="bg-white/30 p-4 rounded-lg backdrop-blur-sm">
            <h5 className="font-semibold text-gray-900 mb-2">
              Feedback & Suggestions
            </h5>
            <p className="text-sm text-gray-700">
              Help us improve by sharing your valuable feedback.
            </p>
          </div>

          {/* Media Inquiries */}
          <div className="bg-white/30 p-4 rounded-lg backdrop-blur-sm">
            <h5 className="font-semibold text-gray-900 mb-2">
              Media Inquiries
            </h5>
            <p className="text-sm text-gray-700">
              Contact our PR team at media@giggo.io for press-related questions.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Get in Touch
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <select
                className="p-3 border rounded-lg md:w-1/3 focus:ring-2 focus:ring-blue-300"
                onChange={(e) => setCountryCode(e.target.value)}
              >
                {countryCodes.map((code) => (
                  <option key={code.value} value={code.value}>
                    {code.label}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
            </div>

            <div className="relative">
              <textarea
                placeholder="How can we help?"
                maxLength={120}
                onChange={(e) => {
                  handleTextareaChange(e);
                  setMessage(e.target.value);
                }}
                value={message}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 resize-none"
                rows={4}
              />
              <span className="absolute bottom-2 right-2 text-sm text-gray-400">
                {charCount}/120
              </span>
            </div>

            <button
              disabled={sending}
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <motion.span
                animate={sending ? { x: [-5, 5, -5] } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {contactButtonText}
              </motion.span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
