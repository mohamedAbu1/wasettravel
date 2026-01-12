"use client";
import { Box, Button, StyledEngineProvider } from "@mui/material";
import { useTheme } from "@/context/ThemeContext";
import { useData } from "@/context/DataContext";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import React from "react";
import { FaCity, FaDollarSign, FaUmbrellaBeach } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import CalendarClient from "./CalendarWrapper";
const Content = () => {
  const { theme } = useTheme();
  const {
    setCity,
    city,
    setPrice,
    price,
    tripType,
    setTripType,
    handleSearch,
  } = useData();
  const isFormValid = city && price && tripType;
  const { i18n, t } = useTranslation("home");
  const currentLang = i18n.language || "en";
  const { cities: allCities ,categories:allCategories } = useCitiesCategories();
  return (
    <div className="hidden md:flex flex-col items-center justify-center text-center px-6 z-30">
      <div className="w-[85%]">
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
            label={t("SelectCity")}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaCity
                    className={theme.icon}
                    style={{
                      paddingLeft: "15px",
                      color: "#C9A34A",
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
                color: "#C9A34A",
                fontWeight: "600",
                letterSpacing: "0.4px",
              },
              "& .MuiInputBase-input": {
                color: "#C9A34A",
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
            {allCities.map((c) => {
              // اختيار الاسم حسب اللغة الحالية
              const cityName =
                c.name?.[currentLang] || c.name?.["en"] || c.name;

              return (
                <MenuItem
                  key={c.id}
                  value={cityName}
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
                  {cityName}
                </MenuItem>
              );
            })}
          </TextField>

          {/* Trip Type */}
          {/* Categories */}
          <TextField
            select
            label={t("SelectCategory")}
            value={tripType}
            onChange={(e) => setTripType(e.target.value)} // أو setCategory لو عندك state للكاتجري
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaDollarSign
                    style={{
                      paddingLeft: "12px",
                      color: "#C9A34A",
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
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                "& fieldset": {
                  borderColor: "#C9A34A",
                  borderRadius: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                },
                "&:hover fieldset": {
                  borderColor: "#B9972F",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  transform: "scale(1.01)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#B9972F",
                  boxShadow: "0 0 0 3px rgba(201,163,74,0.25)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#C9A34A",
                fontWeight: "800",
                letterSpacing: "0.4px",
                fontSize: "1rem",
              },
              "& .MuiInputBase-input": {
                color: "#C9A34A",
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
            {allCategories.map((cat) => {
              // اختيار الاسم حسب اللغة الحالية من jsonb
              const categoryName =
                cat.name?.[currentLang] || cat.name?.["en"] || cat.name;

              return (
                <MenuItem
                  key={cat.id}
                  value={categoryName}
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
                  {categoryName}
                </MenuItem>
              );
            })}
          </TextField>

          {/* Price */}
          <TextField
            type="number"
            label={t("MaxPrice")}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaDollarSign
                    className={theme.icon}
                    style={{
                      paddingLeft: "0px",
                      color: "#C9A34A",
                      fontSize: "30px",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: 3,
              "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
                {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              "& input[type=number]": {
                MozAppearance: "textfield", // لإخفاء الأسهم في Firefox
              },
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
                color: "#C9A34A",
                fontWeight: "600",
                letterSpacing: "0.4px",
              },
              "& .MuiInputBase-input": {
                color: "#C9A34A",
                padding: "12px 14px",
              },
            }}
          />
          {/* CalendarSC */}
          <StyledEngineProvider injectFirst>
            <CalendarClient />
          </StyledEngineProvider>
          {/* Search Button */}
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!isFormValid}
            sx={{
              backgroundColor: "#C9A34A",
              color: "#fff",
              fontWeight: "600",
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              textTransform: "uppercase",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "#B9972F",
                boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
              },
            }}
          >
            {" "}
            {t("Search")}{" "}
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Content;
