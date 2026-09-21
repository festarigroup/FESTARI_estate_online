interface OpenHouse {
  month: string;
  day: string;
  title: string;
  location: string;
  dateTime: string;
}

const OPEN_HOUSES: OpenHouse[] = [
  { month: "May", day: "24", title: "5 Bedroom House", location: "East Legon, Accra", dateTime: "Sat, 24 May - 10:00 AM" },
  { month: "May", day: "26", title: "5 Bedroom House", location: "Adum, Kumasi", dateTime: "Mon, 26 May - 11:00 AM" },
  { month: "May", day: "28", title: "5 Bedroom House", location: "Spintex, Accra", dateTime: "Wed, 28 May - 03:00 PM" },
];

export function UpcomingOpenHousesCard() {
  return (
    <div className="flex w-full flex-col gap-[15px] rounded-[15px] border border-[#e6d7ef] bg-white p-[11px]">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-bold text-gray-700">Upcoming Open Houses</p>
        <button type="button" className="text-[12.5px] font-medium text-brand-600">
          View all
        </button>
      </div>
      <ul className="flex flex-col gap-[15px]">
        {OPEN_HOUSES.map((house, index) => (
          <li key={index} className="flex items-center justify-between gap-2">
            <div className="flex items-start gap-2">
              <div className="flex size-[53px] shrink-0 flex-col items-center justify-center rounded-2xl bg-night-900 text-white">
                <p className="text-[14px] font-extrabold leading-[17px] tracking-tight">{house.month}</p>
                <p className="text-[14px] font-extrabold leading-[17px] tracking-tight">{house.day}</p>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-[11px] font-bold text-gray-700">{house.title}</p>
                <p className="text-[8.5px] text-gray-500">{house.location}</p>
                <p className="text-[9.5px] font-bold text-gray-700">{house.dateTime}</p>
              </div>
            </div>
            <button
              type="button"
              className="flex h-[23px] w-[67px] shrink-0 items-center justify-center rounded-lg border border-brand-900 text-[11px] text-brand-900"
            >
              RSVP
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
