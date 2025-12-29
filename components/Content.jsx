"use client";
import { Box, Button } from "@mui/material";
import { useTheme } from "@/context/ThemeContext";
import CalendarClient from "./CalendarWrapper";
import { useData } from "@/context/DataContext";
import { StyledEngineProvider } from "@mui/material/styles";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import React from "react";
import { FaCity, FaDollarSign, FaUmbrellaBeach } from "react-icons/fa";
// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
const Content = () => {
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  const { themeName, theme } = useTheme();
  const {
    setCity,
    city,
    setPrice,
    price,
    tripType,
    setTripType,
    handleSearch,
  } = useData();
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
            gridTemplateColumns: { xs: "1fr", md: "repeat(5, 1fr)" },
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

          {/* City */}
          <TextField
            select
            label="Select City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaCity
                    className={theme.icon}
                    style={{
                      paddingLeft: "15px",
                      color: themeName === "dark" ? "#C9A34A" : "#fff",
                      fontSize: "35px",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: 3,
              "& .MuiOutlinedInput-root": {
                padding: "5px",
                color: "#2C2C2C",
                fontWeight: "800",
                letterSpacing: "0.5px",
                transition: "all 0.3s ease",
                "& fieldset": {
                  borderColor: "#C9A34A",
                  borderRadius: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                },
                "&:hover fieldset": {
                  borderColor: "#B9972F",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#B9972F",
                  boxShadow: "0 0 0 2px rgba(201,163,74,0.25)",
                },
              },
              "& .MuiInputLabel-root": {
                color: themeName === "dark" ? "#C9A34A" : "#fff",
                fontWeight: "600",
                letterSpacing: "0.4px",
              },
              "& .MuiInputBase-input": {
                color: themeName === "dark" ? "#C9A34A" : "#fff",
                padding: "12px 14px",
              },
              "& .MuiMenuItem-root": {
                fontWeight: "500",
                color: "#2C2C2C",
                borderRadius: "8px",
                margin: "4px 8px",
                padding: "10px 14px",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(to right, #FFF3E0, #FFE0B2)", // خلفية ذهبية فاتحة متدرجة
                  color: "#B9972F",
                  transform: "scale(1.02)", // حركة خفيفة عند الهوفر
                },
                "&.Mui-selected": {
                  background: "linear-gradient(to right, #C9A34A, #B9972F)", // خلفية ذهبية عند الاختيار
                  color: "#fff",
                  fontWeight: "600",
                },
                "&.Mui-selected:hover": {
                  background: "linear-gradient(to right, #B9972F, #A67C00)", // أغمق عند الهوفر مع الاختيار
                },
              },
            }}
          >
            {[
              "Cairo",
              "Giza",
              "Luxor",
              "Aswan",
              "Hurghada",
              "Sharm El-Sheikh",
              "Alexandria",
              "Port Said",
            ].map((c) => (
              <MenuItem
                key={c}
                value={c}
                sx={{
                  backgroundColor: "transparent",
                  fontWeight: 500,
                  color: "#2C2C2C",
                  borderRadius: "8px",
                  margin: "4px 8px",
                  padding: "10px 14px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(to right, #FFF3E0, #FFE0B2)",
                    color: "#B9972F",
                    transform: "scale(1.02)",
                  },
                  "&.Mui-selected": {
                    background: "linear-gradient(to right, #C9A34A, #B9972F)",
                    color: "#fff",
                    fontWeight: "600",
                  },
                  "&.Mui-selected:hover": {
                    background: "linear-gradient(to right, #B9972F, #A67C00)",
                  },
                }}
              >
                {c}
              </MenuItem>
            ))}
          </TextField>

          {/* Price */}
          <TextField
            type="number"
            label="Max Price (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaDollarSign
                    className={theme.icon}
                    style={{
                      paddingLeft: "15px",
                      color: themeName === "dark" ? "#C9A34A" : "#fff",
                      fontSize: "30px",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: 3,
              "& .MuiOutlinedInput-root": {
                padding: "5px",
                color: "#2C2C2C",
                fontWeight: "800",
                letterSpacing: "0.5px",
                transition: "all 0.3s ease",
                "& fieldset": {
                  borderColor: "#C9A34A",
                  borderRadius: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                },
                "&:hover fieldset": {
                  borderColor: "#B9972F",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#B9972F",
                  boxShadow: "0 0 0 2px rgba(201,163,74,0.25)",
                },
              },
              "& .MuiInputLabel-root": {
                color: themeName === "dark" ? "#C9A34A" : "#fff",
                fontWeight: "600",
                letterSpacing: "0.4px",
              },
              "& .MuiInputBase-input": {
                color: themeName === "dark" ? "#C9A34A" : "#fff",
                padding: "12px 14px",
              },
              "& .MuiMenuItem-root": {
                fontWeight: "500",
                color: "#2C2C2C",
                borderRadius: "8px",
                margin: "4px 8px",
                padding: "10px 14px",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(to right, #FFF3E0, #FFE0B2)", // خلفية ذهبية فاتحة متدرجة
                  color: "#B9972F",
                  transform: "scale(1.02)", // حركة خفيفة عند الهوفر
                },
                "&.Mui-selected": {
                  background: "linear-gradient(to right, #C9A34A, #B9972F)", // خلفية ذهبية عند الاختيار
                  color: "#fff",
                  fontWeight: "600",
                },
                "&.Mui-selected:hover": {
                  background: "linear-gradient(to right, #B9972F, #A67C00)", // أغمق عند الهوفر مع الاختيار
                },
              },
            }}
          />

          {/* Trip Type */}
          <TextField
            select
            label="Trip Type"
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaUmbrellaBeach
                    style={{
                      paddingLeft: "12px",
                      color: themeName === "dark" ? "#C9A34A" : "#fff",
                      fontSize: "30px",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: 3,
              "& .MuiOutlinedInput-root": {
                padding: "5px",
                color: "#2C2C2C",
                fontWeight: "600",
                letterSpacing: "0.5px",
                transition: "all 0.3s ease",
                background: "rgba(255,255,255,0.08)", // خلفية زجاجية شفافة
                backdropFilter: "blur(8px)",
                "& fieldset": {
                  borderColor: "#C9A34A",
                  borderRadius: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                },
                "&:hover fieldset": {
                  borderColor: "#B9972F",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  transform: "scale(1.01)", // حركة خفيفة
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#B9972F",
                  boxShadow: "0 0 0 3px rgba(201,163,74,0.25)",
                },
              },
              "& .MuiInputLabel-root": {
                color: themeName === "dark" ? "#C9A34A" : "#fff",
                fontWeight: "800",
                letterSpacing: "0.4px",
                fontSize: "1rem",
              },
              "& .MuiInputBase-input": {
                color: themeName === "dark" ? "#C9A34A" : "#fff",
                padding: "12px 14px",
                fontSize: "1rem",
              },
              "& .MuiMenuItem-root": {
                fontWeight: "500",
                color: "#2C2C2C",
                borderRadius: "8px",
                margin: "4px 8px",
                padding: "10px 14px",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(to right, #FFF3E0, #FFE0B2)",
                  color: "#B9972F",
                  transform: "scale(1.02)",
                },
                "&.Mui-selected": {
                  background: "linear-gradient(to right, #C9A34A, #B9972F)",
                  color: "#fff",
                  fontWeight: "600",
                },
                "&.Mui-selected:hover": {
                  background: "linear-gradient(to right, #B9972F, #A67C00)",
                },
              },
            }}
          >
            {["Luxury", "Cultural", "Safari", "Beach"].map((t) => (
              <MenuItem
                key={t}
                value={t}
                sx={{
                  backgroundColor: "transparent",
                  fontWeight: 500,
                  color: "#2C2C2C",
                  borderRadius: "8px",
                  margin: "4px 8px",
                  padding: "10px 14px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(to right, #FFF3E0, #FFE0B2)",
                    color: "#B9972F",
                    transform: "scale(1.02)",
                  },
                  "&.Mui-selected": {
                    background: "linear-gradient(to right, #C9A34A, #B9972F)",
                    color: "#fff",
                    fontWeight: "600",
                  },
                  "&.Mui-selected:hover": {
                    background: "linear-gradient(to right, #B9972F, #A67C00)",
                  },
                }}
              >
                {t}
              </MenuItem>
            ))}
          </TextField>
          {/* CalendarSC */}
          <StyledEngineProvider injectFirst>
            <CalendarClient />
          </StyledEngineProvider>
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
