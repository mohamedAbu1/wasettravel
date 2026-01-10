// app/providers.tsx
"use client";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { ThemeProvider } from "@/context/ThemeContext";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider } from "@/context/AuthContext";
import { SecurityProvider } from "@/context/SecurityContext";
import { TripProvider } from "@/context/TripContext";
import { ReviewsProvider } from "@/context/ReviewsContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CitiesCategoriesProvider } from "@/context/CitiesCategoriesContext";
import { ToastContainer } from "react-toastify";

export default function Providers({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <SecurityProvider>
              <TripProvider>
                <CitiesCategoriesProvider>
                  <LanguageProvider>
                    <ReviewsProvider>
                      <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        theme="colored"
                      />
                      {children}
                    </ReviewsProvider>
                  </LanguageProvider>
                </CitiesCategoriesProvider>
              </TripProvider>
            </SecurityProvider>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
