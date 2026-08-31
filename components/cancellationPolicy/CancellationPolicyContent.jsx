"use client";
import { motion } from "framer-motion";
import DividerWithIcon from "../layout/DividerWithIcon";
import { useTranslation } from "react-i18next";

export default function CancellationPolicyContent({ theme }) {
  const { t } = useTranslation("cancellationPolicy");

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
      className={`${theme.card} shadow-lg p-10 mt-[-4rem] relative z-10 max-w-5xl mx-auto`}
    >
      <article
        role="article"
        aria-label="Cancellation Policy Content"
        className={`prose max-w-none prose-lg leading-relaxed ${theme.text} flex flex-col gap-3`}
      >
        <h1
          role="heading"
          aria-level={1}
          aria-label={t("title")}
          className={`${theme.title} text-3xl pt-5 capitalize`}
        >
          {t("title")}
        </h1>
        <DividerWithIcon />

        <p>
          <strong className="capitalize">{t("effectiveDateLabel", { defaultValue: "Effective date:" })}</strong> {t("effectiveDate")}
        </p>

        {/* Cancellation Policy */}
        <h2 role="heading" aria-level={2} aria-label={t("cancellationPolicy")} className={theme.heading}>
          {t("cancellationPolicy")}
        </h2>
        <p>{t("cancellationText")}</p>
        <ul aria-label="Cancellation rules list">
          {t("cancellationRules", { returnObjects: true }).map((rule, i) => (
            <li key={i}>{rule}</li>
          ))}
        </ul>
        <p><strong>{t("noteLabel", { defaultValue: "Note:" })}</strong> {t("note")}</p>
        <DividerWithIcon />

        {/* Refunds */}
        <h2 role="heading" aria-level={2} aria-label={t("refunds")} className={theme.heading}>
          {t("refunds")}
        </h2>
        <p>{t("refundsText")}</p>
        <DividerWithIcon />

        {/* Accommodation */}
        <h2 role="heading" aria-level={2} aria-label={t("accommodation")} className={theme.heading}>
          {t("accommodation")}
        </h2>
        <p>{t("accommodationText")}</p>
        <DividerWithIcon />

        {/* Responsibility */}
        <h2 role="heading" aria-level={2} aria-label={t("responsibility")} className={theme.heading}>
          {t("responsibility")}
        </h2>
        <p>{t("responsibilityText")}</p>
        <ul aria-label="Responsibility list">
          {t("responsibilityList", { returnObjects: true }).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <DividerWithIcon />

        {/* Special Requests */}
        <h2 role="heading" aria-level={2} aria-label={t("specialRequests")} className={theme.heading}>
          {t("specialRequests")}
        </h2>
        <p>{t("specialRequestsText")}</p>
        <DividerWithIcon />

        {/* Children Policy */}
        <h2 role="heading" aria-level={2} aria-label={t("childrenPolicy")} className={theme.heading}>
          {t("childrenPolicy")}
        </h2>
        <h4 role="heading" aria-level={3} aria-label={t("packages")} className={theme.subText}>
          {t("packages")}
        </h4>
        <ul aria-label="Children packages list">
          {t("packagesList", { returnObjects: true }).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <h4 role="heading" aria-level={3} aria-label={t("tours")} className={theme.subText}>
          {t("tours")}
        </h4>
        <ul aria-label="Children tours list">
          {t("toursList", { returnObjects: true }).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <DividerWithIcon />

        {/* Tipping */}
        <h2 role="heading" aria-level={2} aria-label={t("tipping")} className={theme.heading}>
          {t("tipping")}
        </h2>
        <p>{t("tippingText")}</p>
        <DividerWithIcon />

        {/* Complaints */}
        <h2 role="heading" aria-level={2} aria-label={t("complaints")} className={theme.heading}>
          {t("complaints")}
        </h2>
        <p>{t("complaintsText")}</p>
        <DividerWithIcon />

        {/* Acceptance */}
        <h2 role="heading" aria-level={2} aria-label={t("acceptance")} className={theme.heading}>
          {t("acceptance")}
        </h2>
        <p>{t("acceptanceText")}</p>
        <DividerWithIcon />

        {/* Contact */}
        <h2 role="heading" aria-level={2} aria-label={t("contact")} className={theme.heading}>
          {t("contact")}
        </h2>
        <ul aria-label="Contact information list">
          <li><strong>{t("ownerLabel")}</strong> {t("owner")}</li>
          <li><strong>{t("emailLabel")}</strong> {t("email")}</li>
          <li><strong>{t("phoneLabel")}</strong> {t("phone")}</li>
        </ul>
      </article>
    </motion.div>
  );
}
