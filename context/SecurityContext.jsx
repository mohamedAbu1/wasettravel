"use client";
import React, { createContext, useContext } from "react";

// دوال التحقق
const validateNotEmpty = (value) => {
  return value.trim().length > 0;
};

const validateEmail = (value) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
};

const validatePassword = (value) => value.length >= 8;

const SecurityContext = createContext();

export const SecurityProvider = ({ children }) => {
  const validateField = (fieldName, value) => {
    const normalizedValue = typeof value === "string" ? value : "";
    if (fieldName === "Password") {
      if (!normalizedValue) return `${fieldName} cannot be empty`;
      if (!validatePassword(normalizedValue)) return `${fieldName} must be at least 8 characters`;
      return null;
    }

    if (!validateNotEmpty(normalizedValue)) {
      return `${fieldName} cannot be empty`;
    }
    if (fieldName === "Email" && !validateEmail(normalizedValue)) {
      return "Invalid email format";
    }
    if (fieldName === "Full Name" && !/^[\p{L}\p{M}\p{N}\s.'-]{2,100}$/u.test(normalizedValue)) {
      return `${fieldName} contains invalid characters`;
    }
    return null; // لا يوجد خطأ
  };

  return (
    <SecurityContext.Provider value={{ validateField }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);
