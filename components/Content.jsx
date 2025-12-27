"use client";
import { useState } from "react";
import {
  TextField,
  MenuItem,
  InputAdornment,
  Box,
  Button,
} from "@mui/material";
import {
  FaCity,
  FaDollarSign,
  FaUmbrellaBeach,
  FaCalendarAlt,
} from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

const Content = () => {
  const { theme } = useTheme(); // theme يحتوي على خصائص من lightTheme أو darkTheme

  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [tripType, setTripType] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");

  const handleSearch = () => {
    console.log({ city, price, tripType, arrival, departure });
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-30">
      <div className="w-[75%]">
        {/* Company Name */}
        <h1 className={theme.title} style={{ fontSize: "4.4rem" }}>
          WasetTravel
        </h1>

        <p
          className={`text-xl md:text-2xl mt-6 leading-relaxed ${theme.subText} animate-slideUp`}
        >
          Luxury journeys across Egypt’s timeless wonders.
        </p>

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
          {/* City */}
          <TextField
            select
            label="Select City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaCity className={theme.icon} />
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: 3,
              "& .MuiOutlinedInput-root": {
                backgroundColor: theme.inputBg,
                color: theme.inputText,
                "& fieldset": { borderColor: theme.inputBorder },
                "&:hover fieldset": {
                  borderColor: theme.inputFocus,
                  backgroundColor: theme.inputHoverBg,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.inputFocus,
                },
              },
              "& .MuiInputLabel-root": {
                color: theme.inputLabel,
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
              <MenuItem key={c} value={c}>
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
                  <FaDollarSign className={theme.icon} />
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: 3,
              "& .MuiOutlinedInput-root": {
                color: theme.inputText,
                "& fieldset": { borderColor: theme.inputBorder },
                "&:hover fieldset": {
                  borderColor: theme.inputFocus,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.inputFocus,
                },
              },
              "& .MuiInputLabel-root": {
                color: theme.inputLabel,
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
                  <FaUmbrellaBeach style={{ color: "#C9A34A" }} />{" "}
                  {/* أيقونة ذهبية */}
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: 3,
              "& .MuiOutlinedInput-root": {
                color: "#2C2C2C", // نص غامق
                fontWeight: "500",
                letterSpacing: "0.5px",
                transition: "all 0.3s ease",
                "& fieldset": {
                  borderColor: "#C9A34A", // حدود ذهبية
                  borderRadius: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)", // ظل خفيف
                },
                "&:hover fieldset": {
                  borderColor: "#B9972F", // ذهب أغمق عند الهوفر
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#B9972F", // حدود ذهبية عند التركيز
                  boxShadow: "0 0 0 2px rgba(201,163,74,0.25)", // توهج ذهبي
                },
              },
              "& .MuiInputLabel-root": {
                color: "#6E5C4B", // لون الـ Label (رملي)
                fontWeight: "600",
                letterSpacing: "0.4px",
              },
              "& .MuiInputBase-input": {
                color: "#2C2C2C", // لون النص داخل الحقل
                padding: "12px 14px",
              },
              "& .MuiMenuItem-root": {
                fontWeight: "500",
                color: "#2C2C2C",
                "&:hover": {
                  backgroundColor: "#FFF3E0", // خلفية ذهبية فاتحة عند اختيار عنصر
                  color: "#B9972F",
                },
              },
            }}
          >
            {["Luxury", "Cultural", "Safari", "Beach"].map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>

          {/* Arrival */}
          <TextField
            type="date"
            label="Departure"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaCalendarAlt style={{ color: "#C9A34A" }} />{" "}
                  {/* أيقونة ذهبية */}
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
            sx={{
              borderRadius: 3,
              "& .MuiOutlinedInput-root": {
                color: "#2C2C2C", // نص غامق
                fontWeight: "500",
                letterSpacing: "0.5px",
                transition: "all 0.3s ease",
                "& fieldset": {
                  borderColor: "#C9A34A", // حدود ذهبية
                  borderRadius: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)", // ظل خفيف
                },
                "&:hover fieldset": {
                  borderColor: "#B9972F", // ذهب أغمق عند الهوفر
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#B9972F", // حدود ذهبية عند التركيز
                  boxShadow: "0 0 0 2px rgba(201,163,74,0.25)", // توهج ذهبي
                },
              },
              "& .MuiInputLabel-root": {
                color: "#6E5C4B", // لون الـ Label (رملي)
                fontWeight: "600",
                letterSpacing: "0.4px",
              },
              "& .MuiInputBase-input": {
                color: "#2C2C2C", // لون النص داخل الحقل
                padding: "12px 14px",
              },
            }}
          />

          {/* Departure */}
          <TextField
            type="date"
            label="Departure"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaCalendarAlt style={{ color: "#C9A34A" }} />{" "}
                  {/* أيقونة ذهبية */}
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
            sx={{
              borderRadius: 3,
              "& .MuiOutlinedInput-root": {
                color: "#2C2C2C", // نص غامق
                fontWeight: "500",
                letterSpacing: "0.5px",
                transition: "all 0.3s ease",
                "& fieldset": {
                  borderColor: "#C9A34A", // حدود ذهبية
                  borderRadius: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)", // ظل خفيف
                },
                "&:hover fieldset": {
                  borderColor: "#B9972F", // ذهب أغمق عند الهوفر
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#B9972F", // حدود ذهبية عند التركيز
                  boxShadow: "0 0 0 2px rgba(201,163,74,0.25)", // توهج ذهبي
                },
              },
              "& .MuiInputLabel-root": {
                color: "#6E5C4B", // لون الـ Label (رملي)
                fontWeight: "600",
                letterSpacing: "0.4px",
              },
              "& .MuiInputBase-input": {
                color: "#2C2C2C", // لون النص داخل الحقل
                padding: "12px 14px",
              },
            }}
          />

          {/* Search Button */}
          <Button
            variant="contained"
            onClick={handleSearch}
            className={theme.buttonPrimary}
          >
            Search
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Content;
