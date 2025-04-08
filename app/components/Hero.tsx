"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import BubbleAnimation from "./bubbles";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 px-8 md:px-32 overflow-hidden relative"
    >
      {/* Animated Background Bubbles */}
      <BubbleAnimation bubbleCount={7} />

      <motion.div
        className=" transition duration-300 relative z-10 cursor-pointer"
        whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src="/images/route.png"
          alt="RahGuzar Logo"
          width={140}
          height={140}
          className="rounded-full"
        />
      </motion.div>
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md relative z-10 cursor-pointer"
        variants={{
          hidden: { opacity: 0, y: -30 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.05, textShadow: "4px 4px 6px rgba(0,0,0,0.7)" }}
        transition={{ duration: 0.3, type: "spring", stiffness: 120 }}
        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
      >
        Navigate with Ease
      </motion.h1>
      <motion.p
        className="text-xl md:text-2xl mt-4 italic font-medium drop-shadow-sm relative z-10 cursor-pointer"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.03, color: "#a0aec0" }}
        transition={{ duration: 0.3, type: "spring", stiffness: 120 }}
        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
      >
Jahan Manzil, Wahan Raasta!

</motion.p>
      <motion.div
        className="mt-12 relative z-10"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
      >
        <motion.button
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-bold py-3 px-12 rounded-full shadow-md hover:shadow-xl transition duration-300"
          whileHover={{ scale: 1.1, boxShadow: "0 6px 10px rgba(0,0,0,0.4)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}
        >
          Start Exploring
        </motion.button>
      </motion.div>
      <motion.div
        className="mt-6 relative z-10"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
      >
        <motion.a
          href="#"
          className="text-white hover:text-gray-300 transition duration-300 hover:scale-110 inline-flex items-center"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Learn More
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </motion.a>
      </motion.div>
    </motion.section>
  );
}
