// components/layout/SeoHead.jsx
import Head from "next/head";

export default function SeoHead({ title, description, keywords, image }) {
  return (
    <Head>
      {/* Title */}
      <title>{title}</title>

      {/* Meta Description */}
      <meta name="description" content={description} />

      {/* Keywords */}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph (Social Media) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  );
}
