"use client";
import { Box, Button } from "@mui/material";
import { useTheme } from "@/context/ThemeContext";
import CalendarClient from "./CalendarWrapper";
import { useData } from "@/context/DataContext";
import InputFilter from "./InputFilter";
// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
const Content = () => {
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  const { theme } = useTheme();
  const {handleSearch} = useData();
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  return (
    <div className="hidden md:flex flex-col items-center justify-center text-center px-6 z-30">
      <div className="w-[75%]">
        {/* Company Name */}
        <h1
          className={theme.title}
          style={{ fontSize: "4.4rem", opacity: "0" }}
        >
          WasetTravel
        </h1>

        <p
          className={`text-xl md:text-2xl mt-6 leading-relaxed ${theme.subText} animate-slideUp`}
        ></p>

        {/* Trip Filter Form */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(6, 1fr)" },
            gap: 2,
            mt: 6,
            p: 3,
            borderRadius: 4,
            backdropFilter: "blur(12px)",
            backgroundColor: theme.inputBg,
            border: `1px solid ${theme.inputBorder}`,
            boxShadow: theme.shadow,
          }}
        >
          {/* Inputs Filter */}

          <InputFilter />
          {/* CalendarSC */}

          <CalendarClient />

          {/* Search Button */}
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              backgroundColor: "#C9A34A", // اللون الأساسي
              color: "#fff", // لون النص
              fontWeight: "600",
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              textTransform: "uppercase",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "#B9972F", // لون عند الـ hover
                boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
              },
            }}
          >
            Search
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Content;
