import ReserveForm from "./ReserveForm";

const hotelNames: Record<number, string> = {
  1: "Labadi Seaside Suites",
  2: "East Legon Grand Hotel",
  3: "Kumasi City Comfort Inn",
  4: "Takoradi Palm Residences",
  5: "Cantonments Skyline Hotel",
  6: "Osu Boutique Stay",
  7: "Ridge Executive Suites",
  8: "Airport City Inn",
  9: "Koforidua Hillview Lodge",
  10: "Tamale Heritage Hotel",
  11: "Cape Coast Ocean Breeze",
  12: "Ho Garden Retreat",
};

export default async function ReservePage({
  params,
}: {
  params: Promise<{ hotelId: string }>;
}) {
  const { hotelId } = await params;
  const numericId = Number(hotelId);
  const title = hotelNames[numericId] ?? "FirstClass Hotel";

  return <ReserveForm numericId={numericId} title={title} />;
}
