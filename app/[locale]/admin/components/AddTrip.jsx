"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTrip } from "../context/TripContext";

// استدعاء الكومبوننتات
import BasicInfo from "./components/BasicInfo";
import CoverImageUpload from "./components/CoverImageUpload";
import GalleryUpload from "./components/GalleryUpload";
import TripIncludes from "./components/TripIncludes";
import DailyItinerary from "./components/DailyItinerary";
import SaveButton from "./components/SaveButton";
import TripClassification from "./components/TripClassification";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import TripExclusions from "./components/TripExclusions";
import TripDetailsTable from "./components/TripDetailsTable";

export default function AddTrip() {
  const { tripData, updateTripField, saveTrip } = useTrip();
  const [tripDetails, setTripDetails] = useState([]);
  return (
    <motion.form
      onSubmit={async (e) => {
        e.preventDefault();
        const result = await saveTrip();
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="admin-form-shell"
    >
      <EgyptianBackground />

      <header className="admin-section-header">
        <div>
          <p className="admin-section-eyebrow">Journey studio</p>
          <h2 className="admin-section-title">Add a new trip</h2>
          <p className="admin-section-description">Create a complete itinerary with localized content, media, pricing and inclusions.</p>
        </div>
        <span className="admin-section-badge">Draft</span>
      </header>

      <section className="admin-form-section">
        <div className="admin-form-section__header"><span>01</span><div><h3>Basic information</h3><p>Titles, descriptions and commercial details.</p></div></div>
        <BasicInfo />
      </section>

      <section className="admin-form-section">
        <div className="admin-form-section__header"><span>02</span><div><h3>Classification</h3><p>Help guests discover the right experience.</p></div></div>
        <TripClassification
          category={tripData.categories}
          setCategory={(val) => updateTripField("categories", val)}
          city={tripData.cities}
          setCity={(val) => updateTripField("cities", val)}
          setPriceLevel={(val) => updateTripField("priceLevel", val)}
        />
      </section>

      <section className="admin-form-section">
        <div className="admin-form-section__header"><span>03</span><div><h3>Visual identity</h3><p>Choose a strong cover and supporting gallery.</p></div></div>
        <div className="admin-form-grid">
          <CoverImageUpload
            coverImage={tripData.cover_file}
            setCoverImage={(file) => updateTripField("cover_file", file)}
            coverName={tripData.cover_name}
            setCoverName={(name) => updateTripField("cover_name", name)}
          />
          <GalleryUpload
            galleryImages={tripData.gallery_files}
            setGalleryImages={(files) => updateTripField("gallery_files", files)}
          />
        </div>
      </section>

      <section className="admin-form-section">
        <div className="admin-form-section__header"><span>04</span><div><h3>Guest experience</h3><p>Set expectations and shape the itinerary.</p></div></div>
        <div className="admin-form-stack"><TripIncludes /><TripExclusions /><DailyItinerary /><TripDetailsTable tripDetails={tripDetails} setTripDetails={setTripDetails} /></div>
      </section>

      <footer className="admin-form-footer"><p>Review all language fields before publishing.</p><SaveButton /></footer>
    </motion.form>
  );
}
