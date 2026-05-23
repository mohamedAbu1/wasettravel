import React from "react";

const DataDeletionPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-red-600">
          Data Deletion Instructions
        </h1>

        <p className="mb-4">
          At <strong>WasetTravelAuth</strong>, you have the right to request
          deletion of your personal data at any time.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">How to Request Deletion</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Send an email to{" "}
            <a href="mailto:support@wasettravel.com" className="text-blue-600 underline">
              support@wasettravel.com
            </a> with the subject line <strong>Data Deletion Request</strong>.
          </li>
          <li>
            Include your registered email address and any relevant account details.
          </li>
          <li>
            We will process your request and permanently delete your data within 7 days.
          </li>
        </ul>

        <p className="mt-6">
          If you have any questions, please contact us at{" "}
          <a href="mailto:support@wasettravel.com" className="text-blue-600 underline">
            support@wasettravel.com
          </a>.
        </p>
      </div>
    </div>
  );
};

export default DataDeletionPage;
