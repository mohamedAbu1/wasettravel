"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight, FaCheck, FaGlobeAfrica, FaHeadset, FaRoute, FaShieldAlt } from "react-icons/fa";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import SeoHead from "@/components/layout/SeoHead";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import catalog from "@/lib/imageCatalog";

const TestimonialsSection = dynamic(() => import("@/components/b2b/TestimonialsSection"), { ssr: false });
const ChatWidget = dynamic(() => import("@/components/layout/ChatWidget"), { ssr: false });
const LoginModal = dynamic(() => import("@/components/home/components/LoginModal"), { ssr: false });

const services = [
  { icon: FaGlobeAfrica, title: "expertise", description: "expertiseText" },
  { icon: FaShieldAlt, title: "professionalism", description: "professionalismText" },
  { icon: FaRoute, title: "customization", description: "customizationText" },
  { icon: FaHeadset, title: "experience", description: "experienceText" },
];

const B2bPage = () => {
  const { t } = useTranslation("b2b");
  const { lang } = useLanguage();

  return (
    <>
      <SeoHead title="B2B Travel Management Partner in Egypt" description="Discover Waset Travel B2B services for your clients across Egypt." image={catalog.hero} />
      <main className="site-shell min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
        <Header />

        <section className="stone-hero relative overflow-hidden border-b border-[#e0b873]/15">
          <div className="absolute inset-0"><Image src={catalog.hero} alt="Egyptian travel landscape" fill priority sizes="100vw" className="object-cover object-center opacity-45" /><div className="absolute inset-0 bg-[linear-gradient(90deg,#171615_8%,rgba(23,22,21,.86)_42%,rgba(23,22,21,.28),#171615_100%)]" /></div>
          <div className="relative mx-auto grid min-h-[min(700px,86vh)] max-w-7xl items-center gap-10 px-5 py-28 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:px-12">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="max-w-3xl">
              <p className="hero-eyebrow flex items-center gap-3"><span className="hero-eyebrow-line" />Business travel partnerships</p>
              <h1 className="hero-title mt-5 max-w-3xl text-5xl font-semibold leading-[.96] tracking-[-.05em] sm:text-7xl">{t("title")}</h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">{t("intro")}</p>
              <div className="mt-9 flex flex-wrap gap-3"><a href="#contact" className="hero-primary-cta">{t("contactUs")} <FaArrowRight className="text-xs" /></a><Link href={`/${lang}#discover`} className="hero-secondary-cta">Explore our destinations</Link></div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-5 text-sm text-white/60"><span><strong className="text-[#e0b873]">12+</strong> destinations</span><span><strong className="text-[#e0b873]">4.9/5</strong> traveler rating</span><span><strong className="text-[#e0b873]">24/7</strong> local support</span></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7, delay: .15 }} className="hidden justify-end lg:flex"><div className="w-full max-w-sm rounded-[1.5rem] border border-[#e0b873]/30 bg-black/25 p-6 shadow-2xl backdrop-blur-md"><p className="stone-kicker">For travel professionals</p><h2 className="mt-4 text-2xl font-bold text-[#f6eddf]">One trusted partner for every Egypt itinerary.</h2><div className="mt-6 grid gap-3 text-sm text-white/70">{["Tailored programs", "Reliable operations", "Local expertise"].map((item) => <div key={item} className="flex items-center gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#e0b873]/15 text-xs text-[#e0b873]"><FaCheck /></span>{item}</div>)}</div></div></motion.div>
          </div>
        </section>

        <section className="stone-section w-full px-5 sm:px-8"><div className="mx-auto max-w-7xl"><div className="mb-10 max-w-2xl"><p className="stone-kicker mb-3">Built around your business</p><h2 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("whatWeProvide")}</h2><p className="mt-5 text-base leading-7 text-[var(--muted)]">{t("provideText")}</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{services.map(({ icon: Icon, title, description }, index) => <motion.article key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: index * .08 }} viewport={{ once: true }} className="stone-card rounded-[1.25rem] p-6"><div className="mb-8 flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#8f5d2e]/30 bg-[#8f5d2e]/10 text-xl text-[#8f5d2e]"><Icon /></span><span className="text-xs font-bold tracking-[.18em] text-[var(--muted)]">0{index + 1}</span></div><h3 className="text-xl font-bold text-[var(--foreground)]">{t(title)}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{t(description)}</p></motion.article>)}</div></div></section>

        <section className="w-full px-5 pb-16 sm:px-8"><div className="mx-auto grid max-w-7xl overflow-hidden rounded-[1.5rem] border border-[#e0b873]/20 bg-[#25211d] lg:grid-cols-[.9fr_1.1fr]"><div className="relative min-h-[20rem]"><Image src="/iamges/WhatsApp Image 2026-08-20 at 5.12.22 PM.jpeg" alt="Waset Travel team discussing partnership opportunities" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-[#25211d] via-transparent to-transparent lg:bg-gradient-to-r" /></div><div id="contact" className="flex flex-col justify-center px-7 py-10 sm:px-12"><p className="stone-kicker mb-3">Let’s work together</p><h2 className="text-3xl font-bold text-[#f6eddf] sm:text-4xl">Create better Egypt journeys for your clients.</h2><p className="mt-5 max-w-xl leading-7 text-white/60">{t("contactText")}</p><a href="mailto:info@wasettravel.com" className="stone-button mt-8 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3.5 font-bold">{t("contactUs")} <FaArrowRight className="text-xs" /></a></div></div></section>

        <section className="stone-section w-full px-5 sm:px-8"><div className="mx-auto max-w-5xl"><div className="mb-8 text-center"><p className="stone-kicker mb-3">Partner confidence</p><h2 className="text-3xl font-bold sm:text-4xl">What our travelers say</h2></div><TestimonialsSection /></div></section>
        <Footer />
        <ChatWidget />
        <LoginModal />
      </main>
    </>
  );
};

export default B2bPage;
