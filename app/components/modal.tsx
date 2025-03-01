"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    route: {
        type: string;
        number: string;
        details: string;
        stops: string[];
        fare: { min: number; max: number };
    } | null;
}

export default function Modal({ isOpen, onCloseAction, route }: ModalProps) {
    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onCloseAction();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onCloseAction]);

    return (
        <AnimatePresence>
            {isOpen && route && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-xs z-50 p-4"
                    onClick={onCloseAction}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="relative bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl transform hover:scale-105 transition-all"
                        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
                    >
                        {/* Close Button */}
                        <button
                            onClick={onCloseAction}
                            className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-400 transition rounded-full w-8 h-8 flex items-center justify-center text-gray-700 hover:text-white"
                            aria-label="Close Modal"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Islamic Greeting Header */}
                        <div className="p-4 bg-blue-100 rounded-lg text-center mb-4 shadow-md">
                            <h2 className="text-blue-700 text-xl font-serif">
                            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                            </h2>
                            <h5 className="text-blue-900 text-md">
                            &quot;اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔&quot;
                            </h5>
                           
                        </div>

                        {/* Route Details */}
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-gray-800">{route.number}</h3>
                            <p className="text-gray-600 text-lg mt-2">{route.details}</p>
                            <p className="text-sm mt-2 text-gray-700 font-medium">
                                Fare Range: Rs {route.fare.min} - Rs {route.fare.max}
                            </p>
                        </div>

                        {/* Stops List */}
                        <h4 className="mt-6 text-xl font-semibold text-gray-800">Stops:</h4>
                        <ul className="list-none mt-3 max-h-40 overflow-y-auto space-y-2">
                            {route.stops.map((stop, index) => (
                                <li
                                    key={index}
                                    className="flex items-center space-x-3 bg-gray-100 p-3 rounded-lg shadow-sm"
                                >
                                    <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-semibold">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-800 font-medium">{stop}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
