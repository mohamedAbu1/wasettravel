module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
    cssnano: {
      preset: "default", // ✅ الإعداد الافتراضي لضغط CSS
    },
  },
};
