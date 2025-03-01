import Image from "next/image";

const filters = [
  { label: "All", src: "/images/route.png" },
  { label: "BRTS", src: "/images/peoplebus.png" },
  { label: "People Bus", src: "/images/peoplebus.png" },
  { label: "Local Bus", src: "/images/bus.png" },
  { label: "Chinchi", src: "/images/tuk-tuk.png" },
];

export default function Filters() {
  return (
    <div className="flex justify-center gap-4 my-4">
      {filters.map((filter) => (
        <button
          key={filter.label}
          className="bg-white px-4 py-2 rounded-lg shadow hover:bg-blue-500 hover:text-white transition flex items-center space-x-2"
        >
          <Image src={filter.src} alt={filter.label} width={30} height={30} />
          <span>{filter.label}</span>
        </button>
      ))}
    </div>
  );
}
