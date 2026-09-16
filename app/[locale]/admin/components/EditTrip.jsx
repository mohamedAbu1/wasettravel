"use client";
import React from "react";
import EditTripBasicInfo from "./components/EditTripBasicInfo";
import EditTripCoverImageUpload from "./components/EditTripCoverImageUpload";
import EditTripGalleryUpload from "./components/EditTripGalleryUpload";
import EditTripClassification from "./components/EditTripClassification";
import EditTripIncludes from "./components/EditTripIncludes";
import EditTripDailyItinerary from "./components/EditTripDailyItinerary";
import EditTripSaveButton from "./components/EditTripSaveButton";
import TripSelector from "./components/TripSelector";
import EditTripExclusions from "./components/EditTripExclusions";
import EditTripDetailsTable from "./components/EditTripDetailsTable";

export default function EditTripFull({ themeName }) {
  return (
    <div className="admin-form-shell">
      <header className="admin-section-header">
        <div>
          <p className="admin-section-eyebrow">Journey studio</p>
          <h2 className="admin-section-title">Edit a trip</h2>
          <p className="admin-section-description">Update content, media and itinerary details without losing the current structure.</p>
        </div>
        <span className="admin-section-badge">Live content</span>
      </header>
      <section className="admin-form-section admin-form-section--compact">
        <div className="admin-form-section__header"><span>01</span><div><h3>Select a journey</h3><p>Load the trip you want to update.</p></div></div>
      <TripSelector />
      </section>
      <section className="admin-form-section">
        <div className="admin-form-section__header"><span>02</span><div><h3>Trip content</h3><p>Keep the story, pricing and classification consistent.</p></div></div>
      <EditTripBasicInfo />
      <EditTripCoverImageUpload />
      <EditTripGalleryUpload />
      <EditTripClassification />
      <EditTripIncludes />
      <EditTripExclusions />
      </section>
      <section className="admin-form-section">
        <div className="admin-form-section__header"><span>03</span><div><h3>Itinerary builder</h3><p>Refine the details guests will use to plan.</p></div></div>
        <EditTripDetailsTable />
      <EditTripDailyItinerary />
      </section>
      <footer className="admin-form-footer"><p>Changes are saved to the selected trip.</p>
      <EditTripSaveButton />
      </footer>
    </div>
  );
}
