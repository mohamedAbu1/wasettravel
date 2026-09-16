const LightTheme = {
  name: "light",

  // خلفية بيضاء نقية مع لمسة زجاجية
  background: "bg-[#f4eee6] backdrop-blur-[16px]",

  // النصوص الأساسية
  text: "text-[#30271d]", // Warm ink

  // النصوص الثانوية
  subText: "text-[#6f5c49]", // Muted brown

  // العناوين الرئيسية
  title: "text-[#7a4e24] font-extrabold tracking-wide", // Accessible dark gold

  // العناوين الثانوية
  heading: "text-[#4b3828] font-semibold", // Deep brown

  // الكروت الزجاجية
  card: "bg-[#fffaf3] backdrop-blur-[12px] rounded-[16px]",

  // طبقة فوق الصور
  overlay: "bg-[rgba(0,0,0,0.23)]",

  // الأزرار الأساسية
  buttonPrimary:
    "bg-[#8f5d2e] text-white font-semibold rounded-xl px-6 py-3 hover:bg-[#70451f] transition-all shadow-sm hover:shadow-md tracking-wide uppercase",
  buttonSecondary:
    "bg-[#fffaf3] text-[#30271d] font-medium rounded-xl px-6 py-3 hover:bg-[#f4eadc] transition-all border border-[#8f5d2e]",

  // الحدود
  border: "border border-[rgba(112,69,31,0.2)] rounded-[16px]",

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
  icon: "text-[#8f5d2e]",
  iconInactive: "text-[#9E9E9E]",
  iconHover: "text-[#B9972F] transition-colors",

  // ألوان إضافية للهوية
  ivory: "bg-[#FFFFFF]",
  gold: "text-[#8f5d2e]",
  gray: "text-[#6f5c49]",
};

export default LightTheme;
