import { TripIDProvider } from "./context/TripIDContext";
import { TripProvider } from "./context/TripContext";
import { UserProvider } from "./context/UserContext";
import { ReviewsProvider } from "./context/ReviewsContext";
import { PurchaseProvider } from "./context/PurchaseContext";
import { CitiesCategoriesProvider } from "./context/CitiesCategoriesContext";

export default function AdminLayout({ children }) {
  return (
    <TripProvider>
      <TripIDProvider>
        <UserProvider>
          <ReviewsProvider>
              <PurchaseProvider>
                <CitiesCategoriesProvider>
                  {children}
                </CitiesCategoriesProvider>
              </PurchaseProvider>
            </ReviewsProvider>
        </UserProvider>
      </TripIDProvider>
    </TripProvider>
  );
}
