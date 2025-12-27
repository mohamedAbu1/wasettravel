import Image from 'next/image'
import React from 'react'

const TopTripsSection = () => {
  return (
    <section className="py-20 px-6 bg-black/20">
        <h2 className="text-3xl font-bold text-gold mb-10 text-center">
          Top Trips
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Luxor & Aswan Nile Cruise",
              img: "/adssadasda.webp",
              desc: "5 days of luxury sailing through ancient temples.",
            },
            {
              name: "White Desert Adventure",
              img: "/adssadasda.webp",
              desc: "Explore the magical landscapes of the Sahara.",
            },
            {
              name: "Red Sea Relaxation",
              img: "/adssadasda.webp",
              desc: "Enjoy crystal-clear waters and premium resorts.",
            },
          ].map((trip, i) => (
            <div
              key={i}
              className="bg-night/60 border border-gold/20 rounded-xl overflow-hidden shadow-lg"
            >
              <div className="relative h-52">
                <Image
                  src={trip.img}
                  alt={trip.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-gold">{trip.name}</h3>
                <p className="text-sand/80 mt-2">{trip.desc}</p>
                <button className="mt-4 px-5 py-2 bg-crimson text-white rounded-lg hover:bg-crimson/80 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
  )
}

export default TopTripsSection
