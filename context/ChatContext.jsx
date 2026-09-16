"use client";
import { createContext, useContext, useState, useCallback } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [messageses, setMessageses] = useState([]);
  const [bookingMode, setBookingMode] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

    // ✅ القيم الخاصة بالحجز
  const [participants, setParticipants] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [checkInPrice, setCheckInPrice] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const openChatWithCarBooking = useCallback(() => {
    setOpen(true);
    setBookingMode(true);
    setMessageses([
      {
        sender: "assistant",
        content: "👋 مرحباً! من أين إلى أين تريد حجز السيارة؟",
      },
    ]);
  }, []);

  const closeChat = () => {
    setOpen(false);
    setBookingMode(false);
    setFrom("");
    setTo("");
  };

  return (
    <ChatContext.Provider
      value={{
        open,
        setOpen,
        messageses,
        setMessageses,
        bookingMode,
        setBookingMode,
        from,
        setFrom,
        to,
        setTo,
        openChatWithCarBooking,
        closeChat,
        participants,
        setParticipants,
        childrenCount,
        setChildrenCount,
        checkInPrice,
        setCheckInPrice,
        checkIn,
        setCheckIn,
        checkOut,
        setCheckOut,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
