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
import { addDays } from "date-fns";
import { useTheme } from "@/context/ThemeContext";
import {
  DatePicker,
  DesktopDatePicker,
  LocalizationProvider,
  PickersDay,
} from "@mui/x-date-pickers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CelebrationIcon from "@mui/icons-material/Celebration";
import StarIcon from "@mui/icons-material/Star";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
const Content = () => {
  const { themeName, theme } = useTheme(); // theme يحتوي على خصائص من lightTheme أو darkTheme
  const [city, setCity] = useState("Luxor");
  const [price, setPrice] = useState("150");
  const [tripType, setTripType] = useState("Cultural");
  const [arrival, setArrival] = useState(addDays(new Date(), 2));
  const [departure, setDeparture] = useState(addDays(new Date(), 9));
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSearch = () => {
    console.log({ city, price, tripType, arrival, departure });
  };
  const specialDates = [
    {
      date: new Date(2026, 11, 25),
      type: "Holiday",
      icon: <CelebrationIcon sx={{ color: "#e6c200", fontSize: 18 }} />,
      discount: 0.3,
    },
    {
      date: new Date(2026, 0, 1),
      type: "Newyear",
      icon: <StarIcon sx={{ color: "#C9A34A", fontSize: 18 }} />,
      discount: 0.2,
    },
    {
      date: new Date(2026, 1, 15),
      type: "Offer",
      icon: <LocalOfferIcon sx={{ color: "#B9972F", fontSize: 18 }} />,
      discount: 0.5,
    },
    {
      date: new Date(2026, 1, 14),
      type: "Valentine'sDay",
      icon: <LocalOfferIcon sx={{ color: "#B9972F", fontSize: 18 }} />,
      discount: 0.5,
    },
    {
      date: new Date(2026, 2, 20),
      type: "EidAlFitr",
      icon: <LocalOfferIcon sx={{ color: "#B9972F", fontSize: 18 }} />,
      discount: 0.5,
    },
    {
      date: new Date(2026, 2, 21),
      type: "Mother'sDay",
      icon: <LocalOfferIcon sx={{ color: "#B9972F", fontSize: 18 }} />,
      discount: 0.5,
    },
    {
      date: new Date(2026, 2, 8),
      type: "InternationalWomen'sDay",
      icon: <LocalOfferIcon sx={{ color:  themeName === "dark" ? "#fff" : "#C9A34A", fontSize: 18 }} />,
      discount: 0.5,
    },
    {
      date: new Date(2026, 3, 1),
      type: "Calendar",
      icon: <CalendarMonthIcon sx={{ color: themeName === "dark" ? "#fff" : "#C9A34A", fontSize: 18 }} />,
      discount: 0.1,
    },
  ];
  function DayWithIcon(props) {
    const { day } = props;

    // البحث عن اليوم في المصفوفة
    const special = specialDates.find(
      (item) => item.date.toDateString() === day.toDateString()
    );

    return (
      <Box sx={{ position: "relative" }}>
        <PickersDay {...props} />
        {special && (
          <Box
            sx={{
              position: "absolute",
              right: -6,
              top: -6,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {special.icon}
          </Box>
        )}
      </Box>
    );
  }

  // مصفوفة التواريخ الخاصة

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

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {/* Arrival */}
            <div className="flex-1 min-w-[120px] flex flex-col rounded-b-2xl">
              <DatePicker
                label="Check-in"
                value={arrival}
                onChange={(date) => setArrival(date)}
                slots={{ day: DayWithIcon }}
                slotProps={{
                  textField: {
                    sx:
                      themeName === "dark"
                        ? {
                            "& .MuiOutlinedInput-root": {
                              background: "var(--input-glass-bg)",
                              backdropFilter: "blur(8px)",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--color)",
                              },
                              "&.Mui-focused": {
                                boxShadow: "0 0 0 3px var(--focus-ring)",
                              },
                            },
                            "& .MuiInputBase-input": {
                              color: "var(--input-text)",
                              caretColor: "var(--color)",
                            },
                            "& .MuiInputLabel-root": { color: "var(--color)" },
                          }
                        : {
                            "& .MuiOutlinedInput-root": {
                              background: "var(--input-glass-bg)",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "var(--color)",
                              },
                              "&.Mui-focused": {
                                boxShadow: "0 0 0 3px var(--focus-ring)",
                              },
                            },
                            "& .MuiInputBase-input": {
                              color: "var(--input-text)",
                              caretColor: "var(--color)",
                            },
                            "& .MuiInputLabel-root": { color: "var(--color)" },
                          },
                  },

                  // Popper and calendar
                  popper: {
                    sx: {
                      "& .MuiPaper-root": {
                        borderRadius: "16px",
                        background: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid #C9A34A",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                        padding: "8px",
                      },

                      // Header styling
                      "& .MuiPickersCalendarHeader-root": {
                        background:
                          "linear-gradient(to right, #C9A34A, #B9972F)",
                        color: "#fff",
                        borderRadius: "12px",
                        marginBottom: "8px",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                      },

                      // Days — remove blue/black focus on buttons
                      "& .MuiPickersDay-root": {
                        fontWeight: 500,
                        borderRadius: "8px",
                        transition: "all 0.25s ease",
                        outline: "none",
                        // Prevent default button outline
                        "&:focus": {
                          outline: "none",
                          boxShadow: "0 0 0 3px rgba(201,163,74,0.25)",
                        },
                        "&:hover": {
                          background:
                            "linear-gradient(to right, #FFF8E1, #FFE082)",
                          color: "#B9972F",
                          transform: "scale(1.05)",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        },
                        "&.Mui-selected": {
                          background:
                            "linear-gradient(to right, #C9A34A, #B9972F)",
                          color: "#fff",
                          fontWeight: 600,
                          boxShadow: "0 0 0 2px rgba(201,163,74,0.30)",
                        },
                        "&.Mui-selected:hover": {
                          background:
                            "linear-gradient(to right, #B9972F, #A67C00)",
                          color: "#fff",
                        },
                        "&.Mui-disabled": {
                          color: "#999",
                          opacity: 0.6,
                        },
                      },
                    },
                  },
                }}
              />
            </div>

            {/* Departure */}
            <div className="flex-1 min-w-[200px] flex flex-col">
              <DatePicker
                label="Check-out"
                value={departure}
                onChange={setDeparture}
                minDate={
                  startDate ? addDays(startDate, 7) : addDays(new Date(), 4)
                }
                // استخدم slots لتعويض اختلافات الإصدارات
                slots={{ day: DayWithIcon }}
                slotProps={{
                  textField: {
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        minHeight: "64px",
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: "14px",
                        backdropFilter: "blur(8px)",
                        transition: "all 0.3s ease",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "1px solid #C9A34A",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#B9972F",
                        },
                        "&.Mui-focused": {
                          boxShadow: "0 0 12px rgba(201,163,74,0.4)",
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: "#fff",
                        caretColor: "#C9A34A",
                        fontSize: "18px",
                        fontWeight: 500,
                        padding: "16px 20px",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#C9A34A",
                        fontSize: "16px",
                        fontWeight: 600,
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#B9972F" },
                    },
                  },
                  popper: {
                    sx: {
                      "& .MuiPaper-root": {
                        borderRadius: "16px",
                        background: "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid #C9A34A",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                        padding: "8px",
                        animation: "fadeIn 0.4s ease-out",
                      },
                      "& .MuiPickersCalendarHeader-root": {
                        background:
                          "linear-gradient(to right, #C9A34A, #B9972F)",
                        color: "#fff",
                        borderRadius: "12px",
                        marginBottom: "8px",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                      },
                      "& .MuiPickersDay-root": {
                        fontWeight: 500,
                        borderRadius: "8px",
                        transition: "all 0.25s ease",
                        outline: "none",
                        "&:focus": {
                          outline: "none",
                          boxShadow: "0 0 0 3px rgba(201,163,74,0.25)",
                        },
                        "&:hover": {
                          background:
                            "linear-gradient(to right, #FFF8E1, #FFE082)",
                          color: "#B9972F",
                          transform: "scale(1.05)",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        },
                        "&.Mui-selected": {
                          background:
                            "linear-gradient(to right, #C9A34A, #B9972F)",
                          color: "#fff",
                          fontWeight: 600,
                          boxShadow: "0 0 0 2px rgba(201,163,74,0.30)",
                        },
                        "&.Mui-selected:hover": {
                          background:
                            "linear-gradient(to right, #B9972F, #A67C00)",
                          color: "#fff",
                        },
                        "&.Mui-disabled": { color: "#999", opacity: 0.6 },
                      },
                    },
                  },
                }}
              />
            </div>
          </LocalizationProvider>
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
