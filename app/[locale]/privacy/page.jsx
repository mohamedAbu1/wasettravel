import React from "react";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Privacy Policy
        </h1>

        {/* Introduction */}
        <p className="mb-4">
          At <strong>WasetTravelAuth</strong>, we are committed to protecting
          your personal information. This Privacy Policy explains how we
          collect, use, and safeguard your data when you use our application.
        </p>

        {/* Data we collect */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Your name and profile picture from Facebook.</li>
          <li>Your email address.</li>
          <li>Any other information you choose to share through login.</li>
        </ul>

        {/* How we use data */}
        <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Data</h2>
        <p className="mb-4">
          We use your information solely for login, account creation, and
          enhancing your experience on our platform. We do not sell or share
          your data with unnecessary third parties.
        </p>

        {/* Data protection */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Data Protection</h2>
        <p className="mb-4">
          Your data is stored securely using services such as Supabase, with
          encryption and security measures to prevent unauthorized access.
        </p>

        {/* User rights */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights</h2>
        <p className="mb-4">
          You have the right to access, modify, or request deletion of your
          data at any time via our{" "}
          <a href="/data-deletion" className="text-blue-600 underline">
            Data Deletion page
          </a>.
        </p>

        {/* Contact */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:{" "}
          <a href="mailto:support@wasettravel.com" className="text-blue-600 underline">
            support@wasettravel.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
