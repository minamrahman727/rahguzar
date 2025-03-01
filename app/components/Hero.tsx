"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="h-screen flex flex-col justify-center items-center text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
    >
      <Image src="/images/route.png" alt="RahGuzar Logo" width={120} height={120} />
      <h1 className="text-5xl font-bold mt-4">Find Your Way Easily</h1>
      <p className="text-lg mt-2">Jahan Manzil, Wahan Raasta!</p>
    </motion.section>
  );
}
