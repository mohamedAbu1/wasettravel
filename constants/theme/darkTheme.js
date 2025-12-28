const DarkTheme = {
  name: "dark",

  // خلفية داكنة أنيقة مع لمسة زجاجية
  background: "bg-[rgba(18,18,18,0.95)] backdrop-blur-[18px]",

  // النصوص الأساسية
  text: "text-[#E6DCCF]", // Sand Ivory

  // النصوص الثانوية
  subText: "text-[#B3A58C]", // Muted Taupe

  // العناوين الرئيسية
  title: "text-[#D4AF37] font-extrabold tracking-wide", // Royal Gold

  // العناوين الثانوية
  heading: "text-[#F5DEB3] font-semibold", // Warm Wheat

  // الكروت الزجاجية الداكنة
  card: "bg-[rgba(30,30,30,0.85)] backdrop-blur-[14px] rounded-[18px]",

  // شعار
  logoGradientFrom: "#FFFFFF", // أبيض
  logoGradientTo: "#C9A34A", // ذهبي
  logoBorder: "#C9A34A",

  // طبقة فوق الصور
  overlay: "bg-[rgba(0,0,0,0.1)]",

  // الحدود
  border: "border border-[rgba(212,175,55,0.45)] rounded-[18px]", // Golden Border

  // الظلال
  shadow:
    "shadow-[0_6px_20px_rgba(0,0,0,0.6),inset_0_0_12px_rgba(255,255,255,0.08)]",
  inputBorder: "#C9A34A",

  // الأزرار الأساسية
  buttonPrimary:
    "bg-[#D4AF37] text-black font-semibold rounded-xl px-6 py-3 hover:bg-[#B9972F] transition-all shadow-md hover:shadow-lg",

  // الأزرار الثانوية
  buttonSecondary:
    "bg-[#2A2A2A] text-[#E6DCCF] font-medium rounded-xl px-6 py-3 hover:bg-[#3A3A3A] transition-all border border-[#D4AF37]",

  // الأيقونات
  icon: "text-[#D4AF37]",
  iconInactive: "text-[#8C7C5A]",
  iconHover: "text-[#F5C542] transition-colors",

  // ألوان إضافية للهوية
  night: "bg-[#121212]", // خلفية ليلية
  desertGold: "text-[#D4AF37]", // ذهب صحراوي
  sandIvory: "text-[#E6DCCF]", // عاج رملي
  deepBrown: "text-[#3F3228]", // بني داكن
  crimsonAccent: "text-[#E07A5F]", // لمسة قرمزية
};

export default DarkTheme;
