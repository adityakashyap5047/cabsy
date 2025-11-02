import AddDetails from "@/components/booking/AddDetails";
import Checkout from "@/components/booking/Checkout";
import FinalDetails from "@/components/booking/FinalDetails";
import { BookingProvider } from "@/context/BookingContext";

const RidePage = () => {
 
  return (
    <BookingProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="my-12 text-[#AE9409] font-sans font-semibold text-4xl">Please Fill Out All Required Info</p>
        <AddDetails />
        {/* <div data-step="2"> */}
          {/* <SelectVehicle /> */}
        {/* </div> */}
        <div data-step="3">
          <FinalDetails />
        </div>
        <div data-step="4">
          <Checkout />
        </div>
      </div>
    </BookingProvider>
  );
}

export default RidePage;