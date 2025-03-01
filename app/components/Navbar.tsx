import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 fixed w-full top-0 shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Image src="/images/route.png" alt="RahGuzar Logo" width={50} height={50} />
          <h1 className="text-2xl font-bold">RahGuzar</h1>
        </div>
      </div>
    </nav>
  );
}
