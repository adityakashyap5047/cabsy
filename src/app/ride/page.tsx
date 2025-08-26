import AddDetails from "@/components/booking/AddDetails";
import SelectVehicle from "@/components/booking/SelectVehicle";

const RidePage = () => {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <p className="my-12 text-[#AE9409] font-sans font-semibold text-4xl">Please Fill Out All Required Info</p>
      <p className="bg-gray-500 px-4 py-1 mx-6">Step 1: Ride Info</p>
      <AddDetails />
      <p className="bg-gray-500 px-4 py-1 mx-6">Step 2: Select Vehicle</p>
      <SelectVehicle />
    </div>
  );
}

export default RidePage;