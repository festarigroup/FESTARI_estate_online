import Navbar from "@/components/navbar/layout";

export default function Home() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full h-full bg-linear-to-br from-[#BE4D00] to-[#1E3240] shadow-sm rounded-lg">
        <Navbar />
        <div className="p-8 px-32">
          <div className="bg-white rounded-md p-8 text-center text-gray-800">
            <h1 className="text-2xl font-semibold">Welcome to Festari Estate</h1>
            <p className="mt-2 text-sm text-gray-600">
              Use the navigation to explore properties, services, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
