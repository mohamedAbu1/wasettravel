"use client";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { StyledDatePicker } from "../app/HomeStyled.js";
import { useData } from "@/context/DataContext.jsx";
import { useTheme } from "@/context/ThemeContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
const CalendarSC = () => {
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  const {
    setArrival,
    arrival,
    departure,
    setDeparture,
    addDays,
    startDate,
    DayWithIcon,
  } = useData();
  const { themeName } = useTheme();
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* Arrival */}
        <div className="flex-1 min-w-[120px] flex flex-col rounded-b-2xl">
          <StyledDatePicker
            label="Check-in"
            value={arrival}
            onChange={(date) => setArrival(date)}
            slots={{ day: DayWithIcon }}
            slotProps={{
           

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
                    background: "linear-gradient(to right, #C9A34A, #B9972F)",
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
                      background: "linear-gradient(to right, #FFF8E1, #FFE082)",
                      color: "#B9972F",
                      transform: "scale(1.05)",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    },
                    "&.Mui-selected": {
                      background: "linear-gradient(to right, #C9A34A, #B9972F)",
                      color: "#fff",
                      fontWeight: 600,
                      boxShadow: "0 0 0 2px rgba(201,163,74,0.30)",
                    },
                    "&.Mui-selected:hover": {
                      background: "linear-gradient(to right, #B9972F, #A67C00)",
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
          <StyledDatePicker
            label="Check-out"
            value={departure}
            onChange={setDeparture}
            minDate={startDate ? addDays(startDate, 7) : addDays(new Date(), 4)}
            // استخدم slots لتعويض اختلافات الإصدارات
            slots={{ day: DayWithIcon }}
            slotProps={{
              
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
                    background: "linear-gradient(to right, #C9A34A, #B9972F)",
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
                      background: "linear-gradient(to right, #FFF8E1, #FFE082)",
                      color: "#B9972F",
                      transform: "scale(1.05)",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    },
                    "&.Mui-selected": {
                      background: "linear-gradient(to right, #C9A34A, #B9972F)",
                      color: "#fff",
                      fontWeight: 600,
                      boxShadow: "0 0 0 2px rgba(201,163,74,0.30)",
                    },
                    "&.Mui-selected:hover": {
                      background: "linear-gradient(to right, #B9972F, #A67C00)",
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
    </>
  );
};

export default CalendarSC;
