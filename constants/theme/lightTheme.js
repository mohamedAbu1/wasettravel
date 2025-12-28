const LightTheme = {
  name: "light",

  // خلفية بيضاء نقية مع لمسة زجاجية
  background: "bg-[rgba(255,255,255,0.95)] backdrop-blur-[16px]",

  // النصوص الأساسية
  text: "text-[#1A1A1A]", // أسود ناعم

  // النصوص الثانوية
  subText: "text-[#6B6B6B]", // رمادي محايد

  // العناوين الرئيسية
  title: "text-[#C9A34A] font-extrabold tracking-wide", // لمسة ذهبية فاخرة

  // العناوين الثانوية
  heading: "text-[#444444] font-semibold", // رمادي داكن أنيق

  // الكروت الزجاجية
  card: "bg-[rgba(255,255,255,0.85)] backdrop-blur-[12px] rounded-[16px]",

  // طبقة فوق الصور
  overlay: "bg-[rgba(0,0,0,0.23)]",

  // الأزرار الأساسية
  buttonPrimary:
    "bg-[#C9A34A] text-white font-semibold rounded-xl px-6 py-3 hover:bg-[#B9972F] transition-all shadow-sm hover:shadow-md tracking-wide uppercase",
  buttonSecondary:
    "bg-[#FFFFFF] text-[#1A1A1A] font-medium rounded-xl px-6 py-3 hover:bg-[#F5F5F5] transition-all border border-[#C9A34A]",

  // الحدود
  border: "border border-[rgba(201,163,74,0.35)] rounded-[16px]",

  // الظلال
  shadow: "shadow-[0_4px_12px_rgba(0,0,0,0.08)]",

  // شعار
  logoGradientFrom: "#fff", // أبيض
  logoGradientTo: "#C9A34A",   // ذهبي
  logoBorder: "#C9A06A",

  // الحقول
  // inputBg: "#FFFFFF",
  inputText: "#1A1A1A",
  inputBorder: "#C9A34A",
  inputFocus: "#B9972F",
  inputHoverBg: "#F5F5F5",
  inputLabel: "#6B6B6B",

  // الأيقونات
  icon: "text-[#C9A34A]",
  iconInactive: "text-[#9E9E9E]",
  iconHover: "text-[#B9972F] transition-colors",

  // ألوان إضافية للهوية
  ivory: "bg-[#FFFFFF]",
  gold: "text-[#C9A34A]",
  gray: "text-[#6B6B6B]",
};

export default LightTheme;
