"use client";
import { FaGooglePlay, FaApple } from "react-icons/fa";

export default function DownloadAppSection() {
  return (
    <section className="w-full flex md:hidden flex-col items-center justify-center gap-6 py-12 backdrop-blur-[2px] rounded-xl shadow-lg">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 tracking-wide">
        Download Our App Now
      </h2>
      <p className="text-gray-600 text-center max-w-md">
        Enjoy the WasetTravel experience on your mobile device and book your trips easily from anywhere.
      </p>

      {/* Store Links */}
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        {/* Google Play Button */}
        <a
          href="https://play.google.com/store/apps/details?id=your_app_id"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all"
        >
          <FaGooglePlay size={22} />
          <span>Get it on Google Play</span>
        </a>

        {/* Apple App Store Button */}
        <a
          href="https://apps.apple.com/app/your_app_id"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition-all"
        >
          <FaApple size={22} />
          <span>Download on the App Store</span>
        </a>
      </div>
    </section>
  );
}
