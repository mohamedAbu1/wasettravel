"use client";
import React, { useState } from "react";
import TripsFilter from "@/components/trips/TripsFilter";
import TripsSearch from "@/components/trips/TripsSearch";
import TripsGrid from "@/components/trips/TripsGrid";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import EgyptianBackground from "@/components/trips/EgyptianBackground"; // استدعاء الخلفية

export default function TripsPage() {
  const trips = [
    {
      title: "Nile Cruise",
      city: "Cairo",
      category: "Cruise",
      price: 500,
      popular: true,
      img: "/HomePageImage/pexels-radwa-magdy-1718930-21668633.webp",
    },
    {
      title: "Desert Safari",
      city: "Siwa",
      category: "Adventure",
      price: 300,
      popular: false,
      img: "/HomePageImage/pexels-ozgomz-7566890.webp",
    },
    {
      title: "Red Sea Diving",
      city: "Hurghada",
      category: "Diving",
      price: 700,
      popular: true,
      img: "/HomePageImage/pexels-ozgomz-7566888.webp",
    },
    {
      title: "Nile Cruise",
      city: "Cairo",
      category: "Cruise",
      price: 500,
      popular: true,
      img: "/HomePageImage/pexels-oualid-soussi-2150533856-35050672.webp",
    },
    {
      title: "Desert Safari",
      city: "Siwa",
      category: "Adventure",
      price: 300,
      popular: false,
      img: "/HomePageImage/pexels-furknsaglam-1596977-21348185.webp",
    },
    {
      title: "Red Sea Diving",
      city: "Hurghada",
      category: "Diving",
      price: 700,
      popular: true,
      img: "/HomePageImage/pexels-yasmine-qasem-1054896-2034684.webp",
    },
    {
      title: "Luxor Temples",
      city: "Luxor",
      category: "Historical",
      price: 400,
      popular: true,
      img: "/HomePageImage/luxor-temple.webp",
    },
    {
      title: "Aswan Tour",
      city: "Aswan",
      category: "Historical",
      price: 350,
      popular: false,
      img: "/HomePageImage/aswan-tour.webp",
    },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [cardStyle, setCardStyle] = useState("vertical");

  const tripsPerPage = cardStyle === "vertical" ? 6 : 4;
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    category: "",
    price: "",
    popular: false,
  });

  // فلترة الرحلات
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCity = filters.city ? trip.city === filters.city : true;
    const matchesCategory = filters.category
      ? trip.category === filters.category
      : true;
    const matchesPrice = filters.price
      ? trip.price <= parseInt(filters.price)
      : true;
    const matchesPopular = filters.popular ? trip.popular : true;
    return (
      matchesSearch &&
      matchesCity &&
      matchesCategory &&
      matchesPrice &&
      matchesPopular
    );
  });

  // حساب البفكيشن
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = filteredTrips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(filteredTrips.length / tripsPerPage);

  return (
    <main className="relative flex flex-col min-h-screen justify-center items-center">
      {/* خلفية الرموز الفرعونية */}
      <EgyptianBackground />

      <Header />

      {/* المحتوى الرئيسي */}
      <section
        style={{ marginTop: "85px", paddingBottom: "20px" }}
        className="container flex flex-1 gap-6 px-6 relative z-10"
      >
        {/* الفلتر في الجانب الأيسر */}
        <div className="w-1/4">
          <TripsFilter filters={filters} setFilters={setFilters} />
        </div>

        {/* البحث + الرحلات في الجانب الأيمن */}
        <div className="flex-1 flex flex-col gap-6">
          <TripsSearch
            search={search}
            setSearch={setSearch}
            cardStyle={cardStyle}
            setCardStyle={setCardStyle}
          />
          <TripsGrid trips={currentTrips} cardStyle={cardStyle} />
          {/* البفكيشن */}
          {/* البفكيشن */}{" "}
          <div className="flex justify-center gap-2 mt-4">
            {" "}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  currentPage === i + 1
                    ? "bg-[#c9a34a] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {" "}
                {i + 1}{" "}
              </button>
            ))}{" "}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
