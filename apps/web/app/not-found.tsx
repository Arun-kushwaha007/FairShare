"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MoveLeft, Ghost, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] font-sans text-white">
      {/* Background "Noise" Grid - Very Gen-Z/Brutalist */}
      <div className="absolute inset-0 z-0 opacity-20 [background-image:linear-gradient(#333_1px,transparent_1px),linear-gradient(90deg,#333_1px,transparent_1px)] [background-size:40px_40px]"></div>

      {/* Floating Aesthetic Elements */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0] 
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[10%] hidden md:block"
      >
        <Ghost size={80} className="text-purple-500 opacity-50 blur-sm" />
      </motion.div>

      <div className="z-10 flex flex-col items-center px-6 text-center">
        {/* Main Header with Glitch Effect */}
        <div className="relative">
          <h1 className="text-8xl font-black italic tracking-tighter md:text-[12rem]">
            404
          </h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
            className="absolute inset-0 text-cyan-400 translate-x-1"
          >
            404
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3.1 }}
            className="absolute inset-0 text-pink-500 -translate-x-1"
          >
            404
          </motion.div>
        </div>

        {/* Slang-heavy Copy */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 space-y-2"
        >
          <h2 className="text-2xl font-bold uppercase tracking-widest text-yellow-400 md:text-4xl">
            Vibe Check: Failed.
          </h2>
          <p className="max-w-md text-sm font-medium text-zinc-400 md:text-lg">
            This page is <span className="text-zinc-100 italic">cooked</span>. Either it never existed, or it&apos;s currently touching grass.
          </p>
        </motion.div>

        {/* Interactive "Back" Button - Neo-Brutalist Style */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-12"
        >
          <Link
            href="/"
            className="group relative flex items-center gap-3 border-2 border-white bg-white px-8 py-4 font-black text-black transition-colors hover:bg-transparent hover:text-white"
          >
            <MoveLeft className="transition-transform group-hover:-translate-x-2" />
            GO HOME OR WHATEVER
            {/* Box Shadow "Pop" - Signature Neo-Brutalist look */}
            <div className="absolute -right-2 -bottom-2 -z-10 h-full w-full border-2 border-purple-500 bg-purple-500 transition-transform group-hover:translate-x-1 group-hover:translate-y-1"></div>
          </Link>
        </motion.div>

        {/* Bottom "Status" Bar */}
        <div className="mt-24 flex items-center gap-4 text-xs font-mono uppercase tracking-tighter text-zinc-500">
          <span className="flex items-center gap-1">
            <AlertCircle size={14} /> status: delulu
          </span>
          <span className="h-1 w-1 rounded-full bg-zinc-700"></span>
          <span>loc: unknown_void</span>
          <span className="h-1 w-1 rounded-full bg-zinc-700"></span>
          <span>rizz: 0</span>
        </div>
      </div>
    </main>
  );
}
