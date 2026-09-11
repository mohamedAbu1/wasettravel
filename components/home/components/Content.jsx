"use client";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';
import { useTheme } from "@/context/ThemeContext";
import { useData } from "@/context/DataContext";
import React from "react";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import CalendarClient from "./CalendarWrapper";
import CitySelect from "./CitySelect";
import CategorySelect from "./CategorySelect";
import PriceSelect from "./PriceSelect";
import { useRouter } from "next/navigation";

const Content = () => {
  const { theme } = useTheme();
  const { setCity, city, setPrice,price, group_price , tripType, setTripType } = useData();

  const { i18n, t } = useTranslation("home");
  const currentLang = i18n.language || "en";
  const { cities: allCities, categories: allCategories } =
    useCitiesCategories();

  const router = useRouter();

  const isFormValid = city && price  && tripType;
  const handleSearch = () => {
    // نبني الكويري مباشرة من القيم الحالية في الانبوتات
    const queryObj = {
      city: [city],
      category: [tripType],
      group_price : group_price ,
      popular: false,
    };

    const encoded = btoa(JSON.stringify(queryObj));

    // التحويل إلى صفحة الرحلات مع الكويري الجديد
    router.push(`/trips?data=${encoded}`);
  };

  return (
    <div className="order-2 flex w-full flex-col items-center justify-center px-2 text-center">
      <div className="w-full max-w-6xl">
        {/* Company Name */}
        <h1
          className="sr-only"
        >
          WasetTravel
        </h1>

        <p
          className="mx-auto mt-2 max-w-2xl text-sm font-medium uppercase tracking-[0.22em] text-white/80 sm:text-base"
        >
          {t("Discover")}
        </p>

        {/* Trip Filter Form */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(5, 1fr)" },
            gap: { xs: 1.5, sm: 2 },
            mt: { xs: 3, sm: 4 },
            p: { xs: 1.5, sm: 2.5 },
            borderRadius: 3,
            backdropFilter: "blur(12px)",
            backgroundColor: theme.inputBg,
            border: `1px solid ${theme.inputBorder}`,
            boxShadow: theme.shadow,
          }}
        >
          {/* Inputs Filter */}
          <CitySelect
            allCities={allCities}
            currentLang={currentLang}
            city={city}
            setCity={setCity}
            t={t}
            theme={theme}
          />

          <CategorySelect
            allCategories={allCategories}
            currentLang={currentLang}
            tripType={tripType}
            setTripType={setTripType}
            t={t}
          />

          <PriceSelect group_price={group_price} setPrice={setPrice} t={t} theme={theme} />

          {/* Calendar */}
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
              textTransform: "none",
              minHeight: 64,
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "#B9972F",
                boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
              },
            }}
          >
            {t("Search")}
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Content;
