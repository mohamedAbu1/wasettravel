"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useTheme } from "@/context/ThemeContext";

const testimonials = [
  {
    name: "Marieke V",
    text: "Truly excellent! Fantastic! Our guide Aladin is an excellent storyteller who made both our trips an unforgettable experience!",
    rating: 5,
    image: "/iamges/memoji-happy-man-white-background-emoji_826801-6839.webp",
  },
  {
    name: "James R",
    text: "Amazing service and great attention to detail. The team made our Egypt trip smooth and memorable!",
    rating: 5,
    image: "/iamges/usa.webp",
  },
  {
    name: "Sofia L",
    text: "Professional guides and well-organized tours. Highly recommend for anyone visiting Egypt!",
    rating: 4,
    image: "/iamges/woman-human-head-illustration_862994-10854.webp",
  },
];

export default function TestimonialsSection() {
  const { theme } = useTheme(); // ✅ استدعاء الثيم

  return (
    <section className={`py-10 px-6 rounded-lg ${theme.card} ${theme.shadow}`}>
      <Swiper
        navigation={true}
        modules={[Navigation]}
        className="max-w-4xl mx-auto text-center"
      >
        {testimonials.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col items-center space-y-4">
              <div className={`text-4xl ${theme.icon}`}>“</div>
              <p className={`italic max-w-2xl ${theme.text}`}>{item.text}</p>
              <div className={`text-4xl ${theme.icon}`}>”</div>

              {/* النجوم */}
              <div className="flex justify-center text-yellow-400 text-xl">
                {Array(item.rating)
                  .fill()
                  .map((_, i) => (
                    <span key={i}>★</span>
                  ))}
              </div>

              {/* معلومات المستخدم */}
              <div className="flex items-center gap-3 mt-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#C9A34A]"
                />
                <div className={`text-sm ${theme.subText}`}>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs opacity-80">view post</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
