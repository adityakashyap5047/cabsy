import AddDetails from "@/components/booking/AddDetails";
import Checkout from "@/components/booking/Checkout";
import FinalDetails from "@/components/booking/FinalDetails";
import { BookingProvider } from "@/context/BookingContext";

const RidePage = () => {
 
  return (
    <BookingProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 lg:mb-8">
        <p className="my-12 text-[#AE9409] font-[family-name:var(--font-libre-baskerville)] font-semibold text-[33px] leading-[33px]">Please Fill Out All Required Info</p>
        <div data-step="1">
          <AddDetails /> 
        </div>
        <div data-step="2">
          <FinalDetails />
        </div>
        <div data-step="3">
          <Checkout />
        </div>
      </div>
    </BookingProvider>
  );
}

export default RidePage;