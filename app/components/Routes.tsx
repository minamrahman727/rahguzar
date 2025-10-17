
"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Modal from "./modal";

interface Route {
    type: string;
    fare?: number;
    number: string;
    details: string;
    stops: string[];
}

const iconMapping: Record<string, string> = {
    "brts": "/images/peoplebus.png",
    "people-bus": "/images/peoplebus.png",
    "local-bus": "/images/bus.png",
    "chinchi": "/images/tuk-tuk.png",
};


    type RoutesProps = Record<string, never>;

const Routes: React.FC<RoutesProps> = () => {
    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<string | null>(null);

    const openModal = (route: Route) => {
        setSelectedRoute(route);
        setModalOpen(true);
    };

    const closeModalAction = () => {
        setSelectedRoute(null);
        setModalOpen(false);
    };

    const filteredRoutes = useMemo(() => {
        return routes.filter(
            (route) =>
                route.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                route.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                route.stops.some((stop) => stop.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm]);

    const sortedRoutes = useMemo(() => {
        if (!sortBy) return filteredRoutes;
        return filteredRoutes.filter(route => route.type === sortBy);
    }, [filteredRoutes, sortBy]);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="relative mb-8">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder="Search by route number, details, or stops..."
                    aria-label="Search routes"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 pl-12 pr-12 border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm("")}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
                        aria-label="Clear search"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <motion.button
                    onClick={() => setSortBy("brts")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium ${
                        sortBy === "brts"
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    BRT
                </motion.button>
                <motion.button
                    onClick={() => setSortBy("people-bus")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium ${
                        sortBy === "people-bus"
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    People Bus
                </motion.button>
                <motion.button
                    onClick={() => setSortBy("local-bus")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium ${
                        sortBy === "local-bus"
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Local Bus
                </motion.button>
                <motion.button
                    onClick={() => setSortBy("chinchi")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium ${
                        sortBy === "chinchi"
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    chinchi
                </motion.button>
                <motion.button
                    onClick={() => setSortBy(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="px-4 py-2 rounded-full text-sm sm:text-base font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-sm"
                >
                    Clear Sort
                </motion.button>
            </div>

            {sortedRoutes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sortedRoutes.map((route, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(0,0,0,0.15)" }}
                            whileTap={{ scale: 0.98 }}
                            className="cursor-pointer border border-gray-200 p-6 rounded-xl transition-all bg-white"
                            onClick={() => openModal(route)}
                        >
                            <div className="flex items-center space-x-4">
                                <Image
                                    src={iconMapping[route.type]}
                                    alt={route.type}
                                    width={48}
                                    height={48}
                                    className="object-contain"
                                />
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">{route.number}</h3>
                                    <p className="text-gray-500">{route.details}</p>
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                                {route.stops.length} stops&nbsp;&bull;&nbsp;Fare: Rs {route.fare}
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-600 py-12">No routes found.</div>
            )}

            <Modal
                isOpen={isModalOpen}
                onCloseAction={closeModalAction}
                route={
                    selectedRoute
                        ? { ...selectedRoute, fare: { min: selectedRoute.fare || 0, max: selectedRoute.fare || 0 } }
                        : null
                }
            />
        </div>
    );
}

export default Routes;

