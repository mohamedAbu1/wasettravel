import { TripIDProvider } from "./context/TripIDContext";
import { TripProvider } from "./context/TripContext";
import { MessageProvider } from "./context/MessageContext";
import { UserProvider } from "./context/UserContext";
import { ReviewsProvider } from "./context/ReviewsContext";
import { PurchaseProvider } from "./context/PurchaseContext";
import { CitiesCategoriesProvider } from "./context/CitiesCategoriesContext";

export default function AdminLayout({ children }) {
  return (
    <TripProvider>
      <TripIDProvider>
        <UserProvider>
          <MessageProvider>
            <ReviewsProvider>
              <PurchaseProvider>
                <CitiesCategoriesProvider>
                  {children}
                </CitiesCategoriesProvider>
              </PurchaseProvider>
            </ReviewsProvider>
          </MessageProvider>
        </UserProvider>
      </TripIDProvider>
    </TripProvider>
  );
}
