"use client";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Route {
    type: string;
    number: string;
    details: string;
    stops: string[];
    fare: { min: number; max: number };
}

interface ModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    route: Route | null;
}

export default function Modal({ isOpen, onCloseAction, route }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onCloseAction();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onCloseAction]);

    // Focus modal when it becomes open
    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus();
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && route && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md z-50 p-4"
                    onClick={onCloseAction}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    aria-describedby="modal-content"
                >
                    <motion.div
                        ref={modalRef}
                        tabIndex={-1}
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="relative bg-white bg-opacity-90 rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl p-8 transform hover:scale-105 transition-transform overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 opacity-30 blur-lg -rotate-6 animate-tilt"></div>

                        {/* Close Button */}
                        <button
                            onClick={onCloseAction}
                            className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 transition rounded-full w-10 h-10 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-blue-400 z-10"
                            aria-label="Close Modal"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="relative z-10">
                            {/* Route Details */}
                            <div id="modal-content" className="text-center mb-6">
                                <h3 id="modal-title" className="text-4xl font-extrabold text-blue-800">
                                    {route.number}
                                </h3>
                                <p className="text-gray-700 text-xl mt-3">{route.details}</p>
                                <p className="text-sm mt-3 text-gray-600 font-medium">
                                    Fare Starts from: Rs {route.fare.min}
                                </p>
                            </div>

                            {/* Stops List */}
                            <h4 className="mt-6 text-2xl font-semibold text-gray-800 text-center">Stops:</h4>
                            <ul className="list-none mt-4 max-h-52 overflow-y-auto space-y-3">
                                {route.stops.map((stop, index) => (
                                    <motion.li
                                        key={index}
                                        whileHover={{ scale: 1.02, backgroundColor: "#eff6ff" }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center space-x-4 bg-gray-100 p-4 rounded-xl shadow-sm cursor-pointer"
                                    >
                                        <span className="bg-blue-600 text-white rounded-full w-9 h-9 flex items-center justify-center text-sm font-semibold">
                                            {index + 1}
                                        </span>
                                        <span className="text-gray-700 font-medium">{stop}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
